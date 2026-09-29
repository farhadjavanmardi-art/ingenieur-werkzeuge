// Die Pruefaelle.
//
// Die Sollwerte stammen nicht aus einer Formel im Kopf, sondern sind an den
// Werkzeugen selbst gemessen worden, nachdem der jeweilige Fehler behoben und
// das Ergebnis von Hand nachgerechnet war. Sie halten den Stand fest: aendert
// jemand eine Formel, wird die Pruefung rot.
//
// Ein Sollwert darf nur geaendert werden, wenn klar ist, WARUM das Ergebnis
// jetzt ein anderes sein soll. Sonst ist die rote Pruefung der Befund.

// ---------------------------------------------------------------- Regelventil
const regelventil = {
  datei: 'Regelventil.html',
  titel: 'Regelventil, Kv nach IEC 60534',
  faelle: [
    { name: 'Fluessigkeit, unterkritisch',
      vor: "setFluid('liquid')", werte: { p1:'6', p2:'4.5', flow:'25', rho:'998', temp:'20', pv:'0.023' },
      ruf: 'calculate()', soll: { resKv: '20.41' } },

    { name: 'Fluessigkeit, Kavitation',
      vor: "setFluid('liquid')", werte: { p1:'10', p2:'1', flow:'40', rho:'998', temp:'20', pv:'0.023' },
      ruf: 'calculate()', soll: { resKv: '14.07' }, enthaelt: { flowStatus: 'KAVITATION' } },

    { name: 'Fluessigkeit, Klappe FL 0,65 braucht groesseres Kv',
      vor: "setFluid('liquid')", werte: { p1:'10', p2:'1', flow:'40', rho:'998', temp:'20', pv:'0.023', FL:'0.65' },
      ruf: 'calculate()', soll: { resKv: '19.48' } },

    // Die Gaswerte haben sich verschoben, weil die Voreinstellung fuer xT vom
    // krummen 0,70 auf den Tabellenwert 0,72 geht - das ist der Wert fuer das
    // Durchgangsventil mit Parabolkegel, also fuer die Bauart, die jetzt auch
    // in der Auswahl steht. Von Hand nachgerechnet: x = 0,1667, x_krit = 0,72,
    // Y = 0,9228, Kv = 500/(514*0,9228)*sqrt(0,93023*293,15/6) = 7,11.
    { name: 'Gas, unterkritisch, Y wirkt',
      vor: "setFluid('gas')", werte: { p1:'6', p2:'5', flow:'500', rho:'1.2', temp:'20' },
      ruf: 'calculate()', soll: { resKv: '7.11' } },

    { name: 'Gas, x=0,67 noch unter x_krit=0,72',
      vor: "setFluid('gas')", werte: { p1:'6', p2:'2', flow:'500', rho:'1.2', temp:'20' },
      ruf: 'calculate()', soll: { resKv: '4.74' }, enthaelt: { flowStatus: 'UNTERKRITISCH' } },

    { name: 'Gas, kritisch, dp begrenzt',
      vor: "setFluid('gas')", werte: { p1:'10', p2:'1', flow:'1000', rho:'1.2', temp:'20' },
      ruf: 'calculate()', soll: { resKv: '5.68' }, enthaelt: { flowStatus: 'KRITISCHE' } },

    { name: 'Gas, Klappe xT 0,35 wird frueher kritisch',
      vor: "setFluid('gas')", werte: { p1:'6', p2:'2', flow:'500', rho:'1.2', temp:'20', xT:'0.35' },
      ruf: 'calculate()', soll: { resKv: '6.79' }, enthaelt: { flowStatus: 'KRITISCHE' } },

    { name: 'Dampf, spez. Volumen geht ein',
      vor: "setFluid('steam')", werte: { p1:'10', p2:'6', flow:'1000', rho:'0.19', temp:'180' },
      ruf: 'calculate()', soll: { resKv: '8.46' } },

    { name: 'Dampf ohne spez. Volumen verlangt die Dampftafel',
      vor: "setFluid('steam')", werte: { p1:'10', p2:'6', flow:'1000', temp:'180' },
      ruf: 'calculate()', soll: { resKv: '--' }, enthaelt: { flowStatus: 'DAMPFTAFEL' } },

    // Die Bauart setzt FL und xT. Dass beide Felder danach noch frei sind,
    // haelt der Fall darueber fest (FL 0,65 von Hand).
    { name: 'die Bauart setzt FL und xT auf die Tabellenwerte',
      vor: "setFluid('liquid')", werte: { ventilBauart:'0.55|0.20' },
      ruf: 'bauartWechsel(); document.getElementById("resKv").textContent = document.getElementById("FL").value + " / " + document.getElementById("xT").value;',
      soll: { resKv: '0.55 / 0.20' } },

    // Der Grund, warum die Bauart nicht egal ist: bei P1 = 6 auf P2 = 2 bar
    // ist das Durchgangsventil noch nicht kritisch, die 90-Grad-Klappe schon.
    // Mit dem frueher festen FL = 0,9 waere die Klappe zu klein gewaehlt
    // worden - und zu klein heisst, sie schafft den Durchfluss nicht.
    { name: 'Durchgangsventil bei P1 6 auf P2 2: Kv 12,50',
      vor: "setFluid('liquid')",
      werte: { p1:'6', p2:'2', flow:'25', rho:'998', temp:'20', pv:'0.023',
               ventilBauart:'0.90|0.72' },
      ruf: 'bauartWechsel()', soll: { resKv: '12.50' } },
    { name: 'dieselbe Aufgabe mit der 90-Grad-Klappe: Kv 18,59',
      vor: "setFluid('liquid')",
      werte: { p1:'6', p2:'2', flow:'25', rho:'998', temp:'20', pv:'0.023',
               ventilBauart:'0.55|0.20' },
      ruf: 'bauartWechsel()', soll: { resKv: '18.59' } },

    // Ventilautoritaet. Der Kv sagt, wieviel durchgeht; die Autoritaet sagt,
    // ob man es regeln kann.
    { name: 'Autoritaet 0,43 bei 1,5 bar am Ventil und 2 bar Anlage',
      vor: "setFluid('liquid')",
      werte: { p1:'6', p2:'4.5', flow:'25', rho:'998', temp:'20', pv:'0.023', dpAnlage:'2' },
      ruf: 'calculate(); updateSim();',
      enthaelt: { resAutoritaet: '0.43 (brauchbar)' } },
    { name: 'dieselbe Aufgabe mit 10 bar Anlagenverlust ist nicht mehr regelbar',
      vor: "setFluid('liquid')",
      werte: { p1:'6', p2:'4.5', flow:'25', rho:'998', temp:'20', pv:'0.023', dpAnlage:'10' },
      ruf: 'calculate(); updateSim();',
      enthaelt: { resAutoritaet: 'nicht regelbar' } },
  ],
};

// ----------------------------------------------------------------------- Load
// Der Motorabgang hat zwei Schutzfunktionen, und frueher stand hier eine
// einzige "empfohlene Sicherung" - bemessen auf den Nennstrom, also genau die
// Groesse, die beim Anlauf durchbrennt. Bei 30 kW waren das 63 A gG neben
// einem Anlaufstrom von 377 A.
//
// Die Sollwerte unten sind gegen die ueblichen Auswahltabellen gehalten:
// 30 kW direkt -> 100 A gG, 7,5 kW -> 25 A, 110 kW -> 315 A, aM jeweils auf
// den Nennstrom. Wer die Rechnung aendert, sieht hier, ob sie noch zu dem
// passt, was ein Schaltschrankbauer einbauen wuerde.
const load_motor = {
  datei: 'Load.html',
  titel: 'Load, Motorschutz nach VDE 0100-430',
  faelle: [
    { name: '30 kW, Direktanlauf 3 s: gG traegt den Anlauf',
      werte: { mo_kw:'30', mo_eff:'93.6', mo_pf:'0.86', mo_ia:'7', mo_ta:'3' },
      ruf: 'calcMotor()',
      soll: { mo_det_fuse: '100 A gG', mo_det_fuse_sd: '63 A gG', mo_det_fuse_am: '63 A aM' },
      enthaelt: { mo_det_ueberlast: 'In', mo_det_dol: '7.0x In' } },

    { name: '7,5 kW, Ia/In 6,5',
      werte: { mo_kw:'7.5', mo_eff:'88.5', mo_pf:'0.84', mo_ia:'6.5', mo_ta:'2' },
      ruf: 'calcMotor()',
      soll: { mo_det_fuse: '25 A gG', mo_det_fuse_am: '16 A aM' } },

    { name: '110 kW, Anlaufzeit 5 s',
      werte: { mo_kw:'110', mo_eff:'95.8', mo_pf:'0.88', mo_ia:'7', mo_ta:'5' },
      ruf: 'calcMotor()',
      soll: { mo_det_fuse: '315 A gG', mo_det_fuse_am: '200 A aM' } },

    { name: 'laengerer Anlauf verlangt die groessere Sicherung',
      werte: { mo_kw:'30', mo_eff:'93.6', mo_pf:'0.86', mo_ia:'7', mo_ta:'8' },
      ruf: 'calcMotor()',
      soll: { mo_det_fuse: '125 A gG' } },

    { name: 'Stern-Dreieck zieht ein Drittel, nicht eine Faustzahl',
      werte: { mo_kw:'30', mo_eff:'93.6', mo_pf:'0.86', mo_ia:'6', mo_ta:'3' },
      ruf: 'calcMotor()',
      enthaelt: { mo_det_sd: '2.0x In' } },

    { name: 'die Grundlage steht auf dem Schirm, nicht nur im Kopf',
      werte: { mo_kw:'30', mo_eff:'93.6', mo_pf:'0.86', mo_ia:'7', mo_ta:'3' },
      ruf: 'calcMotor()',
      enthaelt: { mo_grundlage: 'VDE 0100-430' } },
  ],
};

const load = {
  datei: 'Load.html',
  titel: 'Load, Trafo-Normreihe',
  faelle: [
    { name: '900 kW',  werte: { tr_kw:'900',  tr_sim:'1', tr_pf:'0.9', tr_res:'0' }, ruf:'calcTrafo()', soll:{ tr_res_size:'1250 kVA' } },
    { name: '1100 kW', werte: { tr_kw:'1100', tr_sim:'1', tr_pf:'0.9', tr_res:'0' }, ruf:'calcTrafo()', soll:{ tr_res_size:'1250 kVA' } },
    { name: '1150 kW liegt in der frueher uebersprungenen Luecke',
                       werte: { tr_kw:'1150', tr_sim:'1', tr_pf:'0.9', tr_res:'0' }, ruf:'calcTrafo()', soll:{ tr_res_size:'1600 kVA' } },
    { name: '1250 kW', werte: { tr_kw:'1250', tr_sim:'1', tr_pf:'0.9', tr_res:'0' }, ruf:'calcTrafo()', soll:{ tr_res_size:'1600 kVA' } },
    { name: '1400 kW', werte: { tr_kw:'1400', tr_sim:'1', tr_pf:'0.9', tr_res:'0' }, ruf:'calcTrafo()', soll:{ tr_res_size:'1600 kVA' } },
    { name: '1450 kW', werte: { tr_kw:'1450', tr_sim:'1', tr_pf:'0.9', tr_res:'0' }, ruf:'calcTrafo()', soll:{ tr_res_size:'2000 kVA' } },
  ],
};

// ------------------------------------------------------------------- Erdung
const erdung = {
  datei: 'Earthing_CADE.html',
  titel: 'Earthing, Erdungswiderstand',
  faelle: [
    { name: '40x25 m, Raster 10, Eckstaebe',
      werte:{ rho:'100', dimL:'40', dimW:'25', gridSize:'10', rodConfig:'corners', rodLen:'3.0', rodDia:'20', rodEta:'0.75' },
      ruf:'updateCalc()', soll:{ resOhm:'1.55 Ω' } },
    { name: '40x25 m, umlaufend',
      werte:{ rho:'100', dimL:'40', dimW:'25', gridSize:'10', rodConfig:'perimeter', rodLen:'3.0', rodDia:'20', rodEta:'0.75' },
      ruf:'updateCalc()', soll:{ resOhm:'1.17 Ω' } },
    { name: '40x25 m, nur Fundamenterder',
      werte:{ rho:'100', dimL:'40', dimW:'25', gridSize:'10', rodConfig:'none' },
      ruf:'updateCalc()', soll:{ resOhm:'1.81 Ω' } },
    { name: 'Sandboden rho 500, 60x40 m',
      werte:{ rho:'500', dimL:'60', dimW:'40', gridSize:'5', rodConfig:'perimeter', rodLen:'3.0', rodDia:'20', rodEta:'0.75' },
      ruf:'updateCalc()', soll:{ resOhm:'3.41 Ω' } },
    { name: 'duennerer Stab 16 mm ergibt hoeheren Widerstand',
      werte:{ rho:'100', dimL:'40', dimW:'25', gridSize:'10', rodConfig:'corners', rodLen:'3.0', rodDia:'16', rodEta:'0.75' },
      ruf:'updateCalc()', soll:{ resOhm:'1.56 Ω' } },
    { name: 'Ausnutzungsgrad 0,60 ergibt hoeheren Widerstand',
      werte:{ rho:'100', dimL:'40', dimW:'25', gridSize:'10', rodConfig:'corners', rodLen:'3.0', rodDia:'20', rodEta:'0.6' },
      ruf:'updateCalc()', soll:{ resOhm:'1.60 Ω' } },
  ],
};

// --------------------------------------------------------------- Petrochem
// Zeile 6 der DN-Tabelle ist DN 100 und fuer 50 m3/h die sinnvolle Groesse.
const petrochem = {
  datei: 'Petrochem_Hydraulic_Analysis.html',
  titel: 'Petrochem, Leistung und NPSHa',
  nach: 'selectRow(6)',
  faelle: [
    // Die Leistungswerte haben sich mit den gemeinsamen Beiwerten aus
    // formstuecke.js geaendert: der Bogen 90 Grad steht dort mit 0,21 statt
    // 0,30, und aus dem einen Feld "Valves" sind Absperrschieber, Kugelhahn,
    // Rueckschlagklappe und Rueckschlagventil geworden. Zeta faellt damit von
    // 7,50 auf 5,96 bei DN100 - und haengt jetzt an der Nennweite, was in
    // einem Werkzeug, das Nennweiten vergleicht, der Punkt ist.
    { name: 'bergauf +5 m',  werte:{ h_stat:'5'   }, ruf:'runAnalysis()', soll:{ sel_phyd:'1.19', sel_npsh:'9.93' } },
    { name: 'eben 0 m',      werte:{ h_stat:'0'   }, ruf:'runAnalysis()', soll:{ sel_phyd:'0.51', sel_npsh:'9.93' } },
    { name: 'bergab -15 m laeuft von allein', werte:{ h_stat:'-15' }, ruf:'runAnalysis()', soll:{ sel_phyd:'0.00', sel_npsh:'9.93' } },
    { name: 'Saughub -9,5 m: Kavitation',
      werte:{ h_stat:'5', z_saug:'-9.5' }, ruf:'runAnalysis()', soll:{ sel_npsh:'0.43' }, enthaelt:{ npsh_badge:'KAVITATION' } },
    { name: 'Saugbehaelter im Vakuum 0,3 bar a',
      werte:{ h_stat:'5', p_saug:'0.3' }, ruf:'runAnalysis()', soll:{ sel_npsh:'2.66' } },
    { name: 'Saugleitung 60 statt 10 m',
      werte:{ h_stat:'5', l_saug:'60' }, ruf:'runAnalysis()', soll:{ sel_npsh:'8.54' } },
    // Der eigentliche Befund: frueher war beides dasselbe Feld. Ein
    // Rueckschlagventil hat je nach Nennweite 5 bis 13, eine Klappe 1,0 bis
    // 1,5 - in derselben Leitung sind das 19 Prozent mehr Strom im Jahr.
    { name: 'Rueckschlagventil statt Klappe kostet 19 Prozent mehr Strom',
      werte:{ h_stat:'5', n_check_sw:'0', n_check_li:'1' }, ruf:'runAnalysis()',
      soll:{ sel_phyd:'1.42' }, enthaelt:{ sel_cost:'4,063' } },
    { name: 'dieselbe Anlage mit Klappe', werte:{ h_stat:'5' }, ruf:'runAnalysis()',
      enthaelt:{ sel_cost:'3,412' } },
    // In JavaScript ist 0 || 0.25 gleich 0.25. Null Euro je kWh bei
    // Eigenerzeugung und null Stunden bei einer Reserveleitung sind aber
    // gueltige Eingaben - beide gaben vorher stillschweigend 3.412 Euro.
    { name: 'null Euro je kWh kostet null, nicht 3.412',
      werte:{ h_stat:'5', cost:'0' }, ruf:'runAnalysis()', enthaelt:{ sel_cost:'0' } },
    { name: 'null Betriebsstunden kosten null, nicht 3.412',
      werte:{ h_stat:'5', hours:'0' }, ruf:'runAnalysis()', enthaelt:{ sel_cost:'0' } },
  ],
};

// ------------------------------- Dieselben Formstuecke in beiden Werkzeugen
// Wie bei der Strombelastbarkeit: zwei Werkzeuge, eine Tabelle. Wer in
// formstuecke.js etwas aendert und nur eines der beiden anpasst, bekommt hier
// eine rote Zeile.
const formstuecke_gleich = {
  datei: 'Druckverlustberechnung.html',
  titel: 'Dieselben Formstuecke in beiden Werkzeugen',
  faelle: [
    { name: 'Bogen 90 Grad: 0,21 in beiden', werte:{},
      ruf:'document.getElementById("resTotalPa").textContent = String(getZeta("elbow90", 100));',
      soll:{ resTotalPa:'0.21' } },
    { name: 'Absperrschieber haengt an der Nennweite', werte:{},
      ruf:'document.getElementById("resTotalPa").textContent = FORMSTUECKE.zeta("gate",25)+" / "+FORMSTUECKE.zeta("gate",100);',
      soll:{ resTotalPa:'0.5 / 0.3' } },
    { name: 'Rueckschlagventil ist keine Kleinigkeit', werte:{},
      ruf:'document.getElementById("resTotalPa").textContent = FORMSTUECKE.zeta("check_li",50)+" / "+FORMSTUECKE.zeta("check_li",200);',
      soll:{ resTotalPa:'13 / 5' } },
  ],
};

// ------------------------------------------------------------- Hydrocyclone
const hydrocyclone = {
  datei: 'Hydrocyclone.html',
  titel: 'Hydrocyclone, Gueltigkeitsbereich',
  faelle: [
    { name: 'gueltige Vorgaben', werte:{}, ruf:'recalc()',
      soll:{ res_d50DNapp:'57.0 µm', res_Dtheor:'1061 mm' } },
    { name: 'Feststoff 60 % liegt ueber der C1-Grenze', werte:{ inp_c:'60' }, ruf:'recalc()',
      soll:{ res_d50DNapp:'--', res_Dtheor:'--' }, enthaelt:{ res_grenze:'C1' } },
    { name: 'Druckabfall 0 bar', werte:{ inp_dp:'0' }, ruf:'recalc()',
      soll:{ res_d50DNapp:'--' }, enthaelt:{ res_grenze:'C2' } },
    { name: 'Gs gleich Gl', werte:{ inp_Gs:'1.0', inp_Gl:'1.0' }, ruf:'recalc()',
      soll:{ res_d50DNapp:'--' }, enthaelt:{ res_grenze:'C3' } },
  ],
};

// -------------------------------------------------- Kabel und Spannungsfall
const kabeldim = {
  datei: 'Kabeldimensionierung_Spannungsfall.html',
  titel: 'Kabeldimensionierung, Spannungsfall bei Betriebstemperatur',
  faelle: [
    { name: '30 kW, 80 m, Cu, 70 Grad',
      werte:{ material:'cu', leiterTemp:'70', pf:'0.9', power:'30', length:'80' },
      ruf:'calculateCable()', enthaelt:{ finalRecommendation:'16 mm' } },
    { name: '12 kW, 200 m: bei 70 Grad eine Nummer groesser',
      werte:{ material:'cu', leiterTemp:'70', pf:'0.9', power:'12', length:'200' },
      ruf:'calculateCable()', enthaelt:{ finalRecommendation:'16 mm' } },
    { name: '12 kW, 200 m: bei 20 Grad der alte, zu kleine Wert',
      werte:{ material:'cu', leiterTemp:'20', pf:'0.9', power:'12', length:'200' },
      ruf:'calculateCable()', enthaelt:{ finalRecommendation:'10 mm' } },
    // Der induktive Anteil fehlte frueher ganz, dafuer fehlte auch cos phi.
    // Bei grossen Querschnitten ueberwiegt der erste Fehler: 250 A auf 250 m
    // ergaben 240 mm2, richtig sind 300. Zu klein ist beim Kabel die
    // gefaehrliche Richtung - dieser Fall haelt sie fest.
    { name: '250 A, 250 m, cos phi 0,8: der induktive Anteil entscheidet',
      werte:{ material:'cu', leiterTemp:'70', pf:'0.8', current:'250', length:'250',
              power:'', reaktanz:'0.08' },
      ruf:'calculateCable()', enthaelt:{ finalRecommendation:'300 mm' } },
    { name: 'derselbe Fall zeigt, wie gross der induktive Anteil ist',
      werte:{ material:'cu', leiterTemp:'70', pf:'0.8', current:'250', length:'250',
              power:'', reaktanz:'0.08' },
      ruf:'calculateCable()', enthaelt:{ tempHinweis:'induktiv 5.20 V (45 %)' } },
    // Bei kleinen Querschnitten ueberwiegt der andere Fehler: ohne cos phi kam
    // zu viel heraus und das Kabel wurde unnoetig dick.
    { name: '63 A, 80 m: mit cos phi reicht eine Nummer kleiner',
      werte:{ material:'cu', leiterTemp:'70', pf:'0.9', current:'63', length:'80',
              power:'', reaktanz:'0.08' },
      ruf:'calculateCable()', enthaelt:{ finalRecommendation:'16 mm' } },
    { name: 'Gleichstrom hat keinen induktiven Anteil',
      werte:{ systemType:'dc', voltage:'24', current:'100', length:'20', power:'',
              material:'cu', leiterTemp:'70' },
      ruf:'calculateCable()',
      enthaelt:{ finalRecommendation:'150 mm', tempHinweis:'kein induktiver Anteil' } },
    // Die Kabeltyp-Auswahl aenderte frueher an der Rechnung nichts. Jetzt
    // haelt sie wenigstens die Grenze der Isolierung dagegen.
    { name: 'Gummileitung bei 90 Grad wird nicht stillschweigend hingenommen',
      werte:{ material:'cu', cableModel:'h07', leiterTemp:'90', pf:'0.9',
              power:'30', length:'80' },
      ruf:'calculateCable()', enthaelt:{ tempHinweis:'Gummi ist bis 60' } },
    { name: 'Hinweis zur ungepruften Iz-Tabelle ist sichtbar',
      werte:{ material:'cu', leiterTemp:'70', pf:'0.9', power:'30', length:'80' },
      ruf:'calculateCable()', enthaelt:{ izHinweisText:'VDE 0298-4' } },
    // Hier bindet die Belastbarkeit, nicht der Spannungsfall: 43,6 kW bei
    // 400 V und cos phi 0,9 sind rund 70 A, die Leitung ist mit 10 m kurz.
    // Die alte Tabelle gab 10 mm2 75 A und haette 10 gewaehlt. Die
    // gemeinsame Tabelle gibt 64 A, also muss 16 herauskommen. Dieser Fall
    // faellt um, wenn jemand die Werte wieder nach oben setzt.
    { name: '43,6 kW auf 10 m: die Belastbarkeit bindet, nicht der Spannungsfall',
      werte:{ material:'cu', leiterTemp:'70', pf:'0.9', power:'43.6', length:'10' },
      ruf:'calculateCable()', enthaelt:{ finalRecommendation:'16 mm' } },
  ],
};

// ------------------------------------------------------------- Bau_Rechner
const bau = {
  datei: 'Bau_Rechner.html',
  titel: 'Bau_Rechner, Beton und Stahl',
  faelle: [
    { name: 'Bodenplatte 5 x 4 x 0,2 m, Stahlbeton',
      werte:{ c_l:'5.0', c_w:'4.0', c_h:'0.2', c_qty:'1', c_density:'2500' },
      ruf:'calcConcrete()', soll:{ res_c_vol:'4.00 m³', res_c_wgt:'10000 kg' } },
    { name: 'HEA 100, 6 m',
      werte:{ s_series:'HEA', s_l:'6.0', s_qty:'1' },
      ruf:'updateSizes(); calcSteel()', soll:{ res_s_gpm:'16.7 kg/m', res_s_total:'100 kg' } },
    { name: 'leere Eingabe meldet, statt NaN zu zeigen',
      werte:{ c_l:'', c_w:'4.0', c_h:'0.2', c_qty:'1' },
      ruf:'calcConcrete()', enthaelt:{ msg_c:'Felder' } },
  ],
};

// ------------------------------------------------------ Electrical_Toolbox
const etoolbox = {
  datei: 'Electrical_Toolbox.html',
  titel: 'Electrical_Toolbox, Motor und Blindleistung',
  faelle: [
    { name: 'Motor mit den Vorgaben', werte:{}, ruf:'calcMotor()',
      soll:{ mot_res_i:'28.3 A', mot_res_s:'19.6 kVA' } },
    { name: 'cos phi 2 ist unmoeglich und wird gemeldet',
      werte:{ pfc_old:'2' }, ruf:'calcPFC()', enthaelt:{ pfc_res_val:'zwischen 0 und 1' } },
    // 94 kW von 0,75 auf 0,95 braucht 52,0 kVAR. Die naechstliegende Stufe waere
    // 50 und damit zu klein; aufgerundet sind es 60. Genau hier gehen die alte
    // und die richtige Auswahl auseinander.
    { name: 'Kondensatorstufe wird aufgerundet, nicht gerundet',
      werte:{ pfc_kw:'94', pfc_old:'0.75', pfc_new:'0.95' }, ruf:'calcPFC()',
      enthaelt:{ pfc_res_val:'52.0', pfc_steps:'60 kVAR' } },
  ],
};

// --------------------------------------------- Load, Kurzschluss am Trafo
// Nachgerechnet von Hand: 1000 kVA, 400 V, u_k 6 %, P_k 10,5 kW.
//   I_n  = 1000000 / (sqrt(3)*400)        = 1443 A
//   I_k" = 1443 * 100/6                   = 24,1 kA
//   u_R  = 10,5/1000*100                  = 1,05 %
//   u_X  = sqrt(36 - 1,1)                 = 5,907 %
//   kappa = 1,02 + 0,98*e^(-3*0,1777)     = 1,595
//   i_p  = 1,595 * sqrt(2) * 24,06 kA     = 54,3 kA
const load_kurzschluss = {
  datei: 'Load.html',
  titel: 'Load, Kurzschlussdaten am Trafo',
  faelle: [
    { name: '1000 kVA bei u_k 6 Prozent: 24,1 kA an der Schiene',
      werte:{ tr_kw:'750', tr_sim:'1', tr_pf:'0.9', tr_res:'0', tr_v:'400',
              tr_uk:'6', tr_pk:'10.5' },
      ruf:'calcTrafo()',
      soll:{ tr_res_size:'1000 kVA', tr_det_ik:'24.1 kA', tr_det_ip:'54.3 kA',
             tr_det_sk:'16.7 MVA' } },
    // 25 kA ist die naechste genormte Stufe ueber 24,1.
    { name: 'daraus folgt das Schaltvermoegen des Hauptschalters',
      werte:{ tr_kw:'750', tr_sim:'1', tr_pf:'0.9', tr_res:'0', tr_v:'400',
              tr_uk:'6', tr_pk:'10.5' },
      ruf:'calcTrafo()', soll:{ tr_det_icu:'25 kA' } },
    // Dieselbe Groesse mit 4 Prozent statt 6: anderthalbfacher Strom.
    { name: 'kleineres u_k gibt groesseren Kurzschlussstrom',
      werte:{ tr_kw:'750', tr_sim:'1', tr_pf:'0.9', tr_res:'0', tr_v:'400',
              tr_uk:'4', tr_pk:'10.5' },
      ruf:'calcTrafo()', soll:{ tr_det_ik:'36.1 kA', tr_det_icu:'50 kA' } },
    { name: 'kappa wird aus dem Typenschild gerechnet, nicht geschaetzt',
      werte:{ tr_kw:'750', tr_sim:'1', tr_pf:'0.9', tr_res:'0', tr_v:'400',
              tr_uk:'6', tr_pk:'10.5' },
      ruf:'calcTrafo()', enthaelt:{ tr_kurz_hinweis:'kappa = 1.59' } },
    { name: 'unmoegliches Typenschild wird gemeldet, nicht gerechnet',
      werte:{ tr_kw:'750', tr_sim:'1', tr_pf:'0.9', tr_res:'0', tr_v:'400',
              tr_uk:'0', tr_pk:'10.5' },
      ruf:'calcTrafo()', soll:{ tr_det_ik:'--' },
      enthaelt:{ tr_kurz_hinweis:'Typenschild' } },
  ],
};

// ---------------------------------------------------------- Lighting_CAD
const lighting = {
  datei: 'Lighting_CAD.html',
  titel: 'Lighting_CAD, Wirkungsgradverfahren',
  faelle: [
    { name: 'Vorgaben, Rechnung laeuft auch ohne 3D', werte:{}, ruf:'calculateLighting()',
      soll:{ resK:'1.75', resUF:'0.79 (gerechnet)', resDR:'59 %', resN:'24 Stk.',
             resActualLux:'567 lx' } },
    // Der alte UF las die Reflexionsgrade gar nicht. Ein dunkler Raum muss
    // mehr Leuchten brauchen als ein heller - sonst rechnet die Auswahl nichts.
    { name: 'dunkler Raum braucht mehr Leuchten als heller',
      werte:{ refDecke:'0.3', refWand:'0.1', refBoden:'0.1' }, ruf:'calculateLighting()',
      soll:{ resUF:'0.62 (gerechnet)', resN:'30 Stk.' } },
    { name: 'kleiner Raum: der Direktanteil faellt, der UF mit ihm',
      werte:{ dimL:'4', dimW:'4' }, ruf:'calculateLighting()',
      soll:{ resK:'0.73', resDR:'31 %', resUF:'0.49 (gerechnet)', resN:'6 Stk.' } },
    { name: 'Halle 40x30x8, Hallenstrahler',
      werte:{ dimL:'40', dimW:'30', dimH:'8', targetLux:'200', lumenVal:'24000',
              wattVal:'200', mfVal:'0.67' }, ruf:'calculateLighting()',
      soll:{ resK:'2.36', resUF:'0.87 (gerechnet)', resN:'20 Stk.', resPower:'3.33 W/m\u00b2' } },
    { name: 'Deckenfluter: dasselbe Zimmer, deutlich mehr Leuchten',
      werte:{ leuchtenArt:'0.05' }, ruf:'calculateLighting()',
      soll:{ resUF:'0.56 (gerechnet)', resN:'35 Stk.' } },
    { name: 'UF aus dem Datenblatt schlaegt die Rechnung',
      werte:{ ufQuelle:'hand', ufHand:'0.55' }, ruf:'calculateLighting()',
      soll:{ resUF:'0.55 (Datenblatt)', resN:'35 Stk.' } },
    { name: 'unmoeglicher UF aus dem Datenblatt wird abgelehnt',
      werte:{ ufQuelle:'hand', ufHand:'1.9' }, ruf:'calculateLighting()',
      soll:{ resUF:'--' }, enthaelt:{ statusBadge:'Datenblatt zwischen 0 und 1,2' } },
    // Die Gleichmaessigkeit wurde nie geprueft, obwohl im Kommentar
    // "S/H ratio check" stand. Jetzt wird sie gerechnet, nicht geschaetzt.
    { name: 'Vorgaberaum: U0 wird gerechnet und gehalten', werte:{},
      ruf:'calculateLighting()',
      soll:{ resU0:'0.72 (gefordert 0.60)', resEmin:'423 lx' },
      enthaelt:{ statusBadge:'EN 12464-1 ERF' } },
    { name: 'derselbe Raum mit Wandabstand S/2 ist ungleichmaessiger',
      werte:{ wandAbstand:'0.5' }, ruf:'calculateLighting()',
      soll:{ resU0:'0.63 (gefordert 0.60)' } },
    // Der eigentliche Befund: hell genug und trotzdem nicht normgerecht.
    // Dieselben 20 Leuchten, dieselben 233 lx - nur der Wandabstand
    // entscheidet ueber bestanden und durchgefallen.
    { name: 'Halle mit S/2: hell genug, aber zu ungleichmaessig',
      werte:{ dimL:'40', dimW:'30', dimH:'8', targetLux:'200', lumenVal:'24000',
              wattVal:'200', mfVal:'0.67', wandAbstand:'0.5' },
      ruf:'calculateLighting()',
      soll:{ resActualLux:'233 lx', resU0:'0.51 (gefordert 0.60)' },
      enthaelt:{ statusBadge:'ZU UNGLEICHM' } },
    { name: 'dieselbe Halle mit S/3: bestanden, ohne eine Leuchte mehr',
      werte:{ dimL:'40', dimW:'30', dimH:'8', targetLux:'200', lumenVal:'24000',
              wattVal:'200', mfVal:'0.67', wandAbstand:'0.3333' },
      ruf:'calculateLighting()',
      soll:{ resN:'20 Stk.', resActualLux:'233 lx', resU0:'0.66 (gefordert 0.60)' },
      enthaelt:{ statusBadge:'EN 12464-1 ERF' } },
    { name: 'bei hoher Sehaufgabe reicht dieselbe Anlage nicht mehr',
      werte:{ dimL:'40', dimW:'30', dimH:'8', targetLux:'200', lumenVal:'24000',
              wattVal:'200', mfVal:'0.67', wandAbstand:'0.3333', u0Soll:'0.70' },
      ruf:'calculateLighting()',
      soll:{ resU0:'0.66 (gefordert 0.70)' },
      enthaelt:{ statusBadge:'ZU UNGLEICHM' } },
    { name: 'leere Eingabe meldet, statt NaN zu zeigen',
      werte:{ dimL:'' }, ruf:'calculateLighting()',
      soll:{ resK:'--' }, enthaelt:{ statusBadge:'Eingabe fehlt' } },
  ],
};

// -------------------------------------------------- Kabelterasse_Rechner
// Die Kabel werden direkt gesetzt statt ueber den Katalog ausgewaehlt: der
// Fall soll an der Verlegeart haengen, nicht daran, was gerade im Katalog
// steht. 20 Kabel mit 12 mm, Trassenhoehe 60 mm, Reserve 1,3.
//   Summe der Durchmesser  = 240 mm
//   Summe der Querschnitte = 20 * pi * 36 = 2262 mm2
const KABEL_20x12 = 'selectedCables.length=0;'
  + 'selectedCables.push({name:"Pruefkabel", d:12, w:0.3, qty:20});'
  + 'renderTable(); calculate();';

const kabeltrasse = {
  datei: 'Kabelterasse_Rechner.html',
  titel: 'Kabeltrasse, Verlegeart entscheidet die Breite',
  faelle: [
    // Das war bisher die einzige Rechnung - und stand nirgends.
    { name: 'einlagig beruehrend: 240 * 1,3 = 312 mm, Trasse 400',
      werte:{ verlegeart:'beruehrend' }, ruf: KABEL_20x12,
      soll:{ reqWidthVal:'312 mm' }, enthaelt:{ suggestedSizeText:'400', grundlageVal:'ber' } },
    // Energiekabel muessen mit Abstand liegen, weil die Minderungsfaktoren
    // aus der Kabelauslegung genau das voraussetzen. Dann ist die bisherige
    // Breite nur die Haelfte - und das ist die gefaehrliche Richtung.
    { name: 'einlagig mit Abstand: das Doppelte, 624 mm',
      werte:{ verlegeart:'abstand' }, ruf: KABEL_20x12,
      soll:{ reqWidthVal:'624 mm' }, enthaelt:{ suggestedSizeText:'600' } },
    // Steuerkabel liegen gebuendelt. Dann ist die bisherige Breite das
    // Zweieinhalbfache des Noetigen - Trasse 400 statt 150.
    { name: 'gebuendelt bei 40 Prozent Fuellgrad: 123 mm, Trasse 150',
      werte:{ verlegeart:'gebuendelt', fuellgrad:'0.40' }, ruf: KABEL_20x12,
      soll:{ reqWidthVal:'123 mm' }, enthaelt:{ suggestedSizeText:'150' } },
    { name: 'vorsichtiger Fuellgrad 30 Prozent: 163 mm, Trasse 200',
      werte:{ verlegeart:'gebuendelt', fuellgrad:'0.30' }, ruf: KABEL_20x12,
      soll:{ reqWidthVal:'163 mm' }, enthaelt:{ suggestedSizeText:'200' } },
    // Die Grundlage steht am Ergebnis, nicht in einer Fussnote.
    { name: 'das Ergebnis sagt, worauf es beruht',
      werte:{ verlegeart:'gebuendelt', fuellgrad:'0.40' }, ruf: KABEL_20x12,
      enthaelt:{ grundlageVal:'40 % F' } },
    // Der Fuellgrad galt nur fuer die Trasse; im Rohrteil stand er weiter fest
    // auf 0,40 - dasselbe Werkzeug mit zwei Antworten auf dieselbe Frage.
    { name: 'der Fuellgrad gilt auch fuer das Rohr',
      werte:{ fuellgrad:'0.40' }, ruf: KABEL_20x12 + " setMode('conduit');",
      enthaelt:{ reqWidthVal:'84.9 mm' } },
    { name: 'vorsichtiger Fuellgrad verlangt ein groesseres Rohr',
      werte:{ fuellgrad:'0.30' }, ruf: KABEL_20x12 + " setMode('conduit');",
      enthaelt:{ reqWidthVal:'98.0 mm' } },
  ],
};

// ------------------------------------------------ Druckverlustberechnung
// Der erste Abschnitt heisst immer 1, die Felder darum eps-1, dn-1, len-1.
// DN100, 58 m3/h, 100 m Wasser: Re rund 200.000, also voll turbulent - dort
// haengt lambda praktisch nur noch an der Rauheit.
const druckverlust = {
  datei: 'Druckverlustberechnung.html',
  titel: 'Druckverlust, Rauheit und Colebrook',
  faelle: [
    // Gegen einen eigenen Colebrook-Loeser gehalten, alle vier auf vier Stellen.
    { name: 'neues Stahlrohr: lambda 0,0185',
      werte:{ flowRate:'58', 'dn-1':'100', 'len-1':'100', 'eps-1':'0.045' },
      ruf:'updateDia(1); calculate();',
      soll:{ 'stat-f-1':'0.0185', 'res-sec-drop-1':'0.347 bar' } },
    { name: 'Kunststoff ist glatter und kostet weniger Druck',
      werte:{ flowRate:'58', 'dn-1':'100', 'len-1':'100', 'eps-1':'0.007' },
      ruf:'updateDia(1); calculate();',
      soll:{ 'stat-f-1':'0.0162', 'res-sec-drop-1':'0.303 bar' } },
    { name: 'leicht korrodiert: schon zwei Drittel mehr',
      werte:{ flowRate:'58', 'dn-1':'100', 'len-1':'100', 'eps-1':'0.5' },
      ruf:'updateDia(1); calculate();',
      soll:{ 'stat-f-1':'0.0306', 'res-sec-drop-1':'0.574 bar' } },
    // Der eigentliche Befund: dasselbe Rohr, verkrustet, braucht das
    // Zweieinhalbfache. Frueher stand die Rauheit fest auf 0,045 mm.
    { name: 'verkrustet: das Zweieinhalbfache des festen Werts',
      werte:{ flowRate:'58', 'dn-1':'100', 'len-1':'100', 'eps-1':'2' },
      ruf:'updateDia(1); calculate();',
      soll:{ 'stat-f-1':'0.0484', 'res-sec-drop-1':'0.907 bar' } },
    // Laminar bleibt Hagen-Poiseuille, dort spielt die Rauheit keine Rolle.
    { name: 'laminar rechnet 64/Re, die Rauheit aendert daran nichts',
      werte:{ flowRate:'0.5', 'dn-1':'100', 'len-1':'100', 'eps-1':'2' },
      ruf:'updateDia(1); calculate();',
      soll:{ 'stat-regime-1':'Laminar' } },
    { name: 'der Werkstoff setzt die Rauheit ins Feld',
      werte:{ flowRate:'58', 'dn-1':'100', 'len-1':'100' },
      ruf:'updateDia(1); document.getElementById("mat-1").value = "2"; werkstoffWechsel(1);',
      soll:{ 'stat-f-1':'0.0484' } },
  ],
};

// ------------------------------------------------------- Die Estimatoren
// Engine.compute() ist eine reine Funktion: Eingaben rein, Ergebnis raus.
// Darum wird sie direkt gerufen, statt die Oberflaeche zu bedienen - so haengt
// der Fall nicht an Zeilen, die ein frueherer Fall gespeichert hat. Das
// Ergebnis wird in ein Anzeigefeld geschrieben, damit die Pruefung es wie
// jeden anderen Wert ablesen kann.
//
// Der Fall ist absichtlich mager: keine Geraetezeile, 40 h Basic und 60 h
// Detail zu je 100 Euro. Das Werkzeug legt selbst eine Steuerungs-
// Grundposition von 950 Euro an, also 950 Euro Material gegen 10.000 Euro
// Stunden. Genau daran zeigt sich der Fehler: der Risikozuschlag lag nur auf
// dem Material.
const ANGEBOT = (contPct) => `{
  project:"P", signalClass:"XE", control:"SIEMENS",
  cablePerDevice:0, cableType:"CABLE_INSTR_2PR_SHLD", includeJB:false, includeInstall:false,
  basicH:40, basicRate:100, detailH:60, detailRate:100,
  loopDrawingEUR:0, loopRule:"DEVICES",
  externMode:"HOURS", externVal:0, externRate:0,
  progPerCh:0, montPerDev:0, montPerM:0, ibsPerLoop:0, fatSatFlat:0,
  handlingPct:0, contPct:${contPct}, lines:[]
}`;
const zeig = (was, contPct) =>
  `document.getElementById("sumGrand").textContent = String(Engine.compute(${ANGEBOT(contPct)}).${was});`;

const estimator_instr = {
  datei: 'MSR_Instrumentation_Estimator_AI_ExcelAligned_v2.html',
  titel: 'Instrumentation Estimator, Zuschlaege und vorlaeufige Summe',
  faelle: [
    // Alte Formel: 950 * 10 % = 95 Euro. Neue: 10.950 * 10 % = 1.095.
    // Elfeinhalbfach - weil die Stunden vorher gar nicht mitgezaehlt wurden.
    { name: 'der Risikozuschlag liegt auf allem, nicht nur auf dem Material',
      werte:{}, ruf: zeig('overhead.contingencyCost', 10), soll:{ sumGrand:'1095' } },
    { name: 'und damit steht die Summe auf 12045 statt auf 11045',
      werte:{}, ruf: zeig('grandTotal', 10), soll:{ sumGrand:'12045' } },
    { name: 'ohne Risikozuschlag bleibt alles wie vorher',
      werte:{}, ruf: zeig('grandTotal', 0), soll:{ sumGrand:'10950' } },
    // Der Grundpreis der Steuerung ist im Katalog als UNKNOWN gefuehrt. Eine
    // Summe, in der so etwas steckt, ist vorlaeufig - und sagt das selbst.
    { name: 'ungesicherte Preise machen die Summe vorlaeufig',
      werte:{}, ruf: zeig('istVorlaeufig', 10), soll:{ sumGrand:'true' } },
    { name: 'und nennen den Betrag, nicht nur die Anzahl der Positionen',
      werte:{}, ruf: zeig('unsicherEUR', 10), soll:{ sumGrand:'950' } },
  ],
};

const estimator_pump = {
  datei: 'MSR_Pump_Estimator_AI_ExcelAligned_v2.html',
  titel: 'Pump Estimator, Zuschlaege und vorlaeufige Summe',
  faelle: [
    { name: 'derselbe Fehler, dieselbe Korrektur, dieselben Zahlen', werte:{},
      ruf: `document.getElementById("sumGrand").textContent = String(Engine.compute({
              project:"P", signalClass:"XE", control:"SIEMENS",
              powerCablePerPump:0, powerCableType:"CABLE_PWR_4G2_5",
              instrCablePerPump:0, instrCableType:"CABLE_INSTR_2PR_SHLD",
              includeJB:false, includeInstall:false,
              basicH:40, basicRate:100, detailH:60, detailRate:100,
              loopDrawingEUR:0, loopRule:"DEVICES",
              externMode:"HOURS", externVal:0, externRate:0,
              progPerCh:0, montPerPump:0, montPerM:0, ibsPerLoop:0, fatSatFlat:0,
              handlingPct:0, contPct:10, lines:[]
            }).overhead.contingencyCost);`,
      soll:{ sumGrand:'1095' } },
    { name: 'auch hier macht ein ungesicherter Preis die Summe vorlaeufig', werte:{},
      ruf: `document.getElementById("sumGrand").textContent = String(Engine.compute({
              project:"P", signalClass:"XE", control:"SIEMENS",
              powerCablePerPump:0, powerCableType:"CABLE_PWR_4G2_5",
              instrCablePerPump:0, instrCableType:"CABLE_INSTR_2PR_SHLD",
              includeJB:false, includeInstall:false,
              basicH:40, basicRate:100, detailH:60, detailRate:100,
              loopDrawingEUR:0, loopRule:"DEVICES",
              externMode:"HOURS", externVal:0, externRate:0,
              progPerCh:0, montPerPump:0, montPerM:0, ibsPerLoop:0, fatSatFlat:0,
              handlingPct:0, contPct:10, lines:[]
            }).unsicherEUR);`,
      soll:{ sumGrand:'950' } },
  ],
};

// ----------------------------------------------------- Schaltschrank_CAD
// Die Bestueckung wird ueber addManually() aufgebaut, nicht ueber
// autoLayout(): das ruft clearAll() mit einer Rueckfrage auf, und eine
// Rueckfrage im Testbrowser wird weggeklickt.
const schaltschrank = {
  datei: 'Schaltschrank_CAD.html',
  titel: 'Schaltschrank_CAD, Waermebilanz',
  faelle: [
    // Nutzoberflaeche aus den b-Faktoren der IEC 60890. Gegenprobe von Hand:
    // 1,4*0,8*0,4 + 0,9*2*0,8*2,0 + 0,9*2*0,4*2,0 = 0,448 + 2,88 + 1,44.
    { name: 'freistehend: Nutzoberflaeche 4,77 m2', werte:{}, ruf:'waermeRechnen()',
      soll:{ wFlaeche:'4.77 m\u00b2' } },
    { name: 'an der Wand ist die Rueckseite verdeckt',
      werte:{ aufstellung:'wand' }, ruf:'waermeRechnen()', soll:{ wFlaeche:'4.13 m\u00b2' } },
    { name: 'in der Reihe sind beide Seiten verdeckt',
      werte:{ aufstellung:'reihe_mitte' }, ruf:'waermeRechnen()', soll:{ wFlaeche:'3.49 m\u00b2' } },
    { name: 'ohne Bauteile ist die Verlustleistung null', werte:{}, ruf:'waermeRechnen()',
      soll:{ wPv:'0.0 W', wDeltaT:'0.0 K' } },
    // 1 Netzteil 40 W, 1 CPU 10 W, 8 IO je 5 W = 90 W.
    { name: 'SPS und Netzteil: 90 W, Eigenkonvektion reicht', werte:{},
      ruf:'addManually("puls_20a"); addManually("s7-1500_cpu"); for(var i=0;i<8;i++) addManually("s7-1500_io");',
      soll:{ wPv:'90.0 W', wDeltaT:'3.4 K', wTInnen:'38.4 \u00b0C' },
      enthaelt:{ wMassnahme:'Eigenkonvektion reicht' } },
    // 20 Netzteile, 800 W: hier kippt es.
    { name: '800 W: Luefter und Kuehlgeraet werden beziffert', werte:{},
      ruf:'for(var i=0;i<20;i++) addManually("puls_20a");',
      soll:{ wPv:'800.0 W', wDeltaT:'30.5 K', wTInnen:'65.5 \u00b0C' },
      enthaelt:{ wMassnahme:'120 m\u00b3/h' } },
    { name: 'ist die Umgebung waermer als das Ziel, hilft kein Luefter',
      werte:{ tUmgebung:'60' },
      ruf:'for(var i=0;i<20;i++) addManually("puls_20a"); waermeRechnen();',
      enthaelt:{ wMassnahme:'ein L\u00fcfter hilft nicht' } },
    { name: 'der Verlust am Bauteil ist aenderbar und gewinnt', werte:{},
      ruf:'addManually("puls_20a"); selectComponent(document.querySelector(".comp")); updateEl("pv", "123.4");',
      soll:{ wPv:'123.4 W' } },
  ],
};

// ------------------------------------------------------- MSR_Loop_Check
const loopcheck = {
  datei: 'MSR_Loop_Check_Skalierung.html',
  titel: 'MSR_Loop_Check, Umrechnung und Pt100',
  faelle: [
    { name: '1 bar nach psi', werte:{ convInput:'1' }, ruf:'doConvert()', soll:{ convResult:'14.50 PSI' } },
    { name: 'Pt100 bei 100 Grad', werte:{ rtdMode:'t2r', rtdInput:'100' }, ruf:'calcRTD()',
      soll:{ rtdResult:'138.51 Ω' } },
    // Frueher hat das Werkzeug unter null Grad gar nichts gerechnet, weil der
    // C-Term fehlte. Jetzt rechnet es - und zwar gegen die Tabelle der Norm.
    { name: 'Pt100 bei -100 Grad (Tabelle IEC 60751: 60,26 Ohm)',
      werte:{ rtdTyp:'100', rtdMode:'t2r', rtdInput:'-100' }, ruf:'calcRTD()',
      soll:{ rtdResult:'60.26 \u03a9' } },
    { name: 'Pt100 am unteren Rand, -200 Grad (Tabelle: 18,52 Ohm)',
      werte:{ rtdTyp:'100', rtdMode:'t2r', rtdInput:'-200' }, ruf:'calcRTD()',
      soll:{ rtdResult:'18.52 \u03a9' } },
    { name: 'Pt100 am oberen Rand, 850 Grad (Tabelle: 390,48 Ohm)',
      werte:{ rtdTyp:'100', rtdMode:'t2r', rtdInput:'850' }, ruf:'calcRTD()',
      soll:{ rtdResult:'390.48 \u03a9' } },
    { name: 'der Rueckweg trifft unter null wieder denselben Wert',
      werte:{ rtdTyp:'100', rtdMode:'r2t', rtdInput:'60.25584' }, ruf:'calcRTD()',
      soll:{ rtdResult:'-100.00 \u00b0C' } },
    // Wer den gerundeten Tabellenwert eintippt, bekommt das gerundete
    // Ergebnis zurueck - nicht die Rundung des Werkzeugs, sondern die der
    // Eingabe. Das ist richtig so und soll auch sichtbar bleiben.
    { name: 'gerundeter Tabellenwert gibt gerundet zurueck',
      werte:{ rtdTyp:'100', rtdMode:'r2t', rtdInput:'60.26' }, ruf:'calcRTD()',
      soll:{ rtdResult:'-99.99 \u00b0C' } },
    { name: 'Pt1000 ist derselbe Fuehler mit zehnfachem R0',
      werte:{ rtdTyp:'1000', rtdMode:'t2r', rtdInput:'-100' }, ruf:'calcRTD()',
      soll:{ rtdResult:'602.56 \u03a9' } },
    { name: 'ausserhalb des Geltungsbereichs wird nichts gerechnet',
      werte:{ rtdTyp:'100', rtdMode:'t2r', rtdInput:'900' }, ruf:'calcRTD()',
      enthaelt:{ rtdResult:'-200 bis 850' } },
    { name: 'ein Widerstand ausserhalb der Kennlinie ebenso',
      werte:{ rtdTyp:'100', rtdMode:'r2t', rtdInput:'12' }, ruf:'calcRTD()',
      enthaelt:{ rtdResult:'18.52 bis 390.48' } },
  ],
};

module.exports = [
  regelventil, load, load_motor, load_kurzschluss, erdung, petrochem, hydrocyclone,
  kabeldim, bau, etoolbox, lighting, schaltschrank, kabeltrasse,
  druckverlust, formstuecke_gleich,
  estimator_instr, estimator_pump, loopcheck,
];
