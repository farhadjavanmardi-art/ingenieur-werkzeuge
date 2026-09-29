// Gemeinsame Helfer fuer die Pruefungen.
//
// Zwei Dinge sind hier wichtig und absichtlich so:
//
// 1. Das Netz wird abgeschaltet. Jede Anfrage nach draussen wird geblockt,
//    auch auf einem Rechner mit Internet. Nur so ist die Pruefung reproduzierbar,
//    und nur so faellt auf, wenn eine Rechnung wieder anfaengt, von einem
//    fremden Server abzuhaengen.
//
// 2. Verglichen wird der Text, den der Nutzer sieht, nicht eine interne Zahl.
//    Damit faellt auch auf, wenn sich Formatierung oder Einheit aendert.

const path = require('path');
const fs = require('fs');
const http = require('http');

const WERKZEUGE = path.resolve(__dirname, '..');

/* Die Edge Function liegt je nach Ablage woanders: im Salon-Projekt eine
   Ebene ueber den Werkzeugen, im eigenen Repository daneben. Beide Wege
   werden probiert, damit diese Datei in beiden Ablagen dieselbe bleibt und
   nicht auseinanderlaeuft. */
function edgeDatei(...teile) {
  const orte = [
    path.resolve(WERKZEUGE, '..', 'supabase', 'functions', ...teile),
    path.resolve(WERKZEUGE, 'supabase', 'functions', ...teile),
  ];
  return orte.find(fs.existsSync) || orte[0];
}

// Ein winziger Server fuer die Dauer der Pruefung.
//
// Frueher wurden die Dateien ueber file:// geoeffnet. Damit laesst sich aber
// nicht alles pruefen: ES-Module verweigert der Browser unter file://
// grundsaetzlich, auch wenn die Datei danebenliegt. Bau_CAD und Structure_CAD
// sahen deshalb kaputt aus, obwohl sie es nicht waren.
//
// Verkauft wird ohnehin nicht file://, sondern ein Web-Server. Also wird
// genauso geprueft. Nach draussen geht weiterhin nichts.
const TYPEN = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject',
};

function starteServer() {
  const server = http.createServer((anfrage, antwort) => {
    const rein = decodeURIComponent(anfrage.url.split('?')[0]);
    // Wie Vercel mit cleanUrls: /x findet x.html, /ordner findet
    // ordner/index.html. Das ist nicht Bequemlichkeit, sondern noetig - unter
    // /shop ohne Schraegstrich zaehlt fuer den Browser der Elternordner als
    // Basis, und eine Datei daneben laedt dann nicht. Genau das ist im Netz
    // passiert und fiel hier nicht auf, solange nur .html-Pfade bedient wurden.
    const kandidaten = [
      path.join(WERKZEUGE, rein),
      path.join(WERKZEUGE, rein + '.html'),
      path.join(WERKZEUGE, rein, 'index.html'),
    ];
    const ziel = kandidaten.find(z => {
      if (!z.startsWith(WERKZEUGE)) return false;
      try { return fs.statSync(z).isFile(); } catch (e) { return false; }
    });
    if (!ziel) { antwort.writeHead(404).end('nicht gefunden: ' + rein); return; }
    fs.readFile(ziel, (fehler, inhalt) => {
      if (fehler) { antwort.writeHead(404).end('nicht gefunden: ' + rein); return; }
      antwort.writeHead(200, { 'Content-Type': TYPEN[path.extname(ziel).toLowerCase()] || 'application/octet-stream' });
      antwort.end(inhalt);
    });
  });
  return new Promise(fertig => server.listen(0, '127.0.0.1', () => fertig(server)));
}

let SERVER = null, WURZEL = '';
async function serverBereit() {
  if (!SERVER) { SERVER = await starteServer(); WURZEL = 'http://127.0.0.1:' + SERVER.address().port; }
  return WURZEL;
}
function serverSchliessen() { if (SERVER) { SERVER.close(); SERVER = null; } }

function ladePlaywright() {
  // Erst lokal (npm i im tests-Ordner), dann global.
  const orte = [
    path.join(__dirname, 'node_modules', 'playwright'),
    process.env.NPM_ROOT ? path.join(process.env.NPM_ROOT, 'playwright') : null,
  ].filter(Boolean);
  for (const o of orte) {
    try { return require(o); } catch (_) { /* naechster Ort */ }
  }
  try { return require('playwright'); } catch (_) { /* nicht gefunden */ }
  console.error(
    'Playwright nicht gefunden.\n' +
    '  cd ingenieur-werkzeuge/tests && npm install\n' +
    'oder NPM_ROOT auf das globale npm-Verzeichnis setzen.');
  process.exit(2);
}

// Chromium moeglichst dort nehmen, wo er schon liegt.
function chromiumPfad() {
  for (const p of ['/opt/pw-browsers/chromium', process.env.CHROMIUM_PFAD]) {
    if (p && fs.existsSync(p)) return p;
  }
  return undefined;   // Playwright sucht selbst
}

async function starteBrowser() {
  const { chromium } = ladePlaywright();
  const opt = {};
  const pfad = chromiumPfad();
  if (pfad) opt.executablePath = pfad;
  return chromium.launch(opt);
}

// Eine Seite mit abgeschaltetem Netz. Nur file:// kommt durch.
async function neueSeite(browser) {
  const seite = await browser.newPage();
  const fehler = [];
  seite.on('pageerror', e => fehler.push(e.message.split('\n')[0]));
  seite.on('dialog', d => d.dismiss().catch(() => {}));
  const wurzel = await serverBereit();
  await seite.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith(wurzel) || url.startsWith('data:') || url.startsWith('blob:')) {
      return route.continue();
    }
    return route.abort();        // kein Netz, absichtlich
  });
  seite._fehler = fehler;
  return seite;
}

async function oeffne(seite, datei) {
  seite._fehler.length = 0;
  const wurzel = await serverBereit();
  await seite.goto(wurzel + '/' + datei.split(path.sep).map(encodeURIComponent).join('/'));
  await seite.waitForTimeout(450);
}

// Text eines Elements, so wie er auf dem Bildschirm steht.
async function text(seite, id) {
  return seite.evaluate(i => {
    const e = document.getElementById(i);
    return e ? (e.textContent || '').trim() : '__FEHLT__';
  }, id);
}

// Felder setzen und eine Funktion der Seite aufrufen.
async function stelleEin(seite, werte, aufruf) {
  return seite.evaluate(({ w, a }) => {
    for (const k in w) {
      const e = document.getElementById(k);
      if (!e) return '__FELD_FEHLT__:' + k;
      e.value = w[k];
    }
    try { eval(a); } catch (e) { return '__AUSNAHME__:' + e.message.split('\n')[0]; }
    return 'ok';
  }, { w: werte, a: aufruf });
}

module.exports = { WERKZEUGE, edgeDatei, starteBrowser, neueSeite, oeffne, text, stelleEin, serverSchliessen };
