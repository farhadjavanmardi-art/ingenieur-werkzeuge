/* Die Betriebsarten des Helfers.

   Eine Funktion und nicht vier: die Bremse, die Laengengrenze und der Griff
   nach dem Schluessel sind in allen Faellen dieselben, und vier Kopien davon
   waeren vier Stellen, an denen eine Bremse fehlen kann.

   Was allen gemeinsam ist und nicht verhandelbar ist: das Modell rechnet
   nicht. Jede Zahl, die der Benutzer zu sehen bekommt, stammt aus der Formel
   im Werkzeug. Das Modell ordnet ein, warnt und begruendet - mehr nicht.
   Eine Zahl, die niemand nachrechnet, ist schlimmer als keine Zahl. */

export type Modus = "werkzeug" | "deutung" | "auswahl" | "norm";

export const MODI: Modus[] = ["werkzeug", "deutung", "auswahl", "norm"];

/* Grenzen fuer das, was hereinkommt. Ein oeffentlicher Endpunkt an einer
   bezahlten Schnittstelle muss wissen, wie gross eine Anfrage werden darf. */
export const GRENZEN = {
  frage: 600,        // freie Frage des Benutzers
  werkzeugName: 80,
  schluessel: 60,    // Laenge eines Feldnamens in den Daten
  wert: 160,         // Laenge eines Feldwerts
  felder: 40,        // Anzahl der Felder insgesamt
  datenGesamt: 3000, // die Daten zusammengenommen
};

const GEMEINSAM = [
  "Du bist ein erfahrener EMSR- und Anlagenbau-Ingenieur und hilfst einem",
  "Kollegen, der gerade mit einem Berechnungswerkzeug arbeitet.",
  "",
  "Unverhandelbar:",
  "- Rechne nicht nach und nenne keine eigenen Zahlenergebnisse. Die Zahlen",
  "  kommen aus der Formel im Werkzeug. Du darfst die vorhandenen Zahlen",
  "  zitieren und einordnen, aber keine neuen erfinden oder korrigieren.",
  "- Wenn eine Angabe fehlt, sage das, statt sie zu erraten.",
  "- Nenne eine Norm nur, wenn du sicher bist, welche Anforderung darin",
  "  steht. Im Zweifel sage, dass die Norm zu pruefen ist.",
  "- Antworte auf Deutsch, sachlich, ohne Werbesprache.",
].join("\n");

/* Jede Betriebsart bekommt ihren eigenen Auftrag und ihre eigene Form.
   Die Laenge ist bewusst knapp gehalten: eine halbe Seite liest am
   Bildschirm niemand, und jedes Token kostet. */
export function anweisung(modus: Modus, werkzeug: string): string {
  const kopf = GEMEINSAM + "\n\nWerkzeug: " + werkzeug + "\n\n";

  if (modus === "deutung") {
    return kopf + [
      "Aufgabe: das Rechenergebnis einordnen.",
      "",
      "Sage in hoechstens 5 Saetzen:",
      "1. Ob das Ergebnis in einem ueblichen Bereich liegt oder auffaellig ist.",
      "2. Falls ein Grenzwert ueberschritten ist: welcher, und welche",
      "   Stellschrauben es gibt (grosserer Querschnitt, kuerzere Strecke,",
      "   andere Spannung - was zu diesem Werkzeug passt).",
      "3. Worauf bei diesen Eingaben erfahrungsgemaess zu achten ist.",
      "",
      "Keine Aufzaehlung der Eingaben, die der Benutzer selbst eingetippt hat.",
      "Wenn alles unauffaellig ist, sage das in einem Satz und hoere auf.",
    ].join("\n");
  }

  if (modus === "auswahl") {
    return kopf + [
      "Aufgabe: die Auswahl des Messprinzips beurteilen.",
      "",
      "Das Werkzeug hat bereits nach Punkten sortiert. Deine Aufgabe ist das,",
      "was die Punktetabelle nicht kann:",
      "1. Nenne Ausschlusskriterien, die hier greifen. Beispiele fuer die Art",
      "   von Wissen, die gemeint ist: magnetisch-induktiv braucht eine",
      "   Mindestleitfaehigkeit; Vortex wird unterhalb einer Reynoldszahl",
      "   unbrauchbar; Coriolis wird bei grossen Nennweiten teuer und schwer.",
      "   Pruefe, ob so etwas bei DIESEN Angaben zutrifft.",
      "2. Sage in einem Satz, warum das erstplatzierte Prinzip passt - oder",
      "   warum ein anderes besser waere.",
      "3. Nenne die wichtigste offene Frage, die vor der Bestellung zu klaeren",
      "   ist.",
      "",
      "Hoechstens 6 Saetze. Die Auslegungszahlen des Werkzeugs bleiben, wie",
      "sie sind.",
    ].join("\n");
  }

  if (modus === "norm") {
    return kopf + [
      "Aufgabe: eine Frage zum Regelwerk beantworten.",
      "",
      "Hoechstens 6 Saetze. Nenne die einschlaegige Norm oder Richtlinie mit",
      "ihrer Bezeichnung, sage was sie verlangt, und was das fuer die",
      "vorliegende Anlage bedeutet.",
      "",
      "Wenn du dir bei einer Anforderung nicht sicher bist, sage ausdruecklich,",
      "dass sie am Normtext zu pruefen ist. Eine falsche Aussage zum",
      "Brandschutz ist gefaehrlicher als keine Aussage. Dies ist eine",
      "Arbeitshilfe und ersetzt kein Brandschutzkonzept - das erstellt ein",
      "Fachplaner.",
    ].join("\n");
  }

  /* modus === "werkzeug" wird gesondert behandelt, weil er als einziger
     JSON zurueckgibt und den Werkzeugkatalog braucht. */
  return kopf;
}

/* Die Daten des Werkzeugs in Text, den das Modell lesen kann.

   Hier wird auch beschnitten: die Grenzen oben gelten, und was darueber
   hinausgeht, faellt weg statt die Anfrage zu sprengen. */
export function datenText(daten: unknown): string {
  if (!daten || typeof daten !== "object") return "";
  const zeilen: string[] = [];
  let gesamt = 0;

  for (const [k, v] of Object.entries(daten as Record<string, unknown>)) {
    if (zeilen.length >= GRENZEN.felder) break;
    const name = String(k).slice(0, GRENZEN.schluessel).trim();
    const wert = String(v ?? "").slice(0, GRENZEN.wert).trim();
    if (!name || !wert) continue;
    const zeile = name + ": " + wert;
    if (gesamt + zeile.length > GRENZEN.datenGesamt) break;
    gesamt += zeile.length;
    zeilen.push(zeile);
  }
  return zeilen.join("\n");
}
