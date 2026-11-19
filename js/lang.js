'use strict';
/* Rat Sniper: translations. Every word the player sees or hears, in en, ru, es, fr, he.
   One of the game's plain scripts (see index.html); they share one global scope, so names here are
   used directly by js/game.js and the other files.
   The language state and helpers (LANG, tr, applyLang, setLang) are in js/game.js. */

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
    sp: { king: 'King rat', ufo: 'UFO rat', jackal: 'Jackal', boar: 'Wild boar', zombie: 'Zombie', clown: 'Clown', xmas: 'X-mas', pirate: 'Pirate', drunk: 'Drunk', albino: 'Albino', mohawk: 'Mohawk', french: 'French', blind: 'Blind', alpha: 'Alpha' },
    say: { round: 'Round cleared', head: 'Head shot', king: 'King rat', noAmmo: 'Ran out of ammo', noTime: 'Ran out of time' }, speechLang: 'en-US',
    bullets: 'Bullets', coins: 'Coins', shopTitle: 'Restock', bonusLine: '+{n} bullets for surviving the night', buy5: '5 bullets · 4 coins', buy15: '15 bullets · 10 coins',
    poor: 'Not enough coins', startNow: 'Start now', gameOver: 'GAME OVER', outOfAmmo: 'You ran out of bullets', nightsSurvived: 'Nights survived', ratsKilled: 'Rats killed',
    accuracy: 'Accuracy', best: 'Best', newBest: 'New best!', shareWa: 'Share on WhatsApp', playAgain: 'Play again',
    noBonus: 'Out of bullets: no night bonus', needAmmo: 'Buy bullets to start the next night', words: { bullet: ['bullet', 'bullets'], coin: ['coin', 'coins'], player: ['player', 'players'], rat: ['rat', 'rats'], grenade: ['grenade', 'grenades'] }, playedBy: 'Played by {n} {w}', ratsTotal: '{n} {w} killed',
    rifles: ['Sniper', 'Laser', 'Plasma', 'Railgun'], tougher: 'Rats get tougher from the next night',
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
    sp: { king: 'Король крыс', ufo: 'Крыса на НЛО', jackal: 'Шакал', boar: 'Кабан', zombie: 'Зомби', clown: 'Клоун', xmas: 'Новогодняя', pirate: 'Пират', drunk: 'Пьяница', albino: 'Альбинос', mohawk: 'Ирокез', french: 'Француз', blind: 'Слепой', alpha: 'Альфа' },
    say: { round: 'Раунд пройден', head: 'В голову', king: 'Король крыс', noAmmo: 'Кончились патроны', noTime: 'Время вышло' }, speechLang: 'ru-RU',
    bullets: 'Патроны', coins: 'Монеты', shopTitle: 'Пополнение', bonusLine: '+{n} патрона за пережитую ночь', buy5: '5 патронов · 4 монеты', buy15: '15 патронов · 10 монет',
    poor: 'Не хватает монет', startNow: 'Начать сейчас', gameOver: 'ИГРА ОКОНЧЕНА', outOfAmmo: 'Закончились патроны', nightsSurvived: 'Ночей пережито', ratsKilled: 'Крыс убито',
    accuracy: 'Точность', best: 'Рекорд', newBest: 'Новый рекорд!', shareWa: 'Поделиться в WhatsApp', playAgain: 'Играть снова',
    noBonus: 'Патроны кончились: без бонуса за ночь', needAmmo: 'Купите патроны, чтобы начать следующую ночь', words: { bullet: ['патрон', 'патрона', 'патронов'], coin: ['монета', 'монеты', 'монет'], player: ['игрок', 'игрока', 'игроков'], rat: ['крыса', 'крысы', 'крыс'], grenade: ['граната', 'гранаты', 'гранат'] }, playedBy: 'Уже сыграли: {n} {w}', ratsTotal: 'уничтожено крыс: {n}',
    rifles: ['Снайперка', 'Лазер', 'Плазма', 'Рельсотрон'], tougher: 'Со следующей ночи крысы крепче',
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
    sp: { king: 'Rey rata', ufo: 'Rata OVNI', jackal: 'Chacal', boar: 'Jabalí', zombie: 'Zombi', clown: 'Payaso', xmas: 'Navideña', pirate: 'Pirata', drunk: 'Borracha', albino: 'Albina', mohawk: 'Cresta', french: 'Francesa', blind: 'Ciega', alpha: 'Alfa' },
    say: { round: 'Ronda superada', head: 'Tiro a la cabeza', king: 'El rey rata', noAmmo: 'Sin munición', noTime: 'Se acabó el tiempo' }, speechLang: 'es-ES',
    bullets: 'Balas', coins: 'Monedas', shopTitle: 'Recarga', bonusLine: '+{n} balas por sobrevivir la noche', buy5: '5 balas · 4 monedas', buy15: '15 balas · 10 monedas',
    poor: 'No tienes monedas suficientes', startNow: 'Empezar ya', gameOver: 'FIN DEL JUEGO', outOfAmmo: 'Te quedaste sin balas', nightsSurvived: 'Noches superadas', ratsKilled: 'Ratas abatidas',
    accuracy: 'Precisión', best: 'Récord', newBest: '¡Nuevo récord!', shareWa: 'Compartir por WhatsApp', playAgain: 'Jugar de nuevo',
    noBonus: 'Sin balas: no hay bonificación de la noche', needAmmo: 'Compra balas para empezar la siguiente noche', words: { bullet: ['bala', 'balas'], coin: ['moneda', 'monedas'], player: ['jugador', 'jugadores'], rat: ['rata', 'ratas'], grenade: ['granada', 'granadas'] }, playedBy: 'Jugado por {n} {w}', ratsTotal: '{n} {w} abatidas',
    rifles: ['Francotirador', 'Láser', 'Plasma', 'Cañón de riel'], tougher: 'Las ratas serán más duras desde la próxima noche',
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
    sp: { king: 'Roi des rats', ufo: 'Rat OVNI', jackal: 'Chacal', boar: 'Sanglier', zombie: 'Zombie', clown: 'Clown', xmas: 'Noël', pirate: 'Pirate', drunk: 'Ivrogne', albino: 'Albinos', mohawk: 'Crête', french: 'Français', blind: 'Aveugle', alpha: 'Alpha' },
    say: { round: 'Manche terminée', head: 'En pleine tête', king: 'Le roi des rats', noAmmo: 'Plus de munitions', noTime: 'Temps écoulé' }, speechLang: 'fr-FR',
    bullets: 'Balles', coins: 'Pièces', shopTitle: 'Ravitaillement', bonusLine: '+{n} balles pour avoir survécu à la nuit', buy5: '5 balles · 4 pièces', buy15: '15 balles · 10 pièces',
    poor: 'Pas assez de pièces', startNow: 'Commencer', gameOver: 'PARTIE TERMINÉE', outOfAmmo: 'Tu n’as plus de balles', nightsSurvived: 'Nuits survécues', ratsKilled: 'Rats abattus',
    accuracy: 'Précision', best: 'Record', newBest: 'Nouveau record !', shareWa: 'Partager sur WhatsApp', playAgain: 'Rejouer',
    noBonus: 'Plus de balles : pas de bonus de nuit', needAmmo: 'Achète des balles pour commencer la nuit suivante', words: { bullet: ['balle', 'balles'], coin: ['pièce', 'pièces'], player: ['joueur', 'joueurs'], rat: ['rat', 'rats'], grenade: ['grenade', 'grenades'] }, playedBy: 'Joué par {n} {w}', ratsTotal: '{n} {w} abattus',
    rifles: ['Sniper', 'Laser', 'Plasma', 'Railgun'], tougher: 'Les rats seront plus coriaces dès la nuit prochaine',
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
    sp: { king: 'מלך העכברושים', ufo: 'עכברוש עב״ם', jackal: 'תן', boar: 'חזיר בר', zombie: 'זומבי', clown: 'ליצן', xmas: 'חג המולד', pirate: 'פיראט', drunk: 'שיכור', albino: 'לבקן', mohawk: 'מוהוק', french: 'צרפתי', blind: 'עיוור', alpha: 'אלפא' },
    say: { round: 'הסיבוב הושלם', head: 'פגיעה בראש', king: 'מלך העכברושים', noAmmo: 'נגמרה התחמושת', noTime: 'נגמר הזמן' }, speechLang: 'he-IL',
    bullets: 'כדורים', coins: 'מטבעות', shopTitle: 'חידוש תחמושת', bonusLine: '+{n} כדורים על שרידת הלילה', buy5: '5 כדורים · 4 מטבעות', buy15: '15 כדורים · 10 מטבעות',
    poor: 'אין מספיק מטבעות', startNow: 'להתחיל עכשיו', gameOver: 'המשחק נגמר', outOfAmmo: 'נגמרו לך הכדורים', nightsSurvived: 'לילות ששרדת', ratsKilled: 'עכברושים שחוסלו',
    accuracy: 'דיוק', best: 'שיא', newBest: 'שיא חדש!', shareWa: 'שיתוף בוואטסאפ', playAgain: 'לשחק שוב',
    noBonus: 'נגמרו הכדורים: אין בונוס לילה', needAmmo: 'קנו כדורים כדי להתחיל את הלילה הבא', words: { bullet: ['כדור', 'כדורים'], coin: ['מטבע', 'מטבעות'], player: ['שחקן', 'שחקנים'], rat: ['עכברוש', 'עכברושים'], grenade: ['רימון', 'רימונים'] }, playedBy: 'שחקנים עד כה: {n}', ratsTotal: 'עכברושים שחוסלו: {n}',
    rifles: ['צלף', 'לייזר', 'פלזמה', 'רובה מסילה'], tougher: 'מהלילה הבא העכברושים קשוחים יותר',
    grenade: 'רימון', grenades: 'רימונים', nadeHint: 'רימון ביד · שחררו לזריקה',
    shareMsg: 'שרדתי {n} לילות וחיסלתי {k} עכברושים ב-Rat Sniper. מסוגלים יותר? {url}',
  },
};

// "15 bullets · 11 coins" in the current language, with the right plural forms
function plural(n, forms) {
  if (forms.length === 3) {   // Russian: one / few / many
    const m10 = n % 10, m100 = n % 100;
    return forms[m10 === 1 && m100 !== 11 ? 0 : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 1 : 2];
  }
  return forms[n === 1 ? 0 : 1];
}
