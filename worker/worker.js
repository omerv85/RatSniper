// Rat Sniper counter: a Cloudflare Worker with a D1 database bound as DB.
//   POST /add     body {"rats":12,"nights":1,...}  adds to the all-time and today's totals (only the names below)
//   GET  /totals  {"players":…, "rats":…, …}      all-time totals, for the start screen (cached 60 s)
//   GET  /stats   a plain page with all-time totals and the last 30 days, for the owner
// Nothing about the player is stored: only numbers are added up.

// what the game may send, and the most one message may add (keeps casual cheating in check)
const ALLOWED = {
  players: 1,          // first game on a device
  games: 1,            // a game started
  rats: 300,           // rats killed (sent per night)
  nights: 1,           // a night cleared
  grenades: 50,        // grenades bought
  shares: 1,           // shared on WhatsApp
  installs: 1,         // added to the home screen
  homeOpens: 1,        // opened from the home-screen icon
  updates: 1,          // tapped "update"
};
const GAME_ORIGIN = 'https://ratsniper.o-vertman.workers.dev';   // where the game is hosted (Cloudflare, since v0.0.25)
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const json = (obj, extra = {}) => new Response(JSON.stringify(obj), { headers: { 'Content-Type': 'application/json', ...cors, ...extra } });

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

    if (req.method === 'POST' && url.pathname === '/add') {
      // only accept messages from the game's page (a browser always sends Origin on these requests)
      const origin = req.headers.get('Origin') || '';
      if (origin !== GAME_ORIGIN && !origin.startsWith('http://localhost')) return new Response('forbidden', { status: 403, headers: cors });
      let body;
      try { body = JSON.parse(await req.text()); } catch (e) { return new Response('bad json', { status: 400, headers: cors }); }
      const day = new Date().toISOString().slice(0, 10);
      const stmts = [];
      for (const [k, max] of Object.entries(ALLOWED)) {
        const n = Math.floor(Number(body[k]));
        if (!(n > 0)) continue;
        const add = Math.min(n, max);
        for (const name of [k, `${k}:${day}`]) {
          stmts.push(env.DB.prepare('INSERT INTO counters (name, value) VALUES (?1, ?2) ON CONFLICT(name) DO UPDATE SET value = value + ?2').bind(name, add));
        }
      }
      if (stmts.length) await env.DB.batch(stmts);
      return new Response(null, { status: 204, headers: cors });
    }

    if (req.method === 'GET' && url.pathname === '/totals') {
      // a small edge cache so a burst of players opening the game doesn't hit the database every time
      const cache = caches.default, key = new Request(url.origin + '/totals');
      const hit = await cache.match(key);
      if (hit) return hit;
      const { results } = await env.DB.prepare(`SELECT name, value FROM counters WHERE name NOT LIKE '%:%'`).all();
      const out = {}; for (const k of Object.keys(ALLOWED)) out[k] = 0;
      for (const r of results) out[r.name] = r.value;
      const res = json(out, { 'Cache-Control': 'public, max-age=60' });
      ctx.waitUntil(cache.put(key, res.clone()));
      return res;
    }

    if (req.method === 'GET' && url.pathname === '/stats') {
      const { results } = await env.DB.prepare('SELECT name, value FROM counters').all();
      const total = {}, days = {};
      for (const r of results) {
        const [k, d] = r.name.split(':');
        if (d) (days[d] ||= {})[k] = r.value; else total[k] = r.value;
      }
      const keys = Object.keys(ALLOWED);
      const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
      const row = (label, o) => `<tr><th>${esc(label)}</th>${keys.map(k => `<td>${(o[k] || 0).toLocaleString('en')}</td>`).join('')}</tr>`;
      const dayRows = Object.keys(days).sort().reverse().slice(0, 30).map(d => row(d, days[d])).join('');
      const html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rat Sniper stats</title>
<style>body{font:15px system-ui,sans-serif;margin:16px;background:#0b0e0d;color:#e4e9e6}h1{font-size:20px}
table{border-collapse:collapse;font-variant-numeric:tabular-nums}th,td{padding:6px 10px;border-bottom:1px solid #2a302d;text-align:right}
thead th{color:#45ff7a;font-weight:600}tbody th{text-align:left;color:#8e9993;font-weight:400}.wrap{overflow-x:auto}</style>
<h1>Rat Sniper</h1><div class="wrap"><table><thead><tr><th></th>${keys.map(k => `<th>${k}</th>`).join('')}</tr></thead>
<tbody>${row('All time', total)}${dayRows}</tbody></table></div><p style="color:#8e9993">Days are UTC.</p>`;
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }

    return new Response('Rat Sniper counter', { headers: cors });
  },
};
