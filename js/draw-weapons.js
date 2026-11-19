'use strict';
/* Rat Sniper: drawing the player's side. Grenade and hand, the four rifles and their shot effects,
   One of the game's plain scripts (see index.html); they share one global scope, so names here are
   used directly by js/game.js and the other files.
   the blast sight, the joystick and the crosshair. */

/* ---------- grenade drawing ---------- */
// a "pineapple" fragmentation grenade: an egg-shaped body cut into a grid of square lugs, the fuse on top,
// the lever (spoon) down its right side and the pull ring at the front (r: half the body's height, in px)
function drawGrenade(x, y, r, rot, ring = true) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const rx = r * 0.78, lw = Math.max(1, r * 0.035);
  ctx.lineJoin = 'round';
  // fuse neck and cap
  ctx.strokeStyle = 'rgba(0,0,0,.85)'; ctx.lineWidth = lw;
  const fg = ctx.createLinearGradient(-r * 0.3, 0, r * 0.3, 0);
  fg.addColorStop(0, '#4c504d'); fg.addColorStop(0.35, '#9ea39f'); fg.addColorStop(1, '#30332f');
  ctx.fillStyle = fg;
  ctx.beginPath(); ctx.rect(-r * 0.24, -r * 1.12, r * 0.48, r * 0.24); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.rect(-r * 0.3, -r * 1.3, r * 0.6, r * 0.2); ctx.fill(); ctx.stroke();
  // body: dark metal, then the lugs, then shading round the edge
  ctx.beginPath(); ctx.ellipse(0, 0, rx, r, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#1d201e'; ctx.fill();
  ctx.save(); ctx.clip();
  const ROWS = 6, COLS = 5;
  for (let i = 0; i < ROWS; i++) {
    const v0 = -1 + (i + 0.12) * 2 / ROWS, v1 = -1 + (i + 0.88) * 2 / ROWS;     // row band, -1..1
    for (let j = 0; j < COLS; j++) {
      const a0 = -Math.PI / 2 + (j + 0.14) * Math.PI / COLS, a1 = -Math.PI / 2 + (j + 0.86) * Math.PI / COLS;
      const vm = (v0 + v1) / 2, wide = Math.sqrt(Math.max(0, 1 - vm * vm));      // the body narrows toward the ends
      const x0 = Math.sin(a0) * rx * wide, x1 = Math.sin(a1) * rx * wide, y0 = v0 * r, y1 = v1 * r;
      const face = Math.cos((a0 + a1) / 2) * (1 - Math.abs(vm) * 0.5);              // lugs facing us catch the IR lamp
      const lg = ctx.createLinearGradient(x0, y0, x1, y1);
      const hi = Math.round(92 + 112 * face), lo = Math.round(48 + 58 * face);
      lg.addColorStop(0, `rgb(${hi},${hi + 4},${hi})`); lg.addColorStop(1, `rgb(${lo},${lo + 3},${lo})`);
      ctx.fillStyle = lg;
      const rr = Math.min(Math.abs(x1 - x0), y1 - y0) * 0.2;
      ctx.beginPath(); ctx.roundRect ? ctx.roundRect(Math.min(x0, x1), y0, Math.abs(x1 - x0), y1 - y0, rr) : ctx.rect(Math.min(x0, x1), y0, Math.abs(x1 - x0), y1 - y0);
      ctx.fill();
    }
  }
  const sh = ctx.createRadialGradient(-rx * 0.3, -r * 0.35, r * 0.1, 0, 0, r * 1.05);
  sh.addColorStop(0, 'rgba(255,255,255,.08)'); sh.addColorStop(0.6, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.75)');
  ctx.fillStyle = sh; ctx.fillRect(-rx, -r, rx * 2, r * 2);
  ctx.restore();
  ctx.strokeStyle = 'rgba(0,0,0,.9)'; ctx.lineWidth = lw * 1.4;
  ctx.beginPath(); ctx.ellipse(0, 0, rx, r, 0, 0, Math.PI * 2); ctx.stroke();
  // lever: a flat strip from the top of the fuse, out and down the right side
  const lever = () => { ctx.beginPath(); ctx.moveTo(-r * 0.05, -r * 1.3); ctx.lineTo(r * 0.42, -r * 1.24); ctx.quadraticCurveTo(r * 0.72, -r * 1.05, rx * 0.98, -r * 0.45); ctx.lineTo(rx * 1.02, r * 0.25); };
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(0,0,0,.9)'; ctx.lineWidth = r * 0.17; lever(); ctx.stroke();
  ctx.strokeStyle = '#8b908c'; ctx.lineWidth = r * 0.1; lever(); ctx.stroke();
  ctx.strokeStyle = 'rgba(220,226,222,.5)'; ctx.lineWidth = r * 0.03; lever(); ctx.stroke();
  ctx.lineCap = 'butt';
  if (ring) {   // pull ring hanging at the front of the fuse
    ctx.strokeStyle = 'rgba(0,0,0,.8)'; ctx.lineWidth = Math.max(1.5, r * 0.12);
    ctx.beginPath(); ctx.ellipse(r * 0.08, -r * 0.92, r * 0.3, r * 0.27, -0.2, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#c9cec9'; ctx.lineWidth = Math.max(1, r * 0.065);
    ctx.beginPath(); ctx.ellipse(r * 0.08, -r * 0.92, r * 0.3, r * 0.27, -0.2, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}
// first person: a bare right hand gripping the grenade low on the right, where the rifle was; it swings forward on the throw.
// Skin throws back the IR lamp, so the hand reads pale, like the rats' bare feet.
function drawHand(drop) {
  const Wc = cv.width, Hc = cv.height, u = Hc / 600;
  const tk = (G.clock - G.throwT) / THROW_T, throwing = tk >= 0 && tk < 1, s = throwing ? Math.sin(tk * Math.PI) : 0;
  let ox = Wc - 215 * u + Math.sin(G.clock * 1.3) * 3 * u, oy = Hc - 95 * u + Math.sin(G.clock * 2.1) * 2 * u + drop * 440 * u;
  ox -= 230 * u * s; oy -= 170 * u * s - 60 * u * Math.max(0, tk - 0.5) * (throwing ? 1 : 0);
  const sc = 1 - 0.32 * s, rot = 0.12 - 0.7 * s;
  ctx.save(); ctx.translate(ox, oy); ctx.rotate(rot); ctx.scale(sc * u, sc * u);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const OUT = 'rgba(14,16,15,.9)', SKIN = '#aaa4a1', SKIN_HI = '#d2ccc9', SKIN_LO = '#6c6765';
  // a finger or thumb: dark outline, skin, a lit upper edge
  const digit = (pts, w) => {
    const path = () => { ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); ctx.quadraticCurveTo(pts[2], pts[3], pts[4], pts[5]); };
    ctx.strokeStyle = OUT; ctx.lineWidth = w + 4; path(); ctx.stroke();
    ctx.strokeStyle = SKIN; ctx.lineWidth = w; path(); ctx.stroke();
    ctx.strokeStyle = 'rgba(40,38,37,.35)'; ctx.lineWidth = w * 0.35;
    ctx.save(); ctx.translate(0, w * 0.22); path(); ctx.stroke(); ctx.restore();
    ctx.strokeStyle = 'rgba(232,228,225,.55)'; ctx.lineWidth = w * 0.22;
    ctx.save(); ctx.translate(0, -w * 0.24); path(); ctx.stroke(); ctx.restore();
  };
  const nail = (x, y, rx, ry, a) => {
    ctx.fillStyle = SKIN_HI; ctx.strokeStyle = 'rgba(60,57,55,.7)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(x, y, rx, ry, a, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  };
  // forearm running off the bottom right corner (long enough to stay off screen mid-swing)
  const ag = ctx.createLinearGradient(-30, 0, 150, 0);
  ag.addColorStop(0, SKIN_LO); ag.addColorStop(0.4, "#8f8a88"); ag.addColorStop(1, "#3c3938");
  ctx.fillStyle = ag; ctx.strokeStyle = OUT; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-14, 50); ctx.quadraticCurveTo(10, 200, 90, 720); ctx.lineTo(270, 720); ctx.quadraticCurveTo(130, 220, 88, 40); ctx.closePath(); ctx.fill(); ctx.stroke();
  // palm cupped behind the lower half of the grenade
  const pg = ctx.createRadialGradient(10, 20, 10, 20, 30, 80);
  pg.addColorStop(0, SKIN); pg.addColorStop(1, SKIN_LO);
  ctx.fillStyle = pg;
  ctx.beginPath(); ctx.ellipse(22, 22, 66, 58, -0.15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  if (G.clock - G.throwT > THROW_T + 0.4) drawGrenade(0, -42, 66, -0.08);   // gone from the hand once thrown
  // thumb up the right side, pressing the lever down
  // fleshy base of the thumb swelling out of the palm, then two segments bent at the joint, nail along the tip
  const tb = ctx.createRadialGradient(56, 0, 6, 62, 18, 48);
  tb.addColorStop(0, SKIN_HI); tb.addColorStop(0.5, SKIN); tb.addColorStop(1, SKIN_LO);
  ctx.fillStyle = tb; ctx.strokeStyle = OUT; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.ellipse(64, 14, 30, 44, 0.25, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  digit([70, 4, 72, -22, 62, -40], 34);                 // lower segment
  digit([62, -40, 54, -56, 40, -64], 29);               // tip, bent in over the lever
  ctx.strokeStyle = 'rgba(40,38,37,.55)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(48, -44); ctx.quadraticCurveTo(62, -38, 76, -40); ctx.stroke();   // joint crease
  nail(45, -61, 10, 7.5, -0.45);
  // four fingers wrapped round the front-left of the grenade, tips toward us
  const F = [[-76, -76, -28, -70, 31], [-82, -45, -22, -40, 32], [-80, -14, -24, -9, 31], [-70, 15, -30, 20, 27]];
  for (const [x0, y0, x1, y1, w] of F) {
    digit([x0, y0, (x0 + x1) / 2, y0 - 6, x1, y1], w);
    ctx.strokeStyle = 'rgba(40,38,37,.5)'; ctx.lineWidth = 2;                      // knuckle crease
    const cx = x0 + (x1 - x0) * 0.42; ctx.beginPath(); ctx.moveTo(cx, y0 - w * 0.35); ctx.lineTo(cx + 3, y0 + w * 0.3); ctx.stroke();
    nail(x1 - 2, y1 - 1, 8, w * 0.32, 0.15);
  }
  ctx.lineCap = 'butt';
  ctx.restore();
}
// the grenade in the air: from the hand to the aim point, arcing up and shrinking with distance
function drawNadeFlight(rel, top) {
  const n = G.nade, Wc = cv.width, Hc = cv.height, u = Hc / 600, k = Math.min(1, n.t / NADE_FLIGHT);
  const x0 = Wc - 260 * u, y0 = Hc - 300 * u, x1 = rel(n.x) * P, y1 = (n.y - top) * P;
  const e = 1 - (1 - k) * (1 - k * 0.4);
  const x = x0 + (x1 - x0) * e, y = y0 + (y1 - y0) * e - Math.sin(k * Math.PI) * Hc * 0.12;
  const r0 = 26 * u, r1 = Math.max(2.5 * dpr, 13 * scAt(n.y) * P);
  drawGrenade(x, y, r0 * Math.pow(r1 / r0, Math.pow(k, 0.6)), n.t * n.spin, false);
}
/* ---------- energy rifle shots: drawn over the scene from the muzzle to where the shot landed ---------- */
const RIFLE_COL = [null, a => `rgba(255,62,52,${a})`, a => `rgba(176,104,255,${a})`, a => `rgba(80,200,255,${a})`];
const RIFLE_HOT = [null, '#ffd2c8', '#efdcff', '#d8f6ff'];
const SHOT_FX_T = 0.6, PLASMA_FLIGHT = 0.1;
function drawShotFx(rel, top) {
  const f = G.shotFx, k = f.t, u = dpr, col = RIFLE_COL[f.tier], hot = RIFLE_HOT[f.tier];
  const tx = rel(f.x) * P, ty = (f.y - top) * P, sc = scAt(f.y);
  const [mx, my] = G.muzzleScr || [cv.width * 0.62, cv.height * 1.02];   // rifle hidden: from just below the screen
  const glow = (x, y, r, a) => {
    if (r <= 0 || a <= 0) return;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, hot); g.addColorStop(0.2, col(a)); g.addColorStop(1, col(0));
    ctx.globalAlpha = Math.min(1, a); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  };
  const ray = (x0, y0, x1, y1, w0, w1, c) => {   // a tapered stroke: wide at the muzzle, thin in the distance
    const L = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
    ctx.fillStyle = c; ctx.beginPath();
    ctx.moveTo(x0 + nx * w0, y0 + ny * w0); ctx.lineTo(x1 + nx * w1, y1 + ny * w1);
    ctx.lineTo(x1 - nx * w1, y1 - ny * w1); ctx.lineTo(x0 - nx * w0, y0 - ny * w0); ctx.closePath(); ctx.fill();
  };
  const ring = (r, a, w) => { if (a <= 0) return; ctx.strokeStyle = col(a); ctx.lineWidth = w; ctx.beginPath(); ctx.ellipse(tx, ty, r, r * 0.45, 0, 0, Math.PI * 2); ctx.stroke(); };
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = col(1); ctx.shadowBlur = 10 * u;
  if (f.tier === 1) {
    // LASER: an instant pencil-thin beam that dies in a moment, a flare at the lens and a burning dot where it lands
    const a = Math.max(0, 1 - k / 0.18);
    if (a > 0) {
      ray(mx, my, tx, ty, 5 * u * a, 1.6 * u * a, col(0.45 * a));
      ray(mx, my, tx, ty, 1.6 * u, 0.6 * u, `rgba(255,235,230,${a.toFixed(3)})`);
      glow(mx, my, 26 * u * a, a);
    }
    glow(tx, ty, (10 + 14 * sc) * u * Math.max(0, 1 - k / 0.45), Math.max(0, 1 - k / 0.45));
  } else if (f.tier === 2) {
    // PLASMA: a violet ball that flies out (shrinking with distance) and bursts in a ring on arrival
    const e = Math.min(1, k / PLASMA_FLIGHT), lerp = (a, b, s) => a + (b - a) * s;
    if (k < PLASMA_FLIGHT) {
      const x = lerp(mx, tx, e), y = lerp(my, ty, e), r = lerp(22 * u, (6 + 8 * sc) * u, e);
      const e0 = Math.max(0, e - 0.35);
      ray(lerp(mx, tx, e0), lerp(my, ty, e0), x, y, r * 0.25, r * 0.7, col(0.35));
      glow(x, y, r * 2, 1); glow(x, y, r, 1);
      glow(mx, my, 30 * u * (1 - e), 1 - e);
    } else {
      const b = (k - PLASMA_FLIGHT) / (SHOT_FX_T - PLASMA_FLIGHT), R = (16 + 60 * sc) * u;
      glow(tx, ty, R * (0.6 + 0.6 * b), Math.max(0, 1 - b * 1.6));
      ring(R * (0.3 + 1.1 * b), Math.max(0, 0.9 - b), 3 * u * (1 - b) + 0.5);
      ring(R * (0.2 + 0.7 * b), Math.max(0, 0.6 - b), 2 * u);
    }
  } else {
    // RAILGUN: a hard white-blue slug trail, a corkscrew of charged air around it that hangs and spreads, a flash where it hits
    const a = Math.max(0, 1 - k / 0.22), b = k / SHOT_FX_T;
    if (a > 0) {
      ray(mx, my, tx, ty, 9 * u * a, 2.5 * u * a, col(0.5 * a));
      ray(mx, my, tx, ty, 2.4 * u * a, 0.8 * u * a, `rgba(235,250,255,${a.toFixed(3)})`);
      glow(mx, my, 40 * u * a, a);
    }
    const L = Math.hypot(tx - mx, ty - my) || 1, nx = -(ty - my) / L, ny = (tx - mx) / L, N = 70;
    ctx.shadowBlur = 6 * u; ctx.strokeStyle = col(Math.max(0, 0.85 * (1 - b))); ctx.lineWidth = 1.6 * u * (1 - b * 0.6);
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const s = i / N, amp = (9 - 7 * s) * u * (1 + 1.6 * b), w = Math.sin(s * 24 + f.seed) * amp;
      const x = mx + (tx - mx) * s + nx * w, y = my + (ty - my) * s + ny * w - b * 10 * u;   // the trail drifts up as it fades
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
    glow(tx, ty, (14 + 30 * sc) * u * (1 - b * 0.5), Math.max(0, 1 - b * 2));
    ring((10 + 50 * sc) * u * (0.3 + b), Math.max(0, 0.8 - b), 2 * u);
  }
  ctx.restore();
}
// with a grenade in hand the cross becomes a bomb outline, and a dashed oval shows what the blast would cover
function drawBombSight() {
  const u = dpr, cx = Math.round(cv.width / 2) + 0.5, cy = Math.round(cv.height / 2) + 0.5;
  const k = scAt(G.aimY), rx = NADE_RX * k * P, ry = NADE_RY * k * P;
  ctx.save();
  ctx.strokeStyle = '#3dff6e'; ctx.fillStyle = '#3dff6e'; ctx.shadowColor = 'rgba(61,255,110,.8)'; ctx.shadowBlur = 6 * u;
  ctx.globalAlpha = 0.45; ctx.lineWidth = 1.3 * u; ctx.setLineDash([7 * u, 6 * u]);
  ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
  ctx.globalAlpha = 1; ctx.lineWidth = 1.7 * u;
  const R = 12 * u;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();                         // bomb body
  ctx.translate(cx, cy); ctx.rotate(0.75);
  ctx.strokeRect(-3.5 * u, -R - 5 * u, 7 * u, 5 * u);                                         // cap
  ctx.beginPath(); ctx.moveTo(0, -R - 5 * u); ctx.quadraticCurveTo(-1 * u, -R - 12 * u, 5 * u, -R - 14 * u); ctx.stroke();   // fuse
  const fl = 0.6 + 0.4 * Math.sin(G.clock * 30);                                              // spark
  for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + G.clock * 6; line(ctx, 5 * u, -R - 14 * u, 5 * u + Math.cos(a) * 4 * u * fl, -R - 14 * u + Math.sin(a) * 4 * u * fl); }
  ctx.rotate(-0.75);
  ctx.beginPath(); ctx.arc(0, 0, 1.4 * u, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

/* ---------- the player's rifle: first-person bolt action with a big scope, held at the right shoulder ---------- */
// A small solid 3D model (metres: x right, y down, z into the screen) projected with real perspective:
// the stock and bolt knob come in from the bottom-right corner, the scope's eyepiece sits big and close
// on the right, and the barrel runs to the middle with the muzzle just under the crosshair.
const RIFLE_CHAMBER = [0.135, 0.09, 0.22], RIFLE_MUZZLE = [0.02, 0.05, 1.3], SCOPE_UP = 0.066;
function drawRifle(drop = 0) {
  const Wc = cv.width, Hc = cv.height, cx = Wc / 2, cy = Hc / 2, f = Hc * 0.9;
  const rec = G.rifleKick || 0, since = G.clock - G.lastShot;
  const bolt = since > 0.3 && since < 0.62 ? Math.sin((since - 0.3) / 0.32 * Math.PI) : 0;   // matches the bolt sounds
  const D = RIFLE_MUZZLE.map((v, i) => v - RIFLE_CHAMBER[i]);
  // a point along the rifle (t: 0 at the chamber, 1 at the muzzle, negative toward the stock), offset up / right
  const at = (t, up = 0, right = 0) => {
    const p = [RIFLE_CHAMBER[0] + D[0] * t + right, RIFLE_CHAMBER[1] + D[1] * t - up, RIFLE_CHAMBER[2] + D[2] * t];
    p[2] -= rec * 0.05;                      // recoil pushes it back into the shoulder...
    p[1] += rec * (0.02 - 0.05 * t);         // ...and the muzzle climbs
    return p;
  };
  const P = p => [cx + f * p[0] / Math.max(0.03, p[2]), cy + f * p[1] / Math.max(0.03, p[2])];
  const R = (p, r) => f * r / Math.max(0.03, p[2]);
  const quad = (pts, fill) => {
    ctx.beginPath(); pts.forEach((p, i) => { const [x, y] = P(p); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath();
    ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.75)'; ctx.lineWidth = 1.2 * dpr; ctx.stroke();
  };
  // a box section along the rifle: we see its top face and its right side
  const box = (t0, t1, w, h, top, side, lift = 0, right = 0) => {
    const c = (t, sx, sy) => at(t, lift - sy * h, sx * w + right);
    quad([c(t0, 1, -1), c(t0, 1, 1), c(t1, 1, 1), c(t1, 1, -1)], side);
    quad([c(t0, -1, -1), c(t0, 1, -1), c(t1, 1, -1), c(t1, -1, -1)], top);
  };
  // a round tube along the rifle, shaded with a light top edge; optional cap drawn at the near end
  const tube = (t0, t1, r0, r1, up, cols, cap, capRatio = 0.85, right = 0) => {
    const p0 = at(t0, up, right), p1 = at(t1, up, right), [ax, ay] = P(p0), [bx, by] = P(p1), ra = R(p0, r0), rb = R(p1, r1);
    let dx = bx - ax, dy = by - ay; const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
    let nx = -dy, ny = dx; if (ny > 0) { nx = -nx; ny = -ny; }
    ctx.beginPath();
    ctx.moveTo(ax + nx * ra, ay + ny * ra); ctx.lineTo(bx + nx * rb, by + ny * rb);
    ctx.lineTo(bx - nx * rb, by - ny * rb); ctx.lineTo(ax - nx * ra, ay - ny * ra); ctx.closePath();
    const g = ctx.createLinearGradient(ax + nx * ra, ay + ny * ra, ax - nx * ra, ay - ny * ra);
    g.addColorStop(0, cols[0]); g.addColorStop(0.3, cols[1]); g.addColorStop(1, cols[2]);
    ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.75)'; ctx.lineWidth = 1.2 * dpr; ctx.stroke();
    const ang = Math.atan2(ny, nx);
    if (cap) { ctx.beginPath(); ctx.ellipse(ax, ay, ra, ra * capRatio, ang, 0, Math.PI * 2); ctx.fillStyle = cap; ctx.fill(); ctx.stroke(); }
    return { ax, ay, ra, ang };
  };
  const GLOSS = ['#6a6f70', '#2a2d2e', '#0b0c0c'], MATTE = ['#464a4a', '#1f2121', '#090a0a'];
  const STOCK_TOP = '#2c2f2c', STOCK_SIDE = '#171917', METAL_TOP = '#3a3e3f', METAL_SIDE = '#1c1e1f';

  ctx.save();
  // held low in the corner so it covers less of the yard
  ctx.translate(Wc * 0.03, Hc * 0.16 + drop * Hc * 0.75);
  const tier = G.rifle || 0;
  if (tier === 0) {
  // barrel and muzzle brake, furthest away
  tube(0.32, 0.97, 0.010, 0.009, 0, GLOSS);
  tube(0.95, 1.0, 0.014, 0.014, 0, MATTE);
  // forend / stock running back past the edge of the screen
  box(0.05, 0.42, 0.026, 0.024, STOCK_TOP, STOCK_SIDE, -0.02);
  box(-0.32, 0.06, 0.03, 0.03, STOCK_TOP, STOCK_SIDE, -0.02);
  // receiver with its rail on top
  box(-0.12, 0.08, 0.017, 0.016, METAL_TOP, METAL_SIDE, 0.02);
  for (let t = -0.1; t < 0.075; t += 0.018) box(t, t + 0.008, 0.012, 0.003, '#4a4f50', '#202324', 0.04);
  // bolt handle and its big knob out to the right; it slides back and forward after each shot
  { const t = -0.01 - bolt * 0.05, a = P(at(t, 0.02, 0.016)), kp = at(t - 0.01, -0.012, 0.04), k = P(kp), kr = R(kp, 0.011);
    ctx.strokeStyle = '#26292a'; ctx.lineWidth = R(kp, 0.006) * 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(k[0], k[1]); ctx.stroke(); ctx.lineCap = 'butt';
    const kg = ctx.createRadialGradient(k[0] - kr * 0.35, k[1] - kr * 0.4, kr * 0.1, k[0], k[1], kr);
    kg.addColorStop(0, '#6b7071'); kg.addColorStop(0.5, '#2a2d2e'); kg.addColorStop(1, '#0a0b0b');
    ctx.fillStyle = kg; ctx.beginPath(); ctx.arc(k[0], k[1], kr, 0, Math.PI * 2); ctx.fill(); }
  // scope rings
  for (const t of [0.02, 0.17]) box(t, t + 0.025, 0.014, 0.018, METAL_TOP, METAL_SIDE, 0.045);
  // scope: objective bell, main tube, turrets, then the big eyepiece nearest us
  tube(0.2, 0.3, 0.022, 0.03, SCOPE_UP, GLOSS);
  tube(0.03, 0.22, 0.016, 0.016, SCOPE_UP, GLOSS);
  { const top = at(0.1, SCOPE_UP + 0.016), tip = at(0.1, SCOPE_UP + 0.038), [x0, y0] = P(top), [x1, y1] = P(tip), r = R(top, 0.014);
    ctx.fillStyle = '#16191a'; ctx.fillRect(x0 - r, y1, r * 2, y0 - y1);
    ctx.strokeStyle = 'rgba(150,160,158,.35)'; ctx.lineWidth = 1 * dpr;
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(x0 + i * r / 3.5, y1 + 2); ctx.lineTo(x0 + i * r / 3.5, y0 - 2); ctx.stroke(); }
    ctx.fillStyle = '#2b2f30'; ctx.beginPath(); ctx.ellipse(x1, y1, r, r * 0.35, 0, 0, Math.PI * 2); ctx.fill(); }
  { const p = at(0.1, SCOPE_UP, 0.024), [x, y] = P(p), r = R(p, 0.013);
    ctx.fillStyle = '#16191a'; ctx.beginPath(); ctx.ellipse(x, y, r * 0.55, r, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(150,160,158,.35)'; ctx.lineWidth = 1 * dpr; ctx.stroke(); }
  tube(-0.02, 0.05, 0.026, 0.018, SCOPE_UP, GLOSS);
  const eye = tube(-0.045, -0.015, 0.027, 0.027, SCOPE_UP, MATTE, '#070808');
  { // knurled focus ring and the dark coated glass with a reflection of the night yard
    ctx.strokeStyle = 'rgba(150,160,158,.3)'; ctx.lineWidth = 1 * dpr;
    for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      const ca = Math.cos(eye.ang), sa = Math.sin(eye.ang), r0 = eye.ra * 0.86, r1 = eye.ra * 0.98;
      const p = (r) => [eye.ax + (c * r) * ca - (s * r * 0.85) * sa, eye.ay + (c * r) * sa + (s * r * 0.85) * ca];
      const [x0, y0] = p(r0), [x1, y1] = p(r1); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); }
    const r = eye.ra * 0.78;
    const lg = ctx.createRadialGradient(eye.ax - r * 0.3, eye.ay - r * 0.35, r * 0.05, eye.ax, eye.ay, r);
    lg.addColorStop(0, 'rgba(120,170,150,.9)'); lg.addColorStop(0.45, 'rgba(30,70,62,.95)'); lg.addColorStop(1, 'rgba(4,12,10,1)');
    ctx.fillStyle = lg; ctx.beginPath(); ctx.ellipse(eye.ax, eye.ay, r, r * 0.85, eye.ang, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.beginPath(); ctx.ellipse(eye.ax - r * 0.42, eye.ay - r * 0.3, r * 0.1, r * 0.3, eye.ang + 0.4, 0, Math.PI * 2); ctx.fill();
  }
  // muzzle flash on the shot
  if (rec > 0.55) {
    const [a, b] = P(at(1.03)), s = (rec - 0.55) / 0.45, Rf = (14 + 30 * s) * dpr;
    ctx.globalCompositeOperation = 'lighter';
    const fg = ctx.createRadialGradient(a, b, 0, a, b, Rf);
    fg.addColorStop(0, 'rgba(255,250,220,.95)'); fg.addColorStop(0.3, 'rgba(255,220,150,.5)'); fg.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(a, b, Rf, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
  } else {
  // ---- energy weapons: same frame, own parts; the glow colour tells them apart (laser red, plasma violet, railgun blue) ----
  const col = RIFLE_COL[tier], hot = RIFLE_HOT[tier];
  const pulse = 0.75 + 0.25 * Math.sin(G.clock * 4), charge = Math.min(1, since / SHOT_COOLDOWN);
  // additive glow: a tapered bar along the rifle, a round glow, a glowing polyline
  const beam = (t0, t1, r0, r1, up, right, a, blur = 10) => {
    const p0 = at(t0, up, right), p1 = at(t1, up, right), [ax, ay] = P(p0), [bx, by] = P(p1), ra = R(p0, r0), rb = R(p1, r1);
    const L = Math.hypot(bx - ax, by - ay) || 1, nx = -(by - ay) / L, ny = (bx - ax) / L;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = col(Math.min(1, a)); ctx.shadowBlur = blur * dpr; ctx.fillStyle = col(a);
    ctx.beginPath(); ctx.moveTo(ax + nx * ra, ay + ny * ra); ctx.lineTo(bx + nx * rb, by + ny * rb);
    ctx.lineTo(bx - nx * rb, by - ny * rb); ctx.lineTo(ax - nx * ra, ay - ny * ra); ctx.closePath(); ctx.fill(); ctx.restore();
  };
  const glowDot = (p, r, a) => {
    const [x, y] = P(p), rr = Math.max(2 * dpr, R(p, r));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y, 0, x, y, rr);
    g.addColorStop(0, hot); g.addColorStop(0.25, col(a)); g.addColorStop(1, col(0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  };
  const gline = (pts, w, a) => {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.shadowColor = col(1); ctx.shadowBlur = 8 * dpr; ctx.strokeStyle = col(a); ctx.lineWidth = w;
    ctx.beginPath(); pts.forEach((p, i) => { const [x, y] = P(p); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${(a * 0.6).toFixed(3)})`; ctx.lineWidth = w * 0.35; ctx.stroke(); ctx.restore();
  };
  // the face of a box nearest us (it looks back at the shooter), e.g. a sight's screen
  const backFace = (t, w, h, lift, right, fill) => {
    const c = (sx, sy) => at(t, lift - sy * h, sx * w + right);
    quad([c(-1, -1), c(1, -1), c(1, 1), c(-1, 1)], fill);
    const [x0, y0] = P(c(-1, -1)), [x1, y1] = P(c(1, 1)); return { x0, y0, x1, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
  };
  // a row of charge lights on a side panel; they fill back up during the cooldown
  const chargeBar = (t0, t1, n, up, right) => {
    const d = (t1 - t0) / n;
    for (let i = 0; i < n; i++) {
      const on = charge >= (i + 1) / n, a0 = t0 + i * d, a1 = a0 + d * 0.65;
      const pts = [at(a0, up + 0.004, right), at(a1, up + 0.004, right), at(a1, up - 0.004, right), at(a0, up - 0.004, right)];
      quad(pts, on ? col(0.95) : 'rgba(30,20,20,.9)');
      if (on) glowDot(at((a0 + a1) / 2, up, right), 0.012, 0.35);
    }
  };

  if (tier === 1) {
    // LASER: clean angular rifle in pale polymer (bright under the IR lamp), square emitter shroud with a red light strip
    const PALE_T = '#8b918e', PALE_S = '#474c4a', DARK_T = '#2b2f2e', DARK_S = '#141716';
    box(0.86, 1.0, 0.021, 0.021, '#6c7270', '#30353a', 0.004);                       // emitter head
    glowDot(at(1.0, 0.004), 0.02, 0.55 * pulse);                                    // lens glowing at the tip
    box(0.3, 0.87, 0.015, 0.015, PALE_T, PALE_S, 0.004);                            // square shroud
    for (let t = 0.8; t > 0.34; t -= 0.07) box(t, t + 0.022, 0.0155, 0.0155, DARK_T, DARK_S, 0.004);   // cooling slots
    beam(0.31, 0.86, 0.0018, 0.0018, 0.004, 0.0158, 0.85 * pulse, 8);               // red strip down the side
    box(0.05, 0.33, 0.024, 0.026, PALE_T, PALE_S, -0.02);                           // forend
    box(-0.32, 0.06, 0.028, 0.03, PALE_T, PALE_S, -0.02);                           // stock
    beam(-0.3, 0.3, 0.002, 0.002, -0.012, 0.03, 0.55 * pulse, 6);                   // stripe along the stock and forend
    box(-0.12, 0.1, 0.019, 0.02, DARK_T, DARK_S, 0.02);                             // receiver
    box(-0.09, 0.05, 0.012, 0.017, '#3a3f3e', '#1c201f', 0.012, 0.03);              // battery pack instead of a bolt
    chargeBar(-0.08, 0.04, 4, 0.012, 0.0422);
    box(0.0, 0.08, 0.01, 0.012, DARK_T, DARK_S, 0.045);                             // sight mount
    // open reflex sight: a base, a window frame you can see the yard through, tinted glass and the red dot floating in it
    box(-0.04, 0.07, 0.019, 0.005, '#3b403f', '#1a1d1c', 0.054);
    { const f = backFace(-0.03, 0.017, 0.013, 0.072, 0, 'rgba(255,70,60,.12)');
      const lg = ctx.createLinearGradient(f.x0, f.y0, f.x1, f.y1);
      lg.addColorStop(0, 'rgba(255,160,150,.22)'); lg.addColorStop(0.45, 'rgba(255,60,50,0)'); lg.addColorStop(1, 'rgba(255,90,80,.12)');
      ctx.fillStyle = lg; ctx.fillRect(Math.min(f.x0, f.x1), Math.min(f.y0, f.y1), Math.abs(f.x1 - f.x0), Math.abs(f.y1 - f.y0)); }
    box(-0.036, -0.028, 0.0025, 0.015, '#4a504e', '#1f2322', 0.072, -0.0175);       // left post
    box(-0.036, -0.028, 0.0025, 0.015, '#4a504e', '#1f2322', 0.072, 0.0175);        // right post
    box(-0.036, -0.028, 0.02, 0.0025, '#5a605e', '#262a29', 0.088);                 // top bar
    glowDot(at(-0.03, 0.072), 0.006, 1);
  } else if (tier === 2) {
    // PLASMA: chunky dark gun, a barrel wrapped in magnetic coils glowing violet between them, a glass plasma tank on the side
    const D_T = '#36323d', D_S = '#19171d', M_T = '#4a4652', M_S = '#221f27';
    tube(0.3, 0.98, 0.009, 0.008, 0, GLOSS);
    beam(0.32, 0.97, 0.02, 0.018, 0, 0, 0.5 * pulse, 16);                           // plasma channel showing between the coils
    tube(0.95, 1.03, 0.02, 0.032, 0, MATTE);                                        // flared muzzle
    glowDot(at(1.03), 0.045, 0.7 * pulse);
    for (let t = 0.86; t > 0.34; t -= 0.085) {
      tube(t, t + 0.045, 0.027, 0.027, 0, ['#5a5560', '#26232b', '#0b0a0d']);       // coil
      for (let k = 0; k < 3; k++) beam(t + 0.008 + k * 0.012, t + 0.012 + k * 0.012, 0.0275, 0.0275, 0, 0, 0.3, 4);   // windings
    }
    box(0.05, 0.33, 0.03, 0.03, D_T, D_S, -0.022);                                  // forend
    box(-0.32, 0.06, 0.032, 0.032, D_T, D_S, -0.022);                               // stock
    box(-0.12, 0.1, 0.022, 0.024, M_T, M_S, 0.016);                                 // receiver
    // plasma tank on the right: end caps, glass, a writhing violet core and bubbles drifting forward
    { const TU = 0.032, TR = 0.034;                                                 // tank height and offset
    tube(0.05, 0.075, 0.019, 0.019, TU, MATTE, null, 0.85, TR);
    { const g = tube(-0.08, 0.06, 0.016, 0.016, TU, ['rgba(200,180,230,.35)', 'rgba(60,40,90,.55)', 'rgba(10,6,16,.8)'], null, 0.85, TR);
      const pts = []; for (let i = 0; i <= 10; i++) { const t = -0.075 + i * 0.0135; pts.push(at(t, TU + Math.sin(G.clock * 9 + i * 1.3) * 0.006, TR + Math.cos(G.clock * 7 + i) * 0.004)); }
      beam(-0.075, 0.055, 0.011, 0.011, TU, TR, 0.22 * pulse, 16);
      gline(pts, 2.4 * dpr, 0.9);
      for (let i = 0; i < 4; i++) { const k = (G.clock * 0.35 + i / 4) % 1; glowDot(at(-0.075 + k * 0.13, TU + Math.sin(i * 2.1 + G.clock * 3) * 0.007, TR), 0.004, 0.7); }
      ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.ellipse(g.ax, g.ay, g.ra * 0.2, g.ra * 0.6, g.ang + 0.3, 0, Math.PI * 2); ctx.fill(); }
    tube(-0.105, -0.075, 0.019, 0.019, TU, MATTE, '#141216', 0.85, TR); }
    chargeBar(-0.1, 0.04, 5, -0.006, 0.0225);                                       // charge lights along the receiver
    // stubby scope with a violet lens
    for (const t of [0.02, 0.12]) box(t, t + 0.025, 0.014, 0.018, M_T, M_S, 0.045);
    tube(0.13, 0.2, 0.021, 0.026, SCOPE_UP, GLOSS);
    tube(0.0, 0.15, 0.02, 0.02, SCOPE_UP, GLOSS);
    { const eye = tube(-0.04, 0.005, 0.027, 0.024, SCOPE_UP, MATTE, '#070808'), r = eye.ra * 0.78;
      const lg = ctx.createRadialGradient(eye.ax - r * 0.3, eye.ay - r * 0.35, r * 0.05, eye.ax, eye.ay, r);
      lg.addColorStop(0, 'rgba(210,170,255,.9)'); lg.addColorStop(0.45, 'rgba(70,30,110,.95)'); lg.addColorStop(1, 'rgba(10,4,16,1)');
      ctx.fillStyle = lg; ctx.beginPath(); ctx.ellipse(eye.ax, eye.ay, r, r * 0.85, eye.ang, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.ellipse(eye.ax - r * 0.42, eye.ay - r * 0.3, r * 0.1, r * 0.3, eye.ang + 0.4, 0, Math.PI * 2); ctx.fill(); }
  } else {
    // RAILGUN: two long rails with blue arcs crackling between them, held by square collars; capacitor bank and a digital sight
    const S_T = '#5d6567', S_S = '#262c2e', B_T = '#3a4144', B_S = '#1a1e20';
    box(0.24, 1.0, 0.012, 0.007, S_T, S_S, -0.028);                                 // lower rail
    beam(0.25, 0.99, 0.018, 0.016, 0, 0, 0.16 * pulse, 14);                         // charged gap
    for (let k = 0; k < 4; k++) {                                                   // arcs, re-struck every frame
      const t = 0.27 + Math.random() * 0.68, pts = [];
      for (let i = 0; i <= 6; i++) pts.push(at(t + (Math.random() - 0.5) * 0.03, -0.021 + i * 0.007, (Math.random() - 0.5) * 0.012));
      gline(pts, 1.6 * dpr, 0.5 + 0.5 * Math.random());
    }
    box(0.24, 1.0, 0.012, 0.007, S_T, S_S, 0.028);                                  // upper rail
    for (let t = 0.9; t > 0.25; t -= 0.19) {                                        // collars with a lit band
      box(t, t + 0.035, 0.022, 0.04, B_T, B_S, 0);
      beam(t + 0.004, t + 0.031, 0.002, 0.002, 0, 0.0225, 0.9 * pulse, 8);
    }
    box(0.0, 0.3, 0.028, 0.032, B_T, B_S, -0.01);                                   // heavy forend block
    box(-0.32, 0.02, 0.03, 0.03, B_T, B_S, -0.02);                                  // stock
    box(-0.14, 0.08, 0.024, 0.026, '#4a5255', '#22282a', 0.016);                    // receiver
    // capacitor bank on the right: three cells with blue bands that light up as it recharges
    for (const [up, rt] of [[0.044, 0.032], [0.026, 0.038], [0.008, 0.032]]) {
      tube(-0.11, 0.05, 0.0085, 0.0085, up, ['#6f777a', '#2c3234', '#0c0e0f'], '#16191a', 0.85, rt);
      beam(-0.07, -0.06, 0.0089, 0.0089, up, rt, 0.85 * charge, 6);
      beam(0.0, 0.01, 0.0089, 0.0089, up, rt, 0.85 * charge, 6);
    }
    // digital sight: a box with a screen facing us showing a thin reticle and a charge readout
    box(0.0, 0.07, 0.01, 0.012, B_T, B_S, 0.045);
    box(-0.04, 0.11, 0.021, 0.017, '#454c4f', '#1e2325', 0.07);
    { const f = backFace(-0.04, 0.018, 0.0145, 0.07, 0, '#03141c');
      const w = f.x1 - f.x0, h = f.y1 - f.y0;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = col(0.85); ctx.lineWidth = 1 * dpr; ctx.shadowColor = col(1); ctx.shadowBlur = 4 * dpr;
      ctx.beginPath(); ctx.moveTo(f.cx - w * 0.3, f.cy); ctx.lineTo(f.cx + w * 0.3, f.cy); ctx.moveTo(f.cx, f.cy - h * 0.3); ctx.lineTo(f.cx, f.cy + h * 0.3); ctx.stroke();
      ctx.strokeRect(f.cx - w * 0.12, f.cy - h * 0.12, w * 0.24, h * 0.24);
      ctx.fillStyle = col(0.9); ctx.fillRect(f.x0 + w * 0.12, f.y1 + h * -0.18, w * 0.76 * charge, h * 0.07);   // charge bar
      ctx.restore(); }
  }
  }
  { const [mx, my] = P(at(1.03)); G.muzzleScr = [mx + Wc * 0.03, my + Hc * 0.16 + drop * Hc * 0.75]; }   // where shots start (drawShotFx)
  ctx.restore();
}
// faint joystick under the finger: a ring where it first touched and a dot where it is now
function drawStick() {
  const u = dpr, ox = drag.ox * u, oy = drag.oy * u, R = 46 * u;
  let dx = (drag.x - drag.ox) * u, dy = (drag.y - drag.oy) * u;
  const L = Math.hypot(dx, dy); if (L > R) { dx *= R / L; dy *= R / L; }
  ctx.save();
  ctx.strokeStyle = 'rgba(69,255,122,.35)'; ctx.lineWidth = 1.5 * u;
  ctx.beginPath(); ctx.arc(ox, oy, R, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(ox, oy, JOY_DEAD * u, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = 'rgba(69,255,122,.45)'; ctx.beginPath(); ctx.arc(ox + dx, oy + dy, 9 * u, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function drawCrosshair() {
  const u = dpr, cx = Math.round(cv.width / 2) + 0.5, cy = Math.round(cv.height / 2) + 0.5;
  const ready = G.clock - G.lastShot >= SHOT_COOLDOWN;
  ctx.save();
  ctx.globalAlpha = ready ? 1 : 0.4;
  ctx.strokeStyle = '#3dff6e'; ctx.fillStyle = '#3dff6e';
  ctx.shadowColor = 'rgba(61,255,110,.8)'; ctx.shadowBlur = 6 * u;
  // small cross: four equal arms, each the length of the old top arm, with a gap around the dot
  ctx.lineWidth = 1.6 * u;
  const g0 = 7 * u, g1 = 20 * u;
  line(ctx, cx - g1, cy, cx - g0, cy); line(ctx, cx + g0, cy, cx + g1, cy);
  line(ctx, cx, cy - g1, cx, cy - g0); line(ctx, cx, cy + g0, cx, cy + g1);
  ctx.beginPath(); ctx.arc(cx, cy, 1.4 * u, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
