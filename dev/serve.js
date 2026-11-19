// Local test server for Rat Sniper: node dev/serve.js [port]   (default 8768, no packages needed)
// Serves the repo folder. Extra: /test is the game with its internals exposed as window.__t for console checks
// (done in memory; the real files are never changed).
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), PORT = +process.argv[2] || 8768;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.wav': 'audio/wav', '.svg': 'image/svg+xml' };
const EXPOSE = 'window.__t = { G, A, fire, update, startRound, buyPack, makeRat, voice, setLang, VERSION,\n' +
  '  hitTest, setArmed, throwNade, startGame, packPrice, cheapest, hpMul, UPGRADE_PRICE, RIFLES, PACKS,\n' +
  '  spawnBoar, boarHit, shootBoar, drawBoar, spawnJackal, drawJackal, render,\n' +
  '  setHpStep: v => { HP_STEP = v; } };\n';

http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  const send = (code, body, type) => { res.writeHead(code, { 'Content-Type': type, 'Cache-Control': 'no-store' }); res.end(body); };
  try {
    if (url === '/test') {
      const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8').replace('src="js/game.js"', 'src="/test.js"').replace('src="js/config.js"', 'src="/test-config.js"');
      return send(200, html, TYPES['.html']);
    }
    if (url === '/test.js') {
      const js = fs.readFileSync(path.join(ROOT, 'js', 'game.js'), 'utf8').replace('const fontsReady = document', EXPOSE + 'const fontsReady = document');
      return send(200, js, TYPES['.js']);
    }
    if (url === '/test-config.js') {   // HP_STEP as let, so the balance bot (dev/bot.js) can try other values
      const js = fs.readFileSync(path.join(ROOT, 'js', 'config.js'), 'utf8').replace('const HP_STEP =', 'let HP_STEP =');
      return send(200, js, TYPES['.js']);
    }
    if (url.endsWith('/')) url += 'index.html';
    const file = path.join(ROOT, path.normalize(url));
    if (!file.startsWith(ROOT)) return send(403, 'forbidden', 'text/plain');
    send(200, fs.readFileSync(file), TYPES[path.extname(file)] || 'application/octet-stream');
  } catch (e) { send(404, 'not found', 'text/plain'); }
}).listen(PORT, '127.0.0.1', () => console.log('Rat Sniper on http://localhost:' + PORT));
