// Strombelastbarkeit und Leiterdaten - eine Stelle fuer alle Werkzeuge.
//
// ============================================================================
// WOHER DIE ZAHLEN KOMMEN. Bitte vor dem ersten Projekt lesen.
// ============================================================================
//
// Bis hierher hatten zwei Werkzeuge zwei verschiedene Tabellen fuer dieselbe
// Groesse. Sie wichen um 14 bis 26 Prozent voneinander ab - bei 16 mm2 sagte
// das eine 100 A, das andere 85 A. Wer beide benutzte, bekam zwei Antworten
// und keinen Hinweis darauf, welche gilt.
//
// Dieser Widerspruch ist aufgeloest: es gibt nur noch diese Tabelle.
//
// WICHTIG, UND ES STEHT AUCH IM WERKZEUG AUF DEM BILDSCHIRM:
// Die Iz-Werte sind NICHT gegen den Text der DIN VDE 0298-4 geprueft. Wir
// haben die Norm nicht vorliegen. Sie tragen deshalb bewusst nicht deren
// Namen - eine Zahl mit einem Normnamen darauf, den niemand nachgesehen hat,
// ist schlimmer als eine Zahl ohne.
//
// Wo die beiden alten Tabellen sich widersprachen, steht hier der KLEINERE
// Wert. Das ist die sichere Richtung: eine zu klein angenommene
// Belastbarkeit fuehrt zu einem groesseren Leiter, nie zu einem zu kleinen.
// Bei 16 mm2 gilt also 85 A und nicht 100 A.
//
// Fuer 185, 240 und 300 mm2 gab es nur in einer der beiden Tabellen Werte.
// Die stehen hier unveraendert und sind mit quelle: "einzeln" markiert - sie
// haben keine zweite Meinung hinter sich und verdienen besondere Vorsicht.
//
// SO ERSETZEN SIE DIE TABELLE DURCH IHRE EIGENE:
// Ihr Haus hat die Norm. Tragen Sie Ihre Werte in die Spalte iz ein, setzen
// Sie GRUNDLAGE.geprueft auf true und GRUNDLAGE.quelle auf Ihre Fundstelle.
// Der Warnhinweis in den Werkzeugen verschwindet dann von selbst. Das ist so
// gedacht: er soll nur so lange stehen, wie er stimmt.
//
// Die Leiterwiderstaende r sind eine andere Sache - die sind gegen
// IEC 60228 geprueft und stimmen.
// ============================================================================

const STROMBELASTBARKEIT = {

  GRUNDLAGE: {
    geprueft: false,
    quelle: "Hausinterne Tabelle, aus zwei aelteren Tabellen zusammengefuehrt.",
    bedingungen: {
      leiter:      "Kupfer",
      isolierung:  "PVC, 70 Grad Leitertemperatur",
      umgebung:    "30 Grad Umgebungstemperatur",
      adern:       "3 belastete Adern",
      verlegeart:  "einzeln, frei oder auf einer Trasse (kein Buendel, kein Rohr)"
    },
    // Genau dieser Satz erscheint im Werkzeug, solange geprueft false ist.
    warnung:
      "Die Werte der Strombelastbarkeit sind nicht gegen DIN VDE 0298-4 " +
      "geprueft. Sie stammen aus einer hausinternen Tabelle und sind, wo zwei " +
      "Quellen sich widersprachen, zur sicheren Seite hin gewaehlt. Fuer eine " +
      "ausgefuehrte Anlage gegen die Norm pruefen.",
    // Die Widerstaende sind geprueft, die Belastbarkeit nicht. Das gehoert
    // getrennt gesagt, sonst zieht der eine Zweifel den anderen mit.
    widerstand_quelle: "IEC 60228, Leiterwiderstand bei 20 Grad"
  },

  // q   Nennquerschnitt in mm2
  // iz  Strombelastbarkeit in A unter den Bedingungen oben
  // r   Leiterwiderstand bei 20 Grad in Ohm/km, IEC 60228
  // d   Kabelaussendurchmesser in mm, Richtwert fuer die Verschraubung
  // kg  Gewicht in kg/m, Richtwert fuer die Trommelplanung
  // quelle  "beide" = beide alten Tabellen kannten den Querschnitt,
  //         "einzeln" = nur eine kannte ihn, also ohne zweite Meinung
  WERTE: [
    { q: 1.5,  iz: 19,  r: 12.1,   d: 12, kg: 0.14, quelle: "beide"   },
    { q: 2.5,  iz: 28,  r: 7.41,   d: 14, kg: 0.18, quelle: "beide"   },
    { q: 4,    iz: 37,  r: 4.61,   d: 16, kg: 0.25, quelle: "beide"   },
    { q: 6,    iz: 46,  r: 3.08,   d: 17, kg: 0.31, quelle: "beide"   },
    { q: 10,   iz: 64,  r: 1.83,   d: 19, kg: 0.48, quelle: "beide"   },
    { q: 16,   iz: 85,  r: 1.15,   d: 22, kg: 0.70, quelle: "beide"   },
    { q: 25,   iz: 110, r: 0.727,  d: 27, kg: 1.05, quelle: "beide"   },
    { q: 35,   iz: 136, r: 0.524,  d: 27, kg: 1.35, quelle: "beide"   },
    { q: 50,   iz: 165, r: 0.387,  d: 31, kg: 1.75, quelle: "beide"   },
    { q: 70,   iz: 211, r: 0.268,  d: 35, kg: 2.45, quelle: "beide"   },
    { q: 95,   iz: 256, r: 0.193,  d: 40, kg: 3.30, quelle: "beide"   },
    { q: 120,  iz: 294, r: 0.153,  d: 43, kg: 4.10, quelle: "beide"   },
    { q: 150,  iz: 334, r: 0.124,  d: 48, kg: 5.00, quelle: "beide"   },
    { q: 185,  iz: 456, r: 0.0991, d: 53, kg: 6.10, quelle: "einzeln" },
    { q: 240,  iz: 538, r: 0.0754, d: 60, kg: 7.90, quelle: "einzeln" },
    { q: 300,  iz: 621, r: 0.0601, d: 65, kg: 9.80, quelle: "einzeln" }
  ],

  // Minderungsfaktoren fuer die Verlegung. Richtwerte, ebenfalls ungeprueft.
  // Sie liegen hier, damit beide Werkzeuge dieselben benutzen.
  MINDERUNG: {
    frei:    { f: 1.00, text: "frei oder auf einer Trasse" },
    erde:    { f: 0.80, text: "im Erdreich"                },
    rohr:    { f: 0.70, text: "im Schutzrohr"              }
  },

  // Leiterwiderstand bei Betriebstemperatur. Geprueft, IEC 60228 mit dem
  // Temperaturbeiwert von Kupfer.
  ALPHA_CU: 0.00393,
  widerstandBei: function (r20, theta) {
    return r20 * (1 + this.ALPHA_CU * (theta - 20));
  },

  // Kleinster Querschnitt, der den Strom traegt. Gibt null zurueck, wenn
  // keiner reicht - nicht den groessten, denn "reicht nicht" ist eine
  // Antwort und 300 mm2 waere eine falsche.
  fuerStrom: function (strom, minderung) {
    const f = (minderung && this.MINDERUNG[minderung]) ? this.MINDERUNG[minderung].f : 1;
    for (const w of this.WERTE) {
      if (w.iz * f >= strom) return w;
    }
    return null;
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = STROMBELASTBARKEIT;
if (typeof window !== 'undefined') window.STROMBELASTBARKEIT = STROMBELASTBARKEIT;
