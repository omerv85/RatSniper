'use strict';
/* Rat Sniper: drawing the rats and the four kings. Tails, bodies, coats, faces, costumes.
   One of the game's plain scripts (see index.html); they share one global scope, so names here are
   used directly by js/game.js and the other files.
   tailCurve/tailPoint (also used for hit tests) are in js/game.js. */

function drawTail(g, r) { drawTailPart(g, tailCurve(r), 0, r.tailCut ?? 1, r.demon ? 'demon' : r.variant); }
// draws the stretch of tail between t0 and t1; a cut end gets a raw red stump
function drawTailPart(g, P, t0, t1, variant) {
  const N = Math.max(4, Math.round(22 * (t1 - t0))), L = [], R = [], C = [];
  for (let i = 0; i <= N; i++) {
    const [x, y, nx, ny, hw] = tailPoint(P, t0 + (t1 - t0) * i / N);
    L.push([x + nx * hw, y + ny * hw]); R.push([x - nx * hw, y - ny * hw]); C.push([x, y, nx, ny, hw]);
  }
  g.beginPath(); g.moveTo(L[0][0], L[0][1]);
  for (const p of L) g.lineTo(p[0], p[1]);
  for (let i = R.length - 1; i >= 0; i--) g.lineTo(R[i][0], R[i][1]);
  g.closePath();
  g.strokeStyle = 'rgba(12,14,13,.85)'; g.lineWidth = 2.2; g.lineJoin = 'round'; g.stroke();
  const tg = g.createLinearGradient(0, -14, 0, 2);
  const tc = variant === 'albino' ? ['#f4c6cf', '#d0909e'] : variant === 'zombie' ? ['#b4c0ad', '#7f8c78'] : variant === 'demon' ? ['#4a3631', '#1e1512'] : ['#d2d6d3', '#8f9491'];
  tg.addColorStop(0, tc[0]); tg.addColorStop(1, tc[1]);
  g.fillStyle = tg; g.fill();
  g.strokeStyle = 'rgba(40,44,42,.45)'; g.lineWidth = 0.7;
  for (let i = 1; i < N; i++) { const [x, y, nx, ny, hw] = C[i]; line(g, x + nx * hw, y + ny * hw, x - nx * hw, y - ny * hw); }
  if (variant === 'zombie' && t1 > 0.75) {
    // the tip has rotted down to bare vertebrae
    const a = tailPoint(P, Math.max(t0, 0.73)), b = tailPoint(P, t1);
    g.strokeStyle = '#e8e2d4'; g.lineWidth = 2; line(g, a[0], a[1], b[0], b[1]);
    g.fillStyle = '#e8e2d4'; for (let i = 0; i <= 6; i++) { const p = tailPoint(P, Math.max(t0, 0.73) + (t1 - Math.max(t0, 0.73)) * i / 6); ell(g, p[0], p[1], 1.6, 1.6); }
  }
  // raw cut ends
  for (const [t, cut] of [[t0, t0 > 0], [t1, t1 < 1]]) {
    if (!cut) continue;
    const [x, y, , , hw] = tailPoint(P, t);
    g.fillStyle = BLOOD; ell(g, x, y, hw * 1.1, hw * 1.1);
    g.fillStyle = 'rgba(232,150,166,.9)'; ell(g, x, y, hw * 0.45, hw * 0.45);
  }
}

// the dirt heaped around a rat digging out of (or back into) its hole
function dirtLip(g, s, ee) {
  // loose earth heaped in front of the hole, covering the rat where it meets the ground
  g.globalAlpha = Math.max(0, 1 - ee * ee);
  g.fillStyle = '#5f6361'; g.beginPath(); g.ellipse(0, 0, 38 * s, 8 * s, 0, 0, Math.PI); g.fill();
  g.fillStyle = '#7a7e7c'; g.beginPath(); g.ellipse(0, 0.5 * s, 38 * s, 4 * s, 0, Math.PI, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(190,196,192,.45)';
  for (let i = 0; i < 9; i++) ell(g, (i - 4) * 8.5 * s, (1.5 + (i % 3)) * s, 1.6 * s, 1.1 * s);
  g.globalAlpha = 1;
}

const SKIN = '#c4bcbd';          // pale bare skin (feet, ears, nose) as it reads under IR
function foot(g, x, y, len, col = SKIN) {
  g.fillStyle = col; ell(g, x, y, len, 2.3);
  g.strokeStyle = col; g.lineWidth = 1.1; g.lineCap = 'round';
  for (let i = -1; i <= 1; i++) line(g, x + len * 0.85, y, x + len + 3, y + i * 1.6);
}
function ratBodyPath(g, headless = false) {
  g.beginPath();
  g.moveTo(-44, -5);
  g.bezierCurveTo(-60, -12, -58, -44, -34, -48);   // rump
  g.bezierCurveTo(-10, -52, 12, -46, 22, -38);     // arched back to neck
  if (headless) {
    g.bezierCurveTo(30, -36, 33, -18, 29, -8);     // neck only; the face is drawn turned to camera
  } else {
    g.bezierCurveTo(30, -40, 38, -35, 46, -28);    // crown
    g.bezierCurveTo(52, -24, 58, -19, 62, -16);    // tapering snout
    g.bezierCurveTo(64, -13, 59, -10, 53, -11);    // nose round to chin
    g.bezierCurveTo(45, -11, 37, -10, 29, -8);     // jaw to throat
  }
  g.bezierCurveTo(16, -3, 0, -2, -16, -2);         // chest and belly
  g.bezierCurveTo(-28, -2, -38, -2, -44, -5);
  g.closePath();
}

/* coats as they read through the night-vision scope: mostly grey, some white, brown or black, some pied */
const COATS = {
  grey:  { g: ['#6c716f', '#4e5351', '#2f3231', '#3e4140'], fl: '215,224,219', fd: '12,14,13', belly: 'rgba(160,166,163,.16)', patch: 'rgba(226,230,228,.92)' },
  white: { g: ['#e4e7e5', '#c6cac8', '#9ca19f', '#b2b6b4'], fl: '255,255,255', fd: '78,84,81', belly: 'rgba(255,255,255,.2)', patch: 'rgba(58,62,60,.9)' },
  brown: { g: ['#8f7d69', '#6c5b4a', '#3f352b', '#50453a'], fl: '228,212,192', fd: '24,18,12', belly: 'rgba(196,180,160,.18)', patch: 'rgba(232,226,216,.92)' },
  black: { g: ['#484b4a', '#2b2d2c', '#141615', '#1e201f'], fl: '190,198,194', fd: '0,0,0', belly: 'rgba(120,126,123,.12)', patch: 'rgba(226,230,228,.92)' },
  alpha: { g: ['#5d6260', '#3c403f', '#202322', '#2e3130'], fl: '215,224,219', fd: '8,10,9', belly: 'rgba(160,166,163,.12)', patch: '' },
  king:  { g: ['#545957', '#323635', '#171918', '#232625'], fl: '205,214,209', fd: '0,0,0', belly: 'rgba(140,146,143,.1)', patch: '' },
  zombie: { g: ['#7e8b7a', '#5d6b5a', '#35423a', '#46524a'], fl: '205,222,200', fd: '10,16,10', belly: 'rgba(160,176,156,.14)', patch: '' },
  albino: { g: ['#eceeed', '#cfd3d1', '#a3a8a6', '#babebc'], fl: '255,255,255', fd: '84,90,87', belly: 'rgba(255,255,255,.22)', patch: '' },
};
const PINK = '#e8a7b4';
function makeCoat(alpha) {
  const nick = Math.random() < (alpha ? 0.5 : 0.2), nickFar = Math.random() < 0.5;
  if (alpha) return { k: 'alpha', patches: [], nick, nickFar, facePatch: false };
  const x = Math.random();
  const k = x < 0.6 ? 'grey' : x < 0.73 ? 'brown' : x < 0.86 ? 'black' : 'white';
  const patches = [];
  let facePatch = false;
  if (Math.random() < 0.25) {
    const n = 2 + (Math.random() * 3 | 0);
    for (let i = 0; i < n; i++) patches.push([rand(-48, 24), rand(-46, -8), rand(7, 17), rand(5, 11), rand(-0.6, 0.6)]);
    if (Math.random() < 0.45) { patches.push([40, -27, 15, 12, 0.2]); facePatch = true; }   // hooded face
  }
  return { k, patches, nick, nickFar, facePatch };
}
// ear outline, optionally with a V-shaped bite out of the rim
function earPath(g, ex, ey, rx, ry, rot, nick) {
  g.beginPath();
  const N = 36, c = Math.cos(rot), s = Math.sin(rot);
  for (let i = 0; i <= N; i++) {
    const a = i / N * Math.PI * 2;
    let k = 1;
    if (nick) { const dd = Math.abs(mod(a - 4.45 + Math.PI, Math.PI * 2) - Math.PI); if (dd < 0.36) k = 1 - 0.38 * (1 - dd / 0.36); }
    const px = Math.cos(a) * rx * k, py = Math.sin(a) * ry * k;
    const x = ex + px * c - py * s, y = ey + px * s + py * c;
    i ? g.lineTo(x, y) : g.moveTo(x, y);
  }
  g.closePath();
}
function drawEar(g, ex, ey, rot, nick, sc = 1, pink = false) {
  earPath(g, ex, ey, 9 * sc, 11.5 * sc, rot, nick);
  g.fillStyle = pink ? 'rgba(236,170,184,.95)' : 'rgba(190,182,184,.92)'; g.fill();
  g.strokeStyle = 'rgba(20,22,21,.6)'; g.lineWidth = 0.8; g.stroke();
  g.fillStyle = pink ? 'rgba(214,120,140,.9)' : 'rgba(112,104,106,.85)'; ell(g, ex + 1.2 * sc, ey + 1.2 * sc, 5 * sc, 7.2 * sc, rot);
}
function glowEye(g, x, y, core, rgb, R) {
  g.fillStyle = '#121413'; ell(g, x, y, 4.8, 4.2);
  g.fillStyle = core; ell(g, x, y, 3.2, 3.2);
  g.globalCompositeOperation = 'lighter';
  const e = g.createRadialGradient(x, y, 0, x, y, R);
  e.addColorStop(0, `rgba(${rgb},.85)`); e.addColorStop(0.3, `rgba(${rgb},.3)`); e.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = e; g.fillRect(x - R, y - R, R * 2, R * 2);
  g.globalCompositeOperation = 'source-over';
}
function eye(g, r, x, y) {
  const v = r.variant;
  if (v === 'pirate' || v === 'blind') { coverEye(g, r, x, y); return; }
  if (v === 'zombie') { g.fillStyle = '#0d0f0e'; ell(g, x, y, 5.2, 4.6); glowEye(g, x, y, '#e9ffd9', '190,255,170', 20); return; }
  if (v === 'albino' && r.blink <= 0) { glowEye(g, x, y, '#ff7a92', '255,110,140', 15); return; }
  if (v === 'drunk' && r.blink <= 0) {
    glowEye(g, x, y, '#fff', '255,255,255', 12);
    g.fillStyle = COATS[r.coat.k].g[1]; g.beginPath(); g.ellipse(x, y, 5.4, 5, 0, Math.PI, 0); g.fill();   // heavy lid
    g.strokeStyle = '#121413'; g.lineWidth = 1; line(g, x - 5, y, x + 5, y);
    return;
  }
  g.fillStyle = '#121413'; ell(g, x, y, 4.8, 4.2);
  if (r.blink > 0) return;
  const glowR = r.rage ? 20 + Math.random() * 5 : r.king ? 19 : 15;
  g.fillStyle = r.alpha ? '#ff4a32' : '#ffffff'; ell(g, x, y, 3.2, 3.2);
  g.globalCompositeOperation = 'lighter';
  const eg = g.createRadialGradient(x, y, 0, x, y, glowR);
  if (r.alpha) { eg.addColorStop(0, 'rgba(255,90,60,.95)'); eg.addColorStop(0.3, r.rage ? 'rgba(255,40,20,.55)' : 'rgba(255,40,20,.35)'); eg.addColorStop(1, 'rgba(255,30,10,0)'); }
  else { eg.addColorStop(0, 'rgba(255,255,255,.85)'); eg.addColorStop(0.3, 'rgba(235,245,240,.3)'); eg.addColorStop(1, 'rgba(235,245,240,0)'); }
  g.fillStyle = eg; g.fillRect(x - glowR, y - glowR, glowR * 2, glowR * 2);
  g.globalCompositeOperation = 'source-over';
}
// head turned square to the shooter: both ears, both glowing eyes, nose pointing down the scope
function drawFaceFront(g, r, C, cx, cy) {
  drawEar(g, cx - 14, cy - 15, 0.55, r.coat.nick && r.coat.nickFar, 0.95);
  drawEar(g, cx + 14, cy - 15, -0.55, r.coat.nick && !r.coat.nickFar, 0.95);
  const hg = g.createLinearGradient(0, cy - 15, 0, cy + 14);
  hg.addColorStop(0, C.g[0]); hg.addColorStop(0.5, C.g[1]); hg.addColorStop(1, C.g[2]);
  g.fillStyle = hg;
  g.beginPath(); g.ellipse(cx, cy, 16, 14.5, 0, 0, Math.PI * 2); g.moveTo(cx + 14, cy + 6); g.ellipse(cx, cy + 6, 14, 9, 0, 0, Math.PI * 2); g.fill();
  if (r.coat.facePatch) { g.fillStyle = C.patch; ell(g, cx, cy - 2, 9, 11); }
  g.strokeStyle = `rgba(${C.fl},.3)`; g.lineWidth = 2.2; g.beginPath(); g.arc(cx, cy + 2, 15, 3.6, 5.8); g.stroke();
  g.fillStyle = `rgba(${C.fl},.16)`; ell(g, cx, cy + 9, 8, 6);
  g.fillStyle = SKIN; ell(g, cx, cy + 7.5, 3.3, 2.5);
  g.strokeStyle = 'rgba(14,16,15,.7)'; g.lineWidth = 0.9;
  line(g, cx, cy + 10, cx, cy + 12.5);
  g.beginPath(); g.moveTo(cx - 3.5, cy + 13.5); g.quadraticCurveTo(cx, cy + 12, cx + 3.5, cy + 13.5); g.stroke();
  eye(g, r, cx - 7, cy - 2); eye(g, r, cx + 7, cy - 2);
  if (r.king) {
    // scowling brow, bared incisors, scar through one eye
    g.strokeStyle = '#0c0d0d'; g.lineWidth = 2.6; g.lineCap = 'round';
    line(g, cx - 12, cy - 9, cx - 3, cy - 5); line(g, cx + 12, cy - 9, cx + 3, cy - 5);
    g.fillStyle = '#141615'; g.beginPath(); g.ellipse(cx, cy + 14.5, 5, 2.6, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ece6d8'; g.fillRect(cx - 2.4, cy + 12.6, 2.1, 4.2); g.fillRect(cx + 0.3, cy + 12.6, 2.1, 4.2);
    g.strokeStyle = 'rgba(214,206,204,.7)'; g.lineWidth = 1.4; line(g, cx + 3, cy - 12, cx + 11, cy + 6);
  }
  g.strokeStyle = 'rgba(228,235,231,.5)'; g.lineWidth = 0.45;
  for (const side of [-1, 1]) for (let i = 0; i < 7; i++) {
    const a = -0.35 + i * 0.12, len = 22 + (i * 7) % 9;
    const x0 = cx + side * 4, y0 = cy + 9;
    g.beginPath(); g.moveTo(x0, y0);
    g.quadraticCurveTo(x0 + side * Math.cos(a) * len * 0.6, y0 + Math.sin(a) * len * 0.6 - 2, x0 + side * Math.cos(a) * len, y0 + Math.sin(a) * len + 1.5);
    g.stroke();
  }
}
function makeFur() {
  const f = [];
  for (let i = 0; i < 120; i++) {
    const x = rand(-56, 56), top = -50 + Math.abs(x) * 0.05, y = rand(top, -4);
    f.push([x, y, rand(3.5, 8), rand(-0.1, 0.45), Math.random()]);
  }
  return f;
}

/* ---------- the armored king (night 10): iron plates over his back and shoulder, and a horned viking helmet ---------- */
const IRON = ['#e2e7e4', '#b0b7b3', '#727975', '#3a3f3d'];   // lit edge to shadow, as polished iron reads under IR
function ironFill(g, y0, y1) { const gr = g.createLinearGradient(0, y0, 0, y1); IRON.forEach((c, i) => gr.addColorStop(i / 3, c)); return gr; }
function rivet(g, x, y, r = 1.4) { g.fillStyle = '#1c201e'; ell(g, x + 0.4, y + 0.4, r, r); g.fillStyle = '#e4e9e6'; ell(g, x - 0.3, y - 0.3, r * 0.55, r * 0.55); }
// drawn inside the body's clip, so the plates hug his hunched back
function drawArmor(g) {
  // segmented back plate: overlapping bands from rump to shoulders (front band last so it sits on top)
  const bands = [[-56, -30], [-38, -12], [-20, 6], [-2, 22]];
  for (const [x0, x1] of bands) {
    g.beginPath();
    g.moveTo(x0, -34);
    g.quadraticCurveTo(x0 + 2, -66, (x0 + x1) / 2, -66);
    g.quadraticCurveTo(x1 - 2, -66, x1, -34);
    g.quadraticCurveTo((x0 + x1) / 2, -30, x0, -34);
    g.closePath();
    g.fillStyle = ironFill(g, -62, -32); g.fill();
    g.strokeStyle = 'rgba(12,14,13,.85)'; g.lineWidth = 1.6; g.stroke();
    g.strokeStyle = 'rgba(240,245,242,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0 + 3, -40); g.quadraticCurveTo(x0 + 4, -60, (x0 + x1) / 2, -61); g.stroke();
    for (const y of [-38, -46, -54]) rivet(g, x1 - 4, y);
  }
  // lower trim: a dark leather strap holding the plates
  g.fillStyle = '#2a2420'; g.beginPath(); g.moveTo(-58, -34); g.quadraticCurveTo(-18, -27, 24, -33); g.lineTo(24, -29); g.quadraticCurveTo(-18, -23, -58, -30); g.closePath(); g.fill();
  // shoulder plate: three curved lames over the foreleg
  for (let i = 2; i >= 0; i--) {
    const cy = -30 + i * 7, rx = 17 - i * 2;
    g.beginPath(); g.ellipse(18, cy, rx, 10, -0.15, Math.PI, Math.PI * 2); g.closePath();
    g.fillStyle = ironFill(g, cy - 10, cy + 2); g.fill();
    g.strokeStyle = 'rgba(12,14,13,.85)'; g.lineWidth = 1.5; g.stroke();
    rivet(g, 18 - rx + 4, cy - 1, 1.2); rivet(g, 18 + rx - 4, cy - 3, 1.2);
  }
}
// a curved horn as a tapered shape along a quadratic curve, ivory with darker growth rings
function horn(g, x0, y0, cx, cy, x1, y1, w) {
  const N = 14, L = [], R = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, it = 1 - t;
    const x = it * it * x0 + 2 * it * t * cx + t * t * x1, y = it * it * y0 + 2 * it * t * cy + t * t * y1;
    const tx = 2 * it * (cx - x0) + 2 * t * (x1 - cx), ty = 2 * it * (cy - y0) + 2 * t * (y1 - cy), len = Math.hypot(tx, ty) || 1;
    const hw = w * (1 - t * 0.92) / 2, nx = -ty / len, ny = tx / len;
    L.push([x + nx * hw, y + ny * hw]); R.push([x - nx * hw, y - ny * hw]);
  }
  g.beginPath(); g.moveTo(L[0][0], L[0][1]); for (const p of L) g.lineTo(p[0], p[1]);
  for (let i = N; i >= 0; i--) g.lineTo(R[i][0], R[i][1]); g.closePath();
  const hg = g.createLinearGradient(x0, y0, x1, y1); hg.addColorStop(0, '#d9d2bf'); hg.addColorStop(1, '#f2ede0');
  g.fillStyle = hg; g.fill(); g.strokeStyle = 'rgba(12,14,13,.85)'; g.lineWidth = 1.3; g.stroke();
  g.strokeStyle = 'rgba(90,82,66,.55)'; g.lineWidth = 0.9;
  for (let i = 2; i < N - 2; i += 2) line(g, L[i][0], L[i][1], R[i][0], R[i][1]);
}
// drawn over the head in the side view: far horn, dome, riveted brim, nose guard, near horn
function drawVikingHelmet(g) {
  horn(g, 40, -47, 52, -58, 50, -78, 9);        // far horn, half hidden behind the dome
  g.beginPath(); g.ellipse(34, -36, 15, 13, 0.2, Math.PI * 0.95, Math.PI * 2.05); g.closePath();
  g.fillStyle = ironFill(g, -50, -30); g.fill();
  g.strokeStyle = 'rgba(12,14,13,.9)'; g.lineWidth = 1.6; g.stroke();
  g.strokeStyle = 'rgba(240,245,242,.55)'; g.lineWidth = 1.2; g.beginPath(); g.ellipse(32, -38, 10, 9, 0.2, Math.PI * 1.15, Math.PI * 1.6); g.stroke();
  g.strokeStyle = 'rgba(12,14,13,.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(34, -49); g.quadraticCurveTo(30, -42, 30, -33); g.stroke();   // centre ridge
  // brim band with rivets
  g.strokeStyle = 'rgba(12,14,13,.9)'; g.lineWidth = 5.2; g.lineCap = 'round'; line(g, 20, -33, 48, -27);
  g.strokeStyle = '#8e9591'; g.lineWidth = 3.4; line(g, 20, -33, 48, -27);
  for (let i = 0; i < 5; i++) rivet(g, 22 + i * 6.2, -32.5 + i * 1.3, 1);
  // nose guard down in front of the eye
  g.fillStyle = 'rgba(12,14,13,.9)'; g.beginPath(); g.moveTo(44.5, -29); g.lineTo(49.5, -28); g.lineTo(49, -19); g.lineTo(46, -19.5); g.closePath(); g.fill();
  g.fillStyle = '#9aa19d'; g.beginPath(); g.moveTo(45.3, -28.3); g.lineTo(48.6, -27.7); g.lineTo(48.3, -20.2); g.lineTo(46.6, -20.4); g.closePath(); g.fill();
  horn(g, 27, -45, 14, -56, 18, -78, 10);        // near horn sweeping up and back
}

/* ---------- the cyborg king (night 15): mostly machine. A steel shell over his rump with vents, a hatch
   of circuitry and cables, steel vertebrae, a steel skull and jaw with metal teeth, a red mechanical eye, piston legs,
   a steel tail ---------- */
const blink = (rate, phase = 0) => (Math.sin(G.clock * rate + phase) > 0.2 ? 1 : 0.25);
const SEAM = 'rgba(12,14,13,.85)';
// drawn inside the body's clip
function drawCyborgBody(g) {
  // the steel shell over the whole back half, following the hunch
  g.beginPath();
  g.moveTo(4, -60); g.bezierCurveTo(-20, -66, -50, -60, -62, -40);
  g.bezierCurveTo(-66, -20, -58, -4, -44, 0);
  g.lineTo(-4, 0); g.bezierCurveTo(-2, -20, 0, -44, 4, -60); g.closePath();
  g.fillStyle = ironFill(g, -64, 0); g.fill(); g.strokeStyle = SEAM; g.lineWidth = 1.8; g.stroke();
  // panel seams and rivet rows
  g.strokeStyle = SEAM; g.lineWidth = 1.1;
  for (const [x0, y0, cx, cy, x1, y1] of [[-30, -63, -36, -30, -34, 0], [-16, -63, -18, -30, -17, 0], [-62, -30, -36, -34, -4, -30]]) {
    g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(cx, cy, x1, y1); g.stroke();
  }
  for (let x = -56; x <= -8; x += 6) rivet(g, x, -55 + Math.pow((x + 30) / 30, 2) * 6, 1.1);
  for (let y = -54; y <= -6; y += 7) { rivet(g, -33, y, 1); rivet(g, -19, y, 1); }
  // vent grille on the haunch
  g.fillStyle = '#121514';
  for (let i = 0; i < 4; i++) g.fillRect(-56, -24 + i * 4, 18, 2);
  g.strokeStyle = 'rgba(240,245,242,.35)'; g.lineWidth = 0.8;
  for (let i = 0; i < 4; i++) line(g, -56, -21.4 + i * 4, -38, -21.4 + i * 4);
  // steel vertebrae on the furred front half of the spine
  for (let x = 6; x <= 20; x += 7) {
    const y = -55 + Math.pow((x + 14) / 34, 2) * 8;
    g.beginPath(); g.moveTo(x - 4, y + 7); g.lineTo(x - 3, y - 2); g.lineTo(x + 3, y - 4); g.lineTo(x + 5, y + 6); g.closePath();
    g.fillStyle = ironFill(g, y - 4, y + 7); g.fill(); g.strokeStyle = SEAM; g.lineWidth = 1.1; g.stroke();
  }
  // circuit hatch on the shoulder, cables running from the shell into the neck
  const hx = 2, hy = -38, hw = 18, hh = 14;
  g.fillStyle = ironFill(g, hy - 2, hy + hh + 2); g.fillRect(hx - 2.5, hy - 2.5, hw + 5, hh + 5);
  g.strokeStyle = SEAM; g.lineWidth = 1.2; g.strokeRect(hx - 2.5, hy - 2.5, hw + 5, hh + 5);
  g.fillStyle = '#121615'; g.fillRect(hx, hy, hw, hh);
  g.strokeStyle = 'rgba(150,200,175,.55)'; g.lineWidth = 0.8;
  for (const pts of [[[hx + 2, hy + 4], [hx + 8, hy + 4], [hx + 10, hy + 7], [hx + 16, hy + 7]], [[hx + 2, hy + 10], [hx + 12, hy + 10], [hx + 12, hy + 12]]]) {
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) g.lineTo(p[0], p[1]); g.stroke();
  }
  for (const [lx, ly, col, rate, ph] of [[hx + 15, hy + 3, '255,70,60', 5, 0], [hx + 4, hy + 11, '255,190,74', 3, 1]]) {
    const a = blink(rate, ph), gr = g.createRadialGradient(lx, ly, 0, lx, ly, 4);
    gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr; g.fillRect(lx - 4, ly - 4, 8, 8); g.fillStyle = `rgba(255,240,230,${a})`; ell(g, lx, ly, 1, 1);
  }
  for (const [off, w] of [[0, 3.4], [6, 2.6]]) {
    for (const [col, ww] of [['rgba(12,14,13,.9)', w + 1.6], ['#4a504d', w]]) {
      g.strokeStyle = col; g.lineWidth = ww;
      g.beginPath(); g.moveTo(-2, -48 + off); g.bezierCurveTo(10, -54 + off, 18, -44 + off, 27, -32 + off); g.stroke();
    }
  }
}
// over the head: steel skull and cheek, steel jaw with metal teeth, the mechanical eye and its beam, an antenna
function drawCyborgHead(g, r) {
  // skull plate down over the cheek, leaving the snout
  g.beginPath();
  g.moveTo(18, -36); g.bezierCurveTo(20, -50, 42, -52, 52, -36);
  g.lineTo(50, -22); g.bezierCurveTo(44, -16, 34, -15, 28, -18); g.bezierCurveTo(22, -22, 18, -28, 18, -36); g.closePath();
  g.fillStyle = ironFill(g, -52, -14); g.fill(); g.strokeStyle = SEAM; g.lineWidth = 1.6; g.stroke();
  g.strokeStyle = SEAM; g.lineWidth = 0.9;
  g.beginPath(); g.moveTo(30, -50); g.quadraticCurveTo(27, -38, 30, -18); g.stroke();
  g.beginPath(); g.moveTo(19, -30); g.lineTo(48, -24); g.stroke();
  for (const [x, y] of [[23, -42], [33, -48], [45, -44], [24, -24], [44, -19]]) rivet(g, x, y, 1.1);
  // steel jaw with a row of jagged teeth
  g.beginPath(); g.moveTo(30, -14); g.lineTo(57, -13); g.lineTo(55, -7); g.lineTo(32, -6); g.closePath();
  g.fillStyle = ironFill(g, -14, -6); g.fill(); g.strokeStyle = SEAM; g.lineWidth = 1.3; g.stroke();
  g.fillStyle = '#e8ece9'; g.strokeStyle = SEAM; g.lineWidth = 0.7;
  for (let x = 38; x <= 54; x += 4) { g.beginPath(); g.moveTo(x, -13); g.lineTo(x + 1.6, -17.5); g.lineTo(x + 3.2, -13); g.closePath(); g.fill(); g.stroke(); }
  // antenna with a blinking tip
  g.strokeStyle = '#1c201e'; g.lineWidth = 2.2; g.lineCap = 'round'; line(g, 26, -46, 20, -66);
  g.strokeStyle = '#9aa19d'; g.lineWidth = 1.1; line(g, 26, -46, 20, -66);
  const a = blink(6), ag = g.createRadialGradient(20, -67, 0, 20, -67, 7);
  ag.addColorStop(0, `rgba(255,70,60,${a})`); ag.addColorStop(1, 'rgba(255,70,60,0)'); g.fillStyle = ag; g.fillRect(13, -74, 14, 14);
  g.fillStyle = '#e4e9e6'; ell(g, 20, -67, 1.6, 1.6);
  // mechanical eye: steel housing, dark lens, red core (cracked and dark once he's dead)
  if (!r.alive) {
    g.fillStyle = '#2a2f2d'; ell(g, 41, -29, 7, 7); g.strokeStyle = '#9aa19d'; g.lineWidth = 1.4; g.stroke();
    g.strokeStyle = '#5d6460'; g.lineWidth = 1.2; line(g, 38, -32, 44, -26); line(g, 44, -32, 38, -26);
    return;
  }
  const sweep = Math.sin(G.clock * 1.7) * 0.12;
  g.save(); g.translate(41, -29); g.rotate(0.18 + sweep);
  const bg = g.createLinearGradient(0, 0, 150, 0); bg.addColorStop(0, 'rgba(255,60,50,.45)'); bg.addColorStop(1, 'rgba(255,60,50,0)');
  g.fillStyle = bg; g.beginPath(); g.moveTo(0, -1.2); g.lineTo(150, -4); g.lineTo(150, 4); g.lineTo(0, 1.2); g.closePath(); g.fill();
  g.restore();
  g.fillStyle = '#1a1e1c'; ell(g, 41, -29, 8, 8);
  g.strokeStyle = '#cfd5d1'; g.lineWidth = 1.8; g.beginPath(); g.arc(41, -29, 8, 0, Math.PI * 2); g.stroke();
  glowEye(g, 41, -29, '#ffffff', '255,60,50', 22);
  g.fillStyle = 'rgba(255,90,80,.95)'; ell(g, 41, -29, 3.4, 3.4);
  g.fillStyle = '#ffffff'; ell(g, 40.2, -29.8, 1.1, 1.1);
}
// a piston leg: steel thigh and shin with a hydraulic rod, a bolt at the joint and three talons
function mechLeg(g, hx, hy, kx, ky, fx, fy) {
  for (const [col, w] of [[SEAM, 6.6], ['#8e9591', 4.6]]) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; line(g, hx, hy, kx, ky); line(g, kx, ky, fx, fy); }
  g.strokeStyle = '#d7dcd9'; g.lineWidth = 1.2; line(g, hx - 2, hy + 2, fx - 2, fy - 2);   // hydraulic rod
  rivet(g, kx, ky, 1.6);
  g.strokeStyle = '#e4e9e6'; g.lineWidth = 1.3;
  for (const dx of [3, 6, 9]) line(g, fx, fy, fx + dx, fy + 1.2);
}
// the back of the tail turned to jointed steel segments
function drawCyborgTail(g, r) {
  const P = tailCurve(r), end = r.tailCut ?? 1;
  for (let t = 0.42; t < end - 0.02; t += 0.055) {
    const [x, y, nx, ny, hw] = tailPoint(P, t), w = hw * 2.5, ang = Math.atan2(-nx, ny);
    g.save(); g.translate(x, y); g.rotate(ang);
    g.fillStyle = ironFill(g, -w, w); g.beginPath(); g.roundRect ? g.roundRect(-2.6, -w / 2, 5.2, w, 1.2) : g.rect(-2.6, -w / 2, 5.2, w); g.fill();
    g.strokeStyle = 'rgba(12,14,13,.85)'; g.lineWidth = 0.9; g.stroke();
    g.restore();
  }
}

/* ---------- the demon king (night 20): bat wings with ember edges, ram horns, ember-red skin split by
   glowing lava cracks, fiery eyes, drifting embers, a burning tail tip and a broken shackle on his foreleg ---------- */
const EMBER = '255,120,40', LAVA = '255,170,70';
const lavaPulse = r => r.alive ? 0.7 + 0.3 * Math.sin(G.clock * 3.1) : 0.25;
// a glowing line: a wide soft orange stroke under a thin hot one
function glowLine(g, pts, w, a) {
  for (const [col, lw] of [[`rgba(${EMBER},${0.35 * a})`, w * 3.2], [`rgba(${LAVA},${0.9 * a})`, w], [`rgba(255,235,190,${0.8 * a})`, w * 0.4]]) {
    g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) g.lineTo(p[0], p[1]); g.stroke();
  }
}
// a bat wing raised over the back: arm bones to the wrist, finger bones fanning out, a ragged membrane between them
function drawDemonWing(g, r, far) {
  const flap = r.alive ? Math.sin(G.clock * 2.2 + (far ? 0.5 : 0)) * 0.1 : 0.55, a = lavaPulse(r);
  g.save(); g.translate(far ? 12 : 4, -50); g.rotate(-0.1 + flap - (far ? 0.16 : 0)); g.scale(far ? 0.52 : 0.6, far ? 0.52 : 0.6);
  const S = [0, 0], E = [-12, -44], Wr = [-34, -78], tips = [[-112, -70], [-104, -30], [-78, -6], [-48, 4]];
  // finger bones bow slightly: a control point for each, between the wrist and the tip
  const bow = t => [(Wr[0] + t[0]) / 2 + 6, (Wr[1] + t[1]) / 2 - 8];
  // membrane: along the arm to the wrist, out to the first tip, then deep scallops sagging in toward the wrist
  g.beginPath(); g.moveTo(S[0], S[1]); g.lineTo(E[0], E[1]); g.lineTo(Wr[0], Wr[1]);
  g.quadraticCurveTo(bow(tips[0])[0], bow(tips[0])[1], tips[0][0], tips[0][1]);
  for (let i = 1; i < tips.length; i++) {
    const p = tips[i - 1], q = tips[i], mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
    g.quadraticCurveTo(mx + (Wr[0] - mx) * 0.32, my + (Wr[1] - my) * 0.32, q[0], q[1]);
  }
  g.quadraticCurveTo(-20, -6, S[0], 6); g.closePath();
  const mg = g.createLinearGradient(-34, -78, -60, 6);
  mg.addColorStop(0, far ? 'rgba(14,10,9,.96)' : 'rgba(24,15,13,.95)'); mg.addColorStop(1, far ? 'rgba(36,14,10,.9)' : 'rgba(58,20,12,.9)');
  g.fillStyle = mg; g.fill(); g.strokeStyle = 'rgba(6,4,4,.95)'; g.lineWidth = 1.4; g.stroke();
  // a few tears in the membrane
  g.fillStyle = 'rgba(6,5,4,.9)';
  for (const [x, y, rr] of [[-78, -22, 2.6], [-58, -8, 2], [-90, -44, 1.8]]) ell(g, x, y, rr, rr * 0.6);
  // bones; the leading edge smoulders, the fingers only faintly
  g.strokeStyle = '#140e0d'; g.lineCap = 'round';
  g.lineWidth = 4.4; line(g, S[0], S[1], E[0], E[1]); g.lineWidth = 3.6; line(g, E[0], E[1], Wr[0], Wr[1]);
  g.lineWidth = 2;
  for (const t of tips) { const b = bow(t); g.beginPath(); g.moveTo(Wr[0], Wr[1]); g.quadraticCurveTo(b[0], b[1], t[0], t[1]); g.stroke(); }
  glowLine(g, [S, E, Wr], 1.1, a * (far ? 0.5 : 0.9));
  { const b = bow(tips[0]), pts = []; for (let i = 0; i <= 8; i++) { const t = i / 8, it = 1 - t; pts.push([it * it * Wr[0] + 2 * it * t * b[0] + t * t * tips[0][0], it * it * Wr[1] + 2 * it * t * b[1] + t * t * tips[0][1]]); } glowLine(g, pts, 0.9, a * (far ? 0.45 : 0.8)); }
  // claw at the wrist
  g.fillStyle = '#d9cfc2'; g.beginPath(); g.moveTo(Wr[0], Wr[1]); g.lineTo(Wr[0] + 4, Wr[1] - 12); g.lineTo(Wr[0] + 5, Wr[1] - 2); g.closePath(); g.fill();
  g.restore();
}
// inside the body's clip: darken to charcoal, then the lava cracks
function drawDemonSkin(g, r) {
  g.fillStyle = 'rgba(96,16,10,.62)'; g.fillRect(-80, -80, 160, 90);   // deep ember red
  const a = lavaPulse(r);
  // irregular fissures, thin, branching
  const cracks = [
    [[-54, -28], [-49, -31], [-46, -27], [-41, -30], [-36, -29], [-33, -33]],
    [[-46, -27], [-44, -22], [-45, -17]],
    [[-30, -46], [-25, -43], [-22, -45], [-16, -41]],
    [[-4, -46], [0, -43], [3, -44], [7, -39], [12, -40]],
    [[3, -44], [5, -48]],
    [[-18, -20], [-13, -22], [-10, -18], [-4, -19], [0, -15]],
    [[24, -30], [27, -26], [31, -27]],
  ];
  for (const c of cracks) glowLine(g, c, 1.0, a);
  // a molten glow in the chest
  const cg = g.createRadialGradient(14, -22, 0, 14, -22, 18);
  cg.addColorStop(0, `rgba(${LAVA},${0.55 * a})`); cg.addColorStop(1, `rgba(${EMBER},0)`);
  g.fillStyle = cg; g.fillRect(-4, -40, 36, 36);
}
// a curled ram horn: a tapered cubic curve, dark with ridged rings
function demonHorn(g, P, w) {
  const N = 18, L = [], R = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, it = 1 - t;
    const x = it ** 3 * P[0] + 3 * it * it * t * P[2] + 3 * it * t * t * P[4] + t ** 3 * P[6];
    const y = it ** 3 * P[1] + 3 * it * it * t * P[3] + 3 * it * t * t * P[5] + t ** 3 * P[7];
    const tx = 3 * it * it * (P[2] - P[0]) + 6 * it * t * (P[4] - P[2]) + 3 * t * t * (P[6] - P[4]);
    const ty = 3 * it * it * (P[3] - P[1]) + 6 * it * t * (P[5] - P[3]) + 3 * t * t * (P[7] - P[5]);
    const len = Math.hypot(tx, ty) || 1, hw = w * (1 - t * 0.9) / 2;
    L.push([x - ty / len * hw, y + tx / len * hw]); R.push([x + ty / len * hw, y - tx / len * hw]);
  }
  g.beginPath(); g.moveTo(L[0][0], L[0][1]); for (const p of L) g.lineTo(p[0], p[1]);
  for (let i = N; i >= 0; i--) g.lineTo(R[i][0], R[i][1]); g.closePath();
  const hg = g.createLinearGradient(P[0], P[1] - 20, P[6], P[7]); hg.addColorStop(0, '#a89a90'); hg.addColorStop(1, '#4a3e38');
  g.fillStyle = hg; g.fill(); g.strokeStyle = 'rgba(8,6,5,.9)'; g.lineWidth = 1.3; g.stroke();
  g.strokeStyle = 'rgba(150,130,120,.35)'; g.lineWidth = 0.9;
  for (let i = 2; i < N - 1; i += 2) line(g, L[i][0], L[i][1], R[i][0], R[i][1]);
}
// outside the clip, after the head: horns, near wing, fiery eye, embers
function drawDemonTop(g, r) {
  demonHorn(g, [31, -36, 30, -56, 10, -58, 13, -40], 13);      // far horn, behind
  demonHorn(g, [35, -34, 36, -58, 13, -62, 17, -42], 16);       // near horn curling back and down
  drawDemonWing(g, r, false);
  if (r.alive) {
    // eye burning like a coal, with a lick of flame above it
    const fg = g.createRadialGradient(41, -29, 0, 41, -29, 20);
    fg.addColorStop(0, 'rgba(255,240,200,1)'); fg.addColorStop(0.2, `rgba(${LAVA},.95)`); fg.addColorStop(1, `rgba(${EMBER},0)`);
    g.fillStyle = fg; g.beginPath(); g.arc(41, -29, 20, 0, Math.PI * 2); g.fill();
    const fl = Math.sin(G.clock * 14) * 1.5;
    g.fillStyle = `rgba(${LAVA},.6)`; g.beginPath(); g.moveTo(37, -31); g.quadraticCurveTo(38 + fl, -42, 44, -46); g.quadraticCurveTo(43, -38, 45, -31); g.closePath(); g.fill();
    // embers drifting up off him
    for (let i = 0; i < 12; i++) {
      const t = (G.clock * 0.55 + i * 0.37) % 1, x = -56 + (i * 37) % 110 + Math.sin(G.clock * 2 + i) * 4, y = -40 - t * 110;
      g.fillStyle = `rgba(${i % 3 ? LAVA : '255,235,190'},${(1 - t) * 0.9})`; ell(g, x, y, 1.3, 1.3);
    }
  }
}
// a burning tip on the tail
function drawDemonTailFire(g, r) {
  if (!r.alive) return;
  const [x, y] = tailPoint(tailCurve(r), r.tailCut ?? 1);
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) {
    const f = Math.sin(G.clock * (11 + i * 3) + i) * 2, h = 16 - i * 4;
    g.fillStyle = i === 2 ? 'rgba(255,235,190,.8)' : `rgba(${i ? LAVA : EMBER},.6)`;
    g.beginPath(); g.moveTo(x - 4 + i, y); g.quadraticCurveTo(x - 2 + f, y - h * 0.6, x + f * 0.5, y - h); g.quadraticCurveTo(x + 3 + f, y - h * 0.5, x + 4 - i, y); g.closePath(); g.fill();
  }
  g.restore();
}
// broken iron shackle round the near foreleg with a dangling chain
function drawShackle(g, x, y) {
  g.fillStyle = ironFill(g, y - 4, y + 4); g.fillRect(x - 4, y - 3, 8, 6);
  g.strokeStyle = 'rgba(8,6,5,.9)'; g.lineWidth = 1; g.strokeRect(x - 4, y - 3, 8, 6);
  g.strokeStyle = '#9aa19d'; g.lineWidth = 1.1;
  for (let i = 0; i < 4; i++) { const sx = x - 1 + Math.sin(G.clock * 3 + i) * 0.8; g.beginPath(); g.ellipse(sx, y + 5 + i * 3.4, 1.3, 2, 0, 0, Math.PI * 2); g.stroke(); }
}

/* ---------- rare variant costumes, all in the rat's local side-view coordinates ---------- */
function coverEye(g, r, x, y) {
  if (r.variant === 'pirate') {
    g.fillStyle = '#0b0b0b'; ell(g, x, y, 6, 5.2);
    g.strokeStyle = '#0b0b0b'; g.lineWidth = 1.4; line(g, 30, -40, 52, -19);
  } else {
    g.strokeStyle = '#111'; g.lineWidth = 1.4; line(g, x - 5, y - 2, 22, -38);
    g.fillStyle = '#0a0a0a'; ell(g, x + 1, y, 7, 6);
    g.fillStyle = 'rgba(255,255,255,.55)'; ell(g, x - 1.5, y - 2.5, 1.8, 1.2);
  }
}
function varBehind(g, r) {
  if (r.variant === 'clown') {
    // frizzy coloured curls poking out behind the head
    for (const [c, x, y] of [['#e24b4a', 22, -50], ['#378add', 30, -49], ['#ef9f27', 14, -46], ['#e24b4a', 38, -44], ['#378add', 8, -42]]) { g.fillStyle = c; ell(g, x, y, 6, 6); }
  }
}
function varSkin(g, r) {
  switch (r.variant) {
    case 'zombie':
      g.fillStyle = '#2a1a1a'; ell(g, -14, -24, 15, 10);
      g.strokeStyle = '#e8e2d4'; g.lineWidth = 2;
      for (let k = 0; k < 5; k++) { const x = -24 + k * 5; g.beginPath(); g.moveTo(x, -32); g.quadraticCurveTo(x - 3, -25, x + 1, -16); g.stroke(); }
      g.fillStyle = 'rgba(60,75,55,.6)'; ell(g, 22, -30, 8, 6); ell(g, -38, -38, 7, 5);
      g.strokeStyle = 'rgba(20,22,20,.8)'; g.lineWidth = 1.2; line(g, 6, -44, 14, -30);
      for (let k = 0; k < 4; k++) { const x = 6 + k * 2.7, y = -44 + k * 4.7; line(g, x - 2.5, y + 1, x + 2.5, y - 1); }
      break;
    case 'clown':
      g.fillStyle = 'rgba(250,250,250,.92)'; ell(g, 44, -23, 19, 13, 0.25);
      g.fillStyle = '#378add'; g.beginPath(); g.moveTo(41, -37); g.lineTo(44, -29); g.lineTo(41, -21); g.lineTo(38, -29); g.fill();
      g.fillStyle = '#e24b4a'; g.fillRect(49, -13, 8, 2.2);
      break;
    case 'drunk': g.fillStyle = 'rgba(226,90,110,.35)'; ell(g, 48, -17, 8, 5); break;
    case 'mohawk': g.fillStyle = 'rgba(120,126,123,.35)'; ell(g, 34, -34, 14, 7, -0.3); break;   // shaved sides
  }
}
function varHead(g, r) {
  // neckwear, then hair and hats (all drawn before the ear so the ear sits in front)
  switch (r.variant) {
    case 'french':
      g.fillStyle = '#d6262e'; g.beginPath(); g.moveTo(16, -36); g.lineTo(34, -12); g.lineTo(26, -6); g.lineTo(20, -12); g.closePath(); g.fill();
      g.fillStyle = '#f0f0f0'; ell(g, 24, -20, 1.4, 1.4); ell(g, 28, -14, 1.4, 1.4);
      g.save(); g.translate(32, -43); g.rotate(-0.25); g.fillStyle = '#151515'; ell(g, 0, 0, 16, 5); ell(g, 2, -2, 12, 5); g.fillRect(-1, -9, 2.4, 4); g.restore();
      break;
    case 'xmas':
      g.lineCap = 'round';
      g.strokeStyle = '#c8262c'; g.lineWidth = 7; g.beginPath(); g.moveTo(22, -40); g.quadraticCurveTo(30, -22, 24, -8); g.stroke();
      g.strokeStyle = '#f2f2f2'; g.setLineDash([3, 4]); g.beginPath(); g.moveTo(22, -40); g.quadraticCurveTo(30, -22, 24, -8); g.stroke(); g.setLineDash([]);
      g.fillStyle = '#2f8a3a'; g.beginPath(); g.moveTo(24, -12); g.lineTo(18, 6); g.lineTo(26, 5); g.closePath(); g.fill();
      g.save(); g.translate(30, -41); g.rotate(-0.55);
      g.fillStyle = '#c8262c'; g.beginPath(); g.moveTo(-15, 0); g.lineTo(0, -34); g.lineTo(15, 0); g.quadraticCurveTo(0, 4, -15, 0); g.fill();
      g.fillStyle = '#f4f4f4'; ell(g, 0, -35, 5.5, 5.5); g.restore();
      break;
    case 'clown':
      g.fillStyle = '#f4f4f4';
      for (let k = 0; k < 7; k++) { const y = -42 + k * 5.5; g.beginPath(); g.moveTo(22, y); g.lineTo(32, y + 2.7); g.lineTo(22, y + 5.5); g.fill(); }
      g.save(); g.translate(31, -44); g.rotate(-0.35);
      g.fillStyle = '#ef9f27'; g.beginPath(); g.moveTo(-10, 2); g.lineTo(0, -22); g.lineTo(10, 2); g.closePath(); g.fill();
      g.fillStyle = '#378add'; g.fillRect(-6, -7, 12, 3); g.fillStyle = '#e24b4a'; ell(g, 0, -23, 3.5, 3.5); g.restore();
      break;
    case 'pirate':
      g.save(); g.translate(31, -40); g.rotate(-0.18);
      g.fillStyle = '#141414'; g.beginPath(); g.moveTo(-26, 5); g.quadraticCurveTo(-17, -16, 0, -15); g.quadraticCurveTo(17, -16, 26, 5); g.quadraticCurveTo(0, -1, -26, 5); g.fill();
      g.fillStyle = '#ececec'; ell(g, 0, -7, 3, 2.6); g.fillRect(-1.5, -4.6, 3, 1.6);
      g.strokeStyle = '#d4af37'; g.lineWidth = 1; g.beginPath(); g.moveTo(-25, 4.5); g.quadraticCurveTo(0, -2, 25, 4.5); g.stroke(); g.restore();
      break;
    case 'mohawk': {
      g.strokeStyle = '#111'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(20, -40); g.quadraticCurveTo(28, -24, 24, -9); g.stroke();
      g.fillStyle = '#d8dcdc';
      for (const [x, y] of [[21, -37], [25, -30], [27, -23], [26, -16], [24, -10]]) { g.beginPath(); g.moveTo(x, y - 2.5); g.lineTo(x + 5, y); g.lineTo(x, y + 2.5); g.fill(); }
      // purple crest in an arc over the top of the head only
      const cx = 31, cy = -25, R = 15, a0 = -2.85, a1 = -0.8, cols = ['#7b2fd6', '#9a4dff', '#5e1fa8', '#8a3df0'];
      r.hair.forEach(([f, j, q], k) => {
        const a = a0 + (a1 - a0) * f, L = 13 + 11 * Math.sin(Math.PI * Math.min(1, f * 1.15)) + q * 6;
        const bx = cx + Math.cos(a) * R, by = cy + Math.sin(a) * R, aa = a + (j - 0.5) * 0.25 + Math.sin(r.sniff * 4 + k) * 0.02;
        const nx = -Math.sin(a) * 1.4, ny = Math.cos(a) * 1.4;
        g.fillStyle = cols[k % 4]; g.beginPath(); g.moveTo(bx - nx, by - ny); g.lineTo(bx + Math.cos(aa) * L, by + Math.sin(aa) * L); g.lineTo(bx + nx, by + ny); g.fill();
      });
      g.strokeStyle = '#4a1690'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, R, a0, a1); g.stroke();
      break;
    }
  }
}
function varFace(g, r) {
  if (r.variant === 'pirate') { g.strokeStyle = '#e5b53a'; g.lineWidth = 1.6; g.beginPath(); g.arc(20, -34, 3.2, 0, Math.PI * 2); g.stroke(); }
  if (r.variant === 'french') {
    g.strokeStyle = '#0d0d0d'; g.lineWidth = 2.4; g.lineCap = 'round';
    g.beginPath(); g.moveTo(58, -12.5); g.bezierCurveTo(52, -13, 46, -9, 44, -14); g.bezierCurveTo(43, -17, 46, -18, 47, -16); g.stroke();
    g.beginPath(); g.moveTo(58, -12.5); g.bezierCurveTo(64, -11, 70, -8, 71, -13); g.bezierCurveTo(71, -16, 68, -16, 68, -14); g.stroke();
  }
  if (r.variant === 'drunk' && r.alive) {
    g.save(); g.translate(57, -11); g.rotate(0.9);
    g.fillStyle = 'rgba(70,140,80,.9)'; g.fillRect(-3, 0, 6, 6); g.beginPath(); g.roundRect(-6, 6, 12, 22, 4); g.fill();
    g.fillStyle = 'rgba(220,240,225,.6)'; g.fillRect(-4, 9, 2, 15); g.fillStyle = '#e9d9b0'; g.fillRect(-6, 13, 12, 7);
    g.restore();
  }
}
function noseOf(g, r, wig) {
  if (r.variant === 'clown') { g.fillStyle = '#e0262c'; ell(g, 62, -15, 5.5, 5.5); return; }
  g.fillStyle = r.variant === 'drunk' ? '#d97a8c' : r.variant === 'albino' ? PINK : SKIN;
  ell(g, 61.5 + wig * 0.4, -14.5, 2.8, 2.3);
}

function drawRat(g, r, sx, sy) {
  const s = r.sc, d = r.dir;
  g.save(); g.translate(sx, sy);
  const emerging = r.alive && r.state === 'emerge';
  let ee = 1;
  if (emerging) {
    // clip at ground level and raise the rat out of its hole, nose first
    ee = emergeEase(r);
    g.save(); g.beginPath(); g.rect(-400 * s, -400 * s, 800 * s, 400 * s + 0.5); g.clip();
    g.translate(0, (1 - ee) * SINK * s);
    g.rotate(-(1 - ee) * 0.6 * d);
  }
  if (!r.alive) {
    const k = Math.min(1, r.deadT / 0.3);
    g.translate(0, -Math.sin(k * Math.PI) * 16 * s - k * 2 * s);
    g.translate(0, -24 * s); g.rotate(Math.PI * k * d); g.translate(0, 24 * s);
  }
  g.scale(s * d, s);
  if (r.rage) g.rotate((Math.random() - 0.5) * 0.1);  // spasms
  if (r.variant === 'drunk' && r.alive) g.rotate(Math.sin(r.sniff * 2.3) * 0.13);   // sways on its feet
  const footCol = r.variant === 'albino' ? PINK : SKIN;
  const looking = r.alive && r.state === 'look';
  const C = COATS[r.coat.k];
  const walking = r.alive && r.state !== 'stop' && !looking;
  const sw = walking ? Math.sin(r.phase) * 8 : 0;
  const bob = walking ? -Math.abs(Math.sin(r.phase)) * 1.6 : 0;
  const rear = r.alive ? r.rear : 0;
  const wig = r.alive && r.state === 'stop' ? Math.sin(r.sniff * 18) : 0;
  if (r.alive) { g.fillStyle = 'rgba(10,12,11,.35)'; ell(g, -2, 0, 54, 4); }
  drawTail(g, r);
  if (r.cyborg) drawCyborgTail(g, r);
  if (r.demon) drawDemonTailFire(g, r);
  if (r.alive) {
    // far-side legs sit in shadow
    g.fillStyle = '#1b1e1d'; ell(g, -26 - sw, -6, 8, 5);
    g.fillStyle = '#8a8485'; ell(g, -22 - sw, -1.2, 8.5, 1.8);
    if (rear < 0.5) {
      g.strokeStyle = '#1b1e1d'; g.lineWidth = 3; g.lineCap = 'round'; line(g, 27, -9, 28 + sw, -1.5);
      g.fillStyle = '#8a8485'; ell(g, 31 + sw, -1.2, 4, 1.5);
    }
  }
  g.save(); g.translate(0, bob);
  if (rear > 0.01) { g.translate(-38, -6); g.rotate(-rear * 0.62); g.translate(38, 6); }
  if (r.variant) varBehind(g, r);
  if (r.demon) drawDemonWing(g, r, true);   // far wing, behind the body
  // body and head as one silhouette: arched back, heavy rump, long pointed snout
  ratBodyPath(g, looking);
  if (r.alpha) {
    // muscle: heavy shoulders and thick haunches added to the silhouette
    g.moveTo(32, -34); g.ellipse(10, -34, 22, 17, 0, 0, Math.PI * 2);
    g.moveTo(-6, -30); g.ellipse(-30, -30, 24, 23, 0, 0, Math.PI * 2);
    g.moveTo(42, -24); g.ellipse(30, -24, 12, 12, 0, 0, Math.PI * 2);
  }
  if (r.king) {
    // hulking hunched back and bull neck
    g.moveTo(42, -42); g.ellipse(14, -42, 28, 17, -0.1, 0, Math.PI * 2);
    g.moveTo(-8, -38); g.ellipse(-30, -38, 22, 16, 0.15, 0, Math.PI * 2);
    g.moveTo(44, -26); g.ellipse(30, -26, 14, 15, 0, 0, Math.PI * 2);
  }
  const bg = g.createLinearGradient(0, -54, 0, -2);
  [0, 0.35, 0.8, 1].forEach((p, i) => bg.addColorStop(p, C.g[i]));
  g.fillStyle = bg; g.fill();
  g.save(); g.clip();
  g.globalAlpha = 0.82;
  for (const [px, py, prx, pry, prot] of r.coat.patches) { g.fillStyle = C.patch; ell(g, px, py, prx, pry, prot); }
  g.globalAlpha = 1;
  g.lineCap = 'round'; g.lineWidth = 0.9;
  for (const [x, y, len, a, v] of r.fur) {
    const lv = y < -30 ? v : v * 0.6;
    g.strokeStyle = lv > 0.55 ? `rgba(${C.fl},${(0.12 + 0.2 * (lv - 0.55) / 0.45).toFixed(2)})` : `rgba(${C.fd},${(0.16 + 0.22 * lv).toFixed(2)})`;
    line(g, x, y, x - len * Math.cos(a), y + len * Math.sin(a));
  }
  g.fillStyle = C.belly; ell(g, 2, -4, 36, 6);
  g.strokeStyle = 'rgba(16,18,17,.45)'; g.lineWidth = 1.6; g.beginPath(); g.arc(-32, -20, 15, -0.6, 1.9); g.stroke();
  if (r.alpha) {
    g.strokeStyle = 'rgba(225,233,229,.24)'; g.lineWidth = 2.2;
    g.beginPath(); g.arc(10, -30, 17, 3.7, 5.7); g.stroke();
    g.beginPath(); g.arc(-30, -26, 20, 3.4, 5.3); g.stroke();
    g.strokeStyle = 'rgba(8,10,9,.5)'; g.lineWidth = 1.8;
    g.beginPath(); g.arc(10, -26, 15, 0.3, 1.9); g.stroke();
    g.beginPath(); g.arc(-12, -22, 14, 0.4, 2.2); g.stroke();
    g.strokeStyle = 'rgba(200,208,204,.35)'; g.lineWidth = 1; line(g, 34, -36, 42, -33); // old scar
  }
  if (r.king) {
    // old battle scars: pale raised welts with stitch marks, a bald patch of scar tissue
    g.fillStyle = 'rgba(150,140,140,.35)'; ell(g, -26, -36, 9, 6, 0.4);
    g.strokeStyle = 'rgba(214,206,204,.6)'; g.lineWidth = 1.6; g.lineCap = 'round';
    for (const [a, b, c2, d2] of [[-46, -34, -24, -44], [-8, -48, 8, -34], [-34, -16, -14, -26], [14, -24, 26, -40]]) {
      line(g, a, b, c2, d2);
      const n = 4; g.lineWidth = 0.9;
      for (let i = 1; i < n; i++) { const x = a + (c2 - a) * i / n, y = b + (d2 - b) * i / n; line(g, x - 2, y - 2.5, x + 2, y + 2.5); }
      g.lineWidth = 1.6;
    }
    line(g, 35, -38, 47, -20);   // across the eye
  }
  if (r.armored) drawArmor(g);
  if (r.cyborg) drawCyborgBody(g);
  if (r.demon) drawDemonSkin(g, r);
  if (r.variant) varSkin(g, r);
  const bleeding = r.king && r.hp <= r.maxHp / 2;
  for (const [wx, wy] of r.wounds) {
    g.fillStyle = 'rgba(70,8,12,.95)'; ell(g, wx, wy, 4.5, 3.6);
    g.fillStyle = 'rgba(50,6,9,.75)'; ell(g, wx - 1.5, wy + (bleeding ? 11 : 6), 2.4, bleeding ? 12 : 6);
  }
  if (r.exploded) {
    // torn open: the cavity with the rib cage showing
    g.fillStyle = 'rgba(58,8,12,.97)'; ell(g, -4, -24, 34, 15);
    g.fillStyle = 'rgba(110,22,30,.9)'; ell(g, -4, -22, 26, 10);
    g.strokeStyle = '#e8e1d2'; g.lineCap = 'round';
    g.lineWidth = 3.2; line(g, -34, -30, 26, -30);                    // spine
    g.lineWidth = 2.4;
    for (let i = 0; i < 7; i++) {
      const x = -26 + i * 8;
      g.beginPath(); g.moveTo(x, -30); g.quadraticCurveTo(x - 6, -22, x + 1, -12); g.stroke();
    }
    g.fillStyle = 'rgba(236,150,170,.85)'; ell(g, 18, -18, 5, 3.5); ell(g, -20, -16, 4, 3);
  }
  g.strokeStyle = 'rgba(225,233,229,.3)'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(-58, -28); g.bezierCurveTo(-54, -47, -32, -50, -10, -50); g.bezierCurveTo(8, -49, 18, -43, 46, -29); g.stroke();
  g.restore();
  if (r.variant) varHead(g, r);
  // ear: big, thin and pale where the lamp shines through it
  const mean = r.rage || (r.king && r.alive);
  if (mean && !r.armored && !r.cyborg && !r.demon) {
    // hackles up along the spine
    g.strokeStyle = '#2a2d2c'; g.lineWidth = 1.4; g.lineCap = 'round';
    for (let x = -46; x <= 16; x += 4) {
      const y = -50 + Math.pow((x + 12) / 40, 2) * 9, h = 4 + Math.random() * 4;
      line(g, x, y + 2, x - 2, y - h);
    }
  }
  if (looking) drawFaceFront(g, r, C, 37, -29);
  else {
  const earRot = mean ? -1.0 : -0.35, ex = mean ? 19 : 23, ey = mean ? -42 : -45;  // pinned back when angry
  if (!r.demon) drawEar(g, ex, ey, earRot, r.coat.nick, 1, r.variant === 'albino');   // the demon's horn takes its place
  if (mean) {
    // snarl: open mouth with bared incisors
    g.fillStyle = '#141615'; g.beginPath(); g.moveTo(59, -11); g.lineTo(46, -9.5); g.lineTo(55, -5); g.closePath(); g.fill();
    g.fillStyle = '#e9e3d6'; g.beginPath(); g.moveTo(58, -11); g.lineTo(59.5, -6.5); g.lineTo(56, -10.5); g.closePath(); g.fill();
  }
  // nose, mouth, whiskers
  noseOf(g, r, wig);
  g.strokeStyle = 'rgba(14,16,15,.7)'; g.lineWidth = 0.9; line(g, 58, -11, 51, -10.4);
  if (r.variant) varFace(g, r);
  g.strokeStyle = 'rgba(228,235,231,.5)'; g.lineWidth = 0.45;
  for (let i = 0; i < 8; i++) {
    const a = -0.42 + i * 0.12 + wig * 0.04, len = 26 + (i * 7) % 10;
    g.beginPath(); g.moveTo(56, -15);
    g.quadraticCurveTo(56 + Math.cos(a) * len * 0.6, -15 + Math.sin(a) * len * 0.6 - 2, 56 + Math.cos(a) * len, -15 + Math.sin(a) * len + 1.5);
    g.stroke();
  }
  // eye
  if (r.alive) eye(g, r, 41, -29);
  else if (r.variant === 'pirate' || r.variant === 'blind') coverEye(g, r, 41, -29);
  else {
    g.strokeStyle = '#d6dbd8'; g.lineWidth = 1.7; g.lineCap = 'round';
    line(g, 38, -32, 44, -26); line(g, 44, -32, 38, -26);
  }
  }
  if (r.armored && !looking) drawVikingHelmet(g);
  if (r.cyborg && !looking) drawCyborgHead(g, r);
  if (r.demon && !looking) drawDemonTop(g, r);
  // near front leg (tucked against the chest when the rat sits up)
  if (r.alive) {
    if (r.variant === 'blind') { g.strokeStyle = '#2a2d2c'; g.lineWidth = 4; g.lineCap = 'round'; line(g, 22, -12, 30, -18); g.fillStyle = SKIN; ell(g, 31, -18.5, 3.4, 2.6); }
    else if (r.cyborg) mechLeg(g, 20, -14, 23 - sw * 0.5, -7, 21 - sw, -1.5);
    else if (rear > 0.5) { g.fillStyle = footCol; ell(g, 32, -13, 3.2, 2.2); ell(g, 29, -11, 3, 2); }
    else { g.strokeStyle = '#2a2d2c'; g.lineWidth = 4; g.lineCap = 'round'; line(g, 21, -10, 21 - sw, -2); foot(g, 22 - sw, -1.3, 4.5, footCol); }
  }
  if (r.alive && r.demon && rear <= 0.5) drawShackle(g, 21 - sw * 0.55, -6);
  g.restore();
  if (r.alive && r.variant === 'blind') {
    // white cane from the raised paw down to the ground ahead, tapping as it goes
    const a = -rear * 0.62, c = Math.cos(a), sn = Math.sin(a);
    const px = -38 + 69 * c + 12.5 * sn, py = -6 + bob + 69 * sn - 12.5 * c;
    const tap = Math.max(0, Math.sin(r.sniff * 6)) * 5, tx = px + 30, ty = -tap;
    g.lineCap = 'round'; g.strokeStyle = '#efefef'; g.lineWidth = 2.2; line(g, px, py, tx, ty);
    g.strokeStyle = '#d6262e'; line(g, px + (tx - px) * 0.88, py + (ty - py) * 0.88, tx, ty);
    g.strokeStyle = '#efefef'; g.beginPath(); g.arc(px - 3, py, 3, Math.PI * 1.2, Math.PI * 0.1); g.stroke();
  }
  if (r.alive && r.variant === 'pirate') {
    // wooden peg in place of the near hind leg
    g.fillStyle = '#7a5530'; g.fillRect(-31 + sw * 0.4, -10, 5, 11);
    g.fillStyle = '#4e351c'; g.fillRect(-31.5 + sw * 0.4, -1, 6, 2);
  } else if (r.alive && r.cyborg) {
    mechLeg(g, -32 + sw * 0.4, -12, -36 + sw * 0.7, -6, -28 + sw, -1.5);
  } else if (r.alive) {
    g.strokeStyle = '#2a2d2c'; g.lineWidth = 4.5; g.lineCap = 'round'; line(g, -30 + sw * 0.4, -9, -29 + sw, -2.5);
    foot(g, -24 + sw, -1.4, 9, footCol);
  } else {
    g.strokeStyle = '#2c2f2e'; g.lineWidth = 3.4; g.lineCap = 'round';
    const legs = [[-32, -6, -38, 9], [-20, -4, -19, 10], [16, -5, 19, 9], [26, -7, 32, 6]];
    for (const [a, b, c, e] of legs) { line(g, a, b, c, e); g.fillStyle = SKIN; ell(g, c, e + 1, 3, 2); }
  }
  if (emerging) { g.restore(); dirtLip(g, s, ee); }
  g.restore();
}
