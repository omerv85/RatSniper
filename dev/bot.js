// Balance-testing bot for Rat Sniper. It plays whole games inside the real game code, fast-forwarded and silent.
// Use: run `node dev/serve.js`, open http://localhost:8768/test, then in the console:
//   eval(await (await fetch('/dev/bot.js')).text());
//   await botRun({ games: 30, skill: 'average', policy: 'save', prices: [10, 10, 10], hpStep: 6 })
// skill: casual (reaction 1.0 s, aim error sigma 13 world units), average (0.75 s, 9), good (0.55 s, 6)
// policy: 'never' (never upgrades the rifle, spends everything on bullets), 'save' (keeps 15 bullets, then saves
//   coins for the next rifle and buys it as soon as it can), 'classic' (old game: no upgrades and no tougher rats)
// Returns { median, mean, p25, p75, tier, upNights } and logs a summary line.
window.botRun = async function ({ games = 20, skill = 'average', policy = 'save', prices = null, hpStep = 6, maxNight = 80, seedLog = false, sigma = null } = {}) {
  const T = window.__t, G = T.G;
  const SK = { casual: { react: 1.0, sigma: 13, head: 0.15 }, average: { react: 0.75, sigma: 9, head: 0.3 }, good: { react: 0.55, sigma: 6, head: 0.5 } }[skill];
  if (sigma) SK.sigma = sigma;
  const oldPrices = T.UPGRADE_PRICE.slice();
  let shots = 0, kills = 0;
  if (prices) prices.forEach((p, i) => { T.UPGRADE_PRICE[i] = p; });
  T.setHpStep(policy === 'classic' ? 1e9 : hpStep);
  const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const rand = (a, b) => a + Math.random() * (b - a);
  const dt = 1 / 30, results = [];
  const wasPaused = G.paused; G.paused = true;

  // where a rat's head and body are right now: scan its hit zones on a grid (exact, whatever the pose)
  function zones(r) {
    const s = r.sc, head = [], body = [];
    for (let x = -130; x <= 130; x += 6) for (let y = -100; y <= 12; y += 6) {
      const ax = r.x + x * s, ay = r.y + y * s, h = T.hitTest(r, ax, ay);
      if (h && h.zone === 'head') head.push([ax, ay]); else if (h && h.zone === 'body') body.push([ax, ay]);
    }
    const mid = pts => pts.length ? [pts.reduce((a, p) => a + p[0], 0) / pts.length, pts.reduce((a, p) => a + p[1], 0) / pts.length] : null;
    return { head: mid(head), body: mid(body) };
  }
  // the busiest spot for a grenade: the rat with the most others close by
  function cluster() {
    let best = null, bn = 0;
    const alive = G.rats.filter(r => r.alive && r.state !== 'emerge');
    for (const r of alive) {
      const n = alive.filter(o => Math.abs(o.x - r.x) < 120 * r.sc && Math.abs(o.y - r.y) < 60).length + (r.king ? 3 : 0);
      if (n > bn) { bn = n; best = r; }
    }
    return { r: best, n: bn };
  }
  function shop() {
    const next = () => G.rifle < T.RIFLES.length - 1 ? T.packPrice('rifle') : Infinity;
    const buyBullets = untilAmmo => {
      while (G.ammo < untilAmmo) {
        if (G.coins >= T.packPrice(1) && untilAmmo - G.ammo > 5) T.buyPack(1);
        else if (G.coins >= T.packPrice(0)) T.buyPack(0);
        else break;
      }
    };
    if (policy === 'save') {
      buyBullets(15);
      while (G.coins >= next() && G.ammo >= 10) { T.buyPack('rifle'); stats.up.push(G.night); }
      if (next() === Infinity) buyBullets(1e9);   // nothing left to save for
    } else buyBullets(1e9);
    if (G.ammo >= 25 && G.coins >= T.packPrice('nade') && (policy !== 'save' || next() === Infinity)) T.buyPack('nade');
    G.breakT = 0.0001;
  }

  let stats;
  for (let g = 0; g < games; g++) {
    T.startGame(1); T.A.ctx = null; T.A.muted = true;
    stats = { up: [] };
    let plan = null, guard = 0;
    while (G.mode !== 'over' && G.night <= maxNight && guard++ < 2e6) {
      for (const r of G.rats) { r._vx = ((r.x - (r._px ?? r.x)) / dt); r._vy = ((r.y - (r._py ?? r.y)) / dt); r._px = r.x; r._py = r.y; }
      if (G.mode === 'play') {
        // grenades: on a crowd, on the king, or when the bullets are gone
        if (G.grenades > 0 && !G.nade && G.clock - G.throwT > 1) {
          const c = cluster();
          if (c.r && (c.n >= 3 || G.ammo <= 0)) {
            G.aimX = c.r.x + gauss() * SK.sigma * 2; G.aimY = c.r.y - 20 * c.r.sc + gauss() * SK.sigma;
            T.setArmed(true); T.throwNade();
          }
        }
        const ready = G.clock - G.lastShot >= 0.56 && G.ammo > 0 && !G.armed && G.clock - G.throwT > 0.6;
        if (ready && !plan) {
          const alive = G.rats.filter(r => r.alive && !r.sinking);
          if (alive.length) {
            // nearest to where we're already aiming, bigger (nearer) rats first
            alive.sort((a, b) => (Math.abs(a.x - G.aimX) / (a.sc + 0.3) - Math.abs(b.x - G.aimX) / (b.sc + 0.3)));
            const r = alive[0];
            plan = { r, at: G.clock + SK.react * rand(0.6, 1.4) * (r === plan?.r ? 0.6 : 1), until: G.clock + SK.react * 2.5, head: Math.random() < SK.head };
          }
        }
        if (plan && G.clock >= plan.at) {
          const r = plan.r;
          if (!r.alive || r.gone) plan = null;
          else {
            const sp = Math.hypot(r._vx, r._vy);
            if (sp > 40 && G.clock < plan.until && r.state !== 'emerge') { /* wait for it to stop */ }
            else if (ready) {
              const z = zones(r), p = (plan.head && z.head) || z.body || z.head;
              if (p) {
                const lead = 0.08 + gauss() * 0.06;   // reaction lag, partly made up for
                G.aimX = p[0] + r._vx * lead + gauss() * SK.sigma;
                G.aimY = p[1] + r._vy * lead + gauss() * SK.sigma;
                T.fire(); shots++;
              }
              plan = null;
            }
          }
        }
      } else if (G.mode === 'cleared') { plan = null; shop(); }
      T.update(dt);
    }
    kills += G.kills;
    results.push({ nights: G.night - 1, kills: G.kills, tier: G.rifle, up: stats.up });
    if (seedLog) console.log(g, G.night - 1, G.rifle, stats.up.join(','));
    await new Promise(r => { const ch = new MessageChannel(); ch.port1.onmessage = r; ch.port2.postMessage(0); });   // yield without timer throttling (hidden tabs)
  }
  T.UPGRADE_PRICE.splice(0, 3, ...oldPrices); T.setHpStep(6);
  G.paused = wasPaused;
  const n = results.map(r => r.nights).sort((a, b) => a - b), q = f => n[Math.min(n.length - 1, Math.floor(f * n.length))];
  const upAt = [0, 1, 2].map(i => { const v = results.filter(r => r.up.length > i).map(r => r.up[i]).sort((a, b) => a - b); return v.length ? `${v[v.length >> 1]}(${v.length})` : '-'; });
  const out = { skill, policy, prices: prices || oldPrices, hpStep, median: q(0.5), p25: q(0.25), p75: q(0.75), mean: +(n.reduce((a, b) => a + b, 0) / n.length).toFixed(1),
    acc: +(kills / Math.max(1, shots)).toFixed(2), tierAvg: +(results.reduce((a, r) => a + r.tier, 0) / results.length).toFixed(2), upgradeNight: upAt.join(' / ') };
  console.log(JSON.stringify(out));
  return out;
};
