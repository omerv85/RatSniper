'use strict';
/* Rat Sniper: the game itself (state, rules, input, rounds, shop, update loop, render, boot).
   The page loads the other js/ files first (see index.html); all share one global scope.
   Moved out: js/lang.js, js/config.js, js/audio.js, js/draw-scene.js, js/draw-rats.js, js/draw-animals.js,
   js/draw-weapons.js. */

/* ---------- languages: every word the player sees or hears ---------- */
const VERSION = '0.0.36';
// translations (LANGS, STR) and plural(): js/lang.js
let LANG = 'en';
try {
  const saved = localStorage.getItem('rs-lang');
  const guess = (navigator.language || 'en').slice(0, 2).toLowerCase();
  LANG = STR[saved] ? saved : STR[guess] ? guess : 'en';
} catch (e) {}
const tr = (k, vars) => { let s = (STR[LANG][k] ?? STR.en[k]); if (vars) for (const [a, b] of Object.entries(vars)) s = s.replace(`{${a}}`, b); return s; };
function applyLang() {
  document.documentElement.lang = LANG;
  document.documentElement.dir = LANG === 'he' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = tr(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = tr(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', tr(el.dataset.i18nAria)));
  const ver = document.getElementById('ver'); if (ver) ver.textContent = `${tr('version')} ${VERSION}`;
  document.querySelectorAll('.lang-select').forEach(s => { s.value = LANG; });
}
function setLang(l) {
  if (!STR[l] || l === LANG) return;
  LANG = l;
  try { localStorage.setItem('rs-lang', l); } catch (e) {}
  applyLang();
  if (A.voice) loadClips(l);   // fetch that language's announcer clips now
  langChanged();
}

/* ---------- world constants ---------- */
const W = 3000;                 // panorama circumference in world units (wraps)
const HORIZON = 516;             // far edge of the yard
const BASE = 539, FAR_K = 0.69;  // buildings stand back from the yard: base line and scale
const SKY_Y0 = -320, SKY_Y1 = 610;
const GR_Y0 = 150, GR_Y1 = 1380;
const LANES = [
  { y: 543, sc: 0.4, j: 2 },    // along the far barn walls
  { y: 598, sc: 0.52, j: 3 },
  { y: 660, sc: 0.66, j: 5 },
  { y: 732, sc: 0.82, j: 3, slab: true },   // on the concrete slab
  { y: 905, sc: 1.12, j: 20 },  // near dirt
];
const AIM_MIN = 430, AIM_MAX = 950;
// timing, economy, difficulty, rifle and grenade numbers: js/config.js
const GAME_URL = 'https://ratsniper.o-vertman.workers.dev/';

const mod = (a, n) => ((a % n) + n) % n;
const wrapD = d => mod(d + W / 2, W) - W / 2;
const rand = (a, b) => a + Math.random() * (b - a);
const $ = s => document.querySelector(s);
// Game counters, kept by the owner's Cloudflare Worker (source in worker/): count({ rats: 12, nights: 1 }) adds to
// the all-time and daily totals. Only numbers are sent, nothing about the player. Sent with sendBeacon so it still
// goes out while the page is closing; failures are ignored. Local copies don't count unless window.__countLocal is set.
const COUNTER = 'https://ratsniper-counter.o-vertman.workers.dev';
function count(nums) {
  try {
    if (/^(localhost|127\.|\[::1\])/.test(location.hostname) && !window.__countLocal) return;
    const body = JSON.stringify(nums);
    if (navigator.sendBeacon && navigator.sendBeacon(COUNTER + '/add', new Blob([body], { type: 'text/plain' }))) return;
    fetch(COUNTER + '/add', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
  } catch (e) {}
}
function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function mk(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
function ell(g, x, y, rx, ry, rot = 0) { g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); g.fill(); }
function line(g, x0, y0, x1, y1) { g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }

/* ---------- canvas / view ---------- */
const cv = $('#game');
const ctx = cv.getContext('2d');
let cssW = 0, cssH = 0, dpr = 1, S = 1, P = 1, viewW = 1000, viewH = 600;
let skyImg = null, grImg = null, Psky = 0, Pgr = 0;
let noisePats = [], scanPat = null, vignette = null;

function resize() {
  cssW = window.innerWidth; cssH = window.innerHeight;
  dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  cv.width = Math.round(cssW * dpr); cv.height = Math.round(cssH * dpr);
  S = Math.min(cssH / 600, cssW / 560);
  P = S * dpr; viewW = cssW / S; viewH = cssH / S;
  const want = Math.min(P, 1.3);
  if (!grImg || Math.abs(want - Pgr) / Pgr > 0.2) buildScenery(want);
  buildPost();
}

// scenery and the night-vision overlay (buildScenery, buildPost): js/draw-scene.js

// audio (music, sfx*, announcer voice): js/audio.js

/* ---------- game state ---------- */
const G = {
  mode: 'menu', night: 1, time: ROUND_TIME, breakT: 0, kills: 0, nightKills: 0,
  aimX: 380, aimY: 650, rats: [], parts: [], decals: [], puffs: [], obs: [], tails: [],
  spawnT: 0, kick: 0, kickX: 0, flash: 0, lastShot: -9, clock: 0, paused: false, voicedNight: 0, spawnCount: 0, rareCount: 0, boss: false, bossEndT: 0, userPaused: false, ufo: null, ufoT: 0, owl: null, nightSpecial: {}, gameSpecial: {}, ammo: AMMO_START, coins: 0, outT: 0, pops: [], lastResult: null, firstNight: 1, hintTO: 0,
  grenades: 0, armed: false, nade: null, throwT: -9, wpn: 0, nadeHinted: false, rifle: 0, shotFx: null,
};
// difficulty formulas (diff, maxAlive, stopDur, ratSpeed) and boss numbers: js/config.js
// the boss night's time is up: the king digs back into his hole (he can still be shot until he's under)
function kingEscape() {
  const k = G.rats.find(r => r.king && r.alive);
  if (!k) { endRound(true, 'escape'); return; }
  k.state = 'emerge'; k.sinking = true; k.emerge = Math.min(1, k.emerge || 1); k.dirtT = 0;
  k.rage = false; k.rear = k.rearTarget = 0; k.jx = k.jy = 0;
  sfxAngry(0, 0.45, 1.6, 2); sfxDig(0.1, true, k.lane);
  G.escapeT = KING_EMERGE_T + 0.7;
}
function makeKing() {
  const lane = Math.random() < 0.5 ? 2 : 3, side = Math.random() < 0.5 ? -1 : 1;
  const r = makeRat(G.aimX + side * viewW * 0.18, lane, -side, true);
  r.king = true; r.sc = r.ls * KING_SIZE; r.hp = r.maxHp = KING_HP * hpMul(); r.t = rand(2, 3);
  r.coat = { k: 'king', patches: [], nick: true, nickFar: false, facePatch: false };
  r.growlT = 2; r.dripT = 0;
  // four kings in turn: night 5 the plain king, 10 armored (viking), 15 cyborg, 20 demon, then again from 25
  const look = Math.floor(G.night / BOSS_EVERY) % 4;
  r.armored = look === 2; r.cyborg = look === 3; r.demon = look === 0;
  burrow(r);
  return r;
}
// a rat that appears in view digs its way up out of the dirt instead of popping in
const EMERGE_T = 1.3, KING_EMERGE_T = 2.2, SINK = 62;
const emergeEase = r => 1 - Math.pow(1 - Math.min(1, r.emerge), 3);
function burrow(r) {
  r.state = 'emerge'; r.emerge = 0; r.dirtT = 0; r.rear = r.rearTarget = 0;
  G.decals.push({ x: r.x, y: r.y + 1, rx: 4 * r.sc, target: 32 * r.sc, ry: 0.28, col: 'rgba(16,18,17,.85)' });
  sfxDig(0, r.king, r.lane);
}
// dirtLip: js/draw-rats.js
// ALPHA_EVERY, ALPHA_SIZE: js/config.js

// LANE_W (spawn odds per path): js/config.js
function pickLane() {
  // later nights tip the odds toward the far paths, where rats are smaller and harder to hit
  const far = G.mode === 'menu' ? 0 : DIFF.far(), n = LANE_W.length;
  const w = LANE_W.map((v, i) => v * (1 + far * (1 - i / (n - 1))));
  let x = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < n; i++) if ((x -= w[i]) <= 0) return i;
  return n - 1;
}
// VARIANTS, RARE_EVERY, VAR_SPEED: js/config.js
const VAR_COAT = { zombie: 'zombie', albino: 'albino', mohawk: 'black' };
function makeRat(x, lane, dir, alpha = false, variant = null) {
  const L = LANES[lane], ls = L.sc * rand(0.9, 1.1);
  const coat = makeCoat(alpha);
  if (variant) {
    coat.patches = []; coat.facePatch = false;
    coat.k = VAR_COAT[variant] || (coat.k === 'white' ? 'grey' : coat.k);   // white is reserved for the albino
    coat.nick = variant === 'zombie' || variant === 'pirate';
  }
  return {
    x: mod(x, W), y: L.y + rand(-L.j, L.j), lane, ls, sc: ls * (alpha ? ALPHA_SIZE : 1), dir,
    state: 'walk', t: rand(0.8, 2.6), phase: Math.random() * 10, rear: variant === 'blind' ? 1.6 : 0, rearTarget: 0,
    alive: true, deadT: 0, blink: 0, sniff: Math.random() * 10, fur: makeFur(),
    alpha, hp: (alpha || variant === 'zombie' ? 2 : 1) * hpMul(), rage: false, wounds: [], jx: 0, jy: 0, jerkT: 0, pause: 0, turnT: 0, coat,
    variant, hair: variant === 'mohawk' ? Array.from({ length: 46 }, () => [Math.random(), Math.random(), Math.random()]) : null,
  };
}
function spawnRat(inView) {
  G.spawnCount++;
  const alpha = G.spawnCount % ALPHA_EVERY === 0;
  // every 15th ordinary (non-alpha) rat of the game is a rare variant; the count restarts with each new game
  let variant = null;
  if (!alpha) { G.rareCount++; if (G.rareCount % RARE_EVERY === 0) variant = VARIANTS[Math.random() * VARIANTS.length | 0]; }
  const lane = alpha ? 1 + (Math.random() * (LANES.length - 1) | 0) : pickLane();
  let x, dir;
  if (inView) { x = G.aimX + rand(-0.42, 0.42) * viewW; dir = Math.random() < 0.5 ? -1 : 1; }
  else { const side = Math.random() < 0.5 ? -1 : 1; x = G.aimX + side * (viewW / 2 + rand(60, 420)); dir = -side; }
  const r = makeRat(x, lane, dir, alpha, variant);
  G.rats.push(r);
  if (inView) burrow(r);
}

function updRat(r, dt) {
  if (!r.alive) { r.deadT += dt; return; }
  r.t -= dt; r.sniff += dt;
  r.jx *= Math.exp(-dt * 10); r.jy *= Math.exp(-dt * 10);
  if (r.blink > 0) r.blink -= dt; else if (!r.rage && Math.random() < dt * 0.22) r.blink = 0.12;
  if (r.state === 'emerge') {
    // the escaping king runs the dig-out in reverse; once he's under, he's gone
    r.emerge += (r.sinking ? -1 : 1) * dt / (r.king ? KING_EMERGE_T : EMERGE_T);
    if (r.sinking && r.emerge <= 0) { r.emerge = 0; r.alive = false; r.gone = true; return; }
    r.dirtT -= dt;
    if (r.emerge < 0.85 && r.dirtT <= 0) {
      r.dirtT = r.king ? 0.025 : 0.045;
      for (let i = 0; i < (r.king ? 3 : 1); i++) G.parts.push({ kind: 'blood', col: 'rgba(132,136,130,.95)', dcol: 'rgba(72,76,72,.45)',
        x: r.x + rand(-26, 26) * r.sc, y: r.y - 2, vx: rand(-110, 110) * r.sc, vy: rand(-240, -80) * r.sc,
        ground: r.y + rand(-3, 6) * r.sc, size: rand(1, 2.4) * r.sc, life: 2, sc: r.sc });
    }
    if (r.emerge >= 1 && !r.sinking) { r.state = 'walk'; r.t = rand(0.8, 2.2); }
    return;
  }
  if (r.king) {
    // the king never strays far from the scope
    const d = wrapD(r.x - G.aimX);
    if (Math.abs(d) > viewW * 0.42 && Math.sign(d) === r.dir) r.dir = -r.dir;
    if (r.state === 'rage') { r.rageT -= dt; if (r.rageT <= 0) { r.rage = false; r.state = 'walk'; r.t = rand(1, 2.5); } }
  }
  if (r.state === 'rage') {
    // wounded alpha: twitchy bursts, sudden reversals and spasms, never settles
    r.jerkT -= dt;
    if (r.jerkT <= 0) {
      r.jerkT = rand(0.06, 0.32);
      const d = wrapD(r.x - G.aimX);
      if (Math.abs(d) > viewW * 0.6) r.dir = d > 0 ? -1 : 1;
      else if (Math.random() < 0.35) r.dir *= -1;
      r.pause = Math.random() < 0.25 ? rand(0.05, 0.25) : 0;
      r.jx += rand(-8, 8) * r.sc; r.jy += rand(-7, 1) * r.sc;
      r.rearTarget = Math.random() < 0.2 ? 0.6 : 0;
    }
    if (r.pause > 0) r.pause -= dt;
    else {
      const sp = ratSpeed(r);
      r.x = mod(r.x + r.dir * sp * dt, W);
      r.phase += sp * dt / (r.sc * 26) * Math.PI;
    }
  } else if (r.state === 'walk' || r.state === 'scurry') {
    if (r.state === 'scurry') {
      r.turnT -= dt;
      if (r.turnT <= 0) { r.turnT = rand(0.15, 0.5); if (Math.random() < 0.5) r.dir *= -1; }
    }
    const sp = ratSpeed(r);
    r.x = mod(r.x + r.dir * sp * dt, W);
    r.phase += sp * dt / (r.sc * 26) * Math.PI;
    r.rearTarget = 0;
    if (r.t <= 0) {
      if (!r.variant && !r.armored && !r.cyborg && !r.demon && Math.random() < 0.3) { r.state = 'look'; r.t = rand(1.8, 2.3); r.rearTarget = 0; }   // stares straight down the scope (dressed-up kings stay side-on)
      else { r.state = 'stop'; r.t = stopDur(); r.rearTarget = Math.random() < 0.4 ? 1 : 0; }
    }
  } else if (r.t <= 0) {
    r.state = 'walk'; r.t = rand(0.9, 3.0);
    const d = wrapD(r.x - G.aimX);
    if (Math.abs(d) > viewW * 0.85) r.dir = d > 0 ? -1 : 1;
    else if (Math.random() < 0.35) r.dir *= -1;
  }
  if (r.variant) {
    const moving = r.state === 'walk' || r.state === 'scurry' || (r.state === 'rage' && r.pause <= 0);
    if (r.variant === 'blind') r.rearTarget = 1.6;                      // always upright on its back legs
    if (r.variant === 'drunk') r.x = mod(r.x + Math.cos(r.sniff * 1.7) * 26 * r.sc * dt, W);   // staggers back and forth
    if (r.variant === 'clown' && moving) r.jy = -Math.abs(Math.sin(r.phase * 1.5)) * 7 * r.sc;  // bouncy walk
  }
  r.rear += (r.rearTarget - r.rear) * Math.min(1, dt * 8);
}

function hitTest(r, ax, ay) {
  const dx = wrapD(ax - r.x - r.jx), dy = ay - r.y - r.jy;
  let lx = dx / r.sc * r.dir, ly = dy / r.sc;
  if (r.state === 'emerge') {
    if (dy > 0) return null;                       // the part still underground can't be hit
    ly -= (1 - emergeEase(r)) * SINK;
  }
  const tlx = lx, tly = ly;   // the tail stays on the ground when the rat rears up, so it's tested unrotated
  if (r.rear > 0.01) {
    const a = r.rear * 0.62, vx = lx + 38, vy = ly + 6, c = Math.cos(a), s = Math.sin(a);
    lx = vx * c - vy * s - 38; ly = vx * s + vy * c - 6;
  }
  const look = r.state === 'look';
  const hx = look ? (lx - 37) / 17 : (lx - 45) / 19, hy = look ? (ly + 28) / 16 : (ly + 23) / 14;
  if (hx * hx + hy * hy <= 1) return { zone: 'head', lx, ly };
  const bx = lx / 58, by = (ly + 26) / (r.alpha ? 29 : 26);
  if (bx * bx + by * by <= 1) return { zone: 'body', lx, ly };
  // the tail (not while digging out): the nearest point on what's left of it, with a little slack because it's thin
  const cut = r.tailCut ?? 1;
  if (r.state !== 'emerge' && cut > TAIL_MIN + 0.02) {
    const P = tailCurve(r);
    let best = null;
    for (let i = 0; i <= 30; i++) {
      const t = TAIL_MIN + (cut - TAIL_MIN) * i / 30, [x, y, , , hw] = tailPoint(P, t), d = Math.hypot(tlx - x, tly - y);
      if (d <= hw + 2.5 && (!best || d < best.d)) best = { d, t };
    }
    if (best) return { zone: 'tail', t: best.t, lx: tlx, ly: tly };
  }
  return null;
}
const TAIL_MIN = 0.12;   // a stub this long always stays on the rat

// a shot through the tail snips it there: no damage, the rat squeals and bolts, the cut piece drops to the ground
function snipTail(r, t) {
  const P = tailCurve(r), [x, y] = tailPoint(P, t), s = r.sc;
  const wx = r.x + r.jx + x * s * r.dir, wy = r.y + r.jy + y * s;
  if (G.tails.length > 40) G.tails.shift();
  G.tails.push({ x: r.x + r.jx, y: r.y, dir: r.dir, sc: s, P, t0: t, t1: r.tailCut ?? 1, variant: r.variant, age: 0 });
  r.tailCut = t;
  spray({ sc: s, y: r.y }, wx, wy, 7, BLOOD, 0.7, 0.8);
  G.puffs.push({ x: wx, y: wy, r: 2 * s, max: 12 * s, life: 0.25, t: 0, col: [45, 12, 14] });
  const delay = 0.04 + 0.025 * (LANES.length - 1 - r.lane);
  sfxHit(delay); sfxAngry(delay + 0.03, 1.6, 0.8, 0.5);   // short, high squeal
  if (!r.king && r.state !== 'rage') { r.state = 'scurry'; r.t = 2; r.turnT = 0.4; r.rearTarget = 0; }
}

function fire() {
  if (G.mode !== 'play') return;
  if (G.clock - G.throwT < THROW_T + 0.25) return;   // the rifle is still coming back up after a throw
  if (G.clock - G.lastShot < SHOT_COOLDOWN || G.ammo <= 0) { sfxDry(); return; }
  G.lastShot = G.clock;
  G.ammo--; updateAmmo();
  if (G.ammo <= 0 && G.grenades <= 0) G.outT = 1.3;     // that was the last bullet: the night ends once it lands
  const ax = G.aimX, ay = G.aimY;
  let best = null, hit = null;
  for (const r of G.rats) {
    if (!r.alive) continue;
    const h = hitTest(r, ax, ay);
    if (h && (!best || r.y > best.y)) { best = r; hit = h; }
  }
  // a jackal in front of the rat (nearer the shooter) takes the shot instead, and the other way round
  let jz = G.jackal ? jackalHit(G.jackal, ax, ay) : null;
  if (jz && best && best.y > G.jackal.y) jz = null; else if (jz) best = null;
  // the boar the same way, against whichever of the two is nearer
  let bz = G.boar ? boarHit(G.boar, ax, ay) : null;
  const frontY = best ? best.y : jz ? G.jackal.y : -1;
  if (bz && frontY > G.boar.y) bz = null; else if (bz) { best = null; jz = null; }
  // clutter in front of the target takes the bullet instead
  let blocker = null, ufoZone = null;
  for (const o of G.obs) if (obsHit(o, ax, ay) && (!blocker || o.y > blocker.y)) blocker = o;
  const targetY = best ? best.y : jz ? G.jackal.y : bz ? G.boar.y : null;
  if (blocker && targetY !== null && blocker.y < targetY) blocker = null;
  sfxShot(G.rifle);
  G.kick = 1; G.kickX = rand(-1, 1); G.flash = G.rifle ? 0.55 : 1; G.rifleKick = 1;
  // the energy rifles draw their shot (beam, bolt, rail trail) from the muzzle to where it landed
  G.shotFx = G.rifle ? { tier: G.rifle, t: 0, x: ax, y: ay, seed: Math.random() * 1000 } : null;
  if (blocker) { best = null; hitObstacle(blocker, ax, ay); }
  else if (jz) shootJackal(G.jackal, jz, ax, ay);
  else if (bz) shootBoar(G.boar, bz, ax, ay);
  else if (best) hitRat(best, hit, ax, ay);
  else if (G.ufo && (ufoZone = ufoHit(G.ufo, ax, ay))) shootUfo(G.ufo, ufoZone);
  else if (G.owl && owlHit(G.owl, ax, ay)) flushOwl(G.owl);   // no points, it just leaves
  else missPuff(ax, ay);
  scare(ax, best);
}
// every rat near a shot or blast panics and scurries about for 2 seconds
function scare(ax, spare) {
  for (const r of G.rats) {
    if (!r.alive || r === spare || r.state === 'rage' || r.state === 'emerge' || r.king) continue;
    const away = wrapD(r.x - ax);
    if (Math.abs(away) > 600 * DIFF.fright()) continue;
    // bolt away from the shot first; later nights they run straight for longer before zig-zagging
    r.state = 'scurry'; r.t = 2; r.turnT = 0.35 + 0.12 * LVL() + rand(0, 0.25); r.rearTarget = 0;
    r.dir = away >= 0 ? 1 : -1;
  }
}

/* ---------- grenade ---------- */
// how big things are drawn at a given height in the yard (the lanes' scale, interpolated)
function scAt(y) {
  const L = LANES;
  if (y <= L[0].y) return Math.max(0.3, L[0].sc - (L[0].y - y) * 0.0015);
  for (let i = 0; i < L.length - 1; i++) if (y <= L[i + 1].y) return L[i].sc + (L[i + 1].sc - L[i].sc) * (y - L[i].y) / (L[i + 1].y - L[i].y);
  return Math.min(1.3, L[L.length - 1].sc + (y - L[L.length - 1].y) * 0.0015);
}
function setArmed(a) {
  if (a && (G.mode !== 'play' || G.grenades <= 0 || G.nade)) return;
  if (a === G.armed) return;
  G.armed = a;
  if (a) {
    sfxPin();
    if (!G.nadeHinted) {   // first time in a game: say how it works
      G.nadeHinted = true; elHint.textContent = tr('nadeHint'); elHint.hidden = false; elHint.classList.remove('gone');
      clearTimeout(G.hintTO); G.hintTO = setTimeout(() => elHint.classList.add('gone'), 2500);
    }
  }
  updateNadeBtn();
}
function updateNadeBtn() {
  const b = $('#nade-btn'), show = G.mode === 'play' && (G.grenades > 0 || G.armed);
  b.hidden = !show || G.userPaused;
  document.body.classList.toggle('has-nade', show);
  b.classList.toggle('armed', G.armed);
  b.classList.toggle('pulse', show && !G.armed && G.ammo <= 0 && G.grenades > 0);
  b.setAttribute('aria-pressed', String(G.armed));
  $('#nade-cnt').textContent = G.grenades;
}
function throwNade() {
  if (G.mode !== 'play' || !G.armed || G.nade || G.grenades <= 0) return;
  G.grenades--; G.armed = false; G.throwT = G.clock;
  G.nade = { t: 0, x: G.aimX, y: G.aimY, spin: rand(9, 13) };
  sfxThrow(); updateNadeBtn();
}
function blast(x, y) {
  const k = scAt(y), rx = NADE_RX * k, ry = NADE_RY * k;
  // inside the oval, counting the target's own half-size so a near miss on a big rat still catches it
  const inBlast = (px, py, hw, hh) => {
    const dx = Math.max(0, Math.abs(wrapD(px - x)) - hw) / rx, dy = Math.max(0, Math.abs(py - y) - hh) / ry;
    return dx * dx + dy * dy <= 1;
  };
  // fireball, shock ring, smoke, flying dirt and a scorch mark
  G.flash = Math.max(G.flash, 1.5); G.kick = Math.max(G.kick, 1.5); G.kickX = rand(-1, 1);
  G.puffs.push({ x, y, r: 10 * k, max: rx * 1.1, life: 0.38, t: 0, glow: true });
  G.puffs.push({ x, y: y - 20 * k, r: 6 * k, max: rx * 0.55, life: 0.22, t: 0, glow: true });
  G.puffs.push({ x, y, r: 12 * k, max: rx * 1.15, life: 0.35, t: 0, ring: true });
  G.puffs.push({ x, y: y - 14 * k, r: 14 * k, max: rx * 0.95, life: 1.4, t: 0, col: [34, 37, 36] });
  for (let i = 0; i < 44; i++) G.parts.push({ kind: 'blood', col: Math.random() < 0.5 ? 'rgba(125,129,124,.95)' : 'rgba(70,74,71,.95)', dcol: 'rgba(38,41,39,.55)',
    x: x + rand(-14, 14) * k, y: y - 4 * k, vx: rand(-340, 340) * k, vy: rand(-560, -140) * k, ground: y + rand(-8, 12) * k, size: rand(1.4, 3.8) * k, life: 2.5, sc: k });
  for (let i = 0; i < 24; i++) G.parts.push({ kind: 'dust', x: x + rand(-60, 60) * k, y: y - rand(0, 40) * k, vx: rand(-100, 100) * k, vy: rand(-190, -40) * k, size: rand(9, 20) * k, life: rand(0.9, 1.8), max: 1.8 });
  G.decals.push({ x, y: y + 2, rx: 10 * k, target: 72 * k, ry: 0.32, col: 'rgba(12,14,13,.82)' });
  sfxNade();
  // everything caught in it takes 2 damage
  const caught = [];
  for (const r of G.rats) {
    if (!r.alive) continue;
    const s = r.sc, cy = r.y - 22 * s + r.jy + (r.state === 'emerge' ? (1 - emergeEase(r)) * SINK * s : 0);
    if (inBlast(r.x + r.jx, cy, 46 * s, 16 * s)) caught.push([r, cy]);
  }
  caught.forEach(([r, cy], i) => hitRat(r, { zone: 'body', lx: rand(-30, 30), ly: rand(-34, -12) }, r.x + r.jx, cy, true, i));
  for (const o of G.obs) if (inBlast(o.x, o.y - 10 * o.s, OBS_W[o.type] / 2 * o.s, 10 * o.s)) hitObstacle(o, o.x, o.y - 10 * o.s, true);
  if (G.ufo && G.ufo.state === 'fly' && inBlast(G.ufo.x, G.ufo.y, 42 * G.ufo.s, 12 * G.ufo.s)) shootUfo(G.ufo, 'body');
  const jk = G.jackal;
  if (jk && jk.alive && inBlast(jk.x, jk.y - 112 * jk.sc, 92 * jk.sc, 30 * jk.sc)) shootJackal(jk, 'body', jk.x, jk.y - 112 * jk.sc);
  const bo = G.boar;
  if (bo && bo.alive && inBlast(bo.x, bo.y - 90 * bo.sc, 100 * bo.sc, 34 * bo.sc)) shootBoar(bo, 'body', bo.x, bo.y - 90 * bo.sc, true);
  if (G.owl && !G.owl.fly && inBlast(G.owl.x, G.owl.y - 22 * G.owl.s, 13 * G.owl.s, 20 * G.owl.s)) flushOwl(G.owl);
  scare(x, null);
  // that was the last thing to shoot or throw: the night ends
  if (G.ammo <= 0 && G.grenades <= 0) G.outT = 1.3;
  return caught.length;
}

const BLOOD = 'rgba(52,11,13,.95)', BRAIN = 'rgba(236,150,170,.95)';
function spray(r, ax, ay, n, col, power = 1, size = 1, dcol = null) {
  const s = r.sc;
  for (let i = 0; i < n; i++) {
    G.parts.push({ kind: 'blood', col, dcol, x: ax, y: ay, vx: rand(-170, 170) * s * power, vy: rand(-280, -40) * s * power,
      ground: r.y + rand(-5, 6) * s, size: rand(1.4, 3.6) * s * size, life: 2, sc: s });
  }
}
function hitRat(r, hit, ax, ay, blasted = false, n = 0) {
  if (hit.zone === 'tail') { snipTail(r, hit.t); return; }   // no damage: just a shorter tail
  const delay = blasted ? 0.03 + n * 0.05 : 0.04 + 0.025 * (LANES.length - 1 - r.lane);
  // a head shot doubles the rifle's damage; a grenade does two "hits" of tonight's toughness, so it stays as strong as ever
  const head = !blasted && hit.zone === 'head', dmg = blasted ? NADE_DMG * hpMul() : rifleDmg() * (head ? 2 : 1);
  if (r.hp > dmg && r.variant === 'zombie') {
    // the zombie shrugs off its first body hit and keeps shambling
    r.hp -= dmg;
    if (r.wounds.length < 14) r.wounds.push([hit.lx, hit.ly]);
    spray(r, ax, ay, 10, BLOOD);
    r.jx += r.dir * -6 * r.sc;
    sfxHit(delay);
    return;
  }
  if (r.hp > dmg) {
    r.hp -= dmg; r.rage = true;
    if (head) headshot();
    if (!r.sinking) { r.state = 'rage'; r.t = 999; r.jerkT = 0; r.pause = 0; r.blink = 0; r.rearTarget = 0; }   // a sinking king keeps going down
    if (r.wounds.length < 14) r.wounds.push([hit.lx, hit.ly]);
    spray(r, ax, ay, 12, BLOOD, 1, r.king ? 0.6 : 1);
    G.puffs.push({ x: ax, y: ay, r: 3 * r.sc, max: 26 * r.sc, life: 0.3, t: 0, col: [45, 12, 14] });
    sfxHit(delay);
    if (r.king) { r.rageT = rand(2.5, 3.5); sfxAngry(delay + 0.05, 0.55, 1.4, 1.4); bossBar(r); }
    else sfxAngry(delay + 0.05);
    return;
  }
  kill(r, ax, ay, head, delay);
}
function kill(r, ax, ay, head, delay) {
  r.alive = false; r.deadT = 0; r.rage = false; r.jx = r.jy = 0;
  G.kills++; G.nightKills++;
  countSpecial(r.king ? 'king' : r.variant || (r.alpha ? 'alpha' : null));
  payBounty(r.king ? 'king' : r.variant ? 'rare' : r.alpha ? 'alpha' : 'rat', head, r.x, r.y - 44 * r.sc);
  elKills.textContent = G.kills;
  elKillBox.classList.remove('bump'); void elKillBox.offsetWidth; elKillBox.classList.add('bump');
  const s = r.sc;
  if (r.king) { r.hp = 0; bossBar(r); explode(r); }
  spray(r, ax, ay, 18, BLOOD);
  G.puffs.push({ x: ax, y: ay, r: 4 * s, max: 38 * s, life: 0.35, t: 0, col: [45, 12, 14] });
  G.decals.push({ x: r.x + r.dir * 4 * s, y: r.y + 1, rx: 3 * s, target: rand(24, 32) * s, ry: 0.33 });
  if (head) {
    spray(r, ax, ay, 14, BRAIN, 1.25, 1.5);
    G.puffs.push({ x: ax, y: ay, r: 3 * s, max: 30 * s, life: 0.45, t: 0, col: [236, 150, 170] });
    G.decals.push({ x: r.x + r.dir * 30 * s, y: r.y + 2, rx: 2 * s, target: rand(9, 13) * s, ry: 0.4, col: 'rgba(205,128,148,.8)' });
    headshot();
  }
  sfxHit(delay);
}
// king rat death: the carcass bursts, throwing gore to both sides and leaving the rib cage open
function explode(r) {
  r.exploded = true;
  const s = r.sc, body = { sc: s, y: r.y }, cx = r.x, cy = r.y - 24 * s;
  spray(body, cx, cy, 80, BLOOD, 2.3, 0.9);
  spray(body, cx, cy, 26, BRAIN, 2.0, 1.0);
  spray(body, cx, cy, 16, 'rgba(96,22,26,.98)', 1.7, 1.8);
  G.puffs.push({ x: cx, y: cy, r: 10 * s, max: 110 * s, life: 0.7, t: 0, col: [60, 12, 15] });
  G.decals.push({ x: cx, y: r.y + 1, rx: 6 * s, target: 75 * s, ry: 0.3 });
  for (let i = 0; i < 16; i++) {
    const side = i % 2 ? 1 : -1;
    G.decals.push({ x: cx + side * rand(50, 280) * s, y: r.y + rand(-4, 10) * s, rx: rand(4, 14) * s, target: 0, ry: 0.35,
      col: Math.random() < 0.25 ? 'rgba(205,128,148,.8)' : null });
  }
  G.kick = 2.2; G.flash = 1.6;
  sfxExplode();
  G.bossEndT = 3;
}
const elBossHud = $('#hud-boss'), elBossFill = $('#boss-fill');
function bossBar(r) { elBossFill.style.transform = `scaleX(${Math.max(0, r.hp / r.maxHp).toFixed(3)})`; elBossHud.classList.toggle('low', r.hp <= r.maxHp / 2); }
function kingTick(r, dt) {
  if (r.hp > r.maxHp / 2) return;
  // badly hurt: bleeding from every wound, growling
  r.growlT -= dt;
  if (r.growlT <= 0) { r.growlT = rand(1.4, 2.8); sfxAngry(0, 0.5, 1.5, 1.6); }
  r.dripT -= dt;
  if (r.dripT <= 0 && r.wounds.length) {
    r.dripT = 0.07;
    const [wx, wy] = r.wounds[Math.random() * r.wounds.length | 0];
    G.parts.push({ kind: 'blood', col: BLOOD, x: r.x + r.dir * wx * r.sc + r.jx, y: r.y + wy * r.sc + r.jy, vx: rand(-20, 20), vy: rand(0, 40),
      ground: r.y + rand(-3, 4), size: rand(1.4, 2.6) * r.sc * 0.6, life: 2, sc: r.sc });
  }
}
const elHS = $('#headshot');
function headshot() {
  elHS.hidden = false;
  elHS.classList.remove('show'); void elHS.offsetWidth; elHS.classList.add('show');
  voice('head');
}
function missPuff(ax, ay) {
  if (ay < 300) return;
  const s = ay > HORIZON ? Math.max(0.25, (ay - HORIZON) / 370) : 0.3;
  for (let i = 0; i < 9; i++) G.parts.push({ kind: 'dust', x: ax, y: ay, vx: rand(-60, 60) * s, vy: rand(-110, -20) * s, size: rand(2, 5) * s, life: rand(0.4, 0.8), max: 0.8 });
  G.puffs.push({ x: ax, y: ay, r: 3 * s, max: 22 * s, life: 0.4, t: 0 });
}

/* ---------- rounds ---------- */
const elHudL = $('#hud-l'), elHudR = $('#hud-r'), elHudB = $('#hud-b'), elKillBox = elHudR;
const elNight = $('#hud-night'), elTime = $('#hud-time'), elBar = $('#hud-bar'), elKills = $('#hud-kills');
const elSplash = $('#splash'), elStart = $('#start'), elHint = $('#hint'), elRing = $('#sp-ring'), elBarWrap = $('#hud-l .bar');

// special kills this night, shown on the cleared screen (rarest first)
const SPECIALS = [['king', 'King rat'], ['ufo', 'UFO rat'], ['boar', 'Wild boar'], ['jackal', 'Jackal'], ['zombie', 'Zombie'], ['clown', 'Clown'], ['xmas', 'X-mas'], ['pirate', 'Pirate'],
  ['drunk', 'Drunk'], ['albino', 'Albino'], ['mohawk', 'Mohawk'], ['french', 'French'], ['blind', 'Blind'], ['alpha', 'Alpha']];
function countSpecial(k) { if (k) { G.nightSpecial[k] = (G.nightSpecial[k] || 0) + 1; G.gameSpecial[k] = (G.gameSpecial[k] || 0) + 1; } }
// bounty for a kill, with a little "+N" rising from where it died
function payBounty(kind, head, x, y) {
  const n = BOUNTY[kind] + (head ? HEAD_BONUS : 0);
  G.coins += n; updateCoins(true);
  // one coin per coin earned, each floating up and fading at its own pace
  for (let i = 0; i < n; i++) {
    G.pops.push({ x: x + rand(-8, 8), y, t: -i * 0.07, life: rand(0.9, 1.5), vx: rand(-28, 28), rise: rand(45, 80), spin: rand(4, 9) });
  }
}
// the coin counter in the HUD; bump: a little pop when coins come in
function updateCoins(bump = false) {
  $('#hud-coins-n').textContent = G.coins;
  if (bump) { const e = $('#hud-coins'); e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); }
}
function updateAmmo() {
  $('#hud-ammo-n').textContent = G.ammo;
  $('#hud-ammo').classList.toggle('low', G.ammo <= 3);
  updateCoins();
  updateNadeBtn();   // the grenade button pulses once the bullets are gone
}
// between nights: the night bonus, wallet and the two packs
const itemLabel = (word, n, c) => `${n} ${plural(n, STR[LANG].words[word])} · ${c} ${plural(c, STR[LANG].words.coin)}`;
const packPrice = i => (i === 'nade' ? NADE_PRICE : i === 'rifle' ? UPGRADE_PRICE[G.rifle] : PACKS[i][1]) + Math.floor(G.night / PRICE_STEP);
const packKey = b => b.dataset.pack === 'nade' || b.dataset.pack === 'rifle' ? b.dataset.pack : +b.dataset.pack;
const cheapest = () => Math.min(...PACKS.map((_, i) => packPrice(i)));   // bullets only: a grenade can't keep you in the game
// nothing left to shoot or throw, and no coins for bullets
const broke = () => G.ammo <= 0 && G.grenades <= 0 && G.coins < cheapest();
function renderShop() {
  $('#shop-bonus').textContent = G.earlyEnd ? tr(G.earlyEnd === 'escape' ? 'escapedNoBonus' : 'noBonus') : tr('bonusLine', { n: NIGHT_BONUS });
  $('#shop-bonus').classList.toggle('poor', !!G.earlyEnd);
  $('#shop-ammo').textContent = G.ammo; $('#shop-coins').textContent = G.coins; $('#shop-nades').textContent = G.grenades;
  // a warning when the next night is the first of a tougher stretch
  $('#shop-warn').hidden = hpMul(G.night + 1) <= hpMul(G.night);
  // the next rifle up, in its glow colour; gone once you have the railgun
  const rb = $('#shop-rifle'), next = G.rifle + 1;
  rb.hidden = next >= RIFLES.length;
  if (!rb.hidden) {
    const price = packPrice('rifle'), name = STR[LANG].rifles[next];
    rb.querySelector('.n').textContent = name; rb.querySelector('.c').textContent = price;
    rb.querySelector('.qty').style.color = RIFLE_COL[next](1);
    rb.setAttribute('aria-label', `${name} · ${price} ${plural(price, STR[LANG].words.coin)}`);
    rb.classList.toggle('cant', G.coins < price);
  }
  document.querySelectorAll('.item:not(.rifle)').forEach(b => {
    const i = packKey(b), n = i === 'nade' ? 1 : PACKS[i][0], price = packPrice(i);
    b.querySelector('.n').textContent = '+' + n;
    b.querySelector('.c').textContent = price;
    b.setAttribute('aria-label', itemLabel(i === 'nade' ? 'grenade' : 'bullet', n, price));
    b.classList.toggle('cant', G.coins < price);
  });
}
function buyPack(i) {
  if (i === 'rifle' && G.rifle >= RIFLES.length - 1) return;
  const price = packPrice(i);
  if (G.coins < price) { $('#shop-msg').textContent = tr('poor'); $('#shop-msg').hidden = false; return; }
  G.coins -= price; $('#shop-msg').hidden = true;
  if (i === 'nade') { G.grenades++; sfxPin(); count({ grenades: 1 }); }
  else if (i === 'rifle') { G.rifle++; sfxUpgrade(); }
  else { G.ammo += PACKS[i][0]; sfxPing(0, false); }
  updateAmmo(); renderShop();
  for (const id of [i === 'nade' ? '#shop-nades' : i === 'rifle' ? null : '#shop-ammo', '#shop-coins']) if (id) { const p = $(id).parentElement; p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump'); }
}
document.querySelectorAll('.item').forEach(b => b.addEventListener('click', () => buyPack(packKey(b))));
// the end: out of bullets mid-night
function gameOver() {
  if (G.mode !== 'play' && G.mode !== 'cleared') return;
  G.mode = 'over'; drag.id = null; G.ufo = null; ufoHumStop(); G.armed = false; G.nade = null; updateNadeBtn();
  const nights = G.night - 1, kills = G.kills;
  let best = 0; try { best = +localStorage.getItem('rs-best') || 0; } catch (e) {}
  const newBest = kills > best; if (newBest) { best = kills; try { localStorage.setItem('rs-best', String(kills)); } catch (e) {} }
  $('#ov-nights').textContent = nights; $('#ov-kills').textContent = kills; $('#ov-best').textContent = best;
  $('#ov-newbest').hidden = !newBest;
  $('#ov-special').innerHTML = SPECIALS.filter(([k]) => G.gameSpecial[k]).map(([k, label]) =>
    `<span class="chip${k === 'alpha' ? '' : ' rare'}"><b>${STR[LANG].sp[k] || label}</b> ×${G.gameSpecial[k]}</span>`).join('');
  G.lastResult = { nights, kills };
  setShareLink();
  elHudL.hidden = elHudR.hidden = elHudB.hidden = elBossHud.hidden = elHint.hidden = true; $('#hud-ammo').hidden = true; $('#hud-coins').hidden = true;
  elPauseBtn.hidden = true; elSplash.hidden = true;
  $('#over').hidden = false;
  setMusic('night');
}
function setShareLink() {
  if (!G.lastResult) return;
  const msg = tr('shareMsg', { n: G.lastResult.nights, k: G.lastResult.kills, url: GAME_URL });
  $('#ov-share').href = 'https://wa.me/?text=' + encodeURIComponent(msg);
}
$('#ov-share').addEventListener('click', () => count({ shares: 1 }));
$('#ov-again').addEventListener('click', () => { $('#over').hidden = true; startGame(1); });
$('#ov-home').addEventListener('click', () => { $('#over').hidden = true; goHome(); });
function renderSpecials() {
  const el = $('#sp-special'), list = $('#sp-special-list');
  const got = SPECIALS.filter(([k]) => G.nightSpecial[k]);
  el.hidden = !got.length;
  list.innerHTML = got.map(([k, label], i) =>
    `<span class="chip${k === 'alpha' ? '' : ' rare'}" style="animation-delay:${0.35 + i * 0.12}s"><b>${STR[LANG].sp[k] || label}</b> ×${G.nightSpecial[k]}</span>`).join('');
}
function renderNextLine() { $('#sp-next-line').innerHTML = tr('nextBegins', { n: `<b>${G.night + 1}</b>` }); }
function startRound(n) {
  G.night = n; G.nightKills = 0; G.time = n % BOSS_EVERY === 0 ? BOSS_TIME : ROUND_TIME; G.nightSpecial = {}; G.escapeT = 0;
  G.rats = []; G.parts = []; G.decals = []; G.puffs = []; G.tails = [];
  G.spawnT = 1.2; G.lastShot = -9; G.armed = false; G.nade = null; G.throwT = -9; G.wpn = 0;
  for (const o of G.obs) o.broken = false;   // a fresh empty bottle each night
  G.boss = n % BOSS_EVERY === 0; G.bossEndT = 0;
  G.owl = !G.boss && Math.random() < OWL_CHANCE ? makeOwl() : null;
  G.ufo = null; ufoHumStop();
  G.ufoT = !G.boss && Math.random() < UFO_CHANCE ? rand(4, 22) : 0;   // ultra rare: shows up partway through some nights
  G.jackal = null;
  G.jackalT = !G.boss && n >= JACKAL_FROM_NIGHT && Math.random() < JACKAL_CHANCE ? rand(4, 22) : 0;
  G.boar = null;
  G.boarT = !G.boss && n >= BOAR_FROM_NIGHT && Math.random() < BOAR_CHANCE ? rand(3, 18) : 0;
  if (G.boss) {
    // boss night: one king rat, no clock, a health bar and metal
    const k = makeKing(); G.rats.push(k); bossBar(k);
    sfxAngry(0.6, 0.45, 1.6, 2); voice('king', true);
    elHint.textContent = tr('bossHint');
  } else {
    spawnRat(true); spawnRat(true); spawnRat(false);
    elHint.textContent = tr('hint');
  }
  elBossHud.hidden = !G.boss;
  elTime.hidden = elBarWrap.hidden = false;   // boss nights have a clock too (BOSS_TIME)
  setMusic(G.boss ? 'boss' : 'night');
  if (G.boss || n === G.firstNight) { elHint.hidden = false; elHint.classList.remove('gone'); clearTimeout(G.hintTO); G.hintTO = setTimeout(() => elHint.classList.add('gone'), 4500); }
  G.mode = 'play';
  updateNadeBtn();
  elSplash.hidden = true;
  elNight.textContent = n;
  elKills.textContent = G.kills;
}
// rats killed since the last report go to the counter (kills are reported per night, on quitting and when the
// page is hidden mid-night, without counting any twice)
function sendRats(nights = 0) {
  const rats = G.kills - (G.killsSent || 0);
  if (rats > 0 || nights > 0) count({ rats: Math.max(0, rats), nights });
  G.killsSent = G.kills;
}
document.addEventListener('visibilitychange', () => { if (document.hidden && G.mode === 'play') sendRats(); });
// boss night result under "CLEARED": slain if the king is dead, escaped if he got away, nothing if you ran dry
// and the big title: "CLEARED", or in red "THE KING LIVES" when a boss night ends with him alive (ran dry or escaped)
const kingLived = () => G.boss && (G.earlyEnd === 'escape' || G.rats.some(r => r.king && r.alive));
function renderBossLine() {
  const el = $('#sp-boss'), escaped = G.earlyEnd === 'escape', slain = G.boss && G.rats.some(r => r.king && !r.alive);
  el.hidden = !(escaped || slain);
  el.textContent = tr(escaped ? 'kingEscaped' : 'kingSlain');
  const title = $('#sp-title'), lives = kingLived();
  title.textContent = tr(lives ? 'kingLives' : 'cleared');
  title.classList.toggle('lives', lives);
}
// early: the night ended without being survived (no bonus); why: 'ammo' (ran dry) or 'escape' (the king got away)
function endRound(early = false, why = 'ammo') {
  if (G.mode !== 'play') return;
  G.earlyEnd = early ? why : false; G.escapeT = 0;
  sendRats(early ? 0 : 1);   // the night's kills, and the night itself if it was survived
  // ran dry and can't afford even the small pack: straight to game over, no cleared screen
  if (early && broke()) { G.mode = 'cleared'; gameOver(); return; }
  G.mode = 'cleared'; G.breakT = BREAK_TIME; drag.id = null; G.armed = false; G.nade = null; updateNadeBtn();
  $('#sp-night').textContent = G.night;
  $('#sp-kills').textContent = G.nightKills;
  $('#sp-total').textContent = G.kills;
  renderSpecials();
  renderNextLine();
  $('#sp-count').textContent = BREAK_TIME;
  elRing.style.strokeDashoffset = '0';
  renderBossLine();
  setMusic('night');
  elSplash.hidden = false;
  if (G.voicedNight !== G.night) { G.voicedNight = G.night; sfxCleared(G.earlyEnd === 'ammo' ? 'noAmmo' : G.earlyEnd === 'escape' || !G.boss ? 'noTime' : null, !kingLived()); }
  // surviving the night pays a few bullets; then the shop is open until the next night
  // a full night pays a few bullets; running dry forfeits it. Broke with no bullets means the game is over.
  if (!early) G.ammo += NIGHT_BONUS;
  G.outT = 0; updateAmmo(); $('#shop-msg').hidden = true; renderShop();
  if (broke()) gameOver();
}

/* ---------- input ---------- */
// Joystick aiming: the view turns continuously, faster the further the finger is from where it first touched.
// A small dead zone keeps a resting finger still; near the centre it creeps for fine aiming.
const drag = { id: null, ox: 0, oy: 0, x: 0, y: 0 };
const JOY_DEAD = 6, JOY_MAX = 1800;   // css px; css px per second
function joySpeed(d) {
  const a = Math.abs(d) - JOY_DEAD;
  if (a <= 0) return 0;
  return Math.sign(d) * Math.min(JOY_MAX, a * 3.2 + a * a * 0.02);
}
function steer(dt) {
  if (drag.id === null || G.mode !== 'play') return;
  G.aimX += joySpeed(drag.x - drag.ox) / S * dt;
  G.aimY = Math.min(AIM_MAX, Math.max(AIM_MIN, G.aimY + joySpeed(drag.y - drag.oy) / S * dt));
}
cv.addEventListener('pointerdown', e => {
  if (G.mode !== 'play' || G.paused || drag.id !== null) return;
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  drag.id = e.pointerId; drag.ox = drag.x = e.clientX; drag.oy = drag.y = e.clientY;
  try { cv.setPointerCapture(e.pointerId); } catch (err) {}
  e.preventDefault();
});
cv.addEventListener('pointermove', e => {
  if (e.pointerId !== drag.id) return;
  drag.x = e.clientX; drag.y = e.clientY;
  e.preventDefault();
});
cv.addEventListener('pointerup', e => {
  if (e.pointerId !== drag.id) return;
  drag.id = null;
  if (G.armed) throwNade(); else fire();
});
$('#nade-btn').addEventListener('click', () => setArmed(!G.armed));
cv.addEventListener('pointercancel', e => { if (e.pointerId === drag.id) drag.id = null; });
cv.addEventListener('contextmenu', e => e.preventDefault());

function startGame(night) {
  tryLandscapeLock();
  initAudio();
  // phones only allow speech that was first started from a tap: prime it silently here
  try { if (!hasClips(LANG) && window.speechSynthesis) { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } } catch (e) {}
  try { navigator.wakeLock && navigator.wakeLock.request('screen').catch(() => {}); } catch (e) {}
  elStart.hidden = true;
  elHudL.hidden = elHudR.hidden = elHudB.hidden = false; $('#hud-ammo').hidden = false; $('#hud-coins').hidden = false;
  elPauseBtn.hidden = false;
  G.ammo = AMMO_START; G.coins = 0; G.gameSpecial = {}; G.outT = 0; G.pops = []; updateAmmo();
  G.grenades = 0; G.armed = false; G.nade = null; G.nadeHinted = false; G.rifle = 0; G.shotFx = null;
  sendRats();   // anything left from a previous game
  let first = 0; try { if (!localStorage.getItem('rs-played')) { localStorage.setItem('rs-played', '1'); first = 1; } } catch (e) {}
  count({ games: 1, players: first });   // first game on this device
  G.kills = 0; G.killsSent = 0; G.aimY = 650; G.voicedNight = 0; G.spawnCount = 0; G.rareCount = 0; G.firstNight = night;
  startRound(night);
}
$('#go').addEventListener('click', () => startGame(1));
// Pause: button bottom right during a game; the pause screen holds the sound toggle and the way back.
const elPauseBtn = $('#pause-btn'), elPause = $('#pause');
function setUserPause(p) {
  if (p && G.mode === 'menu') return;
  G.userPaused = p;
  elPause.hidden = !p;
  elPauseBtn.hidden = p || G.mode === 'menu';
  drag.id = null;
  updateNadeBtn();
  applyPause();
  if (p) $('#resume').focus();
}
elPauseBtn.addEventListener('click', () => setUserPause(true));
$('#resume').addEventListener('click', () => setUserPause(false));
$('#sound').addEventListener('click', () => setMuted(!A.muted));
// leave the current game and go back to the start screen, with rats roaming behind it again
function goHome() {
  sendRats();   // quitting mid-night: those kills still count
  G.mode = 'menu'; G.boss = false; G.bossEndT = 0; G.ufo = null; G.ufoT = 0; ufoHumStop(); G.jackal = null; G.jackalT = 0; G.boar = null; G.boarT = 0; G.armed = false; G.nade = null;
  G.rats = []; G.parts = []; G.decals = []; G.puffs = []; G.tails = [];
  for (let i = 0; i < 4; i++) spawnRat(true);
  G.owl = makeOwl();
  elHudL.hidden = elHudR.hidden = elHudB.hidden = elBossHud.hidden = elSplash.hidden = elHint.hidden = true;
  $('#hud-ammo').hidden = true; $('#over').hidden = true; $('#hud-coins').hidden = true;
  elStart.hidden = false; showUpdate();
  setMusic('night');
  setUserPause(false);
  elPauseBtn.hidden = true;
}
$('#home').addEventListener('click', goHome);
$('#start-now').addEventListener('click', () => {
  if (G.mode !== 'cleared') return;
  if (G.ammo <= 0 && G.grenades <= 0) { $('#shop-msg').textContent = tr('needAmmo'); $('#shop-msg').hidden = false; return; }
  startRound(G.night + 1);
});
// some players prefer a clear view: the rifle can be hidden from the pause screen, and the choice is remembered
let showRifle = true;
try { showRifle = localStorage.getItem('rs-rifle') !== '0'; } catch (e) {}
function setShowRifle(v) {
  showRifle = v;
  try { localStorage.setItem('rs-rifle', v ? '1' : '0'); } catch (e) {}
  $('#rifle-toggle').textContent = v ? tr('rifleShown') : tr('rifleHidden');
  $('#rifle-toggle').setAttribute('aria-pressed', String(v));
}
$('#rifle-toggle').addEventListener('click', () => setShowRifle(!showRifle));
setShowRifle(showRifle);

// language pickers on the start and pause screens; a change re-labels everything, including the feed sacks
document.querySelectorAll('.lang-select').forEach(sel => {
  sel.innerHTML = LANGS.map(([code, name]) => `<option value="${code}" lang="${code}">${name}</option>`).join('');
  sel.addEventListener('change', () => setLang(sel.value));
});
function langChanged() {
  setMuted(A.muted); setShowRifle(showRifle);
  if (!elHint.hidden) elHint.textContent = tr(G.armed ? 'nadeHint' : G.boss ? 'bossHint' : 'hint');
  if (!elSplash.hidden) { renderSpecials(); renderNextLine(); renderShop(); renderBossLine(); }
  showUpdate(); showPlayers();
  if (!$('#install-help').hidden) $('#install-help').textContent = tr(isIos() ? 'installIos' : 'installOther');
  setShareLink();
  if (grImg) buildScenery(Pgr);
}
applyLang();
document.addEventListener('keydown', e => {
  if ((e.key === 'Escape' || e.key === 'p' || e.key === 'P') && (G.mode === 'play' || G.mode === 'cleared')) setUserPause(!G.userPaused);
  if ((e.key === 'g' || e.key === 'G') && G.mode === 'play' && !G.paused) setArmed(!G.armed);
});
setMuted(A.muted);

// Full screen: the button bottom left shows only while the game isn't full screen and the browser allows it.
const elFs = $('#fs-btn');
const fsSupported = () => !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
const isFs = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
function updateFsBtn() { elFs.hidden = !fsSupported() || isFs() || installed() || !!G.newVersion; }   // the home-screen app is already full screen
function goFullscreen() {
  try {
    const el = document.documentElement, fs = el.requestFullscreen || el.webkitRequestFullscreen;
    if (!fs || isFs()) return;
    const p = fs.call(el, { navigationUI: 'hide' });
    // Android browsers can lock rotation, but only in full screen
    if (p && p.then) p.then(() => screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape')).catch(() => {});
  } catch (e) {}
}
elFs.addEventListener('click', goFullscreen);
document.addEventListener('fullscreenchange', updateFsBtn);
document.addEventListener('webkitfullscreenchange', updateFsBtn);

// Phones must be held sideways: in portrait a full-screen notice covers the game and everything pauses.
const elRotate = $('#rotate');
let needRotate = false;
const touchDevice = () => (window.matchMedia && matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window;
function applyPause() {
  const p = document.hidden || needRotate || G.userPaused;
  G.paused = p;
  if (A.ctx) (p ? A.ctx.suspend() : A.ctx.resume()).catch(() => {});
}
function checkOrientation() {
  needRotate = touchDevice() && window.innerHeight > window.innerWidth;
  elRotate.hidden = !needRotate;
  if (needRotate) drag.id = null;
  applyPause();
}
function tryLandscapeLock() {
  // on phones, starting a game also goes full screen; iPhones can't, so the rotate notice covers them
  if (touchDevice()) goFullscreen();
}
// Add to home screen: Android Chrome hands us an install prompt we can open from our own button;
// elsewhere (iPhone, other browsers) the button explains where the browser keeps that option.
// Started from the home screen, the game opens full screen in landscape (see manifest.webmanifest).
let installEvt = null;
const installed = () => navigator.standalone === true ||
  (window.matchMedia && (matchMedia('(display-mode: fullscreen)').matches || matchMedia('(display-mode: standalone)').matches));
const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
function updateInstallBtn() {
  $('#install').hidden = installed() || !!G.newVersion || !(installEvt || touchDevice());
  if ($('#install').hidden) $('#install-help').hidden = true;
}
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; updateInstallBtn(); });
window.addEventListener('appinstalled', () => { installEvt = null; updateInstallBtn(); count({ installs: 1 }); });
$('#install').addEventListener('click', () => {
  if (installEvt) {
    const ev = installEvt; installEvt = null;
    ev.prompt();
    (ev.userChoice || Promise.resolve()).then(() => updateInstallBtn()).catch(() => {});
    return;
  }
  const h = $('#install-help');
  h.textContent = tr(isIos() ? 'installIos' : 'installOther'); h.hidden = false;
  $('#start .fine').hidden = true;   // make room on short landscape screens
});
updateInstallBtn();
// "Played by N players · M rats killed" on the start screen, from the counter's all-time totals (read once per load;
// the counter caches them for a minute). Shown as soon as they arrive, whatever the numbers; hidden if the counter
// can't be reached, and while an update waits.
const totals = { players: 0, rats: 0, ok: false };
function showPlayers() {
  const el = $('#players'), w = STR[LANG].words, b = n => `<b>${n.toLocaleString(LANG)}</b>`;
  el.hidden = !totals.ok || !!G.newVersion;
  if (!totals.ok) return;
  el.innerHTML = tr('playedBy', { n: b(totals.players), w: plural(totals.players, w.player) }) + ' · ' +
    tr('ratsTotal', { n: b(totals.rats), w: plural(totals.rats, w.rat) });
}
fetch(COUNTER + '/totals').then(r => r.ok ? r.json() : null).then(j => {
  if (j) { totals.players = +j.players || 0; totals.rats = +j.rats || 0; totals.ok = true; showPlayers(); }
}).catch(() => {});
// opened from the home-screen icon
if (installed()) count({ homeOpens: 1 });

// Update check: a page left open (or the home-screen app) keeps running the version it loaded. While the main menu
// is showing in the foreground, at most once a minute, ask GitHub for version.json (a few bytes, never the cached
// copy) and offer a reload when a newer version is out. Never during a night, and no more checks once one is found.
// When an update is waiting, it is the only button on the start screen (G.newVersion).
let lastCheck = Date.now();
const verNum = v => String(v).split('.').map(n => +n || 0);
const newer = (a, b) => { const x = verNum(a), y = verNum(b); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); return false; };
function showUpdate() {
  const nv = G.newVersion, b = $('#update');
  b.hidden = !nv;
  if (!nv) return;
  b.textContent = tr('updateBtn', { v: nv });
  $('#go').hidden = true; $('#start .fine').hidden = true; $('#install-help').hidden = true;
  $('#start .lede').hidden = true; $('#start .rules').hidden = true;   // no tagline or controls: just the update
  showPlayers();
  updateInstallBtn(); updateFsBtn();
}
function checkUpdate() {
  if (G.newVersion || G.mode !== 'menu' || document.hidden || Date.now() - lastCheck < 60000) return;
  lastCheck = Date.now();
  fetch('version.json', { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(j => {
    if (j && j.v && newer(j.v, VERSION)) { G.newVersion = j.v; if (G.mode === 'menu') showUpdate(); }
  }).catch(() => {});
}
$('#update').addEventListener('click', () => { count({ updates: 1 }); setTimeout(() => location.reload(), 150); });
setInterval(checkUpdate, 5000);
document.addEventListener('visibilitychange', checkUpdate);
document.addEventListener('visibilitychange', applyPause);
window.addEventListener('orientationchange', () => setTimeout(checkOrientation, 250));
window.addEventListener('resize', checkOrientation);

/* ---------- update ---------- */
function update(dt) {
  G.clock += dt;
  steer(dt);
  if (G.mode === 'play' && G.outT > 0) {
    // the last bullet has been fired: end the game once it has landed, unless that shot just won the boss night
    G.outT -= dt;
    // the last bullet has landed: the night ends early (unless that shot just won the boss night)
    if (G.outT <= 0 && !(G.boss && (G.bossEndT > 0 || G.escapeT > 0))) endRound(true);
  }
  for (const p of G.pops) p.t += dt;
  G.pops = G.pops.filter(p => p.t < p.life);
  if (G.nade) { G.nade.t += dt; if (G.nade.t >= NADE_FLIGHT) { const n = G.nade; G.nade = null; if (G.mode === 'play') blast(n.x, n.y); } }
  // weapon swap: 0 = rifle up, 1 = grenade hand up (it stays up through the throw, then the rifle comes back)
  const wantHand = G.armed || G.clock - G.throwT < THROW_T ? 1 : 0;
  G.wpn += Math.sign(wantHand - G.wpn) * Math.min(Math.abs(wantHand - G.wpn), dt / 0.32);
  if (G.mode === 'play') {
    if (!G.boss) {
      G.time -= dt;
      if (G.time <= 0) { G.time = 0; endRound(); }
    } else if (G.bossEndT > 0) {
      G.bossEndT -= dt;
      if (G.bossEndT <= 0) endRound();
    } else if (G.escapeT > 0) {
      G.escapeT -= dt;
      if (G.escapeT <= 0) endRound(true, 'escape');
    } else {
      G.time -= dt;
      if (G.time <= 0) { G.time = 0; kingEscape(); }
    }
  } else if (G.mode === 'cleared') {
    G.breakT -= dt;
    $('#sp-count').textContent = Math.max(1, Math.ceil(G.breakT));
    elRing.style.strokeDashoffset = (276.46 * (1 - Math.max(0, G.breakT) / BREAK_TIME)).toFixed(2);
    if (G.breakT <= 0) { if (G.ammo > 0 || G.grenades > 0) startRound(G.night + 1); else gameOver(); }
  } else if (G.mode === 'menu') {
    G.aimX += dt * 16;
  }
  if (G.mode !== 'cleared' && !G.boss) {
    G.spawnT -= dt;
    const alive = G.rats.reduce((n, r) => n + (r.alive ? 1 : 0), 0);
    if (G.spawnT <= 0 && alive < maxAlive()) { spawnRat(Math.random() < 0.35); G.spawnT = rand(0.8, 1.7) / diff(); }
  }
  for (const r of G.rats) { updRat(r, dt); if (r.king && r.alive) kingTick(r, dt); }
  if (G.rats.some(r => r.gone)) G.rats = G.rats.filter(r => !r.gone);   // the escaped king
  for (const o of G.obs) if (o.hopT > 0) o.hopT = Math.max(0, o.hopT - dt);
  if (G.owl) { owlTick(G.owl, dt); if (G.owl.gone) G.owl = null; }
  if (G.ufoT > 0 && G.mode === 'play') { G.ufoT -= dt; if (G.ufoT <= 0) { G.ufo = spawnUfo(); ufoHumStart(); } }
  if (G.jackalT > 0 && G.mode === 'play') { G.jackalT -= dt; if (G.jackalT <= 0) G.jackal = spawnJackal(); }
  if (G.jackal) { jackalTick(G.jackal, dt); if (G.jackal.gone) G.jackal = null; }
  if (G.boarT > 0 && G.mode === 'play') { G.boarT -= dt; if (G.boarT <= 0) G.boar = spawnBoar(); }
  if (G.boar) { boarTick(G.boar, dt); if (G.boar.gone) G.boar = null; }
  if (G.ufo) {
    ufoTick(G.ufo, dt);
    if (G.ufo.state === 'fly') ufoHumLevel(0.07 * Math.max(0.15, 1 - Math.abs(wrapD(G.ufo.x - G.aimX)) / viewW));
    if (G.ufo.gone) { G.ufo = null; ufoHumStop(); }
  }
  for (const p of G.parts) {
    p.life -= dt;
    if (p.kind === 'blood') {
      p.vy += 950 * p.sc * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.vy > 0 && p.y >= p.ground) {
        p.life = 0;
        if (G.decals.length < 500) G.decals.push({ x: p.x, y: p.ground, rx: p.size * rand(1, 2.2), target: 0, ry: 0.4, col: p.dcol || (p.col === BRAIN ? 'rgba(205,128,148,.8)' : null) });
      }
    } else {
      p.vx *= 1 - dt * 3; p.vy *= 1 - dt * 3; p.vy -= 10 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    }
  }
  G.parts = G.parts.filter(p => p.life > 0);
  for (const f of G.puffs) f.t += dt;
  G.puffs = G.puffs.filter(f => f.t < f.life);
  for (const tl of G.tails) tl.age += dt;
  for (const d of G.decals) if (d.target && d.rx < d.target) d.rx = Math.min(d.target, d.rx + dt * 14 * (d.target / 28));
  G.kick *= Math.exp(-dt * 9);
  G.rifleKick = (G.rifleKick || 0) * Math.exp(-dt * 7);
  if (G.shotFx && (G.shotFx.t += dt) > SHOT_FX_T) G.shotFx = null; G.flash *= Math.exp(-dt * 22);

  if (G.mode === 'play' || G.mode === 'cleared') {
    const s = Math.ceil(G.time);
    elTime.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    elTime.classList.toggle('warn', G.mode === 'play' && G.time <= (G.boss ? 10 : 5));
    elBar.style.transform = `scaleX(${(G.time / (G.boss ? BOSS_TIME : ROUND_TIME)).toFixed(3)})`;
  }
}

/* ---------- render ---------- */
function drawWrapped(img, p, y0, y1, left, top) {
  const vy0 = Math.max(y0, top), vy1 = Math.min(y1, top + viewH);
  if (vy1 <= vy0) return;
  for (let tx = -mod(left, W); tx < viewW; tx += W) {
    const a = Math.max(0, -tx), b = Math.min(W, viewW - tx);
    if (b <= a) continue;
    const sx = a * p, sy = (vy0 - y0) * p;
    const sw = Math.min((b - a) * p, img.width - sx), sh = Math.min((vy1 - vy0) * p, img.height - sy);
    if (sw <= 0 || sh <= 0) continue;
    ctx.drawImage(img, sx, sy, sw, sh, (tx + a) * P, (vy0 - top) * P, (b - a) * P + 1, (vy1 - vy0) * P);
  }
}

// Tail: long, tapered and scaly. Bare rat tails throw back the IR lamp, so it is drawn pale with a dark
// outline and dark rings, which keeps it readable on grey concrete and dirt.
// The tail's curve in the rat's local coordinates (a cubic Bézier from the rump to the tip, wagging as it moves).
// t runs 0 (rump) to 1 (tip); r.tailCut (default 1) is where a shot snipped it off.
function tailCurve(r) {
  const dead = !r.alive;
  const w = dead ? 0 : Math.sin(r.phase * 0.5 + r.sniff * 2.2) * (r.state === 'stop' ? 0.35 : 1);
  return [-50, -9, -88, dead ? -16 : -1 + w * 4, -122, dead ? -20 : -2 - w * 10, dead ? -150 : -158, dead ? -8 : -3 + w * 12];
}
function tailPoint(P, t) {
  const [x0, y0, c1x, c1y, c2x, c2y, x1, y1] = P, it = 1 - t;
  const x = it * it * it * x0 + 3 * it * it * t * c1x + 3 * it * t * t * c2x + t * t * t * x1;
  const y = it * it * it * y0 + 3 * it * it * t * c1y + 3 * it * t * t * c2y + t * t * t * y1;
  const tx = 3 * it * it * (c1x - x0) + 6 * it * t * (c2x - c1x) + 3 * t * t * (x1 - c2x);
  const ty = 3 * it * it * (c1y - y0) + 6 * it * t * (c2y - c1y) + 3 * t * t * (y1 - c2y);
  const len = Math.hypot(tx, ty) || 1;
  return [x, y, -ty / len, tx / len, (7 * Math.pow(it, 1.3) + 1.1) / 2];   // point, normal, half-width
}
// drawTail, drawTailPart: js/draw-rats.js

// rat and king drawing (coats, costumes, drawRat): js/draw-rats.js

/* ---------- the owl: sometimes perched on a ledge in the background; shooting at it only scares it off ---------- */
const OWL_SCALE = 1.15 * FAR_K;   // sized to match the buildings it perches on
// perches are given in the buildings' own drawing coordinates, then pushed back like the buildings are
const farPt = (cx, lx, ly) => [cx + (lx - cx) * FAR_K, BASE + (ly - 600) * FAR_K];
const OWL_PERCHES = [
  [380, 120, 566], [380, 200, 566], [380, 520, 566], [380, 650, 566],                 // barn wall ledge
  [1610, 1360, 566], [1610, 1540, 566], [1610, 1860, 566],                            // coop ledge
  [2665, 2380, 566], [2665, 2520, 566], [2665, 2840, 566], [2665, 2960, 566],         // long shed ledge
  [865, 736, 468], [865, 876, 468], [865, 946, 468],                                  // fence posts
  [2122, 1986, 468], [2122, 2196, 468], [2122, 2266, 468],
  [1185, 1127, 396], [1185, 1240, 398],                                               // top of the hay stack
].map(([cx, lx, ly]) => farPt(cx, lx, ly));
function makeOwl() {
  const [x, y] = OWL_PERCHES[Math.random() * OWL_PERCHES.length | 0];
  return { x, y, s: OWL_SCALE, turn: 0, turnTarget: 0, turnT: rand(1, 3), blink: 0, fly: false, ft: 0, vx: 0, vy: 0, gone: false };
}
function owlTick(o, dt) {
  if (o.fly) {
    o.ft += dt; o.x = mod(o.x + o.vx * dt, W); o.y += o.vy * dt; o.vy -= 40 * dt;
    if (o.ft > 4) o.gone = true;
    return;
  }
  o.turnT -= dt;
  if (o.turnT <= 0) { o.turnT = rand(1.5, 4.5); o.turnTarget = [-1, -0.5, 0, 0, 0.5, 1, 1.6][Math.random() * 7 | 0]; }
  o.turn += (o.turnTarget - o.turn) * Math.min(1, dt * 5);
  if (o.blink > 0) o.blink -= dt; else if (Math.random() < dt * 0.3) o.blink = 0.15;
}
function owlHit(o, ax, ay) {
  if (o.fly) return false;
  const lx = wrapD(ax - o.x) / o.s, ly = (ay - o.y) / o.s;
  const bx = lx / 15, by = (ly + 28) / 30;
  return bx * bx + by * by <= 1;
}
function flushOwl(o) {
  o.fly = true; o.ft = 0;
  o.vx = (Math.random() < 0.5 ? -1 : 1) * rand(150, 210); o.vy = rand(-70, -40);
  for (let i = 0; i < 8; i++) G.parts.push({ kind: 'dust', x: o.x, y: o.y - 26 * o.s, vx: rand(-40, 40), vy: rand(-50, 10), size: rand(1.2, 2.4), life: rand(0.5, 0.9), max: 0.9 });
  sfxOwlFlush();
}
// drawOwl: js/draw-animals.js

/* ---------- ultra rare: a rat flying a little saucer across the yard ---------- */
const UFO_SCALE = 0.95, UFO_GROUND = 600;
function spawnUfo() {
  const side = Math.random() < 0.5 ? -1 : 1;
  return { x: mod(G.aimX - side * (viewW / 2 + 160), W), y: rand(450, 490), baseY: 0, vx: side * rand(210, 260), t: 0,
    s: UFO_SCALE, state: 'fly', hover: 0, hovered: false, rot: 0, vy: 0, smokeT: 0, sparkT: 0, life: 0 };
}
function ufoTick(u, dt) {
  u.t += dt;
  if (u.state === 'fly') {
    if (!u.baseY) u.baseY = u.y;
    u.life += dt;
    const d = wrapD(u.x - G.aimX);
    // stops once over the yard to shine its beam down, then carries on and leaves
    if (!u.hovered && Math.abs(d) < viewW * 0.18) { u.hovered = true; u.hover = rand(1.2, 2); }
    if (u.hover > 0) u.hover -= dt;
    else u.x = mod(u.x + u.vx * dt + Math.sin(u.t * 3.1) * 40 * dt, W);
    u.y = u.baseY + Math.sin(u.t * 2.3) * 8;
    u.rot = Math.sin(u.t * 1.7) * 0.06 + (u.hover > 0 ? 0 : Math.sign(u.vx) * 0.05);
    if (u.life > 4 && Math.abs(d) > viewW * 0.9) u.gone = true;
  } else if (u.state === 'fall') {
    // shot down: spins, trails smoke and drops into the yard
    u.vy += 420 * dt; u.y += u.vy * dt; u.x = mod(u.x + u.vx * 0.35 * dt, W); u.rot += dt * 7 * Math.sign(u.vx);
    u.smokeT -= dt;
    if (u.smokeT <= 0) { u.smokeT = 0.03; G.parts.push({ kind: 'dust', x: u.x, y: u.y, vx: rand(-20, 20), vy: rand(-40, -10), size: rand(3, 6), life: rand(0.6, 1.1), max: 1.1 }); }
    if (u.y >= UFO_GROUND) crashUfo(u);
  } else {
    u.sparkT -= dt;
    if (u.sparkT <= 0) {
      u.sparkT = rand(0.15, 0.6);
      for (let i = 0; i < 3; i++) G.parts.push({ kind: 'blood', col: 'rgba(255,240,200,.95)', dcol: 'rgba(0,0,0,0)', x: u.x + rand(-20, 20), y: u.y - 12,
        vx: rand(-80, 80), vy: rand(-160, -60), ground: u.y + 4, size: rand(0.8, 1.5), life: 1, sc: 0.6 });
      G.parts.push({ kind: 'dust', x: u.x + rand(-10, 10), y: u.y - 16, vx: rand(-10, 10), vy: -30, size: rand(3, 5), life: 1, max: 1 });
    }
  }
}
function ufoHit(u, ax, ay) {
  if (u.state !== 'fly') return null;
  const dx = wrapD(ax - u.x) / u.s, dy = (ay - u.y) / u.s;
  const c = Math.cos(-u.rot), sn = Math.sin(-u.rot), lx = dx * c - dy * sn, ly = dx * sn + dy * c;
  const hx = lx / 17, hy = (ly + 14) / 15;
  if (hx * hx + hy * hy <= 1) return 'head';
  const bx = lx / 42, by = ly / 11;
  return bx * bx + by * by <= 1 ? 'body' : null;
}
function shootUfo(u, zone) {
  u.state = 'fall'; u.vy = -60;
  G.kills++; G.nightKills++;
  countSpecial('ufo');
  payBounty('ufo', zone === 'head', u.x, u.y - 24);
  elKills.textContent = G.kills;
  elKillBox.classList.remove('bump'); void elKillBox.offsetWidth; elKillBox.classList.add('bump');
  for (let i = 0; i < 14; i++) G.parts.push({ kind: 'blood', col: 'rgba(255,240,200,.95)', dcol: 'rgba(0,0,0,0)', x: u.x, y: u.y, vx: rand(-200, 200), vy: rand(-220, 40), ground: UFO_GROUND, size: rand(0.8, 1.6), life: 1.2, sc: 0.7 });
  G.puffs.push({ x: u.x, y: u.y, r: 4, max: 30, life: 0.3, t: 0, col: [230, 240, 255] });
  if (zone === 'head') headshot();
  sfxUfoHit();
}
function crashUfo(u) {
  u.state = 'crashed'; u.y = UFO_GROUND; u.rot = 0.32 * Math.sign(u.vx || 1);
  for (let i = 0; i < 18; i++) G.parts.push({ kind: 'dust', x: u.x + rand(-30, 30), y: u.y - 8, vx: rand(-90, 90), vy: rand(-120, -20), size: rand(3, 7), life: rand(0.6, 1.2), max: 1.2 });
  G.decals.push({ x: u.x, y: u.y + 2, rx: 10, target: 46, ry: 0.25, col: 'rgba(14,16,15,.8)' });
  G.kick = Math.max(G.kick, 0.6);
  sfxUfoCrash();
}
// drawUfo: js/draw-animals.js

/* ---------- the jackal: on some nights one trots across the yard without stopping; one hit kills it, 2 coins ---------- */
// JACKAL_* numbers: js/config.js
function spawnJackal() {
  const lane = JACKAL_LANES[Math.random() * JACKAL_LANES.length | 0], L = LANES[lane], side = Math.random() < 0.5 ? -1 : 1;
  sfxJackal();
  // comes in from just outside one edge of the view and heads for the other
  return { x: mod(G.aimX + side * (viewW / 2 + 160), W), y: L.y + rand(-L.j, L.j), lane, sc: L.sc, dir: -side,
    ph: Math.random() * 6, alive: true, deadT: 0, run: 0, slide: 0 };
}
function jackalTick(j, dt) {
  if (!j.alive) {
    j.deadT += dt;
    if (j.slide > 1) { j.x = mod(j.x + j.dir * j.slide * dt, W); j.slide *= Math.exp(-dt * 6); }
    return;
  }
  const sp = JACKAL_SPEED * j.sc;
  j.x = mod(j.x + j.dir * sp * dt, W); j.run += sp * dt;
  j.ph += sp * dt / (JACKAL_STRIDE * j.sc) * Math.PI * 2;
  if (j.run > viewW + 700) j.gone = true;   // well past the far edge: gone into the night
}
// head (muzzle included) or body (torso and neck); legs and tail don't count
function jackalHit(j, ax, ay) {
  if (!j.alive) return null;
  const bob = -Math.abs(Math.sin(j.ph)) * 3;
  const lx = wrapD(ax - j.x) / j.sc * j.dir, ly = (ay - j.y) / j.sc - bob;
  let ex = (lx - 118) / 36, ey = (ly + 168) / 22;
  if (ex * ex + ey * ey <= 1) return 'head';
  ex = (lx - 66) / 26; ey = (ly + 140) / 32;
  const bx = (lx + 14) / 92, by = (ly + 112) / 30;
  return ex * ex + ey * ey <= 1 || bx * bx + by * by <= 1 ? 'body' : null;
}
function shootJackal(j, zone, ax, ay) {
  j.alive = false; j.deadT = 0; j.slide = JACKAL_SPEED * j.sc * 0.5;
  countSpecial('jackal');
  payBounty('jackal', zone === 'head', j.x, j.y - 150 * j.sc);
  const s = j.sc * 1.6, body = { sc: s, y: j.y }, delay = 0.04 + 0.025 * (LANES.length - 1 - j.lane);
  spray(body, ax, ay, 22, BLOOD);
  G.puffs.push({ x: ax, y: ay, r: 4 * s, max: 34 * s, life: 0.35, t: 0, col: [45, 12, 14] });
  G.decals.push({ x: j.x + j.dir * 30 * j.sc, y: j.y + 1, rx: 4 * j.sc, target: rand(40, 55) * j.sc, ry: 0.3 });
  if (zone === 'head') { spray(body, ax, ay, 12, BRAIN, 1.2, 1.3); headshot(); }
  sfxHit(delay); sfxYelp(delay + 0.02);
}
// drawJackalAt: js/draw-animals.js
// sfxJackal, sfxYelp: js/audio.js
// drawJackal: js/draw-animals.js

/* ---------- the wild boar: on some nights one wanders across, stops once to root in the dirt; 3 hits, 5 coins ---------- */
// BOAR_* numbers: js/config.js
function spawnBoar() {
  const lane = BOAR_LANES[Math.random() * BOAR_LANES.length | 0], L = LANES[lane], side = Math.random() < 0.5 ? -1 : 1;
  sfxBoar();
  return { x: mod(G.aimX + side * (viewW / 2 + 180), W), y: L.y + rand(-L.j, L.j), lane, sc: L.sc, dir: -side,
    ph: Math.random() * 6, alive: true, hp: BOAR_HP, state: 'walk', t: 0, run: 0, slide: 0, dirtT: 0, deadT: 0, hurtT: 0,
    rootAt: viewW / 2 + 180 + rand(-0.25, 0.2) * viewW, wounds: [] };
}
const boarHead = b => b.state === 'root' ? Math.min(1, b.t / 0.3, (BOAR_ROOT - b.t) / 0.3) : 0;   // 0 head up .. 1 snout in the dirt
function boarTick(b, dt) {
  b.hurtT = Math.max(0, b.hurtT - dt);
  if (!b.alive) {
    b.deadT += dt;
    if (b.slide > 1) { b.x = mod(b.x + b.dir * b.slide * dt, W); b.slide *= Math.exp(-dt * 6); }
    return;
  }
  if (b.state === 'root') {
    // snout down, digging: dirt flies, a grunt now and then
    b.t += dt; b.ph += dt * 1.5;
    if (boarHead(b) > 0.6 && (b.dirtT -= dt) <= 0) {
      b.dirtT = 0.07;
      const s = b.sc;
      G.parts.push({ kind: 'dust', x: b.x + b.dir * 150 * s, y: b.y - 4 * s, vx: b.dir * rand(-30, 90) * s, vy: rand(-150, -50) * s, size: rand(3, 7) * s, life: rand(0.4, 0.8), max: 0.8 });
    }
    if (b.t >= BOAR_ROOT) { b.state = 'walk'; b.t = 0; }
    return;
  }
  const sp = (b.state === 'charge' ? BOAR_CHARGE : BOAR_SPEED) * b.sc;
  b.x = mod(b.x + b.dir * sp * dt, W); b.run += sp * dt;
  b.ph += sp * dt / (BOAR_STRIDE * b.sc) * Math.PI * 2;
  if (b.state === 'walk' && b.rootAt && b.run >= b.rootAt) { b.state = 'root'; b.t = 0; b.rootAt = 0; sfxBoar(true); }
  if (b.state === 'charge' && b.wounds.length && Math.random() < dt * 12) {   // bleeding as it runs
    const [wx, wy] = b.wounds[Math.random() * b.wounds.length | 0];
    G.parts.push({ kind: 'blood', col: BLOOD, x: b.x + b.dir * wx * b.sc, y: b.y + wy * b.sc, vx: rand(-20, 20), vy: rand(0, 40),
      ground: b.y + rand(-3, 4), size: rand(1.4, 2.6) * b.sc, life: 2, sc: b.sc });
  }
  if (b.run > viewW + 800) b.gone = true;
}
// head (snout and tusks included) or body; legs and tail don't count
function boarHit(b, ax, ay) {
  if (!b.alive) return null;
  const lx = wrapD(ax - b.x) / b.sc * b.dir, ly = (ay - b.y) / b.sc, d = boarHead(b);
  let ex = (lx - 112 + d * 30) / 50, ey = (ly + 100 - d * 38) / 32;
  if (ex * ex + ey * ey <= 1) return 'head';
  ex = (lx + 12) / 100; ey = (ly + 104) / 46;
  return ex * ex + ey * ey <= 1 ? 'body' : null;
}
function shootBoar(b, zone, ax, ay, blasted = false) {
  const head = !blasted && zone === 'head', dmg = blasted ? NADE_DMG * hpMul() : rifleDmg() * (head ? 2 : 1);
  const s = b.sc * 1.6, body = { sc: s, y: b.y }, delay = 0.04 + 0.025 * (LANES.length - 1 - b.lane);
  b.hp -= dmg; b.hurtT = 0.25;
  spray(body, ax, ay, 16, BLOOD);
  G.puffs.push({ x: ax, y: ay, r: 4 * s, max: 30 * s, life: 0.35, t: 0, col: [45, 12, 14] });
  sfxHit(delay);
  if (b.hp > 0) {
    // wounded: squeals and charges off at full tilt, no more stopping
    if (head) headshot();
    if (b.wounds.length < 8) b.wounds.push([wrapD(ax - b.x) / b.sc * b.dir, (ay - b.y) / b.sc]);
    b.state = 'charge'; b.t = 0; b.rootAt = 0;
    sfxSqueal(delay + 0.03, 0.8);
    return;
  }
  b.alive = false; b.deadT = 0; b.slide = (b.state === 'charge' ? BOAR_CHARGE : BOAR_SPEED) * b.sc * 0.5;
  countSpecial('boar');
  payBounty('boar', head, b.x, b.y - 130 * b.sc);
  G.decals.push({ x: b.x + b.dir * 20 * b.sc, y: b.y + 1, rx: 4 * b.sc, target: rand(50, 65) * b.sc, ry: 0.3 });
  if (head) { spray(body, ax, ay, 12, BRAIN, 1.2, 1.3); headshot(); }
  sfxSqueal(delay + 0.02, 1);
}
// drawBoarAt: js/draw-animals.js
// sfxBoar, sfxSqueal: js/audio.js
// drawBoar: js/draw-animals.js

/* ---------- yard clutter: dirt mounds and junk that rats can pass behind ---------- */
const OBS_TYPES = [['mound', 0.28], ['can', 0.17], ['bag', 0.12], ['box', 0.11], ['bottle', 0.1], ['ebottle', 0.12], ['bucket', 0.1]];
const OBS_W = { mound: 130, can: 22, bag: 58, box: 48, bottle: 30, ebottle: 16, bucket: 36 };
function makeObstacles() {
  const r = rng(99), list = [];
  LANES.forEach((L, li) => {
    const want = 6 + li;
    for (let tries = 0, n = 0; n < want && tries < 300; tries++) {
      const x = r() * W;
      let t = r(), type = 'mound';
      for (const [k, w] of OBS_TYPES) if ((t -= w) <= 0) { type = k; break; }
      const off = L.slab ? 2 + r() * 3 : 5 + r() * 12;        // stay on top of the slab
      const s = L.sc * (type === 'mound' ? 0.8 + r() * 0.6 : 0.85 + r() * 0.35);
      const o = { x, y: L.y + off * L.sc, s, type, lane: li, v: r(), lying: r() < 0.55, flip: r() < 0.5 ? -1 : 1, hopT: 0, seed: (r() * 1e6) | 0 };
      const half = OBS_W[type] * s / 2;
      if (list.some(q => q.lane === li && Math.abs(wrapD(q.x - x)) < half + OBS_W[q.type] * q.s / 2 + 70 * L.sc)) continue;
      list.push(o); n++;
    }
  });
  return list;
}
const moundH = o => 22 + o.v * 22;
function obsHit(o, ax, ay) {
  const lx = wrapD(ax - o.x) / o.s * o.flip, ly = (ay - o.y) / o.s;
  if (ly > 1) return false;
  switch (o.type) {
    case 'mound': { const w = 65, h = moundH(o); return Math.abs(lx) <= w && ly >= -h * (1 - (lx / w) ** 2); }
    case 'can': return o.lying ? Math.abs(lx) <= 12 && ly >= -13 : Math.abs(lx) <= 8 && ly >= -21;
    case 'bag': { const bx = lx / 29, by = (ly + 13) / 15; return bx * bx + by * by <= 1; }
    case 'box': return Math.abs(lx) <= 25 && ly >= -30;
    case 'bottle': return lx >= -13 && lx <= 16 && ly >= -10;
    case 'bucket': return Math.abs(lx) <= 17 && ly >= -29;
    case 'ebottle': return o.broken ? Math.abs(lx) <= 7 && ly >= -12 : (Math.abs(lx) <= 7 && ly >= -27) || (Math.abs(lx) <= 3 && ly >= -44);
  }
  return false;
}
// drawObs (and its metal() helper): js/draw-scene.js
function hitObstacle(o, ax, ay, blasted = false) {
  if (blasted && o.type !== 'ebottle' && o.type !== 'can' && o.type !== 'bucket' && o.type !== 'bottle') return;
  if (o.type === 'ebottle' && !o.broken) {
    o.broken = true;
    spray({ sc: o.s, y: o.y }, ax, ay, 16, 'rgba(225,238,232,.9)', 0.9, 0.7, 'rgba(225,238,232,.55)');
    G.puffs.push({ x: ax, y: ay, r: 2 * o.s, max: 18 * o.s, life: 0.25, t: 0, col: [235, 245, 240] });
    sfxShatter(0.03 + 0.025 * (LANES.length - 1 - o.lane));
    return;
  }
  const hard = o.type === 'can' || o.type === 'bucket' || o.type === 'bottle';
  if (hard) {
    o.hopT = 0.45; o.x = mod(o.x + rand(4, 14) * o.s * (Math.random() < 0.5 ? -1 : 1), W);
    sfxPing(0.03 + 0.025 * (LANES.length - 1 - o.lane), o.type === 'bottle');
    G.puffs.push({ x: ax, y: ay, r: 2 * o.s, max: 14 * o.s, life: 0.2, t: 0, col: [230, 238, 234] });
  }
  if (!blasted) missPuff(ax, ay);
}

function render() {
  const top = G.aimY - viewH / 2 - G.kick * 26;
  const left = G.aimX - viewW / 2 + G.kickX * G.kick * 6;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#0f1312'; ctx.fillRect(0, 0, cv.width, cv.height);
  if (!grImg) return;
  drawWrapped(skyImg, Psky, SKY_Y0, SKY_Y1, left, top);
  drawWrapped(grImg, Pgr, GR_Y0, GR_Y1, left, top);
  if (top + viewH > GR_Y1) { ctx.fillStyle = '#3c403f'; ctx.fillRect(0, Math.floor((GR_Y1 - top) * P) - 1, cv.width, cv.height); }

  ctx.setTransform(P, 0, 0, P, 0, 0);
  const rel = x => mod(x - left + 200, W) - 200;
  const vis = x => x < viewW + 200;
  for (const d of G.decals) {
    const x = rel(d.x); if (!vis(x)) continue;
    ctx.fillStyle = d.col || 'rgba(34,9,11,.78)'; ell(ctx, x, d.y - top, d.rx, d.rx * d.ry);
  }
  // snipped-off tails lying in the dirt: they drop, twitch for a couple of seconds, then lie still
  for (const tl of G.tails) {
    const x = rel(tl.x); if (!vis(x)) continue;
    const a = tl.age, fall = Math.min(1, a / 0.18), tw = Math.sin(a * 24) * Math.exp(-a * 1.6) * (a < 3 ? 1 : 0);
    const P = tl.P.slice(); P[3] += tw * 6; P[5] -= tw * 12; P[7] += tw * 14;
    ctx.save(); ctx.translate(x, tl.y - top + fall * 6 * tl.sc); ctx.scale(tl.sc * tl.dir, tl.sc);
    drawTailPart(ctx, P, tl.t0, tl.t1, tl.variant);
    ctx.restore();
  }
  // rats and clutter drawn back to front, so things nearer the shooter hide what is behind them
  const ents = [];
  for (const r of G.rats) { const x = rel(r.x); if (vis(x)) ents.push([r.y, 0, r, x]); }
  for (const o of G.obs) { const x = rel(o.x); if (vis(x)) ents.push([o.y, 1, o, x]); }
  if (G.owl) { const x = rel(G.owl.x); if (vis(x)) ents.push([G.owl.fly ? 0 : G.owl.y, 2, G.owl, x]); }
  if (G.ufo) { const x = rel(G.ufo.x); if (vis(x)) ents.push([G.ufo.state === 'fly' ? 540 : G.ufo.y, 3, G.ufo, x]); }
  if (G.jackal) { const x = rel(G.jackal.x); if (x > -300 && x < viewW + 300) ents.push([G.jackal.y, 4, G.jackal, x]); }
  if (G.boar) { const x = rel(G.boar.x); if (x > -300 && x < viewW + 300) ents.push([G.boar.y, 5, G.boar, x]); }
  ents.sort((a, b) => a[0] - b[0]);
  for (const [, k, e, x] of ents) {
    if (k === 5) drawBoarAt(ctx, e, x, e.y - top);
    else if (k === 4) drawJackalAt(ctx, e, x, e.y - top);
    else if (k === 3) drawUfo(ctx, e, x, e.y - top);
    else if (k === 2) drawOwl(ctx, e, x, e.y - top);
    else if (k) drawObs(ctx, e, x, e.y - top);
    else drawRat(ctx, e, x + e.jx, e.y + e.jy - top);
  }
  for (const p of G.parts) {
    const x = rel(p.x); if (!vis(x)) continue;
    if (p.kind === 'blood') { ctx.fillStyle = p.col; ell(ctx, x, p.y - top, p.size, p.size); }
    else { ctx.fillStyle = `rgba(170,176,172,${(0.45 * Math.max(0, p.life / p.max)).toFixed(3)})`; ell(ctx, x, p.y - top, p.size, p.size); }
  }
  for (const f of G.puffs) {
    const x = rel(f.x); if (!vis(x)) continue;
    const k = f.t / f.life, rr = f.r + (f.max - f.r) * Math.sqrt(k);
    if (f.glow) {   // grenade fireball: white-hot core, added light
      const a = 1 - k * k, gg = ctx.createRadialGradient(x, f.y - top - rr * 0.2, 0, x, f.y - top - rr * 0.2, rr);
      gg.addColorStop(0, `rgba(255,255,250,${a.toFixed(3)})`); gg.addColorStop(0.5, `rgba(236,240,232,${(0.85 * a).toFixed(3)})`);
      gg.addColorStop(0.8, `rgba(150,156,150,${(0.5 * a).toFixed(3)})`); gg.addColorStop(1, 'rgba(120,125,120,0)');
      ctx.fillStyle = gg; ell(ctx, x, f.y - top - rr * 0.2, rr, rr * 0.75);
      continue;
    }
    if (f.ring) {   // shock wave racing out along the ground
      ctx.strokeStyle = `rgba(225,232,228,${(0.6 * (1 - k)).toFixed(3)})`; ctx.lineWidth = Math.max(1, 5 * (1 - k));
      ctx.beginPath(); ctx.ellipse(x, f.y - top, rr, rr * 0.38, 0, 0, Math.PI * 2); ctx.stroke();
      continue;
    }
    ctx.fillStyle = f.col ? `rgba(${f.col.join(',')},${(0.55 * (1 - k)).toFixed(3)})` : `rgba(180,186,182,${(0.35 * (1 - k)).toFixed(3)})`;
    ell(ctx, x, f.y - top, rr, rr * 0.8);
  }

  // night-vision post
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const ns = 1.6 * dpr, ox = Math.random() * 128 * ns, oy = Math.random() * 128 * ns;
  ctx.setTransform(ns, 0, 0, ns, -ox, -oy);
  ctx.fillStyle = noisePats[(Math.random() * noisePats.length) | 0];
  ctx.fillRect(0, 0, (cv.width + ox) / ns + 2, (cv.height + oy) / ns + 2);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = scanPat; ctx.fillRect(0, 0, cssW, cssH);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = `rgba(220,232,226,${(0.015 + Math.random() * 0.02).toFixed(3)})`; ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = vignette; ctx.fillRect(0, 0, cv.width, cv.height);
  if (G.flash > 0.02) { ctx.fillStyle = `rgba(235,245,240,${(0.42 * G.flash).toFixed(3)})`; ctx.fillRect(0, 0, cv.width, cv.height); }

  // coin rewards rising from each kill
  if (G.pops.length) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (const p of G.pops) {
      if (p.t < 0) continue;                                   // staggered: coins pop out one after another
      const x = rel(p.x); if (!vis(x)) continue;
      const k = p.t / p.life, ease = 1 - (1 - k) * (1 - k);
      const sx = x * P + p.vx * p.t * dpr, sy = (p.y - top) * P - ease * p.rise * dpr;
      const r = 10 * dpr, w = Math.abs(Math.cos(p.t * p.spin)) * 0.75 + 0.25;   // turning coin
      ctx.globalAlpha = k < 0.55 ? 1 : Math.max(0, 1 - (k - 0.55) / 0.45);
      const cg = ctx.createRadialGradient(sx - r * 0.3, sy - r * 0.35, r * 0.1, sx, sy, r);
      cg.addColorStop(0, '#fff2b8'); cg.addColorStop(0.5, '#ffbe4a'); cg.addColorStop(1, '#a8701a');
      ctx.fillStyle = cg; ctx.beginPath(); ctx.ellipse(sx, sy, r * w, r, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(90,55,10,.9)'; ctx.lineWidth = 1.2 * dpr; ctx.stroke();
      ctx.strokeStyle = 'rgba(120,75,15,.7)'; ctx.beginPath(); ctx.ellipse(sx, sy, r * w * 0.6, r * 0.6, 0, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }
  if (G.nade) drawNadeFlight(rel, top);
  if (G.mode !== 'menu' && G.mode !== 'over') {
    // swapping weapons: one drops out of view before the other comes up
    G.muzzleScr = null;
    if (showRifle && G.wpn < 0.5) drawRifle(G.wpn * 2);
    if (showRifle && G.wpn > 0.5) drawHand((1 - G.wpn) * 2);
    if (G.shotFx) drawShotFx(rel, top);
    if (G.armed) drawBombSight(); else drawCrosshair();
  }
  if (drag.id !== null && G.mode === 'play') drawStick();
}

// grenade, hand, rifles, shot effects, sights, joystick, crosshair: js/draw-weapons.js

/* ---------- boot ---------- */
let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (!G.paused) update(dt);
  render();
  requestAnimationFrame(frame);
}
function boot() {
  resize();
  checkOrientation();
  updateFsBtn();
  G.obs = makeObstacles();
  G.owl = makeOwl();
  for (let i = 0; i < 4; i++) spawnRat(true);
  window.addEventListener('resize', resize);
  requestAnimationFrame(frame);
}
const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
Promise.race([fontsReady, new Promise(r => setTimeout(r, 1500))]).then(boot);
