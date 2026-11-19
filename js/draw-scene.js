'use strict';
/* Rat Sniper: drawing the scenery. The pre-rendered farmyard, the night-vision overlay, yard clutter.
   One of the game's plain scripts (see index.html); they share one global scope, so names here are
   used directly by js/game.js and the other files. */

/* ---------- scenery (pre-rendered, wraps every W units) ---------- */
function buildScenery(p) {
  Pgr = p; Psky = p * 0.6;
  skyImg = mk(W * Psky, (SKY_Y1 - SKY_Y0) * Psky);
  let g = skyImg.getContext('2d');
  g.setTransform(Psky, 0, 0, Psky, 0, -SKY_Y0 * Psky);
  const sg = g.createLinearGradient(0, SKY_Y0, 0, SKY_Y1);
  sg.addColorStop(0, '#0f1312'); sg.addColorStop(.55, '#1f2524'); sg.addColorStop(.88, '#363d3b'); sg.addColorStop(1, '#3a413f');
  g.fillStyle = sg; g.fillRect(0, SKY_Y0, W, SKY_Y1 - SKY_Y0);
  for (const ox of [-W, 0, W]) { g.save(); g.translate(ox, 0); paintSky(g); g.restore(); }

  grImg = mk(W * Pgr, (GR_Y1 - GR_Y0) * Pgr);
  g = grImg.getContext('2d');
  g.setTransform(Pgr, 0, 0, Pgr, 0, -GR_Y0 * Pgr);
  const gg = g.createLinearGradient(0, HORIZON, 0, GR_Y1);
  gg.addColorStop(0, '#363b3a'); gg.addColorStop(.07, '#4d5250'); gg.addColorStop(.2, '#696e6c');
  gg.addColorStop(.45, '#737775'); gg.addColorStop(.72, '#636765'); gg.addColorStop(1, '#3c403f');
  g.fillStyle = gg; g.fillRect(0, HORIZON, W, GR_Y1 - HORIZON);
  for (const ox of [-W, 0, W]) { g.save(); g.translate(ox, 0); paintGround(g); g.restore(); }
}

function paintSky(g) {
  const r = rng(7);
  for (let i = 0; i < 520; i++) {
    const x = r() * W, y = SKY_Y0 + r() * (470 - SKY_Y0), s = 0.7 + r() * r() * 1.9, a = 0.2 + r() * 0.7;
    g.fillStyle = `rgba(225,235,230,${a.toFixed(2)})`; g.fillRect(x, y, s, s);
  }
  // moon
  const mx = 860, my = 70;
  const mg = g.createRadialGradient(mx, my, 20, mx, my, 250);
  mg.addColorStop(0, 'rgba(220,232,226,.32)'); mg.addColorStop(.3, 'rgba(200,214,208,.1)'); mg.addColorStop(1, 'rgba(200,214,208,0)');
  g.fillStyle = mg; g.fillRect(mx - 250, my - 250, 500, 500);
  g.fillStyle = '#e8eeea'; ell(g, mx, my, 34, 34);
  g.fillStyle = 'rgba(150,162,156,.38)';
  for (const [dx, dy, rr] of [[-10, -8, 8], [9, 6, 6], [-4, 13, 4], [13, -12, 3.5], [-15, 8, 3]]) ell(g, mx + dx, my + dy, rr, rr);
  g.translate(0, HORIZON - 548);
  // distant hills
  g.fillStyle = '#262c2b'; g.beginPath(); g.moveTo(0, SKY_Y1);
  for (let x = 0; x <= W; x += 15) {
    const y = 500 - 18 * Math.sin(2 * Math.PI * 3 * x / W) - 11 * Math.sin(2 * Math.PI * 7 * x / W + 1) - 5 * Math.sin(2 * Math.PI * 19 * x / W + 2);
    g.lineTo(x, y);
  }
  g.lineTo(W, SKY_Y1); g.closePath(); g.fill();
  // tree lines
  const tr = rng(21);
  g.fillStyle = '#1b201f';
  for (const [a, b] of [[300, 780], [960, 1420], [1640, 1920], [2230, 2720]]) {
    for (let x = a; x < b; x += 14 + tr() * 22) {
      const h = 40 + tr() * 85, rad = 18 + tr() * 26, by = 522 + tr() * 12;
      g.fillRect(x - 2, by - h * 0.4, 4, h * 0.4 + 30);
      ell(g, x, by - h * 0.5, rad, rad);
      ell(g, x + rad * 0.5, by - h * 0.5 + rad * 0.4, rad * 0.8, rad * 0.8);
    }
  }
  // silo and windmill, shrunk to sit with the distant buildings
  g.save(); g.translate(1562, 548); g.scale(0.55, 0.55); g.translate(-1562, -548);
  g.fillStyle = '#313736'; g.fillRect(1525, 250, 75, 300); ell(g, 1562.5, 250, 37.5, 26);
  g.strokeStyle = 'rgba(120,128,124,.35)'; g.lineWidth = 1.5;
  for (let y = 276; y < 548; y += 26) line(g, 1525, y, 1600, y);
  g.restore();
  g.save(); g.translate(2120, 548); g.scale(0.55, 0.55); g.translate(-2120, -548);
  g.strokeStyle = '#2a302f'; g.lineWidth = 3;
  line(g, 2095, 548, 2112, 330); line(g, 2145, 548, 2128, 330);
  for (let y = 360; y < 548; y += 45) { line(g, 2097, y, 2143, y + 40); line(g, 2143, y, 2097, y + 40); }
  g.lineWidth = 2.2; g.beginPath(); g.arc(2120, 322, 46, 0, Math.PI * 2); g.stroke();
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; line(g, 2120 + Math.cos(a) * 9, 322 + Math.sin(a) * 9, 2120 + Math.cos(a) * 48, 322 + Math.sin(a) * 48); }
  g.fillStyle = '#2a302f'; g.beginPath(); g.moveTo(2125, 318); g.lineTo(2195, 300); g.lineTo(2195, 338); g.closePath(); g.fill();
  g.restore();
}

function paintGround(g) {
  const r = rng(11);
  // furrows in the far field
  g.strokeStyle = 'rgba(28,32,31,.35)'; g.lineWidth = 1.4;
  for (let y = HORIZON + 3, k = 2.5; y < 600; y += k, k *= 1.15) line(g, 0, y, W, y);
  // pebbles
  for (let i = 0; i < 2300; i++) {
    const x = r() * W, y = HORIZON + 30 + Math.pow(r(), 0.9) * (GR_Y1 - HORIZON - 44);
    const k = (y - HORIZON) / 420, s = (0.8 + r() * 2.8) * k;
    g.fillStyle = 'rgba(26,29,28,.42)'; ell(g, x + s * 0.3, y + s * 0.35, s * 1.2, s * 0.75);
    const v = 160 + (r() * 45 | 0);
    g.fillStyle = `rgba(${v},${v + 5},${v + 2},.36)`; ell(g, x, y, s * 1.1, s * 0.65);
  }
  for (let i = 0; i < 2600; i++) {
    const x = r() * W, y = 600 + r() * (GR_Y1 - 600);
    g.fillStyle = r() < 0.5 ? 'rgba(20,22,21,.28)' : 'rgba(195,203,199,.18)';
    g.fillRect(x, y, 1.3, 1.3);
  }
  // straw
  g.lineWidth = 1.1; g.strokeStyle = 'rgba(196,200,184,.28)';
  for (let i = 0; i < 650; i++) {
    const x = r() * W, y = 610 + r() * 640, k = (y - HORIZON) / 420, len = (6 + r() * 14) * k, a = r() * Math.PI;
    line(g, x, y, x + Math.cos(a) * len, y + Math.sin(a) * len * 0.35);
  }
  // cart ruts
  g.strokeStyle = 'rgba(30,33,32,.28)'; g.lineWidth = 6;
  for (const yy of [818, 846]) { g.beginPath(); for (let x = 0; x <= W; x += 20) { const y = yy + 6 * Math.sin(2 * Math.PI * 4 * x / W); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }

  for (const [a, b] of [[60, 1180], [2380, 3060]]) slab(g, a, b, r);

  // buildings were drawn standing on y=600; push each one back into the distance about its own centre
  const far = (cx, fn) => { g.save(); g.translate(cx, BASE); g.scale(FAR_K, FAR_K); g.translate(-cx, -600); fn(); g.restore(); };
  far(380, () => barnA(g, r)); far(865, () => fence(g, 720, 1010)); far(1185, () => hay(g, r));
  far(1610, () => coop(g, r)); far(2122, () => fence(g, 1900, 2345)); far(2125, () => trough(g)); far(2665, () => barnC(g, r));
  weeds(g, r);
}

function slab(g, a, b, r) {
  g.fillStyle = '#7f8482'; g.fillRect(a, 706, b - a, 32);
  g.fillStyle = '#474c4a'; g.fillRect(a, 738, b - a, 15);
  g.fillStyle = 'rgba(25,28,27,.5)'; g.fillRect(a, 753, b - a, 4);
  g.strokeStyle = '#a6aba8'; g.lineWidth = 2; line(g, a, 706, b, 706);
  g.strokeStyle = '#1c1f1e'; g.lineWidth = 2.2; g.beginPath();
  for (let x = a; x <= b; x += 12) { const y = 738 + (r() - 0.5) * 2.5; x === a ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
  g.strokeStyle = 'rgba(30,33,32,.5)'; g.lineWidth = 1.5;
  for (let x = a + 150; x < b; x += 160) line(g, x, 707, x - 4, 738);
  for (let i = 0; i < (b - a) / 6; i++) { g.fillStyle = r() < .5 ? 'rgba(40,44,43,.3)' : 'rgba(200,206,203,.2)'; g.fillRect(a + r() * (b - a), 708 + r() * 28, 1.5 + r() * 2, 1.2); }
}

function base(g, a, b) {
  g.fillStyle = '#969b98'; g.fillRect(a, 566, b - a, 32);
  g.strokeStyle = '#b6bbb8'; g.lineWidth = 2; line(g, a, 566, b, 566);
  g.fillStyle = '#3a3e3d'; g.fillRect(a, 598, b - a, 4);
}
function stains(g, r, a, b, y0, y1, n) {
  for (let i = 0; i < n; i++) { g.fillStyle = `rgba(45,50,48,${(0.08 + r() * 0.18).toFixed(2)})`; ell(g, a + r() * (b - a), y0 + r() * (y1 - y0), 4 + r() * 18, 3 + r() * 10); }
}
function ratHole(g, x) { g.fillStyle = '#121514'; g.beginPath(); g.ellipse(x, 598, 16, 13, 0, Math.PI, 0); g.fill(); }

function barnA(g, r) {
  g.fillStyle = '#2d3231'; g.beginPath(); g.moveTo(10, 304); g.lineTo(380, 162); g.lineTo(750, 304); g.closePath(); g.fill();
  g.strokeStyle = '#5b605e'; g.lineWidth = 4; g.beginPath(); g.moveTo(10, 304); g.lineTo(380, 162); g.lineTo(750, 304); g.stroke();
  const wg = g.createLinearGradient(0, 300, 0, 596); wg.addColorStop(0, '#6f7472'); wg.addColorStop(1, '#8e9391');
  g.fillStyle = wg; g.fillRect(40, 300, 680, 270);
  g.strokeStyle = 'rgba(40,44,43,.32)'; g.lineWidth = 1.5;
  for (let x = 62; x < 720; x += 22) line(g, x, 300, x, 566);
  stains(g, r, 40, 720, 310, 560, 60);
  // hay loft door
  g.fillStyle = '#1d2120'; g.fillRect(345, 222, 70, 62);
  g.strokeStyle = '#8a8f8d'; g.lineWidth = 4; g.strokeRect(345, 222, 70, 62);
  // big door
  g.fillStyle = '#555a58'; g.fillRect(250, 360, 220, 206);
  g.strokeStyle = '#9ca19e'; g.lineWidth = 6; g.strokeRect(250, 360, 220, 206);
  g.strokeStyle = '#868b89'; g.lineWidth = 8;
  line(g, 254, 364, 356, 562); line(g, 356, 364, 254, 562); line(g, 364, 364, 466, 562); line(g, 466, 364, 364, 562);
  line(g, 360, 360, 360, 566);
  g.fillStyle = '#1d2120'; g.fillRect(590, 360, 70, 52);
  g.strokeStyle = '#9ca19e'; g.lineWidth = 3; g.strokeRect(590, 360, 70, 52); line(g, 625, 360, 625, 412); line(g, 590, 386, 660, 386);
  base(g, 40, 720); ratHole(g, 150); ratHole(g, 560);
}

function fence(g, a, b) {
  g.fillStyle = '#5c615f';
  for (let x = a + 10; x < b; x += 70) { g.beginPath(); g.moveTo(x, 600); g.lineTo(x, 474); g.lineTo(x + 6, 468); g.lineTo(x + 12, 474); g.lineTo(x + 12, 600); g.fill(); }
  for (const y of [490, 528, 566]) {
    g.fillStyle = '#6d7270'; g.fillRect(a, y, b - a, 9);
    g.fillStyle = 'rgba(25,28,27,.5)'; g.fillRect(a, y + 9, b - a, 2);
  }
}

function hay(g, r) {
  const bale = (x, y, rad) => {
    const hg = g.createRadialGradient(x - rad * 0.3, y - rad * 0.3, rad * 0.1, x, y, rad);
    hg.addColorStop(0, '#a8aca3'); hg.addColorStop(1, '#666a63');
    g.fillStyle = hg; ell(g, x, y, rad, rad);
    g.strokeStyle = 'rgba(55,59,54,.35)'; g.lineWidth = 1.4;
    for (let k = 7; k < rad; k += 7) { g.beginPath(); g.arc(x + 1.5, y + 1, k, 0, Math.PI * 2); g.stroke(); }
    g.strokeStyle = 'rgba(205,210,195,.3)'; g.lineWidth = 1;
    for (let i = 0; i < 30; i++) { const a = r() * 6.28, d = r() * rad * 0.9; const px = x + Math.cos(a) * d, py = y + Math.sin(a) * d; line(g, px, py, px + (r() - .5) * 10, py + (r() - .5) * 6); }
  };
  bale(1070, 541, 56); bale(1185, 543, 54); bale(1295, 541, 56);
  bale(1127, 448, 52); bale(1240, 450, 52);
  g.fillStyle = 'rgba(25,28,27,.4)'; g.fillRect(1010, 596, 350, 6);
}

function coop(g, r) {
  g.fillStyle = '#2f3433'; g.beginPath(); g.moveTo(1300, 328); g.lineTo(1920, 360); g.lineTo(1920, 376); g.lineTo(1300, 344); g.closePath(); g.fill();
  for (let x = 1330, i = 0; x < 1890; x += 7, i++) { g.fillStyle = i % 2 ? '#727775' : '#848987'; g.fillRect(x, 342 + (x - 1330) * 0.052, 7, 230); }
  g.fillStyle = 'rgba(30,34,33,.5)'; g.fillRect(1330, 470, 560, 3);
  stains(g, r, 1330, 1890, 360, 560, 40);
  g.fillStyle = '#191d1c'; g.fillRect(1430, 405, 100, 70);
  g.strokeStyle = '#a0a5a2'; g.lineWidth = 4; g.strokeRect(1430, 405, 100, 70); line(g, 1480, 405, 1480, 475); line(g, 1430, 440, 1530, 440);
  g.fillStyle = '#5a5f5d'; g.fillRect(1580, 400, 72, 170);
  g.strokeStyle = '#8e9391'; g.lineWidth = 3; g.strokeRect(1580, 400, 72, 170);
  g.fillStyle = '#c9ceca'; ell(g, 1640, 488, 3, 3);
  base(g, 1330, 1890); ratHole(g, 1395);
  // feed sacks
  const sack = (x, y, label) => {
    g.fillStyle = '#a9ada8'; g.beginPath(); g.roundRect(x, y, 82, 44, 12); g.fill();
    g.strokeStyle = 'rgba(40,44,43,.6)'; g.lineWidth = 2; g.stroke();
    g.fillStyle = 'rgba(40,44,43,.25)'; g.fillRect(x + 4, y + 34, 74, 6);
    g.fillStyle = '#3d4240'; g.font = '700 17px "Big Shoulders Stencil Display", Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(label, x + 41, y + 21);
  };
  const [s0, s1, s2] = STR[LANG].sacks;
  sack(1680, 552, s0); sack(1766, 552, s1); sack(1722, 509, s0); sack(1808, 509, s2);
}

function trough(g) {
  g.fillStyle = '#3e4342'; g.fillRect(2000, 584, 8, 16); g.fillRect(2160, 584, 8, 16);
  g.fillStyle = '#5d6260'; g.beginPath(); g.moveTo(1985, 548); g.lineTo(2183, 548); g.lineTo(2170, 588); g.lineTo(1998, 588); g.closePath(); g.fill();
  g.strokeStyle = '#a3a8a5'; g.lineWidth = 4; line(g, 1985, 548, 2183, 548);
  g.strokeStyle = 'rgba(30,33,32,.4)'; g.lineWidth = 2; for (let x = 2010; x < 2170; x += 18) line(g, x, 552, x - 2, 586);
  // tractor tyre
  g.fillStyle = '#272b2a'; ell(g, 2262, 556, 42, 44);
  g.fillStyle = '#4b504e'; ell(g, 2262, 556, 19, 20);
  g.strokeStyle = 'rgba(120,128,124,.5)'; g.lineWidth = 3;
  for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2; line(g, 2262 + Math.cos(a) * 34, 556 + Math.sin(a) * 36, 2262 + Math.cos(a) * 42, 556 + Math.sin(a) * 44); }
}

function barnC(g, r) {
  g.fillStyle = '#2e3332'; g.beginPath(); g.moveTo(2320, 338); g.lineTo(2665, 250); g.lineTo(3010, 338); g.closePath(); g.fill();
  g.strokeStyle = '#5a5f5d'; g.lineWidth = 4; g.beginPath(); g.moveTo(2320, 338); g.lineTo(2665, 250); g.lineTo(3010, 338); g.stroke();
  for (let y = 336, i = 0; y < 566; y += 23, i++) {
    g.fillStyle = i % 2 ? '#757a78' : '#7f8482'; g.fillRect(2340, y, 650, 23);
    g.fillStyle = 'rgba(30,33,32,.4)'; g.fillRect(2340, y + 21, 650, 2);
  }
  stains(g, r, 2340, 2990, 340, 560, 50);
  g.fillStyle = '#3a3f3e'; g.fillRect(2540, 352, 260, 6);
  g.fillStyle = '#5e6361'; g.fillRect(2560, 362, 220, 204);
  g.strokeStyle = '#929795'; g.lineWidth = 5; g.strokeRect(2560, 362, 220, 204);
  g.strokeStyle = '#7c817f'; g.lineWidth = 7; line(g, 2564, 562, 2776, 366); line(g, 2560, 464, 2780, 464);
  // pallets
  g.fillStyle = '#8b908e';
  for (let i = 0; i < 6; i++) { g.save(); g.translate(2405 + i * 14, 566); g.rotate(-0.12); g.fillRect(0, -120, 10, 120); g.restore(); }
  g.fillStyle = '#6a6f6d'; g.save(); g.translate(2400, 566); g.rotate(-0.12); g.fillRect(-4, -110, 92, 9); g.fillRect(-4, -60, 92, 9); g.fillRect(-4, -14, 92, 9); g.restore();
  base(g, 2340, 2990); ratHole(g, 2870); ratHole(g, 2480);
}

function weeds(g, r) {
  for (let i = 0; i < 280; i++) {
    const x = r() * W, by = 1250 + r() * 130, h = 40 + r() * 110, n = 5 + (r() * 6 | 0);
    for (let j = 0; j < n; j++) {
      const off = (r() - .5) * 26, lean = (r() - .5) * h * 0.8, top = h * (0.55 + r() * 0.45);
      g.strokeStyle = r() < 0.2 ? 'rgba(95,101,98,.65)' : 'rgba(24,27,26,.92)';
      g.lineWidth = 1.8 + r() * 3;
      g.beginPath(); g.moveTo(x + off, by); g.quadraticCurveTo(x + off + lean * 0.2, by - top * 0.6, x + off + lean, by - top); g.stroke();
    }
  }
}

/* ---------- night-vision post ---------- */
function buildPost() {
  noisePats = [];
  for (let k = 0; k < 4; k++) {
    const c = mk(128, 128), g = c.getContext('2d'), id = g.createImageData(128, 128);
    for (let i = 0; i < 128 * 128; i++) {
      const v = Math.random() * 255 | 0;
      id.data[i * 4] = v; id.data[i * 4 + 1] = v; id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = Math.random() * 46 | 0;
    }
    g.putImageData(id, 0, 0);
    noisePats.push(ctx.createPattern(c, 'repeat'));
  }
  const sc = mk(1, 4), sg = sc.getContext('2d');
  sg.fillStyle = 'rgba(0,0,0,.16)'; sg.fillRect(0, 0, 1, 2);
  scanPat = ctx.createPattern(sc, 'repeat');
  const cx = cv.width / 2, cy = cv.height / 2, m = Math.max(cv.width, cv.height);
  vignette = ctx.createRadialGradient(cx, cy, Math.min(cv.width, cv.height) * 0.22, cx, cy, m * 0.72);
  vignette.addColorStop(0, 'rgba(0,0,0,0)'); vignette.addColorStop(.55, 'rgba(0,0,0,.28)'); vignette.addColorStop(1, 'rgba(0,0,0,.85)');
}

/* ---------- yard clutter (placement and hit tests are in js/game.js) ---------- */
function metal(g, x0, x1, light = '#c6cbc8', dark = '#565b59') {
  const m = g.createLinearGradient(x0, 0, x1, 0);
  m.addColorStop(0, dark); m.addColorStop(0.3, light); m.addColorStop(0.55, '#8e9391'); m.addColorStop(1, dark);
  return m;
}
function drawObs(g, o, sx, sy) {
  g.save(); g.translate(sx, sy);
  if (o.hopT > 0) { const k = o.hopT / 0.45; g.translate(0, -Math.sin(k * Math.PI) * 14 * o.s); g.rotate((1 - k) * 0.6 * o.flip); }
  g.scale(o.s * o.flip, o.s);
  const w = OBS_W[o.type] / 2;
  g.fillStyle = 'rgba(10,12,11,.35)'; ell(g, 2, 0, w * 1.05, 3.5);
  switch (o.type) {
    case 'mound': {
      const h = moundH(o), mw = 65;
      g.beginPath(); g.moveTo(-mw, 0);
      g.bezierCurveTo(-mw * 0.6, -h * 0.2, -mw * 0.45, -h, 0, -h);
      g.bezierCurveTo(mw * 0.45, -h, mw * 0.6, -h * 0.2, mw, 0); g.closePath();
      const mg = g.createLinearGradient(0, -h, 0, 0);
      mg.addColorStop(0, '#858987'); mg.addColorStop(0.6, '#6a6e6c'); mg.addColorStop(1, '#4c504e');
      g.fillStyle = mg; g.fill();
      g.save(); g.clip();
      const pr = rng(o.seed);
      for (let i = 0; i < 26; i++) {
        const px = (pr() - 0.5) * mw * 1.8, py = -pr() * h, ps = 0.8 + pr() * 2.2;
        g.fillStyle = 'rgba(30,33,32,.4)'; ell(g, px + 0.6, py + 0.6, ps * 1.1, ps * 0.7);
        g.fillStyle = 'rgba(200,206,203,.35)'; ell(g, px, py, ps, ps * 0.6);
      }
      g.strokeStyle = 'rgba(205,212,208,.3)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(-mw * 0.55, -h * 0.55); g.bezierCurveTo(-mw * 0.35, -h * 1.0, mw * 0.3, -h * 1.0, mw * 0.5, -h * 0.6); g.stroke();
      g.restore();
      break;
    }
    case 'can': {
      if (o.lying) {
        const lg = g.createLinearGradient(0, -13, 0, 0); lg.addColorStop(0, '#5a5f5d'); lg.addColorStop(0.3, '#d0d5d2'); lg.addColorStop(0.6, '#8e9391'); lg.addColorStop(1, '#3d4140');
        g.fillStyle = lg; g.fillRect(-11, -13, 21, 13);
        g.fillStyle = '#3a3e3d'; g.fillRect(-6, -13, 9, 13);                    // label band
        g.strokeStyle = 'rgba(30,33,32,.5)'; g.lineWidth = 0.7; for (let x = -9; x < 10; x += 3) line(g, x, -13, x, 0);
        g.fillStyle = '#a9aeab'; ell(g, 10, -6.5, 3, 6.5);
        g.strokeStyle = '#2e3231'; g.lineWidth = 1; g.beginPath(); g.ellipse(10, -6.5, 3, 6.5, 0, 0, Math.PI * 2); g.stroke();
        g.fillStyle = '#5f6462'; ell(g, -11, -6.5, 2, 6.5);
      } else {
        g.fillStyle = metal(g, -8, 8); g.fillRect(-7.5, -20, 15, 20);
        g.fillStyle = '#3a3e3d'; g.fillRect(-7.5, -14, 15, 8);
        g.fillStyle = '#b9beba'; ell(g, 0, -20, 7.5, 2.4);
        g.strokeStyle = '#2e3231'; g.lineWidth = 0.8; g.beginPath(); g.ellipse(0, -20, 7.5, 2.4, 0, 0, Math.PI * 2); g.stroke();
        g.strokeStyle = 'rgba(20,22,21,.6)'; g.lineWidth = 1; line(g, 2, -12, 5, -8); // dent
      }
      break;
    }
    case 'bag': {
      g.fillStyle = '#262928';
      ell(g, -12, -11, 17, 11); ell(g, 7, -14, 19, 14); ell(g, 20, -7, 10, 7); ell(g, -22, -6, 8, 6);
      g.beginPath(); g.moveTo(-22, -16); g.lineTo(-30, -26); g.lineTo(-24, -27); g.lineTo(-18, -19); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(220,228,224,.4)'; g.lineWidth = 1.4; g.lineCap = 'round';
      g.beginPath(); g.arc(8, -14, 13, 3.6, 4.6); g.stroke();
      g.beginPath(); g.arc(-12, -11, 11, 3.5, 4.3); g.stroke();
      g.strokeStyle = 'rgba(220,228,224,.18)'; line(g, -2, -24, 4, -6); line(g, 14, -22, 18, -10);
      break;
    }
    case 'box': {
      g.fillStyle = '#6d706a'; g.beginPath(); g.moveTo(16, -26); g.lineTo(24, -31); g.lineTo(24, -5); g.lineTo(16, 0); g.closePath(); g.fill();
      g.fillStyle = '#8f928b'; g.fillRect(-24, -26, 40, 26);
      g.fillStyle = '#9fa29b'; g.beginPath(); g.moveTo(-24, -26); g.lineTo(-30, -36); g.lineTo(-6, -36); g.lineTo(0, -26); g.closePath(); g.fill();
      g.fillStyle = '#7c7f78'; g.beginPath(); g.moveTo(16, -26); g.lineTo(24, -31); g.lineTo(28, -40); g.lineTo(18, -34); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(30,33,32,.5)'; g.lineWidth = 1; g.strokeRect(-24, -26, 40, 26);
      g.fillStyle = 'rgba(205,210,200,.35)'; g.fillRect(-24, -15, 40, 3);
      g.strokeStyle = 'rgba(30,33,32,.35)'; line(g, -14, -8, -4, -20); line(g, 2, -6, 10, -14);
      break;
    }
    case 'bottle': {
      g.fillStyle = 'rgba(176,188,182,.55)';
      g.beginPath(); g.roundRect(-13, -10, 20, 10, 4); g.fill();
      g.beginPath(); g.moveTo(7, -8); g.lineTo(12, -6.5); g.lineTo(16, -6.5); g.lineTo(16, -3.5); g.lineTo(12, -3.5); g.lineTo(7, -2); g.closePath(); g.fill();
      g.strokeStyle = 'rgba(235,242,238,.75)'; g.lineWidth = 1.3; line(g, -10, -8, 5, -8);
      g.strokeStyle = 'rgba(40,44,42,.5)'; g.lineWidth = 0.8; g.beginPath(); g.roundRect(-13, -10, 20, 10, 4); g.stroke();
      g.fillStyle = 'rgba(30,33,32,.35)'; g.fillRect(-7, -9, 8, 8);
      break;
    }
    case 'ebottle': {
      // empty upright glass bottle: see-through body, bright rim highlights from the IR lamp
      g.beginPath();
      if (o.broken) {
        g.moveTo(-6.5, -1); g.lineTo(-6.5, -9); g.lineTo(-4, -12); g.lineTo(-1.5, -8); g.lineTo(1, -13); g.lineTo(3.5, -9); g.lineTo(6.5, -11); g.lineTo(6.5, -1);
        g.quadraticCurveTo(6.5, 0, 5, 0); g.lineTo(-5, 0); g.quadraticCurveTo(-6.5, 0, -6.5, -1);
      } else {
        g.moveTo(-6.5, -1); g.lineTo(-6.5, -25); g.bezierCurveTo(-6.5, -30, -2.6, -31, -2.6, -35); g.lineTo(-2.6, -42);
        g.lineTo(-3.2, -42.5); g.lineTo(-3.2, -44.5); g.lineTo(3.2, -44.5); g.lineTo(3.2, -42.5); g.lineTo(2.6, -42);
        g.lineTo(2.6, -35); g.bezierCurveTo(2.6, -31, 6.5, -30, 6.5, -25); g.lineTo(6.5, -1);
        g.quadraticCurveTo(6.5, 0, 5, 0); g.lineTo(-5, 0); g.quadraticCurveTo(-6.5, 0, -6.5, -1);
      }
      g.closePath();
      g.fillStyle = 'rgba(196,212,204,.16)'; g.fill();
      g.strokeStyle = 'rgba(222,234,228,.6)'; g.lineWidth = 0.9; g.stroke();
      g.strokeStyle = 'rgba(245,252,248,.85)'; g.lineWidth = 1.3; g.lineCap = 'round';
      line(g, -4.2, o.broken ? -8 : -23, -4.2, -3);
      if (!o.broken) { line(g, -1.3, -40, -1.3, -34); }
      g.fillStyle = 'rgba(210,224,218,.45)'; ell(g, 0, -1.5, 5.5, 1.4);   // thick glass base
      break;
    }
    case 'bucket': {
      g.beginPath(); g.moveTo(-17, 0); g.lineTo(-13, -28); g.lineTo(13, -28); g.lineTo(17, 0); g.closePath();
      g.fillStyle = metal(g, -17, 17); g.fill();
      g.strokeStyle = 'rgba(30,33,32,.45)'; g.lineWidth = 0.8;
      for (const y of [-21, -12]) { const hw = 13 + (y + 28) / 7; line(g, -hw, y, hw, y); }
      g.fillStyle = '#5c615f'; g.fillRect(-18, -2.5, 36, 2.5);
      g.strokeStyle = '#7d827f'; g.lineWidth = 1.4; g.beginPath(); g.arc(0, -6, 16, 0.2, Math.PI - 0.2); g.stroke();
      g.fillStyle = 'rgba(25,28,27,.35)'; ell(g, 6, -16, 3, 2);  // rust spot
      break;
    }
  }
  g.restore();
}
