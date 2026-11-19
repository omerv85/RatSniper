'use strict';
/* Rat Sniper: audio. Music (night pads, boss metal riff), every sound effect, the announcer.
   One of the game's plain scripts (see index.html); they share one global scope, so names here are
   used directly by js/game.js and the other files. */

/* ---------- audio (all synthesized) ---------- */
const A = { ctx: null, muted: false };
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
try { A.muted = localStorage.getItem('nw-muted') === '1'; } catch (e) {}

function initAudio() {
  if (A.ctx) { A.ctx.resume(); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const c = new AC(); A.ctx = c;
  A.master = c.createGain(); A.master.gain.value = A.muted ? 0 : 0.9; A.master.connect(c.destination);
  A.comp = c.createDynamicsCompressor(); A.comp.threshold.value = -14; A.comp.ratio.value = 4; A.comp.connect(A.master);
  const sr = c.sampleRate;
  A.noise = c.createBuffer(1, sr * 2, sr);
  { const d = A.noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
  const imp = c.createBuffer(2, sr * 3.2, sr);
  for (let ch = 0; ch < 2; ch++) { const d = imp.getChannelData(ch); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.4); }
  A.rev = c.createConvolver(); A.rev.buffer = imp;
  const revOut = c.createGain(); revOut.gain.value = 0.55; A.rev.connect(revOut); revOut.connect(A.comp);
  A.music = c.createGain(); A.music.gain.value = 0.8; A.music.connect(A.comp);
  const mSend = c.createGain(); mSend.gain.value = 0.7; A.music.connect(mSend); mSend.connect(A.rev);
  A.amb = c.createGain(); A.amb.gain.value = 1; A.amb.connect(A.comp);
  const aSend = c.createGain(); aSend.gain.value = 0.4; A.amb.connect(aSend); aSend.connect(A.rev);
  A.sfx = c.createGain(); A.sfx.gain.value = 1; A.sfx.connect(A.comp);
  // pluck delay
  A.dly = c.createDelay(1.5); A.dly.delayTime.value = 0.48;
  const fb = c.createGain(); fb.gain.value = 0.36; const dlp = c.createBiquadFilter(); dlp.type = 'lowpass'; dlp.frequency.value = 1800;
  A.dly.connect(dlp); dlp.connect(fb); fb.connect(A.dly); dlp.connect(A.music);
  // barn-wall echo for the rifle
  A.echo = c.createDelay(1); A.echo.delayTime.value = 0.34;
  const efb = c.createGain(); efb.gain.value = 0.3; const elp = c.createBiquadFilter(); elp.type = 'lowpass'; elp.frequency.value = 1400;
  const eOut = c.createGain(); eOut.gain.value = 0.45;
  A.echo.connect(elp); elp.connect(efb); efb.connect(A.echo); elp.connect(eOut); eOut.connect(A.sfx);
  // wind
  const wn = c.createBufferSource(); wn.buffer = A.noise; wn.loop = true;
  const wl = c.createBiquadFilter(); wl.type = 'lowpass'; wl.frequency.value = 320;
  const wg = c.createGain(); wg.gain.value = 0.035;
  const lfo = c.createOscillator(); lfo.frequency.value = 0.06; const lg = c.createGain(); lg.gain.value = 0.025;
  lfo.connect(lg); lg.connect(wg.gain); wn.connect(wl); wl.connect(wg); wg.connect(A.amb); wn.start(); lfo.start();

  // boss-round metal rig: guitar -> high-pass -> distortion -> cab low-pass -> mid scoop; drums and bass dry
  A.metal = c.createGain(); A.metal.gain.value = 0; A.metal.connect(A.comp);
  A.gtr = c.createGain(); A.gtr.gain.value = 1;
  const pre = c.createBiquadFilter(); pre.type = 'highpass'; pre.frequency.value = 90;
  const shaper = c.createWaveShaper(); shaper.curve = distCurve(70); shaper.oversample = '4x';
  const cab = c.createBiquadFilter(); cab.type = 'lowpass'; cab.frequency.value = 3400; cab.Q.value = 0.9;
  const scoop = c.createBiquadFilter(); scoop.type = 'peaking'; scoop.frequency.value = 750; scoop.Q.value = 0.9; scoop.gain.value = -7;
  const gOut = c.createGain(); gOut.gain.value = 0.17;
  A.gtr.connect(pre); pre.connect(shaper); shaper.connect(cab); cab.connect(scoop); scoop.connect(gOut); gOut.connect(A.metal);
  const mSendR = c.createGain(); mSendR.gain.value = 0.12; A.metal.connect(mSendR); mSendR.connect(A.rev);

  const t = c.currentTime;
  A.mode = 'night'; A.step = 0;
  A.next = { chord: t + 0.2, pluck: t + 4, cricket: t + 0.5, owl: t + 5, step: t };
  A.chordIdx = 0;
  setInterval(schedule, 200);
  loadVoices();
  if (G.boss) setMusic('boss', true);
}
function distCurve(k) {
  const n = 2048, cu = new Float32Array(n);
  for (let i = 0; i < n; i++) { const x = i * 2 / n - 1; cu[i] = (1 + k) * x / (1 + k * Math.abs(x)); }
  return cu;
}
function setMusic(mode, force = false) {
  const c = A.ctx; if (!c || (A.mode === mode && !force)) return;
  A.mode = mode; const t = c.currentTime;
  if (mode === 'boss') {
    A.music.gain.setTargetAtTime(0, t, 0.25); A.amb.gain.setTargetAtTime(0.2, t, 0.4);
    A.metal.gain.setTargetAtTime(1, t, 0.03);
    A.next.step = t + 0.12; A.step = 0;
  } else {
    A.metal.gain.setTargetAtTime(0, t, 0.5);
    A.music.gain.setTargetAtTime(0.8, t, 1.2); A.amb.gain.setTargetAtTime(1, t, 1.2);
    Object.assign(A.next, { chord: t + 0.6, pluck: t + 3, cricket: t + 0.5, owl: t + 6 });
  }
}

/* boss riff in E Phrygian at 156 bpm: palm-muted gallops, power-chord stabs, double-kick bars */
const BPM = 156, SIX = 60 / BPM / 4;
const Mu = n => [n, 1, true], Op = (n, len) => [n, len, false];
const RIFF = [
  [Mu(40), Mu(40), 0, Mu(40), Mu(40), Mu(40), Op(43, 2), 0, Mu(40), Mu(40), 0, Mu(40), Op(46, 2), 0, Op(45, 2), 0],
  [Mu(40), Mu(40), 0, Mu(40), Mu(40), Mu(40), Op(43, 2), 0, Mu(40), Mu(40), 0, Mu(40), Op(38, 4), 0, 0, 0],
  [Mu(40), Mu(40), 0, Mu(40), Mu(40), Mu(40), Op(43, 2), 0, Mu(40), Mu(40), 0, Mu(40), Op(46, 2), 0, Op(45, 2), 0],
  [Op(41, 4), 0, 0, 0, Mu(40), Mu(40), Mu(40), Mu(40), Op(43, 2), 0, Op(46, 2), 0, Op(45, 2), 0, Op(47, 2), 0],
];
function metalStep(t, i) {
  const bar = (i >> 4) % RIFF.length, s = i % 16, note = RIFF[bar][s];
  if (note) { gtrNote(t, note[0], note[1] * SIX, note[2]); bassNote(t, note[0], note[1] * SIX); }
  if (s % 2 === 0 || bar % 2 === 1) kick(t, s % 4 === 0 ? 0.7 : 0.5);
  if (s === 4 || s === 12) snare(t);
  if (s % 2 === 0) hat(t, s % 4 === 0 ? 0.07 : 0.045);
  if (s === 0 && bar === 0) crash(t);
}
function gtrNote(t, m, dur, muted) {
  const c = A.ctx, env = c.createGain(), f = c.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = muted ? 900 : 5000;
  const end = t + (muted ? Math.min(dur, SIX * 0.9) : dur * 0.95);
  env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(0.55, t + 0.004);
  if (muted) env.gain.exponentialRampToValueAtTime(0.02, end); else { env.gain.setValueAtTime(0.5, end - 0.03); env.gain.linearRampToValueAtTime(0.0001, end); }
  f.connect(env); env.connect(A.gtr);
  for (const [iv, det] of [[0, -7], [0, 7], [7, 0], [12, 3]]) {
    const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(m + iv); o.detune.value = det;
    o.connect(f); o.start(t); o.stop(end + 0.02);
  }
}
function bassNote(t, m, dur) {
  const c = A.ctx, o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
  o.type = 'sawtooth'; o.frequency.value = mtof(m - 12); f.type = 'lowpass'; f.frequency.value = 420;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16, t + 0.005); g.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.95);
  o.connect(f); f.connect(g); g.connect(A.metal); o.start(t); o.stop(t + dur);
}
function kick(t, v) {
  const c = A.ctx, o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.09);
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
  o.connect(g); g.connect(A.metal); o.start(t); o.stop(t + 0.18);
  noiseBurst(t, A.metal, { f0: 3500, q: 1, peak: v * 0.25, dur: 0.012, attack: 0.001 });
}
function snare(t) {
  noiseBurst(t, A.metal, { f0: 1900, f1: 1200, q: 0.8, peak: 0.5, dur: 0.2, attack: 0.002 });
  const c = A.ctx, o = c.createOscillator(), g = c.createGain();
  o.type = 'triangle'; o.frequency.setValueAtTime(220, t); o.frequency.exponentialRampToValueAtTime(160, t + 0.08);
  g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
  o.connect(g); g.connect(A.metal); o.start(t); o.stop(t + 0.14);
}
function hat(t, v) { noiseBurst(t, A.metal, { type: 'highpass', f0: 8000, q: 0.7, peak: v, dur: 0.04, attack: 0.001 }); }
function crash(t) { noiseBurst(t, A.metal, { type: 'highpass', f0: 5000, f1: 4000, q: 0.5, peak: 0.14, dur: 1.6, attack: 0.002 }); }

const CHORDS = [
  [50, 57, 60, 64, 65],   // Dm9
  [46, 53, 57, 62],       // Bbmaj7
  [41, 53, 57, 60, 64],   // Fmaj7
  [48, 55, 62, 64],       // Cadd9
];
const PENTA = [62, 65, 67, 69, 72, 74, 77, 79, 81];
const CHORD_LEN = 9;

function schedule() {
  const c = A.ctx; if (!c || c.state !== 'running') return;
  const ahead = c.currentTime + 1.2;
  if (A.mode === 'boss') {
    if (A.next.step < c.currentTime) A.next.step = c.currentTime + 0.05;   // recover after a pause
    const near = c.currentTime + 0.35;
    while (A.next.step < near) { metalStep(A.next.step, A.step); A.step++; A.next.step += SIX; }
    return;
  }
  while (A.next.chord < ahead) { padChord(A.next.chord, CHORDS[A.chordIdx % CHORDS.length], CHORD_LEN); A.chordIdx++; A.next.chord += CHORD_LEN; }
  while (A.next.pluck < ahead) { if (Math.random() < 0.75) pluck(A.next.pluck, PENTA[Math.random() * PENTA.length | 0], 0.045 + Math.random() * 0.03); A.next.pluck += rand(1.1, 3.4); }
  while (A.next.cricket < ahead) {
    const n = 1 + (Math.random() * 3 | 0), f = rand(4200, 4900), pan = rand(-0.9, 0.9);
    for (let i = 0; i < n; i++) cricket(A.next.cricket + i * 0.38, f, pan);
    A.next.cricket += rand(0.5, 1.8);
  }
  while (A.next.owl < ahead) { owl(A.next.owl); A.next.owl += rand(9, 22); }
}

function padChord(t, notes, dur) {
  const c = A.ctx, g = c.createGain(), f = c.createBiquadFilter();
  f.type = 'lowpass'; f.Q.value = 0.6;
  f.frequency.setValueAtTime(450, t); f.frequency.linearRampToValueAtTime(1050, t + dur * 0.5); f.frequency.linearRampToValueAtTime(550, t + dur + 3);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.11, t + 3); g.gain.setValueAtTime(0.11, t + dur - 1); g.gain.linearRampToValueAtTime(0, t + dur + 3);
  f.connect(g); g.connect(A.music);
  for (const m of notes) for (const det of [-8, 7]) {
    const o = c.createOscillator(), og = c.createGain();
    o.type = 'triangle'; o.frequency.value = mtof(m); o.detune.value = det; og.gain.value = 0.5 / notes.length;
    o.connect(og); og.connect(f); o.start(t); o.stop(t + dur + 3.2);
  }
  const b = c.createOscillator(), bg = c.createGain();
  b.type = 'sine'; b.frequency.value = mtof(notes[0] - 12);
  bg.gain.setValueAtTime(0, t); bg.gain.linearRampToValueAtTime(0.09, t + 2); bg.gain.linearRampToValueAtTime(0, t + dur + 2);
  b.connect(bg); bg.connect(A.music); b.start(t); b.stop(t + dur + 2.2);
}
function pluck(t, m, v) {
  const c = A.ctx, o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.value = mtof(m); o2.type = 'triangle'; o2.frequency.value = mtof(m + 12);
  const g2 = c.createGain(); g2.gain.value = 0.18;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
  o.connect(g); o2.connect(g2); g2.connect(g); g.connect(A.music);
  const s = c.createGain(); s.gain.value = 0.5; g.connect(s); s.connect(A.dly);
  o.start(t); o2.start(t); o.stop(t + 2.5); o2.stop(t + 2.5);
}
function cricket(t, f, pan) {
  const c = A.ctx, o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.value = f; g.gain.value = 0;
  const pulses = 3 + (Math.random() * 2 | 0), amp = 0.012 + Math.random() * 0.014;
  for (let i = 0; i < pulses; i++) { const s = t + i * 0.045; g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(amp, s + 0.008); g.gain.linearRampToValueAtTime(0, s + 0.03); }
  let node = g;
  if (c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = pan; g.connect(p); node = p; }
  o.connect(g); node.connect(A.amb); o.start(t); o.stop(t + pulses * 0.045 + 0.05);
}
// Owl: a tawny-style "hoo ... hoo-hoo-hoooo" from somewhere out in the trees, sometimes answered by a second owl.
const OWL_CALLS = [
  [[0, 0.42], [0.95, 0.16], [1.2, 0.16], [1.45, 0.75]],
  [[0, 0.5], [0.75, 0.6]],
  [[0, 0.35], [0.5, 0.35], [1.0, 0.8]],
];
function owl(t, answer = false) {
  const c = A.ctx;
  const pan = c.createStereoPanner ? c.createStereoPanner() : null;
  const side = answer ? -Math.sign(A.lastOwlPan || 1) : (Math.random() < 0.5 ? -1 : 1);
  A.lastOwlPan = side;
  if (pan) { pan.pan.value = side * rand(0.4, 0.9); pan.connect(A.amb); }
  const base = answer ? rand(300, 330) : rand(340, 400), vol = rand(0.09, 0.14);
  const call = OWL_CALLS[Math.random() * OWL_CALLS.length | 0];
  for (const [d, len] of call) {
    const s = t + d, o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain(), g2 = c.createGain(), f = c.createBiquadFilter();
    f.type = 'lowpass'; f.frequency.value = 1100;
    o.type = 'sine'; o.frequency.setValueAtTime(base * 0.94, s); o.frequency.linearRampToValueAtTime(base, s + 0.06); o.frequency.linearRampToValueAtTime(base * 0.9, s + len);
    o2.type = 'triangle'; o2.frequency.setValueAtTime(base * 1.88, s); o2.frequency.linearRampToValueAtTime(base * 1.8, s + len); g2.gain.value = 0.12;
    const vib = c.createOscillator(), vg = c.createGain(); vib.frequency.value = 6; vg.gain.value = len > 0.5 ? 5 : 0;
    vib.connect(vg); vg.connect(o.frequency);
    g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(vol, s + 0.06); g.gain.setValueAtTime(vol, s + len * 0.6); g.gain.linearRampToValueAtTime(0, s + len);
    o.connect(f); o2.connect(g2); g2.connect(f); f.connect(g); g.connect(pan || A.amb);
    o.start(s); o2.start(s); vib.start(s); o.stop(s + len + 0.05); o2.stop(s + len + 0.05); vib.stop(s + len + 0.05);
    noiseBurst(s, pan || A.amb, { f0: base * 2, q: 2, peak: vol * 0.25, dur: len, attack: 0.05 });  // breathiness
  }
  if (!answer && Math.random() < 0.45) owl(t + rand(2.2, 3.6), true);
}
function sfxAngry(delay, pitch = 1, vol = 1, len = 1) {
  const c = A.ctx; if (!c) return; const t = c.currentTime + delay;
  // guttural growl
  const o = c.createOscillator(), lfo = c.createOscillator(), lg = c.createGain(), f = c.createBiquadFilter(), g = c.createGain();
  o.type = 'sawtooth'; o.frequency.value = 150 * pitch; lfo.frequency.value = 28 * pitch; lg.gain.value = 45 * pitch;
  lfo.connect(lg); lg.connect(o.frequency);
  f.type = 'bandpass'; f.frequency.value = 800 * Math.sqrt(pitch); f.Q.value = 1.4;
  const hold = 0.4 * len, end = 0.7 * len;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.22 * vol, t + 0.04); g.gain.setValueAtTime(0.22 * vol, t + hold); g.gain.exponentialRampToValueAtTime(0.001, t + end);
  o.connect(f); f.connect(g); g.connect(A.sfx); o.start(t); lfo.start(t); o.stop(t + end + 0.05); lfo.stop(t + end + 0.05);
  // shrill squeals
  for (let i = 0; i < 3; i++) {
    const s = t + 0.1 + i * 0.16, q = c.createOscillator(), qg = c.createGain();
    q.type = 'square'; q.frequency.setValueAtTime(rand(1900, 2300) * Math.sqrt(pitch), s); q.frequency.exponentialRampToValueAtTime(rand(2800, 3400) * Math.sqrt(pitch), s + 0.09);
    qg.gain.setValueAtTime(0, s); qg.gain.linearRampToValueAtTime(0.035 * vol, s + 0.01); qg.gain.linearRampToValueAtTime(0, s + 0.11);
    q.connect(qg); qg.connect(A.sfx); q.start(s); q.stop(s + 0.13);
  }
}
function sfxDig(delay, big, lane) {
  const c = A.ctx; if (!c || c.state !== 'running') return;
  const t = c.currentTime + delay, near = 0.35 + 0.13 * lane;   // nearer rats scratch louder
  for (let i = 0; i < (big ? 14 : 7); i++) {
    noiseBurst(t + i * rand(0.07, 0.14), A.sfx, { f0: rand(500, 1400), f1: rand(300, 700), q: 1.6, peak: (big ? 0.28 : 0.12) * near, dur: rand(0.04, 0.09), attack: 0.004 });
  }
  if (big) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(48, t); o.frequency.linearRampToValueAtTime(36, t + 1.8);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.4, t + 0.4); g.gain.linearRampToValueAtTime(0, t + 2);
    o.connect(g); g.connect(A.sfx); o.start(t); o.stop(t + 2.05);
  }
}
function sfxExplode() {
  const c = A.ctx; if (!c) return; const t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(28, t + 0.9);
  g.gain.setValueAtTime(1.1, t); g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
  o.connect(g); g.connect(A.sfx); o.start(t); o.stop(t + 1.25);
  const n = noiseBurst(t, A.sfx, { type: 'lowpass', f0: 2400, f1: 200, q: 0.6, peak: 0.9, dur: 0.9, attack: 0.003 });
  n.connect(A.rev);
  for (let i = 0; i < 6; i++) sfxHit(0.08 + i * rand(0.06, 0.12));
}
function noiseBurst(t, dest, { type = 'bandpass', f0 = 1000, f1 = f0, q = 1, peak = 0.5, dur = 0.2, attack = 0.003 }) {
  const c = A.ctx, n = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  n.buffer = A.noise; f.type = type; f.Q.value = q;
  f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  n.connect(f); f.connect(g); g.connect(dest);
  n.start(t, Math.random() * 1.5); n.stop(t + dur + 0.05);
  return g;
}
// a tone gliding from f0 to f1 (exponential), with a quick attack and decay; returns its gain node
function sweep(t, dest, { type = 'sine', f0, f1 = f0, dur, peak, attack = 0.004, filter = null }) {
  const c = A.ctx, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let node = o;
  if (filter) { const f = c.createBiquadFilter(); f.type = filter.type; f.frequency.setValueAtTime(filter.f0, t); f.frequency.exponentialRampToValueAtTime(filter.f1 || filter.f0, t + dur); f.Q.value = filter.q || 1; o.connect(f); node = f; }
  node.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + 0.05);
  return g;
}
function sfxShot(tier = 0) {
  const c = A.ctx; if (!c) return; const t = c.currentTime;
  if (tier === 1) {
    // laser: a bright falling "pew" with a sizzle, then a soft rising whine as the battery recharges
    const p = sweep(t, A.sfx, { type: 'square', f0: 2600, f1: 220, dur: 0.2, peak: 0.16, filter: { type: 'lowpass', f0: 6000, f1: 1200 } });
    p.connect(A.echo);
    sweep(t, A.sfx, { type: 'sawtooth', f0: 1300, f1: 140, dur: 0.16, peak: 0.08 });
    noiseBurst(t, A.sfx, { type: 'highpass', f0: 5000, f1: 3000, q: 0.7, peak: 0.25, dur: 0.12, attack: 0.002 });
    sweep(t + 0.22, A.sfx, { f0: 500, f1: 1600, dur: 0.3, peak: 0.035, attack: 0.15 });
    return;
  }
  if (tier === 2) {
    // plasma: a deep wobbling "thoom" with a bubbling hiss, then a low hum coming back up
    const c2 = A.ctx, o = c2.createOscillator(), lfo = c2.createOscillator(), lg = c2.createGain(), f = c2.createBiquadFilter(), g = c2.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(260, t); o.frequency.exponentialRampToValueAtTime(55, t + 0.4);
    lfo.frequency.value = 38; lg.gain.value = 60; lfo.connect(lg); lg.connect(o.frequency);
    f.type = 'lowpass'; f.frequency.setValueAtTime(3200, t); f.frequency.exponentialRampToValueAtTime(260, t + 0.4); f.Q.value = 6;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    o.connect(f); f.connect(g); g.connect(A.sfx); g.connect(A.echo); o.start(t); lfo.start(t); o.stop(t + 0.5); lfo.stop(t + 0.5);
    sweep(t, A.sfx, { f0: 140, f1: 40, dur: 0.35, peak: 0.7 });
    noiseBurst(t, A.sfx, { f0: 1800, f1: 500, q: 3, peak: 0.3, dur: 0.3, attack: 0.004 });
    sweep(t + 0.25, A.sfx, { type: 'triangle', f0: 90, f1: 220, dur: 0.3, peak: 0.07, attack: 0.12 });
    return;
  }
  if (tier === 3) {
    // railgun: an electric snap and a hard supersonic crack, a metallic ring off the rails, then the capacitors whining back up
    noiseBurst(t, A.sfx, { type: 'highpass', f0: 2500, f1: 900, q: 0.6, peak: 1, dur: 0.2, attack: 0.001 }).connect(A.rev);
    sweep(t, A.sfx, { type: 'sawtooth', f0: 90, f1: 60, dur: 0.12, peak: 0.3, filter: { type: 'bandpass', f0: 1200, q: 2 } });
    sweep(t, A.sfx, { f0: 120, f1: 30, dur: 0.4, peak: 0.9 });
    for (const [fr, v] of [[3400, 0.06], [5100, 0.04], [7300, 0.025]]) sweep(t + 0.005, A.sfx, { f0: fr, f1: fr * 0.98, dur: 0.6, peak: v, attack: 0.002 }).connect(A.echo);
    sweep(t + 0.12, A.sfx, { f0: 300, f1: 3200, dur: 0.42, peak: 0.04, attack: 0.3 });
    return;
  }
  const crack = noiseBurst(t, A.sfx, { type: 'highpass', f0: 700, f1: 400, q: 0.5, peak: 1, dur: 0.24, attack: 0.002 });
  crack.connect(A.echo); const rs = c.createGain(); rs.gain.value = 0.6; crack.connect(rs); rs.connect(A.rev);
  const o = c.createOscillator(), og = c.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(36, t + 0.28);
  og.gain.setValueAtTime(1, t); og.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
  o.connect(og); og.connect(A.sfx); o.start(t); o.stop(t + 0.42);
  // bolt cycle
  noiseBurst(t + 0.34, A.sfx, { f0: 2600, q: 4, peak: 0.25, dur: 0.035, attack: 0.001 });
  noiseBurst(t + 0.42, A.sfx, { f0: 1700, q: 3, peak: 0.22, dur: 0.05, attack: 0.001 });
  noiseBurst(t + 0.5, A.sfx, { f0: 2300, q: 4, peak: 0.28, dur: 0.035, attack: 0.001 });
}
// rifle upgrade bought: a rising power-up and a click as it locks in
function sfxUpgrade() {
  const c = A.ctx; if (!c) return; const t = c.currentTime;
  [0, 4, 7, 12].forEach((s, i) => sweep(t + i * 0.07, A.sfx, { type: 'triangle', f0: 440 * Math.pow(2, s / 12), dur: 0.25, peak: 0.12 }));
  sweep(t, A.sfx, { f0: 200, f1: 1600, dur: 0.35, peak: 0.05, attack: 0.2 });
  noiseBurst(t + 0.34, A.sfx, { f0: 2400, q: 4, peak: 0.3, dur: 0.04, attack: 0.001 });
}
function sfxPing(delay, glass) {
  const c = A.ctx; if (!c) return; const t = c.currentTime + delay;
  const parts = glass ? [[3100, 0.12], [4650, 0.07], [6200, 0.04]] : [[1750, 0.14], [2630, 0.09], [4120, 0.05]];
  for (const [f, v] of parts) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = f * rand(0.97, 1.03);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0001, t + (glass ? 0.25 : 0.55));
    o.connect(g); g.connect(A.sfx); o.start(t); o.stop(t + 0.6);
  }
  noiseBurst(t, A.sfx, { type: 'highpass', f0: 3000, q: 0.7, peak: 0.2, dur: 0.05, attack: 0.001 });
}
function sfxShatter(delay) {
  const c = A.ctx; if (!c) return; const t = c.currentTime + delay;
  noiseBurst(t, A.sfx, { type: 'highpass', f0: 2500, f1: 4000, q: 0.7, peak: 0.55, dur: 0.18, attack: 0.002 });
  for (let i = 0; i < 9; i++) {
    const s = t + rand(0, 0.28), o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = rand(3200, 7800);
    g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(rand(0.03, 0.08), s + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, s + rand(0.06, 0.2));
    o.connect(g); g.connect(A.sfx); o.start(s); o.stop(s + 0.22);
  }
}
// saucer: a warbling two-tone hum while it's around, a zap and a falling whistle when hit, a metal crash
function ufoHumStart() {
  const c = A.ctx; if (!c || A.ufoHum) return;
  const g = c.createGain(), f = c.createBiquadFilter(); g.gain.value = 0; f.type = 'lowpass'; f.frequency.value = 1600;
  const o1 = c.createOscillator(), l1 = c.createOscillator(), d1 = c.createGain();
  o1.type = 'sine'; o1.frequency.value = 210; l1.frequency.value = 7; d1.gain.value = 22; l1.connect(d1); d1.connect(o1.frequency);
  const o2 = c.createOscillator(), l2 = c.createOscillator(), d2 = c.createGain(), g2 = c.createGain();
  o2.type = 'triangle'; o2.frequency.value = 720; l2.frequency.value = 0.7; d2.gain.value = 140; l2.connect(d2); d2.connect(o2.frequency); g2.gain.value = 0.35;
  o1.connect(f); o2.connect(g2); g2.connect(f); f.connect(g); g.connect(A.sfx);
  const nodes = [o1, l1, o2, l2]; nodes.forEach(n => n.start());
  A.ufoHum = { g, nodes };
}
function ufoHumLevel(v) { if (A.ufoHum) A.ufoHum.g.gain.setTargetAtTime(v, A.ctx.currentTime, 0.12); }
function ufoHumStop() {
  if (!A.ufoHum) return;
  const h = A.ufoHum, t = A.ctx.currentTime; A.ufoHum = null;
  h.g.gain.setTargetAtTime(0, t, 0.08); h.nodes.forEach(n => n.stop(t + 0.5));
}
function sfxUfoHit() {
  const c = A.ctx; if (!c) return; const t = c.currentTime + 0.05;
  ufoHumStop();
  const z = c.createOscillator(), zg = c.createGain();
  z.type = 'square'; z.frequency.setValueAtTime(1900, t); z.frequency.exponentialRampToValueAtTime(260, t + 0.25);
  zg.gain.setValueAtTime(0.12, t); zg.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
  z.connect(zg); zg.connect(A.sfx); z.start(t); z.stop(t + 0.3);
  const w = c.createOscillator(), wg = c.createGain();
  w.type = 'sine'; w.frequency.setValueAtTime(1500, t + 0.2); w.frequency.exponentialRampToValueAtTime(170, t + 1.4);
  wg.gain.setValueAtTime(0, t + 0.2); wg.gain.linearRampToValueAtTime(0.09, t + 0.3); wg.gain.linearRampToValueAtTime(0, t + 1.4);
  w.connect(wg); wg.connect(A.sfx); w.start(t + 0.2); w.stop(t + 1.45);
}
function sfxUfoCrash() {
  const c = A.ctx; if (!c) return; const t = c.currentTime;
  noiseBurst(t, A.sfx, { type: 'lowpass', f0: 2000, f1: 220, q: 0.7, peak: 0.7, dur: 0.6, attack: 0.003 });
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(32, t + 0.5);
  g.gain.setValueAtTime(0.8, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  o.connect(g); g.connect(A.sfx); o.start(t); o.stop(t + 0.65);
  sfxPing(0.02, false); sfxPing(0.14, false);
}
function sfxOwlFlush() {
  const c = A.ctx; if (!c) return; const t = c.currentTime + 0.08;
  // heavy wingbeats fading into the distance, and an alarmed screech
  for (let i = 0; i < 7; i++) noiseBurst(t + i * 0.13, A.sfx, { type: 'lowpass', f0: 700, f1: 250, q: 0.8, peak: 0.32 * Math.pow(0.8, i), dur: 0.1, attack: 0.02 });
  const o = c.createOscillator(), v = c.createOscillator(), vg = c.createGain(), g = c.createGain(), f = c.createBiquadFilter();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(1700, t); o.frequency.exponentialRampToValueAtTime(1150, t + 0.5);
  v.frequency.value = 38; vg.gain.value = 60; v.connect(vg); vg.connect(o.frequency);
  f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = 2;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.07, t + 0.05); g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
  o.connect(f); f.connect(g); g.connect(A.sfx); g.connect(A.rev);
  o.start(t); v.start(t); o.stop(t + 0.6); v.stop(t + 0.6);
}
// grenade: a metal click when it's taken in hand, a whoosh on the throw, then a short, hard blast with dirt pattering down
function sfxPin() {
  const c = A.ctx; if (!c) return; const t = c.currentTime;
  noiseBurst(t, A.sfx, { f0: 5200, q: 6, peak: 0.16, dur: 0.03, attack: 0.001 });
  for (const [f, d, v] of [[2500, 0, 0.06], [3700, 0.07, 0.05]]) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t + d); g.gain.exponentialRampToValueAtTime(v, t + d + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.12);
    o.connect(g); g.connect(A.sfx); o.start(t + d); o.stop(t + d + 0.14);
  }
}
function sfxThrow() {
  const c = A.ctx; if (!c) return; const t = c.currentTime;
  noiseBurst(t, A.sfx, { f0: 500, f1: 1900, q: 1.3, peak: 0.28, dur: 0.26, attack: 0.09 });
  noiseBurst(t + 0.06, A.sfx, { f0: 4300, q: 9, peak: 0.08, dur: 0.05, attack: 0.001 });   // the spoon flies off
}
function sfxNade() {
  const c = A.ctx; if (!c) return; const t = c.currentTime;
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.45);
  g.gain.setValueAtTime(1.3, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
  o.connect(g); g.connect(A.sfx); o.start(t); o.stop(t + 0.6);
  noiseBurst(t, A.sfx, { type: 'highpass', f0: 1800, f1: 900, q: 0.6, peak: 0.7, dur: 0.1, attack: 0.001 });   // sharp crack
  const n = noiseBurst(t, A.sfx, { type: 'lowpass', f0: 4200, f1: 160, q: 0.5, peak: 1, dur: 0.55, attack: 0.002 });
  n.connect(A.echo); const rs = c.createGain(); rs.gain.value = 0.5; n.connect(rs); rs.connect(A.rev);
  for (let i = 0; i < 9; i++) noiseBurst(t + 0.22 + rand(0, 0.55), A.sfx, { f0: rand(1400, 3600), q: 2, peak: rand(0.04, 0.11), dur: 0.04, attack: 0.002 });
}
function sfxDry() {
  const c = A.ctx; if (!c) return;
  noiseBurst(c.currentTime, A.sfx, { f0: 3200, q: 5, peak: 0.18, dur: 0.03, attack: 0.001 });
}
function sfxHit(delay) {
  const c = A.ctx; if (!c) return; const t = c.currentTime + delay;
  noiseBurst(t, A.sfx, { f0: 1500, f1: 260, q: 1.3, peak: 0.75, dur: 0.24, attack: 0.004 });
  noiseBurst(t + 0.045, A.sfx, { type: 'lowpass', f0: 700, f1: 180, q: 3, peak: 0.45, dur: 0.22, attack: 0.01 });
  const o = c.createOscillator(), g = c.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(95, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.16);
  g.gain.setValueAtTime(0.6, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  o.connect(g); g.connect(A.sfx); o.start(t); o.stop(t + 0.22);
  const q = c.createOscillator(), qg = c.createGain();
  q.type = 'sine'; q.frequency.setValueAtTime(2700, t + 0.02); q.frequency.exponentialRampToValueAtTime(3500, t + 0.09);
  qg.gain.setValueAtTime(0, t + 0.02); qg.gain.linearRampToValueAtTime(0.05, t + 0.03); qg.gain.linearRampToValueAtTime(0, t + 0.1);
  q.connect(qg); qg.connect(A.sfx); q.start(t + 0.02); q.stop(t + 0.12);
}
// why: 'noAmmo' or 'noTime' is said after "Round cleared" (nothing extra when the king was killed)
// cleared = false (the king lived): skip "Round cleared" and only say why the night ended
function sfxCleared(why, cleared = true) {
  const c = A.ctx;
  if (c) {
    const t = c.currentTime;
    for (const [f, v] of [[49, 0.3], [73.5, 0.14]]) {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.35); g.gain.exponentialRampToValueAtTime(0.001, t + 2.6);
      o.connect(g); g.connect(A.sfx); o.start(t); o.stop(t + 2.7);
    }
  }
  if (cleared) voice('round', true, why); else if (why) voice(why, true);
}
/* Announcer: recorded clips of a deep male voice (voice/<lang>/<clip>.wav), so every phone and laptop
   plays exactly the same audio (built-in speech voices differ per device and sound metallic on some).
   They're fetched when the audio starts (first game), only for the language in use. */
const VOICE_LANGS = ['en', 'he'], VOICE_CLIPS = ['round', 'head', 'king', 'noAmmo', 'noTime'];
const hasClips = lang => VOICE_LANGS.includes(lang);
function loadClips(lang) {
  if (!A.ctx || !hasClips(lang) || A.voice[lang]) return;
  A.voice[lang] = {};
  for (const k of VOICE_CLIPS) {
    fetch('voice/' + lang + '/' + k + '.wav')
      .then(r => r.ok ? r.arrayBuffer() : Promise.reject())
      .then(b => A.ctx.decodeAudioData(b, ab => { A.voice[lang][k] = ab; }, () => {}))
      .catch(() => {});
  }
}
function loadVoices() {
  A.voice = {};
  loadClips(LANG);
  // a touch of low end and a short room echo give it weight
  A.voiceBus = A.ctx.createBiquadFilter(); A.voiceBus.type = 'lowshelf'; A.voiceBus.frequency.value = 220; A.voiceBus.gain.value = 6;
  const g = A.ctx.createGain(); g.gain.value = 1.5; A.voiceBus.connect(g); g.connect(A.sfx);
  const r = A.ctx.createGain(); r.gain.value = 0.25; A.voiceBus.connect(r); r.connect(A.rev);
  A.voiceFree = 0;
}
// Languages without recorded clips yet: the device's own voice for that language reads the line,
// pitched down moderately (a very low pitch is what made phone voices sound metallic).
function speakLine(text, queue) {
  const ss = window.speechSynthesis; if (!ss || A.muted) return;
  try {
    if (ss.pending || (!queue && ss.speaking)) return;
    const u = new SpeechSynthesisUtterance(text), lang = STR[LANG].speechLang;
    const vs = ss.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith(LANG));
    const v = vs.find(v => /male|pavel|dmitri|pablo|jorge|paul|henri|asaf|david/i.test(v.name) && !/female/i.test(v.name)) || vs[0];
    u.lang = lang; if (v) u.voice = v;
    u.pitch = 0.6; u.rate = 0.9; u.volume = 1;
    ss.speak(u);
  } catch (e) {}
}
// then: a second line said straight after the first (one sentence for the device voice)
function voice(k, queue = false, then = null) {
  if (!hasClips(LANG)) { speakLine(STR[LANG].say[k] + (then ? '. ' + STR[LANG].say[then] : ''), queue); return; }   // recorded clips: English, Hebrew
  loadClips(LANG);   // in case the language was switched after the audio started
  const c = A.ctx, clip = A.voice && A.voice[LANG] && A.voice[LANG][k]; if (!c || !clip) return;
  if (then) { voice(k, queue); A.voiceFree += 0.12; voice(then, true); return; }
  const now = c.currentTime;
  if (A.voiceFree > now && !queue) return;            // don't talk over itself
  const t = Math.max(now, A.voiceFree) + 0.02, rate = LANG === 'he' ? 0.86 : 0.9;   // Asaf sits higher than David, so drop him a bit more
  const s = c.createBufferSource(); s.buffer = clip; s.playbackRate.value = rate;
  s.connect(A.voiceBus); s.start(t);
  A.voiceFree = t + clip.duration / rate;
}
function setMuted(m) {
  A.muted = m;
  try { localStorage.setItem('nw-muted', m ? '1' : '0'); } catch (e) {}
  if (A.master) A.master.gain.setTargetAtTime(m ? 0 : 0.9, A.ctx.currentTime, 0.05);
  $('#sound').setAttribute('aria-pressed', String(m));
  $('#sound-label').textContent = m ? tr('soundOff') : tr('soundOn');
  $('#mute-waves').style.display = m ? 'none' : '';
  $('#mute-x').style.display = m ? '' : 'none';
}

// a few distant yips and a thin wail when it turns up; a sharp yelp when it's hit
function sfxJackal() {
  const c = A.ctx; if (!c) return; const t0 = c.currentTime + 0.1;
  const call = (t, f0, f1, dur, v) => {
    const o = c.createOscillator(), vib = c.createOscillator(), vg = c.createGain(), g = c.createGain(), f = c.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    vib.frequency.value = 9; vg.gain.value = f0 * 0.03; vib.connect(vg); vg.connect(o.frequency);
    f.type = 'bandpass'; f.frequency.value = 1200; f.Q.value = 1.2;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.03); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(f); f.connect(g); g.connect(A.sfx); g.connect(A.rev);
    o.start(t); vib.start(t); o.stop(t + dur + 0.05); vib.stop(t + dur + 0.05);
  };
  for (let i = 0; i < 3; i++) call(t0 + i * 0.24, 700 + i * 60, 1050 + i * 60, 0.16, 0.035);
  call(t0 + 0.8, 950, 620, 0.7, 0.03);
}
function sfxYelp(delay) {
  const c = A.ctx; if (!c) return; const t = c.currentTime + delay;
  const o = c.createOscillator(), g = c.createGain(), f = c.createBiquadFilter();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(1500, t); o.frequency.exponentialRampToValueAtTime(650, t + 0.22);
  f.type = 'bandpass'; f.frequency.value = 1400; f.Q.value = 1.5;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12, t + 0.015); g.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
  o.connect(f); f.connect(g); g.connect(A.sfx); o.start(t); o.stop(t + 0.3);
}

// low grunts when it turns up (shorter, snuffling ones while it roots); a pig's squeal when it's hit
function sfxBoar(snuffle = false) {
  const c = A.ctx; if (!c) return; const t0 = c.currentTime + 0.08;
  const grunt = (t, f, dur, v) => {
    const o = c.createOscillator(), g = c.createGain(), f1 = c.createBiquadFilter(), am = c.createOscillator(), ag = c.createGain();
    o.type = 'sawtooth'; o.frequency.setValueAtTime(f * 1.15, t); o.frequency.exponentialRampToValueAtTime(f * 0.8, t + dur);
    am.frequency.value = 34; ag.gain.value = v * 0.6; am.connect(ag); ag.connect(g.gain);   // the rattle in a grunt
    f1.type = 'lowpass'; f1.frequency.value = 520; f1.Q.value = 3;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(f1); f1.connect(g); g.connect(A.sfx); g.connect(A.rev);
    o.start(t); am.start(t); o.stop(t + dur + 0.05); am.stop(t + dur + 0.05);
  };
  const n = snuffle ? 4 : 3;
  for (let i = 0; i < n; i++) grunt(t0 + i * (snuffle ? 0.32 : 0.42) + Math.random() * 0.06, snuffle ? 140 : rand(95, 115), snuffle ? 0.12 : 0.22, snuffle ? 0.09 : 0.14);
}
function sfxSqueal(delay, len = 1) {
  const c = A.ctx; if (!c) return; const t = c.currentTime + delay, d = 0.55 * len;
  const o = c.createOscillator(), o2 = c.createOscillator(), vib = c.createOscillator(), vg = c.createGain(), g = c.createGain(), f = c.createBiquadFilter();
  o.type = 'sawtooth'; o2.type = 'square';
  o.frequency.setValueAtTime(800, t); o.frequency.linearRampToValueAtTime(1500, t + d * 0.25); o.frequency.exponentialRampToValueAtTime(700, t + d);
  o2.frequency.setValueAtTime(805, t); o2.frequency.linearRampToValueAtTime(1512, t + d * 0.25); o2.frequency.exponentialRampToValueAtTime(706, t + d);
  vib.frequency.value = 22; vg.gain.value = 60; vib.connect(vg); vg.connect(o.frequency); vg.connect(o2.frequency);
  f.type = 'bandpass'; f.frequency.value = 1600; f.Q.value = 1.1;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.1, t + 0.03); g.gain.setValueAtTime(0.1, t + d * 0.6); g.gain.exponentialRampToValueAtTime(0.001, t + d);
  o.connect(f); o2.connect(f); f.connect(g); g.connect(A.sfx); g.connect(A.rev);
  [o, o2, vib].forEach(x => { x.start(t); x.stop(t + d + 0.05); });
}
