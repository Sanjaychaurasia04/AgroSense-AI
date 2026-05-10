// src/api/api.js
const BACKEND = "http://localhost:8000";
const OWM_KEY = import.meta.env?.VITE_OPENWEATHER_API_KEY;
const OWM_BASE = "https://api.openweathermap.org/data/2.5";

// ── Is input a 6-digit Indian PIN code? ──────────────────────
const isPinCode = (input) => /^\d{6}$/.test(input.trim());

// ── Map OWM icon codes → Icon component names ────────────────
const mapIcon = (icon = '') => {
  if (icon.startsWith('01')) return 'sun';
  if (icon.startsWith('09') || icon.startsWith('10') || icon.startsWith('11')) return 'rain';
  return 'cloud';
};

// ── Farming advice for forecast ───────────────────────────────
const forecastAdvice = (temp, rainPct) => {
  if (rainPct > 70) return 'Avoid spraying. Check field drainage.';
  if (rainPct > 40) return 'Light rain likely. Hold off irrigation.';
  if (temp > 35)    return 'Heat stress risk. Irrigate in early morning.';
  if (temp < 15)    return 'Cool day. Good for leafy vegetables.';
  return 'Good conditions for fieldwork.';
};

// ── Build forecast from OWM 5-day/3hr list ───────────────────
const buildForecast = (list = []) => {
  const seen   = new Set();
  const result = [];
  for (const item of list) {
    const date = new Date(item.dt * 1000);
    const day  = date.toLocaleDateString('en-IN', { weekday: 'short' });
    const hour = date.getHours();
    if (!seen.has(day) && hour >= 11 && hour <= 14) {
      seen.add(day);
      const rain = Math.round((item.pop || 0) * 100);
      result.push({
        day,
        icon:   mapIcon(item.weather?.[0]?.icon),
        temp:   Math.round(item.main.temp),
        rain,
        advice: forecastAdvice(item.main.temp, rain),
      });
    }
    if (result.length === 4) break;
  }
  return result;
};

// ── Core OWM fetcher — handles BOTH city name and PIN code ────
const fetchOWM = async (input) => {
  const pin   = isPinCode(input);
  const query = pin
    ? `zip=${input.trim()},IN`
    : `q=${encodeURIComponent(input.trim())}`;

  const [curRes, fRes] = await Promise.all([
    fetch(`${OWM_BASE}/weather?${query}&appid=${OWM_KEY}&units=metric`),
    fetch(`${OWM_BASE}/forecast?${query}&appid=${OWM_KEY}&units=metric`),
  ]);

  if (!curRes.ok) {
    if (curRes.status === 404) throw new Error(
      pin
        ? `PIN code "${input}" not found. Please check the PIN or enter city name.`
        : `City "${input}" not found. Check spelling or try a nearby city.`
    );
    if (curRes.status === 401) throw new Error('Invalid API key. Please check configuration.');
    throw new Error(`Weather fetch failed (${curRes.status}). Please try again.`);
  }

  const cur   = await curRes.json();
  const fData = await fRes.json();

  return {
    city:      `${cur.name}, ${cur.sys?.country || 'IN'}`,
    temp:      Math.round(cur.main.temp),
    feels:     Math.round(cur.main.feels_like),
    humidity:  cur.main.humidity,
    wind:      Math.round((cur.wind?.speed || 0) * 3.6),
    condition: cur.weather?.[0]?.description || 'Clear',
    icon:      mapIcon(cur.weather?.[0]?.icon),
    forecast:  buildForecast(fData.list || []),
  };
};

// ── Main export ───────────────────────────────────────────────
export const getRealWeather = async (input) => {
  try {
    const res = await fetch(
      `${BACKEND}/weather?location=${encodeURIComponent(input.trim())}`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (data?.temp != null) return data;
    }
  } catch {
    console.warn('Backend unavailable, using OpenWeatherMap directly.');
  }
  return fetchOWM(input);
};

// ── GPS → city name (for "Use My Location") ──────────────────
export const getWeatherByCoords = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OWM_KEY}`
    );
    if (res.ok) {
      const json = await res.json();
      if (json?.[0]?.name) return json[0].name;
    }
  } catch { /* ignore */ }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      return addr.city || addr.town || addr.village || addr.state;
    }
  } catch { /* ignore */ }

  throw new Error('Could not detect your city. Please enter manually.');
};

// ── Other backend endpoints ───────────────────────────────────
export const predictDisease = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${BACKEND}/predict`, { method: 'POST', body: fd });
  return res.json();
};

export const sendChatMessage = async (message) => {
  const res = await fetch(`${BACKEND}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  return res.json();
};

// ── Static demo/fallback data ─────────────────────────────────
export const demoWeather = {
  city: "Pune, IN", temp: 28, feels: 31, humidity: 72, wind: 14,
  condition: "Partly Cloudy", icon: "cloud",
  forecast: [
    { day: "Mon", icon: "rain",  temp: 24, rain: 80, advice: "Delay spraying. Heavy rain expected."   },
    { day: "Tue", icon: "cloud", temp: 27, rain: 30, advice: "Good for light irrigation."             },
    { day: "Wed", icon: "sun",   temp: 32, rain: 5,  advice: "Ideal for harvesting."                  },
    { day: "Thu", icon: "cloud", temp: 26, rain: 45, advice: "Moderate wind. Secure shade nets."      },
  ],
};

export const demoChatResponses = {
  blight:     "Late Blight is caused by Phytophthora infestans. Apply Mancozeb 75% WP @ 2g/L. Remove infected parts.",
  fertilizer: "For Rice: NPK 120-60-60 kg/ha. Split nitrogen into 3 doses.",
  weather:    "Humidity > 80% for consecutive days = high fungal disease risk. Consider prophylactic spray.",
  default:    "Contact your local KVK or call KISAN helpline: 1800-180-1551 (free).",
};

export const demoDiseaseResult = {
  disease: "Late Blight", confidence: 0.91, severity: "High",
  solution: "Apply copper-based fungicide. Remove infected leaves. Avoid overhead watering.",
};


// ─────────────────────────────────────────────────────────────
// Mandi Prices  (AGMARKNET via data.gov.in)
// ─────────────────────────────────────────────────────────────

const DATAGOV_KEY = import.meta.env?.VITE_DATAGOV_API_KEY;

// Routed through Vite proxy in vite.config.js:
//   '/api/mandi'  →  'https://api.data.gov.in/resource/9ef84268-...'
// Can also call direct (no CORS issue confirmed by debug test 6).
const DATAGOV_BASE =
  'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

// ─────────────────────────────────────────────────────────────
// KEY FINDING FROM DEBUG:
//   filters[Arrival_Date]=DD/MM/YYYY  →  always returns 0 records
//   No date filter                    →  returns 8068 live records ✅
//
// The API does not support date filtering via query params.
// We fetch all records and let the UI filter by commodity/state.
// The arrival_date field in each record tells us how fresh the data is.
// ─────────────────────────────────────────────────────────────

export const getMandiPrices = async (state = '', commodity = '') => {
  if (!DATAGOV_KEY) {
    throw new Error('VITE_DATAGOV_API_KEY is not set in your .env file.');
  }

  const params = new URLSearchParams({
    'api-key': DATAGOV_KEY,
    format:    'json',
    limit:     '100',
    offset:    '0',
  });

  // State filter — uses .keyword suffix for Elasticsearch exact-match
  if (state && state !== 'All States') {
    params.set('filters[state.keyword]', state);
  }

  // Commodity filter — lowercase field name
  if (commodity) {
    params.set('filters[commodity]', commodity);
  }

  const url = `${DATAGOV_BASE}?${params.toString()}`;
  console.log('[Mandi] fetching:', url);

  const res = await fetch(url, { signal: AbortSignal.timeout(15000) });

  if (res.status === 401 || res.status === 403) {
    throw new Error(`API auth error (${res.status}). Check VITE_DATAGOV_API_KEY in .env`);
  }
  if (!res.ok) {
    throw new Error(`API error (${res.status}). Please try again.`);
  }

  const data = await res.json();

  if (!data.records?.length) {
    throw new Error('No mandi data found. Try a different state or crop.');
  }

  // Normalise field values
  const normalised = data.records.map(r => ({
    commodity:    r.commodity    || '',
    market:       r.market       || '',
    state:        r.state        || '',
    district:     r.district     || '',
    variety:      r.variety      || '',
    min_price:    String(r.min_price   ?? '0'),
    max_price:    String(r.max_price   ?? '0'),
    modal_price:  String(r.modal_price ?? '0'),
    arrival_date: r.arrival_date || '',
  }));

  // Deduplicate: one entry per commodity+market (highest modal price wins)
  const seen = new Map();
  for (const r of normalised) {
    const key      = `${r.commodity}||${r.market}`;
    const existing = seen.get(key);
    if (!existing || Number(r.modal_price) > Number(existing.modal_price)) {
      seen.set(key, r);
    }
  }

  const deduped = Array.from(seen.values());

  // Derive the data date from the records themselves (most common arrival_date)
  const dateCounts = {};
  for (const r of deduped) {
    if (r.arrival_date) dateCounts[r.arrival_date] = (dateCounts[r.arrival_date] || 0) + 1;
  }
  const dataDate = Object.keys(dateCounts).sort((a, b) => dateCounts[b] - dateCounts[a])[0] || null;

  return { records: deduped, total: deduped.length, date: dataDate };
};