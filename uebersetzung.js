// Sprachumschaltung Deutsch / Persisch / Englisch - eine Stelle fuer alle
// Werkzeuge.
//
// ============================================================================
// WIE SIE ARBEITET, UND WARUM SO
// ============================================================================
//
// Die Werkzeuge sind auf Deutsch geschrieben, der Text steht im HTML. Eine
// Uebersetzung kann deshalb zwei Wege gehen:
//
//   a) jeden Text im HTML mit einer Kennung versehen und den Text aus einer
//      Tabelle holen - sauber, aber ein Eingriff in alle 27 Dateien, und
//      jeder Eingriff ist eine Gelegenheit, etwas kaputtzumachen;
//   b) den fertigen Baum durchgehen und Text gegen Text tauschen.
//
// Hier steht b). Der Schluessel ist der deutsche Text selbst. Das hat eine
// Eigenschaft, die hier wichtiger ist als Eleganz: WAS NICHT IM WOERTERBUCH
// STEHT, BLEIBT DEUTSCH. Ein sichtbares deutsches Wort auf einer persischen
// Seite sagt die Wahrheit - es ist noch nicht uebersetzt. Ein falsches
// persisches Wort wuerde luegen, und in einem Werkzeug, das Kabel auslegt,
// ist das kein Schoenheitsfehler.
//
// Aus demselben Grund gibt es keine maschinelle Uebersetzung zur Laufzeit:
// sie braeuchte das Netz (die Werkzeuge laufen ohne), sie waere bei jedem
// Aufruf anders, und sie wuerde "Rueckschlagventil" und "Rueckschlagklappe"
// frueher oder spaeter verwechseln. Der Unterschied zwischen beiden ist in
// diesem Projekt der Faktor 65.
//
// Normnamen, Einheiten und Formelzeichen stehen nicht im Woerterbuch und
// bleiben damit unangetastet: IEC 60751 bleibt IEC 60751, mm2 bleibt mm2,
// cos phi bleibt cos phi.

(function (fenster) {
  'use strict';

  const SPEICHER = 'wz-sprache';
  const SPRACHEN = { de: 'Deutsch', fa: 'فارسی', en: 'English' };

  // Der Originaltext wird am Knoten gemerkt, damit das Zurueckschalten den
  // deutschen Text wiederherstellt und nicht eine Uebersetzung der
  // Uebersetzung.
  const ORIGINAL = new WeakMap();

  let aktuell = 'de';
  let beobachter = null;

  function woerter(sprache) {
    const w = fenster.WZ_WOERTER || {};
    return w[sprache] || null;
  }

  // Ein Text wird nur ersetzt, wenn er genau so im Woerterbuch steht.
  function uebersetze(text, buch) {
    const schluessel = text.trim();
    if (!schluessel) return null;
    const treffer = buch[schluessel];
    if (treffer === undefined) return null;
    // Vor- und nachlaufende Leerzeichen bleiben erhalten, sonst rutscht die
    // Anzeige zusammen.
    return text.replace(schluessel, treffer);
  }

  const UEBERSPRINGEN = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'CODE', 'PRE']);
  const ATTRIBUTE = ['placeholder', 'title', 'aria-label'];

  function gehDurch(knoten, buch) {
    if (knoten.nodeType === 3) {
      if (!ORIGINAL.has(knoten)) ORIGINAL.set(knoten, knoten.textContent);
      const roh = ORIGINAL.get(knoten);
      const neu = buch ? uebersetze(roh, buch) : null;
      const soll = neu === null ? roh : neu;
      if (knoten.textContent !== soll) knoten.textContent = soll;
      return;
    }
    if (knoten.nodeType !== 1) return;
    const ueberspringen = UEBERSPRINGEN.has(knoten.tagName);

    for (const a of ATTRIBUTE) {
      if (!knoten.hasAttribute(a)) continue;
      const merk = 'wzOrig' + a.replace(/-/g, '');
      if (knoten.dataset[merk] === undefined) knoten.dataset[merk] = knoten.getAttribute(a);
      const roh = knoten.dataset[merk];
      const neu = buch ? uebersetze(roh, buch) : null;
      knoten.setAttribute(a, neu === null ? roh : neu);
    }
    if (ueberspringen) return;
    for (let k = knoten.firstChild; k; k = k.nextSibling) gehDurch(k, buch);
  }

  // Persisch laeuft von rechts nach links. Zahlen, Einheiten und Formeln
  // duerfen das nicht mitmachen - deshalb kippt nur die Leserichtung des
  // Dokuments, und Eingabefelder mit Zahlen bleiben von links nach rechts.
  function leserichtung(sprache) {
    const rtl = (sprache === 'fa');
    document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', sprache);
    let stil = document.getElementById('wz-rtl-stil');
    if (!rtl) { if (stil) stil.remove(); return; }
    if (stil) return;
    stil = document.createElement('style');
    stil.id = 'wz-rtl-stil';
    // unicode-bidi: plaintext laesst JEDEN Textknoten seine Richtung aus
    // seinem ersten starken Zeichen bestimmen. Persischer Text laeuft
    // damit von rechts nach links, deutscher von links nach rechts - und
    // das ist hier entscheidend, weil die meisten Texte noch deutsch sind.
    //
    // Ohne diese Zeile reisst die Leserichtung alles mit: aus "0 kW" wird
    // sichtbar "kW 0", und der Punkt am Satzende springt an den Anfang.
    // Eine Zahl mit der Einheit auf der falschen Seite ist nicht nur
    // haesslich, sie ist falsch gelesen.
    stil.textContent =
      '[dir=rtl] * { unicode-bidi: plaintext; }' +
      '[dir=rtl] input[type=number], [dir=rtl] input[type=tel], ' +
      '[dir=rtl] .mono, [dir=rtl] code, [dir=rtl] pre ' +
      '{ direction: ltr; text-align: left; }';
    document.head.appendChild(stil);
  }

  function anwenden(sprache) {
    aktuell = SPRACHEN[sprache] ? sprache : 'de';
    const buch = (aktuell === 'de') ? null : woerter(aktuell);
    if (beobachter) beobachter.disconnect();
    gehDurch(document.body, buch);
    leserichtung(aktuell);
    knopfBeschriften();
    // Viele Werkzeuge bauen ihre Zeilen erst beim Rechnen. Ohne diesen
    // Beobachter waere alles uebersetzt, was beim Laden da war, und nichts
    // von dem, was der Benutzer erzeugt.
    if (beobachter) beobachter.observe(document.body, { childList: true, subtree: true });
    try { localStorage.setItem(SPEICHER, aktuell); } catch (e) { /* privates Fenster */ }
  }

  function knopfBeschriften() {
    const k = document.getElementById('wz-sprachknopf');
    if (k) k.value = aktuell;
  }

  function knopfBauen() {
    if (document.getElementById('wz-sprachwahl')) return;
    const huelle = document.createElement('div');
    huelle.id = 'wz-sprachwahl';
    huelle.style.cssText =
      'position:fixed; z-index:99999; ' +
      'font:12px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';
    const wahl = document.createElement('select');
    wahl.id = 'wz-sprachknopf';
    wahl.setAttribute('aria-label', 'Sprache');
    wahl.style.cssText =
      'background:var(--wz-flaeche-hoch,#223047); color:var(--wz-text,#e2e8f0); ' +
      'border:1px solid var(--wz-rand,#334155); border-radius:var(--wz-radius-klein,6px); ' +
      'padding:4px 8px; font:inherit; cursor:pointer; opacity:.85;';
    for (const s in SPRACHEN) {
      const o = document.createElement('option');
      o.value = s; o.textContent = SPRACHEN[s];
      wahl.appendChild(o);
    }
    wahl.addEventListener('change', () => anwenden(wahl.value));
    huelle.appendChild(wahl);
    document.body.appendChild(huelle);
    freienPlatzSuchen(huelle);
  }

  // Der Waehler liegt fest ueber der Seite. In zwei Werkzeugen sass dort
  // der Haus-Knopf - ein Bedienelement, das man nicht mehr trifft, ist
  // schlimmer als ein Waehler an einer ungewohnten Stelle. Darum werden
  // die Ecken der Reihe nach probiert, und genommen wird die erste, unter
  // der nichts Bedienbares liegt. Dasselbe Verfahren wie beim KI-Helfer.
  const ECKEN = [
    { top: '10px', left: '10px' },
    { top: '10px', right: '10px' },
    { bottom: '10px', left: '10px' },
    { top: '52px', left: '10px' }
  ];

  function freienPlatzSuchen(huelle) {
    for (const ecke of ECKEN) {
      huelle.style.top = huelle.style.bottom = huelle.style.left = huelle.style.right = '';
      for (const seite in ecke) huelle.style[seite] = ecke[seite];
      const r = huelle.getBoundingClientRect();
      if (!r.width) continue;
      const drunter = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
        .filter(e => e !== huelle && !huelle.contains(e))
        .filter(e => /^(A|BUTTON|INPUT|SELECT|LABEL)$/.test(e.tagName) || e.onclick);
      if (drunter.length === 0) return;
    }
    // Keine Ecke frei: dann lieber unter den Haus-Knopf, wo zwar etwas
    // sein kann, aber nichts Wichtiges liegt.
    huelle.style.top = '52px'; huelle.style.left = '10px';
    huelle.style.bottom = huelle.style.right = '';
  }

  function start() {
    knopfBauen();
    beobachter = new MutationObserver((aenderungen) => {
      if (aktuell === 'de') return;
      const buch = woerter(aktuell);
      if (!buch) return;
      beobachter.disconnect();
      for (const a of aenderungen) {
        a.addedNodes.forEach(n => gehDurch(n, buch));
      }
      beobachter.observe(document.body, { childList: true, subtree: true });
    });
    let gemerkt = 'de';
    try { gemerkt = localStorage.getItem(SPEICHER) || 'de'; } catch (e) { /* egal */ }
    anwenden(gemerkt);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  fenster.UEBERSETZUNG = {
    setze: anwenden,
    sprache: () => aktuell,
    sprachen: SPRACHEN,
    // Fuer die Pruefung: was auf dieser Seite sichtbar ist und im Woerterbuch
    // fehlt. So bleibt die Luecke messbar, statt sich zu verstecken.
    fehlende: function (sprache) {
      const buch = woerter(sprache) || {};
      const fehlt = new Set();
      const geh = (n) => {
        if (n.nodeType === 3) {
          const v = (ORIGINAL.get(n) !== undefined ? ORIGINAL.get(n) : n.textContent).trim();
          if (v && /[a-zA-ZäöüÄÖÜß]/.test(v)
              && buch[v] === undefined) fehlt.add(v);
          return;
        }
        if (n.nodeType !== 1 || UEBERSPRINGEN.has(n.tagName)) return;
        if (n.id === 'wz-sprachwahl') return;
        for (let k = n.firstChild; k; k = k.nextSibling) geh(k);
      };
      geh(document.body);
      return [...fehlt];
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
