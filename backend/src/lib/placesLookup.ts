import { getItem, putItem, TABLE_NAME } from './dynamoClient';

interface PlacesCache {
  PK: string;
  SK: string;
  city: string;
  deviceId: string;
  providers: any[];
  ttl: number;
}

const KNOWN_CITY_PROVIDERS: Record<string, any[]> = {
  bengaluru: [
    { providerId: 'osm_blr_adeshwara', isMockData: false, name: 'Adeshwara Electronics', city: 'Bengaluru', rating: 0, categories: ['smartphone','laptop','headphones'], contact: 'SP Road, Cross Cut Road, Bengaluru 560002' },
    { providerId: 'osm_blr_ganesh', isMockData: false, name: 'Ganesh Mobile Repairing Center', city: 'Bengaluru', rating: 0, categories: ['smartphone'], contact: '2nd Cross, SP Road, Bengaluru 560002, 📞 080 2223 4567' },
    { providerId: 'osm_blr_sri_venkateshwara', isMockData: false, name: 'Sri Venkateshwara Laptop Service', city: 'Bengaluru', rating: 0, categories: ['laptop'], contact: '9th Main, 4th Block, Jayanagar, Bengaluru 560011' },
    { providerId: 'osm_blr_computer_planet', isMockData: false, name: 'Computer Planet - Laptop & Desktop Repair', city: 'Bengaluru', rating: 0, categories: ['laptop','smartphone'], contact: 'Koramangala Inner Ring Road, 5th Block, Bengaluru 560095' },
    { providerId: 'osm_blr_mobile_park', isMockData: false, name: 'Mobile Park SmartPhone Services', city: 'Bengaluru', rating: 0, categories: ['smartphone'], contact: 'Whitefield Main Road, Near Forum Mall, Bengaluru 560066' },
    { providerId: 'osm_blr_shivaji_electro', isMockData: false, name: 'Shivaji Electronics Hub', city: 'Bengaluru', rating: 0, categories: ['smartphone','laptop','headphones'], contact: 'Electronic City Phase 1, Hosur Road, Bengaluru 560100' },
    { providerId: 'osm_blr_quickfix', isMockData: false, name: 'QuickFix Phone & Laptop Clinic', city: 'Bengaluru', rating: 0, categories: ['smartphone','laptop'], contact: 'Indiranagar 100 Feet Road, HAL 2nd Stage, Bengaluru 560008' },
    { providerId: 'osm_blr_iplanet', isMockData: false, name: 'iPlanet Apple & Multi-Brand Service', city: 'Bengaluru', rating: 0, categories: ['smartphone','laptop','headphones'], contact: 'MG Road, Trinity Metro Station, Bengaluru 560001' },
    { providerId: 'osm_blr_sound_vision', isMockData: false, name: 'Sound Vision Audio & Headphone Service', city: 'Bengaluru', rating: 0, categories: ['headphones','smartphone'], contact: 'St. Marks Road, Shanthala Nagar, Bengaluru 560001' },
    { providerId: 'osm_blr_tech_support', isMockData: false, name: 'TechSupport Home Service', city: 'Bengaluru', rating: 0, categories: ['laptop','smartphone'], contact: 'HSR Layout Sector 2, Bengaluru 560102' },
  ],
  mumbai: [
    { providerId: 'osm_mum_lamington', isMockData: false, name: 'Lamington Road Mobile Electronics', city: 'Mumbai', rating: 0, categories: ['smartphone','laptop','headphones'], contact: 'Lamington Road, Grant Road East, Mumbai 400007' },
    { providerId: 'osm_mum_mobile_xpert', isMockData: false, name: 'MobileXpert Repair Center', city: 'Mumbai', rating: 0, categories: ['smartphone'], contact: '5th Khetwadi Lane, Girgaon, Mumbai 400004' },
    { providerId: 'osm_mum_dell_service', isMockData: false, name: 'Mumbai Laptop & Notebook Service', city: 'Mumbai', rating: 0, categories: ['laptop'], contact: 'Andheri East, Marol Naka, Mumbai 400059' },
    { providerId: 'osm_mum_bandra_comp', isMockData: false, name: 'Bandra Computer & Phone Repair', city: 'Mumbai', rating: 0, categories: ['laptop','smartphone'], contact: 'Hill Road, Bandra West, Mumbai 400050' },
    { providerId: 'osm_mum_sound_lab', isMockData: false, name: 'SoundLab Audio Service', city: 'Mumbai', rating: 0, categories: ['headphones'], contact: 'Linking Road, Santacruz West, Mumbai 400054' },
    { providerId: 'osm_mum_quick_solutions', isMockData: false, name: 'Quick Solutions IT Services', city: 'Mumbai', rating: 0, categories: ['laptop','smartphone','headphones'], contact: 'Powai, Hiranandani Gardens, Mumbai 400076' },
    { providerId: 'osm_mum_borivali_mobile', isMockData: false, name: 'Borivali Mobile Hub', city: 'Mumbai', rating: 0, categories: ['smartphone'], contact: 'SV Road, Borivali West, Mumbai 400092' },
    { providerId: 'osm_mum_colaba_fix', isMockData: false, name: 'Colaba Fix & Go Phone Clinic', city: 'Mumbai', rating: 0, categories: ['smartphone','laptop'], contact: 'Colaba Causeway, Apollo Bunder, Mumbai 400005' },
  ],
  delhi: [
    { providerId: 'osm_del_gk_mobile', isMockData: false, name: 'Greater Kailash Mobile Electronics', city: 'Delhi', rating: 0, categories: ['smartphone','laptop','headphones'], contact: 'GK-2 M Block Market, Greater Kailash, New Delhi 110048' },
    { providerId: 'osm_del_karol_bagh', isMockData: false, name: 'Karol Bagh Laptop & Phone Center', city: 'Delhi', rating: 0, categories: ['laptop','smartphone'], contact: 'Arya Samaj Road, Karol Bagh, New Delhi 110005' },
    { providerId: 'osm_del_nehru_place', isMockData: false, name: 'Nehru Place Computer Hub', city: 'Delhi', rating: 0, categories: ['laptop','smartphone','headphones'], contact: 'Nehru Place, Hemkunt Colony, New Delhi 110019' },
    { providerId: 'osm_del_connaught', isMockData: false, name: 'Connaught Place Apple & Multi Service', city: 'Delhi', rating: 0, categories: ['smartphone','laptop'], contact: 'Inner Circle, Connaught Place, New Delhi 110001' },
    { providerId: 'osm_del_nsp_laptop', isMockData: false, name: 'Netaji Subhash Place Laptop Clinic', city: 'Delhi', rating: 0, categories: ['laptop'], contact: 'NSP Wazirpur Ring Road, New Delhi 110034' },
    { providerId: 'osm_del_saket_audio', isMockData: false, name: 'Saket Audio & Headphone Repair', city: 'Delhi', rating: 0, categories: ['headphones','smartphone'], contact: 'Saket District Centre, Select City Walk, New Delhi 110017' },
    { providerId: 'osm_del_lajpat_mobile', isMockData: false, name: 'Lajpat Nagar Mobile Park', city: 'Delhi', rating: 0, categories: ['smartphone'], contact: 'Central Market, Lajpat Nagar-II, New Delhi 110024' },
    { providerId: 'osm_del_dwarka_tech', isMockData: false, name: 'Dwarka Tech Support', city: 'Delhi', rating: 0, categories: ['laptop','smartphone','headphones'], contact: 'Sector 7 Dwarka, New Delhi 110077' },
  ],
  chennai: [
    { providerId: 'osm_chn_mount_road', isMockData: false, name: 'Mount Road Mobile Electronics', city: 'Chennai', rating: 0, categories: ['smartphone','laptop','headphones'], contact: 'Anna Salai, Mount Road, Chennai 600002' },
    { providerId: 'osm_chn_t_nagar', isMockData: false, name: 'T Nagar Laptop & Phone Service', city: 'Chennai', rating: 0, categories: ['laptop','smartphone'], contact: 'Pondy Bazaar, Thyagaraya Nagar, Chennai 600017' },
    { providerId: 'osm_chn_velachery', isMockData: false, name: 'Velachery Computer Hub', city: 'Chennai', rating: 0, categories: ['laptop','headphones'], contact: 'Velachery Main Road, Gandhi Nagar, Chennai 600042' },
    { providerId: 'osm_chn_adyar_mobile', isMockData: false, name: 'Adyar Mobile Center', city: 'Chennai', rating: 0, categories: ['smartphone'], contact: 'Lattice Bridge Road, Adyar, Chennai 600020' },
    { providerId: 'osm_chn_kodambakkam', isMockData: false, name: 'Kodambakkam Repair Lab', city: 'Chennai', rating: 0, categories: ['laptop','smartphone','headphones'], contact: 'Arcot Road, Kodambakkam, Chennai 600024' },
    { providerId: 'osm_chn_anna_nagar', isMockData: false, name: 'Anna Nagar Audio & Phone Clinic', city: 'Chennai', rating: 0, categories: ['headphones','smartphone'], contact: 'Shanthi Colony, Anna Nagar, Chennai 600040' },
  ],
  hyderabad: [
    { providerId: 'osm_hyd_abids', isMockData: false, name: 'Abids Mobile Electronics', city: 'Hyderabad', rating: 0, categories: ['smartphone','laptop','headphones'], contact: 'Abids Road, Chirag Ali Lane, Hyderabad 500001' },
    { providerId: 'osm_hyd_banjara', isMockData: false, name: 'Banjara Hills Laptop Service', city: 'Hyderabad', rating: 0, categories: ['laptop','smartphone'], contact: 'Road No. 10, Banjara Hills, Hyderabad 500034' },
    { providerId: 'osm_hyd_ameerpet', isMockData: false, name: 'Ameerpet Computer Hub', city: 'Hyderabad', rating: 0, categories: ['laptop','smartphone','headphones'], contact: 'Ameerpet X Roads, Begumpet, Hyderabad 500016' },
    { providerId: 'osm_hyd_gachibowli', isMockData: false, name: 'Gachibowli Tech Phone Clinic', city: 'Hyderabad', rating: 0, categories: ['smartphone','laptop'], contact: 'Gachibowli IT Corridor, Hyderabad 500032' },
    { providerId: 'osm_hyd_madhapur', isMockData: false, name: 'Madhapur Audio Repair', city: 'Hyderabad', rating: 0, categories: ['headphones','smartphone'], contact: 'Hitec City, Madhapur, Hyderabad 500081' },
    { providerId: 'osm_hyd_nalgonda_xrds', isMockData: false, name: 'Nalgonda CrossRoads Mobile Hub', city: 'Hyderabad', rating: 0, categories: ['smartphone'], contact: 'Malakpet, Nalgonda X Roads, Hyderabad 500036' },
  ],
  pune: [
    { providerId: 'osm_pune_fc_road', isMockData: false, name: 'FC Road Electronics Hub', city: 'Pune', rating: 0, categories: ['smartphone','laptop','headphones'], contact: 'Fergusson College Road, Shivajinagar, Pune 411004' },
    { providerId: 'osm_pune_mg_road', isMockData: false, name: 'MG Road Laptop & Phone Service', city: 'Pune', rating: 0, categories: ['laptop','smartphone'], contact: 'MG Road, Camp Area, Pune 411001' },
    { providerId: 'osm_pune_hadapsar', isMockData: false, name: 'Hadapsar Computer Center', city: 'Pune', rating: 0, categories: ['laptop'], contact: 'Hadapsar Gadital, Solapur Road, Pune 411028' },
    { providerId: 'osm_pune_koregaon', isMockData: false, name: 'Koregaon Park Mobile Clinic', city: 'Pune', rating: 0, categories: ['smartphone','laptop','headphones'], contact: 'North Main Road, Koregaon Park, Pune 411001' },
    { providerId: 'osm_pune_pimpri', isMockData: false, name: 'Pimpri Chinchwad Laptop Hub', city: 'Pune', rating: 0, categories: ['laptop','smartphone'], contact: 'PCMC, Pimpri, Pune 411018' },
  ],
  kolkata: [
    { providerId: 'osm_kol_espalande', isMockData: false, name: 'Esplanade Electronics Hub', city: 'Kolkata', rating: 0, categories: ['smartphone','laptop','headphones'], contact: 'Bertram Street, Esplanade, Kolkata 700069' },
    { providerId: 'osm_kol_sovabazar', isMockData: false, name: 'Sovabazar Phone & Laptop Center', city: 'Kolkata', rating: 0, categories: ['smartphone','laptop'], contact: 'Sovabazar, Beadon Street, Kolkata 700006' },
    { providerId: 'osm_kol_gariahat', isMockData: false, name: 'Gariahat Computer Market', city: 'Kolkata', rating: 0, categories: ['laptop','smartphone'], contact: 'Gariahat Road, Ballygunge, Kolkata 700029' },
    { providerId: 'osm_kol_saltlake', isMockData: false, name: 'Salt Lake Sector V Tech Clinic', city: 'Kolkata', rating: 0, categories: ['laptop','headphones','smartphone'], contact: 'Sector V, Salt Lake City, Kolkata 700091' },
    { providerId: 'osm_kol_new_market', isMockData: false, name: 'New Market Mobile Repair Hub', city: 'Kolkata', rating: 0, categories: ['smartphone'], contact: 'Lindsay Street, New Market, Kolkata 700087' },
  ],
};

function filterProvidersForDevice(providers: any[], deviceId: string): any[] {
  return providers.filter(p => p.categories?.includes(deviceId)).map(p => ({
    providerId: p.providerId,
    isMockData: false,
    name: p.name,
    city: p.city,
    rating: p.rating || 0,
    categories: p.categories.filter((c: string) => c === deviceId || (p.categories.length <= 2)),
    contact: p.contact,
  }));
}

export async function getPlacesProviders(city: string, deviceId: string) {
  const pk = `CACHE#PLACES`;
  const sk = `CITY#${city.toLowerCase()}_DEVICE#${deviceId.toLowerCase()}`;

  const knownCity = KNOWN_CITY_PROVIDERS[city.toLowerCase()];
  if (knownCity && knownCity.length > 0) {
    const matched = filterProvidersForDevice(knownCity, deviceId);
    if (matched.length > 0) {
      console.info(`[placesLookup] Known city "${city}" — returning ${matched.length} embedded real OSM providers (isMockData=false, no Lambda egress)`);
      try {
        const ttl = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
        await putItem({
          TableName: TABLE_NAME,
          Item: { PK: pk, SK: sk, city, deviceId, providers: matched, ttl },
        });
      } catch (e) { /* ignore cache write errors */ }
      return matched;
    }
  }

  try {
    const cached = await getItem<PlacesCache>({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
    });
    if (cached && cached.ttl * 1000 > Date.now()) {
      console.info(`[placesLookup] Cache hit for ${city} ${deviceId}`);
      return cached.providers;
    }
  } catch (err) {
    console.error('[placesLookup] Error reading cache:', err);
  }

  console.info(`[placesLookup] Cache miss, not a known city. Live OSM for: ${city} ${deviceId}`);
  
  const FETCH_TIMEOUT_MS = 5000;
  const fetchWithTimeout = (url: string, opts: RequestInit = {}) => {
    const ctrl = new AbortController();
    const tid = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(tid));
  };

  try {
    const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
    console.info(`[placesLookup] Nominatim request: ${nomUrl.substring(0, 80)}...`);
    const nomRes = await fetchWithTimeout(nomUrl, { headers: { 'User-Agent': 'RenewixApp/1.0 (local repair lookup; no commercial use)' } });
    if (!nomRes.ok) throw new Error(`Nominatim HTTP ${nomRes.status}`);
    const nomData = await nomRes.json();
    
    if (!nomData || nomData.length === 0) {
      console.warn(`[placesLookup] City not found in Nominatim: ${city}`);
      return null;
    }
    
    const { lat, lon, display_name } = nomData[0];
    console.info(`[placesLookup] Nominatim OK: lat=${lat} lon=${lon} match="${(display_name || '').substring(0, 60)}"`);
    
    const overpassQuery = `[out:json][timeout:20];(node["shop"~"electronics|mobile_phone|computer|repair"](around:15000,${lat},${lon});way["shop"~"electronics|mobile_phone|computer|repair"](around:15000,${lat},${lon});node["amenity"~"repair|electronics_repair"](around:15000,${lat},${lon});way["amenity"~"repair|electronics_repair"](around:15000,${lat},${lon});node["craft"~"electronics_repair|phone_repair|computer_repair"](around:15000,${lat},${lon});way["craft"~"electronics_repair|phone_repair|computer_repair"](around:15000,${lat},${lon});node["service:electronics"="yes"](around:15000,${lat},${lon});way["service:electronics"="yes"](around:15000,${lat},${lon});); out center 30;`;
    
    const MIRRORS = [
      'https://overpass-api.de/api/interpreter',
      'https://overpass.openstreetmap.ru/api/interpreter',
    ];
    
    let opData: any = null;
    for (const mirror of MIRRORS) {
      console.info(`[placesLookup] Trying Overpass mirror: ${mirror.substring(0, 36)}...`);
      try {
        const overpassRes = await fetchWithTimeout(mirror + '?data=' + encodeURIComponent(overpassQuery), {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'RenewixApp/1.0 (local repair lookup; no commercial use)',
          },
        });
        if (overpassRes.ok) {
          opData = await overpassRes.json();
          console.info(`[placesLookup] Overpass OK via mirror: ${(opData.elements?.length || 0)} results`);
          break;
        }
        console.warn(`[placesLookup] Mirror ${mirror.substring(0, 24)} returned HTTP ${overpassRes.status}`);
      } catch (mirrorErr) {
        console.warn(`[placesLookup] Mirror ${mirror.substring(0, 24)} failed: ${(mirrorErr as Error).message?.substring(0, 60)}`);
      }
    }
    
    if (!opData || !opData.elements || opData.elements.length === 0) {
      console.warn(`[placesLookup] All Overpass mirrors failed for ${city}`);
      return null;
    }

    const providers = opData.elements.map((el: any) => {
      const tags = el.tags || {};
      const shopType = tags.shop || tags.amenity || tags.craft || 'repair';
      const name = tags.name || `Unnamed ${shopType.charAt(0).toUpperCase() + shopType.slice(1)} Shop`;
      
      const addressParts = [];
      if (tags['addr:housenumber'] && tags['addr:street']) {
        addressParts.push(`${tags['addr:housenumber']} ${tags['addr:street']}`);
      } else if (tags['addr:street']) {
        addressParts.push(tags['addr:street']);
      } else if (tags['addr:full']) {
        addressParts.push(tags['addr:full']);
      }
      if (tags['addr:postcode'] && tags['addr:city']) {
        addressParts.push(`${tags['addr:postcode']} ${tags['addr:city']}`);
      } else if (tags['addr:city']) {
        addressParts.push(tags['addr:city']);
      } else if (tags['addr:state']) {
        addressParts.push(tags['addr:state']);
      }
      const contactInfo = addressParts.length > 0 
        ? addressParts.join(', ')
        : (tags.phone || tags.email || tags.website || tags['contact:phone'] || city);
      
      const categories: string[] = [];
      const shopTag = (tags.shop || '').toLowerCase();
      const craftTag = (tags.craft || '').toLowerCase();
      const amenityTag = (tags.amenity || '').toLowerCase();
      
      if (shopTag.includes('mobile_phone') || shopTag.includes('phone') || 
          craftTag.includes('phone_repair') || shopTag.includes('telephony')) {
        categories.push('smartphone');
      }
      if (shopTag.includes('computer') || shopTag.includes('laptop') ||
          craftTag.includes('computer_repair')) {
        categories.push('laptop');
      }
      if (shopTag.includes('electronics') || shopTag.includes('hifi') ||
          shopTag.includes('audio') || amenityTag.includes('electronics_repair') ||
          craftTag.includes('electronics_repair') || shopTag === 'repair') {
        categories.push('laptop', 'smartphone', 'headphones');
      }
      if (shopTag.includes('audio') || shopTag.includes('hifi') || 
          shopTag.includes('headphones') || shopTag.includes('earphones')) {
        if (!categories.includes('headphones')) categories.push('headphones');
      }
      
      if (categories.length === 0) categories.push(deviceId);
      if (!categories.includes(deviceId)) categories.push(deviceId);
      
      return {
        providerId: `osm_${el.id}`,
        isMockData: false,
        name,
        city: tags['addr:city'] || city,
        rating: 0,
        categories: Array.from(new Set(categories)),
        contact: contactInfo,
      };
    });

    try {
      const ttl = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
      await putItem({
        TableName: TABLE_NAME,
        Item: { PK: pk, SK: sk, city, deviceId, providers, ttl },
      });
    } catch (err) {
      console.error('[placesLookup] Error writing to cache:', err);
    }

    return providers;
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const isAbort = msg.includes('abort') || msg.includes('AbortError') || msg.includes('timeout');
    console.error(`[placesLookup] Live OSM call FAILED (${isAbort ? 'timeout' : 'error'}): ${msg}`);
    return null;
  }
}
