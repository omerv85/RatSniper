(() => {
'use strict';

/* ---------- languages: every word the player sees or hears ---------- */
const VERSION = '0.0.33';
const LANGS = [['en', 'English'], ['ru', 'Русский'], ['es', 'Español'], ['fr', 'Français'], ['he', 'עברית']];
const STR = {
  en: {
    tagline: "Let's go get them rats!", ruleAim: '<b>DRAG</b> to aim', ruleFire: '<b>LIFT</b> to fire',
    start: 'Start night 1', fine: 'Best in landscape · sound on', updateBtn: 'New version {v} · tap to update', install: 'Add to home screen', installIos: 'Tap Share, then "Add to Home Screen"', installOther: 'Open the browser menu, then "Add to Home screen"', version: 'version', language: 'Language',
    night: 'NIGHT', hint: 'DRAG TO AIM · LIFT TO FIRE', bossHint: 'KING RAT · 8 HITS · HEAD SHOTS COUNT 2', kingRat: 'KING RAT',
    headshot: 'HEAD SHOT', cleared: 'CLEARED', kingSlain: 'King rat slain', kingEscaped: 'The king rat escaped', kingLives: 'THE KING LIVES', escapedNoBonus: 'The king escaped: no night bonus', special: 'Special kills', total: 'Total', nextBegins: 'Night {n} begins',
    paused: 'PAUSED', resume: 'Back to the game', soundOn: 'Sound on', soundOff: 'Sound off', rifleShown: 'Rifle shown', rifleHidden: 'Rifle hidden',
    mainMenu: 'Main menu', rotateTitle: 'TURN YOUR PHONE SIDEWAYS', rotateBody: 'Rat Sniper plays in landscape. The game is paused until you rotate.',
    fullscreen: 'Go full screen', pause: 'Pause', sacks: ['FEED', 'OATS', 'CORN'],
    sp: { king: 'King rat', ufo: 'UFO rat', jackal: 'Jackal', zombie: 'Zombie', clown: 'Clown', xmas: 'X-mas', pirate: 'Pirate', drunk: 'Drunk', albino: 'Albino', mohawk: 'Mohawk', french: 'French', blind: 'Blind', alpha: 'Alpha' },
    say: { round: 'Round cleared', head: 'Head shot', king: 'King rat', noAmmo: 'Ran out of ammo', noTime: 'Ran out of time' }, speechLang: 'en-US',
    bullets: 'Bullets', coins: 'Coins', shopTitle: 'Restock', bonusLine: '+{n} bullets for surviving the night', buy5: '5 bullets · 4 coins', buy15: '15 bullets · 10 coins',
    poor: 'Not enough coins', startNow: 'Start now', gameOver: 'GAME OVER', outOfAmmo: 'You ran out of bullets', nightsSurvived: 'Nights survived', ratsKilled: 'Rats killed',
    best: 'Best', newBest: 'New best!', shareWa: 'Share on WhatsApp', playAgain: 'Play again',
    noBonus: 'Out of bullets: no night bonus', needAmmo: 'Buy bullets to start the next night', words: { bullet: ['bullet', 'bullets'], coin: ['coin', 'coins'], player: ['player', 'players'], rat: ['rat', 'rats'], grenade: ['grenade', 'grenades'] }, playedBy: 'Played by {n} {w}', ratsTotal: '{n} {w} killed',
    grenade: 'Grenade', grenades: 'Grenades', nadeHint: 'GRENADE IN HAND · LIFT TO THROW',
    shareMsg: 'My Rat Sniper score: {k} rats killed, {n} nights survived. Can you beat that? {url}',
  },
  ru: {
    tagline: 'Вперёд, за крысами!', ruleAim: '<b>ТЯНИ</b>, чтобы целиться', ruleFire: '<b>ОТПУСТИ</b>, чтобы стрелять',
    start: 'Начать ночь 1', fine: 'Лучше горизонтально · со звуком', updateBtn: 'Новая версия {v} · нажмите, чтобы обновить', install: 'На главный экран', installIos: 'Нажмите «Поделиться», затем «На экран „Домой“»', installOther: 'Откройте меню браузера и выберите «Добавить на главный экран»', version: 'версия', language: 'Язык',
    night: 'НОЧЬ', hint: 'ТЯНИ — ЦЕЛЬСЯ · ОТПУСТИ — ОГОНЬ', bossHint: 'КОРОЛЬ КРЫС · 8 ПОПАДАНИЙ · В ГОЛОВУ — ЗА ДВА', kingRat: 'КОРОЛЬ КРЫС',
    headshot: 'В ГОЛОВУ!', cleared: 'ЗАЧИЩЕНА', kingSlain: 'Король крыс убит', kingEscaped: 'Король крыс сбежал', kingLives: 'КОРОЛЬ ЖИВ', escapedNoBonus: 'Король сбежал: без бонуса за ночь', special: 'Особые трофеи', total: 'Всего', nextBegins: 'Ночь {n} начинается',
    paused: 'ПАУЗА', resume: 'Вернуться в игру', soundOn: 'Звук вкл.', soundOff: 'Звук выкл.', rifleShown: 'Винтовка видна', rifleHidden: 'Винтовка скрыта',
    mainMenu: 'Главное меню', rotateTitle: 'ПОВЕРНИТЕ ТЕЛЕФОН', rotateBody: 'Rat Sniper играется в горизонтальном режиме. Игра на паузе, пока вы не повернёте телефон.',
    fullscreen: 'Во весь экран', pause: 'Пауза', sacks: ['КОРМ', 'ОВЁС', 'ЗЕРНО'],
    sp: { king: 'Король крыс', ufo: 'Крыса на НЛО', jackal: 'Шакал', zombie: 'Зомби', clown: 'Клоун', xmas: 'Новогодняя', pirate: 'Пират', drunk: 'Пьяница', albino: 'Альбинос', mohawk: 'Ирокез', french: 'Француз', blind: 'Слепой', alpha: 'Альфа' },
    say: { round: 'Раунд пройден', head: 'В голову', king: 'Король крыс', noAmmo: 'Кончились патроны', noTime: 'Время вышло' }, speechLang: 'ru-RU',
    bullets: 'Патроны', coins: 'Монеты', shopTitle: 'Пополнение', bonusLine: '+{n} патрона за пережитую ночь', buy5: '5 патронов · 4 монеты', buy15: '15 патронов · 10 монет',
    poor: 'Не хватает монет', startNow: 'Начать сейчас', gameOver: 'ИГРА ОКОНЧЕНА', outOfAmmo: 'Закончились патроны', nightsSurvived: 'Ночей пережито', ratsKilled: 'Крыс убито',
    best: 'Рекорд', newBest: 'Новый рекорд!', shareWa: 'Поделиться в WhatsApp', playAgain: 'Играть снова',
    noBonus: 'Патроны кончились: без бонуса за ночь', needAmmo: 'Купите патроны, чтобы начать следующую ночь', words: { bullet: ['патрон', 'патрона', 'патронов'], coin: ['монета', 'монеты', 'монет'], player: ['игрок', 'игрока', 'игроков'], rat: ['крыса', 'крысы', 'крыс'], grenade: ['граната', 'гранаты', 'гранат'] }, playedBy: 'Уже сыграли: {n} {w}', ratsTotal: 'уничтожено крыс: {n}',
    grenade: 'Граната', grenades: 'Гранаты', nadeHint: 'ГРАНАТА В РУКЕ · ОТПУСТИ — БРОСОК',
    shareMsg: 'Мой результат в Rat Sniper: ночей пережито — {n}, крыс убито — {k}. Сможешь лучше? {url}',
  },
  es: {
    tagline: '¡Vamos a por esas ratas!', ruleAim: '<b>ARRASTRA</b> para apuntar', ruleFire: '<b>SUELTA</b> para disparar',
    start: 'Empezar noche 1', fine: 'Mejor en horizontal · con sonido', updateBtn: 'Nueva versión {v} · toca para actualizar', install: 'Añadir a la pantalla de inicio', installIos: 'Toca Compartir y luego «Añadir a pantalla de inicio»', installOther: 'Abre el menú del navegador y elige «Añadir a la pantalla de inicio»', version: 'versión', language: 'Idioma',
    night: 'NOCHE', hint: 'ARRASTRA PARA APUNTAR · SUELTA PARA DISPARAR', bossHint: 'REY RATA · 8 IMPACTOS · A LA CABEZA VALEN 2', kingRat: 'REY RATA',
    headshot: '¡A LA CABEZA!', cleared: 'SUPERADA', kingSlain: 'Rey rata abatido', kingEscaped: 'El rey rata escapó', kingLives: 'EL REY VIVE', escapedNoBonus: 'El rey escapó: sin bonificación de la noche', special: 'Bajas especiales', total: 'Total', nextBegins: 'Empieza la noche {n}',
    paused: 'PAUSA', resume: 'Volver al juego', soundOn: 'Sonido activado', soundOff: 'Sonido desactivado', rifleShown: 'Rifle visible', rifleHidden: 'Rifle oculto',
    mainMenu: 'Menú principal', rotateTitle: 'GIRA EL TELÉFONO', rotateBody: 'Rat Sniper se juega en horizontal. El juego está en pausa hasta que lo gires.',
    fullscreen: 'Pantalla completa', pause: 'Pausa', sacks: ['PIENSO', 'AVENA', 'MAÍZ'],
    sp: { king: 'Rey rata', ufo: 'Rata OVNI', jackal: 'Chacal', zombie: 'Zombi', clown: 'Payaso', xmas: 'Navideña', pirate: 'Pirata', drunk: 'Borracha', albino: 'Albina', mohawk: 'Cresta', french: 'Francesa', blind: 'Ciega', alpha: 'Alfa' },
    say: { round: 'Ronda superada', head: 'Tiro a la cabeza', king: 'El rey rata', noAmmo: 'Sin munición', noTime: 'Se acabó el tiempo' }, speechLang: 'es-ES',
    bullets: 'Balas', coins: 'Monedas', shopTitle: 'Recarga', bonusLine: '+{n} balas por sobrevivir la noche', buy5: '5 balas · 4 monedas', buy15: '15 balas · 10 monedas',
    poor: 'No tienes monedas suficientes', startNow: 'Empezar ya', gameOver: 'FIN DEL JUEGO', outOfAmmo: 'Te quedaste sin balas', nightsSurvived: 'Noches superadas', ratsKilled: 'Ratas abatidas',
    best: 'Récord', newBest: '¡Nuevo récord!', shareWa: 'Compartir por WhatsApp', playAgain: 'Jugar de nuevo',
    noBonus: 'Sin balas: no hay bonificación de la noche', needAmmo: 'Compra balas para empezar la siguiente noche', words: { bullet: ['bala', 'balas'], coin: ['moneda', 'monedas'], player: ['jugador', 'jugadores'], rat: ['rata', 'ratas'], grenade: ['granada', 'granadas'] }, playedBy: 'Jugado por {n} {w}', ratsTotal: '{n} {w} abatidas',
    grenade: 'Granada', grenades: 'Granadas', nadeHint: 'GRANADA EN MANO · SUELTA PARA LANZAR',
    shareMsg: 'Sobreviví {n} noches y abatí {k} ratas en Rat Sniper. ¿Puedes superarlo? {url}',
  },
  fr: {
    tagline: 'Allez, on chope ces rats !', ruleAim: '<b>GLISSE</b> pour viser', ruleFire: '<b>RELÂCHE</b> pour tirer',
    start: 'Commencer la nuit 1', fine: 'Mieux en paysage · avec le son', updateBtn: 'Nouvelle version {v} · touchez pour mettre à jour', install: 'Ajouter à l’écran d’accueil', installIos: 'Touchez Partager, puis « Sur l’écran d’accueil »', installOther: 'Ouvrez le menu du navigateur, puis « Ajouter à l’écran d’accueil »', version: 'version', language: 'Langue',
    night: 'NUIT', hint: 'GLISSE POUR VISER · RELÂCHE POUR TIRER', bossHint: 'ROI DES RATS · 8 TOUCHES · LA TÊTE COMPTE DOUBLE', kingRat: 'ROI DES RATS',
    headshot: 'EN PLEINE TÊTE !', cleared: 'TERMINÉE', kingSlain: 'Roi des rats abattu', kingEscaped: 'Le roi des rats s’est échappé', kingLives: 'LE ROI VIT', escapedNoBonus: 'Le roi s’est échappé : pas de bonus de nuit', special: 'Prises spéciales', total: 'Total', nextBegins: 'La nuit {n} commence',
    paused: 'PAUSE', resume: 'Retour au jeu', soundOn: 'Son activé', soundOff: 'Son coupé', rifleShown: 'Fusil visible', rifleHidden: 'Fusil masqué',
    mainMenu: 'Menu principal', rotateTitle: 'TOURNE TON TÉLÉPHONE', rotateBody: 'Rat Sniper se joue en paysage. Le jeu est en pause jusqu’à ce que tu le tournes.',
    fullscreen: 'Plein écran', pause: 'Pause', sacks: ['GRAIN', 'AVOINE', 'MAÏS'],
    sp: { king: 'Roi des rats', ufo: 'Rat OVNI', jackal: 'Chacal', zombie: 'Zombie', clown: 'Clown', xmas: 'Noël', pirate: 'Pirate', drunk: 'Ivrogne', albino: 'Albinos', mohawk: 'Crête', french: 'Français', blind: 'Aveugle', alpha: 'Alpha' },
    say: { round: 'Manche terminée', head: 'En pleine tête', king: 'Le roi des rats', noAmmo: 'Plus de munitions', noTime: 'Temps écoulé' }, speechLang: 'fr-FR',
    bullets: 'Balles', coins: 'Pièces', shopTitle: 'Ravitaillement', bonusLine: '+{n} balles pour avoir survécu à la nuit', buy5: '5 balles · 4 pièces', buy15: '15 balles · 10 pièces',
    poor: 'Pas assez de pièces', startNow: 'Commencer', gameOver: 'PARTIE TERMINÉE', outOfAmmo: 'Tu n’as plus de balles', nightsSurvived: 'Nuits survécues', ratsKilled: 'Rats abattus',
    best: 'Record', newBest: 'Nouveau record !', shareWa: 'Partager sur WhatsApp', playAgain: 'Rejouer',
    noBonus: 'Plus de balles : pas de bonus de nuit', needAmmo: 'Achète des balles pour commencer la nuit suivante', words: { bullet: ['balle', 'balles'], coin: ['pièce', 'pièces'], player: ['joueur', 'joueurs'], rat: ['rat', 'rats'], grenade: ['grenade', 'grenades'] }, playedBy: 'Joué par {n} {w}', ratsTotal: '{n} {w} abattus',
    grenade: 'Grenade', grenades: 'Grenades', nadeHint: 'GRENADE EN MAIN · RELÂCHE POUR LANCER',
    shareMsg: 'J’ai survécu {n} nuits et abattu {k} rats dans Rat Sniper. Tu fais mieux ? {url}',
  },
  he: {
    tagline: 'בואו נתפוס את העכברושים!', ruleAim: '<b>גררו</b> כדי לכוון', ruleFire: '<b>שחררו</b> כדי לירות',
    start: 'התחלת לילה 1', fine: 'הכי טוב לרוחב · עם סאונד', updateBtn: 'גרסה חדשה {v} · הקישו לעדכון', install: 'הוספה למסך הבית', installIos: 'הקישו על שיתוף ואז על "הוספה למסך הבית"', installOther: 'פתחו את תפריט הדפדפן ובחרו "הוספה למסך הבית"', version: 'גרסה', language: 'שפה',
    night: 'לילה', hint: 'גררו לכיוון · שחררו לירי', bossHint: 'מלך העכברושים · 8 פגיעות · פגיעה בראש שווה 2', kingRat: 'מלך העכברושים',
    headshot: 'פגיעה בראש!', cleared: 'הושלם', kingSlain: 'מלך העכברושים חוסל', kingEscaped: 'מלך העכברושים ברח', kingLives: 'המלך חי', escapedNoBonus: 'המלך ברח: אין בונוס לילה', special: 'חיסולים מיוחדים', total: 'סה״כ', nextBegins: 'לילה {n} מתחיל',
    paused: 'מושהה', resume: 'חזרה למשחק', soundOn: 'סאונד פועל', soundOff: 'סאונד כבוי', rifleShown: 'הרובה מוצג', rifleHidden: 'הרובה מוסתר',
    mainMenu: 'תפריט ראשי', rotateTitle: 'סובבו את הטלפון לרוחב', rotateBody: 'משחקים ב-Rat Sniper לרוחב. המשחק מושהה עד שתסובבו את הטלפון.',
    fullscreen: 'מסך מלא', pause: 'השהיה', sacks: ['מספוא', 'שיבולת', 'תירס'],
    sp: { king: 'מלך העכברושים', ufo: 'עכברוש עב״ם', jackal: 'תן', zombie: 'זומבי', clown: 'ליצן', xmas: 'חג המולד', pirate: 'פיראט', drunk: 'שיכור', albino: 'לבקן', mohawk: 'מוהוק', french: 'צרפתי', blind: 'עיוור', alpha: 'אלפא' },
    say: { round: 'הסיבוב הושלם', head: 'פגיעה בראש', king: 'מלך העכברושים', noAmmo: 'נגמרה התחמושת', noTime: 'נגמר הזמן' }, speechLang: 'he-IL',
    bullets: 'כדורים', coins: 'מטבעות', shopTitle: 'חידוש תחמושת', bonusLine: '+{n} כדורים על שרידת הלילה', buy5: '5 כדורים · 4 מטבעות', buy15: '15 כדורים · 10 מטבעות',
    poor: 'אין מספיק מטבעות', startNow: 'להתחיל עכשיו', gameOver: 'המשחק נגמר', outOfAmmo: 'נגמרו לך הכדורים', nightsSurvived: 'לילות ששרדת', ratsKilled: 'עכברושים שחוסלו',
    best: 'שיא', newBest: 'שיא חדש!', shareWa: 'שיתוף בוואטסאפ', playAgain: 'לשחק שוב',
    noBonus: 'נגמרו הכדורים: אין בונוס לילה', needAmmo: 'קנו כדורים כדי להתחיל את הלילה הבא', words: { bullet: ['כדור', 'כדורים'], coin: ['מטבע', 'מטבעות'], player: ['שחקן', 'שחקנים'], rat: ['עכברוש', 'עכברושים'], grenade: ['רימון', 'רימונים'] }, playedBy: 'שחקנים עד כה: {n}', ratsTotal: 'עכברושים שחוסלו: {n}',
    grenade: 'רימון', grenades: 'רימונים', nadeHint: 'רימון ביד · שחררו לזריקה',
    shareMsg: 'שרדתי {n} לילות וחיסלתי {k} עכברושים ב-Rat Sniper. מסוגלים יותר? {url}',
  },
};
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
const ROUND_TIME = 30, BREAK_TIME = 15;   // the break is longer now: it's also the shop
const BOSS_TIME = 40;                     // the king digs back in and escapes if he's still alive after this
/* economy: every shot costs a bullet; kills pay coins; coins buy bullets between nights.
   Running out of bullets during a night ends the game. */
const AMMO_START = 15, NIGHT_BONUS = 5, HEAD_BONUS = 1;
const PRICE_STEP = 5;                                      // packs cost 1 coin more every 5 nights
const PACKS = [[5, 4], [15, 10]];                          // [bullets, price in coins]
const BOUNTY = { rat: 1, alpha: 2, rare: 3, ufo: 5, king: 10, jackal: 2 };
const GAME_URL = 'https://ratsniper.o-vertman.workers.dev/';
/* difficulty: each grows a little every night (night 1 = 0) up to a cap */
const LVL = () => Math.max(0, G.night - 1);
const DIFF = {
  speed:  () => Math.min(2.2, 1 + 0.09 * LVL()),           // how fast rats move
  far:    () => Math.min(2.5, 0.18 * LVL()),               // how strongly spawns lean toward the far paths
  fright: () => Math.min(2.0, 1 + 0.08 * LVL()),           // how far a shot scares rats
  flee:   () => Math.min(2.2, 1 + 0.07 * LVL()),           // how fast scared rats run
};
const SHOT_COOLDOWN = 0.55;
/* grenade: sold in the shop, one use each. Tap the button to take one in hand, lift to throw it at the crosshair.
   It blows up everything inside an oval on the ground (sized to the depth it lands at) for 2 damage, like a head shot. */
const NADE_PRICE = 6, NADE_DMG = 2;
const NADE_RX = 170, NADE_RY = 90;       // blast oval in world units at full (near-lane) scale
const NADE_FLIGHT = 0.42, THROW_T = 0.3;  // seconds in the air; length of the arm swing

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
function sfxShot() {
  const c = A.ctx; if (!c) return; const t = c.currentTime;
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

/* ---------- game state ---------- */
const G = {
  mode: 'menu', night: 1, time: ROUND_TIME, breakT: 0, kills: 0, nightKills: 0,
  aimX: 380, aimY: 650, rats: [], parts: [], decals: [], puffs: [], obs: [], tails: [],
  spawnT: 0, kick: 0, kickX: 0, flash: 0, lastShot: -9, clock: 0, paused: false, voicedNight: 0, spawnCount: 0, rareCount: 0, boss: false, bossEndT: 0, userPaused: false, ufo: null, ufoT: 0, owl: null, nightSpecial: {}, gameSpecial: {}, ammo: AMMO_START, coins: 0, outT: 0, pops: [], lastResult: null, firstNight: 1, hintTO: 0,
  grenades: 0, armed: false, nade: null, throwT: -9, wpn: 0, nadeHinted: false,
};
const diff = () => DIFF.speed();
const maxAlive = () => G.mode === 'menu' ? 5 : Math.min(12, 4 + G.night);
const stopDur = () => Math.max(0.55, rand(1.3, 2.8) - 0.13 * (G.night - 1));
const ratSpeed = r => 72 * r.ls * (VAR_SPEED[r.variant] || 1) * (r.king ? 1.5 * (r.hp <= r.maxHp / 2 ? 1.5 : 1) : diff()) * (r.state === 'scurry' ? 2.3 * DIFF.flee() : r.state === 'rage' ? 1.9 : 1);
const BOSS_EVERY = 5, KING_HP = 8, KING_SIZE = 3.2;    // 8 hits: there are no other rats on boss nights to pay for bullets
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
  r.king = true; r.sc = r.ls * KING_SIZE; r.hp = r.maxHp = KING_HP; r.t = rand(2, 3);
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
function dirtLip(g, s, ee) {
  // loose earth heaped in front of the hole, covering the rat where it meets the ground
  g.globalAlpha = Math.max(0, 1 - ee * ee);
  g.fillStyle = '#5f6361'; g.beginPath(); g.ellipse(0, 0, 38 * s, 8 * s, 0, 0, Math.PI); g.fill();
  g.fillStyle = '#7a7e7c'; g.beginPath(); g.ellipse(0, 0.5 * s, 38 * s, 4 * s, 0, Math.PI, Math.PI * 2); g.fill();
  g.fillStyle = 'rgba(190,196,192,.45)';
  for (let i = 0; i < 9; i++) ell(g, (i - 4) * 8.5 * s, (1.5 + (i % 3)) * s, 1.6 * s, 1.1 * s);
  g.globalAlpha = 1;
}
const ALPHA_EVERY = 10, ALPHA_SIZE = 1.45;

const LANE_W = [0.16, 0.18, 0.2, 0.23, 0.23];
function pickLane() {
  // later nights tip the odds toward the far paths, where rats are smaller and harder to hit
  const far = G.mode === 'menu' ? 0 : DIFF.far(), n = LANE_W.length;
  const w = LANE_W.map((v, i) => v * (1 + far * (1 - i / (n - 1))));
  let x = Math.random() * w.reduce((a, b) => a + b, 0);
  for (let i = 0; i < n; i++) if ((x -= w[i]) <= 0) return i;
  return n - 1;
}
// rare dressed-up rats: about 1 in 15 ordinary spawns; they only look different (zombie also takes 2 body hits)
const VARIANTS = ['zombie', 'clown', 'xmas', 'pirate', 'drunk', 'albino', 'mohawk', 'french', 'blind'];
const RARE_EVERY = 15;
const VAR_SPEED = { zombie: 0.55, blind: 0.45, drunk: 0.8, mohawk: 1.5, clown: 1.1 };
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
    alpha, hp: alpha || variant === 'zombie' ? 2 : 1, rage: false, wounds: [], jx: 0, jy: 0, jerkT: 0, pause: 0, turnT: 0, coat,
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
  // clutter in front of the target takes the bullet instead
  let blocker = null, ufoZone = null;
  for (const o of G.obs) if (obsHit(o, ax, ay) && (!blocker || o.y > blocker.y)) blocker = o;
  const targetY = best ? best.y : jz ? G.jackal.y : null;
  if (blocker && targetY !== null && blocker.y < targetY) blocker = null;
  sfxShot();
  G.kick = 1; G.kickX = rand(-1, 1); G.flash = 1; G.rifleKick = 1;
  if (blocker) { best = null; hitObstacle(blocker, ax, ay); }
  else if (jz) shootJackal(G.jackal, jz, ax, ay);
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
  const head = !blasted && hit.zone === 'head', dmg = head || blasted ? 2 : 1;   // a head shot or a grenade counts as two hits
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
const SPECIALS = [['king', 'King rat'], ['ufo', 'UFO rat'], ['jackal', 'Jackal'], ['zombie', 'Zombie'], ['clown', 'Clown'], ['xmas', 'X-mas'], ['pirate', 'Pirate'],
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
// "15 bullets · 11 coins" in the current language, with the right plural forms
function plural(n, forms) {
  if (forms.length === 3) {   // Russian: one / few / many
    const m10 = n % 10, m100 = n % 100;
    return forms[m10 === 1 && m100 !== 11 ? 0 : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 1 : 2];
  }
  return forms[n === 1 ? 0 : 1];
}
const itemLabel = (word, n, c) => `${n} ${plural(n, STR[LANG].words[word])} · ${c} ${plural(c, STR[LANG].words.coin)}`;
const packPrice = i => i === 'nade' ? NADE_PRICE + Math.floor(G.night / PRICE_STEP) : PACKS[i][1] + Math.floor(G.night / PRICE_STEP);
const cheapest = () => Math.min(...PACKS.map((_, i) => packPrice(i)));   // bullets only: a grenade can't keep you in the game
// nothing left to shoot or throw, and no coins for bullets
const broke = () => G.ammo <= 0 && G.grenades <= 0 && G.coins < cheapest();
function renderShop() {
  $('#shop-bonus').textContent = G.earlyEnd ? tr(G.earlyEnd === 'escape' ? 'escapedNoBonus' : 'noBonus') : tr('bonusLine', { n: NIGHT_BONUS });
  $('#shop-bonus').classList.toggle('poor', !!G.earlyEnd);
  $('#shop-ammo').textContent = G.ammo; $('#shop-coins').textContent = G.coins; $('#shop-nades').textContent = G.grenades;
  document.querySelectorAll('.item').forEach(b => {
    const i = b.dataset.pack === 'nade' ? 'nade' : +b.dataset.pack, n = i === 'nade' ? 1 : PACKS[i][0], price = packPrice(i);
    b.querySelector('.n').textContent = '+' + n;
    b.querySelector('.c').textContent = price;
    b.setAttribute('aria-label', itemLabel(i === 'nade' ? 'grenade' : 'bullet', n, price));
    b.classList.toggle('cant', G.coins < price);
  });
}
function buyPack(i) {
  const price = packPrice(i);
  if (G.coins < price) { $('#shop-msg').textContent = tr('poor'); $('#shop-msg').hidden = false; return; }
  G.coins -= price; $('#shop-msg').hidden = true;
  if (i === 'nade') { G.grenades++; sfxPin(); count({ grenades: 1 }); } else { G.ammo += PACKS[i][0]; sfxPing(0, false); }
  updateAmmo(); renderShop();
  for (const id of [i === 'nade' ? '#shop-nades' : '#shop-ammo', '#shop-coins']) { const p = $(id).parentElement; p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump'); }
}
document.querySelectorAll('.item').forEach(b => b.addEventListener('click', () => buyPack(b.dataset.pack === 'nade' ? 'nade' : +b.dataset.pack)));
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
  G.grenades = 0; G.armed = false; G.nade = null; G.nadeHinted = false;
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
  G.mode = 'menu'; G.boss = false; G.bossEndT = 0; G.ufo = null; G.ufoT = 0; ufoHumStop(); G.jackal = null; G.jackalT = 0; G.armed = false; G.nade = null;
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
  G.rifleKick = (G.rifleKick || 0) * Math.exp(-dt * 7); G.flash *= Math.exp(-dt * 22);

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

/* ---------- the owl: sometimes perched on a ledge in the background; shooting at it only scares it off ---------- */
const OWL_CHANCE = 0.6, OWL_SCALE = 1.15 * FAR_K;   // sized to match the buildings it perches on
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

/* ---------- ultra rare: a rat flying a little saucer across the yard ---------- */
const UFO_CHANCE = 0.12, UFO_SCALE = 0.95, UFO_GROUND = 600;
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

/* ---------- the jackal: on some nights one trots across the yard without stopping; one hit kills it, 2 coins ---------- */
const JACKAL_CHANCE = 0.4, JACKAL_FROM_NIGHT = 2;
const JACKAL_LANES = [0, 1, 2];          // never on the two paths nearest the shooter
const JACKAL_SPEED = 360, JACKAL_STRIDE = 150;   // world units per second and per stride, at full scale
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
  ents.sort((a, b) => a[0] - b[0]);
  for (const [, k, e, x] of ents) {
    if (k === 4) drawJackalAt(ctx, e, x, e.y - top);
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
    if (showRifle && G.wpn < 0.5) drawRifle(G.wpn * 2);
    if (showRifle && G.wpn > 0.5) drawHand((1 - G.wpn) * 2);
    if (G.armed) drawBombSight(); else drawCrosshair();
  }
  if (drag.id !== null && G.mode === 'play') drawStick();
}

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
  const box = (t0, t1, w, h, top, side, lift = 0) => {
    const c = (t, sx, sy) => at(t, lift - sy * h, sx * w);
    quad([c(t0, 1, -1), c(t0, 1, 1), c(t1, 1, 1), c(t1, 1, -1)], side);
    quad([c(t0, -1, -1), c(t0, 1, -1), c(t1, 1, -1), c(t1, -1, -1)], top);
  };
  // a round tube along the rifle, shaded with a light top edge; optional cap drawn at the near end
  const tube = (t0, t1, r0, r1, up, cols, cap, capRatio = 0.85) => {
    const p0 = at(t0, up), p1 = at(t1, up), [ax, ay] = P(p0), [bx, by] = P(p1), ra = R(p0, r0), rb = R(p1, r1);
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
})();
