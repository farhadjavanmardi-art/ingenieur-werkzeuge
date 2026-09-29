#!/usr/bin/env node
// Pruefung der Ingenieur-Werkzeuge.
//
//   node tests/run.cjs              alles
//   node tests/run.cjs Regelventil  nur was im Titel passt
//
// Rueckgabewert 0, wenn alles stimmt, sonst 1. Damit laesst es sich spaeter
// ohne Aenderung in eine CI haengen.
//
// Das Netz ist waehrend der Pruefung abgeschaltet, siehe lib.cjs.

const fs = require('fs');
const path = require('path');
const { starteBrowser, neueSeite, oeffne, text, stelleEin, serverSchliessen, WERKZEUGE, edgeDatei } = require('./lib.cjs');
const GRUPPEN = require('./faelle.cjs');

const filter = process.argv[2] || '';
const gruen = s => '\x1b[32m' + s + '\x1b[0m';
const rot   = s => '\x1b[31m' + s + '\x1b[0m';
const gelb  = s => '\x1b[33m' + s + '\x1b[0m';
const grau  = s => '\x1b[90m' + s + '\x1b[0m';

let ok = 0, schlecht = 0;
let behaupteteZahl = null;   // was die Verkaufsseite als Zahl der Pruefungen nennt
const fehlerliste = [];

function melde(gut, titel, detail) {
  if (gut) { ok++; console.log('  ' + gruen('ok  ') + titel); }
  else { schlecht++; console.log('  ' + rot('FEHL') + ' ' + titel);
         if (detail) console.log('       ' + rot(detail));
         fehlerliste.push(titel + (detail ? ' -- ' + detail : '')); }
}

// ---------------------------------------------------------- 1. Rechenwerte
async function pruefeGruppen(seite) {
  for (const g of GRUPPEN) {
    if (filter && !(g.titel + ' ' + g.datei).toLowerCase().includes(filter.toLowerCase())) continue;
    console.log('\n' + g.titel + grau('   (' + g.datei + ')'));
    for (const f of g.faelle) {
      await oeffne(seite, g.datei);
      if (g.vor)  await seite.evaluate(a => { try { eval(a); } catch (e) {} }, g.vor);
      if (f.vor)  await seite.evaluate(a => { try { eval(a); } catch (e) {} }, f.vor);
      const r = await stelleEin(seite, f.werte || {}, f.ruf);
      if (typeof r === 'string' && r.startsWith('__')) { melde(false, f.name, r); continue; }
      if (g.nach) await seite.evaluate(a => { try { eval(a); } catch (e) {} }, g.nach);
      await seite.waitForTimeout(60);

      const abweichungen = [];
      for (const id in (f.soll || {})) {
        const ist = await text(seite, id);
        if (ist !== f.soll[id]) abweichungen.push(id + ': soll "' + f.soll[id] + '", ist "' + ist + '"');
      }
      for (const id in (f.enthaelt || {})) {
        const ist = await text(seite, id);
        if (!ist.toLowerCase().includes(f.enthaelt[id].toLowerCase()))
          abweichungen.push(id + ': erwartet "' + f.enthaelt[id] + '" darin, ist "' + ist.slice(0, 60) + '"');
      }
      melde(abweichungen.length === 0, f.name, abweichungen.join(' | '));
    }
  }
}

// ------------------------------------------- 2. Kein NaN, kein Infinity
// Jedes Zahlenfeld leer, dann 0, dann negativ. In keinem Ergebnisfeld darf
// danach NaN, Infinity oder undefined stehen. Das war frueher in zwoelf
// Rechenwegen der Fall.
const NAN_PRUEFUNG = [
  ['Bau_Rechner.html', 'calcConcrete()', ['res_c_vol','res_c_wgt']],
  ['Bau_Rechner.html', 'calcSteel()', ['res_s_gpm','res_s_total']],
  ['Bau_Rechner.html', 'calcRebar()', ['res_r_total']],
  ['Electrical_Toolbox.html', 'calcGeneral()', ['gen_res_txt']],
  ['Electrical_Toolbox.html', 'calcMotor()', ['mot_res_i','mot_res_s']],
  ['Electrical_Toolbox.html', 'calcPFC()', ['pfc_res_val','pfc_steps']],
  ['Electrical_Toolbox.html', 'calcDrop()', ['vd_res_val']],
  ['Load.html', 'calcTrafo()', ['tr_res_size','tr_det_s','tr_det_i','tr_det_u']],
  ['Load.html', 'calcMotor()', ['mo_res_i','mo_det_s','mo_det_dol','mo_det_sd',
                               'mo_det_ueberlast','mo_det_fuse','mo_det_fuse_sd',
                               'mo_det_fuse_am']],
  ['Load.html', 'calcHeater()', ['he_res_p','he_det_q','he_det_i3']],
  ['Lighting_CAD.html', 'calculateLighting()', ['resK','resUF','resFlux','resN','resPower','resActualLux']],
  ['Regelventil.html', 'calculate()', ['resKv','resCv']],
  ['MSR_Loop_Check_Skalierung.html', 'calcRTD()', ['rtdResult']],
  ['MSR_Loop_Check_Skalierung.html', 'doConvert()', ['convResult']],
];
// Nur die JS-Werte, und zwar als ganze Woerter und Gross-/Kleinschreibung
// beachtend. "null" als deutsches Wort steht voellig zu Recht in Meldungen
// wie "muessen ueber null liegen" und ist kein Fehler.
const SCHLECHT = /\bNaN\b|\bInfinity\b|\bundefined\b/;

async function pruefeNaN(seite) {
  if (filter && !'nan eingabe'.includes(filter.toLowerCase())) return;
  console.log('\nKein NaN im Ergebnisfeld' + grau('   (leer / 0 / negativ)'));
  for (const [datei, ruf, felder] of NAN_PRUEFUNG) {
    const treffer = [];
    for (const modus of ['leer', 'null', 'negativ']) {
      await oeffne(seite, datei);
      const r = await seite.evaluate(({ m, a, f }) => {
        document.querySelectorAll('input[type=number]').forEach(e => {
          if (e.readOnly || e.disabled) return;
          e.value = m === 'leer' ? '' : m === 'null' ? '0' : '-5';
        });
        try { eval(a); } catch (e) { /* 3D oder Diagramm darf ausfallen */ }
        const o = {};
        f.forEach(i => { const el = document.getElementById(i); o[i] = el ? (el.textContent || '').trim() : '__FEHLT__'; });
        return o;
      }, { m: modus, a: ruf, f: felder });
      for (const id in r) {
        if (SCHLECHT.test(r[id]) || r[id] === '__FEHLT__') treffer.push(modus + '/' + id + '="' + r[id] + '"');
      }
    }
    melde(treffer.length === 0, datei + '  ' + ruf, treffer.join(', '));
  }
}

// ------------------------------------------------- 3. Struktur aller Dateien
// Doppelte IDs und Handler, die auf keine Funktion zeigen. Letzteres faellt
// ohne Netz auch dann auf, wenn eine Bibliothek fehlt - deshalb steht unten
// die bekannte Luecke getrennt.
// Frueher standen hier sechs Werkzeuge, die ohne Netz funktionslos waren.
// Die Bibliotheken liegen jetzt unter bibliotheken/ im Projekt, damit ist die
// Liste leer. Sie bleibt stehen: wer wieder etwas von einem fremden Server
// holt, muesste es hier eintragen - und merkt dabei, was er tut.
const OHNE_NETZ_TOT = [];

async function pruefeStruktur(seite) {
  if (filter && !'struktur'.includes(filter.toLowerCase())) return;
  console.log('\nStruktur aller Dateien' + grau('   (doppelte IDs, tote Handler)'));
  const dateien = fs.readdirSync(WERKZEUGE).filter(d => d.endsWith('.html')).sort();
  const luecke = [];
  for (const datei of dateien) {
    await oeffne(seite, datei);
    const d = await seite.evaluate(() => {
      const zahl = {}, dopp = [];
      document.querySelectorAll('[id]').forEach(e => { zahl[e.id] = (zahl[e.id] || 0) + 1; });
      for (const k in zahl) if (zahl[k] > 1) dopp.push(k + ' (' + zahl[k] + 'x)');
      const tot = [], gesehen = new Set();
      document.querySelectorAll('[onclick],[onchange],[oninput]').forEach(el => {
        ['onclick','onchange','oninput'].forEach(a => {
          const v = el.getAttribute(a); if (!v) return;
          (v.match(/(^|[;\s{(])([A-Za-z_$][\w$]*)\s*\(/g) || []).forEach(m => {
            const n = m.match(/([A-Za-z_$][\w$]*)\s*\($/)[1];
            if (gesehen.has(n) || ['if','for','while','return','typeof'].includes(n)) return;
            gesehen.add(n);
            let typ; try { typ = eval('typeof ' + n); } catch (e) { typ = 'fehler'; }
            if (typ !== 'function') tot.push(n);
          });
        });
      });
      return { dopp, tot };
    }).catch(e => ({ dopp: [], tot: ['__EVAL__'] }));

    if (OHNE_NETZ_TOT.includes(datei)) {
      if (d.tot.length) luecke.push(datei + ': ' + d.tot.length + ' Funktionen');
      melde(d.dopp.length === 0, datei + grau('  (bekannte Luecke, siehe unten)'), d.dopp.join(', '));
    } else {
      const probleme = [];
      if (d.dopp.length) probleme.push('doppelte IDs: ' + d.dopp.join(', '));
      if (d.tot.length)  probleme.push('ohne Funktion: ' + d.tot.join(', '));
      melde(probleme.length === 0, datei, probleme.join(' | '));
    }
  }
  if (luecke.length) {
    console.log('\n' + gelb('  Bekannte Luecke, kein Fehler dieser Pruefung:'));
    console.log(grau('  Diese Werkzeuge holen ihre Bibliothek zur Laufzeit von einem oeffentlichen'));
    console.log(grau('  CDN. Ohne Netz bleiben ihre Knoepfe funktionslos. Siehe PRUEFBERICHT.md 1.1.'));
    luecke.forEach(z => console.log(grau('    ' + z)));
    console.log(grau('  Sobald die Bibliotheken lokal mitgeliefert werden, gehoeren die Dateien'));
    console.log(grau('  aus OHNE_NETZ_TOT in run.cjs heraus - dann prueft sich der Fortschritt selbst.'));
  }
}

// ------------------------------------------------------ 4. Die Verkaufsseite
// Die Seite ist Teil des Produkts, also wird sie mitgeprueft. Drei Dinge sind
// beim Bau schiefgegangen und duerfen nicht zurueckkommen:
//
// 1. Im Text stand 26, im Ordner lagen 27 Werkzeuge. Die Zahl kommt jetzt aus
//    den Daten; hier wird nachgezaehlt, ob das stimmt.
// 2. Eine Karte zeigte auf eine Datei, die es nicht gibt.
// 3. Ohne Datenbank blieb die Preisliste leer. Sie muss aus dem Fallback
//    kommen - ein Besucher darf nie vor einer leeren Seite stehen.
async function pruefeShop(seite) {
  if (filter && !'shop verkaufsseite'.includes(filter.toLowerCase())) return;
  console.log('\nVerkaufsseite' + grau('   (shop/index.html, ohne Datenbank)'));
  await oeffne(seite, path.join('shop', 'index.html'));
  await seite.waitForTimeout(400);

  const dateienImOrdner = fs.readdirSync(WERKZEUGE).filter(d => d.endsWith('.html')).length;
  const d = await seite.evaluate(() => ({
    karten:  document.querySelectorAll('#liste .wz').length,
    preise:  document.querySelectorAll('#preisliste .preis').length,
    verweise: [...document.querySelectorAll('#liste a[href]')]
                .map(a => a.getAttribute('href')).filter(h => h && !h.startsWith('#')),
    zahlen:  [...document.querySelectorAll('.anz')].map(e => e.textContent.trim()),
    // Alle Stellen, nicht nur die erste. Genau daran ist es vorbeigegangen:
    // im Aufmacher stand 87, waehrend weiter unten 218 stand, und die
    // Pruefung las nur die eine Stelle mit der Klasse.
    pruefzahlen: [...document.querySelectorAll('.pruefzahl')].map(e => e.textContent.trim()),
    preistext: (document.getElementById('preisliste') || {}).textContent || '',
    schlecht: /\bNaN\b|\bundefined\b|\[object Object\]/.test(document.body.innerText),
    platzhalter: (document.body.innerText.match(/\{\w+\}/g) || []),
  }));

  melde(d.karten === dateienImOrdner, 'jedes Werkzeug hat eine Karte',
        'Karten: ' + d.karten + ', Dateien im Ordner: ' + dateienImOrdner);

  const falsch = d.zahlen.filter(z => z !== String(d.karten));
  melde(falsch.length === 0, 'die genannte Anzahl stimmt mit den Karten ueberein',
        'abweichend: ' + falsch.join(', '));

  // Erst zaehlen, dann pruefen. Ohne die erste Zeile bestuende diese Pruefung
  // auch dann, wenn ueberhaupt kein Verweis da waere - so war sie zuerst.
  const ziele = new Set(d.verweise.map(h => decodeURI(h)));
  melde(ziele.size === dateienImOrdner, 'jedes Werkzeug ist verlinkt',
        'verschiedene Ziele: ' + ziele.size + ', Werkzeuge: ' + dateienImOrdner);

  const tot = [...ziele].filter(
    h => !fs.existsSync(path.join(WERKZEUGE, 'shop', h)));
  melde(tot.length === 0, 'kein Verweis zeigt ins Leere', tot.join(', '));

  // Die Seite wirbt mit der Zahl der Pruefungen. Diese Pruefung hier weiss,
  // wie viele es wirklich sind - also wird die Zahl auf der Seite dagegen
  // gehalten, statt sie von Hand nachzufuehren.
  //
  // Alle Stellen muessen dieselbe Zahl nennen. Vorher wurde nur die erste
  // gelesen, und im Aufmacher stand darum monatelang 87 statt 218.
  const einig = d.pruefzahlen.length > 0
    && d.pruefzahlen.every(z => z === d.pruefzahlen[0]);
  melde(einig, 'alle Stellen nennen dieselbe Zahl der Pruefungen',
        'gefunden: ' + d.pruefzahlen.join(', '));
  behaupteteZahl = parseInt(d.pruefzahlen[0], 10);

  melde(d.preise === 3, 'Preise auch ohne Datenbank sichtbar', 'gefunden: ' + d.preise);
  melde(!d.schlecht, 'kein NaN oder undefined im Seitentext');

  // Der Text der Plaene kommt aus der Datenbank und traegt dort {anzahl}
  // statt einer festen Zahl. Wird das nicht ersetzt, steht die geschweifte
  // Klammer auf der Verkaufsseite.
  melde(d.platzhalter.length === 0, 'kein unersetzter Platzhalter im Text',
        d.platzhalter.join(', '));
  melde(new RegExp('Alle ' + d.karten + ' Werkzeuge').test(d.preistext),
        'Preiskarten nennen die richtige Anzahl',
        d.preistext.replace(/\s+/g, ' ').slice(0, 80));

  // Der Weg zu den Werkzeugen haengt davon ab, unter welcher Adresse die Seite
  // steht. Vier Formen kommen vor; die dritte entsteht durch cleanUrls auf
  // Vercel und hat keinen Schraegstrich am Ende. Alle vier muessen bei
  // derselben Datei landen.
  const adressen = [
    ['/ingenieur-werkzeuge/shop/index.html', '/ingenieur-werkzeuge/Load.html'],
    ['/ingenieur-werkzeuge/shop/',           '/ingenieur-werkzeuge/Load.html'],
    ['/ingenieur-werkzeuge/shop',            '/ingenieur-werkzeuge/Load.html'],
    ['/index.html',                          '/Load.html'],
  ];
  const daneben = [];
  for (const [pfad, soll] of adressen) {
    const ist = await seite.evaluate(p => {
      const pfx = p.replace(/[^/]*$/, '').endsWith('/shop/') ? '../' : '';
      return new URL(pfx + 'Load.html', 'https://x' + p).pathname;
    }, pfad);
    if (ist !== soll) daneben.push(pfad + ' -> ' + ist + ', erwartet ' + soll);
  }
  melde(daneben.length === 0, 'Weg zum Werkzeug stimmt unter jeder Adressform',
        daneben.join(' | '));

  // Dieselbe Seite unter der Adresse, die im Netz wirklich entsteht: ohne
  // .html und ohne Schraegstrich am Ende. Dort zaehlt fuer den Browser der
  // Elternordner als Basis. Die Seite lud deshalb ihre Daten nicht und zeigte
  // kein einziges Werkzeug an - sichtbar war nur eine leere Seite.
  const gescheitert = [];
  const horcher = a => { if (a.status() >= 400) gescheitert.push(a.status() + ' ' + new URL(a.url()).pathname); };
  seite.on('response', horcher);
  await oeffne(seite, 'shop');
  await seite.waitForTimeout(700);
  seite.off('response', horcher);
  const ohneSchraegstrich = await seite.evaluate(() => ({
    karten: document.querySelectorAll('#liste .wz').length,
    daten:  typeof WERKZEUGE
  }));
  melde(ohneSchraegstrich.karten === dateienImOrdner && gescheitert.length === 0,
        'Seite laedt auch unter /shop ohne Schraegstrich',
        'Karten: ' + ohneSchraegstrich.karten + ', WERKZEUGE: ' + ohneSchraegstrich.daten +
        (gescheitert.length ? ', fehlgeschlagen: ' + gescheitert.join(', ') : ''));

  await oeffne(seite, path.join('shop', 'index.html'));
  await seite.waitForTimeout(400);

  // Formular ohne Datenbank: es darf nicht still haengenbleiben, sondern muss
  // die E-Mail-Adresse nennen.
  await seite.fill('#f_name', 'Pruefung');
  await seite.fill('#f_email', 'pruefung@example.de');
  await seite.click('#absenden');
  await seite.waitForTimeout(2200);
  const meldung = await text(seite, 'meldung');
  melde(/@/.test(meldung), 'Formular nennt bei Stoerung einen anderen Weg', meldung.slice(0, 70));
}

// -------------------------------------- 5. Sagen beide Werkzeuge dasselbe?
// Kabeldimensionierung und Cable_Manager fuehrten getrennte Tabellen fuer
// dieselbe Groesse und wichen 14 bis 26 Prozent voneinander ab. Jetzt teilen
// sie sich strombelastbarkeit.js. Diese Pruefung haelt das fest: legt jemand
// wieder eine eigene Tabelle an, faellt sie um.
async function pruefeKabeltabelle(seite) {
  if (filter && !'kabel tabelle strombelastbarkeit'.includes(filter.toLowerCase())) return;
  console.log('\nEine Tabelle fuer beide Werkzeuge' + grau('   (Strombelastbarkeit)'));

  // Nach Querschnitt sortieren, bevor verglichen wird. CABLE_DATA ist ein
  // Objekt, und JavaScript stellt dort ganzzahlige Schluessel nach vorn:
  // 4, 6, 10 ... kommen vor 1.5 und 2.5. Der Inhalt ist damit gleich, die
  // Reihenfolge nicht.
  const sortiert = l => l.sort((x, y) => x.q - y.q)
                         .map(e => e.q + ':' + e.iz).join(' ');

  await oeffne(seite, 'Kabeldimensionierung_Spannungsfall.html');
  const a = await seite.evaluate(() =>
    (typeof cableData === 'undefined') ? null
      : cableData.cu.map(c => ({ q: c.size, iz: c.imax })));

  await oeffne(seite, 'Cable_Manager.html');
  const b = await seite.evaluate(() =>
    (typeof CABLE_DATA === 'undefined') ? null
      : Object.entries(CABLE_DATA).map(([q, d]) => ({ q: +q, iz: d.amp })));

  const sa = a ? sortiert(a) : null;
  const sb = b ? sortiert(b) : null;
  melde(sa !== null && sb !== null && sa === sb,
        'beide Werkzeuge fuehren dieselbe Strombelastbarkeit',
        sa === sb ? '' : 'Kabeldimensionierung: ' + String(sa).slice(0, 90) +
                         ' | Cable_Manager: ' + String(sb).slice(0, 90));

  // Solange die Tabelle nicht gegen die Norm geprueft ist, muss der Hinweis
  // im Werkzeug stehen. Wird geprueft auf true gesetzt, ohne dass die Werte
  // wirklich geprueft sind, faellt das hier nicht auf - aber dann hat es
  // jemand bewusst getan, und das ist ein Unterschied.
  const g = await seite.evaluate(() =>
    (typeof STROMBELASTBARKEIT === 'undefined') ? null
      : { geprueft: STROMBELASTBARKEIT.GRUNDLAGE.geprueft,
          warnung: STROMBELASTBARKEIT.GRUNDLAGE.warnung || '' });
  melde(g !== null && (g.geprueft === true || g.warnung.includes('VDE 0298-4')),
        'ungeprueft heisst: der Hinweis nennt die Norm, die fehlt',
        JSON.stringify(g).slice(0, 110));
}

// ----------------------------------------------------- 6. Das Dashboard
// Das Dashboard ist der Einstieg: von ihm aus wird jedes Werkzeug geoeffnet,
// und jedes Werkzeug kommt mit dem Haus-Knopf hierher zurueck. Geht es
// kaputt, merkt man es an 27 Stellen.
//
// Geprueft wird, was beim Bauen wirklich schiefgehen kann:
//
// 1. Der Haus-Knopf war in allen 27 Dateien tot - er zeigte auf eine
//    file://-Adresse eines Windows-Netzlaufwerks. Kein Browser oeffnet das
//    aus einer https-Seite. Drei weitere Verweise zeigten auf Dateien, die
//    es nie gab.
// 2. Die Seite liegt wie der Shop in einem Unterordner und holt ihre Daten
//    von nebenan. Unter /dashboard ohne Schraegstrich zaehlt fuer den
//    Browser der Elternordner als Basis - genau daran ist der Shop schon
//    einmal leer geblieben.
// 3. Alle 27 Werkzeuge muessen auftauchen, in den vier Abschnitten des
//    README, und jeder Verweis muss eine Datei treffen.
async function pruefeDashboard(seite) {
  if (filter && !'dashboard'.includes(filter.toLowerCase())) return;
  console.log('\nDashboard' + grau('   (dashboard/index.html)'));

  const dateienImOrdner = fs.readdirSync(WERKZEUGE).filter(d => d.endsWith('.html')).sort();

  // Erst der Haus-Knopf in den Werkzeugen selbst. Das ist der Grund, aus dem
  // es das Dashboard gibt, also wird es hier geprueft und nicht nebenbei.
  const ohneWeg = [], nochTot = [];
  for (const datei of dateienImOrdner) {
    const roh = fs.readFileSync(path.join(WERKZEUGE, datei), 'utf8');
    if (/file:\/\/\/[A-Za-z]:/.test(roh)) nochTot.push(datei);
    if (!roh.includes('dashboard/')) ohneWeg.push(datei);
  }
  melde(nochTot.length === 0, 'kein Werkzeug zeigt mehr auf ein Netzlaufwerk', nochTot.join(', '));
  melde(ohneWeg.length === 0,
        'alle ' + dateienImOrdner.length + ' Werkzeuge verweisen auf das Dashboard',
        ohneWeg.join(', '));

  // Verweise auf Dateien, die es nie gab. Sie standen in Load.html und in
  // Electrical_Toolbox.html.
  const erfunden = [];
  for (const datei of dateienImOrdner) {
    // Ohne die Skriptbloecke: dort steht ein href in einem Suchmuster und
    // ist kein Verweis. Genau daran ist diese Pruefung zuerst falsch rot
    // geworden.
    const roh = fs.readFileSync(path.join(WERKZEUGE, datei), 'utf8')
                  .replace(/<script[\s\S]*?<\/script>/gi, '');
    (roh.match(/href="([^"#:?]+\.html)"/g) || []).forEach(m => {
      const ziel = decodeURI(m.slice(6, -1));
      if (!fs.existsSync(path.join(WERKZEUGE, ziel))) erfunden.push(datei + ' -> ' + ziel);
    });
  }
  melde(erfunden.length === 0, 'kein Werkzeug verweist auf eine Datei, die es nicht gibt',
        erfunden.join(', '));

  // Jetzt die Seite selbst.
  await oeffne(seite, path.join('dashboard', 'index.html'));
  await seite.waitForTimeout(400);

  const d = await seite.evaluate(() => ({
    karten:    document.querySelectorAll('#liste .wz').length,
    abschnitte: [...document.querySelectorAll('.gruppe h2')].map(h => h.firstChild.textContent.trim()),
    verweise:  [...document.querySelectorAll('#liste .wz[href]')].map(a => a.getAttribute('href')),
    gesamt:    (document.getElementById('gesamt') || {}).textContent || '',
    schlecht:  /\bNaN\b|\bundefined\b|\[object Object\]/.test(document.body.innerText),
  }));

  melde(d.karten === dateienImOrdner.length, 'jedes Werkzeug hat eine Karte',
        'Karten: ' + d.karten + ', Dateien im Ordner: ' + dateienImOrdner.length);
  melde(d.gesamt === String(dateienImOrdner.length), 'die genannte Anzahl stimmt',
        'Seite: ' + d.gesamt + ', Dateien: ' + dateienImOrdner.length);
  melde(d.abschnitte.length === 4, 'die vier Abschnitte des README stehen da',
        d.abschnitte.join(' | '));
  melde(!d.schlecht, 'kein NaN oder undefined im Seitentext');

  const tot = [...new Set(d.verweise.map(h => decodeURI(h)))]
                .filter(h => !fs.existsSync(path.join(WERKZEUGE, 'dashboard', h)));
  melde(tot.length === 0, 'kein Verweis zeigt ins Leere', tot.join(', '));

  // Die Suche. Sie ist der Grund, warum jemand das Dashboard statt des
  // Ordners oeffnet, also wird sie benutzt und nicht nur angesehen.
  const gesucht = await seite.evaluate(() => {
    const feld = document.getElementById('suche');
    const setze = (t) => {
      feld.value = t;
      feld.dispatchEvent(new Event('input', { bubbles: true }));
      return document.querySelectorAll('#liste .wz').length;
    };
    return {
      erdung:  setze('Erdung'),
      zweiWoerter: setze('kabel trasse'),
      unsinn:  setze('xyzquark'),
      leer:    setze(''),
    };
  });
  melde(gesucht.erdung >= 1 && gesucht.erdung < 27, 'Suche grenzt ein',
        '"Erdung" ergibt ' + gesucht.erdung + ' Karten');
  melde(gesucht.zweiWoerter >= 1 && gesucht.zweiWoerter <= gesucht.erdung + 5,
        'zwei Begriffe verlangen beide, nicht einen',
        '"kabel trasse" ergibt ' + gesucht.zweiWoerter + ' Karten');
  melde(gesucht.unsinn === 0, 'ohne Treffer bleibt keine Karte stehen',
        'gefunden: ' + gesucht.unsinn);
  melde(gesucht.leer === dateienImOrdner.length, 'geleerte Suche zeigt wieder alle',
        'gefunden: ' + gesucht.leer);

  // Dieselbe Seite unter der Adresse, die auf Vercel wirklich entsteht:
  // ohne .html und ohne Schraegstrich am Ende. Der Shop war genau so einmal
  // leer.
  const gescheitert = [];
  const horcher = a => { if (a.status() >= 400) gescheitert.push(a.status() + ' ' + new URL(a.url()).pathname); };
  seite.on('response', horcher);
  await oeffne(seite, 'dashboard');
  await seite.waitForTimeout(700);
  seite.off('response', horcher);
  const ohneSchraegstrich = await seite.evaluate(() => ({
    karten: document.querySelectorAll('#liste .wz').length,
    erster: (document.querySelector('#liste .wz') || {}).getAttribute
              ? document.querySelector('#liste .wz').getAttribute('href') : '',
  }));
  melde(ohneSchraegstrich.karten === dateienImOrdner.length && gescheitert.length === 0,
        'Seite laedt auch unter /dashboard ohne Schraegstrich',
        'Karten: ' + ohneSchraegstrich.karten +
        (gescheitert.length ? ', fehlgeschlagen: ' + gescheitert.join(', ') : ''));

  // Der Weg zum Werkzeug haengt an der Adressform. Vier Formen kommen vor;
  // alle vier muessen bei derselben Datei landen.
  const adressen = [
    ['/ingenieur-werkzeuge/dashboard/index.html', '/ingenieur-werkzeuge/Load.html'],
    ['/ingenieur-werkzeuge/dashboard/',           '/ingenieur-werkzeuge/Load.html'],
    ['/ingenieur-werkzeuge/dashboard',            '/ingenieur-werkzeuge/Load.html'],
    ['/index.html',                               '/Load.html'],
  ];
  const daneben = [];
  for (const [pfad, soll] of adressen) {
    const ist = await seite.evaluate(p => {
      const ordner = p.replace(/[^/]*$/, '');
      const pfx = ordner.endsWith('/dashboard/') ? '../' : '';
      return new URL(pfx + 'Load.html', 'https://x' + p).pathname;
    }, pfad);
    if (ist !== soll) daneben.push(pfad + ' -> ' + ist + ', erwartet ' + soll);
  }
  melde(daneben.length === 0, 'Weg zum Werkzeug stimmt unter jeder Adressform',
        daneben.join(' | '));

  // Der Schluessel fuer das Sprachmodell darf nicht in der Seite stehen.
  // Das ist der teuerste denkbare Fehler dieser Aenderung, deshalb sucht die
  // Pruefung ausdruecklich danach.
  const quelltext = fs.readFileSync(path.join(WERKZEUGE, 'dashboard', 'index.html'), 'utf8');
  const verraeter = [/sk-ant-/, /AIzaSy/, /service_role/, /\bsb_secret_/]
                      .filter(r => r.test(quelltext)).map(String);
  melde(verraeter.length === 0, 'kein geheimer Schluessel im Quelltext der Seite',
        verraeter.join(', '));
}

// ------------------------- 7. Kennt die Edge Function dieselben Werkzeuge?
// Der Werkzeugkatalog liegt zweimal: einmal fuer die Seiten in
// shop/werkzeuge.js, einmal fuer das Sprachmodell in der Edge Function.
// Zwei Listen fuer dieselbe Sache sind in diesem Projekt schon einmal
// auseinandergelaufen (die Strombelastbarkeit, 14 bis 26 Prozent). Diese
// Pruefung haelt sie zusammen: wer ein Werkzeug hinzufuegt und den Katalog
// vergisst, bekommt hier eine rote Zeile, statt dass das Modell das neue
// Werkzeug nie vorschlaegt.
function pruefeKatalog() {
  if (filter && !'katalog assistent'.includes(filter.toLowerCase())) return;
  console.log('\nEin Katalog fuer Seite und Modell' + grau('   (werkzeug-assistent)'));

  const katalogDatei = edgeDatei('werkzeug-assistent', 'katalog.ts');
  if (!fs.existsSync(katalogDatei)) {
    melde(false, 'Katalog der Edge Function gefunden', katalogDatei);
    return;
  }

  // shop/werkzeuge.js ist ein klassisches Skript. Auswerten statt raten.
  const quelle = fs.readFileSync(path.join(WERKZEUGE, 'shop', 'werkzeuge.js'), 'utf8');
  const { WERKZEUGE: liste } = new Function(quelle + '; return { WERKZEUGE };')();

  const roh = fs.readFileSync(katalogDatei, 'utf8');
  const imKatalog = [...roh.matchAll(/\{\s*id:\s*"([^"]+)"\s*,\s*name:\s*"((?:[^"\\]|\\.)*)"/g)]
                      .map(m => ({ id: m[1], name: m[2].replace(/\\"/g, '"') }));

  const alsZeile = l => l.map(w => w.id + '=' + w.name).sort().join(' | ');
  melde(alsZeile(imKatalog) === alsZeile(liste),
        'Edge Function und Verkaufsseite kennen dieselben Werkzeuge',
        'Katalog: ' + imKatalog.length + ', Seite: ' + liste.length +
        ' | nur im Katalog: ' +
        (imKatalog.filter(a => !liste.some(b => b.id === a.id && b.name === a.name))
                  .map(a => a.id).join(',') || '-') +
        ' | nur auf der Seite: ' +
        (liste.filter(b => !imKatalog.some(a => a.id === b.id && a.name === b.name))
              .map(b => b.id).join(',') || '-'));
}

// ------------------------------------------------- 8. Der KI-Helfer
// Der Helfer haengt jetzt in vierzehn Werkzeugen. Geprueft wird das, was
// dabei wirklich schiefgehen kann:
//
// 1. Ein Schluessel im Quelltext. Das ist der teuerste denkbare Fehler:
//    jedes dieser Werkzeuge ist eine statische Seite, die jeder lesen kann.
// 2. Der Helfer schickt die Ergebnisse des Werkzeugs mit. Kommen sie nicht
//    an, fragt das Modell ueber nichts - und es kostet trotzdem.
// 3. Die Betriebsart muss eine sein, die die Edge Function kennt. Ein
//    Tippfehler im Modus faellt sonst erst beim Benutzer auf.
// 4. Ohne Netz darf der Helfer das Werkzeug nicht mitreissen. Die Rechnung
//    muss ohne ihn weiterlaufen - das ist der ganze Sinn der Trennung.
const KI_WERKZEUGE = [
  // Datei, Modus, eine Rechnung, ein Feld das danach ankommen muss
  ['Regelventil.html', 'deutung', 'calculate()', 'Kv'],
  ['Load.html', 'deutung', 'calcTrafo()', 'Trafogroesse'],
  ['Lighting_CAD.html', 'deutung', 'calculateLighting()', 'Anzahl Leuchten'],
  ['Electrical_Toolbox.html', 'deutung', 'calcDrop()', 'Spannungsfall'],
  ['Earthing_CADE.html', 'deutung', null, 'Erdungswiderstand'],
  ['Kabeldimensionierung_Spannungsfall.html', 'deutung', null, null],
  ['Druckverlustberechnung.html', 'deutung', null, null],
  ['Kabelterasse_Rechner.html', 'deutung', null, null],
  ['Petrochem_Hydraulic_Analysis.html', 'deutung', null, null],
  ['Hydrocyclone.html', 'deutung', null, null],
  ['Cable_Manager.html', 'deutung', null, null],
  ['Visueller_Kabeltrassen_CAD.html', 'deutung', null, null],
  ['Instrument_Selector.html', 'auswahl', null, null],
  ['Brandschutz_Master_Global_Framework.html', 'norm', null, null],
];

async function pruefeKiHelfer(seite) {
  if (filter && !'ki helfer'.includes(filter.toLowerCase())) return;
  console.log('\nDer KI-Helfer' + grau('   (ki-helfer.js in ' + KI_WERKZEUGE.length + ' Werkzeugen)'));

  // Kein Schluessel, nirgends. Auch im Helfer selbst nicht.
  const verdaechtig = [/sk-ant-/, /AIzaSy/, /service_role/, /\bsb_secret_/];
  const mitSchluessel = [];
  const dateien = fs.readdirSync(WERKZEUGE).filter(d => d.endsWith('.html'));
  for (const datei of dateien.concat(['ki-helfer.js'])) {
    const roh = fs.readFileSync(path.join(WERKZEUGE, datei), 'utf8');
    if (verdaechtig.some(r => r.test(roh))) mitSchluessel.push(datei);
  }
  melde(mitSchluessel.length === 0, 'kein geheimer Schluessel in Werkzeug oder Helfer',
        mitSchluessel.join(', '));

  // Die Betriebsarten, die die Edge Function kennt. Steht in einem Werkzeug
  // ein anderer Modus, faellt das hier auf und nicht beim Benutzer.
  const modiDatei = edgeDatei('werkzeug-assistent', 'modi.ts');
  const bekannt = (fs.readFileSync(modiDatei, 'utf8')
    .match(/export const MODI[^=]*=\s*\[([^\]]*)\]/) || [, ''])[1]
    .match(/"([a-z]+)"/g) || [];
  const bekannteModi = bekannt.map(m => m.replace(/"/g, ''));

  const falscherModus = [];
  for (const [datei, modus] of KI_WERKZEUGE) {
    const roh = fs.readFileSync(path.join(WERKZEUGE, datei), 'utf8');
    const m = (roh.match(/modus:\s*"([a-z]+)"/) || [])[1];
    if (m !== modus || !bekannteModi.includes(m)) {
      falscherModus.push(datei + ': "' + m + '"');
    }
  }
  melde(falscherModus.length === 0,
        'jede Betriebsart ist eine, die die Edge Function kennt',
        'bekannt: ' + bekannteModi.join(',') + ' | abweichend: ' + falscherModus.join(', '));

  // Jetzt im Browser. Der Knopf muss da sein, das Feld sich oeffnen, und die
  // Daten muessen das enthalten, was das Werkzeug ausgerechnet hat.
  const ohneKnopf = [], ohneDaten = [], kaputt = [], falschesThema = [];
  for (const [datei, modus, rechnung, sollFeld] of KI_WERKZEUGE) {
    await oeffne(seite, datei);
    if (rechnung) {
      await seite.evaluate(a => { try { eval(a); } catch (e) {} }, rechnung);
      await seite.waitForTimeout(80);
    }
    const d = await seite.evaluate(() => {
      const knopf = document.querySelector('.kih-knopf');
      if (!knopf) return { knopf: false };
      knopf.click();                                  // Feld aufklappen
      const feld = document.querySelector('.kih-feld');
      const griff = window.KI_HELFER && window.KI_HELFER.letzter;
      let daten = null;
      try { daten = griff ? griff.daten() : null; } catch (e) { return { fehler: String(e) }; }
      return {
        knopf: true,
        offen: !!feld && feld.style.display !== 'none',
        modus: griff ? griff.modus : '',
        schluessel: daten ? Object.keys(daten) : [],
        // Passt sich das Feld der Helligkeit des Werkzeugs an? Alle
        // vierzehn sind dunkel; ein weisses Feld darauf blendet.
        dunkelSeite: (function () {
          var m = getComputedStyle(document.body).backgroundColor
                    .match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          return m ? (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255 < 0.5 : false;
        })(),
        dunkelFeld: !!feld && feld.classList.contains('kih-dunkel'),
      };
    });

    if (d.fehler) { kaputt.push(datei + ': ' + d.fehler); continue; }
    if (!d.knopf || !d.offen) { ohneKnopf.push(datei); continue; }
    if (d.modus !== modus) { kaputt.push(datei + ': Modus "' + d.modus + '"'); continue; }
    // Etwas muss ankommen, sonst fragt das Modell ueber nichts.
    if (!d.schluessel.length) { ohneDaten.push(datei + ' (leer)'); continue; }
    if (sollFeld && !d.schluessel.includes(sollFeld)) {
      ohneDaten.push(datei + ' (ohne "' + sollFeld + '", hat: ' +
                     d.schluessel.slice(0, 6).join(', ') + ')');
    }
    if (d.dunkelSeite !== d.dunkelFeld) {
      falschesThema.push(datei + (d.dunkelSeite ? ' (dunkel, Feld hell)' : ' (hell, Feld dunkel)'));
    }
  }
  melde(ohneKnopf.length === 0, 'in jedem Werkzeug oeffnet sich der Helfer',
        ohneKnopf.join(', '));
  melde(kaputt.length === 0, 'der Helfer laeuft ohne Ausnahme', kaputt.join(' | '));
  melde(ohneDaten.length === 0, 'das Ergebnis des Werkzeugs kommt beim Helfer an',
        ohneDaten.join(' | '));
  melde(falschesThema.length === 0,
        'das Feld passt sich der Helligkeit des Werkzeugs an',
        falschesThema.join(', '));

  // Ohne Netz: der Helfer muss das sagen und darf das Werkzeug nicht
  // mitreissen. Das Netz ist in dieser Pruefung ohnehin abgeschaltet, also
  // ist das der echte Fall und keine Nachstellung.
  await oeffne(seite, 'Regelventil.html');
  const ohneNetz = await seite.evaluate(async () => {
    document.querySelector('.kih-knopf').click();
    document.querySelector('.kih-feld textarea').value = 'Passt das so?';
    document.querySelector('.kih-senden').click();
    await new Promise(f => setTimeout(f, 1200));
    const vorher = (document.getElementById('resKv') || {}).textContent;
    try { calculate(); } catch (e) { return { rechnetNoch: false }; }
    return {
      meldung: (document.querySelector('.kih-antwort') || {}).textContent || '',
      rechnetNoch: (document.getElementById('resKv') || {}).textContent !== undefined,
      kvVorher: vorher,
    };
  });
  melde(/Verbindung|antwortet|verf/i.test(ohneNetz.meldung),
        'ohne Netz sagt der Helfer das, statt still zu bleiben',
        'Meldung: "' + String(ohneNetz.meldung).slice(0, 60) + '"');
  melde(ohneNetz.rechnetNoch === true,
        'das Werkzeug rechnet weiter, auch wenn der Dienst ausfaellt');
}

// ------------------------------------------------ 9. Ein Aussehen fuer alle
// Die 27 Werkzeuge sind einzeln entstanden. Gemessen am gerenderten
// Dokument waren es vorher 11 Hintergruende, 11 Gruentoene, 6 Eckenradien
// und zwei Schriftfamilien - jedes fuer sich in Ordnung, nebeneinander
// nach 27 Herkuenften aussehend.
//
// werkzeug-stil.css zieht das zusammen. Diese Pruefung haelt es fest:
// wer ein Werkzeug anfasst und dabei eine eigene Farbe einfuehrt, sieht es
// hier, nicht erst der Kunde.
//
// Gemessen wird am gerenderten Dokument und nicht am CSS-Text: eine Regel,
// die von einer anderen ueberschrieben wird, stuende sonst als Tatsache da.
async function pruefeAussehen(seite) {
  if (filter && !'aussehen stil optik'.includes(filter.toLowerCase())) return;
  console.log('\nEin Aussehen fuer alle' + grau('   (werkzeug-stil.css)'));

  const dateien = fs.readdirSync(WERKZEUGE).filter(d => d.endsWith('.html')).sort();

  const ohneStil = dateien.filter(d =>
    !fs.readFileSync(path.join(WERKZEUGE, d), 'utf8').includes('werkzeug-stil.css'));
  melde(ohneStil.length === 0, 'jedes Werkzeug laedt den gemeinsamen Stil',
        ohneStil.join(', '));

  /* Die Maus aus dem Weg. Sie steht noch dort, wo die Verkaufsseite zuletzt
     wirklich geklickt hat, und traf auf einer anderen Seite den Hauptknopf -
     gemessen wurde dann dessen Hover-Farbe (rgb(5,150,105) statt
     rgb(16,185,129)). Mit Filter lief die Verkaufsseite nicht mit, also war
     die Pruefung einzeln gruen und im vollen Lauf rot. */
  await seite.mouse.move(0, 0);

  const gemessen = [];
  for (const datei of dateien) {
    await oeffne(seite, datei);
    gemessen.push(await seite.evaluate(() => {
      /* Erst die Uebergaenge abschalten, dann messen.
         Mehrere Werkzeuge haben transition auf ihren Knoepfen. Wer waehrend
         eines Uebergangs misst, liest einen Zwischenwert - hier war das
         einmal rgb(7,157,110) auf dem Weg nach rgb(16,185,129), und die
         Pruefung wurde je nach Laufzeit mal rot und mal gruen. Eine
         Pruefung, die wuerfelt, ist schlimmer als keine. */
      const aus = document.createElement('style');
      aus.textContent = '*,*::before,*::after{transition:none !important;' +
                        'animation:none !important}';
      document.head.appendChild(aus);
      void document.body.offsetWidth;          // Umbruch erzwingen
      const cs = getComputedStyle(document.body);
      const feld = document.querySelector('input[type=number], input[type=text], select');
      const haupt = document.querySelector(
        '.btn-calc, .btn-primary, .btn-main, .primary, button.calc, ' +
        'button[class*="calc"], button[class*="primary"], button[class*="berechn"]');
      // Alle deckenden Gruentoene der Knoepfe: mehrere fast gleiche Gruen
      // sind das, was schlampig aussieht.
      const gruen = new Set();
      document.querySelectorAll('button, .btn, [class*=btn]').forEach(el => {
        const m = getComputedStyle(el).backgroundColor
                    .match(/rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/);
        if (!m) return;
        const [r, g, b] = [+m[1], +m[2], +m[3]];
        const a = m[4] === undefined ? 1 : +m[4];
        if (a > 0.7 && g > 90 && g > r * 1.3 && g > b * 1.15) gruen.add(m[0]);
      });
      return {
        schrift: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
        grund:   cs.backgroundColor,
        text:    cs.color,
        feldBg:     feld  ? getComputedStyle(feld).backgroundColor : null,
        feldRadius: feld  ? getComputedStyle(feld).borderRadius : null,
        hauptBg:     haupt ? getComputedStyle(haupt).backgroundColor : null,
        hauptRadius: haupt ? getComputedStyle(haupt).borderRadius : null,
        gruen: [...gruen],
      };
    }));
  }

  // Ein Wert, der ueberall gleich sein muss. null heisst "gibt es hier
  // nicht" und zaehlt nicht als Abweichung: Loop_CAD und Loop_Library sind
  // Zeichenwerkzeuge ohne ein einziges Eingabefeld.
  const einig = (schl, soll) => {
    const daneben = [];
    gemessen.forEach((m, i) => {
      if (m[schl] === null) return;
      if (m[schl] !== soll) daneben.push(dateien[i] + ': ' + m[schl]);
    });
    return daneben;
  };

  const proben = [
    ['schrift',     '-apple-system',      'dieselbe Schrift'],
    ['grund',       'rgb(15, 23, 42)',    'dieselbe Grundflaeche'],
    ['text',        'rgb(226, 232, 240)', 'dieselbe Textfarbe'],
    ['feldBg',      'rgb(34, 48, 71)',    'dieselben Eingabefelder'],
    ['feldRadius',  '6px',                'dieselben Ecken an den Feldern'],
    ['hauptBg',     'rgb(16, 185, 129)',  'dieselbe Farbe am Hauptknopf'],
    ['hauptRadius', '10px',               'dieselben Ecken am Hauptknopf'],
  ];
  for (const [schl, soll, titel] of proben) {
    const daneben = einig(schl, soll);
    melde(daneben.length === 0, titel + grau('  (' + soll + ')'), daneben.join(' | '));
  }

  // Die Gruentoene. Zwei Knoepfe in Trasse_CAD sind absichtlich anders: ihre
  // Farbe ist dieselbe, in der das Teil danach gezeichnet wird. Wer die
  // gruen macht, hat ein einheitliches Bild und ein schlechteres Werkzeug.
  const ERLAUBT = new Set(['rgb(16, 185, 129)', 'rgb(46, 213, 115)', 'rgb(26, 188, 156)']);
  const fremd = [];
  gemessen.forEach((m, i) => {
    m.gruen.filter(g => !ERLAUBT.has(g)).forEach(g => fremd.push(dateien[i] + ': ' + g));
  });
  melde(fremd.length === 0, 'kein zusaetzlicher Gruenton', fremd.join(' | '));

  // Der schwebende Knopf des Helfers darf nichts zudecken. Zugedeckt heisst
  // nicht anklickbar, und das ist eine verlorene Funktion, kein
  // Schoenheitsfehler. In Instrument_Selector lag dort der Exportknopf.
  const verdeckt = [];
  for (const datei of dateien) {
    await oeffne(seite, datei);
    const r = await seite.evaluate(() => {
      const k = document.querySelector('.kih-knopf');
      if (!k) return [];
      const b = k.getBoundingClientRect();
      k.style.visibility = 'hidden';
      const treffer = new Set();
      [[b.left+4,b.top+4],[b.right-4,b.top+4],[b.left+4,b.bottom-4],[b.right-4,b.bottom-4]]
        .forEach(([x, y]) => {
          const el = document.elementFromPoint(x, y);
          const kl = el && el.closest &&
            el.closest('button, a[href], a[onclick], input, select, textarea, [onclick]');
          if (kl) treffer.add(kl.tagName.toLowerCase());
        });
      k.style.visibility = '';
      return [...treffer];
    });
    if (r.length) verdeckt.push(datei + ': ' + r.join(', '));
  }
  melde(verdeckt.length === 0, 'der schwebende Knopf deckt nichts Bedienbares zu',
        verdeckt.join(' | '));
}

// ------------------------- 10. Sagen beide Werkzeuge denselben Strom?
// Load und Cable_Manager rechnen denselben Motorstrom. Load tat das seit
// jeher richtig, Cable_Manager liess den Wirkungsgrad weg und kam 5 bis
// 10 Prozent zu niedrig heraus - und waehlte aus genau diesem Strom den
// Querschnitt. Zu klein ist beim Kabel die gefaehrliche Richtung.
//
// Dieselbe Bauart wie die Pruefung der Strombelastbarkeit weiter oben: legt
// jemand wieder eine eigene Rechnung an, faellt sie um.
async function pruefeMotorstrom(seite) {
  if (filter && !'motorstrom strom'.includes(filter.toLowerCase())) return;
  console.log('\nDenselben Motor, denselben Strom' +
              grau('   (Load, Cable_Manager, SLD_CAD)'));

  const faelle = [
    { kw: 30,  eta: 93.6, pf: 0.86, volt: 400 },
    { kw: 7.5, eta: 88.5, pf: 0.84, volt: 400 },
    { kw: 110, eta: 95.8, pf: 0.88, volt: 400 },
  ];

  for (const f of faelle) {
    await oeffne(seite, 'Load.html');
    const ausLoad = await seite.evaluate(f => {
      document.getElementById('mo_kw').value = f.kw;
      document.getElementById('mo_v').value = String(f.volt);
      document.getElementById('mo_eff').value = f.eta;
      document.getElementById('mo_pf').value = f.pf;
      calcMotor();
      return parseFloat((document.getElementById('mo_res_i').innerText || '').replace(',', '.'));
    }, f);

    await oeffne(seite, 'Cable_Manager.html');
    const ausCM = await seite.evaluate(f => {
      document.getElementById('kw').value = f.kw;
      document.getElementById('volt').value = String(f.volt);
      document.getElementById('eta').value = f.eta;
      document.getElementById('cosphi').value = f.pf;
      document.getElementById('vtyp').value = 'motor';
      document.getElementById('install').value = 'air';
      addCable();
      // Der zuletzt angelegte Eintrag traegt den gerechneten Strom.
      return cables.length ? parseFloat(cables[cables.length - 1].I) : null;
    }, f);

    // Der SLD-Generator rechnete denselben Motor ohne Wirkungsgrad und mit
    // fest eingebautem cos phi = 0,85. Fuer 45 kW kam er auf 76,4 A, wo die
    // beiden anderen 83,1 A nennen - acht Prozent, am selben Motor.
    await oeffne(seite, 'SLD_CAD.html');
    const ausSLD = await seite.evaluate(f => {
      const ab = feeders.find(x => x.type === 'motor');
      ab.power = f.kw; ab.volt = f.volt; ab.eta = f.eta; ab.cosphi = f.pf;
      return feederStrom(ab);
    }, f);

    const abw = (ausLoad && ausCM) ? Math.abs(ausLoad - ausCM) / ausLoad * 100 : 100;
    melde(abw < 0.6, f.kw + ' kW: beide Werkzeuge nennen denselben Strom',
          'Load: ' + ausLoad + ' A, Cable_Manager: ' + ausCM + ' A, Abweichung ' +
          abw.toFixed(1) + ' %');

    const abwSLD = (ausLoad && ausSLD) ? Math.abs(ausLoad - ausSLD) / ausLoad * 100 : 100;
    melde(abwSLD < 0.6, f.kw + ' kW: der SLD-Generator auch',
          'Load: ' + ausLoad + ' A, SLD: ' + ausSLD + ' A, Abweichung ' +
          abwSLD.toFixed(1) + ' %');
  }

  // Eine allgemeine Last traegt keinen Wirkungsgrad: die eingegebene
  // Leistung ist dort schon die elektrische.
  await oeffne(seite, 'Cable_Manager.html');
  const ohneEta = await seite.evaluate(() => {
    const setz = (typ) => {
      document.getElementById('kw').value = 30;
      document.getElementById('volt').value = '400';
      document.getElementById('eta').value = 90;
      document.getElementById('cosphi').value = 0.9;
      document.getElementById('vtyp').value = typ;
      document.getElementById('install').value = 'air';
      addCable();
      return parseFloat(cables[cables.length - 1].I);
    };
    return { motor: setz('motor'), last: setz('last') };
  });
  // 30 kW / 0,9 gegen 30 kW: der Motor muss rund 11 Prozent mehr ziehen.
  const verh = ohneEta.motor / ohneEta.last;
  melde(Math.abs(verh - 1 / 0.9) < 0.01,
        'die allgemeine Last rechnet ohne Wirkungsgrad',
        'Motor: ' + ohneEta.motor + ' A, Last: ' + ohneEta.last + ' A, Verhaeltnis ' +
        verh.toFixed(3) + ', erwartet ' + (1 / 0.9).toFixed(3));
}

// ------------------------------- 11. Der Taschenrechner fuehrt nichts aus
// Hier stand eval(currentInput) mit dem Kommentar "strictly for local tool
// usage". Das Werkzeug liegt im Netz, und wer eval() auf einer
// Benutzereingabe findet, liest nicht weiter.
//
// Geprueft wird beides: dass gueltige Ausdruecke weiterhin dasselbe ergeben
// wie frueher, und dass nichts durchkommt, was kein Ausdruck ist. Die erste
// Haelfte ist die wichtigere - eine Sicherheitsloesung, die den Rechner
// kaputt macht, wird wieder herausgenommen.
const RECHNER_GUELTIG = [
  ['1+2*3', 7], ['(1+2)*3', 9], ['10/4', 2.5], ['2**10', 1024],
  ['-5+3', -2], ['+7-2', 5], ['Math.sqrt(16)', 4], ['Math.sin(0)', 0],
  ['Math.cos(0)', 1], ['Math.PI', Math.PI], ['2*Math.PI', 2 * Math.PI],
  ['2**3**2', 512],                      // rechts gebunden, nicht 64
  ['-(4+6)', -10], ['.5+.25', 0.75],
  ['((2+3)*(4-1))/5', 3], ['Math.sin(Math.PI/2)', 1],
];
const RECHNER_BOESE = [
  'alert(1)', 'window.location', 'document.cookie', 'fetch("x")',
  '[].constructor', 'this', '1;2', 'a+1', 'Math.random()',
  '(function(){return 1})()', '1+', '((1)', 'Math.sqrt(', '"x"',
];

// ------------------------------------------------ Erdung: Bild gegen Zahl
//
// Das Erdungswerkzeug gibt zwei Dinge aus, die zusammengehoeren muessen:
// einen Widerstand und einen 3D-DXF, nach dem gebaut wird. Bei der
// umlaufenden Anordnung rechnete es mit rund vierzehn Staeben und zeichnete
// zwei. Wer nach dem Bild baut, misst hinterher einen anderen Wert als den
// versprochenen - und sucht den Fehler im Boden, nicht im Werkzeug.
//
// Dasselbe bei den Anschlussfahnen: das Feld nahm jede Zahl an, gezeichnet
// wurden immer drei.
//
// Geprueft wird an den Linien, die auch in den DXF gehen (meshLines mit
// ihrer Lage), nicht an der Anzeige.
async function pruefeErdungBild(seite) {
  if (filter && !'erdung earthing dxf staebe'.includes(filter.toLowerCase())) return;
  console.log('\nErdung, Bild und Zahl' + grau('   (Earthing_CADE)'));

  async function zaehle(werte) {
    await oeffne(seite, 'Earthing_CADE.html');
    await stelleEin(seite, werte, 'updateCalc()');
    return seite.evaluate(() => {
      // meshLines ist ein top-level let und haengt deshalb nicht am window;
      // der Name selbst ist sichtbar.
      const linien = (typeof meshLines !== 'undefined') ? meshLines : [];
      const z = (l) => linien.filter(m => m.layer === l).length;
      const L = parseFloat(document.getElementById('dimL').value);
      const W = parseFloat(document.getElementById('dimW').value);
      const art = document.getElementById('rodConfig').value;
      return {
        staebe: z('Earth_Rod'),
        fahnen: z('Earth_Riser'),
        soll: art === 'corners' ? 4
            : art === 'perimeter' ? Math.ceil(2 * (L + W) / 10) : 0,
        fahnenSoll: parseInt(document.getElementById('risers').value, 10)
      };
    });
  }

  const um = await zaehle({ dimL: '40', dimW: '25', gridSize: '10',
                            rodConfig: 'perimeter', rodLen: '3.0', rodDia: '20',
                            rodEta: '0.75', risers: '6' });
  melde(um.staebe === um.soll,
        'umlaufend: gezeichnet werden so viele Staebe, wie gerechnet wurden',
        'gezeichnet ' + um.staebe + ', gerechnet ' + um.soll);
  melde(um.fahnen === um.fahnenSoll,
        'und so viele Anschlussfahnen, wie eingegeben sind',
        'gezeichnet ' + um.fahnen + ', eingegeben ' + um.fahnenSoll);

  const ecken = await zaehle({ dimL: '40', dimW: '25', gridSize: '10',
                               rodConfig: 'corners', rodLen: '3.0', rodDia: '20',
                               rodEta: '0.75', risers: '12' });
  melde(ecken.staebe === 4, 'Eckstaebe: vier, nicht mehr und nicht weniger',
        'gezeichnet: ' + ecken.staebe);
  melde(ecken.fahnen === 12, 'zwoelf Fahnen bleiben zwoelf',
        'gezeichnet: ' + ecken.fahnen);

  // Jede Fahne und jeder Stab muss auf dem Umfang liegen. Sonst stimmt die
  // Zahl zwar, aber die Punkte stehen irgendwo im Feld.
  const daneben = await seite.evaluate(() => {
    const L = parseFloat(document.getElementById('dimL').value);
    const W = parseFloat(document.getElementById('dimW').value);
    const aufRand = (m) =>
      Math.abs(Math.abs(m.x1) - L / 2) < 1e-6 || Math.abs(Math.abs(m.z1) - W / 2) < 1e-6;
    const linien = (typeof meshLines !== 'undefined') ? meshLines : [];
    return linien
      .filter(m => m.layer === 'Earth_Rod' || m.layer === 'Earth_Riser')
      .filter(m => !aufRand(m)).length;
  });
  melde(daneben === 0, 'alle Staebe und Fahnen liegen auf dem Umfang',
        'daneben: ' + daneben);
}

// ------------------------------------------- Bewehrungsliste: herausnehmen
//
// Der Bewehrungs-Reiter zaehlte nur hoch. Wer sich bei der Stueckzahl
// vertippt hatte, konnte die Zeile nicht mehr herausnehmen - Seite neu
// laden und die ganze Liste noch einmal eingeben. Die Spalte ganz rechts
// sah nach Bedienung aus und trug ein Haekchen.
//
// Jetzt kommen Tabelle und Summe beide aus derselben Liste. Geprueft wird
// genau das: dass sie nicht auseinanderlaufen.
async function pruefeBewehrungsliste(seite) {
  if (filter && !'bewehrung bau liste'.includes(filter.toLowerCase())) return;
  console.log('\nBewehrungsliste' + grau('   (Bau_Rechner)'));

  await oeffne(seite, 'Bau_Rechner.html');
  const eintragen = (d, l, n) => seite.evaluate((w) => {
    document.getElementById('r_diam').value = w.d;
    document.getElementById('r_len').value = w.l;
    document.getElementById('r_qty').value = w.n;
    calcRebar();
    return document.getElementById('res_r_total').textContent.trim();
  }, { d: d, l: l, n: n });

  // d^2/162 * L * n:  16er 474,07 kg, 20er 296,30 kg
  const nach1 = await eintragen('16', '6.0', '50');
  melde(nach1 === '474 kg', 'eine Zeile: die Summe ist das Gewicht der Zeile',
        'gemessen: ' + nach1);

  const nach2 = await eintragen('20', '12.0', '10');
  melde(nach2 === '770 kg', 'zwei Zeilen: die Summe ist beides zusammen',
        'gemessen: ' + nach2);

  const zeilen = await seite.evaluate(() =>
    document.querySelectorAll('#rebarTable tbody tr').length);
  melde(zeilen === 2, 'und in der Tabelle stehen zwei Zeilen',
        'gefunden: ' + zeilen);

  // Die oberste Zeile ist die zuletzt eingetragene, der 20er.
  const nachWeg = await seite.evaluate(() => {
    document.querySelector('#rebarTable tbody tr button').click();
    return {
      summe: document.getElementById('res_r_total').textContent.trim(),
      zeilen: document.querySelectorAll('#rebarTable tbody tr').length
    };
  });
  melde(nachWeg.summe === '474 kg' && nachWeg.zeilen === 1,
        'eine Zeile herausgenommen: Tabelle und Summe gehen zusammen zurueck',
        'Summe ' + nachWeg.summe + ', Zeilen ' + nachWeg.zeilen);

  const nachLeeren = await seite.evaluate(() => {
    leereStahlliste();
    return {
      summe: document.getElementById('res_r_total').textContent.trim(),
      zeilen: document.querySelectorAll('#rebarTable tbody tr').length,
      knopfAus: document.getElementById('btn_r_leeren').disabled
    };
  });
  melde(nachLeeren.summe === '0 kg' && nachLeeren.zeilen === 0,
        'Liste leeren setzt beides auf null',
        'Summe ' + nachLeeren.summe + ', Zeilen ' + nachLeeren.zeilen);
  melde(nachLeeren.knopfAus === true,
        'und der Knopf ist aus, solange nichts in der Liste steht');
}

// ------------------------------------------ C&E: Spalten und Sonderzeichen
//
// Zwei Befunde, beide im Browser nachgestellt, bevor sie behoben wurden:
//
// 1. Ein Doppelklick auf eine Wirkungs-Ueberschrift rief editItem() auf.
//    Die Funktion gab es nicht. In der Konsole stand "editItem is not
//    defined", auf dem Schirm stand nichts, und eine Wirkung war damit
//    weder zu aendern noch zu entfernen - es gab auch keinen Loeschknopf.
//    Wer eine Spalte falsch angelegt hatte, musste die Matrix leeren.
//
// 2. Die Zeilen wurden als Text zusammengeklebt: value="${cause.tag}".
//    Ein Tag mit Anfuehrungszeichen - PSH-"A" in einer importierten Liste -
//    brach das Attribut auf und kam als PSH- auf den Schirm, waehrend
//    matrixData und der Excel-Export den vollen Text behielten. Bildschirm
//    und Datei sagten Verschiedenes, ohne Warnung.
async function pruefeUrsacheWirkung(seite) {
  if (filter && !'ursache wirkung cause effect matrix'.includes(filter.toLowerCase())) return;
  console.log('\nC&E-Matrix, Spalten und Sonderzeichen' + grau('   (Cause_Effect)'));

  await oeffne(seite, 'Cause_Effect.html');

  // 2. Sonderzeichen. Der Tag geht durch das Woerterbuch nicht verloren.
  const zeichen = await seite.evaluate(() => {
    matrixData.causes.push({ id: 999, tag: 'PSH-"A"', desc: 'Druck > 10 bar & heiss' });
    renderMatrix();
    const f = document.querySelector('tr[data-cause-id="999"]').querySelectorAll('input.editable');
    return { tag: f[0].value, desc: f[1].value };
  });
  melde(zeichen.tag === 'PSH-"A"',
        'ein Tag mit Anfuehrungszeichen steht vollstaendig auf dem Schirm',
        'angezeigt: ' + zeichen.tag);
  melde(zeichen.desc === 'Druck > 10 bar & heiss',
        'und eine Beschreibung mit spitzer Klammer und Und-Zeichen ebenso',
        'angezeigt: ' + zeichen.desc);

  // 1. Eine Wirkung aendern.
  const bearbeitet = await seite.evaluate(() => {
    if (typeof editItem === 'undefined') return { fehlt: true };
    editItem('effect', 0);
    const titel = document.getElementById('modalTitle').innerText;
    const vorbelegt = document.getElementById('inpTag').value === matrixData.effects[0].tag;
    document.getElementById('inpTag').value = 'XV-"neu"';
    addManualItem();
    return {
      titel: titel,
      vorbelegt: vorbelegt,
      imModell: matrixData.effects[0].tag,
      imKopf: document.querySelectorAll('.effect-head')[0].querySelector('.rot-text span').textContent,
      zuIst: document.getElementById('templateModal').style.display === 'none'
    };
  });
  melde(!bearbeitet.fehlt && bearbeitet.vorbelegt,
        'der Doppelklick auf eine Spalte oeffnet sie mit ihrem Text',
        bearbeitet.fehlt ? 'editItem gibt es nicht' : 'Titel: ' + bearbeitet.titel);
  melde(bearbeitet.imModell === 'XV-"neu"' && bearbeitet.imKopf === 'XV-"neu"',
        'die Aenderung steht danach im Modell und in der Ueberschrift',
        'Modell ' + bearbeitet.imModell + ', Kopf ' + bearbeitet.imKopf);

  // Eine Wirkung entfernen, samt ihrer Verknuepfungen.
  const weg = await seite.evaluate(() => {
    window.confirm = () => true;
    const id = matrixData.effects[0].id;
    const vorher = matrixData.effects.length;
    const linksVorher = Object.keys(matrixData.links)
      .filter(k => k.split('-')[1] === String(id)).length;
    deleteEffect(0);
    return {
      vorher: vorher, nachher: matrixData.effects.length,
      linksVorher: linksVorher,
      linksNachher: Object.keys(matrixData.links)
        .filter(k => k.split('-')[1] === String(id)).length,
      spalten: document.querySelectorAll('.effect-head').length
    };
  });
  melde(weg.nachher === weg.vorher - 1 && weg.spalten === weg.nachher,
        'eine Wirkung laesst sich entfernen, Modell und Tabelle zusammen',
        'vorher ' + weg.vorher + ', nachher ' + weg.nachher + ', Spalten ' + weg.spalten);
  melde(weg.linksVorher > 0 && weg.linksNachher === 0,
        'und ihre Verknuepfungen gehen mit',
        'vorher ' + weg.linksVorher + ', nachher ' + weg.linksNachher);
}

// ------------------------------------------- Loop Designer: beschriften
//
// Die Verkaufsseite sagt zu diesem Werkzeug: "Symbole setzen, Klemmen
// verbinden, beschriften, als DXF ausgeben." Beschriften ging nicht.
// Jeder Messumformer trug fest "1001", jedes Stellventil "FCV", Motor
// und Magnetventil gar keine Bezeichnung - und kein Weg, das zu aendern.
// Ein Loop-Blatt, auf dem alle Geraete gleich heissen, ist kein
// Loop-Blatt, und der DXF geht so in die Dokumentation.
//
// Zweiter Befund: Escape brach das Verdrahten nicht ab. Der gestrichelte
// Faden blieb am Mauszeiger, wiringStart blieb gesetzt, und der naechste
// Klick auf einen Anschluss zog eine Leitung von einem Punkt, den
// niemand mehr sah.
async function pruefeLoopBeschriftung(seite) {
  if (filter && !'loop designer beschriften tag'.includes(filter.toLowerCase())) return;
  console.log('\nLoop Designer, Beschriftung' + grau('   (Loop_Library)'));

  await oeffne(seite, 'Loop_Library.html');

  const alle = await seite.evaluate(() => {
    ['pt', 'valve_control', 'valve_solenoid', 'motor', 'plc_ai', 'junction']
      .forEach(t => addComp(t));
    return [...document.querySelectorAll('.component')]
      .filter(g => !g.querySelector('[data-tag]'))
      .map(g => g.dataset.type);
  });
  melde(alle.length === 0, 'jedes Symbol hat eine Bezeichnung, die sich aendern laesst',
        'ohne: ' + alle.join(', '));

  const geaendert = await seite.evaluate(() => {
    const pt = document.querySelector('.component');
    pt.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    const inp = document.getElementById('tag-editor');
    if (!inp) return { fehlt: true };
    const vorbelegt = inp.value;
    inp.value = 'PT-2201';
    inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    return {
      vorbelegt: vorbelegt,
      jetzt: pt.querySelector('[data-tag]').textContent,
      editorWeg: !document.getElementById('tag-editor')
    };
  });
  melde(!geaendert.fehlt && geaendert.vorbelegt === '1001',
        'der Doppelklick oeffnet ein Feld mit der bisherigen Bezeichnung',
        geaendert.fehlt ? 'kein Feld' : 'vorbelegt: ' + geaendert.vorbelegt);
  melde(geaendert.jetzt === 'PT-2201' && geaendert.editorWeg,
        'Enter uebernimmt sie', 'jetzt: ' + geaendert.jetzt);

  // Escape darf nichts uebernehmen. Das Entfernen des Feldes loest selbst
  // ein blur aus - ohne Sperre schreibt dieses blur den verworfenen Text.
  const nachEscape = await seite.evaluate(() => {
    const pt = document.querySelector('.component');
    pt.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    const inp = document.getElementById('tag-editor');
    inp.value = 'VERWORFEN';
    inp.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    return pt.querySelector('[data-tag]').textContent;
  });
  melde(nachEscape === 'PT-2201', 'Escape laesst die alte stehen',
        'jetzt: ' + nachEscape);

  // Die Bezeichnung muss auch in der Datei ankommen, nicht nur am Schirm.
  const imDxf = await seite.evaluate(async () => {
    let blob = null;
    const origUrl = URL.createObjectURL;
    const origClick = HTMLAnchorElement.prototype.click;
    URL.createObjectURL = (b) => { blob = b; return 'blob:pruefung'; };
    HTMLAnchorElement.prototype.click = function () {};
    try { exportDXF(); } finally {
      URL.createObjectURL = origUrl;
      HTMLAnchorElement.prototype.click = origClick;
    }
    return blob ? (await blob.text()).includes('PT-2201') : false;
  });
  melde(imDxf === true, 'und steht im DXF, nicht nur auf dem Schirm');

  const faden = await seite.evaluate(() => {
    setMode('wire');
    document.querySelector('.pin').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const angefangen = !!document.getElementById('temp-wire') && wiringStart !== null;
    setMode('move');
    return {
      angefangen: angefangen,
      fadenWeg: !document.getElementById('temp-wire'),
      startWeg: wiringStart === null
    };
  });
  melde(faden.angefangen && faden.fadenWeg && faden.startWeg,
        'ein halb gezogener Draht wird beim Moduswechsel abgebrochen',
        JSON.stringify(faden));
}

// -------------------------------------------- SLD: drei Zahlen am Abgang
//
// Das Werkzeug schreibt drei Zahlen auf eine Zeichnung, die zum Kunden
// geht: Leistung, Strom, Querschnitt. Alle drei waren angreifbar.
//
//   cos phi = 0,85 fest im Code, an jedem Abgang - auch an der
//   Einspeisung, wo ein Trafo in kVA angegeben ist und gar kein cos phi
//   hineingehoert. 1000 kVA ergaben 1697 A statt 1443 A.
//
//   Der Wirkungsgrad fehlte. Derselbe Motor bekam hier einen anderen
//   Strom als in Load und Cable_Manager.
//
//   Der Querschnitt kam aus einer Leiter im Code - if(amps>20) "4x4" -
//   ohne jede Quelle, waehrend zwei andere Werkzeuge dafuer eine
//   gemeinsame Tabelle benutzen, deren Stand dokumentiert ist.
async function pruefeSLD(seite) {
  if (filter && !'sld uebersichtsschaltbild einpolig'.includes(filter.toLowerCase())) return;
  console.log('\nSLD-Generator, die Zahlen am Abgang' + grau('   (SLD_CAD)'));

  await oeffne(seite, 'SLD_CAD.html');

  const einspeisung = await seite.evaluate(() => {
    const e = feeders.find(x => x.type === 'incomer');
    e.power = 1000; e.volt = 400;
    return { ist: feederStrom(e), soll: 1000000 / (Math.sqrt(3) * 400) };
  });
  melde(Math.abs(einspeisung.ist - einspeisung.soll) < 0.1,
        'die Einspeisung rechnet S/(sqrt(3)*U), ohne cos phi',
        'gemessen ' + einspeisung.ist.toFixed(1) + ' A, erwartet ' +
        einspeisung.soll.toFixed(1) + ' A');

  const abgang = await seite.evaluate(() => {
    const a = feeders.find(x => x.type === 'outgoing');
    a.power = 100; a.volt = 400; a.cosphi = 0.9; a.eta = 50;
    // eta 50 darf am Abgang nichts aendern: die Leistung ist dort schon
    // die elektrische.
    return { ist: feederStrom(a), soll: 100000 / (Math.sqrt(3) * 400 * 0.9) };
  });
  melde(Math.abs(abgang.ist - abgang.soll) < 0.1,
        'der Abgang rechnet ohne Wirkungsgrad',
        'gemessen ' + abgang.ist.toFixed(1) + ' A, erwartet ' + abgang.soll.toFixed(1) + ' A');

  const querschnitt = await seite.evaluate(() => {
    const m = feeders.find(x => x.type === 'motor');
    m.power = 45; m.volt = 400; m.cosphi = 0.85; m.eta = 92;
    const I = feederStrom(m);
    const ausTabelle = STROMBELASTBARKEIT.fuerStrom(I);
    return { q: feederQuerschnitt(m), tabelle: ausTabelle ? ausTabelle.q : null, I: I };
  });
  melde(querschnitt.q !== null && querschnitt.q === querschnitt.tabelle,
        'der Querschnitt kommt aus der gemeinsamen Tabelle',
        'Werkzeug ' + querschnitt.q + ', Tabelle ' + querschnitt.tabelle +
        ' (bei ' + Number(querschnitt.I).toFixed(1) + ' A)');

  // Solange die Tabelle nicht gegen die Norm geprueft ist, muss der Hinweis
  // auf der Zeichnung stehen - wie in den beiden anderen Werkzeugen.
  const hinweis = await seite.evaluate(() =>
    !STROMBELASTBARKEIT.GRUNDLAGE.geprueft);
  melde(hinweis === true,
        'und traegt den Hinweis mit, solange sie ungeprueft ist');

  const leer = await seite.evaluate(() => {
    const m = feeders.find(x => x.type === 'motor');
    updateProp(m.id, 'power', '');
    const s = feederStrom(m);
    const q = feederQuerschnitt(m);
    const feld = document.querySelector('#propContent input[disabled]');
    return { strom: s, q: q, angezeigt: feld ? feld.value : null };
  });
  melde(leer.strom === null && leer.q === null && leer.angezeigt === '--',
        'ein leeres Leistungsfeld gibt "--", kein NaN',
        JSON.stringify(leer));

  const name = await seite.evaluate(() => {
    const m = feeders.find(x => x.type === 'motor');
    updateProp(m.id, 'power', '45');
    updateProp(m.id, 'name', 'Pumpe "A"');
    selectFeeder(m.id);
    return document.getElementById('propName').value;
  });
  melde(name === 'Pumpe "A"',
        'ein Name mit Anfuehrungszeichen bleibt ganz', 'angezeigt: ' + name);
}

// ----------------------------------------- Zwei Trassenwerkzeuge, ein Bild
//
// Der Kabelterassen_Rechner sagt, wie breit die Trasse sein muss. Der
// visuelle CAD legt die Kabel in eine gewaehlte Breite und zeigt den
// Fuellgrad. Die beiden gehoeren zusammen - im Katalog steht beim
// Trassen-CAD ausdruecklich "dafuer gibt es die beiden folgenden
// Werkzeuge". Also muss gelten: was der eine als Breite vorschlaegt,
// muss beim anderen auch hineinpassen.
//
// Nachgemessen, bevor etwas geaendert wurde: sie stimmen ueberein. Diese
// Pruefung haelt das fest, damit es so bleibt - bisher war es von nichts
// gesichert.
async function pruefeTrassenPaar(seite) {
  if (filter && !'trasse trassenpaar fuellgrad'.includes(filter.toLowerCase())) return;
  console.log('\nZwei Trassenwerkzeuge, ein Bild' +
              grau('   (Kabelterasse_Rechner gegen Visueller_Kabeltrassen_CAD)'));

  const KABEL = { name: 'Pruefkabel', d: 12, w: 0.35 };
  const N = 20;
  const HOEHE = 60;

  await oeffne(seite, 'Kabelterasse_Rechner.html');
  const noetig = await seite.evaluate(({ k, n, h }) => {
    selectedCables = [{ ...k, qty: n }];
    document.getElementById('reserveSpace').value = '1.0';
    document.getElementById('trayHeight').value = String(h);
    const fg = document.getElementById('fuellgrad');
    if (fg) fg.value = '0.40';
    const art = document.getElementById('verlegeart');
    const lies = (a) => {
      art.value = a;
      calculate();
      return parseFloat(document.getElementById('reqWidthVal').innerText);
    };
    return { beruehrend: lies('beruehrend'), abstand: lies('abstand'),
             gebuendelt: lies('gebuendelt') };
  }, { k: KABEL, n: N, h: HOEHE });

  // Von Hand: 20 x 12 mm.
  melde(Math.abs(noetig.beruehrend - 240) < 1,
        'einlagig beruehrend: Summe der Durchmesser, 240 mm',
        'gemessen: ' + noetig.beruehrend);
  melde(Math.abs(noetig.abstand - 480) < 1,
        'einlagig mit Abstand: das Doppelte, 480 mm',
        'gemessen: ' + noetig.abstand);

  const flaeche = N * Math.PI * Math.pow(KABEL.d / 2, 2);
  const sollGeb = flaeche / (0.40 * HOEHE);
  melde(Math.abs(noetig.gebuendelt - sollGeb) < 1,
        'gebuendelt: Querschnitt bei 40 Prozent Fuellgrad',
        'gemessen ' + noetig.gebuendelt + ', erwartet ' + sollGeb.toFixed(1));

  // Dieselben Kabel in die naechste Normbreite ueber dem gebuendelten
  // Bedarf (94 mm -> 100 mm). Der Fuellgrad muss dann unter den 40 Prozent
  // liegen, fuer die gerechnet wurde.
  await oeffne(seite, 'Visueller_Kabeltrassen_CAD.html');
  const gemessen = await seite.evaluate(({ k, n, h }) => {
    selectedCables = [];
    for (let i = 0; i < n; i++) selectedCables.push({ ...k });
    document.getElementById('trayWidth').value = '100';
    document.getElementById('trayHeight').value = String(h);
    drawSimulation();
    return parseFloat(document.getElementById('fillRate').innerText);
  }, { k: KABEL, n: N, h: HOEHE });

  const sollFuell = flaeche / (100 * HOEHE) * 100;
  melde(Math.abs(gemessen - sollFuell) < 0.2,
        'der visuelle CAD rechnet denselben Fuellgrad',
        'gemessen ' + gemessen + ' %, erwartet ' + sollFuell.toFixed(1) + ' %');
  melde(gemessen <= 40,
        'und die vorgeschlagene Breite haelt die 40 Prozent ein',
        'gemessen: ' + gemessen + ' %');

  // Die Grenze, an der die Farbe umschlaegt, war fest verdrahtet. Sie
  // gehoert zur selben Auswahl wie im Rechner.
  const grenze = await seite.evaluate(() => {
    const f = document.getElementById('grenzFuellgrad');
    if (!f) return { fehlt: true };
    const farbe = (wert) => {
      f.value = wert; drawSimulation();
      return document.getElementById('fillRate').style.color;
    };
    return { bei40: farbe('40'), bei30: farbe('30') };
  });
  melde(!grenze.fehlt && grenze.bei40 !== grenze.bei30,
        'ein vorsichtiger Fuellgrad faerbt dieselbe Zahl anders',
        JSON.stringify(grenze));
}

// ------------------------------------------------- Trasse_CAD: Stueckliste
//
// Im Katalog steht zu diesem Werkzeug zweimal, es fuehre die Stueckliste
// mit - in der Kurzbeschreibung und im langen Text. Es fuehrte keine.
// Es gab weder eine Liste noch eine Zaehlung; wer wissen wollte, wieviele
// Boegen 400x60 er gesetzt hat, musste sie im Bild abzaehlen.
//
// Gezaehlt wird jetzt, was wirklich in der Szene steht: objects ist
// dieselbe Liste, aus der auch der DXF entsteht. Damit koennen Zeichnung
// und Stueckliste nicht auseinanderlaufen - genau die Trennung, die im
// Erdungswerkzeug der Fehler war.
async function pruefeTrasseStueckliste(seite) {
  if (filter && !'stueckliste trasse cad'.includes(filter.toLowerCase())) return;
  console.log('\nTrasse_CAD, Stueckliste' + grau('   (Trasse_CAD)'));

  await oeffne(seite, 'Trasse_CAD.html');

  const leer = await seite.evaluate(() => ({
    text: document.getElementById('stuecklisteBox').textContent.trim(),
    knopf: document.getElementById('btnStueckliste').disabled,
    zeilen: stueckliste().length
  }));
  melde(leer.zeilen === 0 && leer.knopf === true,
        'ohne Bauteil ist die Liste leer und der Knopf aus', JSON.stringify(leer));

  const gesetzt = await seite.evaluate(() => {
    addPart('straight'); addPart('straight'); addPart('elbow_left'); addPart('tee');
    return {
      objekte: objects.length,
      liste: stueckliste(),
      knopf: document.getElementById('btnStueckliste').disabled
    };
  });
  const summe = gesetzt.liste.reduce((a, z) => a + z.anzahl, 0);
  melde(summe === gesetzt.objekte && gesetzt.objekte === 4,
        'die Liste zaehlt genau die Teile, die in der Szene stehen',
        'Liste ' + summe + ', Szene ' + gesetzt.objekte);

  const geraden = gesetzt.liste.find(z => z.name === 'Gerade, Kabelwanne');
  melde(geraden && geraden.anzahl === 2,
        'gleiche Teile stehen in einer Zeile mit ihrer Anzahl',
        JSON.stringify(gesetzt.liste.map(z => z.anzahl + ' x ' + z.name)));
  melde(gesetzt.knopf === false, 'und der CSV-Knopf ist jetzt an');

  // Zwei Gerade mit verschiedener Laenge duerfen nicht in eine Zeile.
  const getrennt = await seite.evaluate(() => {
    document.getElementById('straightLengthVal').value = '2000';
    addPart('straight');
    const z = stueckliste().filter(x => x.name === 'Gerade, Kabelwanne');
    return z.map(x => x.anzahl + ' | ' + x.masse);
  });
  melde(getrennt.length === 2,
        'verschiedene Laengen bleiben getrennte Zeilen', JSON.stringify(getrennt));

  // Und das Loeschen muss die Liste mitnehmen. Im Erdungswerkzeug war
  // genau diese Trennung der Fehler.
  const nachWeg = await seite.evaluate(() => {
    selectObject(objects[0]);
    deleteSelected();
    return { objekte: objects.length,
             summe: stueckliste().reduce((a, z) => a + z.anzahl, 0) };
  });
  melde(nachWeg.summe === nachWeg.objekte,
        'was geloescht wird, ist auch aus der Liste weg',
        'Liste ' + nachWeg.summe + ', Szene ' + nachWeg.objekte);
}

// ------------------------------------ Structure_CAD: Eingaben, die haengen
//
// Ein Rastermass von null hat das Werkzeug aufgehaengt. bays wurde
// Math.floor(L / 0) = Infinity, und die Schleife lief endlos - ein
// Tastendruck, und der Browser stand. Ein leeres Laengenfeld ergab NaN
// und damit ein leeres Modell, ohne dass jemand etwas davon erfuhr.
//
// Die Pruefungen laufen mit einer eigenen Zeitgrenze: kaeme die Schleife
// zurueck, wuerde ohne sie der ganze Lauf stehenbleiben statt rot zu
// werden.
async function pruefeStructureEingaben(seite) {
  if (filter && !'structure stahlbau traggeruest'.includes(filter.toLowerCase())) return;
  console.log('\nStructure_CAD, Eingaben' + grau('   (Structure_CAD)'));

  await oeffne(seite, 'Structure_CAD.html');

  const mitGrenze = (versprechen) => Promise.race([
    versprechen,
    new Promise(r => setTimeout(() => r('HAENGT'), 8000))
  ]);

  const dxf = () => seite.evaluate(async () => {
    let blob = null;
    const oU = URL.createObjectURL, oC = HTMLAnchorElement.prototype.click;
    URL.createObjectURL = (x) => { blob = x; return 'blob:pruefung'; };
    HTMLAnchorElement.prototype.click = function () {};
    try { exportDXF_Pro(); } finally {
      URL.createObjectURL = oU; HTMLAnchorElement.prototype.click = oC;
    }
    if (!blob) return null;
    const t = await blob.text();
    return { flaechen: (t.match(/3DFACE/g) || []).length, nan: /NaN/.test(t) };
  });

  const setz = (werte) => seite.evaluate((w) => {
    for (const k in w) document.getElementById(k).value = w[k];
    updateModel();
    return document.getElementById('statusMsg').innerText;
  }, werte);

  const start = await dxf();
  melde(start && start.flaechen > 0 && !start.nan,
        'mit den Vorgabemassen entsteht ein Modell ohne NaN',
        JSON.stringify(start));

  const null_ = await mitGrenze(setz({ inpBay: '0' }));
  melde(null_ !== 'HAENGT' && /null/.test(null_),
        'Raster null haengt das Werkzeug nicht mehr auf, es sagt es',
        'Meldung: ' + null_);

  const leer = await mitGrenze(setz({ inpBay: '5', inpL: '' }));
  melde(leer !== 'HAENGT' && /Zahlen/.test(leer),
        'ein leeres Feld wird genannt, statt ein leeres Modell zu bauen',
        'Meldung: ' + leer);

  const fein = await mitGrenze(setz({ inpL: '20', inpBay: '0.01' }));
  melde(fein !== 'HAENGT' && /Felder/.test(fein),
        'ein zu feines Raster wird abgelehnt, bevor es rechnet',
        'Meldung: ' + fein);

  const wieder = await mitGrenze(setz({ inpL: '20', inpBay: '5' }));
  const nachher = await dxf();
  melde(wieder === 'Erstellt: HALL' && nachher &&
        nachher.flaechen === start.flaechen,
        'nach guten Werten steht wieder dasselbe Modell wie vorher',
        'vorher ' + (start && start.flaechen) + ', nachher ' +
        (nachher && nachher.flaechen));

  // Die Profilauswahl war zwei feste Zahlenpaare im Code. Jetzt fuellt sie
  // zwei Felder, die man ueberschreiben kann.
  const profil = await seite.evaluate(() => {
    document.getElementById('inpProfile').value = 'IPE';
    profilUebernehmen();
    const w = document.getElementById('inpProfW').value;
    const d = document.getElementById('inpProfD').value;
    document.getElementById('inpProfW').value = '300';
    updateModel();
    return { w: w, d: d, status: document.getElementById('statusMsg').innerText };
  });
  melde(profil.w === '120' && profil.d === '240' && profil.status === 'Erstellt: HALL',
        'die Profilauswahl fuellt die beiden Masse, und sie sind aenderbar',
        JSON.stringify(profil));
}

// ------------------------------------- Bau_CAD: was der Katalog verspricht
//
// Hier lag der Fehler nicht im Werkzeug, sondern im Katalog. Dort stand
// "Rechtecke, Kreise, Linien und Text mit Fang auf Raster und Endpunkte,
// Bemassung, Export als DXF" - ein 2D-Skizzenblock. Das Werkzeug ist
// etwas anderes: ein Koerpermodellierer mit 22 Bauteilen, darunter die
// Stahlprofile IPE, HEA, UNP, L und T. Text und Bemassung gibt es nicht,
// 2D-Rechtecke und -Kreise auch nicht.
//
// Die Beschreibung nennt jetzt die Gruppen. Damit sie wahr bleibt, zaehlt
// diese Pruefung sie nach.
const BAU_CAD_TEILE = {
  Kurven: ['bogen_wand', 'bogen_balken', 'rampe', 'rohr_bogen'],
  Stahl:  ['ipe', 'hea', 'unp', 'l_prof', 't_prof', 'rohr'],
  Massiv: ['fundament', 'wall', 'column_rect', 'column_round',
           'beam_conc', 'slab', 'wood_beam', 'wood_panel'],
  Koerper: ['cube', 'sphere', 'cylinder', 'cone']
};

async function pruefeBauCadTeile(seite) {
  if (filter && !'bau_cad bauteile katalog'.includes(filter.toLowerCase())) return;
  console.log('\nBau_CAD, die Bauteile' + grau('   (Bau_CAD gegen den Katalog)'));

  await oeffne(seite, 'Bau_CAD.html');
  const da = await seite.evaluate(() =>
    [...document.querySelectorAll('button[onclick^="addShape"]')]
      .map(b => (b.getAttribute('onclick').match(/addShape\('([^']+)'\)/) || [])[1])
      .filter(Boolean));

  for (const gruppe in BAU_CAD_TEILE) {
    const fehlen = BAU_CAD_TEILE[gruppe].filter(t => da.indexOf(t) < 0);
    melde(fehlen.length === 0,
          gruppe + ': alle ' + BAU_CAD_TEILE[gruppe].length + ' Bauteile sind da',
          'fehlen: ' + fehlen.join(', '));
  }

  const erwartet = Object.values(BAU_CAD_TEILE).reduce((a, g) => a + g.length, 0);
  melde(da.length === erwartet,
        'zusammen ' + erwartet + ' Bauteile, so viele wie der Katalog nennt',
        'gefunden: ' + da.length);

  // Was der Katalog frueher versprach und es nie gab.
  const roh = fs.readFileSync(path.join(WERKZEUGE, 'Bau_CAD.html'), 'utf8');
  melde(!/TextGeometry|addText|Bemassung|Bema\u00dfung/.test(roh),
        'Text und Bemassung gibt es wirklich nicht - der Katalog sagt es auch nicht mehr');
}

// ------------------------------------------- photo_CAD: der Massstab
//
// Im Katalog steht zu diesem Werkzeug: "Foto laden, einen bekannten
// Abstand als Massstab angeben" und als Grundlage "Massstab ueber eine
// bekannte Referenzstrecke". Diese Strecke gab es nicht - es gab kein
// Feld dafuer und keine Rechnung. Der einzige "scale" im Code war der
// Zoom, mit dem das Bild in die Flaeche passt. Der DXF entstand damit in
// Bildpunkten, und eine Zeichnung in Bildpunkten ist keine
// masstaebliche Zeichnung, auch wenn sie sich oeffnen laesst.
async function pruefePhotoMassstab(seite) {
  if (filter && !'photo massstab foto referenz'.includes(filter.toLowerCase())) return;
  console.log('\nphoto_CAD, der Massstab' + grau('   (photo_CAD)'));

  await oeffne(seite, 'photo_CAD.html');

  const anfang = await seite.evaluate(() => ({
    faktor: mmProEinheit,
    text: document.getElementById('massStatus').textContent.trim()
  }));
  melde(anfang.faktor === null && /kein Maßstab/.test(anfang.text),
        'ohne Massstab sagt das Werkzeug es, statt so zu tun',
        JSON.stringify(anfang));

  // Zwei Punkte, 100 Welteinheiten auseinander, als 2000 mm erklaert.
  const gesetzt = await seite.evaluate(() => {
    addPart('Bolt');
    setTool('mass');
    document.getElementById('refMM').value = '2000';
    massPunktSetzen(0, 0);
    const zwischen = document.getElementById('massStatus').textContent.trim();
    massPunktSetzen(100, 0);
    return {
      zwischen: zwischen,
      faktor: mmProEinheit,
      text: document.getElementById('massStatus').textContent.trim()
    };
  });
  melde(/Zweiten Punkt/.test(gesetzt.zwischen),
        'nach dem ersten Punkt fragt es nach dem zweiten', gesetzt.zwischen);
  melde(Math.abs(gesetzt.faktor - 20) < 1e-9,
        '2000 mm auf 100 Einheiten ergeben 20 mm je Einheit',
        'gemessen: ' + gesetzt.faktor);
  melde(/20\.000 mm/.test(gesetzt.text), 'und der Faktor steht auf dem Schirm',
        gesetzt.text);

  // Und er muss in der Datei ankommen, nicht nur auf dem Schirm.
  const dxf = await seite.evaluate(async () => {
    const holen = async () => {
      let blob = null;
      const oU = URL.createObjectURL, oC = HTMLAnchorElement.prototype.click, oCo = window.confirm;
      let gefragt = false;
      URL.createObjectURL = (x) => { blob = x; return 'blob:pruefung'; };
      HTMLAnchorElement.prototype.click = function () {};
      window.confirm = () => { gefragt = true; return true; };
      try { exportDXF(); } finally {
        URL.createObjectURL = oU; HTMLAnchorElement.prototype.click = oC; window.confirm = oCo;
      }
      const t = blob ? await blob.text() : '';
      // Die zweite Koordinate der ersten Flaeche: die erste ist hier null.
      const m = t.match(/[\r\n]20[\r\n]+(-?[0-9.eE+-]+)/);
      return { y: m ? parseFloat(m[1]) : null, gefragt: gefragt, nan: /NaN/.test(t) };
    };
    const mit = await holen();
    mmProEinheit = null;
    const ohne = await holen();
    return { mit: mit, ohne: ohne };
  });
  melde(dxf.mit.y !== null && dxf.ohne.y !== null && !dxf.mit.nan && !dxf.ohne.nan,
        'der DXF enthaelt Zahlen, kein NaN', JSON.stringify(dxf));
  melde(Math.abs(dxf.mit.y / dxf.ohne.y - 20) < 1e-6,
        'mit Massstab sind die Masse genau zwanzigfach',
        'mit ' + dxf.mit.y + ', ohne ' + dxf.ohne.y);
  melde(dxf.ohne.gefragt === true && dxf.mit.gefragt === false,
        'ohne Massstab fragt der Export nach, mit Massstab nicht',
        JSON.stringify({ mit: dxf.mit.gefragt, ohne: dxf.ohne.gefragt }));

  // Ein halb gesetzter Massstab darf nicht liegenbleiben.
  const halb = await seite.evaluate(() => {
    setTool('mass');
    massPunktSetzen(0, 0);
    setTool('rect');
    return { offen: massPunkte.length, tool: currentTool };
  });
  melde(halb.offen === 0, 'ein halb gesetzter Massstab wird beim Wechsel verworfen',
        JSON.stringify(halb));

  const schlecht = await seite.evaluate(() => {
    setTool('mass');
    document.getElementById('refMM').value = '0';
    massPunktSetzen(0, 0);
    massPunktSetzen(50, 0);
    return { faktor: mmProEinheit,
             text: document.getElementById('massStatus').textContent.trim() };
  });
  melde(schlecht.faktor === null && /größer als null/.test(schlecht.text),
        'eine Referenzstrecke von null wird abgelehnt', JSON.stringify(schlecht));

  // Die beiden Z-Felder stehen in Welteinheiten, wie X und Y auch - die
  // Szene ist ein Koordinatensystem, und der Massstab sagt, was eine
  // Einheit in Millimetern ist. Stuende die Dicke in Millimetern und X
  // und Y in Einheiten, waere die Eingabe ein Gemisch aus zwei Systemen.
  // Man sah nur nicht, was die eingetragene Zahl bedeutet. Jetzt steht
  // sie in Millimetern daneben.
  const hinweis = await seite.evaluate(() => {
    const t = () => document.getElementById('zHinweis').textContent.trim();
    mmProEinheit = null;
    massStatusZeigen(null);
    const ohne = t();
    document.getElementById('refMM').value = '2000';
    setTool('mass');
    massPunktSetzen(0, 0); massPunktSetzen(100, 0);
    const mit = t();
    document.getElementById('drawZ').value = '5';
    zHinweisZeigen();
    const geaendert = t();
    document.getElementById('drawZ').value = '';
    zHinweisZeigen();
    return { ohne: ohne, mit: mit, geaendert: geaendert, leer: t() };
  });
  melde(/kein Maßstab/.test(hinweis.ohne),
        'ohne Massstab sagt das Z-Feld, dass es Einheiten sind', hinweis.ohne);
  melde(/400\.0 mm/.test(hinweis.mit),
        '20 Einheiten bei 20 mm je Einheit stehen als 400 mm daneben', hinweis.mit);
  melde(/100\.0 mm/.test(hinweis.geaendert),
        'und die Zahl folgt der Eingabe', hinweis.geaendert);
  melde(/--/.test(hinweis.leer), 'ein leeres Feld gibt "--", kein NaN', hinweis.leer);
}

// -------------------------------- Jede Zusage im Katalog gegen das Werkzeug
//
// Neunmal in dieser Runde war der Befund derselbe: auf der Verkaufsseite
// stand etwas, das es im Werkzeug nicht gab. "beschriften" ohne eine
// Moeglichkeit zu beschriften, "fuehrt die Stueckliste mit" ohne Liste,
// "massstaebliche Zeichnung" ohne Massstab, "Text und Bemassung" in einem
// Werkzeug, das beides nicht kennt.
//
// Das laesst sich messen. Nennt der Katalog ein greifbares Merkmal, muss
// die Datei davon zeugen. Das ist eine Heuristik: sie beweist nichts, aber
// sie findet genau diese Art von Luege. Nachgestellt an den vier Faellen
// oben - in ihrem Stand VOR der Behebung schlaegt sie bei allen vieren an.
//
// Eine Zusage, die als Grenze formuliert ist ("keine Statik", "ohne Netz"),
// ist keine Zusage und zaehlt nicht.
const KATALOG_BELEG = {
  'DXF':        /dxf/i,
  'XLSX':       /xlsx|SheetJS/i,
  'Excel':      /xlsx|SheetJS|\.csv|text\/csv/i,
  'PDF':        /pdf|jsPDF/i,
  'CSV':        /\.csv|text\/csv/i,
  'SVG':        /svg/i,
  'Stückliste': /stueckliste|stückliste|bom\b/i,
  'speichern':  /localStorage|sessionStorage|indexedDB/i,
  'Import':     /import|readAsArrayBuffer|readAsText|type="file"/i,
  'Maßstab':    /massstab|maßstab|mmProEinheit|refMM/i,
  'beschrift':  /data-tag|beschrifte|editItem|tagText/i,
  'Simulation': /simulate|simulation/i,
  '3D':         /THREE|three\.min|3DFACE|exportDXF_3D/i,
  'Text':       /TextGeometry|createText|addText|fillText|<text|type="text"/i,
  'Bemaßung':   /bemassung|bemaßung|dimension/i,
  'Raster':     /raster|grid|snap/i,
  'Vorlage':    /vorlage|template/i,
  'Bericht':    /bericht|report/i
};

function pruefeKatalogZusagen() {
  if (filter && !'katalog zusagen versprechen'.includes(filter.toLowerCase())) return;
  console.log('\nJede Zusage im Katalog' + grau('   (shop/werkzeuge.js gegen die Werkzeuge)'));

  const src = fs.readFileSync(path.join(WERKZEUGE, 'shop', 'werkzeuge.js'), 'utf8');
  const eintraege = [...src.matchAll(
    /\{\s*id:\s*'([^']+)',\s*datei:\s*'([^']+)',([\s\S]*?)\n\}\s*[,\]]/g)];
  const imKatalog = (src.match(/datei:\s*'[^']+'/g) || []).length;

  // Zuerst: liest die Pruefung ueberhaupt alle Eintraege? Eine Messung, die
  // stillschweigend einen auslaesst, ist schlimmer als keine - genau daran
  // ist die Luecken-Zaehlung schon einmal vorbeigegangen.
  melde(eintraege.length === imKatalog && imKatalog > 0,
        'die Pruefung liest alle ' + imKatalog + ' Katalogeintraege',
        'gelesen: ' + eintraege.length + ' von ' + imKatalog);

  const ohneBeleg = [];
  for (const [, , datei, rest] of eintraege) {
    let html;
    try { html = fs.readFileSync(path.join(WERKZEUGE, datei), 'utf8'); }
    catch (e) { ohneBeleg.push(datei + ': Datei fehlt'); continue; }
    const text = (rest.match(/(kurz|lang|nutzen|grundlage|grenze):\s*'([^']*)'/g) || []).join(' ');
    const fehlt = [];
    for (const wort in KATALOG_BELEG) {
      if (!new RegExp(wort, 'i').test(text)) continue;
      if (new RegExp('(kein[a-z]*|nicht|ohne)\\s+\\S*\\s*' + wort, 'i').test(text)) continue;
      if (!KATALOG_BELEG[wort].test(html)) fehlt.push(wort);
    }
    if (fehlt.length) ohneBeleg.push(datei + ': ' + fehlt.join(', '));
  }

  melde(ohneBeleg.length === 0,
        'jede Zusage im Katalog hat einen Beleg im Werkzeug',
        ohneBeleg.join(' | '));
}

async function pruefeRechner(seite) {
  if (filter && !'rechner taschenrechner eval'.includes(filter.toLowerCase())) return;
  console.log('\nDer Taschenrechner fuehrt nichts aus' + grau('   (Electrical_Toolbox)'));

  /* Kein eval mehr im Code. Im Kommentar darf es stehen - dort erklaert es,
     warum es weg ist. Also erst die Kommentare herausnehmen und dann suchen;
     Zeile fuer Zeile zu pruefen reicht nicht, weil die mittleren Zeilen eines
     Blockkommentars weder mit / noch mit * anfangen. */
  const roh = fs.readFileSync(path.join(WERKZEUGE, 'Electrical_Toolbox.html'), 'utf8');
  const ohneKommentar = roh
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const treffer = ohneKommentar.match(/\beval\s*\(/g) || [];
  melde(treffer.length === 0, 'kein eval() im Code', treffer.length + ' Stellen');

  await oeffne(seite, 'Electrical_Toolbox.html');

  const d = await seite.evaluate(({ gueltig, boese }) => {
    const daneben = [], durchgelassen = [];
    for (const [ausdruck, soll] of gueltig) {
      let ist;
      try { ist = rechneAus(ausdruck); } catch (e) { ist = 'ABGEWIESEN'; }
      if (typeof ist !== 'number' || Math.abs(ist - soll) > 1e-9) {
        daneben.push(ausdruck + ': soll ' + soll + ', ist ' + ist);
      }
    }
    for (const ausdruck of boese) {
      try { const w = rechneAus(ausdruck); durchgelassen.push(ausdruck + ' -> ' + w); }
      catch (e) { /* richtig so */ }
    }
    return { daneben, durchgelassen };
  }, { gueltig: RECHNER_GUELTIG, boese: RECHNER_BOESE });

  melde(d.daneben.length === 0,
        RECHNER_GUELTIG.length + ' gueltige Ausdruecke rechnen wie vorher',
        d.daneben.join(' | '));
  melde(d.durchgelassen.length === 0,
        'nichts kommt durch, was kein Ausdruck ist',
        d.durchgelassen.join(' | '));

  // Teilen durch null gab frueher "Infinity" auf dem Schirm. Das ist kein
  // Ergebnis, das ist ein Fehler.
  const durchNull = await seite.evaluate(() => {
    currentInput = '5/0';
    calculate();
    return (document.getElementById('display') || {}).innerText || '';
  });
  melde(/Fehler/i.test(durchNull), 'Teilen durch null meldet einen Fehler',
        'Anzeige: "' + durchNull + '"');
}

// ------------------------------------------------------ Sprachumschaltung
//
// Die Werkzeuge sind auf Deutsch geschrieben; Persisch und Englisch kommen
// aus einem Woerterbuch, das den deutschen Text als Schluessel hat. Zwei
// Dinge muessen dabei stimmen, und beide werden hier geprueft.
//
// Erstens: der Rueckweg. Wer auf Persisch umschaltet und wieder zurueck,
// muss GENAU den deutschen Text zurueckbekommen - sonst waere die
// Uebersetzung eine Einbahnstrasse und die Seite nach zwei Klicks kaputt.
//
// Zweitens: der Waehler darf nichts zudecken. Beim KI-Knopf ist genau das
// zweimal passiert, in Instrument_Selector und im Electrical_Toolbox.
//
// Dazu wird die LUECKE gemessen und ausgegeben: wieviele sichtbare Texte
// noch kein Woerterbucheintrag haben. Die Zahl soll sinken, aber sie soll
// vor allem sichtbar sein - eine halbe Uebersetzung, die so tut als waere
// sie fertig, ist schlimmer als eine, die ihren Stand nennt.
async function pruefeSprache(seite) {
  if (filter && !'sprache uebersetzung persisch englisch'.includes(filter.toLowerCase())) return;
  console.log('\nSprachumschaltung' + grau('   (Deutsch / Persisch / Englisch)'));
  const WERKZEUGE_LISTE = fs.readdirSync(WERKZEUGE)
    .filter(d => d.endsWith('.html')).sort();

  // Das Dashboard und die Verkaufsseite stehen in Unterordnern und sind
  // deshalb nicht in der Liste oben. Sie sind trotzdem Seiten mit Text,
  // und genau darum blieb ihre Luecke lange unbemerkt: die Schleifen
  // unten zaehlten sie nicht mit. Jetzt zaehlen sie.
  const SEITEN_LISTE = WERKZEUGE_LISTE.concat(['dashboard/index.html', 'shop/index.html']);

  await oeffne(seite, WERKZEUGE_LISTE[0]);
  const da = await seite.evaluate(() => typeof UEBERSETZUNG !== "undefined");
  melde(da, 'die Sprachumschaltung ist geladen');
  if (!da) return;

  // Rueckweg, an einem Werkzeug mit viel Text.
  await oeffne(seite, 'Load.html');
  const reise = await seite.evaluate(() => {
    const text = () => document.body.innerText;
    const de1 = text();
    UEBERSETZUNG.setze("fa"); const fa = text();
    UEBERSETZUNG.setze("en"); const en = text();
    UEBERSETZUNG.setze("de"); const de2 = text();
    return { gleich: de1 === de2, faAnders: fa !== de1, enAnders: en !== de1 };
  });
  melde(reise.gleich, 'zurueck auf Deutsch kommt derselbe Text wieder');
  melde(reise.faAnders, 'Persisch aendert den Text');
  melde(reise.enAnders, 'Englisch aendert den Text');

  // Leserichtung. Persisch laeuft von rechts nach links, Zahlenfelder nicht.
  const richtung = await seite.evaluate(() => {
    UEBERSETZUNG.setze("fa");
    const rtl = document.documentElement.getAttribute("dir");
    const feld = document.querySelector("input[type=number]");
    const feldRichtung = feld ? getComputedStyle(feld).direction : "ltr";
    UEBERSETZUNG.setze("de");
    return { rtl, feldRichtung, zurueck: document.documentElement.getAttribute("dir") };
  });
  melde(richtung.rtl === 'rtl', 'Persisch stellt die Seite auf rechts nach links');
  melde(richtung.feldRichtung === 'ltr',
        'Zahlenfelder bleiben auch dann von links nach rechts',
        'gemessen: ' + richtung.feldRichtung);
  melde(richtung.zurueck === 'ltr', 'Deutsch stellt die Leserichtung zurueck');

  // Normnamen und Einheiten duerfen nicht uebersetzt werden. Sie stehen
  // nicht im Woerterbuch, also darf auch nichts passieren.
  const unberuehrt = await seite.evaluate(() => {
    const buch = window.WZ_WOERTER || {};
    const tabu = ["IEC 60909", "DIN VDE 0100-430", "mm\u00b2", "kVA", "cos \u03c6", "L", "A", "T"];
    return tabu.filter(x => (buch.fa && buch.fa[x] !== undefined)
                         || (buch.en && buch.en[x] !== undefined));
  });
  melde(unberuehrt.length === 0,
        'Normnamen, Einheiten und Formelzeichen stehen nicht im Woerterbuch',
        'faelschlich enthalten: ' + unberuehrt.join(', '));

  // Der Platzhalter eines Eingabefeldes ist Sprache, sein Inhalt nicht.
  // Beim TEXTAREA fiel beides zusammen: der Uebersetzer liess das ganze
  // Element in Ruhe, damit er nichts anfasst, was der Benutzer getippt
  // hat - und uebersah damit auch die Beschriftung. Sie stand in jeder
  // Sprache deutsch da.
  await oeffne(seite, 'Brandschutz_Master_Global_Framework.html');
  const platzhalter = await seite.evaluate(() => {
    const feld = document.querySelector("textarea[placeholder]");
    if (!feld) return { fehlt: true };
    const de = feld.getAttribute("placeholder");
    UEBERSETZUNG.setze("fa");
    const fa = feld.getAttribute("placeholder");
    UEBERSETZUNG.setze("de");
    return { de, fa, zurueck: feld.getAttribute("placeholder") };
  });
  melde(!platzhalter.fehlt && platzhalter.fa !== platzhalter.de,
        'der Platzhalter eines Textfeldes wird mituebersetzt',
        'unveraendert: ' + String(platzhalter.de).slice(0, 60));
  melde(platzhalter.zurueck === platzhalter.de,
        'und kommt auf Deutsch wieder zurueck');

  // Jedes Werkzeug bringt sein eigenes Woerterbuch mit. Wiederholt es einen
  // Begriff aus der gemeinsamen Schicht, gilt weiter der gemeinsame - aber
  // dann steht derselbe Begriff an zwei Stellen, und die eine wird beim
  // naechsten Mal vergessen. Also: nennen.
  const doppelt = [];
  for (const datei of SEITEN_LISTE) {
    await oeffne(seite, datei);
    const d = await seite.evaluate(() => window.WZ_WOERTER_DOPPELT || []);
    if (d.length) doppelt.push(datei + ": " + d.join(", "));
  }
  melde(doppelt.length === 0,
        'kein eigenes Woerterbuch wiederholt die gemeinsame Schicht',
        doppelt.join(" | "));

  // Tote Schluessel. Ein Schluessel mit Tippfehler uebersetzt nichts und
  // sieht aus wie ein Wort, das eben noch deutsch ist - er faellt also nie
  // auf. Hier faellt er auf: jeder Schluessel eines Werkzeug-Woerterbuchs
  // muss auf seiner Seite auch wirklich stehen. Was das Werkzeug erst beim
  // Rechnen schreibt, ist im Woerterbuch als solches genannt.
  const tot = [];
  for (const datei of SEITEN_LISTE) {
    await oeffne(seite, datei);
    const offen2 = await seite.evaluate(() => {
      const eigen = window.WZ_WOERTER_EIGEN || [];
      if (!eigen.length) return [];
      const spaeter = new Set(window.WZ_WOERTER_DYNAMISCH || []);
      const da = new Set();
      const ueber = new Set(["SCRIPT", "STYLE", "NOSCRIPT"]);
      const geh = (n) => {
        if (n.nodeType === 3) { const v = n.textContent.trim(); if (v) da.add(v); return; }
        if (n.nodeType !== 1 || ueber.has(n.tagName)) return;
        for (const a of ["placeholder", "title", "aria-label", "value"])
          if (n.hasAttribute(a)) da.add(n.getAttribute(a).trim());
        for (let k = n.firstChild; k; k = k.nextSibling) geh(k);
      };
      geh(document.body);
      return eigen.filter(k => !da.has(k) && !spaeter.has(k));
    });
    if (offen2.length) tot.push(datei + ": " + offen2.join(" / "));
  }
  melde(tot.length === 0, 'kein Woerterbuch-Schluessel zeigt ins Leere',
        tot.join(" | "));

  // Der Waehler darf nichts Bedienbares zudecken - in keinem Werkzeug.
  const verdeckt = [];
  for (const datei of SEITEN_LISTE) {
    await oeffne(seite, datei);
    const drunter = await seite.evaluate(() => {
      const w = document.getElementById("wz-sprachwahl");
      if (!w) return "kein Waehler";
      const r = w.getBoundingClientRect();
      const tief = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        .filter(e => e !== w && !w.contains(e))
        .filter(e => /^(A|BUTTON|INPUT|SELECT|LABEL)$/.test(e.tagName) || e.onclick);
      return tief.length ? tief[0].tagName : null;
    });
    if (drunter) verdeckt.push(datei + ": " + drunter);
  }
  melde(verdeckt.length === 0, 'der Sprachwaehler deckt nichts Bedienbares zu',
        verdeckt.join(", "));

  // Die Luecke messen. Das ist keine Pruefung mit Grenzwert, sondern eine
  // Zahl, die im Bericht steht, damit der Stand nicht behauptet wird.
  //
  // Beide Sprachen, aber nicht mit demselben Mass - und das hat einen
  // Grund, der einmal falsch verstanden wurde:
  //
  //   Persisch: jeder sichtbare Text braucht einen Eintrag. Die Zahl der
  //   Texte ohne Eintrag ist damit die Luecke.
  //
  //   Englisch: die meisten Werkzeuge sind ohnehin englisch beschriftet
  //   ("Cable Size", "Export DXF"). Fuer sie ist nichts zu uebersetzen,
  //   und ein Eintrag waere ein Wort auf sich selbst. Dieselbe Zaehlung
  //   ergibt hier 1454 und sagt nichts. Was zaehlt, ist das Gegenteil:
  //   Text, der im Englisch-Modus noch DEUTSCH dasteht.
  //
  // Erkannt wird Deutsch an Umlauten und an den haeufigsten Fuellwoertern.
  // Das ist eine Heuristik und keine Sprachpruefung; sie findet ganze
  // Saetze sicher und kann ein einzelnes Wort uebersehen. Fuer den Zweck -
  // faellt deutscher Text auf einer englischen Seite auf? - reicht das.
  const DEUTSCH = '[\u00e4\u00f6\u00fc\u00df\u00c4\u00d6\u00dc]|' +
    '\\b(der|die|das|den|dem|des|und|oder|nicht|kein|keine|wird|werden|' +
    'ist|sind|war|ein|eine|einen|einem|mit|von|vom|zum|zur|bei|beim|auf|' +
    'aus|nach|durch|ohne|sich|wenn|dann|noch|schon|nur|auch|alle|jede|' +
    'jeder|diese|dieser|Anzahl|Datei|Hinweis|Grenze|Werkzeug|Eingabe)\\b';
  let offenFa = 0;
  const deutschGeblieben = [];
  for (const datei of SEITEN_LISTE) {
    await oeffne(seite, datei);
    const z = await seite.evaluate((q) => {
      const re = new RegExp(q);
      return {
        fa: UEBERSETZUNG.fehlende("fa").length,
        // Laenge > 1, weil MathJax jede Formel in einzelne Zeichen legt:
        // das "oe" aus "Delta P_Hoehe" ist ein Formelzeichen, kein Wort.
        de: UEBERSETZUNG.fehlende("en").filter(t => t.length > 1 && re.test(t))
      };
    }, DEUTSCH);
    offenFa += z.fa;
    z.de.forEach(t => deutschGeblieben.push(datei + ': ' + t.slice(0, 70)));
  }
  melde(true, 'noch ohne persische Uebersetzung: ' + offenFa + ' Texte in ' +
        SEITEN_LISTE.length + " Seiten");
  melde(true, 'im Englisch-Modus noch deutsch: ' + deutschGeblieben.length +
        ' Texte in ' + SEITEN_LISTE.length + " Seiten");
  if (deutschGeblieben.length) {
    deutschGeblieben.forEach(z => console.log(grau('    ' + z)));
  }
}

// ---------------------------------------------------------------------- Lauf
(async () => {
  const browser = await starteBrowser();
  const seite = await neueSeite(browser);
  const start = Date.now();
  try {
    await pruefeGruppen(seite);
    await pruefeNaN(seite);
    await pruefeStruktur(seite);
    await pruefeShop(seite);
    await pruefeKabeltabelle(seite);
    await pruefeDashboard(seite);
    pruefeKatalog();
    await pruefeKiHelfer(seite);
    await pruefeAussehen(seite);
    await pruefeMotorstrom(seite);
    await pruefeErdungBild(seite);
    await pruefeBewehrungsliste(seite);
    await pruefeUrsacheWirkung(seite);
    await pruefeLoopBeschriftung(seite);
    await pruefeSLD(seite);
    await pruefeTrassenPaar(seite);
    await pruefeTrasseStueckliste(seite);
    await pruefeStructureEingaben(seite);
    await pruefeBauCadTeile(seite);
    await pruefePhotoMassstab(seite);
    pruefeKatalogZusagen();
    await pruefeRechner(seite);
    await pruefeSprache(seite);
  } finally {
    await browser.close();
    serverSchliessen();
  }
  // Erst jetzt steht die Gesamtzahl fest. Sie muss zu der passen, mit der die
  // Verkaufsseite wirbt - sonst steht dort eine Zahl, die niemand mehr pflegt.
  if (behaupteteZahl !== null && !filter) {
    const gesamt = ok + schlecht + 1;          // diese Pruefung zaehlt sich mit
    melde(behaupteteZahl === gesamt,
          'die Verkaufsseite nennt die richtige Zahl der Pruefungen',
          'Seite: ' + behaupteteZahl + ', tatsaechlich: ' + gesamt);
  }

  const dauer = ((Date.now() - start) / 1000).toFixed(1);
  console.log('\n' + '-'.repeat(64));
  if (schlecht === 0) {
    console.log(gruen('  ' + ok + ' Pruefungen bestanden') + grau('   in ' + dauer + ' s'));
  } else {
    console.log(rot('  ' + schlecht + ' von ' + (ok + schlecht) + ' Pruefungen fehlgeschlagen') + grau('   in ' + dauer + ' s'));
    fehlerliste.forEach(z => console.log('    ' + rot('- ') + z));
  }
  process.exit(schlecht === 0 ? 0 : 1);
})();
