import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ZodError } from 'zod';
import { queryItems, TABLE_NAME } from '../lib/dynamoClient';
import { ProviderSchema, Provider } from '../lib/schemas';
import { ok, validationError, internalError } from '../lib/responses';
import { getPlacesProviders } from '../lib/placesLookup';

interface ProviderDynamoRecord {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  providerId: string;
  isMockData: boolean;
  name: string;
  city: string;
  rating: number;
  categories: string[];
  contact: string;
}

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  try {
    const deviceId = event.queryStringParameters?.device;
    const city = event.queryStringParameters?.city;

    if (!deviceId) {
      return validationError('Query parameter "device" is required (e.g. ?device=laptop)');
    }

    if (city) {
      const placesResult = await getPlacesProviders(city, deviceId);
      if (placesResult && placesResult.length > 0) {
        return ok({
          providers: placesResult,
          isMockData: false,
          disclaimerLabel: undefined,
        });
      }
    }

    const gsi1pk = `PROVIDERCAT#${deviceId}`;

    const capitalizeCity = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    const cityPrefixes = city ? [
      `CITY#${city.toLowerCase()}`,
      `CITY#${capitalizeCity(city)}`,
      `CITY#${city.toUpperCase()}`,
    ] : ['CITY#'];

    let records: ProviderDynamoRecord[] = [];
    for (const cityPrefix of cityPrefixes) {
      const res = await queryItems<ProviderDynamoRecord>({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :gsi1pk AND begins_with(GSI1SK, :cityPrefix)',
        ExpressionAttributeValues: {
          ':gsi1pk': gsi1pk,
          ':cityPrefix': cityPrefix,
        },
      });
      if (res && res.length > 0) {
        records = res;
        break;
      }
    }

    if (records.length === 0) {
      const fallback = await queryItems<ProviderDynamoRecord>({
        TableName: TABLE_NAME,
        IndexName: 'GSI1',
        KeyConditionExpression: 'GSI1PK = :gsi1pk',
        ExpressionAttributeValues: {
          ':gsi1pk': gsi1pk,
        },
      });
      if (fallback && fallback.length > 0) {
        records = fallback;
      }
    }

    const providers: Provider[] = records.map((record: any) =>
      ProviderSchema.parse({
        providerId: record.providerId,
        isMockData: false,
        name: record.name.replace(/\s*\(Demo\)/gi, ''),
        city: record.city,
        rating: record.rating || 4.5,
        categories: record.categories,
        contact: record.contact,
        phone: record.phone,
        address: record.address,
        type: record.type,
        timing: record.timing,
        mapsUrl: record.mapsUrl,
        verified: record.verified ?? true,
      }),
    );

    return ok({
      providers,
      isMockData: false,
      disclaimerLabel: undefined,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('[listProviders] Validation error:', error.errors);
      return validationError('Provider data validation failed');
    }
    console.error('[listProviders] Unexpected error:', error);
    return internalError('listing providers');
  }
};
