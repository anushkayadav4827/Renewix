import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ZodError } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { getItem, queryItems, putItem, TABLE_NAME } from '../lib/dynamoClient';
import { StartDiagnosisRequestSchema, DiagnosticQuestion } from '../lib/schemas';
import {
  ok,
  notFound,
  internalError,
  validationError,
  unauthorized,
} from '../lib/responses';
import { checkProblemTextForDanger } from '../lib/dangerousSymptomCheck';

interface DiagnosticRuleRecord {
  PK: string;
  SK: string;
  deviceId: string;
  ruleId: string;
  symptomLabel: string;
  questions: DiagnosticQuestion[];
  dangerousFlags: string[];
  possibleIssues: string[];
}

interface DeviceRecord {
  PK: string;
  SK: string;
  deviceId: string;
  name: string;
  commonSymptoms: string[];
}

/** Keyword-based symptom matching for problem text → ruleId */
const SYMPTOM_ALIASES: Record<string, string[]> = {
  screen_cracked: ['screen_cracked', 'lines_on_screen', 'touchscreen_frozen', 'screen_issue', 'digitizer_touch_ghosting'],
  lines_on_screen: ['lines_on_screen', 'screen_cracked', 'screen_issue'],
  touchscreen_frozen: ['touchscreen_frozen', 'digitizer_touch_ghosting', 'screen_cracked'],
  battery_drain: ['battery_drain', 'battery_drains_under_day', 'not_holding_charge', 'swollen_battery_casing'],
  not_charging: ['not_charging', 'not_charging_pins_corroded', 'charging_port_damaged', 'case_not_charging'],
  water_damage: ['water_damage', 'water_dripping_leak', 'water_leakage', 'jar_leaking_bottom'],
  camera_not_working: ['camera_not_working', 'lens_error_jammed_extended'],
  buttons_unresponsive: ['buttons_unresponsive', 'remote_unresponsive_pcb'],
  network_issues: ['network_issues', 'wifi_issues', 'no_internet_led_red', 'frequent_disconnects', 'bluetooth_disconnect'],
  one_side_silent: ['one_side_silent', 'no_sound', 'distorted_sound', 'distorted_bass_blown_cone'],
};

function matchSymptomFromText(problemText: string, rules: DiagnosticRuleRecord[]): DiagnosticRuleRecord | null {
  const text = problemText.toLowerCase();

  // Semantic keyword mapping boosts
  const domainKeywords: Record<string, string[]> = {
    screen: ['screen', 'display', 'glass', 'line', 'lines', 'pink', 'green', 'flicker', 'touch', 'crack', 'cracked', 'shatter', 'oled', 'lcd', 'panel', 'ghost'],
    battery: ['battery', 'drain', 'draining', 'heat', 'warm', 'shutoff', 'drops', 'percentage', 'swollen', 'bulge', 'power', 'dying'],
    charging: ['charge', 'charging', 'port', 'usb', 'cable', 'cord', 'loose', 'adapter', 'plug', 'wont charge'],
    water: ['water', 'liquid', 'spill', 'spilled', 'rain', 'moisture', 'dropped in', 'submerged', 'ingress', 'corrosion', 'wet'],
    camera: ['camera', 'lens', 'photo', 'picture', 'blurry', 'focus', 'shutter'],
    audio: ['sound', 'audio', 'speaker', 'mic', 'microphone', 'buzz', 'crackle', 'distort', 'silent', 'volume', 'earphone', 'headphone'],
    network: ['signal', 'cellular', 'sim', 'wifi', 'bluetooth', 'connect', 'disconnect', 'pairing', 'dropout'],
    motor: ['spin', 'spinning', 'drum', 'agitator', 'shake', 'shaking', 'vibrate', 'vibration', 'leak', 'leaking', 'drain', 'draining', 'pump'],
    cooling: ['cool', 'cooling', 'ice', 'frost', 'freezer', 'warm air', 'refrigerant', 'compressor'],
  };

  let bestRule: DiagnosticRuleRecord | null = null;
  let bestScore = -1;

  for (const rule of rules) {
    const labelWords = rule.symptomLabel.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const ruleWords = rule.ruleId.replace(/_/g, ' ').split(/\s+/);
    const allWords = [...new Set([...labelWords, ...ruleWords])];

    let score = 0;
    for (const word of allWords) {
      if (text.includes(word)) score += 2;
    }

    // Check domain boosts
    for (const [, kws] of Object.entries(domainKeywords)) {
      const ruleMatchesDomain = kws.some(kw => rule.ruleId.includes(kw) || rule.symptomLabel.toLowerCase().includes(kw));
      if (ruleMatchesDomain) {
        for (const kw of kws) {
          if (text.includes(kw)) score += 3;
        }
      }
    }

    if (score > bestScore && score > 0) {
      bestScore = score;
      bestRule = rule;
    }
  }

  return bestScore > 0 ? bestRule : null;
}

export const handler: APIGatewayProxyHandlerV2 = async (event: APIGatewayProxyEventV2) => {
  try {
    const userId = (event.requestContext as any).authorizer?.jwt?.claims?.sub;
    if (!userId || typeof userId !== 'string') {
      return unauthorized();
    }

    // 1. Parse and validate input
    let body: unknown;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return validationError('Request body must be valid JSON');
    }

    const parseResult = StartDiagnosisRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return validationError(parseResult.error.issues.map((i) => i.message).join('; '));
    }

    const { deviceId, problemText, symptomId, intakeData } = parseResult.data;

    // 2. Verify device exists
    const device = await getItem<DeviceRecord>({
      TableName: TABLE_NAME,
      Key: { PK: `DEVICE#${deviceId}`, SK: 'METADATA' },
    });

    if (!device) {
      return notFound(`Device '${deviceId}'`);
    }

    // 3. Early danger check on problem text (before DynamoDB rule lookup)
    const dangerCheck = checkProblemTextForDanger(problemText);
    if (dangerCheck.isDangerous) {
      console.warn(`[startDiagnosis] Safety interrupt triggered by problem text. Flag: ${dangerCheck.triggeredBy}`);
      const sessionId = uuidv4();
      const now = new Date().toISOString();
      const ttl = Math.floor(Date.now() / 1000) + 30 * 86400;

      // Still persist the session so history works
      await putItem({
        TableName: TABLE_NAME,
        Item: {
          PK: `USER#${userId}`,
          SK: `SESSION#${sessionId}`,
          sessionId,
          deviceId,
          problemText,
          intakeData,
          answers: {},
          status: 'FAILED',
          result: {
            safetyWarning: true,
            safetyMessage: dangerCheck.safetyMessage,
          },
          createdAt: now,
          ttl,
        },
      });

      return ok({
        sessionId,
        safetyWarning: true,
        safetyMessage: dangerCheck.safetyMessage,
        questions: [],
      });
    }

    // 4. Load all diagnostic rules for this device
    const rules = await queryItems<DiagnosticRuleRecord>({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': `DEVICE#${deviceId}`,
        ':skPrefix': 'RULE#',
      },
    });

    if (rules.length === 0) {
      return notFound(`Diagnostic rules for device '${deviceId}'`);
    }

    // 5. Match symptom → rule
    let matchedRule: DiagnosticRuleRecord | null = null;

    if (symptomId) {
      // Direct lookup — frontend passes the specific symptomId the user tapped
      matchedRule = rules.find((r) => r.ruleId === symptomId) || null;

      // Try aliases if not directly found
      if (!matchedRule) {
        for (const [canonicalRule, aliases] of Object.entries(SYMPTOM_ALIASES)) {
          if (aliases.includes(symptomId)) {
            matchedRule = rules.find((r) => r.ruleId === canonicalRule || aliases.includes(r.ruleId)) || null;
            if (matchedRule) break;
          }
        }
      }
    }

    if (!matchedRule) {
      // Keyword match fallback from free-text description
      matchedRule = matchSymptomFromText(problemText, rules);
    }

    if (!matchedRule) {
      // Fallback: use first rule for the device (avoids dead-end for hackathon demo)
      matchedRule = rules[0];
    }

    // 6. Create DiagnosisSession (status = IN_PROGRESS)
    const sessionId = uuidv4();
    const now = new Date().toISOString();
    const ttl = Math.floor(Date.now() / 1000) + 30 * 86400; // 30-day TTL

    // Remove undefined values to avoid DynamoDB errors
    const sessionItem: any = {
      PK: `USER#${userId}`,
      SK: `SESSION#${sessionId}`,
      sessionId,
      deviceId,
      problemText,
      ruleId: matchedRule.ruleId,
      answers: {},
      status: 'IN_PROGRESS',
      totalQuestionsAsked: matchedRule.questions.length,
      usedFallbackQuestions: false,
      generatedQuestions: [],
      createdAt: now,
      ttl,
    };
    if (intakeData) sessionItem.intakeData = intakeData;

    await putItem({
      TableName: TABLE_NAME,
      Item: sessionItem,
    });

    console.info(
      `[startDiagnosis] Created session ${sessionId} for device=${deviceId}, ruleId=${matchedRule.ruleId}`,
    );

    return ok({
      sessionId,
      safetyWarning: false,
      ruleId: matchedRule.ruleId,
      symptomLabel: matchedRule.symptomLabel,
      questions: matchedRule.questions,
      dangerousFlags: matchedRule.dangerousFlags,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(error.issues.map((i) => i.message).join('; '));
    }
    console.error('[startDiagnosis] Unexpected error:', error);
    return internalError('starting diagnosis');
  }
};
