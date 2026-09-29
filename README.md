# Ingenieur-Werkzeuge — Berechnungstools für EMSR- und Verfahrenstechnik

> Umgesetzt mit dem KI-Werkzeug Claude Code (No-Code). Anforderungen, Fachinhalte und Prüfung: Farhad Javanmardi.

27 eigenständige Werkzeuge für den Anlagenbau, die im Browser rechnen — die
Aufgaben, die im Detail-Engineering ohnehin anfallen: Kabelquerschnitt,
Transformatorgröße, Kv-Wert, Druckverlust, Erdung, Beleuchtung, Loop-Blätter,
Kabeltrassen, Stahlbau, Kostenschätzung.

Jede Datei läuft ohne Server und ohne Build: öffnen und rechnen. Gedacht war
das ursprünglich für den Betrieb von einem Netzlaufwerk im Büro.

**Live:** [Dashboard mit allen 27 Werkzeugen](https://logicstyle-salon.de/ingenieur-werkzeuge/dashboard)

## Warum es das gibt

Die Rechnungen, die hier stehen, macht jeder Planer ohnehin — meist in einer
gewachsenen Excel-Datei, deren Annahmen niemand mehr kennt. Der Anspruch hier
ist ein anderer: **jede versteckte Annahme wird zu einem Eingabefeld mit einem
Richtwert.** Wer den Richtwert stehen lässt, rechnet wie bisher. Wer ihn ändert,
sieht sofort, was davon abhängt. Und was das Werkzeug auf dem Bildschirm
verspricht, muss im Code auch vorkommen — dafür gibt es die Prüfungen unten.

## Die Werkzeuge

### Elektrotechnik
| Datei | Was es tut |
|---|---|
| `Electrical_Toolbox.html` | P/I-Umrechnung, Motorstrom, Blindleistungskompensation, Spannungsfall |
| `Kabeldimensionierung_Spannungsfall.html` | Querschnittswahl aus Strombelastbarkeit und Spannungsfall, Cu und Al |
| `Cable_Manager.html` | Kabelliste je Verbraucher, Verschraubungen, Trommelbelegung |
| `Load.html` | Trafo-Auslegung, Motorabgang, elektrische Heizung |
| `SLD_CAD.html` | Einpoliges Übersichtsschaltbild, DXF-Export |
| `Schaltschrank_CAD.html` | Schrankaufbau mit Komponentenbibliothek, DXF und PDF |
| `Earthing_CADE.html` | Erdungsnetz in 3D, Erdungswiderstand |
| `Lighting_CAD.html` | Beleuchtung nach Wirkungsgradverfahren, 3D-Raum |

### MSR und Prozess
| Datei | Was es tut |
|---|---|
| `Loop_CAD.html` | Loop-Blätter aus Excel-Import erzeugen, DXF und SVG |
| `Loop_Library.html` | Loop-Schaltbilder zeichnen, IEC-Symbole, DXF |
| `MSR_Loop_Check_Skalierung.html` | 4-20-mA-Skalierung, Pt100, Einheitenumrechnung |
| `Instrument_Selector.html` | Messprinzip wählen und grob auslegen |
| `Cause_Effect.html` | Ursache-Wirkungs-Matrix mit Simulation, Excel rein und raus |
| `Regelventil.html` | Kv/Cv für Flüssigkeit, Gas, Dampf; Stellcharakteristik |
| `Druckverlustberechnung.html` | Rohrnetz abschnittsweise, Swamee-Jain, Einzelwiderstände |
| `Petrochem_Hydraulic_Analysis.html` | Leitungsvergleich über DN-Reihe, Churchill, NPSH, Betriebskosten |
| `Hydrocyclone.html` | Hydrozyklon-Auslegung nach Arterburn/Krebs mit Kennlinien |

### Kalkulation
| Datei | Was es tut |
|---|---|
| `MSR_Instrumentation_Estimator_AI_ExcelAligned_v2.html` | Kostenschätzung Instrumentierung, katalogbasiert |
| `MSR_Pump_Estimator_AI_ExcelAligned_v2.html` | Kostenschätzung Pumpenpakete, katalogbasiert |

### Bau, Trasse, Sonstiges
| Datei | Was es tut |
|---|---|
| `Bau_Rechner.html` | Beton, DIN-Stahlprofile, Bewehrung |
| `Bau_CAD.html` | Einfaches 2D-Zeichnen mit Fang und DXF |
| `Structure_CAD.html` | Stahlbau-Generator: Silo, Halle, Bühne, Rack, Turm |
| `Trasse_CAD.html` | Kabeltrassenführung zeichnen |
| `Visueller_Kabeltrassen_CAD.html` | Belegung von Trasse und Rohr grafisch, Füllgrad |
| `Kabelterasse_Rechner.html` | Trassenbreite und Rohrgröße aus der Kabelliste |
| `photo_CAD.html` | Foto zu Vektor, Nachzeichnen, DXF |
| `Brandschutz_Master_Global_Framework.html` | Regelwerk und Aufgabenliste Brandschutz, Normen-Zuordnung |

## Export

DXF für AutoCAD, Excel für die Weitergabe, PDF für die Akte. Der DXF-Export
schreibt echte Geometrie, kein Bild.

## Drei Sprachen

Deutsch, Englisch und Persisch. Die Oberfläche ist auf Deutsch geschrieben; die
Übersetzung läuft über den deutschen Quelltext als Schlüssel
(`uebersetzung.js` und die Wörterbücher in `woerter/`). Was nicht im Wörterbuch
steht, bleibt absichtlich deutsch — eine Norm, eine Einheit oder ein
Formelzeichen darf nicht übersetzt werden.

Bei Persisch stellt sich die Seite auf rechts nach links, Zahlenfelder bleiben
links nach rechts.

## Prüfungen

```
cd tests
npm install
node run.cjs
```

**305 Prüfungen**, die in einem echten Browser laufen (Playwright, ohne
Netzzugang). Sie prüfen nicht, ob eine Seite lädt, sondern ob sie richtig
rechnet:

- Ergebnisse werden gegen die Formel nachgerechnet, nicht gegen einen
  gespeicherten Wert.
- Werkzeuge, die dieselbe Größe berechnen, müssen übereinstimmen — der
  Motorstrom kommt in `Load`, `Cable_Manager` und `SLD_CAD` vor und muss
  dreimal dasselbe ergeben.
- Der DXF-Export wird geöffnet und auf die erwartete Geometrie geprüft.
- Jede Zusage im Katalog der Verkaufsseite muss im Code eine Entsprechung
  haben. Diese Prüfung entstand, weil genau das mehrfach auseinanderlief.
- Kein Schlüssel und kein Token im Quelltext.
- Die Sprachprüfung meldet in Zahlen, was noch nicht übersetzt ist, statt es
  stillschweigend durchgehen zu lassen.

Einzelne Bereiche lassen sich filtern: `node run.cjs kabel`

## Aufbau

| Pfad | Inhalt |
|---|---|
| `*.html` | die 27 Werkzeuge, je eine Datei |
| `dashboard/` | Übersicht über alle Werkzeuge |
| `shop/` | Verkaufsseite |
| `bibliotheken/` | mitgelieferte Fremdbibliotheken |
| `woerter/` | Wörterbücher je Werkzeug |
| `uebersetzung.js` | Übersetzungsschicht |
| `strombelastbarkeit.js`, `formstuecke.js` | gemeinsame Rechenkerne |
| `ki-helfer.js` | Anbindung des Assistenten |
| `supabase/functions/werkzeug-assistent/` | Edge Function des Assistenten |
| `tests/` | die 305 Prüfungen |
| `ENTWICKLUNG.md` | ausführliches Entwicklungsprotokoll |
| `PRUEFBERICHT.md` | Prüfbericht zu den überarbeiteten Werkzeugen |

## Ehrlichkeit über den Stand

Zwei Punkte sind offen und stehen deshalb hier statt versteckt im Code:

- Die Tabelle der Strombelastbarkeit in `strombelastbarkeit.js` trägt
  `GRUNDLAGE.geprueft: false`. Sie ist **nicht** gegen DIN VDE 0298-4
  abgeglichen. Für die Ausführungsplanung ist das nachzuholen.
- Die Höhen und Breiten der DIN-Profile in `Structure_CAD` sind ebenfalls nicht
  gegen die Norm geprüft.

Beides ließe sich raten. Geraten wird hier nicht.

## Technik

Statisches HTML, CSS und JavaScript ohne Build und ohne Framework, ausgeliefert
über Vercel. Der Assistent läuft als Supabase Edge Function; der Schlüssel dazu
liegt in `app_config` hinter RLS und steht an keiner Stelle im Quelltext.
