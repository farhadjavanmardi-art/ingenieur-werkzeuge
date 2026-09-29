// Widerstandsbeiwerte von Formstuecken - eine Stelle fuer alle Werkzeuge.
//
// ============================================================================
// WARUM ES DIESE DATEI GIBT
// ============================================================================
//
// Bis hierher hatten zwei Werkzeuge zwei verschiedene Zeta-Werte fuer
// dasselbe Formstueck:
//
//                        Druckverlust    Petrochem
//   Bogen 90 Grad           0,21           0,30
//   Absperrorgan            0,3            0,20   ("Valves")
//   Rueckschlagorgan        1,0 bis 1,5    2,50   ("Check Valve")
//
// Schlimmer als die Abweichung ist, was in Petrochem gar nicht unterschieden
// wurde: "Valves" mit 0,20 ist ein offener Absperrschieber. Ein
// Rueckschlagventil hat je nach Nennweite 5 bis 13 - das Fuenfundsechzigfache.
// In einem Werkzeug, das daraus die Pumpe auslegt.
//
// Das ist derselbe Fehler wie damals bei der Strombelastbarkeit: zwei
// Tabellen fuer dieselbe Groesse, 14 bis 26 Prozent auseinander. Er ist
// genauso geloest - es gibt nur noch diese Tabelle, und eine Pruefung haelt
// beide Werkzeuge dagegen.
//
// ============================================================================
// WOHER DIE ZAHLEN KOMMEN
// ============================================================================
//
// Es sind die ueblichen Tabellenwerte der Rohrleitungstechnik, wie sie in
// Handbuechern und Herstellerunterlagen stehen. Sie sind NICHT gegen den Text
// einer Norm geprueft - wir haben sie nicht vorliegen. Sie tragen deshalb
// bewusst keinen Normnamen.
//
// Zeta haengt bei Armaturen an der Nennweite: eine DN25-Armatur hat einen
// deutlich hoeheren Beiwert als dieselbe Bauart in DN200. Wo das so ist,
// steht type: "dn" und eine Wertetabelle; sonst type: "fest".
//
// Wer die Unterlagen seines Herstellers hat, traegt dessen Werte ein. Die
// Werkzeuge lassen den Beiwert ueberschreiben; was dort steht, gilt.

(function (ziel) {
  const FORMSTUECKE = {
    elbow90:  { name: "Rohrbogen 90° (r=d)",  type: "fest", k: 0.21 },
    elbow45:  { name: "Rohrbogen 45°",        type: "fest", k: 0.12 },
    tee_flow: { name: "T-Stück (Durchgang)",  type: "fest", k: 0.35 },
    tee_br:   { name: "T-Stück (Abzweig)",    type: "fest", k: 1.30 },
    gate:     { name: "Absperrschieber",      type: "dn",
                vals: { 25: 0.5, 32: 0.3, 40: 0.3, 50: 0.3, 80: 0.3, 100: 0.3, 200: 0.3 } },
    check_sw: { name: "Rückschlagklappe",     type: "dn",
                vals: { 25: 1.5, 50: 1.5, 65: 1.2, 80: 1.2, 100: 1.2, 150: 1.0, 200: 1.0 } },
    check_li: { name: "Rückschlagventil",     type: "dn",
                vals: { 25: 13, 32: 13, 40: 13, 50: 13, 65: 13, 80: 13, 100: 8, 200: 5 } },
    ball:     { name: "Kugelhahn",            type: "dn",
                vals: { 25: 0.12, 50: 0.12, 65: 0.11, 80: 0.1, 100: 0.1, 150: 0.08, 200: 0.07 } }
  };

  // Zeta fuer ein Formstueck bei einer Nennweite. Bei type "dn" wird der
  // naechstliegende Tabelleneintrag genommen, nicht zwischen zweien
  // interpoliert: die Werte sind Anhaltswerte, eine Interpolation taeuschte
  // eine Genauigkeit vor, die sie nicht haben.
  function zeta(schluessel, dn) {
    const teil = FORMSTUECKE[schluessel];
    if (!teil) return 0;
    if (teil.type === "fest") return teil.k;
    const weiten = Object.keys(teil.vals).map(Number).sort((a, b) => a - b);
    let treffer = weiten[0];
    const gesucht = parseInt(dn, 10);
    for (const w of weiten) {
      if (Math.abs(w - gesucht) <= Math.abs(treffer - gesucht)) treffer = w;
    }
    return teil.vals[treffer];
  }

  ziel.FORMSTUECKE = { WERTE: FORMSTUECKE, zeta: zeta };
})(typeof window !== "undefined" ? window : globalThis);
