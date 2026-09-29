/* Der Werkzeugkatalog, wie ihn das Modell zu sehen bekommt.

   Die Wahrheit ueber die Werkzeuge steht in
   ingenieur-werkzeuge/shop/werkzeuge.js. Hier liegt eine verkuerzte Kopie,
   weil eine Edge Function nicht in das Web-Projekt hineingreifen kann.

   Eine zweite Liste ist eine zweite Wahrheit, und das ist in diesem Projekt
   schon einmal teuer geworden: zwei Tabellen fuer dieselbe
   Strombelastbarkeit, 14 bis 26 Prozent auseinander. Deshalb haelt die
   Pruefung (ingenieur-werkzeuge/tests/run.cjs) beide Listen gegeneinander -
   wer dort ein Werkzeug aendert und hier nicht, bekommt eine rote Zeile.

   Die Kennungen sind die Vertragsflaeche: der Browser bekommt nur sie zurueck
   und schlaegt Name und Weg in seinen eigenen Daten nach. Was das Modell
   ausserhalb dieser Liste erfindet, wird verworfen. */

export type Werkzeug = { id: string; name: string; kurz: string };

export const KATALOG: Werkzeug[] = [
  { id: "kabeldimensionierung", name: "Kabeldimensionierung & Spannungsfall", kurz: "Findet den Querschnitt, der Strombelastbarkeit und Spannungsfall gleichzeitig erfüllt." },
  { id: "cable_manager", name: "Cable Manager", kurz: "Kabelliste je Verbraucher, mit Verschraubung und Trommelbelegung." },
  { id: "electrical_toolbox", name: "E-Technik Toolbox", kurz: "Die vier Rechnungen, die man am Tag zwanzigmal braucht." },
  { id: "load", name: "Load Master", kurz: "Trafo-Auslegung, Motorabgang und elektrische Heizung." },
  { id: "earthing", name: "Earthing Master 3D", kurz: "Erdungsnetz zeichnen und den Erdungswiderstand abschätzen." },
  { id: "lighting", name: "Lighting Calculation Pro", kurz: "Wie viele Leuchten braucht der Raum, und wie werden sie verteilt." },
  { id: "sld", name: "SLD Generator", kurz: "Einpoliges Übersichtsschaltbild aufbauen und als DXF ausgeben." },
  { id: "schaltschrank", name: "Schaltschrank CAD", kurz: "Montageplatte bestücken, als DXF und PDF ausgeben." },
  { id: "loop_cad", name: "Batch Loop Generator", kurz: "Loop-Blätter für die ganze Messstellenliste auf einmal." },
  { id: "loop_library", name: "IEC Loop Designer", kurz: "Einzelne Loop-Schaltbilder frei zeichnen." },
  { id: "loop_check", name: "MSR Loop Check", kurz: "Skalierung, Pt100 und Einheiten - das Werkzeug für die Inbetriebnahme." },
  { id: "instrument_selector", name: "Instrumentation Selector", kurz: "Messprinzip zur Aufgabe finden und grob auslegen." },
  { id: "cause_effect", name: "Cause & Effect Matrix", kurz: "Ursache-Wirkungs-Matrix aufbauen, prüfen und simulieren." },
  { id: "regelventil", name: "Regelventil-Auslegung", kurz: "Kv und Cv für Flüssigkeit, Gas und Dampf, mit Stellcharakteristik." },
  { id: "druckverlust", name: "Hydraulik Calculator", kurz: "Rohrnetz abschnittsweise rechnen, mit Formstücken und Höhe." },
  { id: "petrochem", name: "Petrochem Hydraulic Studio", kurz: "Nennweiten vergleichen: Druckverlust, NPSH und Betriebskosten nebeneinander." },
  { id: "hydrocyclone", name: "Hydrocyclone Pro", kurz: "Hydrozyklon auslegen, mit allen Korrekturen und Kennlinien." },
  { id: "instr_estimator", name: "Instrumentation Estimator", kurz: "Kostenschätzung für die Instrumentierung, Position für Position nachvollziehbar." },
  { id: "pump_estimator", name: "Pump Estimator", kurz: "Kostenschätzung für Pumpenpakete, vom Motorstarter bis zur Inbetriebnahme." },
  { id: "bau_rechner", name: "Bautechnik Rechner", kurz: "Beton, DIN-Stahlprofile und Bewehrung." },
  { id: "bau_cad", name: "Master CAD", kurz: "Schnell etwas maßgenau zeichnen, mit Fang und DXF." },
  { id: "structure_cad", name: "Structure Generator", kurz: "Stahlbau-Grundgerüst erzeugen: Silo, Halle, Bühne, Rack, Turm." },
  { id: "trasse_cad", name: "Trasse CAD Pro", kurz: "Kabeltrassen räumlich führen, mit Formstücken und Stückliste." },
  { id: "visuell_trasse", name: "Visueller Kabeltrassen-Rechner", kurz: "Zeigt im Querschnitt, wie voll die Trasse wirklich wird." },
  { id: "kabelterasse", name: "Trassen- und Rohrrechner", kurz: "Aus der Kabelliste die Trassenbreite und die Rohrgröße." },
  { id: "photo_cad", name: "Photo CAD", kurz: "Aus einem Foto der Anlage eine maßstäbliche Zeichnung machen." },
  { id: "brandschutz", name: "Brandschutz Master", kurz: "Regelwerk und Aufgabenliste Brandschutz, mit Normen-Zuordnung." },
];

/* Die Liste so, wie sie in die Anweisung an das Modell geht. */
export function katalogText(): string {
  return KATALOG.map((w) => `${w.id} | ${w.name} | ${w.kurz}`).join("\n");
}
