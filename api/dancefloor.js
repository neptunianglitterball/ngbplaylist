/**
 * Global Dancefloor API — live counts per archetype.
 * GET: return all counts. POST: body { archetype: "engineer" } to increment, returns updated counts.
 * Requires Upstash Redis (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN).
 */

const ARCHETYPE_IDS = [
  'modernist',
  'engineer',
  'cosmic',
  'mechanic',
  'dreamer',
  'professional',
  'visionary',
  'minimalist',
  'escapist',
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function setCors(res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
}

function json(res, data, status = 200) {
  res.status(status).setHeader('Content-Type', 'application/json');
  setCors(res);
  return res.end(JSON.stringify(data));
}

function defaultCounts() {
  return Object.fromEntries(ARCHETYPE_IDS.map((id) => [id, 0]));
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    setCors(res);
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return json(res, { error: 'Method not allowed' }, 405);
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : req.body || {};

  if (!url || !token) {
    const counts = defaultCounts();
    if (req.method === 'POST' && body.archetype && ARCHETYPE_IDS.includes(body.archetype)) {
      counts[body.archetype] = (counts[body.archetype] || 0) + 1;
    }
    return json(res, { counts });
  }

  const { Redis } = await import('@upstash/redis');
  const redis = new Redis({ url, token });
  const key = 'dancefloor';

  if (req.method === 'GET') {
    try {
      const raw = await redis.hgetall(key);
      const counts = defaultCounts();
      if (raw && typeof raw === 'object') {
        ARCHETYPE_IDS.forEach((id) => {
          const v = raw[id];
          counts[id] = typeof v === 'string' ? parseInt(v, 10) : typeof v === 'number' ? v : 0;
          if (Number.isNaN(counts[id])) counts[id] = 0;
        });
      }
      return json(res, { counts });
    } catch (e) {
      console.error('dancefloor GET', e);
      return json(res, { counts: defaultCounts() });
    }
  }

  // POST: increment one archetype
  const archetype = body.archetype && ARCHETYPE_IDS.includes(body.archetype) ? body.archetype : null;
  if (!archetype) {
    return json(res, { error: 'Missing or invalid body.archetype' }, 400);
  }
  try {
    await redis.hincrby(key, archetype, 1);
    const raw = await redis.hgetall(key);
    const counts = defaultCounts();
    if (raw && typeof raw === 'object') {
      ARCHETYPE_IDS.forEach((id) => {
        const v = raw[id];
        counts[id] = typeof v === 'string' ? parseInt(v, 10) : typeof v === 'number' ? v : 0;
        if (Number.isNaN(counts[id])) counts[id] = 0;
      });
    }
    return json(res, { counts });
  } catch (e) {
    console.error('dancefloor POST', e);
    return json(res, { counts: defaultCounts() });
  }
}
