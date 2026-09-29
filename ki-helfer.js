/* Der KI-Helfer, wie ihn die Werkzeuge einbinden.

   Eine Datei fuer alle Werkzeuge und nicht eine Kopie je Werkzeug. In diesem
   Projekt sind zwei Kopien derselben Sache schon einmal auseinandergelaufen
   (zwei Strombelastbarkeits-Tabellen, 14 bis 26 Prozent Unterschied). Hier
   waere der Schaden kleiner, aber die Lehre dieselbe.

   Einbinden, am Ende des <body>:

     <script src="ki-helfer.js"></script>
     <script>
       KI_HELFER.einbauen({
         werkzeug: 'Regelventil-Auslegung',
         modus: 'deutung',
         ergebnisse: { resKv: 'Kv', resCv: 'Cv' }
       });
     </script>

   Der Knopf haengt unten rechts und ist zugeklappt. Er deckt nichts zu,
   bevor jemand ihn anfasst - die CAD-Werkzeuge brauchen ihre Flaeche.

   Der Schluessel fuer das Modell steht NICHT hier. Diese Datei laedt in
   jedem Browser und ist fuer jeden lesbar. Gefragt wird eine Edge Function,
   die den Schluessel aus app_config holt und selbst bremst. Der unten
   stehende Schluessel ist der oeffentliche (publishable) des Projekts; er
   ist zur Veroeffentlichung gedacht.

   Was das Modell hier NICHT tut: rechnen. Es bekommt die Zahlen, die das
   Werkzeug bereits ausgerechnet hat, und ordnet sie ein. Steht das nicht so
   auf dem Bildschirm, glaubt der Benutzer irgendwann, die Zahl kaeme vom
   Modell - deshalb steht der Hinweis fest unter jeder Antwort. */

(function () {
  'use strict';

  var SB_URL = 'https://xdjtirojdjxqfzpjvdkw.supabase.co';
  var SB_KEY = 'sb_publishable_IR7rx1CMy7QMF3skpSYOxg_jyJtirQ_';

  var STIL = [
    '.kih-knopf{position:fixed;right:18px;bottom:18px;z-index:2147483000;',
    /* Farbe und Ecken aus werkzeug-stil.css, mit Rueckfall fuer den Fall,
       dass ein Werkzeug den Stil nicht geladen hat. Vorher stand hier das
       Gruen der hellen Verkaufsseite - neben den Werkzeugen war das ein
       zwoelfter Gruenton. */
    '  background:var(--wz-akzent,#10b981);color:#05221a;border:none;',
    '  border-radius:var(--wz-radius,10px);cursor:pointer;',
    '  font:600 14px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;',
    '  padding:12px 18px;box-shadow:0 3px 14px rgba(15,23,42,.28)}',
    '.kih-knopf:hover{background:var(--wz-akzent-dunkel,#059669)}',
    '.kih-feld{position:fixed;right:18px;bottom:18px;z-index:2147483000;width:380px;',
    '  max-width:calc(100vw - 36px);max-height:calc(100vh - 36px);overflow:auto;',
    '  background:#fff;color:#0f172a;border:1px solid #e2e8f0;border-radius:12px;',
    '  box-shadow:0 8px 30px rgba(15,23,42,.22);',
    '  font:400 14px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}',
    '.kih-kopf{display:flex;align-items:center;justify-content:space-between;gap:10px;',
    '  padding:13px 15px;border-bottom:1px solid #e2e8f0}',
    '.kih-kopf b{font-size:14.5px;font-weight:700}',
    '.kih-zu{border:none;background:none;cursor:pointer;font-size:20px;line-height:1;',
    '  color:#64748b;padding:2px 6px}',
    '.kih-leib{padding:14px 15px}',
    '.kih-leib textarea{width:100%;box-sizing:border-box;font:inherit;font-size:14px;',
    '  padding:9px 11px;border:1.5px solid #e2e8f0;border-radius:8px;resize:vertical;',
    '  min-height:64px;color:#0f172a;background:#fff}',
    '.kih-leib textarea:focus{outline:none;border-color:var(--wz-akzent,#10b981)}',
    '.kih-senden{margin-top:10px;background:var(--wz-akzent,#10b981);color:#05221a;',
    '  border:none;border-radius:var(--wz-radius-klein,6px);cursor:pointer;',
    '  font:600 14px/1 inherit;padding:10px 16px}',
    '.kih-senden:hover:not(:disabled){background:var(--wz-akzent-dunkel,#059669)}',
    '.kih-senden:disabled{opacity:.55;cursor:default}',
    '.kih-antwort{margin-top:12px;white-space:pre-wrap;color:#0f172a}',
    '.kih-antwort.schlecht{color:#b45309}',
    '.kih-fuss{margin-top:12px;padding-top:10px;border-top:1px solid #e2e8f0;',
    '  color:#64748b;font-size:12.5px}',
    '@media print{.kih-knopf,.kih-feld{display:none}}',
    /* Die Werkzeuge sind verschieden hell. Ein weisses Feld auf einem
       dunklen Werkzeug sieht aus wie ein Fremdkoerper, und auf einem
       dunklen Werkzeug ist es ausserdem blendend hell. */
    '.kih-feld.kih-dunkel{background:#0f172a;color:#e2e8f0;border-color:#334155}',
    '.kih-feld.kih-dunkel .kih-kopf{border-bottom-color:#334155}',
    '.kih-feld.kih-dunkel .kih-zu{color:#94a3b8}',
    '.kih-feld.kih-dunkel textarea{background:#1e293b;color:#e2e8f0;border-color:#334155}',
    '.kih-feld.kih-dunkel .kih-antwort{color:#e2e8f0}',
    '.kih-feld.kih-dunkel .kih-antwort.schlecht{color:#fbbf24}',
    '.kih-feld.kih-dunkel .kih-fuss{border-top-color:#334155;color:#94a3b8}'
  ].join('');

/* Ist die Seite dunkel? Gemessen an der Helligkeit des Hintergrunds, den
   der Browser wirklich zeichnet - nicht geraten an einer CSS-Klasse, die
   in jedem Werkzeug anders heisst. */
  function seiteIstDunkel() {
    var el = document.body;
    while (el) {
      var farbe = getComputedStyle(el).backgroundColor || '';
      var m = farbe.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (m && (m[4] === undefined || parseFloat(m[4]) > 0.5)) {
        var hell = (0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3]) / 255;
        return hell < 0.5;
      }
      el = el.parentElement;   // durchsichtig: eine Ebene hoeher nachsehen
    }
    return false;
  }

  function stilEinmal() {
    if (document.getElementById('kih-stil')) return;
    var s = document.createElement('style');
    s.id = 'kih-stil';
    s.textContent = STIL;
    document.head.appendChild(s);
  }

  function text(el) {
    return el ? String(el.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }

  /* Die Beschriftung eines Eingabefelds, so wie der Benutzer sie sieht.
     Ohne sie stuende im Prompt "q_min: 12" - und das Modell muesste raten,
     was q_min bedeutet. */
  function beschriftung(el) {
    if (el.id) {
      var l = document.querySelector('label[for="' + el.id + '"]');
      if (l) return text(l);
    }
    var eltern = el.closest('label');
    if (eltern) return text(eltern).slice(0, 60);
    var vor = el.previousElementSibling;
    if (vor && /^(LABEL|SPAN|B|STRONG|SMALL|DIV)$/.test(vor.tagName)) {
      var t = text(vor);
      if (t && t.length < 60) return t;
    }
    return el.id || el.name || '';
  }

  /* Was der Benutzer eingetragen hat. Nur sichtbare, gefuellte Felder -
     ein ausgeblendeter Reiter gehoert nicht in die Frage, und ein leeres
     Feld sagt nichts. */
  function eingabenSammeln(wurzel) {
    var daten = {};
    var felder = (wurzel || document).querySelectorAll('input, select');
    for (var i = 0; i < felder.length; i++) {
      var el = felder[i];
      if (el.type === 'hidden' || el.type === 'button' || el.type === 'submit') continue;
      if (el.disabled || el.offsetParent === null) continue;
      var wert = '';
      if (el.type === 'checkbox' || el.type === 'radio') {
        if (!el.checked) continue;
        wert = 'ja';
      } else if (el.tagName === 'SELECT') {
        wert = el.options[el.selectedIndex] ? text(el.options[el.selectedIndex]) : '';
      } else {
        wert = String(el.value || '').trim();
      }
      if (!wert) continue;
      var name = beschriftung(el);
      if (!name) continue;
      daten[name] = wert;
    }
    return daten;
  }

  function einbauen(konfig) {
    konfig = konfig || {};
    var modus = konfig.modus || 'deutung';
    var werkzeugName = konfig.werkzeug || document.title || 'unbekannt';
    var ergebnisse = konfig.ergebnisse || {};

    stilEinmal();

    var knopf = document.createElement('button');
    knopf.className = 'kih-knopf';
    knopf.type = 'button';
    knopf.textContent = konfig.knopf || 'KI fragen';

    var feld = document.createElement('div');
    feld.className = 'kih-feld' + (seiteIstDunkel() ? ' kih-dunkel' : '');
    feld.style.display = 'none';
    feld.innerHTML =
      '<div class="kih-kopf"><b>' + (konfig.titel || 'Einordnung') + '</b>' +
      '<button class="kih-zu" type="button" aria-label="Schliessen">&times;</button></div>' +
      '<div class="kih-leib">' +
        '<textarea maxlength="600" placeholder="' +
          (konfig.platzhalter || 'Frage dazu, optional.') + '"></textarea>' +
        '<button class="kih-senden" type="button">Fragen</button>' +
        '<div class="kih-antwort"></div>' +
        '<div class="kih-fuss">Die Zahlen kommen aus der Formel im Werkzeug. ' +
        'Das Modell ordnet sie nur ein.</div>' +
      '</div>';

    document.body.appendChild(knopf);
    document.body.appendChild(feld);

    /* Dem Knopf einen freien Platz geben.

       Er haengt unten rechts, und in einem der Werkzeuge lag dort schon der
       Exportknopf - der schwebende Knopf deckte ihn zu, und zugedeckt heisst
       nicht anklickbar. Das ist kein Schoenheitsfehler, sondern eine
       verlorene Funktion.

       Statt in jedem Werkzeug nachzumessen, sieht der Knopf selbst nach, was
       unter ihm liegt, und rutscht hoch, bis nichts Bedienbares mehr darunter
       ist. Ein Werkzeug, das spaeter dazukommt, ist damit auch bedacht. */
    function stelleIstFrei() {
      var r = knopf.getBoundingClientRect();
      knopf.style.visibility = 'hidden';
      var frei = true;
      var punkte = [[r.left + 4, r.top + 4], [r.right - 4, r.top + 4],
                    [r.left + 4, r.bottom - 4], [r.right - 4, r.bottom - 4]];
      for (var i = 0; i < punkte.length; i++) {
        var el = document.elementFromPoint(punkte[i][0], punkte[i][1]);
        if (el && el.closest &&
            el.closest('button, a[href], a[onclick], input, select, textarea, [onclick]')) {
          frei = false; break;
        }
      }
      knopf.style.visibility = '';
      return frei;
    }

    function freienPlatzSuchen() {
      var hoehe = knopf.getBoundingClientRect().height || 40;
      // Erst die rechte Spalte von unten nach oben, dann die linke. Ein
      // Werkzeug wie die E-Technik-Toolbox hat rechts einen ganzen
      // Taschenrechner aus Knoepfen - dort ist senkrecht nichts frei, links
      // schon.
      var seiten = [['right', '18px'], ['left', '18px']];
      for (var sp = 0; sp < seiten.length; sp++) {
        knopf.style.left = ''; knopf.style.right = '';
        knopf.style[seiten[sp][0]] = seiten[sp][1];
        for (var schritt = 0; schritt < 10; schritt++) {
          knopf.style.bottom = (18 + schritt * (hoehe + 10)) + 'px';
          if (stelleIstFrei()) {
            // Das Feld folgt dem Knopf, sonst klappt es woanders auf.
            feld.style.left = ''; feld.style.right = '';
            feld.style[seiten[sp][0]] = seiten[sp][1];
            return;
          }
        }
      }
      // Nichts gefunden: zurueck an die Ausgangsstelle. Ein Knopf an einem
      // willkuerlichen Platz waere schlimmer als einer, der etwas ueberlappt.
      knopf.style.left = ''; knopf.style.right = '18px';
      knopf.style.bottom = '18px';
    }
    // Erst wenn das Werkzeug fertig aufgebaut hat - vorher steht noch nichts
    // da, wo spaeter ein Knopf sitzt.
    if (document.readyState === 'complete') setTimeout(freienPlatzSuchen, 0);
    else window.addEventListener('load', function () { setTimeout(freienPlatzSuchen, 0); });

    var eingabe  = feld.querySelector('textarea');
    var senden   = feld.querySelector('.kih-senden');
    var antwort  = feld.querySelector('.kih-antwort');

    function auf()  { feld.style.display = ''; knopf.style.display = 'none'; eingabe.focus(); }
    function zu()   { feld.style.display = 'none'; knopf.style.display = ''; }
    knopf.addEventListener('click', auf);
    feld.querySelector('.kih-zu').addEventListener('click', zu);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && feld.style.display !== 'none') zu();
    });

    function sage(t, schlecht) {
      antwort.textContent = t;
      antwort.className = 'kih-antwort' + (schlecht ? ' schlecht' : '');
    }

    function daten() {
      var d = konfig.sammeln ? konfig.sammeln() : eingabenSammeln(konfig.wurzel);
      /* Die Ergebnisse zuletzt, damit sie eine gleichnamige Eingabe
         ueberschreiben und nicht umgekehrt. */
      for (var id in ergebnisse) {
        var el = document.getElementById(id);
        var w = text(el);
        if (w && w !== '---' && w !== '-') d[ergebnisse[id]] = w;
      }
      return d;
    }

    async function fragen() {
      var d = daten();
      var frage = eingabe.value.trim();
      if (!frage && !Object.keys(d).length) {
        sage('Erst rechnen lassen oder eine Frage eintippen.', true);
        return;
      }
      senden.disabled = true;
      sage('Wird gelesen ...');
      try {
        var res = await fetch(SB_URL + '/functions/v1/werkzeug-assistent', {
          method: 'POST',
          headers: {
            'apikey': SB_KEY, 'Authorization': 'Bearer ' + SB_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            modus: modus, werkzeug: werkzeugName, frage: frage, daten: d
          })
        });
        var j = await res.json().catch(function () { return {}; });
        if (!res.ok || j.fehler) {
          sage(j.fehler || 'Der Dienst antwortet gerade nicht.', true);
          return;
        }
        sage(j.antwort || 'Keine Antwort erhalten.', !j.antwort);
      } catch (_e) {
        sage('Keine Verbindung. Das Werkzeug rechnet ohne den Dienst weiter.', true);
      } finally {
        senden.disabled = false;
      }
    }

    senden.addEventListener('click', fragen);
    eingabe.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) fragen();
    });

    /* Nach aussen sichtbar, damit die Pruefung nachsehen kann, was wirklich
       abgeschickt wuerde. Ohne das liesse sich nur pruefen, dass ein Knopf
       da ist - und nicht, ob das Ergebnis des Werkzeugs auch ankommt. */
    var griff = {
      modus: modus, werkzeug: werkzeugName,
      daten: daten, oeffnen: auf, schliessen: zu, fragen: fragen
    };
    window.KI_HELFER.letzter = griff;
    return griff;
  }

  window.KI_HELFER = {
    einbauen: einbauen, eingabenSammeln: eingabenSammeln, letzter: null
  };
})();
