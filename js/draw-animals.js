'use strict';
/* Rat Sniper: drawing the other animals. Owl, UFO rat, jackal, wild boar.
   One of the game's plain scripts (see index.html); they share one global scope, so names here are
   used directly by js/game.js and the other files.
   Their behaviour (spawning, movement, hits) is in js/game.js. */

function drawOwl(g, o, sx, sy) {
  g.save(); g.translate(sx, sy); g.scale(o.s, o.s);
  const bodyGrad = () => { const bg = g.createLinearGradient(0, -40, 0, 0); bg.addColorStop(0, '#9a9486'); bg.addColorStop(1, '#4a463d'); return bg; };
  const eyes = (cx, cy, k) => {
    if (o.blink > 0 && !o.fly) { g.strokeStyle = '#2a2722'; g.lineWidth = 1; line(g, cx - 7, cy, cx - 3, cy); line(g, cx + 3, cy, cx + 7, cy); return; }
    for (const ex of [cx - 5 * k, cx + 5 * k]) glowEye(g, ex, cy, '#ffffff', '255,255,255', 9);
  };
  if (o.fly) {
    // wings beating, body tipped forward into the flight
    const a = Math.sin(o.ft * 18), dir = Math.sign(o.vx) || 1;
    g.rotate(0.35 * dir);
    g.fillStyle = '#5d584c';
    for (const side of [-1, 1]) {
      g.beginPath(); g.moveTo(side * 6, -26); g.quadraticCurveTo(side * 26, -40 - a * 16, side * 40, -30 - a * 22);
      g.quadraticCurveTo(side * 28, -18 - a * 6, side * 6, -16); g.closePath(); g.fill();
    }
    g.fillStyle = bodyGrad(); ell(g, 0, -22, 11, 16);
    g.fillStyle = '#8f897c'; ell(g, 0, -38, 10, 9);
    eyes(0, -39, 0.85);
  } else {
    g.fillStyle = '#8a8070'; for (const tx of [-5, -3, 3, 5]) ell(g, tx, -0.5, 1.2, 1.6);          // talons on the ledge
    g.fillStyle = bodyGrad(); ell(g, 0, -20, 13, 19);
    g.fillStyle = '#3e3a32'; ell(g, -10, -19, 6, 15, 0.15); ell(g, 10, -19, 6, 15, -0.15);         // folded wings
    g.strokeStyle = 'rgba(30,26,20,.45)'; g.lineWidth = 1;
    for (let i = 0; i < 6; i++) { const y = -28 + i * 4; line(g, -4, y, -3, y + 2); line(g, 3, y + 1, 4, y + 3); }  // breast streaks
    // head: turns side to side; past a quarter turn we see the back of it
    const t = o.turn, back = Math.abs(t) > 1.3, hx = Math.sin(Math.max(-1.2, Math.min(1.2, t))) * 5;
    g.fillStyle = '#857f71'; ell(g, 0, -40, 12.5, 11);
    g.fillStyle = '#6e695c';
    for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(sd * 9 + hx * 0.3, -46); g.lineTo(sd * 8 + hx * 0.3, -55); g.lineTo(sd * 3 + hx * 0.3, -48); g.closePath(); g.fill(); }  // ear tufts
    if (!back) {
      g.fillStyle = '#b9b2a4'; ell(g, -5 + hx, -40, 5.6, 6.2); ell(g, 5 + hx, -40, 5.6, 6.2);         // facial disc
      g.strokeStyle = 'rgba(40,36,30,.6)'; g.lineWidth = 0.8; g.beginPath(); g.ellipse(hx, -39, 11, 9, 0, 0, Math.PI * 2); g.stroke();
      eyes(hx, -40, 1);
      g.fillStyle = '#2a2620'; g.beginPath(); g.moveTo(hx, -35); g.lineTo(hx - 1.6, -38); g.lineTo(hx + 1.6, -38); g.closePath(); g.fill();
    } else {
      g.strokeStyle = 'rgba(40,36,30,.5)'; g.lineWidth = 1; for (let i = -2; i <= 2; i++) line(g, i * 3, -48, i * 2.5, -32);
    }
  }
  g.restore();
}

function drawUfo(g, u, sx, sy) {
  g.save(); g.translate(sx, sy); g.rotate(u.rot); g.scale(u.s, u.s);
  const crashed = u.state === 'crashed', t = u.t;
  // tractor beam while it hovers over the yard
  if (u.state === 'fly' && u.hover > 0) {
    g.globalCompositeOperation = 'lighter';
    const bm = g.createLinearGradient(0, 6, 0, 150);
    bm.addColorStop(0, 'rgba(190,255,210,.35)'); bm.addColorStop(1, 'rgba(190,255,210,0)');
    g.fillStyle = bm; g.beginPath(); g.moveTo(-12, 8); g.lineTo(12, 8); g.lineTo(40, 150); g.lineTo(-40, 150); g.closePath(); g.fill();
    g.globalCompositeOperation = 'source-over';
  }
  // glass dome with the pilot inside
  g.save(); g.beginPath(); g.ellipse(0, -10, 17, 15, 0, Math.PI, 0); g.closePath(); g.clip();
  g.fillStyle = 'rgba(40,52,50,.85)'; g.fillRect(-18, -26, 36, 18);
  if (!crashed) {
    g.fillStyle = 'rgba(190,182,184,.95)'; ell(g, -8, -21, 4, 5, 0.4); ell(g, 8, -21, 4, 5, -0.4);   // ears
    g.fillStyle = '#5a5f5d'; ell(g, 0, -15, 8, 7);
    g.fillStyle = SKIN; ell(g, 0, -11.5, 1.6, 1.2);
    for (const ex of [-3, 3]) glowEye(g, ex, -16, '#ffffff', '255,255,255', 6);
    g.fillStyle = SKIN; ell(g, -5, -9, 1.6, 1.2); ell(g, 5, -9, 1.6, 1.2);                          // paws on the controls
  }
  g.restore();
  g.fillStyle = 'rgba(200,225,220,.18)'; g.beginPath(); g.ellipse(0, -10, 17, 15, 0, Math.PI, 0); g.fill();
  g.strokeStyle = 'rgba(230,245,240,.75)'; g.lineWidth = 1.2; g.beginPath(); g.ellipse(0, -10, 17, 15, 0, Math.PI, 0); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = 1.6; g.beginPath(); g.arc(-4, -16, 9, Math.PI * 1.15, Math.PI * 1.45); g.stroke();
  if (crashed) { g.strokeStyle = 'rgba(240,250,245,.85)'; g.lineWidth = 0.8; line(g, -6, -22, 2, -14); line(g, 2, -14, -2, -10); line(g, 2, -14, 9, -18); }
  // hull: upper deck, rim band with running lights, underside
  const hg = g.createLinearGradient(0, -12, 0, 10);
  hg.addColorStop(0, '#c9cfcc'); hg.addColorStop(0.45, '#7d8481'); hg.addColorStop(1, '#3a3f3d');
  g.fillStyle = hg; ell(g, 0, -4, 34, 8);
  g.fillStyle = '#9aa19e'; ell(g, 0, 0, 44, 8);
  g.fillStyle = '#3b403e'; ell(g, 0, 3, 40, 6);
  g.strokeStyle = 'rgba(20,22,21,.6)'; g.lineWidth = 0.8; g.beginPath(); g.ellipse(0, 0, 44, 8, 0, 0, Math.PI * 2); g.stroke();
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2 + t * 2.5, lx = Math.cos(a) * 40, ly = Math.sin(a) * 6;
    if (ly < -1) continue;                                  // only the lights on the near side of the rim
    const on = crashed ? Math.random() < 0.2 : (Math.floor(t * 6) + i) % 3 !== 0;
    if (on) glowEye(g, lx, ly, i % 2 ? '#d8ffe0' : '#fff2c8', i % 2 ? '200,255,215' : '255,236,190', 9);
    else { g.fillStyle = '#222624'; ell(g, lx, ly, 2.4, 1.8); }
  }
  g.fillStyle = 'rgba(210,255,225,.55)'; ell(g, 0, 7, 9, 2.4);   // landing light underneath
  g.restore();
}

// dead: flips onto its back like the rats and slides to a stop
function drawJackalAt(g, j, sx, sy) {
  g.save(); g.translate(sx, sy);
  if (!j.alive) {
    const k = Math.min(1, j.deadT / 0.35), s = j.sc;
    g.translate(0, -Math.sin(k * Math.PI) * 30 * s + k * 84 * s);
    g.translate(0, -112 * s); g.rotate(Math.PI * k * j.dir); g.translate(0, 112 * s);
  }
  g.scale(j.sc * j.dir, j.sc);
  drawJackal(g, j.alive ? j.ph : 0.6, !j.alive);
  g.restore();
}
// Jackal drawing: side view facing right, feet on y = 0, in rat-sized world units; ph is the trot phase.
function drawJackal(g, ph, dead = false) {
  const OUT = 'rgba(12,14,13,.88)';
  const bob = -Math.abs(Math.sin(ph)) * 3;
  // a whole leg as one tapered polyline (thick at the top, thin at the foot)
  const limb = (pts, w0, w1, col) => {
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < pts.length - 1; i++) {
        const w = w0 + (w1 - w0) * (i / (pts.length - 2 || 1));
        g.strokeStyle = pass ? col : OUT; g.lineWidth = pass ? w : w + 3;
        g.beginPath(); g.moveTo(pts[i][0], pts[i][1]); g.lineTo(pts[i + 1][0], pts[i + 1][1]); g.stroke();
      }
    }
    const [px, py] = pts[pts.length - 1];
    g.fillStyle = OUT; g.beginPath(); g.ellipse(px + 4, py - 2, 7.5, 4, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = col; g.beginPath(); g.ellipse(px + 4, py - 2.3, 6, 2.8, 0, 0, Math.PI * 2); g.fill();
  };
  const ground = (y, lift) => lift > 0.1 ? y : Math.min(y, 0);
  // trot: near-front moves with far-hind, far-front with near-hind
  const leg = (hind, far) => {
    const off = (hind ? Math.PI : 0) + (far ? Math.PI : 0);
    const a = Math.sin(ph + off), lift = Math.max(0, Math.cos(ph + off));
    const col = far ? '#323634' : '#6f7471', foot = far ? '#2b2f2d' : '#8c918e';
    if (!hind) {
      const sx = far ? 50 : 44, sy = -100 + bob;
      const t1 = a * 0.5, ex = sx + 46 * Math.sin(t1), ey = sy + 46 * Math.cos(t1);
      const t2 = t1 - lift * 1.1, wx = ex + 42 * Math.sin(t2), wy = ey + 42 * Math.cos(t2);
      const t3 = t2 - lift * 0.6, px = wx + 9 * Math.sin(t3), py = ground(wy + 9 * Math.cos(t3), lift);
      limb([[sx, sy], [ex, ey], [wx, wy], [px, py]], far ? 11 : 13, far ? 5 : 6, far ? col : foot);
    } else {
      const hx = far ? -64 : -72, hy = -102 + bob;
      const t1 = a * 0.45 + 0.3, kx = hx + 40 * Math.sin(t1), ky = hy + 40 * Math.cos(t1);
      const t2 = t1 - 1.0 - lift * 0.4, xx = kx + 38 * Math.sin(t2), xy = ky + 38 * Math.cos(t2);
      const t3 = -0.05 + lift * 0.7, px = xx + 28 * Math.sin(t3), py = ground(xy + 28 * Math.cos(t3), lift);
      limb([[hx, hy], [kx, ky], [xx, xy], [px, py]], far ? 15 : 18, far ? 5 : 6, far ? col : foot);
    }
  };
  const coat = (y0, y1, c) => { const gr = g.createLinearGradient(0, y0, 0, y1); c.forEach((col, i) => gr.addColorStop(i / (c.length - 1), col)); return gr; };
  const COAT = ['#3c403e', '#575c59', '#7f8481'];
  // ground shadow
  g.fillStyle = 'rgba(10,12,11,.32)'; g.beginPath(); g.ellipse(-10, 0, 100, 7, 0, 0, Math.PI * 2); g.fill();
  leg(false, true); leg(true, true);
  g.save(); g.translate(0, bob);
  // bushy tail hanging down behind, swaying a little, black tip
  const sw = Math.sin(ph * 0.5) * 6;
  g.beginPath();
  g.moveTo(-96, -124);
  g.bezierCurveTo(-130, -112, -142 + sw, -84, -150 + sw, -42);
  g.bezierCurveTo(-153 + sw, -26, -137 + sw, -24, -133 + sw, -40);
  g.bezierCurveTo(-125 + sw, -72, -112, -96, -90, -106);
  g.closePath();
  const tg = g.createLinearGradient(-96, -124, -145, -30);
  tg.addColorStop(0, '#4e5350'); tg.addColorStop(0.55, '#3a3e3c'); tg.addColorStop(0.75, '#191c1b'); tg.addColorStop(1, '#0c0e0d');
  g.fillStyle = tg; g.fill(); g.strokeStyle = OUT; g.lineWidth = 2; g.stroke();
  g.strokeStyle = 'rgba(160,166,163,.22)'; g.lineWidth = 1;
  for (let i = 0; i < 9; i++) { const t = i / 9; g.beginPath(); g.moveTo(-104 - t * 40 + sw * t, -114 + t * 70); g.lineTo(-112 - t * 40 + sw * t, -106 + t * 70); g.stroke(); }
  // body: deep chest, tucked belly, rounded haunch
  g.beginPath();
  g.moveTo(-104, -112);
  g.bezierCurveTo(-96, -132, -60, -136, 0, -140);
  g.bezierCurveTo(30, -142, 62, -134, 74, -112);
  g.bezierCurveTo(80, -96, 64, -84, 42, -84);
  g.bezierCurveTo(12, -82, -20, -90, -46, -92);
  g.bezierCurveTo(-90, -86, -112, -96, -104, -112);
  g.closePath();
  g.fillStyle = coat(-142, -82, COAT); g.fill(); g.strokeStyle = OUT; g.lineWidth = 2.2; g.stroke();
  // grizzled saddle
  g.save(); g.clip();
  let s = 7; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  g.lineWidth = 1.1;
  for (let i = 0; i < 100; i++) {
    const x = -104 + r() * 178, y = -142 + r() * 32, l = 3 + r() * 5;
    g.strokeStyle = r() < 0.5 ? 'rgba(18,20,19,.5)' : 'rgba(190,196,193,.3)';
    g.beginPath(); g.moveTo(x, y); g.lineTo(x - l, y + l * 0.5); g.stroke();
  }
  g.fillStyle = 'rgba(150,156,153,.25)'; g.beginPath(); g.ellipse(10, -88, 50, 7, 0, 0, Math.PI * 2); g.fill();   // pale belly
  g.restore();
  // neck rising to the head
  g.beginPath();
  g.moveTo(20, -138); g.bezierCurveTo(46, -152, 68, -168, 84, -180);
  g.lineTo(112, -158); g.bezierCurveTo(98, -136, 86, -116, 72, -100);
  g.closePath();
  g.fillStyle = coat(-180, -100, ['#464b48', '#6a6f6c', '#8f9491']); g.fill(); g.strokeStyle = OUT; g.lineWidth = 2; g.stroke();
  g.fillStyle = 'rgba(190,196,193,.45)'; g.beginPath(); g.ellipse(94, -136, 11, 19, -0.5, 0, Math.PI * 2); g.fill();   // pale throat
  // ears: tall and pointed
  const ear = (x0, y0, tx, ty, x1, y1, col) => {
    g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(tx - 6, (y0 + ty) / 2, tx, ty); g.quadraticCurveTo(tx + 6, (y1 + ty) / 2, x1, y1); g.closePath();
    g.fillStyle = col; g.fill(); g.strokeStyle = OUT; g.lineWidth = 2; g.stroke();
  };
  ear(84, -180, 82, -216, 100, -184, '#3b3f3d');
  // head: skull, muzzle, black nose
  g.beginPath();
  g.moveTo(82, -176);
  g.bezierCurveTo(90, -194, 118, -194, 126, -178);
  g.lineTo(150, -166);
  g.bezierCurveTo(157, -162, 156, -154, 149, -153);
  g.lineTo(124, -148);
  g.bezierCurveTo(108, -140, 92, -144, 84, -156);
  g.closePath();
  g.fillStyle = coat(-192, -144, ['#4a4f4c', '#6c716e', '#8d928f']); g.fill(); g.strokeStyle = OUT; g.lineWidth = 2.2; g.stroke();
  g.fillStyle = 'rgba(200,205,202,.45)'; g.beginPath(); g.ellipse(132, -152, 15, 4, -0.1, 0, Math.PI * 2); g.fill();   // pale lips
  g.strokeStyle = OUT; g.lineWidth = 1.4; g.beginPath(); g.moveTo(148, -153); g.quadraticCurveTo(134, -151, 122, -153); g.stroke();
  g.fillStyle = '#0b0d0c'; g.beginPath(); g.ellipse(151, -160, 4.5, 3.5, 0, 0, Math.PI * 2); g.fill();   // nose
  ear(98, -184, 106, -214, 118, -180, '#4a4f4c');
  g.fillStyle = 'rgba(170,176,173,.45)'; g.beginPath(); g.moveTo(102, -185); g.lineTo(106, -207); g.lineTo(113, -182); g.closePath(); g.fill();   // inner ear
  // eye: bright eyeshine under the IR lamp (a dark slit once it's dead)
  const ex = 120, ey = -173, R = 14;
  if (dead) { g.strokeStyle = OUT; g.lineWidth = 2; g.beginPath(); g.moveTo(ex - 5, ey); g.lineTo(ex + 5, ey); g.stroke(); } else {
  const eg = g.createRadialGradient(ex, ey, 0, ex, ey, R);
  eg.addColorStop(0, 'rgba(255,255,255,1)'); eg.addColorStop(0.18, 'rgba(240,250,245,.95)'); eg.addColorStop(0.45, 'rgba(220,240,230,.35)'); eg.addColorStop(1, 'rgba(220,240,230,0)');
  g.fillStyle = eg; g.beginPath(); g.arc(ex, ey, R, 0, Math.PI * 2); g.fill();
  }
  g.restore();
  // near legs, then the near haunch and shoulder over their tops so they grow out of the body
  leg(true, false); leg(false, false);
  g.save(); g.translate(0, bob);
  g.fillStyle = coat(-140, -84, COAT);
  g.beginPath(); g.ellipse(-72, -110, 30, 26, -0.2, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(46, -110, 20, 24, 0.15, 0, Math.PI * 2); g.fill();
  g.restore();
}

// dead: rolls onto its back and slides to a stop; flinches red for a moment when hit
function drawBoarAt(g, b, sx, sy) {
  g.save(); g.translate(sx, sy);
  if (!b.alive) {
    const k = Math.min(1, b.deadT / 0.35), s = b.sc;
    g.translate(0, -Math.sin(k * Math.PI) * 24 * s + k * 70 * s);
    g.translate(0, -96 * s); g.rotate(Math.PI * k * b.dir); g.translate(0, 96 * s);
  } else if (b.hurtT > 0) g.translate(-b.dir * b.hurtT * 24 * b.sc, 0);
  g.scale(b.sc * b.dir, b.sc);
  drawBoar(g, b.alive ? b.ph : 0.6, boarHead(b), b.wounds, !b.alive);
  g.restore();
}
// Boar drawing: side view facing right, feet on y = 0, in rat-sized world units.
// ph is the walk phase, down (0..1) lowers the head to root, wounds are local [x, y] marks.
function drawBoar(g, ph, down = 0, wounds = [], dead = false) {
  const OUT = 'rgba(10,12,11,.9)';
  const bob = -Math.abs(Math.sin(ph)) * 2.5;
  const coat = (y0, y1, c) => { const gr = g.createLinearGradient(0, y0, 0, y1); c.forEach((col, i) => gr.addColorStop(i / (c.length - 1), col)); return gr; };
  const COAT = ['#2a2e2c', '#3d4240', '#5a5f5c'];
  // short sturdy legs, each as a tapered polyline ending in a dark cloven hoof
  const limb = (pts, w0, w1, col) => {
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (let pass = 0; pass < 2; pass++) for (let i = 0; i < pts.length - 1; i++) {
      const w = w0 + (w1 - w0) * (i / (pts.length - 2 || 1));
      g.strokeStyle = pass ? col : OUT; g.lineWidth = pass ? w : w + 3;
      g.beginPath(); g.moveTo(pts[i][0], pts[i][1]); g.lineTo(pts[i + 1][0], pts[i + 1][1]); g.stroke();
    }
    const [px, py] = pts[pts.length - 1];
    g.fillStyle = '#121413'; g.beginPath(); g.moveTo(px - 6, py - 7); g.lineTo(px + 6, py - 7); g.lineTo(px + 9, py); g.lineTo(px - 5, py); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(120,126,123,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(px + 2, py - 6); g.lineTo(px + 3, py); g.stroke();
  };
  const ground = (y, lift) => lift > 0.1 ? y : Math.min(y, 0);
  const leg = (hind, far) => {
    const off = (hind ? Math.PI : 0) + (far ? Math.PI : 0);
    const a = Math.sin(ph + off), lift = Math.max(0, Math.cos(ph + off));
    const col = far ? '#252927' : '#4a4f4c';
    if (!hind) {
      const sx = far ? 50 : 42, sy = -84 + bob;
      const t1 = a * 0.4, ex = sx + 38 * Math.sin(t1), ey = sy + 38 * Math.cos(t1);
      const t2 = t1 - lift * 1.0, px = ex + 40 * Math.sin(t2), py = ground(ey + 40 * Math.cos(t2) + 6, lift);
      limb([[sx, sy], [ex, ey], [px, py - 6]], far ? 14 : 17, far ? 7 : 8, col);
    } else {
      const hx = far ? -66 : -76, hy = -90 + bob;
      const t1 = a * 0.4 + 0.25, kx = hx + 36 * Math.sin(t1), ky = hy + 36 * Math.cos(t1);
      const t2 = t1 - 0.9 - lift * 0.3, xx = kx + 26 * Math.sin(t2), xy = ky + 26 * Math.cos(t2);
      const t3 = -0.05 + lift * 0.6, px = xx + 30 * Math.sin(t3), py = ground(xy + 30 * Math.cos(t3) + 6, lift);
      limb([[hx, hy], [kx, ky], [xx, xy], [px, py - 6]], far ? 18 : 22, far ? 7 : 8, col);
    }
  };
  // ground shadow
  g.fillStyle = 'rgba(10,12,11,.34)'; g.beginPath(); g.ellipse(-5, 0, 110, 8, 0, 0, Math.PI * 2); g.fill();
  leg(false, true); leg(true, true);
  g.save(); g.translate(0, bob);
  // thin tail with a tuft, flicking
  const tw = Math.sin(ph * 1.3) * 5;
  g.strokeStyle = OUT; g.lineWidth = 5; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-108, -120); g.quadraticCurveTo(-124, -112, -122 + tw, -88); g.stroke();
  g.strokeStyle = '#3a3f3c'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-108, -120); g.quadraticCurveTo(-124, -112, -122 + tw, -88); g.stroke();
  g.fillStyle = '#1a1d1b'; g.beginPath(); g.ellipse(-122 + tw, -82, 4, 9, 0, 0, Math.PI * 2); g.fill();
  // body: high humped shoulders sloping down to a narrower rump, deep belly
  g.beginPath();
  g.moveTo(-112, -112);
  g.bezierCurveTo(-112, -136, -70, -146, -20, -150);
  g.bezierCurveTo(20, -158, 56, -158, 76, -136);
  g.bezierCurveTo(90, -116, 86, -80, 66, -66);
  g.bezierCurveTo(30, -54, -20, -56, -60, -64);
  g.bezierCurveTo(-98, -70, -114, -88, -112, -112);
  g.closePath();
  g.fillStyle = coat(-158, -56, COAT); g.fill(); g.strokeStyle = OUT; g.lineWidth = 2.4; g.stroke();
  // coarse bristly coat
  g.save(); g.clip();
  let s = 11; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  g.lineWidth = 1.2;
  for (let i = 0; i < 140; i++) {
    const x = -112 + r() * 196, y = -158 + r() * 100, l = 4 + r() * 6;
    g.strokeStyle = r() < 0.6 ? 'rgba(12,14,13,.5)' : 'rgba(150,156,153,.22)';
    g.beginPath(); g.moveTo(x, y); g.lineTo(x - l, y + l * 0.35); g.stroke();
  }
  g.fillStyle = 'rgba(8,10,9,.35)'; g.beginPath(); g.ellipse(-10, -60, 90, 14, 0, 0, Math.PI * 2); g.fill();   // shadowed belly
  for (const [wx, wy] of wounds) {   // bullet wounds, dark and wet
    g.fillStyle = 'rgba(70,10,12,.95)'; g.beginPath(); g.ellipse(wx, wy, 5, 4, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(70,10,12,.6)'; g.beginPath(); g.ellipse(wx - 1, wy + 8, 2.5, 7, 0, 0, Math.PI * 2); g.fill();
  }
  g.restore();
  // stiff bristle mane along the spine, tallest over the shoulders
  g.strokeStyle = '#141615'; g.lineWidth = 2.2; g.lineCap = 'round';
  for (let i = 0; i <= 22; i++) {
    const t = i / 22, x = -90 + t * 160;
    const y = t < 0.5 ? -138 - t * 2 * 12 : -150 - (t - 0.5) * 2 * 6 + Math.max(0, t - 0.8) * 60;
    const h = 8 + 12 * Math.sin(t * Math.PI) * (t > 0.4 ? 1.3 : 0.8);
    g.beginPath(); g.moveTo(x, y + 4); g.lineTo(x - 5, y - h); g.stroke();
  }
  // head: a long wedge pivoting down at the neck when it roots
  g.save();
  g.translate(64, -118 + down * 8); g.rotate(down * 0.85); g.translate(-64, 118);
  g.beginPath();
  g.moveTo(58, -146);
  g.bezierCurveTo(78, -150, 96, -138, 110, -118);
  g.lineTo(150, -88);
  g.bezierCurveTo(156, -84, 157, -72, 152, -66);
  g.lineTo(130, -64);
  g.bezierCurveTo(108, -62, 82, -70, 62, -80);
  g.closePath();
  g.fillStyle = coat(-150, -62, ['#303432','#474c49', '#5c615e']); g.fill(); g.strokeStyle = OUT; g.lineWidth = 2.3; g.stroke();
  // wrinkles on the snout, mouth line
  g.strokeStyle = 'rgba(10,12,11,.55)'; g.lineWidth = 1.2;
  for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(124 + i * 7, -98 + i * 5); g.quadraticCurveTo(128 + i * 7, -88 + i * 5, 126 + i * 7, -80 + i * 4); g.stroke(); }
  g.strokeStyle = OUT; g.lineWidth = 1.6; g.beginPath(); g.moveTo(150, -68); g.quadraticCurveTo(126, -70, 104, -72); g.stroke();
  // flat round snout disc with nostrils
  g.fillStyle = '#4c514e'; g.beginPath(); g.ellipse(154, -77, 6, 12, -0.15, 0, Math.PI * 2); g.fill(); g.strokeStyle = OUT; g.lineWidth = 2; g.stroke();
  g.fillStyle = '#0b0d0c'; g.beginPath(); g.ellipse(156, -81, 1.8, 2.8, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(156, -73, 1.8, 2.8, 0, 0, Math.PI * 2); g.fill();
  // tusk curving up out of the mouth
  g.beginPath(); g.moveTo(130, -68); g.quadraticCurveTo(142, -70, 141, -88); g.quadraticCurveTo(138, -76, 128, -73); g.closePath();
  g.fillStyle = '#dfe4e1'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 1.4; g.stroke();
  // ear: small, pointed, laid back
  g.beginPath(); g.moveTo(66, -142); g.quadraticCurveTo(62, -164, 50, -172); g.quadraticCurveTo(76, -168, 82, -146); g.closePath();
  g.fillStyle = '#2f3331'; g.fill(); g.strokeStyle = OUT; g.lineWidth = 2; g.stroke();
  g.fillStyle = 'rgba(150,156,153,.3)'; g.beginPath(); g.moveTo(68, -146); g.quadraticCurveTo(64, -160, 56, -166); g.quadraticCurveTo(72, -160, 76, -148); g.closePath(); g.fill();
  // small eye: eyeshine under the IR lamp (a dark slit once it's dead)
  const ex = 100, ey = -122, R = 10;
  if (dead) { g.strokeStyle = OUT; g.lineWidth = 2; g.beginPath(); g.moveTo(ex - 4, ey); g.lineTo(ex + 4, ey); g.stroke(); } else {
    const eg = g.createRadialGradient(ex, ey, 0, ex, ey, R);
    eg.addColorStop(0, 'rgba(255,255,255,1)'); eg.addColorStop(0.2, 'rgba(240,250,245,.95)'); eg.addColorStop(0.5, 'rgba(220,240,230,.3)'); eg.addColorStop(1, 'rgba(220,240,230,0)');
    g.fillStyle = eg; g.beginPath(); g.arc(ex, ey, R, 0, Math.PI * 2); g.fill();
  }
  g.restore();
  g.restore();
  // near legs, then the near ham and shoulder over their tops so they grow out of the body
  leg(true, false); leg(false, false);
  g.save(); g.translate(0, bob);
  g.fillStyle = coat(-150, -56, COAT);
  g.beginPath(); g.ellipse(-78, -98, 30, 30, -0.2, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(42, -96, 24, 28, 0.15, 0, Math.PI * 2); g.fill();
  g.restore();
}
