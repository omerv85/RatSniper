'use strict';
/* Rat Sniper: balance and tuning numbers: timing, economy, difficulty, weapons, spawn odds, health.
   One of the game's plain scripts (see index.html); they share one global scope, so names here are
   used directly by js/game.js and the other files.
   Tuned with the balance bot (dev/bot.js); see CLAUDE.md before changing them. */

/* ---------- night timing ---------- */
const ROUND_TIME = 30, BREAK_TIME = 15;   // the break is longer now: it's also the shop
const BOSS_TIME = 40;                     // the king digs back in and escapes if he's still alive after this

/* ---------- economy ---------- */
/* economy: every shot costs a bullet; kills pay coins; coins buy bullets between nights.
   Running out of bullets during a night ends the game. */
const AMMO_START = 15, NIGHT_BONUS = 5, HEAD_BONUS = 1;
const PRICE_STEP = 5;                                      // packs cost 1 coin more every 5 nights
const PACKS = [[5, 4], [15, 10]];                          // [bullets, price in coins]
const BOUNTY = { rat: 1, alpha: 2, rare: 3, ufo: 5, king: 10, jackal: 2, boar: 5 };

/* ---------- difficulty, rifles, grenade ---------- */
/* difficulty: each grows a little every night (night 1 = 0) up to a cap */
const LVL = () => Math.max(0, G.night - 1);
const DIFF = {
  speed:  () => Math.min(2.2, 1 + 0.09 * LVL()),           // how fast rats move
  far:    () => Math.min(2.5, 0.18 * LVL()),               // how strongly spawns lean toward the far paths
  fright: () => Math.min(2.0, 1 + 0.08 * LVL()),           // how far a shot scares rats
  flee:   () => Math.min(2.2, 1 + 0.07 * LVL()),           // how fast scared rats run
};
const SHOT_COOLDOWN = 0.55;
/* rifles: bought in turn in the shop, kept for the rest of the game. Same bullets for all; each does one more damage
   (head shots double it). Rats and kings grow tougher every HP_STEP nights, so the upgrades keep shots worth a bullet. */
const RIFLES = ['sniper', 'laser', 'plasma', 'railgun'];
// coins for rifle 2, 3, 4 (plus the usual +1 every PRICE_STEP nights). Bot results (mean nights, capped at 40):
// strong aim: old game 40, never upgrading 18, 10/20/30 37 (upgrades ~nights 3/5/10); average aim: old 31, never 11,
// 10/20/30 23 (nights 5/10/17). 10/10/10 had the railgun by night 7-9; 15/30/45 left average players without upgrades.
const UPGRADE_PRICE = [10, 20, 30];
const HP_STEP = 6;                                          // night 1-6: 1 hit per "hit point", 7-12: 2, 13-18: 3 ...
const hpMul = (n = G.night) => 1 + Math.floor(Math.max(0, (n || 1) - 1) / HP_STEP);
const rifleDmg = () => (G.rifle || 0) + 1;
/* grenade: sold in the shop, one use each. Tap the button to take one in hand, lift to throw it at the crosshair.
   It blows up everything inside an oval on the ground (sized to the depth it lands at) for 2 damage, like a head shot. */
const NADE_PRICE = 6, NADE_DMG = 2;
const NADE_RX = 170, NADE_RY = 90;       // blast oval in world units at full (near-lane) scale
const NADE_FLIGHT = 0.42, THROW_T = 0.3;  // seconds in the air; length of the arm swing
const diff = () => DIFF.speed();
const maxAlive = () => G.mode === 'menu' ? 5 : Math.min(12, 4 + G.night);
const stopDur = () => Math.max(0.55, rand(1.3, 2.8) - 0.13 * (G.night - 1));
const ratSpeed = r => 72 * r.ls * (VAR_SPEED[r.variant] || 1) * (r.king ? 1.5 * (r.hp <= r.maxHp / 2 ? 1.5 : 1) : diff()) * (r.state === 'scurry' ? 2.3 * DIFF.flee() : r.state === 'rage' ? 1.9 : 1);
const BOSS_EVERY = 5, KING_HP = 8, KING_SIZE = 3.2;    // 8 hits: there are no other rats on boss nights to pay for bullets

/* ---------- rats ---------- */
const ALPHA_EVERY = 10, ALPHA_SIZE = 1.45;
const LANE_W = [0.16, 0.18, 0.2, 0.23, 0.23];
// rare dressed-up rats: about 1 in 15 ordinary spawns; they only look different (zombie also takes 2 body hits)
const VARIANTS = ['zombie', 'clown', 'xmas', 'pirate', 'drunk', 'albino', 'mohawk', 'french', 'blind'];
const RARE_EVERY = 15;
const VAR_SPEED = { zombie: 0.55, blind: 0.45, drunk: 0.8, mohawk: 1.5, clown: 1.1 };

/* ---------- visitors: owl, UFO rat, jackal, wild boar ---------- */
const OWL_CHANCE = 0.6;
const UFO_CHANCE = 0.12;
const JACKAL_CHANCE = 0.4, JACKAL_FROM_NIGHT = 2;
const JACKAL_LANES = [0, 1, 2];          // never on the two paths nearest the shooter
const JACKAL_SPEED = 360, JACKAL_STRIDE = 150;   // world units per second and per stride, at full scale
const BOAR_CHANCE = 0.3, BOAR_FROM_NIGHT = 3, BOAR_HP = 3;
const BOAR_LANES = [0, 1, 2, 3];          // never on the path nearest the shooter
const BOAR_SPEED = 190, BOAR_CHARGE = 560, BOAR_STRIDE = 110, BOAR_ROOT = 2.4;
