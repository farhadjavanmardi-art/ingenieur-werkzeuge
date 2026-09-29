# Ingenieur-Werkzeuge

27 eigenstaendige HTML-Werkzeuge aus dem EMSR- und Anlagenbau, urspruenglich fuer den
Betrieb von einem Windows-Netzlaufwerk gebaut. Jede Datei laeuft ohne Server und ohne
Build: oeffnen und rechnen.

Die Dateien lagen vorher unsortiert im Wurzelverzeichnis des Salon-Projekts.
Beim Verschieben wurde am Inhalt der Werkzeuge nichts veraendert.

Seither sind mehrere Werkzeuge ueberarbeitet worden - `Kabeldimensionierung`, `Load`,
`Earthing_CADE`, `Cable_Manager`, `Regelventil`, `Bau_Rechner`, `Electrical_Toolbox`,
`Lighting_CAD`, `MSR_Loop_Check`, `Instrument_Selector` und `Kabelterasse_Rechner`.
Siehe "Was bereits bearbeitet ist" und den [PRUEFBERICHT](PRUEFBERICHT.md).

## Umbenannt beim Verschieben

Vier Namen enthielten Leerzeichen oder ein `&`. Als Datei auf einem Netzlaufwerk geht
das, als URL nicht - ein `&` beendet dort den Pfad.

| vorher | jetzt |
|---|---|
| `Kabeldimensionierung & Spannungsfall.html` | `Kabeldimensionierung_Spannungsfall.html` |
| `MSR Loop Check_Skalierung.html` | `MSR_Loop_Check_Skalierung.html` |
| `Petrochem Hydraulic Analysis.html` | `Petrochem_Hydraulic_Analysis.html` |
| `loop library.html` | `Loop_Library.html` |
| `ingeneering dashboard` (1 Byte, leer) | `dashboard/index.html` |

## Die Werkzeuge

### Elektrotechnik
| Datei | Was es tut |
|---|---|
| `Electrical_Toolbox.html` | P/I-Umrechnung, Motorstrom, Blindleistungskompensation, Spannungsfall, Taschenrechner |
| `Kabeldimensionierung_Spannungsfall.html` | Querschnittswahl aus Strombelastbarkeit und Spannungsfall, Cu und Al |
| `Cable_Manager.html` | Kabelliste je Verbraucher, Verschraubungen, Trommelbelegung |
| `Load.html` | Trafo-Auslegung, Motorabgang, elektrische Heizung |
| `SLD_CAD.html` | Einpoliges Uebersichtsschaltbild, DXF-Export |
| `Schaltschrank_CAD.html` | Schrankaufbau mit Komponentenbibliothek, DXF und PDF |
| `Earthing_CADE.html` | Erdungsnetz in 3D, Erdungswiderstand |
| `Lighting_CAD.html` | Beleuchtung nach Wirkungsgradverfahren, 3D-Raum |

### MSR und Prozess
| Datei | Was es tut |
|---|---|
| `Loop_CAD.html` | Loop-Blaetter aus Excel-Import erzeugen, DXF und SVG |
| `Loop_Library.html` | Loop-Schaltbilder zeichnen, IEC-Symbole, DXF |
| `MSR_Loop_Check_Skalierung.html` | 4-20-mA-Skalierung, Pt100, Einheitenumrechnung |
| `Instrument_Selector.html` | Messprinzip waehlen und grob auslegen |
| `Cause_Effect.html` | Ursache-Wirkungs-Matrix mit Simulation, Excel rein und raus |
| `Regelventil.html` | Kv/Cv fuer Fluessigkeit, Gas, Dampf; Stellcharakteristik |
| `Druckverlustberechnung.html` | Rohrnetz abschnittsweise, Swamee-Jain, Einzelwiderstaende |
| `Petrochem_Hydraulic_Analysis.html` | Leitungsvergleich ueber DN-Reihe, Churchill, NPSH, Betriebskosten |
| `Hydrocyclone.html` | Hydrozyklon-Auslegung nach Arterburn/Krebs mit Kennlinien |

### Kalkulation
| Datei | Was es tut |
|---|---|
| `MSR_Instrumentation_Estimator_AI_ExcelAligned_v2.html` | Kostenschaetzung Instrumentierung, katalogbasiert |
| `MSR_Pump_Estimator_AI_ExcelAligned_v2.html` | Kostenschaetzung Pumpenpakete, katalogbasiert |

### Bau, Trasse, Sonstiges
| Datei | Was es tut |
|---|---|
| `Bau_Rechner.html` | Beton, DIN-Stahlprofile, Bewehrung |
| `Bau_CAD.html` | Einfaches 2D-Zeichnen mit Fang und DXF |
| `Structure_CAD.html` | Stahlbau-Generator: Silo, Halle, Buehne, Rack, Turm |
| `Trasse_CAD.html` | Kabeltrassenfuehrung zeichnen |
| `Visueller_Kabeltrassen_CAD.html` | Belegung von Trasse und Rohr grafisch, Fuellgrad |
| `Kabelterasse_Rechner.html` | Trassenbreite und Rohrgroesse aus der Kabelliste |
| `photo_CAD.html` | Foto zu Vektor, Nachzeichnen, DXF |
| `Brandschutz_Master_Global_Framework.html` | Regelwerk und Aufgabenliste Brandschutz, Normen-Zuordnung |

## Das Dashboard

[`dashboard/index.html`](dashboard/index.html) ist der Einstieg: alle 27 Werkzeuge
in den vier Abschnitten oben, mit Suche. Es laeuft wie die Werkzeuge selbst ohne
Server und ohne Build. Der Haus-Knopf in jedem Werkzeug fuehrt hierher zurueck.

Die Werkzeugdaten kommen aus [`shop/werkzeuge.js`](shop/werkzeuge.js) und werden
nicht noch einmal aufgeschrieben. Eine zweite Liste waere eine zweite Wahrheit -
in diesem Projekt sind zwei Tabellen fuer dieselbe Strombelastbarkeit schon einmal
um 14 bis 26 Prozent auseinandergelaufen.

### "Welches Werkzeug passt zu meiner Aufgabe?"

Die Aufgabe in eigenen Worten beschreiben, und die passenden Werkzeuge werden in
der Liste hervorgehoben, mit einem Satz dazu, warum.

Der Schluessel dafuer steht **nicht** in der Seite. Eine statische Seite auf Vercel
zeigt jedem Besucher alles, was in ihr steht; ein Schluessel darin waere ein
Schluessel fuer alle. Dazwischen liegt eine Edge Function:

```
Browser  ->  supabase/functions/werkzeug-assistent  ->  api.anthropic.com
                          |
                          +-- Schluessel aus public.app_config
```

`app_config` hat RLS und absichtlich keine policy. Nur `service_role` liest dort,
und `service_role` gibt es ausschliesslich innerhalb der Funktion.

Zwei Bremsen, weil der Endpunkt oeffentlich ist und an einer Schnittstelle haengt,
die Geld kostet:

| Bremse | Wert | wo |
|---|---|---|
| Laenge der Frage | 600 Zeichen | in der Funktion, vor dem Modellaufruf |
| Anfragen je Stunde | 60 | `public.werkzeuge_ki_bremse`, zaehlt in der Datenbank |

Beide sind **ausgeloest** worden, nicht nur nachgelesen: eine Frage mit 5000 Zeichen
kam mit 600 beim Zaehler an, und die 61. Anfrage einer Stunde wurde abgewiesen
(die Probe lief in einem Block und wurde zurueckgenommen).

Gezaehlt wird in der Datenbank und nicht im Speicher der Funktion: die laeuft in
mehreren Instanzen, und jede haette ihren eigenen Zaehler.

**Das Modell rechnet nicht.** Kv, Spannungsfall, Erdungswiderstand kommen aus der
Formel im Werkzeug. Das Modell darf auswaehlen, und nur aus dem Katalog: eine
Kennung, die es nicht gibt, wird verworfen, bevor die Antwort den Browser
erreicht. Faellt der Dienst aus, sagt die Seite das und die Suche arbeitet weiter.

> **Offen:** das Anthropic-Konto hat kein Guthaben. Die Kette ist bis
> `api.anthropic.com` geprueft und der Schluessel wird angenommen; die Antwort
> lautet derzeit *"credit balance is too low"*. Bis das Guthaben steht, zeigt die
> Seite ihre Stoerungsmeldung - die Suche und alle Werkzeuge sind davon nicht
> betroffen.

## Ein Aussehen fuer alle

Die 27 Werkzeuge sind ueber Jahre einzeln entstanden. Am gerenderten Dokument
gemessen waren es vorher **11 verschiedene Hintergruende, 11 Gruentoene, 6
Eckenradien und zwei Schriftfamilien**. Jedes Werkzeug sah fuer sich in
Ordnung aus; nebeneinander sahen sie nach 27 Herkuenften aus.

[`werkzeug-stil.css`](werkzeug-stil.css) zieht das zusammen und wird in jedem
Werkzeug als **letztes** geladen, nach dessen eigenem `<style>` - bei
gleicher Spezifitaet gewinnt die spaetere Regel.

Der wirksamere Hebel war aber nicht die Klassenliste, sondern die Variablen:
26 der 27 Werkzeuge fuehren ihre Akzentfarbe in einer CSS-Variablen. Wer die
umdefiniert, erreicht auch Regeln, die im Werkzeug mit `!important` stehen -
`Bau_Rechner` hat genau so eine.

| gemessen | vorher | jetzt |
|---|---|---|
| Schriftfamilie | 2 | **1** |
| Grundflaeche | 11 | **1** |
| Textfarbe | mehrere | **1** |
| Eingabefelder | mehrere | **1** (25 Werkzeuge; 2 Zeichenwerkzeuge haben keine) |
| Farbe am Hauptknopf | 4 | **1** |
| Gruentoene der Knoepfe | 11 | **1** (+2 mit Absicht, siehe unten) |

**Was mit Absicht nicht angefasst ist:**

- **Die Grundschriftgroesse.** 21 Werkzeuge stehen auf 16 px, sechs dichte
  (die Estimatoren, `Instrument_Selector`, `Petrochem`) auf 12 px. Eine
  erzwungene Vergroesserung wuerde ihre Tabellen umbrechen. Dichte ist eine
  Entscheidung, kein Versehen.
- **Zwei Knoepfe in `Trasse_CAD`.** Ihre Farbe ist dieselbe, in der das Teil
  danach gezeichnet wird - der Knopf sagt, was herauskommt. Wer die gruen
  macht, hat ein einheitliches Bild und ein schlechteres Werkzeug.
- **Farbcodierte Ablaeufe.** `photo_CAD` fuehrt seine Schritte in Blau, Gruen
  und Orange; die Modusknoepfe in `Trasse_CAD` sind blau, weil sie einen
  Zustand zeigen und keine Aktion.

Der schwebende Knopf des KI-Helfers sucht sich seinen Platz selbst: er sieht
nach, was unter ihm liegt, und rutscht hoch oder auf die andere Seite, bis
nichts Bedienbares mehr verdeckt ist. In `Instrument_Selector` lag dort der
Exportknopf, in `Electrical_Toolbox` ein ganzer Taschenrechner aus Knoepfen.
Zugedeckt heisst nicht anklickbar - das ist eine verlorene Funktion, kein
Schoenheitsfehler.

## KI in den Werkzeugen

Nicht ueberall - dort, wo sie etwas beitraegt. Wo die Rechnung feststeht (Kv,
Spannungsfall, Erdungswiderstand), kommt die Zahl aus der Formel. Das Modell
ordnet ein, warnt und begruendet; es rechnet nicht.

Alle Werkzeuge binden dieselbe Datei ein, [`ki-helfer.js`](ki-helfer.js), und
sprechen dieselbe Edge Function an. Eine Kopie je Werkzeug waeren vierzehn
Stellen, an denen eine Bremse fehlen kann.

| Betriebsart | wo | was sie tut |
|---|---|---|
| `werkzeug` | Dashboard | aus einer frei beschriebenen Aufgabe das Werkzeug finden |
| `deutung` | 12 Rechenwerkzeuge | das Ergebnis einordnen: liegt es im ueblichen Bereich, welcher Grenzwert ist gerissen, welche Stellschrauben gibt es |
| `auswahl` | `Instrument_Selector` | die Wahl des Messprinzips beurteilen - Ausschlusskriterien, die die Punktetabelle nicht kennt |
| `norm` | `Brandschutz_Master` | eine Frage zum Regelwerk beantworten |

Die zwoelf mit `deutung`: `Kabeldimensionierung`, `Load`, `Regelventil`,
`Earthing_CADE`, `Lighting_CAD`, `Druckverlustberechnung`,
`Electrical_Toolbox`, `Kabelterasse_Rechner`, `Petrochem_Hydraulic_Analysis`,
`Hydrocyclone`, `Cable_Manager`, `Visueller_Kabeltrassen_CAD`.

**Warum `Instrument_Selector` die interessanteste Stelle ist:** es ist das
einzige Werkzeug, dessen Kernaufgabe selbst ein Urteil ist. Und es hat eine
offene Luecke, deren Form dazu passt - die Rangfolge nutzt die Messspanne
nicht, weil belastbare Spannenangaben je Prinzip fehlen (siehe
[PRUEFBERICHT](PRUEFBERICHT.md), Abschnitt 2). Das ist Wissen, keine Rechnung.

**Warum beim Brandschutz vorsichtiger formuliert wird:** eine falsche Aussage
zu einer Norm ist dort gefaehrlicher als keine Aussage. Die Anweisung verlangt
ausdruecklich den Hinweis, dass die Anforderung am Normtext zu pruefen ist, und
dass dies eine Arbeitshilfe bleibt und kein Brandschutzkonzept.

Der Knopf haengt unten rechts und ist zugeklappt: die CAD-Werkzeuge brauchen
ihre Flaeche. Faellt der Dienst aus, sagt der Helfer das und das Werkzeug
rechnet weiter - beides wird geprueft.

### Wo kein Schluessel steht

Der Schluessel steht in **keiner** der Seiten. Jede davon ist statisch und fuer
jeden Besucher lesbar. Dazwischen liegt eine Edge Function:

```
Browser  ->  supabase/functions/werkzeug-assistent  ->  api.anthropic.com
                          |
                          +-- Schluessel aus public.app_config
```

`app_config` hat RLS und absichtlich keine policy. Nur `service_role` liest
dort, und `service_role` gibt es ausschliesslich innerhalb der Funktion.

Zwei Bremsen, weil der Endpunkt oeffentlich ist und an einer Schnittstelle
haengt, die Geld kostet:

| Bremse | Wert | wo |
|---|---|---|
| Freie Frage | 600 Zeichen | in der Funktion, vor dem Modellaufruf |
| Daten aus dem Werkzeug | 40 Felder, 3000 Zeichen | ebenda |
| Antwort | 400 bis 600 Token je Betriebsart | ebenda |
| Anfragen je Stunde | 60 | `public.werkzeuge_ki_bremse`, zaehlt in der Datenbank |

Ausgeloest und nicht nur nachgelesen: eine Frage mit 5000 Zeichen kam mit 600
beim Zaehler an, und die 61. Anfrage einer Stunde wurde abgewiesen (die Probe
lief in einem Block und wurde zurueckgenommen). Eine Anfrage ohne Angaben und
eine mit erfundener Betriebsart werden abgewiesen, **bevor** die Bremse zaehlt
- sie kosten also gar nichts.

Gezaehlt wird in der Datenbank und nicht im Speicher der Funktion: die laeuft
in mehreren Instanzen, und jede haette ihren eigenen Zaehler.

> **Offen:** das Anthropic-Konto hat kein Guthaben. Die Kette ist bis
> `api.anthropic.com` geprueft und der Schluessel wird angenommen; die Antwort
> lautet derzeit *"credit balance is too low"*. Bis das Guthaben steht, zeigen
> die Helfer ihre Stoerungsmeldung - die Werkzeuge rechnen davon unbeirrt
> weiter.

> **Vor dem Verkauf:** ein zweiter, tieferer Durchgang mit dem Massstab
> "wird an Ingenieurbueros verkauft" steht in **[PRUEFBERICHT.md](PRUEFBERICHT.md)**.
> Er enthaelt drei Dinge, die einen Verkauf blockieren, und faengt dort an, wo
> dieses README aufhoert.
>
> **Nach jeder Aenderung:** `cd tests && npm install && node run.cjs` - 305 Pruefungen
> in einem echten Browser, ohne Netz. Siehe **[tests/README.md](tests/README.md)**.

---

## Drei Sprachen: Deutsch, Persisch, Englisch

Die Werkzeuge sind auf Deutsch geschrieben, der Text steht im HTML. Seit
**`uebersetzung.js`** laesst sich oben links auf Persisch oder Englisch umschalten.
Das Woerterbuch steht in **`woerter.js`**, die Wahl bleibt im Browser gemerkt.

**Der Schluessel ist der deutsche Text selbst.** Das hat eine Eigenschaft, die hier
wichtiger war als Eleganz: *was nicht im Woerterbuch steht, bleibt Deutsch.* Ein
sichtbares deutsches Wort auf einer persischen Seite sagt die Wahrheit - es ist noch
nicht uebersetzt. Ein falsches persisches Wort wuerde luegen, und in einem Werkzeug,
das Kabel auslegt, ist das kein Schoenheitsfehler.

Aus demselben Grund gibt es **keine maschinelle Uebersetzung zur Laufzeit**: sie
braeuchte das Netz, und die Werkzeuge laufen ohne. Sie waere bei jedem Aufruf anders.
Und sie wuerde `Rueckschlagventil` und `Rueckschlagklappe` frueher oder spaeter
verwechseln - zwischen beiden liegt in diesem Projekt der Faktor 65 im
Widerstandsbeiwert.

**Nicht im Woerterbuch und damit unangetastet:** Normnamen (IEC 60751, DIN VDE
0100-430), Einheiten (mm2, bar, kVA), Formelzeichen (L, A, T, cos phi) und
Produktbezeichnungen (NYM-J 3x1.5). Eine Pruefung haelt fest, dass sie nicht
hineinrutschen.

**Zwei Dinge, die beim Bauen auffielen.**

Der Sprachwaehler lag zuerst fest oben links - und damit in zwei Werkzeugen auf dem
Haus-Knopf. Dasselbe war dem KI-Knopf schon zweimal passiert. Er sucht sich jetzt die
erste Ecke, unter der nichts Bedienbares liegt, und eine Pruefung geht dafuer durch
alle 27 Werkzeuge.

Persisch laeuft von rechts nach links, und das riss zuerst alles mit: aus `0 kW` wurde
sichtbar `kW 0`, der Punkt sprang an den Satzanfang. Eine Zahl mit der Einheit auf der
falschen Seite ist nicht haesslich, sie ist falsch gelesen. Mit
`unicode-bidi: plaintext` bestimmt jeder Textknoten seine Richtung aus seinem ersten
starken Zeichen - persischer Text laeuft rechts nach links, deutscher links nach
rechts. Das ist hier entscheidend, weil die meisten Texte noch deutsch sind.

**Jedes Werkzeug bringt sein eigenes Woerterbuch mit.** Die gemeinsame Schicht steht
in `woerter.js`, das Werkzeug-eigene in `woerter/<Name>.js`, eingehaengt ueber
`WZ_WOERTER_ERGAENZEN`. Der Grund ist nicht Ordnungsliebe: stuende alles in einer
Datei, laedt jedes Werkzeug die Woerter der 26 anderen mit. Die gemeinsame Schicht
gewinnt, und eine Pruefung nennt jede Dopplung - ein Wort, das je nach Seite etwas
anderes heisst, gehoert nicht in die gemeinsame Schicht, sondern in das Werkzeug.

Deshalb steht `Tag` dort nicht: es ist in drei Werkzeugen die
Messstellenkennzeichnung, nicht der Kalendertag. `OK` und `Standard` fehlen aus
demselben Grund - mal Knopf, mal Zustand; mal Voreinstellung, mal Norm.

**Ein Schluessel mit Tippfehler uebersetzt nichts und sieht aus wie ein Wort, das
eben noch deutsch ist.** Er faellt also nie auf. Darum prueft der Lauf, dass jeder
Schluessel auf seiner Seite auch wirklich steht; was ein Werkzeug erst beim Rechnen
schreibt, ist im Woerterbuch als solches genannt.

**Alle 27 Werkzeuge haben ihr Woerterbuch.** Die beiden Estimatoren teilen sich
eines: sie sind aus derselben Vorlage gebaut, und Kopfzeile, Preiskatalog und
RFQ-Teil sind Wort fuer Wort gleich. Es steht in
`woerter/estimator-gemeinsam.js` und wird von beiden geladen - in die
gemeinsame Schicht gehoert es nicht, dort stehen Woerter, die in allen 27
gelten.

**Das Dashboard und die Verkaufsseite auch.** Sie sind keine Werkzeuge, aber
sie sind das erste, was jemand sieht - eine deutsche Startseite vor 27
uebersetzten Werkzeugen waere eine Uebersetzung, die an der Tuer aufhoert.
Die Werkzeugliste - Namen, Kurzbeschreibungen, Gruppen - steht auf beiden
Seiten Wort fuer Wort gleich und liegt deshalb in
`woerter/werkzeugliste.js`; was nur auf einer Seite vorkommt, steht in
`woerter/dashboard.js` und `woerter/shop.js`.

Die Produktnamen bleiben, wie sie sind: `Cable Manager` heisst auf jeder
Sprachstufe `Cable Manager`, sonst findet niemand die Datei wieder. Ebenso
die Anschrift, die Rechtsangaben nach DDG und UStG, die Normnamen und die
Preise. Eine Anschrift uebersetzt man nicht - der Brief muss ankommen.

**Der Stand wird gemessen, nicht behauptet.** Die Pruefung zaehlt bei jedem Lauf,
wie viele sichtbare Texte noch keinen Woerterbucheintrag haben, und schreibt die
Zahl in den Bericht - **je Sprache einzeln, aber nicht mit demselben Mass:**

| Sprache  | gemessen wird | Stand |
|----------|---------------|-------|
| Persisch | sichtbare Texte ohne Woerterbucheintrag | 652 in 29 Seiten |
| Englisch | Texte, die im Englisch-Modus noch **deutsch** dastehen | 3 in 29 Seiten |

Die englische Zaehlung laesst einzelne Zeichen aus. MathJax legt jede Formel
in Zeichen-Elemente, und aus `\Delta P_{Höhe}` wird dabei ein Textknoten, der
nur `ö` enthaelt. Ein Buchstabe ist kein deutscher Satz.

Warum zwei verschiedene Masse: auf Persisch braucht jeder sichtbare Text
einen Eintrag, die Zahl der Texte ohne Eintrag ist also die Luecke. Auf
Englisch nicht - die meisten Werkzeuge sind ohnehin englisch beschriftet
(`Cable Size`, `Export DXF`, `Project Header`), fuer sie ist nichts zu
uebersetzen, und ein Eintrag waere ein Wort auf sich selbst. Dieselbe
Zaehlung ergibt auf Englisch 1454 und sagt nichts ueber den Stand. Was
zaehlt, ist das Gegenteil: deutscher Text auf einer englischen Seite.

Die 652 persischen sind fast nur noch, was auch dort bleiben soll:
Katalogschluessel (`ACC_MANIFOLD_3V`), Statuswerte (`OK`, `UNKNOWN`,
`RFQ_REQUIRED`), Nennweiten (`DN 100`), Produktnamen, Einheiten, Zeitstempel,
Messwerte und die einzelnen Zeichen der von MathJax gesetzten Formeln. Die Zahl
geht deshalb nicht mehr gegen null, und das ist richtig so.

Die drei deutschen Reste im Englisch-Modus sind genannt und gewollt: die
Strasse und die Zeile nach DDG und UStG auf der Verkaufsseite, und die
Spaltennamen der Excel-Vorlage im Instrumentation-Estimator, die genau so in
der Datei stehen.

**Eine Korrektur:** hier stand zuerst, sieben Woerterbuecher laegen auf
Englisch weit zurueck, `Brandschutz_Master` mit 5 Eintraegen gegen 291
persische. Die Zahlen stimmten, der Schluss war falsch: diese Werkzeuge sind
englisch beschriftet, ihr persisches Woerterbuch uebersetzt englischen Text,
und auf Englisch ist deshalb nichts zu tun. Nachgemessen wurde erst danach -
und beim Nachmessen fiel auf, dass das Urteil im Lichtwerkzeug
(`EN 12464-1 ERFÜLLT` und die drei Fehlermeldungen daneben) in **keiner**
Sprache im Woerterbuch stand. Es wird beim Rechnen geschrieben, und niemand
hatte danach gesehen. Ausgerechnet die Zeile, auf die man schaut.

Gezaehlt werden 29 Seiten, nicht 27. Das Dashboard und die Verkaufsseite
liegen in Unterordnern und standen deshalb ausserhalb der Schleife - sie
waren nicht uebersetzt, und die Zahl im Bericht sagte es nicht, weil sie
nicht mitzaehlte. Eine Zahl, die einen Teil der Seiten auslaesst, ist keine
Messung, sondern eine Auswahl. Jetzt zaehlt sie beide mit, und dieselbe
Luecke kann nicht noch einmal unbemerkt bleiben.

Eine halbe Uebersetzung, die so tut als waere sie fertig, ist schlimmer als eine,
die ihren Stand nennt.

---

## Befunde aus dem Lesedurchgang

Alles hier ist gelesen, nicht vermutet. Was ich nicht im Browser nachstellen konnte,
steht ausdruecklich als "zu pruefen" da.

### Trifft alle Dateien

1. ~~**Der Home-Knopf ist tot.**~~ *(erledigt)* Jede Datei verwies auf
   `file:///P:/001_Allgemein/011_EMSR/100_KI-Engineering-Dashboard/KI-Engineering-Dashboard.html`.
   Aus einer https-Seite blockiert jeder Browser `file://`. Auf dem Netzlaufwerk
   funktionierte das, im Netz nicht. Alle 27 Dateien zeigen jetzt auf
   `dashboard/`. In sieben Werkzeugen stand zusaetzlich eine Hilfsfunktion, die
   den Verweis uebersprang und bei Misserfolg auf eine Ersatzdatei auswich, die
   es nie gab; sie ueberlaesst die Arbeit jetzt dem Verweis selbst.
2. ~~**Das Dashboard fehlt.**~~ *(erledigt)* `ingeneering dashboard` war eine leere
   Datei mit einem Byte. Es steht jetzt unter [`dashboard/`](dashboard/index.html).
   Von den drei Verweisen auf Dateien, die es nie gab: `Kabel Calculation.html`
   meinte die Kabeldimensionierung und zeigt jetzt dorthin;
   `Engineering_Dashboard.html` stand nur in einem Suchmuster und hat nie etwas
   getroffen; `Typical_Manager.html` hat in dieser Sammlung keine Entsprechung -
   kein Werkzeug erzeugt eine Signalliste -, die beiden Verweise darauf sind
   deshalb entfallen statt auf etwas Aehnliches zu zeigen.
3. **23 von 27 Werkzeugen speichern nichts.** Ein Neuladen loescht alle Eingaben.
   Nur `Brandschutz_Master`, die beiden Estimatoren und `Visueller_Kabeltrassen_CAD`
   nutzen `localStorage`. Bei `Loop_CAD`, `Cause_Effect` und `Trasse_CAD` faellt das
   am meisten weh, weil man dort am meisten eintippt.
4. **DXF ohne Massstab.** Die Exporte schreiben R12 mit SVG-Pixelkoordinaten und ohne
   `$INSUNITS`. Die Zeichnung kommt in CAD in falscher Groesse an.
5. ~~**Zwei CDN-Verweise sind nicht auf eine Version festgelegt**~~ *(erledigt)*
   `chart.js` und `mathjax@3` standen ohne Fassung da. Alle Bibliotheken liegen
   jetzt fest versioniert unter `bibliotheken/`.
6. ~~**`Brandschutz_Master` laedt three.js ueber einen Pfad, den es nicht gibt**~~
   *(erledigt)* Im Browser bestaetigt: `examples/js/controls/OrbitControls.js`
   fehlt ab r148, der Verweis lief immer ins Leere - auch mit Internet. Zu
   praezisieren ist die Vermutung von oben: `build/three.min.js` wurde **nicht**
   entfernt, das gibt es in r160 sehr wohl. Nur `examples/js` fehlt. Das Werkzeug
   laeuft jetzt auf derselben Fassung 0.128 wie die anderen vier.

### Fehler, die das Ergebnis verfaelschen

Nach Gewicht sortiert.

**`Load.html` - Tippfehler in der Trafo-Reihe** *(behoben)*
`stdTrafos` enthielt an 13. Stelle `160` statt `1600`. Die Auswahl nimmt den ersten
Wert groesser gleich Bedarf, sprang ueber die falsche 160 hinweg und schlug fuer jeden
Bedarf zwischen 1250 und 1600 kVA einen **2000-kVA-Trafo** vor. Siehe unten.

**`Earthing_CADE.html` - Erdungswiderstand zu niedrig** *(behoben, siehe unten)*
Radius gegen Durchmesser verwechselt, Stabkopplung ignoriert, und die Bandlaenge
zaehlte L+W Meter mehr, als das Werkzeug selbst zeichnet. Alle drei machten den
angezeigten Widerstand **zu klein** - bei einer Schutzmassnahme die gefaehrliche
Richtung.

**`Kabeldimensionierung_Spannungsfall.html` - Strombelastbarkeit ungeklaert**
*Teilweise bearbeitet, siehe unten.*
Die Widerstaende sind gegen IEC 60228 geprueft und stimmen. Die `imax`-Spalte hat
dagegen keine dokumentierte Quelle, und der Vergleich mit `Cable_Manager.html` zeigt,
dass die beiden Werkzeuge **dieselbe Groesse verschieden fuehren**:

| mm2 | Kabeldimensionierung | Cable_Manager | Abweichung |
|---|---|---|---|
| 1,5 | 24 A | 19 A | +26 % |
| 2,5 | 32 A | 28 A | +14 % |
| 6 | 54 A | 46 A | +17 % |
| 16 | 100 A | 85 A | +18 % |
| 50 | 192 A | 165 A | +16 % |
| 150 | 399 A | 334 A | +19 % |

Eine der beiden Tabellen ist falsch, oder sie meinen verschiedene Verlegearten, ohne
das zu sagen. Die Al-Spalte ist kein eigener Datensatz: sie ist durchgaengig das
0,75-fache der Cu-Spalte. Das Verhaeltnis stimmt physikalisch, erbt aber jeden Fehler.

**Diese Zahlen lassen sich nicht aus dem Gedaechtnis ersetzen.** Es braucht die
VDE 0298-4 selbst, und zwar mit der Angabe, welche Isolierung, welche
Umgebungstemperatur und wie viele belastete Adern gemeint sind.

**`Regelventil.html` - Gas und Dampf** *(behoben)*
Vier Fehler in einer Datei: `Y` wurde berechnet und nie benutzt, der Nenner war
doppelt so gross wie er sein darf, bei kritischer Stroemung wurde weiter mit dem
vollen Druckabfall gerechnet, und beim Dampf war das Feld "Spez. Volumen" ohne
Wirkung. Siehe unten.

**`Petrochem_Hydraulic_Analysis.html` - Vorzeichen und NPSH** *(behoben, siehe unten)*
- `Math.abs(H_stat)` in der Leistungsrechnung: faellt die Leitung ab, hilft die
  Schwerkraft. Der Betrag macht daraus zusaetzliche Last.
- NPSHa wird mit der geodaetischen Hoehe der **Gesamtanlage** gerechnet. NPSHa haengt
  nur an der Saugseite. Die Kavitationswarnung ist so nicht belastbar.
- Die Anlagenkennlinie `(q/q_nom)^2` geht durch den Nullpunkt; richtig ist
  `H = H_stat + k*Q^2`.

**Spannungsfall bei 20 °C statt Betriebstemperatur** *(behoben, siehe unten)*
Beide Werkzeuge rechneten mit dem kalten Leiter. Ab 95 mm2 fehlt weiterhin der
induktive Anteil X - gleiche Richtung, noch offen.

**`Hydrocyclone.html` - Gueltigkeitsbereich** *(behoben, mit Korrektur)*
Der hier zuerst gemeldete Einheiten-Widerspruch bei C2 **existiert nicht** - siehe
die Korrektur unten. Der echte Fehler war, dass nicht rechenbare Ergebnisse als
**0** angezeigt wurden statt als Fehler.

**`Electrical_Toolbox.html` - Kondensatorstufe unterkompensiert**
Die Auswahl nimmt die *naechstliegende* Standardstufe, auch wenn sie kleiner ist als
noetig. Muss aufrunden.

**`Load.html` - Motorsicherung** *(behoben)*
`fuseStd.find(x => x > I)` waehlte die naechste gG-Sicherung ueber Nennstrom - beim
Anlauf fliegt die. Der Kommentar darueber sagte `I * 1.5`, die Zeile tat etwas
anderes. Bei 30 kW kamen so 63 A gG heraus, neben einem Anlaufstrom von 377 A.

Ein Motorabgang hat **zwei** Schutzfunktionen, und sie stehen jetzt getrennt da,
wie in DIN VDE 0100-430 und IEC 60947-4-1 auch:

| | Aufgabe | Bemessung |
|---|---|---|
| Ueberlastschutz | schuetzt den Motor | thermisches Relais auf In |
| Kurzschlussschutz | schuetzt die Leitung | Sicherung, die den Anlauf uebersteht |

Die Sicherung muss zwei Bedingungen zugleich erfuellen: den Nennstrom dauernd
tragen **und** den Anlaufstrom fuer die Anlaufzeit aushalten. Beides wird jetzt
gerechnet, getrennt fuer Direkt- und Stern-Dreieck-Anlauf, dazu die aM-Variante
auf Nennstrom. `Ia/In` und die Anlaufzeit sind Eingaben - beides steht auf dem
Typenschild und gehoert nicht geraten. Die Annahme hinter der Sicherungswahl
(welches Vielfache die gG-Sicherung fuer diese Zeit traegt) steht unter dem
Ergebnis, damit man ihr widersprechen kann.

Gegen die ueblichen Auswahltabellen gehalten: 30 kW direkt 100 A gG, 7,5 kW 25 A,
110 kW 315 A, aM jeweils auf den Nennstrom. Sechs Pruefungen halten das fest.

**`Cable_Manager.html` - Wirkungsgrad fehlt** *(behoben)*
`I = kW*1000/(sqrt(3)*U*cos phi)` ohne eta, dazu ein fest verdrahtetes
cos phi = 0,85. Bei einem Motor ist die Leistung auf dem Typenschild die
**mechanische** Wellenleistung; elektrisch zieht die Maschine P/eta. Der Strom kam
damit 5 bis 10 % zu niedrig heraus - und weil der Querschnitt aus genau diesem Strom
gewaehlt wird, war das Kabel zu klein. Beim Kabel ist zu klein die gefaehrliche
Richtung.

Jetzt sind Verbrauchertyp, eta und cos phi Eingaben. Bei "allgemeine Last" ist die
eingegebene Leistung bereits die elektrische, und das eta-Feld wird gesperrt statt
still ignoriert - ein Feld, das nichts tut, ist eine Falle.

Vier Pruefungen halten `Load` und `Cable_Manager` fuer denselben Motor gegeneinander,
in derselben Bauart wie die Pruefung der Strombelastbarkeit: legt jemand wieder eine
eigene Rechnung an, faellt sie um.

**`Electrical_Toolbox.html` - der Taschenrechner fuehrte Code aus** *(behoben)*
Die Eingabezeile ging als Ganzes in `eval()`. Damit war der Taschenrechner keine
Rechnung mehr, sondern eine offene Tuer: was dort steht, laeuft mit allen Rechten
der Seite. Wer jemandem einen fertigen Ausdruck schickt ("tipp das mal ein"),
laesst bei ihm Code laufen. Nebenbei kam `5/0` als `Infinity` heraus und
`1/0*0` als `NaN` - beides sah aus wie ein Ergebnis.

Jetzt liegt dort ein eigener Auswerter: die Eingabe wird in Zeichen zerlegt, und
zugelassen sind nur Zahlen, `+ - * / ( ) **`, `Math.PI` und die Funktionen, die
die Tasten anbieten. Alles andere faellt durch, statt ausgefuehrt zu werden. Ein
Ergebnis, das keine endliche Zahl ist, meldet einen Fehler statt `Infinity`.

Fuer den Bediener aendert sich nichts: 16 Ausdruecke aus dem taeglichen Gebrauch
wurden gegen das alte `eval()` gehalten und liefern Ziffer fuer Ziffer dasselbe.
14 Eingaben, die kein Ausdruck sind, werden abgewiesen. Beides steht als Pruefung
im Testlauf, zusammen mit der Bedingung, dass `eval(` im Code nicht mehr
vorkommt.

**`Lighting_CAD.html` - der Betriebswirkungsgrad war erfunden** *(behoben)*
Im Code stand `UF = 0,45 + 0,4*(1-exp(-0,8*K))`, dazu im Kommentar "curve fit" und
"approximates typical LED behavior". Auf dem Bildschirm stand daneben
"Reflexion (Decke/Wand/Boden) 70/50/20" - als feste Beschriftung, die **nichts**
gerechnet hat. Der Benutzer las eine Randbedingung, die es in der Formel gar nicht gab.

Die Abweichung ging in beide Richtungen, und in der gefaehrlichen weiter: bei
k = 0,6 gab die Kurve 0,60, wo 0,42 richtig ist - 44 % zu hoch, also zu wenige
Leuchten und ein unterbelichteter Raum. Bei k = 6 gab sie 0,85 statt 1,03, also zu
viele Leuchten und zu viel Geld.

Jetzt wird der Raum als Hohlraum aus drei Flaechen gerechnet - Decke (zugleich
Leuchtenebene), Waende zwischen Leuchte und Nutzebene, Nutzebene -, mit diffuser
Reflexion. Das ist dieselbe Annahme, aus der auch die Wirkungsgradtabellen der
Hersteller entstehen. Zwei Teile:

1. **Direktanteil.** Welcher Teil des nach unten abgegebenen Lichtstroms ohne Umweg
   auf der Nutzebene landet, ist reine Geometrie: der Formfaktor zweier gleich
   grosser, parallel gegenueberliegender Rechtecke. Dafuer gibt es eine geschlossene
   Loesung (Hottel). Ich habe sie nicht geglaubt, sondern gegen eine numerische
   Integration gehalten: X=Y=1 gibt 0,1998, X=Y=2 gibt 0,4153, X=Y=10 gibt 0,8270 -
   analytisch und numerisch auf vier Stellen gleich.
2. **Zwischenreflexion.** Die Strahlungsbilanz der drei Flaechen wird geloest, bis
   sie sich nicht mehr aendert. Bei Reflexionsgrad null bleibt genau der
   Direktanteil uebrig, wie es sein muss.

Gegen die ueblichen Tabellen gehalten: k = 0,6 mit 70/50/20 gibt 0,42, k = 1,75 gibt
0,79, k = 3,1 gibt 0,93. Das liegt dort, wo die Tabellen liegen.

Reflexionsgrade und Leuchtenart (Direktanteil nach CIE, vom Einbaustrahler bis zum
Deckenfluter) sind jetzt Eingaben. Wichtiger noch: wer die Wirkungsgradtabelle seiner
Leuchte hat, stellt auf *aus dem Datenblatt* um und traegt den Wert ein. Der
Hersteller kennt die Lichtverteilung seiner Leuchte, dieses Werkzeug nicht - und ein
Nachweis nach EN 12464-1 wird mit dem Datenblatt gefuehrt, nicht mit einem Modell.
Das Ergebnisfeld schreibt darum dazu, woher der UF kommt.

Nebenbei: bei wenigen Leuchten in einem langen Raum rundete die Rasteraufteilung die
Spaltenzahl auf **0**, und `N / 0` ergab Unendlich. Mindestens eine Reihe.

Sieben Pruefungen halten das fest, darunter die Richtung, auf die es ankommt: derselbe
Raum mit dunklen Oberflaechen braucht mehr Leuchten als mit hellen.

**`Kabeldimensionierung_Spannungsfall.html` - Spannungsfall ohne cos phi und ohne X**
*(behoben)*
Im Code stand `dU = sqrt(3) * I * R * L`. Es fehlte nicht nur der induktive Anteil,
wie im Pruefbericht vermerkt - es fehlte auch der **Leistungsfaktor**, obwohl es ein
Eingabefeld dafuer gibt und der Benutzer dort etwas eintraegt. Richtig ist

    dU = sqrt(3) * I * L * (R' * cos phi + X' * sin phi)

Die beiden Fehler zeigen in verschiedene Richtungen, und das macht sie unangenehm:

- Ohne `cos phi` kommt **zu viel** heraus. Bei kleinen Querschnitten, wo R gegen X
  gross ist, ueberwiegt dieser Fehler: 63 A auf 80 m bei cos phi 0,9 ergaben 25 mm2,
  noetig sind 16. Teuer, aber ungefaehrlich.
- Ohne `X' * sin phi` kommt **zu wenig** heraus. Ab etwa 95 mm2 ueberwiegt dieser
  Fehler: 250 A auf 250 m bei cos phi 0,8 ergaben 240 mm2, noetig sind 300. Der
  induktive Anteil macht dort 45 Prozent des gesamten Spannungsfalls aus. Zu klein
  ist beim Kabel die gefaehrliche Richtung.

Der Umschlagpunkt liegt dort, wo `R' * (1 - cos phi) = X' * sin phi` wird, bei
cos phi 0,8 also bei R' um 0,24 Ohm/km - das ist 95 mm2 bei Betriebstemperatur. Genau
die Grenze, die im Pruefbericht steht.

Fuer X' steht 0,08 Ohm/km voreingestellt, und das Feld ist aenderbar. Der Wert ist
nicht abgeschrieben, sondern aus der Geometrie nachgerechnet:
`L' = 2e-7 * ln(a/GMR)` mit dem Leiterabstand a im Mantel und dem geometrischen
Mittelradius GMR = 0,7788 * r ergibt 0,070 Ohm/km bei 240 mm2 und 0,103 bei 1,5 mm2.
0,08 liegt in der Mitte und ist dort, wo es darauf ankommt - bei grossen
Querschnitten -, die sichere Seite. Wer das Datenblatt hat, traegt seinen Wert ein.

Das Ergebnisfeld schreibt jetzt dazu, wie sich der Spannungsfall aufteilt: so viel
ohmsch, so viel induktiv, und der induktive Anteil in Prozent. Ein Ingenieur, der
300 statt 240 mm2 verlegen soll, darf sehen, woher die Zahl kommt.

Bei Gleichstrom entfaellt der induktive Anteil, und das steht auch dort.

**Die Kabeltyp-Auswahl rechnet jetzt mit.** Sie stand nur im Ergebnistext. Eine
eigene Iz-Spalte je Typ waere geraten - die vorhandene Tabelle ist selbst noch
ungeprueft, und zwei Unsicherheiten uebereinander sind schlechter als eine. Was die
Isolierung dagegen **definitorisch** festlegt, ist die hoechste zulaessige
Leitertemperatur: PVC 70 Grad, halogenfrei vernetzt 90 Grad, Gummi 60 Grad. Wer eine
H07RN-F mit 90 Grad rechnet, bekommt das jetzt gesagt, statt eine Zahl zu sehen, die
es fuer dieses Kabel nicht gibt.

Sieben Pruefungen. Die bestehende Temperaturpruefung stand auf 10,6 kW und 200 m -
mit `cos phi` in der Formel entscheidet dieser Fall nicht mehr, also steht sie jetzt
auf 12 kW, wo der Temperatureffekt weiterhin eine Nummer ausmacht. Die Pruefung wurde
verschoben, nicht aufgeweicht.

**`MSR_Loop_Check_Skalierung.html` - Pt100 nur ueber null** *(behoben)*
Die Callendar-Van-Dusen-Gleichung der IEC 60751 hat zwei Aeste:

    t >= 0:  R = R0 * (1 + A*t + B*t^2)
    t <  0:  R = R0 * (1 + A*t + B*t^2 + C*(t-100)*t^3)

Der C-Term fehlte. Das Werkzeug hat darauf ehrlich reagiert und unter null Grad gar
nichts gerechnet - besser als still falsch zu rechnen, aber eben nur die halbe
Aufgabe. In der Kaelteanlage einer Molkerei und im Tanklager einer Raffinerie steht
die Haelfte der Messstellen unter null; ein Werkzeug fuer die Inbetriebnahme, das
dort schweigt, wird zur Inbetriebnahme nicht mitgenommen.

Jetzt ist der C-Term da, mit `C = -4,183e-12`. Zehn Punkte der Normtabelle von -200
bis 850 Grad stimmen auf zwei Stellen: -200 gibt 18,52 Ohm, -100 gibt 60,26, 0 gibt
100,00, 100 gibt 138,51, 850 gibt 390,48.

Der Rueckweg war die eigentliche Arbeit. Ueber null Grad ist die Gleichung
quadratisch und laesst sich aufloesen - das stand auch schon da. Darunter macht der
C-Term sie zur vierten Ordnung, und eine geschlossene Loesung gibt es nicht. Statt
eine Naeherung zu erfinden wird eingeschachtelt: R(t) steigt im ganzen Bereich streng
monoton, damit ist die Halbierung sicher und trifft. Ueber den gesamten Bereich von
-200 bis 850 Grad weicht der Rueckweg um hoechstens 8e-13 K ab, also um nichts.

Nebenbei zwei Dinge, die dazugehoeren:

- **Pt1000** ist waehlbar. Es ist derselbe Fuehler mit zehnfachem R0, also derselbe
  Rechenweg - aber wer im Feld einen Pt1000 hat und ein Werkzeug, das nur Pt100 kann,
  rechnet im Kopf mal zehn und vertut sich irgendwann.
- Der **Geltungsbereich der Norm** wird geprueft, in beide Richtungen: -200 bis 850
  Grad, beim Widerstand 18,52 bis 390,48 Ohm beim Pt100. Ausserhalb steht die Grenze
  da, statt eines Wertes, den die Gleichung dort nicht mehr deckt.

Neun Pruefungen, davon fuenf gegen die Normtabelle. Eine davon haelt etwas fest, das
leicht fuer einen Fehler gehalten wird: wer den **gerundeten** Tabellenwert 60,26 Ohm
eintippt, bekommt -99,99 Grad zurueck, nicht -100,00. Das ist die Rundung der
Eingabe, nicht die des Werkzeugs, und soll sichtbar bleiben.


Koeffizienten A und B sind korrekt, der C-Term fuer negative Temperaturen fehlt in
beiden Richtungen. Bei -20 °C rechnet das Werkzeug still falsch, ohne Hinweis.

**`Schaltschrank_CAD.html` - keine Waermebilanz** *(behoben)*
Das Werkzeug hat den Schrank bestueckt und nie gefragt, was die Bestueckung an Waerme
abgibt. IEC 61439-1 verlangt den Nachweis, dass die Grenzuebertemperatur im Inneren
eingehalten wird, und in der Praxis ist genau das die Stelle, an der ein Schrank
stirbt: voll bestueckt, IP54, Tuer zu, Sommer - innen ueber 55 Grad, und die Geraete
schalten sich selbst ab. Ein Schrank, den niemand thermisch gerechnet hat, ist keine
Planung, sondern eine Wette.

**Die Nutzoberflaeche** kommt aus den Oberflaechenfaktoren b der IEC 60890: Dach 1,4,
freie Seiten 0,9, verdeckte Seiten 0,5, Boden 0. Ich habe sie nicht einfach
uebernommen, sondern die Gegenprobe gemacht: fuer den freistehenden Schrank ergeben
sie `1,8*H*(B+T) + 1,4*B*T`, fuer den Wandschrank `1,4*B*(H+T) + 1,8*H*T` - genau die
beiden Formeln, die in jedem Schrankkatalog stehen, auf vier Stellen. Damit lassen
sich auch die beiden anderen Faelle - Reihenende und Schrank in der Reihe -
konsistent bilden, statt sie zu suchen.

**Die Uebertemperatur** wird mit `dT = Pv / (k * Ae)` gerechnet, mit k = 5,5 W/(m2*K)
fuer lackiertes Stahlblech. Hier gehoert eine Einschraenkung dazu, und sie steht auch
im Werkzeug: IEC 60890 gibt dT nicht linear an, sondern ueber Kurven, die von Ae und
der Schrankhoehe abhaengen. Diese Kurven liegen uns nicht vor. Das lineare k*A-Modell
ist das, mit dem jeder Schrankhersteller sein Kuehlgeraet auslegt - es ist die
richtige Groessenordnung und die richtige Tendenz, aber es ist nicht der
Kurvennachweis der Norm. Eine erfundene Kurve waere die schlechtere Antwort gewesen;
siehe `Lighting_CAD`.

**Die Massnahme** wird beziffert, nicht nur angemahnt. Ist es zu warm und die
Umgebung kuehler als das Ziel, genuegt ein Filterluefter, und das Werkzeug nennt die
Luftmenge. Der Faktor dafuer ist wieder nicht abgeschrieben, sondern aus der
Waermekapazitaet der Luft: `V = P / (rho * cp * dT)` mit rho*cp = 1206 J/(m3*K) gibt
2,99 m3/h je Watt und Kelvin. Die Luefterhersteller rechnen mit rund 3,1 und haben
damit etwas Luft fuer Hoehe und verschmutzten Filter.

Ist die Umgebung dagegen **waermer** als die zulaessige Innentemperatur, hilft ein
Luefter nicht mehr - er blaest warme Luft hinein. Dann steht dort das Kuehlgeraet.
Das ist der Fall, den man in der Halle einer Giesserei oder neben einem Ofen hat, und
es ist der Fall, in dem der Luefter trotzdem bestellt wird.

Die Verlustleistung je Bauteil ist ein Typwert - CPU 10 W, IO 5 W, Netzteil 40 W,
Relais 1 W - und am Bauteil aenderbar. Wer das Datenblatt hat, traegt seinen Wert ein
und dieser gewinnt. Die Stueckliste fuehrt die Verlustleistung jetzt Position fuer
Position und summiert sie.

Nebenbei gefunden und erledigt: die Bilanz wurde zuerst **vor** dem Anhaengen des
Bauteils an die Platte gerechnet und hat darum genau das Bauteil nicht mitgezaehlt,
das gerade dazugekommen war. Die Pruefung hat es gefunden, nicht ich.

Acht Pruefungen, davon drei gegen die von Hand nachgerechnete Nutzoberflaeche.

**Beide Estimatoren - der Risikozuschlag lag auf der halben Summe** *(behoben)*
Im Code stand `const baseForOH = materialTotal + montageTotal;` und darauf lagen beide
Zuschlaege. Planung, Programmierung, FAT/SAT, Loop-Blaetter und Inbetriebnahme blieben
aussen vor.

Beim **Handlingzuschlag** ist das richtig und bleibt so: ein Beschaffungszuschlag gilt
dem eingekauften Material. Auf die eigenen Stunden nimmt niemand einen
Beschaffungszuschlag.

Bei der **Contingency** ist es genau falsch herum. Das ist der Risikozuschlag auf das
ganze Angebot, und Stunden sind unsicherer als Materialpreise, nicht sicherer. Ein
Geraet kostet, was der Lieferant schreibt; wie lange die Inbetriebnahme dauert, weiss
vorher niemand. Waechst der Umfang, wachsen die Stunden mit, meistens staerker als das
Material.

Wie gross der Fehler ist, zeigt der magere Fall aus der Pruefung: keine Geraetezeile,
40 Stunden Basic und 60 Stunden Detail zu je 100 Euro. Das Werkzeug legt selbst eine
Steuerungs-Grundposition von 950 Euro an. Zehn Prozent Risikozuschlag ergaben damit

    alt:  950 * 10 %      =    95 Euro
    neu:  10.950 * 10 %   = 1.095 Euro

Elfeinhalbfach. Bei einem Projekt, das zur Haelfte aus Stunden besteht, fehlte die
Haelfte des Risikozuschlags. Ein Angebot, das zu billig ist, wird unterschrieben - das
ist die Richtung, in die dieser Fehler zeigt.

**Eine Summe mit ungesicherten Preisen sagt das jetzt selbst.** Der Status stand schon
da, aber als *Anzahl*: "UNKNOWN 3". Die Anzahl sagt nichts ueber das Risiko - drei
Positionen koennen 200 Euro sein oder 200.000. Jetzt steht hinter der Summe
"(vorlaeufig)" und daneben, wieviel Geld auf ungesicherten Preisen steht, in Euro und
als Anteil am Material. Wer ein Angebot unterschreibt, liest die grosse Zahl, nicht die
Fussnote darunter.

Sieben Pruefungen, in beiden Werkzeugen. `Engine.compute()` ist eine reine Funktion,
also wird sie direkt gerufen statt die Oberflaeche zu bedienen - so haengt kein Fall an
Zeilen, die ein frueherer Fall im Browser gespeichert hat.

**`Load.html` - die Kurzschlussdaten am Trafo** *(neu)*
Das Werkzeug hat die Trafogroesse genannt und dort aufgehoert. In einem Ingenieurbuero
fragt danach aber immer jemand dasselbe: *und was muss der Hauptschalter koennen?*
Diese Zahl folgt aus dem Typenschild in zwei Zeilen, und sie stand nicht da.

    I_k" = I_n * 100 / u_k                     IEC 60909, Speisung nur aus dem Trafo
    i_p  = kappa * sqrt(2) * I_k"
    kappa = 1,02 + 0,98 * e^(-3*R/X)

`u_k` und `P_k` sind jetzt Eingaben - beide stehen auf jedem Typenschild. Wichtig ist,
woher **kappa** kommt: nicht aus dem ueblichen Pauschalwert 1,8, sondern aus demselben
Typenschild. `u_R = P_k/S_n` und `u_X = sqrt(u_k^2 - u_R^2)` geben R/X, und daraus
folgt kappa. Fuer 1000 kVA mit u_k 6 % und P_k 10,5 kW sind das 1,60, nicht 1,8 - der
Pauschalwert haette den Stosskurzschlussstrom um 13 Prozent zu hoch angesetzt.

Eine Einschraenkung, und sie steht auch im Werkzeug: das vorgelagerte Netz wird
weggelassen. Seine Impedanz kaeme in Reihe dazu und wuerde den Strom **kleiner**
machen. Ohne sie kommt also zu viel heraus - und beim Schaltvermoegen ist zu viel die
sichere Richtung. Wer die Netzkurzschlussleistung seines Versorgers hat, rechnet
genauer; dieser Wert liegt nie darunter.

Das Schaltvermoegen wird auf die naechste genormte Stufe aufgerundet, nie ab. 1000 kVA
mit u_k 6 % geben 24,1 kA, also einen Schalter mit 25 kA. Dieselbe Groesse mit u_k 4 %
gibt 36,1 kA und verlangt 50 kA - anderthalbfacher Strom aus einer einzigen Zahl auf
dem Typenschild. Das ist der Grund, warum sie eine Eingabe ist und keine Annahme.

Fuenf Pruefungen, alle gegen von Hand nachgerechnete Werte.

**`Lighting_CAD.html` - die Gleichmaessigkeit wurde nie geprueft** *(neu)*
Im Code stand woertlich `// 4. Grid Arrangement (S/H ratio check)`. Geprueft wurde
nichts. Das Werkzeug hat ein Raster gelegt und **"STANDARDS ERFUELLT"** gemeldet,
sobald der Mittelwert stimmte. Nach EN 12464-1 ist eine Anlage damit nicht
nachgewiesen: neben der mittleren Beleuchtungsstaerke steht dort immer eine
geforderte Gleichmaessigkeit U0. Ein Raum mit hellen Flecken unter den Leuchten und
dunklen dazwischen kann den Mittelwert halten und trotzdem durchfallen - und genau
das meldete das Werkzeug als erfuellt.

Statt ein Abstandsverhaeltnis gegen eine Grenze zu halten, wird die
Beleuchtungsstaerke jetzt wirklich ausgerechnet. Jede Leuchte ist ein
Lambert-Strahler:

    E = I0 * h^2 / (h^2 + r^2)^2,   I0 = Phi / pi

Auch das ist nicht geglaubt, sondern geprueft: ueber die ganze Ebene integriert gibt
die Formel genau Phi zurueck (999,94 von 1000 bei numerischer Integration). Der
Direktanteil wird Punkt fuer Punkt summiert, die Zwischenreflexion kommt aus der
Strahlungsbilanz als gleichmaessiger Sockel dazu.

**Die Gegenprobe ist die eigentliche Absicherung:** das Flaechenmittel dieses Rasters
ergibt dieselbe Beleuchtungsstaerke wie die Lumenmethode - 567 lx im Vorgaberaum, auf
die Zahl genau. Zwei unabhaengige Rechenwege, dasselbe Ergebnis.

Bewertet wird ohne den Randstreifen von 0,5 m, wie es EN 12464-1 vorsieht. E_min
kommt aus einem Raster, das die Ecken mitnimmt; E_mittel ist ein Flaechenmittel mit
der Trapezregel, damit der Rand nicht doppelt zaehlt. Mit 25 Punkten je Richtung ist
es austauschbar genau: n = 25 gibt 0,6301, n = 41 gibt 0,6297.

**Dabei kam etwas heraus, das ich nicht erwartet hatte.** Die groesste Stellschraube
fuer die Gleichmaessigkeit ist nicht die Leuchtenzahl, sondern der **Wandabstand der
Randleuchten**. Das Minimum liegt immer am Rand, und wer mehr Leuchten haengt,
vergroessert das Randdefizit im selben Verhaeltnis mit - U0 bleibt stehen, egal wie
dicht das Raster wird. Die Zahlen aus der Halle 40 x 30 x 8 m mit 20 Hallenstrahlern:

    Wandabstand S/2:   233 lx,  U0 = 0,51   durchgefallen
    Wandabstand S/3:   233 lx,  U0 = 0,66   bestanden

Dieselben zwanzig Leuchten, dieselbe Leistung, dieselbe Beleuchtungsstaerke. Nur
verschoben. Das Werkzeug stellt darum jetzt S/3 voreingestellt ein - was die
Lichtplanung seit jeher als Faustregel kennt, hier aber aus der Rechnung selbst
herausfaellt, statt als Regel behauptet zu werden.

Das Urteil beruecksichtigt beides. Es gibt jetzt vier Antworten statt zwei, und die
vierte ist die, die vorher gefehlt hat: **hell genug, aber zu ungleichmaessig**.

Die 3D-Ansicht setzt die Leuchten mit demselben Wandabstand wie die Rechnung. Ein
Bild, das etwas anderes zeigt als die Zahlen darunter, ist schlimmer als kein Bild.

Sechs Pruefungen, darunter alle vier Urteilswege.

**`Druckverlustberechnung.html` - die Rauheit war festgenagelt** *(behoben)*
Im Code stand `const eps = 0.045 / 1000;` - neues Handelsstahlrohr, fuer jedes Rohr.
Fuer Kunststoff, fuer gezogenen Edelstahl und fuer eine zwanzig Jahre alte,
verkrustete Leitung derselbe Wert.

Der Unterschied ist nicht klein. DN100, Wasser, 58 m3/h, 100 m, also Re rund 200.000
und damit voll turbulent - dort haengt die Rohrreibungszahl praktisch nur noch an der
Rauheit:

    Kunststoff PE/PVC     eps = 0,007 mm   lambda = 0,0162   0,303 bar
    Stahl neu (fest)      eps = 0,045 mm   lambda = 0,0185   0,347 bar
    leicht korrodiert     eps = 0,5 mm     lambda = 0,0306   0,574 bar
    verkrustet            eps = 2 mm       lambda = 0,0484   0,907 bar

Vom festen Wert bis zur verkrusteten Leitung ist das **das Zweieinhalbfache**. Wer
danach die Pumpe auswaehlt, waehlt sie zu klein - und zu klein ist bei der Pumpe die
Richtung, die im Betrieb weh tut. In die andere Richtung, bei Kunststoff, kauft man
13 Prozent Foerderhoehe zu viel; teuer, aber harmlos.

Werkstoff und Zustand sind jetzt **je Abschnitt** waehlbar, nicht fuer die ganze
Anlage: ein Kunststoffstrang an einer Stahlleitung ist der Normalfall, nicht die
Ausnahme. Die Auswahl setzt die Rauheit ins Feld daneben, und das Feld ist frei
beschreibbar - die Tabellenwerte sind Anhaltswerte, keine Messung an Ihrem Rohr.

**Nebenbei: Colebrook wird jetzt exakt geloest.** Vorher stand dort die Naeherung nach
Swamee-Jain. Die ist nicht falsch - gegen die iterative Loesung gehalten liegt sie im
Arbeitsbereich hoechstens 3 Prozent daneben, und das nur im aeussersten Winkel bei
Re = 5000 und eps/d = 0,02. Aber die Iteration kostet im Browser nichts und laesst die
Frage gar nicht erst aufkommen. Swamee-Jain bleibt als Startwert; damit sind es zwei
bis drei Durchlaeufe. Gegen einen eigenen Loeser gehalten stimmen alle vier Faelle
oben auf vier Stellen.

Der Uebergangsbereich zwischen Re 2300 und 4000 wird weiter mit der turbulenten Formel
gerechnet. Das ist ueblich, aber dort ist die Stroemung von Natur aus unsicher; die
Zeile "Regime" sagt es an, und im Hilfetext steht es jetzt ausdruecklich.

Sechs Pruefungen, vier davon gegen den eigenen Colebrook-Loeser.

**Zwei Werkzeuge, zwei Zeta-Tabellen** *(behoben)*
`Druckverlustberechnung` und `Petrochem_Hydraulic_Analysis` hatten beide eigene
Widerstandsbeiwerte fuer dieselben Formstuecke:

                        Druckverlust    Petrochem
      Bogen 90 Grad        0,21           0,30
      Absperrorgan         0,3            0,20   ("Valves")
      Rueckschlagorgan     1,0 bis 1,5    2,50   ("Check Valve")

Das ist derselbe Fehler wie damals bei der Strombelastbarkeit: zwei Tabellen fuer
dieselbe Groesse. Er ist genauso geloest - es gibt jetzt nur noch
**`formstuecke.js`**, beide Werkzeuge lesen daraus, und eine Pruefung haelt sie
gegeneinander.

**Schlimmer als die Abweichung war, was Petrochem gar nicht unterschieden hat.** Dort
gab es ein Feld "Valves" mit zeta = 0,20 - das ist ein offener Absperrschieber. Ein
**Rueckschlagventil** hat je nach Nennweite 5 bis 13, also bis zum
Fuenfundsechzigfachen. Fuer diesen Unterschied gab es kein Feld; man konnte ihn gar
nicht eingeben. In einem Werkzeug, das daraus die Pumpe auslegt und die
Betriebskosten von Nennweiten vergleicht.

Jetzt stehen dort sechs Bauarten einzeln: Bogen, T-Stueck, Absperrschieber,
Kugelhahn, Rueckschlagklappe, Rueckschlagventil. Was das ausmacht, in derselben
Leitung mit derselben Nennweite:

      mit Rueckschlagklappe:   1,19 kW   3.412 Euro im Jahr
      mit Rueckschlagventil:   1,42 kW   4.063 Euro im Jahr

19 Prozent mehr Strom, jedes Jahr, aus einem einzigen Bauteil - und vorher war es
dasselbe Eingabefeld.

**Dazu: zeta haengt jetzt an der Nennweite.** In Petrochem wurde es einmal vor der
Schleife gebildet und war damit fuer DN25 und DN200 derselbe Wert - in einem
Werkzeug, dessen ganzer Zweck der Vergleich von Nennweiten ist. Mit der gemeinsamen
Tabelle faellt es von 6,86 bei DN25 auf 5,76 bei DN200.

Der Pumpenwirkungsgrad dagegen **war nie fest**. `eta_pump` ist seit dem ersten Stand
ein Eingabefeld; 0,70 ist nur die Voreinstellung. Der Befund im Pruefbericht war an
dieser Stelle falsch, und das steht jetzt auch dort.

Fuenf Pruefungen: die beiden Kostenfaelle, und drei, die beide Werkzeuge gegen
dieselbe Tabelle halten.

**`Regelventil.html` - der Formelkasten log, und die Autoritaet fehlte** *(behoben)*
Drei Befunde aus dem Pruefbericht waren hier schon erledigt: `FL` und `xT` sind
Eingabefelder, und der Oeffnungsgrad mit dem Zielbereich 15 bis 85 Prozent steht auch
da. Zwei Dinge fehlten trotzdem.

**Der Formelkasten beschrieb eine Codeversion, die es nicht mehr gibt.** Dort stand
noch `mit FL = 0.9`, `Y = 1 - dP_ratio/(3*1.4)` und `Wenn dP_ratio > 0.5 setzt der
Code Y = 0.667`. Alle drei waren beim Umbau auf die richtige Gasformel abgeloest
worden - nur der Text nicht. Das ist schlimmer als keine Doku: wer den Formelkasten
aufmacht, tut das gerade, um nachzusehen, was das Werkzeug rechnet, und bekommt etwas
Falsches. Der Kasten steht jetzt auf dem Code.

**Die Ventilbauart setzt jetzt die Richtwerte.** Vorher stand nur ein Hinweis mit zwei
Zahlen darunter. Jetzt sind es sieben Bauarten mit den ueblichen Tabellenwerten, vom
Durchgangsventil mit 0,90/0,72 bis zur 90-Grad-Klappe mit 0,55/0,20. Beide Felder
bleiben frei beschreibbar - das Datenblatt gewinnt.

Warum das kein Schoenheitsfehler ist: bei P1 = 6 auf P2 = 2 bar ist das
Durchgangsventil noch nicht kritisch, die 90-Grad-Klappe schon.

    Durchgangsventil (FL 0,90):   Kv = 12,50
    90-Grad-Klappe   (FL 0,55):   Kv = 18,59

49 Prozent mehr. Wer mit dem Richtwert des Durchgangsventils eine Klappe auslegt,
waehlt sie **zu klein** - sie schafft den Durchfluss nicht.

**Neu: die Ventilautoritaet.**

    a = dP_Ventil / (dP_Ventil + dP_Anlage)   beim Auslegungsdurchfluss

Der Kv sagt, wieviel durchgeht. Die Autoritaet sagt, ob man es regeln kann. Liegt der
groesste Teil des Druckverlusts in der Anlage und nicht im Ventil, verbiegt sich die
Kennlinie so stark, dass der Hub fast nur noch im ersten Viertel wirkt: die Regelung
schwingt oder steht, und ein auf drei Stellen gerechneter Kv nuetzt nichts. Unter 0,3
sagt das Werkzeug das jetzt.

Die Gas- und Dampfwerte in den bestehenden Pruefungen haben sich um bis zu 1,4 Prozent
verschoben, weil die Voreinstellung fuer xT vom krummen 0,70 auf den Tabellenwert 0,72
geht. Einen davon habe ich von Hand nachgerechnet, statt die neue Zahl einfach zu
uebernehmen: x = 0,1667, x_krit = 0,72, Y = 0,9228,
Kv = 500/(514*0,9228)*sqrt(0,93023*293,15/6) = 7,11. Das Werkzeug sagt 7,11.

Fuenf neue Pruefungen.

**`Kabelterasse_Rechner.html` - die Verlegeart stand nirgends** *(behoben)*
Gerechnet wurde `Breite = Summe(Durchmesser) * Reserve`. Das setzt stillschweigend
voraus: alle Kabel einlagig nebeneinander, beruehrend. Diese Annahme stand nicht im
Werkzeug, nicht im Hilfetext und nicht am Ergebnis - der Benutzer bekam eine Breite,
ohne zu wissen, worauf sie beruht.

Und sie ist in **beide** Richtungen falsch. 20 Steuerkabel mit 12 mm, Trassenhoehe
60 mm, Reserve 30 Prozent:

    einlagig beruehrend (bisher):  312 mm  ->  Trasse 400
    einlagig mit Abstand:          624 mm  ->  Trasse > 600
    gebuendelt, 40 % Fuellgrad:    123 mm  ->  Trasse 150

- **Steuerkabel** liegen gebuendelt, mehrlagig. Die bisherige Rechnung gibt dort das
  Zweieinhalbfache: Trasse 400 statt 150. Das ist Geld, Gewicht und im Plan ein
  Trassenweg, der so breit gar nicht gebraucht wird.
- **Energiekabel** muessen mit Abstand liegen, weil die Minderungsfaktoren aus der
  Kabelauslegung genau das voraussetzen. Dort gibt die bisherige Rechnung nur die
  **Haelfte**. Eine zu schmale Trasse zwingt die Kabel zusammen - und der Querschnitt,
  der mit Abstand gerechnet wurde, liegt dann daneben. Das ist die gefaehrliche
  Richtung, und sie haengt mit `Kabeldimensionierung` zusammen: dort waehlt man einen
  Minderungsfaktor, hier baut man die Voraussetzung dafuer.

Die Verlegeart ist jetzt eine Auswahl, bei der gebuendelten zusaetzlich der
zulaessige Fuellgrad. Die gebuendelte Rechnung geht ueber den Querschnitt, nicht ueber
die Durchmesser:

    Breite = Summe(Kabelquerschnitt) / (Fuellgrad * Hoehe) * Reserve

Und das Ergebnis sagt jetzt selbst, worauf es beruht: unter der Breite steht die
Grundlage, und sie steht auch am Trassenvorschlag. Eine Zahl ohne ihre Annahme ist in
einem Angebot nichts wert.

Fuenf Pruefungen, alle gegen von Hand nachgerechnete Breiten.

**Durchsicht aller 27 Werkzeuge auf festgenagelte Annahmen** *(abgeschlossen)*
In diesem Durchgang ist siebenmal dasselbe Muster aufgetaucht: eine Zahl steht fest im
Code, die eine Eingabe sein muesste - der Betriebswirkungsgrad, die Rohrrauheit, die
Zeta-Werte, F_L und x_T, die Verlegeart. Statt weiter zu raten habe ich alle 27
Dateien danach abgesucht.

**Was uebrig blieb, ist in Ordnung.** Die gefundenen Konstanten sind fast alle
Zeichenkonstanten - Rasterweite, Seitenabstand, Kartenhoehe -, und die wenigen
physikalischen sind zu Recht fest:

- `ALPHA_CU = 0,00393` ist der Temperaturbeiwert von Kupfer, eine Stoffkonstante.
- `f_b`, `gamma`, `b_exp` im `Hydrocyclone` gehoeren zur Korrelation nach
  Arterburn/Krebs und sind Teil des Verfahrens.
- `hR = 1100` in `Structure_CAD` ist die genormte Gelaenderhoehe. Sie steht auf dem
  Mindestwert, also auf der sicheren Seite.
- `AL_STROM = 0,75` ist im Code schon ausdruecklich als Richtwert gekennzeichnet.

**Dabei kam ein anderes Muster heraus, das ich nicht gesucht hatte.** In JavaScript ist
`0 || 70` gleich `70`. Wo ein Eingabewert mit `|| Ersatzwert` gelesen wird, wird eine
eingegebene **Null wie eine fehlende Eingabe behandelt** - und stillschweigend durch
etwas anderes ersetzt. Das trifft ueberall dort, wo null ein gueltiger Wert ist:

- `Petrochem`: `cost || 0.25` und `hours || 8000`. Null Euro je kWh bei Eigenerzeugung
  und null Stunden bei einer Reserveleitung sind gueltige Eingaben. Wer sie eintrug,
  bekam 3.412 Euro Stromkosten im Jahr angezeigt statt null - in genau dem Werkzeug,
  das daraus die Nennweiten vergleicht. **Behoben.**
- `Cable_Manager`: `leiterTemp || 70`. Hier **habe ich zuerst eine Loesung gebaut und
  dann nachgesehen, ob es das Problem gibt**: `leiterTemp` ist ein Auswahlfeld mit den
  drei Werten 70, 90 und 20. Null laesst sich gar nicht eingeben, der Fehler ist nicht
  erreichbar. Die Aenderung habe ich zurueckgenommen.
- Die uebrigen Ersatzwerte (`rho || 998`, `flow || 50`, `len || 100`) betreffen
  Groessen, bei denen null nicht sinnvoll ist. Dort bleibt es, wie es ist.

**Und eine Inkonsistenz, die ich selbst eingebaut hatte.** Der Fuellgrad ist seit der
Trassenrechnung ein Eingabefeld - aber der Rohrteil desselben Werkzeugs rechnete weiter
fest mit 40 Prozent. Dasselbe Werkzeug mit zwei Antworten auf dieselbe Frage, eine
Stunde alt. Jetzt liest auch das Rohr das Feld: bei 30 statt 40 Prozent verlangt es
98,0 mm statt 84,9 mm Innendurchmesser.

Vier Pruefungen.

**`Bau_Rechner.html` - Reiter in Firefox**
`switchTab()` benutzt das globale `event` ohne Parameter. In Firefox
`event is not defined`, die Reiter reagieren nicht. Ausserdem loescht
`res_r_total.innerText` die Einheit "kg" nach dem ersten Eintrag.

### Vereinfachungen, die dokumentiert gehoeren

Kein Fehler, aber der Nutzer muss es wissen.

- ~~`Lighting_CAD.html`: der Betriebswirkungsgrad ist **erfunden**~~ *(behoben)* Siehe unten.
- ~~`Druckverlustberechnung.html`: Rauheit fest auf 0,045 mm~~ *(behoben)* Siehe unten.
- ~~`Petrochem_Hydraulic_Analysis.html`: Pumpenwirkungsgrad fest 70 %, Zeta-Werte
  fest.~~ *(teils behoben, teils falscher Befund)* Der Pumpenwirkungsgrad **war nie
  fest**: `eta_pump` ist seit dem ersten Stand ein Eingabefeld mit 0,70 als
  Voreinstellung. Die Zeta-Werte waren fest, und zwar schlimmer als gemeldet -
  siehe unten.
- ~~`Regelventil.html`: `FL = 0,9` fest~~ **Diesen Befund gibt es nicht mehr.** `FL`
  und `xT` sind Eingabefelder. Was wirklich fehlte, steht unten.
- ~~`Kabelterasse_Rechner.html`: Trassenbreite = Summe der Durchmesser mal Reserve~~
  *(behoben)* Siehe unten.
- ~~`Kabeldimensionierung_Spannungsfall.html`: die Kabeltyp-Auswahl aendert an der
  Rechnung **nichts**~~ *(behoben)* Siehe unten.
- ~~`Electrical_Toolbox.html`: der Taschenrechner benutzt `eval()` auf der Eingabe.~~
  *(behoben)* Siehe unten.

### Was ich nachgerechnet habe und was stimmt

Damit klar ist, wo nichts zu tun ist:

- DIN-Profiltabelle HEA/HEB/IPE/UNP und die Bewehrungsformel `d2/162` in `Bau_Rechner`.
- Leiterwiderstaende Cu und Al gegen IEC 60228, alle Werte.
- Spannungsfall-, Motor-, Trafo- und Blindleistungsformeln in `Electrical_Toolbox`
  und `Load`.
- Swamee-Jain, Darcy-Weisbach und der geodaetische Anteil in `Druckverlustberechnung`.
- Die Churchill-Gleichung in `Petrochem_Hydraulic_Analysis`.
- Kv/Cv fuer Fluessigkeiten, die Kavitationsgrenze und die gleichprozentige
  Kennlinie in `Regelventil`.
- Arterburn/Krebs und die reduzierte Trennkurve nach Lynch-Rao in `Hydrocyclone`.
- Raumindex und Wirkungsgradverfahren in `Lighting_CAD`.
- Callendar-Van-Dusen fuer Pt100 ueber null Grad, samt Umkehrformel.
- Rohrfuellgrad 40 % und Fuellgradgeometrie in den beiden Trassenwerkzeugen.

Die beiden Estimatoren sind die am saubersten gebauten Programme im Ordner: jede
Position traegt `status` (OK / UNKNOWN / RFQ_REQUIRED) und einen `source`-Text, die
Unsicherheit wird also mitgefuehrt statt versteckt. Zwei Punkte zum Nachsehen:
die Reserve wird nur auf Material plus Montage gerechnet, nicht auf Planung und
Inbetriebnahme (falls gewollt, gehoert es in den Hilfetext), und eine Summe mit
UNKNOWN-Positionen wird nicht als vorlaeufig gekennzeichnet.

### Luecken zum Vervollstaendigen

- ~~`Schaltschrank_CAD.html` hat **keine Verlustleistungs- und Kuehlrechnung**~~
  *(behoben)*, siehe oben.
- ~~`Load.html`: `updateCp()` ist eine leere Funktion, toter Rest.~~
  **Diesen Befund gibt es nicht.** In `Load.html` steht keine Funktion `updateCp`,
  und sie stand auch nie darin: `git log -S updateCp -- ingenieur-werkzeuge/Load.html`
  findet nichts, und `git show f8d3844:ingenieur-werkzeuge/Load.html | grep -c updateCp`
  gibt am ersten Stand des Verzeichnisses null. Der Befund war falsch.
- ~~`MSR_Loop_Check_Skalierung.html`: `a`, `b`, `c` in `calcRTD` werden angelegt und
  nie benutzt.~~ **Auch diesen Befund gibt es nicht.** Im ersten Stand stand dort
  `const R0 = 100, A = 3.9083e-3, B = -5.775e-7;` - drei Werte, alle drei benutzt.
  Keine Variablen `a`, `b`, `c`.

Zwei von drei "Luecken" waren keine. Das ist kein Vorwurf an den Lesedurchgang,
sondern ein Grund, jeden Befund am Code nachzusehen, bevor man ihn behebt - sonst
baut man eine Loesung fuer ein Problem, das es nicht gibt.

---

## Was bereits bearbeitet ist

**Punkt 1, Strombelastbarkeit** - so weit gebracht, wie es ohne die Norm geht.
An keiner einzigen Zahl wurde etwas geaendert; vier Rechenfaelle wurden vor und nach
der Aenderung im Browser verglichen und liefern Zeichen fuer Zeichen dasselbe.

- Die Auswahl hiess **"Verlegeart"** und bot *"A - Frei in Luft (Faktor 1,0)"*.
  Verlegeart A ist nach VDE 0298-4 die Verlegung **in einer waermegedaemmten Wand**,
  also der unguenstigste Fall - und bekam hier den guenstigsten Faktor. Dazu ist die
  Verlegeart in der Norm gar kein Minderungsfaktor, sondern bestimmt die Grundtabelle;
  Minderungsfaktoren kommen aus Haeufung und Umgebungstemperatur. Die Auswahl heisst
  jetzt **"Haeufung"** und ist mit dem beschriftet, was sie tatsaechlich tut.
- Die Herkunft der Iz-Werte steht jetzt als `IZ_GRUNDLAGE` im Code, mit `geprueft: false`
  und der Abweichung gegen `Cable_Manager.html` im Kommentar daneben.
- Solange `geprueft` false ist, erscheint der Hinweis **ueber der Ergebnistabelle**,
  nicht nur im Quelltext. Wer rechnet, sieht ihn.
- Der Hilfetext sagt jetzt, dass die **Kabeltyp-Auswahl nicht in die Rechnung eingeht**.

Offen bleibt der Kern: die Tabelle selbst. Sobald die geprueften Werte da sind, sind
es zwei Stellen - `cableData` ersetzen und `IZ_GRUNDLAGE.geprueft` auf `true` setzen.

**Hydrocyclone, Gueltigkeitsbereich** - behoben. Und eine Korrektur an mir selbst.

**Der gemeldete Einheiten-Widerspruch bei C2 existiert nicht.** Im ersten Durchgang
hatte ich geschrieben, `recalc()` rechne `3.27*(100*dp)^-0.28` und die
Diagrammroutine `3.27*dp^-0.28`, eine der beiden sei falsch. Beim genauen Lesen des
Diagrammblocks stimmt das nicht: dessen Achse ist ausdruecklich in **kPa**
(`dpMin = 10, dpMax = 200; // kPa`, Beschriftung "ΔP (kPa)"), und der Marker rechnet
die Nutzereingabe vorher um (`dpNow = dpNowBar*100`). Beide Stellen liefern denselben
Wert. Nachgemessen bei fuenf Druecken:

| dp | Rechnung | Diagramm |
|---|---|---|
| 0,2 bar | 1,41338 | 1,41338 |
| 1,0 bar | 0,90063 | 0,90063 |
| 2,0 bar | 0,74175 | 0,74175 |

Der Fehler kam davon, dass ich die Fundstellen einzeln aus einer Suche gelesen habe
statt den Block drumherum. Im PRUEFBERICHT ist er ebenfalls richtiggestellt.

**Der echte Fehler war ein anderer und schlimmer.** `Infinity` erreichte den
Bildschirm gar nicht: die Anzeige lief ueber `safe(x, 0)` und machte daraus eine
**0**. Ausserhalb des Gueltigkeitsbereichs stand also

    DN Cut (d50,DN,app):    0,0 µm
    Theor. Diameter:        0 mm

und das liest sich wie das **bestmoegliche** Ergebnis - ein Zyklon, der alles
abtrennt - statt wie "hier endet das Modell". Ohne jeden Hinweis.

| Fall | vorher | nachher |
|---|---|---|
| Feststoff 60 % (>= 53) | `0,0 µm` / `0 mm` | `--` mit Begruendung |
| Druckabfall 0 bar | `0,0 µm` / `0 mm` | `--` mit Begruendung |
| Gs = Gl | `0,0 µm` / `0 mm` | `--` mit Begruendung |
| gueltige Vorgaben | 57,0 µm / 1061 mm | **unveraendert** |

Der Kasten sagt jetzt auch, **welche** der drei Arterburn-Korrekturen ihren Bereich
verlaesst: C1 gilt nur unter 53 % Feststoff, C2 braucht einen Druckabfall ueber null,
C3 verlangt, dass der Feststoff dichter ist als die Fluessigkeit.

**Petrochem Hydraulic, Vorzeichen und NPSH** - behoben.

**`Math.abs(H_stat)` machte aus Gefaelle zusaetzliche Last.** Am deutlichsten an einer
bergab laufenden Leitung: die kam vorher als die **teuerste** heraus.

| Hoehendifferenz | P_hyd vorher | nachher | Kosten vorher | nachher |
|---|---|---|---|---|
| bergauf +5 m | 1,21 kW | 1,21 kW | 3.448 € | 3.448 € |
| eben 0 m | 0,53 kW | 0,53 kW | 1.502 € | 1.502 € |
| **bergab -15 m** | **2,57 kW** | **0,00 kW** | **7.339 €** | **0 €** |

Bei 15 m Gefaelle und rund 3,9 m Reibungsverlust laeuft die Leitung von allein. Das
Vorzeichen bleibt jetzt erhalten und die Pumpenarbeit wird bei null abgeschnitten.

**NPSHa wurde aus den falschen Groessen gebildet.** Vorher:
`(p_atm - p_vap)/(rho*g) - H_loss_GESAMT + H_stat_GESAMT`. Beides gehoert nicht zur
Saugseite. Jetzt `(p_s - p_v)/(rho*g) + z_s - h_v,Saug`, mit eigenen Eingaben fuer
Saugbehaelterdruck, Zulaufhoehe, Laenge der Saugleitung und deren Einzelwiderstaende.

Dass es jetzt an den richtigen Groessen haengt, sieht man sofort: NPSHa bleibt ueber
alle drei Hoehendifferenzen oben konstant bei 9,93 m, weil die Gesamtanlage damit
nichts zu tun hat. Jede Saugseiten-Eingabe wirkt dagegen, jede in der richtigen
Groessenordnung:

| Aenderung | NPSHa |
|---|---|
| Zulauf +3 m | 12,93 m |
| gleiche Hoehe | 9,93 m |
| Saughub -6 m | 3,93 m |
| Saughub -9,5 m | 0,43 m, **Kavitationswarnung** |
| Saugbehaelter im Vakuum, 0,3 bar a | 2,66 m |
| Saugbehaelter 5 bar a | 50,58 m |
| Saugleitung 60 statt 10 m | 8,54 m |
| Sigma zeta 5,0 statt 0 | 9,20 m |
| heisses Medium, p_v 700 mbar | 2,91 m |

**Die Anlagenkennlinie ging durch den Nullpunkt.** Gezeichnet wurde nur der mit
`(q/q_nom)^2` skalierte Reibungsanteil. Richtig ist `H = H_stat + k*Q^2`; der
statische Anteil ist jetzt drin.

**Der Pumpenwirkungsgrad war fest auf 0,70 verdrahtet** und ist jetzt ein Eingabefeld.

Offen bleiben in dieser Datei die fest verdrahteten Zeta-Werte der Formstuecke
(Bogen 0,3 / T 1,3 / Ventil 0,2 / RSK 2,5) auf der Druckseite.

**Regelventil, Gas und Dampf** - behoben. Vier Fehler in einer Datei.

1. **Der Expansionsfaktor `Y` wurde berechnet und dann nie benutzt.** In der Kv-Zeile
   stand er schlicht nicht.
2. **Der Nenner war doppelt so gross.** Im Code stand `3*1,4`. Nach IEC 60534 gehoert
   dort `3*F_gamma*xT`, fuer Luft also rund `3*0,7 = 2,1`.
3. **Bei kritischer Stroemung wurde weiter mit dem vollen Druckabfall gerechnet.**
   Dadurch wurde Kv im choked-Fall **kleiner** statt groesser - die gefaehrliche
   Richtung, weil das Ventil dann zu klein gewaehlt wird. Jetzt bleibt der wirksame
   Druckabfall bei `x_krit = F_gamma*xT` stehen. Nebenbei war auch die Schwelle
   falsch: geprueft wurde auf `x > 0,5`, richtig ist `x >= F_gamma*xT`.
4. **Beim Dampf war das Feld "Spez. Volumen" ohne Wirkung.** Die Formel nahm `p1`
   anstelle der Dichte. Jetzt `Kv = W/(31,6*Y*sqrt(dp*rho1))` mit `rho1 = 1/v`.

| Fall | vorher | nachher | |
|---|---|---|---|
| Gas 6 -> 5 bar, 500 Nm3/h | 6,56 | 7,12 | Y wirkt jetzt |
| Gas 6 -> 2 bar, 500 Nm3/h | 3,28 | 4,80 | war faelschlich als choked eingestuft |
| Gas 10 -> 1 bar, 1000 Nm3/h | 3,39 | 5,76 | choked, Druckabfall begrenzt |
| Dampf 10 -> 6 bar, 1000 kg/h | 5,00 | 8,52 | spez. Volumen wird benutzt |

Fluessigkeiten bleiben **unveraendert** (20,41 und 14,07), weil der neue FL-Vorgabewert
0,90 genau dem alten fest verdrahteten Wert entspricht.

Statt Zahlen zu erfinden sind die ventilabhaengigen Kennwerte jetzt Eingabefelder:
`FL` (Vorgabe 0,90), `xT` (0,70) und `kappa` (1,40), mit Richtwerten fuer
Durchgangsventil und Klappe daneben. Alle drei wirken nachweislich: eine Klappe
(`xT = 0,35`) ergibt bei 6 auf 2 bar Kv 6,79 statt 4,80 und wird als kritisch erkannt.

Zwei weitere Sachen fielen dabei auf und sind mit behoben:

- Beim Wechsel auf Dampf blieb im Feld "Spez. Volumen" die zuletzt geladene
  **Fluessigkeitsdichte** stehen, also z. B. 998 als m3/kg. Das Feld wird jetzt
  geleert und das Werkzeug verlangt den Wert aus der Dampftafel.
- Ein fehlendes `Chart` riss die ganze Rechnung mit. Das Diagramm wird jetzt nur
  gezeichnet, wenn die Bibliothek da ist - die Zahlen stehen ohnehin schon vorher.

Textfehler nebenbei: die Meldung sagte "Guter Regelbereich (20-80%)", geprueft wurde
auf 15 und 85 Prozent. Jetzt steht dort, was auch geprueft wird.

**Punkt 4, Betriebstemperatur beim Spannungsfall** - behoben, in beiden Werkzeugen.

Der Leiterwiderstand in den Tabellen ist der Wert bei 20 °C nach IEC 60228. Im Betrieb
wird der Leiter warm und der Widerstand steigt:

    R(theta) = R20 * (1 + alpha * (theta - 20))
    alpha: Kupfer 0,00393 1/K, Aluminium 0,00403 1/K

Bei 70 °C sind das Faktor **1,197** fuer Kupfer und **1,202** fuer Aluminium. Beide
Werkzeuge haben jetzt dasselbe Auswahlfeld (70 °C PVC voreingestellt, 90 °C fuer
XLPE/EPR, 20 °C fuer den kalten Tabellenwert) und dieselbe Rechnung dahinter.

**Das aendert Empfehlungen, nicht nur Anzeigen:**

| Werkzeug | Fall | alt (20 °C) | neu (70 °C) |
|---|---|---|---|
| Kabeldimensionierung | 10,6 kW, 200 m, Cu | 10 mm2 | **16 mm2** |
| Cable_Manager | 75 kW, 150 m | 50 mm2 bei 2,95 % | **70 mm2** bei 2,52 % |

Der zweite Fall zeigt es am deutlichsten: 2,95 % lag knapp unter der 3-%-Grenze und
wurde durchgewunken. Bei Betriebstemperatur sind es 3,53 %, also darueber. Das Kabel
war zu klein, und genau das hat der kalte Wert verdeckt. Die Verschraubung waechst
gleich mit, von M40 auf M50.

Als Gegenprobe beide Werkzeuge auf 20 °C gestellt: sie liefern **exakt** die alten
Zahlen (1,97 / 2,95 / 1,99 Prozent). Die Umstellung bringt also nichts ausser dem
Temperaturfaktor mit.

Unter dem Ergebnis steht jetzt, mit welcher Temperatur und welchem Faktor gerechnet
wurde.

**Dieselbe Luege lässt sich messen - und jetzt tut es der Lauf.**

Neunmal in dieser Runde war der Befund derselbe: auf der Verkaufsseite stand etwas,
das es im Werkzeug nicht gab. `beschriften` ohne eine Moeglichkeit zu beschriften,
*"fuehrt die Stueckliste mit"* ohne Liste, *"massstaebliche Zeichnung"* ohne
Massstab, *"Text und Bemassung"* in einem Werkzeug, das beides nicht kennt.

Das ist messbar. Nennt der Katalog ein greifbares Merkmal - DXF, Excel, PDF,
speichern, Import, Massstab, beschriften, Stueckliste, Text, Bemassung, Raster,
Vorlage, Bericht, Simulation, 3D -, dann muss die Datei davon zeugen. Eine Zusage,
die als **Grenze** formuliert ist (*"keine Statik"*, *"ohne Netz"*), zaehlt nicht.

Das ist eine Heuristik und beweist nichts. Aber sie findet genau diese Art von
Luege, und das ist nachgestellt: **im Stand vor der Behebung schlaegt sie bei allen
vier Faellen an.**

| Werkzeug | Zusage | vor der Behebung |
|---|---|---|
| `Loop_Library` | beschriften | kein Beleg |
| `Trasse_CAD` | Stueckliste | kein Beleg |
| `photo_CAD` | Massstab | kein Beleg |
| `Bau_CAD` | Text | kein Beleg |

Heute findet sie in allen 27 Eintraegen nichts mehr.

Dazu eine zweite Pruefung, die leicht zu vergessen waere: **liest die Pruefung
ueberhaupt alle 27 Eintraege?** Beim ersten Lauf las sie 26 - der letzte Eintrag
endet anders als die anderen, und der Ausdruck griff nicht. Eine Messung, die
stillschweigend einen auslaesst, ist schlimmer als keine. Genau daran war die
Lueckenzaehlung schon einmal vorbeigegangen, als sie 27 Werkzeuge zaehlte und die
beiden Seiten davor nicht.

**`photo_CAD.html` (Photo CAD), der Massstab** - der Kern des Werkzeugs fehlte.

Im Katalog steht: *"Aus einem Foto der Anlage eine **massstaebliche** Zeichnung
machen"*, *"einen bekannten Abstand als Massstab angeben"*, und als Grundlage
*"Massstab ueber eine bekannte Referenzstrecke."*

Diese Strecke gab es nicht. Kein Feld, keine Rechnung. Der einzige `scale` im Code
war der Zoom, mit dem das Bild in die Flaeche passt:

    scale = Math.min(cvs.width/bgImg.naturalWidth, cvs.height/bgImg.naturalHeight)*0.85;

Der DXF entstand damit in **Bildpunkten**. Eine Zeichnung in Bildpunkten ist keine
massstaebliche Zeichnung, auch wenn sie sich im CAD oeffnen laesst - und
massstaeblich zu sein ist bei diesem Werkzeug nicht ein Merkmal, sondern der Zweck.

Jetzt gibt es das Werkzeug "Massstab": eine bekannte Strecke in Millimetern
eintragen, zwei Punkte auf dem Foto anklicken, fertig. Daraus wird der Faktor
Millimeter je Welteinheit, er steht auf dem Schirm, und der Export rechnet alle
Koordinaten damit um. Ohne gesetzten Massstab fragt der Export nach und sagt, dass
die Datei dann in Bildpunkten entsteht - der Faktor bleibt eins, die Datei
behauptet nichts.

**Die Z-Felder: entschieden, und zwar gegen die bequemere Antwort.** Hier stand
kurz als offene Frage, ob "Start Hoehe (Z)" und "Extrusion (Dicke)" gleich in
Millimetern eingegeben werden sollten. Die Antwort ist nein.

Die Szene ist **ein** Koordinatensystem. X und Y kommen vom Nachzeichnen auf dem
Foto und werden ueber den Faktor zu Millimetern. Stuende die Dicke in Millimetern
und X und Y in Einheiten, waere die Eingabe ein Gemisch aus zwei Systemen - und
alles, was vor dem Setzen des Massstabs gezeichnet wurde, haette stillschweigend
seine Bedeutung gewechselt. Bequemer zu tippen, aber eine Falle.

Das eigentliche Problem war ein anderes und kleiner: **man sah nicht, was die
eingetragene Zahl bedeutet.** Sie steht jetzt in Millimetern daneben, sobald ein
Massstab gesetzt ist:

    Höhe 0.0 mm · Dicke 400.0 mm

Ohne Massstab steht dort, dass es Einheiten sind. Ein leeres Feld gibt `--`, kein
NaN. Vier Pruefungen halten das fest.

**Ein Fehler in der eigenen Korrektur, vom Test gefunden - und ein lehrreicher.**
Der Umrechnungsfaktor hiess zuerst `f`. So heisst in `exportDXF` aber schon die
Funktion, die eine Flaeche schreibt; sie verdeckt den Faktor in ihrem eigenen
Rumpf. Aus `Zahl * Funktion` wurde `NaN`, und **die ganze Datei bestand aus NaN** -
ohne Fehlermeldung, ohne Absturz, ein DXF voller NaN. Eine Pruefung sucht jetzt
ausdruecklich danach.

Neun Pruefungen halten das fest, darunter die, die zaehlt, dass die Masse mit
Massstab genau zwanzigfach sind.

**`Bau_CAD.html` (Master CAD) - hier stimmte nicht das Werkzeug, sondern der
Katalog.**

Dort stand: *"Rechtecke, Kreise, Linien und Text mit Fang auf Raster und
Endpunkte, Bemassung, Export als DXF"* - also ein 2D-Skizzenblock. Das Werkzeug ist
etwas anderes, und zwar mehr: ein Koerpermodellierer mit **22 Bauteilen**.

| Gruppe | Bauteile |
|---|---|
| Stahl | IPE, HEA, UNP, L-Winkel, T-Profil, Rohr |
| Massiv | Fundament, Wand, Stuetze eckig und rund, Balken, Deckenplatte, Holzbalken, Holzplatte |
| Kurven | gekruemmte Wand, gekruemmter Balken, Rampe, Rohrbogen |
| Koerper | Wuerfel, Kugel, Zylinder, Kegel |

Text gibt es nicht, Bemassung auch nicht, 2D-Rechtecke und -Kreise ebenso wenig.
Der Fang faengt nicht auf ein Raster, sondern auf ein anderes Bauteil (unter 100 mm
Abstand). Die Beschreibung nennt jetzt, was da ist - in allen drei Sprachen und an
allen drei Stellen, an denen sie steht.

Eine falsche Beschreibung ist nicht harmloser als eine falsche Zahl. Wer einen
Skizzenblock kauft und einen Koerpermodellierer bekommt, hat dasselbe Problem wie
jemand, der 240 mm2 gerechnet bekommt, wo 300 noetig sind: er hat sich auf etwas
verlassen, das nicht stimmt.

Sechs Pruefungen zaehlen die 22 Bauteile nach, damit die Beschreibung wahr bleibt.

**`Structure_CAD.html` (Structure Generator), ein Tastendruck hielt den Browser
an.** Die Frage war, ob das Werkzeug irgendwo eine Zahl ausgibt, die nach Statik
aussieht - im Katalog steht als Grenze "Erzeugt Geometrie, keine Bemessung". Das
stimmt: es gibt ausser der Statusmeldung keine einzige Zahl aus. Der Befund liegt
woanders.

**Rastermass null.** `bays = Math.floor(L / Bay)` wird bei `Bay = 0` zu
`Math.floor(Infinity)`, und `for(let i=0; i<=Infinity; i++)` laeuft endlos. Eine
Null im Rasterfeld, und der Browser steht - nachgestellt, die Seite antwortete
nach acht Sekunden noch immer nicht. Ein leeres Laengenfeld ergab `NaN`, damit
`bays = NaN`, damit ein leeres Modell, ohne jede Meldung.

Die Masse werden jetzt geprueft, bevor gebaut wird, und jeder Fall wird benannt:
keine Zahl, kleiner oder gleich null, und ein Raster, das mehr Felder ergaebe als
die Maschine zeichnen soll. Die letzte Grenze steht ausdruecklich als Grenze der
Maschine da, nicht als Regel des Stahlbaus.

**Die Profilauswahl war eine Behauptung.** Auf dem Schirm standen "HEB (Schwer)"
und "IPE (Leicht)", im Code:

    let cW = 200; let cD = 200;
    if(prof === 'IPE') { cW = 120; cD = 240; }

Welches Profil gezeichnet wurde, stand nirgends - und ein HEB gibt es von 100 bis
1000. Die Auswahl nennt jetzt die Groesse (HEB 200, IPE 240), und die beiden Masse
sind Eingabefelder mit diesen Werten als Vorgabe. Wer die Profiltabelle hat, traegt
HEB 300 ein.

*Die Tabelle selbst kommt nicht von mir.* `Bau_Rechner` hat die DIN-Gewichte je
Meter, aber keine Hoehen und Breiten; die haette ich aus dem Gedaechtnis
hinschreiben muessen. Das ist dieselbe Grenze wie bei den Iz-Werten, und sie gilt
hier genauso.

**Ein Fehler in der eigenen Korrektur, vom Test gefunden.** Die beiden neuen
Konstanten standen unterhalb des Aufrufs von `init()`. Beim Laden lief
`updateModel()` damit in die temporale Totzone, `mainGroup` entstand nie, und der
DXF-Export warf. Sie stehen jetzt oben bei den anderen. Der Test hat es beim ersten
Lauf gemeldet.

Sechs Pruefungen halten das fest. Sie laufen mit einer eigenen Zeitgrenze: kaeme
die Endlosschleife zurueck, wuerde ohne sie der ganze Lauf stehenbleiben, statt rot
zu werden.

**`Trasse_CAD.html` (Trasse CAD Pro), die Stueckliste** - im Katalog zweimal
versprochen, im Werkzeug nicht vorhanden.

In der Kurzbeschreibung steht *"Kabeltrassen raeumlich fuehren, mit
**Stueckliste**"*, im langen Text *"Das Werkzeug **fuehrt die Stueckliste mit** und
gibt die Trasse als 3D-DXF aus."* Es fuehrte keine. Es gab weder eine Liste noch
eine Zaehlung - wer wissen wollte, wieviele Boegen 400 x 60 er gesetzt hat, musste
sie im Bild abzaehlen.

Die Liste steht jetzt in der Seitenleiste und zaehlt, was wirklich in der Szene
steht: `objects` ist dieselbe Liste, aus der auch der DXF entsteht. Damit koennen
Zeichnung und Stueckliste nicht auseinanderlaufen - genau die Trennung, die im
Erdungswerkzeug der Fehler war. Gleiche Teile stehen in einer Zeile mit ihrer
Anzahl, verschiedene Masse bleiben getrennte Zeilen, und unter der Liste steht die
Summe der geraden Laengen in Metern. Ein Knopf gibt sie als CSV aus, mit Semikolon
und BOM, damit Excel sie im deutschen Gebietsschema richtig oeffnet.

**Damit sie uebersetzbar ist, stehen Wort und Zahl getrennt.** `Länge 1000 mm`
waere als Ganzes nie ein Woerterbuchschluessel gewesen, weil die Zahl darin steht.
Der Bauteilname, `Länge`, `Radius` und `Abzweig` sind eigene Elemente; die Masse
selbst bleiben unangetastet, wie ueberall.

Sechs Pruefungen halten das fest, darunter die, an der das Erdungswerkzeug
gescheitert waere: was geloescht wird, muss auch aus der Liste verschwinden.

**Die beiden Trassenwerkzeuge - gemessen, und nichts gefunden.**

Nach dem Befund im SLD-Generator lag die Vermutung nahe, dass es dieselbe Sache
noch einmal gibt: drei Werkzeuge zur Kabeltrasse, dieselbe Groesse, drei Formeln.
Also erst gemessen, dann geredet. Das Ergebnis: **sie stimmen ueberein.**

Sie rechnen ueberhaupt nicht dasselbe. `Kabelterasse_Rechner` sagt, wie breit die
Trasse sein muss; `Visueller_Kabeltrassen_CAD` legt die Kabel in eine gewaehlte
Breite und zeigt, was daraus wird; `Trasse_CAD` fuehrt die Trasse durch den Raum
und rechnet gar keine Belegung - das steht auch so als seine Grenze im Katalog.

Nachgemessen mit 20 Kabeln 12 mm, Trassenhoehe 60 mm:

| | Rechner | von Hand |
|---|---|---|
| einlagig beruehrend | 240 mm | 20 x 12 = 240 mm |
| einlagig mit Abstand | 480 mm | 2 x 240 = 480 mm |
| gebuendelt, 40 % Fuellgrad | 94 mm | 2262 / (0,4 x 60) = 94,2 mm |
| daraus Normbreite 100 mm, Fuellgrad im visuellen CAD | 37,7 % | 2262 / 6000 = 37,7 % |

Die vorgeschlagene Breite haelt also genau den Fuellgrad ein, fuer den gerechnet
wurde. Das war bisher von nichts gesichert - jetzt halten sechs Pruefungen die
beiden Werkzeuge gegeneinander, damit es so bleibt.

**Eine Kleinigkeit war doch da.** Die Farbgrenze im visuellen CAD stand fest im
Code: rot ueber 40 Prozent, gelb ueber 30. Der Rechner hat den zulaessigen
Fuellgrad dagegen als Auswahlfeld - 30, 40 oder 50 Prozent. Wer dort vorsichtig
auf 30 stellt, bekam hier 39 Prozent noch in Gelb. Dieselbe Auswahl steht jetzt
auch im visuellen CAD, und die Farbe richtet sich danach.

**`SLD_CAD.html` (SLD Generator), die drei Zahlen am Abgang** - das Werkzeug
schreibt Leistung, Strom und Querschnitt auf eine Zeichnung, die zum Kunden geht.
Alle drei waren angreifbar.

**1. cos phi stand fest im Code.** `(f.power * 1000) / (Math.sqrt(3) * f.volt * 0.85)`
- an jedem Abgang, auch an der Einspeisung. Ein Trafo ist aber in **kVA** angegeben,
da gehoert gar kein cos phi hinein. Die Voreinstellung "Einspeisung T1, 1000" ergab
1697 A, richtig sind 1443 A.

**2. Der Wirkungsgrad fehlte.** Derselbe Motor bekam hier einen anderen Strom als in
`Load` und `Cable_Manager`, die beide `P_elec = P_mech / eta` rechnen:

| 45 kW, 400 V, cos phi 0,85, eta 92 % | Strom |
|---|---|
| `Load`, `Cable_Manager`, `Electrical_Toolbox` | 83,1 A |
| `SLD_CAD` vorher | 76,4 A |
| `SLD_CAD` jetzt | 83,1 A |

Acht Prozent, am selben Motor, in derselben Sammlung. Die Pruefung, die bisher
`Load` gegen `Cable_Manager` hielt, haelt jetzt alle drei gegeneinander.

cos phi und Wirkungsgrad sind Eingabefelder am Abgang, mit Richtwerten. Welche
Formel gilt, entscheidet der Typ - und zwar nach derselben Regel wie in
`Cable_Manager`: beim Motor ist die angegebene Leistung die Wellenleistung, beim
Abgang ist sie schon die elektrische, bei der Einspeisung ist sie die
Scheinleistung. Das Feld heisst jetzt auch so.

**3. Der Querschnitt kam aus einer Leiter im Code:**

    if(amps > 20) cable = "4x4"; if(amps > 40) cable = "4x10"; ...

Ohne Quelle, ohne Bedingungen, auf einer Zeichnung, die zum Kunden geht - waehrend
zwei andere Werkzeuge dafuer `strombelastbarkeit.js` benutzen, deren Stand
dokumentiert ist. Jetzt nimmt auch dieses Werkzeug diese Tabelle, und der Hinweis,
dass ihre Iz-Werte nicht gegen DIN VDE 0298-4 geprueft sind, steht auf der
Zeichnung. Traegt kein Querschnitt den Strom, steht `--` da und nicht der groesste.

**Nebenbei:** ein leeres Leistungsfeld ergab `NaN kW` auf der Zeichnung; jetzt `--`.
Und ein Name mit Anfuehrungszeichen wurde im Eigenschaftsfeld abgeschnitten -
dieselbe Vorlagen-Stelle wie in `Cause_Effect`.

Neun Pruefungen halten das fest, davon drei im Drei-Werkzeuge-Vergleich.

**`Loop_Library.html` (IEC Loop Designer), beschriften** - die Verkaufsseite
verspricht es, das Werkzeug konnte es nicht.

Im Katalog steht zu diesem Werkzeug woertlich: *"Symbole setzen, Klemmen verbinden,
**beschriften**, als DXF ausgeben."* Beschriften ging nicht. Jeder Messumformer trug
fest `1001`, jedes Stellventil `FCV`, Motor und Magnetventil gar keine Bezeichnung -
und es gab keinen Weg, das zu aendern. Ein Loop-Blatt, auf dem alle Geraete gleich
heissen, ist kein Loop-Blatt, und der DXF geht so in die Dokumentation.

Ein Doppelklick auf ein Symbol legt jetzt ein Eingabefeld ueber seine Bezeichnung.
Enter uebernimmt, Escape laesst die alte stehen. Motor und Magnetventil haben eine
Bezeichnung bekommen, in derselben Form wie die Messumformer. Die Symbolbuchstaben
selbst - das `M` im Motorkreis, das `S` in der Spule - bleiben, wie sie nach IEC
heissen; editierbar ist nur, was eine Geraetebezeichnung ist.

**Zweiter Befund: Escape hat das Verdrahten nicht abgebrochen.** Der gestrichelte
Faden blieb am Mauszeiger haengen und `wiringStart` blieb gesetzt - der naechste
Klick auf einen Anschluss zog eine Leitung von einem Punkt, den niemand mehr sah.
`clearCanvas()` loeschte den Faden, liess aber denselben Rest zurueck. Ein
Moduswechsel bricht jetzt sauber ab.

**Ein Fehler in der eigenen Korrektur, vom Test gefunden.** Escape uebernahm den
verworfenen Text trotzdem: `inp.remove()` loest selbst ein `blur` aus, und der
blur-Horcher uebernimmt. Eine Sperre sorgt dafuer, dass nur der erste Weg zaehlt.
Der Test stand vor der Behebung und hat es gemeldet.

Sechs Pruefungen halten beides fest, darunter eine, die den geaenderten Tag im
erzeugten DXF sucht - nicht nur auf dem Schirm.

**`Cause_Effect.html`, Wirkungs-Spalten und Sonderzeichen** - zwei Befunde, beide
im Browser nachgestellt, bevor sie behoben wurden.

**1. `editItem` gab es nicht.** Ein Doppelklick auf eine Wirkungs-Ueberschrift rief
`editItem('effect', index)` auf - eine Funktion, die nirgends definiert war. In der
Konsole stand `editItem is not defined`, auf dem Schirm stand nichts. Eine Wirkung
war damit weder zu aendern noch zu entfernen; einen Loeschknopf fuer Spalten gab es
auch nicht. Wer eine Spalte falsch angelegt hatte, musste die ganze Matrix leeren.

Jetzt oeffnet der Doppelklick das vorhandene Formular im Bearbeiten-Modus, mit Tag
und Beschreibung vorbelegt und ohne den Vorlagenteil, der beim Aendern nichts zu
suchen hat. Ueber jeder Spalte steht ein Loeschknopf; er nimmt auch die
Verknuepfungen dieser Spalte mit.

**2. Ein Anfuehrungszeichen im Tag hat den Tag halbiert.** Die Zeilen wurden als Text
zusammengeklebt:

    <input class="editable" value="${cause.tag}" onchange="...">

Ein Tag wie `PSH-"A"` bricht das Attribut auf. Gemessen:

| | vorher | nachher |
|---|---|---|
| `PSH-"A"` auf dem Schirm | `PSH-` | `PSH-"A"` |
| in `matrixData` und im Excel-Export | `PSH-"A"` | `PSH-"A"` |

Bildschirm und Datei sagten Verschiedenes, ohne Warnung - und wer danach das Feld
anfasste, schrieb den halbierten Tag zurueck. Aus einer importierten Messstellenliste
ist das erreichbar. Zeile und Spaltenkopf werden jetzt mit `createElement` gebaut und
der Text ueber `value` und `textContent` gesetzt, wo kein Zeichen etwas aufbrechen
kann.

Sechs Pruefungen halten beides fest.

**`Bau_Rechner.html`, Bewehrungsliste** - die Liste war nur beschreibbar.

`totalRebarWeight` zaehlte hoch, Zeilen wurden vorn eingehaengt, und es gab keinen
Weg zurueck. Wer sich bei der Stueckzahl vertippt hatte - 500 statt 50 -, musste die
Seite neu laden und die ganze Liste noch einmal eingeben. Die Spalte ganz rechts in
der Tabelle hatte eine leere Ueberschrift und trug in jeder Zeile ein gruenes
Haekchen: sie sah nach Bedienung aus und war keine.

Jetzt kommen Tabelle und Summe beide aus derselben Liste. Sie koennen deshalb nicht
auseinanderlaufen: was in der Tabelle steht, ist in der Summe, und was geloescht
wird, ist aus beidem weg. In jeder Zeile steht ein **Loeschen**, unter der Tabelle
ein **Liste leeren**, das aus ist, solange nichts drinsteht.

Die Formel bleibt. `d2/162` ist die Bauformel fuer die Masse je Meter eines
Rundstabs, und sie ist keine Faustzahl, sondern gerundet exakt:

    rho * A = 7850 kg/m3 * pi/4 * (d/1000)^2 = d^2 / 162,16

Das steht jetzt als Herleitung im Code, statt nur "Standard estimation formula".

Sechs Pruefungen halten die Liste fest: eine Zeile, zwei Zeilen, eine wieder
herausgenommen, geleert - jedes Mal wird die Summe gegen die Tabelle gehalten.

**Beim Lesen nicht bestaetigt:** ich hatte zwei weitere Stellen im Verdacht und beide
waren keine. Die Betondichte wird ohne Null-Pruefung gelesen (`density` koennte null
sein und das Gewicht 0 kg ergeben) - aber `c_density` ist ein Auswahlfeld mit drei
festen Werten, leer kann es nicht sein. Und `calcRebar` prueft den Durchmesser nicht
auf groesser null - aber `r_diam` ist ebenfalls ein Auswahlfeld. Beide Male haette
die Korrektur ein Problem geloest, das es nicht gibt.

**Punkt 3, Erdungsrechnung in `Earthing_CADE.html`** - behoben.

Drei Fehler, alle in dieselbe Richtung:

1. **Radius statt Durchmesser.** Dwight verlangt `ln(4L/a) - 1` mit a = Stab**radius**.
   Im Code stand fest `0.02` - das ist der uebliche Stab**durchmesser**, also der
   doppelte Wert. Der Stabdurchmesser ist jetzt ein Eingabefeld (Vorgabe 20 mm) und
   wird korrekt halbiert.
2. **Stabkopplung fehlte.** `R_staebe = R_ein_stab / Anzahl` behandelt n Staebe wie n
   unabhaengige Erder. Jetzt `/ (Anzahl * eta)` mit eta als Eingabefeld,
   Vorgabe 0,75, typisch 0,6 bis 0,85.
3. **Bandlaenge stimmte nicht mit der Zeichnung ueberein.** Gerechnet wurde mit
   `nX * W + nZ * L`, gezeichnet werden aber `(nX-1)` und `(nZ-1)` innere Leiter.
   Bei 40 x 25 m und 10 m Raster: gezeichnet 245 m, gerechnet 310 m. Die Differenz
   ist genau L+W. Jetzt rechnet das Werkzeug mit dem, was es zeigt.

Alte gegen neue Rechnung, direkt gegenuebergestellt:

| Fall | Bandlaenge alt | neu | R alt | R neu |
|---|---|---|---|---|
| 40x25, Raster 10, Ecken | 310 m | 245 m | 1,389 Ohm | 1,549 Ohm |
| 40x25, Raster 10, umlaufend | 310 m | 245 m | 0,967 Ohm | 1,170 Ohm |
| 40x25, Raster 10, ohne Staebe | 310 m | 245 m | 1,724 Ohm | 1,809 Ohm |
| 60x40, Raster 5, rho 500 | 1160 m | 1060 m | 2,928 Ohm | 3,412 Ohm |

Zwischen 5 und 21 Prozent hoeher, also konservativer.

**Dabei noch etwas gefunden:** die Rechnung lief ueberhaupt nicht ohne three.js.
`updateCalc()` griff als Erstes auf `earthGroup` zu; kam das CDN nicht durch, stand
im Feld nur "--- Ohm", ohne Hinweis. Die Rechnung ist jetzt eine eigene Funktion
`erdungswiderstand()` ohne jeden Bezug zu three.js, und die Zahl erscheint, bevor
gezeichnet wird. Im Test ohne Netz (three.js nicht geladen) liefert das Werkzeug
jetzt korrekte Werte.

Neu ist ausserdem eine Zeile unter dem Ergebnis mit Bandlaenge, Ersatzradius und den
Einzelwiderstaenden von Netz und Staeben, und ein Kasten, der sagt, was **nicht**
enthalten ist: die Kopplung zwischen Netz und Staeben (der wahre Wert liegt dadurch
hoeher), geschichteter Boden, Jahreszeit - und dass die Verlegetiefe nur in die
Zeichnung eingeht, nicht in die Rechnung.

**Nachtrag: Bild und Zahl passen jetzt zusammen.** Hier stand als offener Punkt, dass
bei "umlaufend" nur zwei Staebe gezeichnet werden, gerechnet aber mit
`ceil(Umfang/10)`. Bei 40 x 25 m sind das **dreizehn** Staebe gegen zwei im Bild. Das
ist kein Schoenheitsfehler: das Werkzeug gibt einen 3D-DXF aus, nach dem gebaut wird.
Wer zwei Staebe setzt und den versprochenen Widerstand erwartet, misst hinterher einen
anderen und sucht den Fehler im Boden.

Gezeichnet und exportiert werden jetzt genau die Staebe, mit denen gerechnet wurde,
gleichmaessig ueber den Umfang verteilt.

**Dabei noch etwas gefunden:** die Schleife fuer die Anschlussfahnen rechnete `x` und
`z` aus und benutzte sie nicht. Gezeichnet wurden immer drei Fahnen an drei Ecken -
ob im Feld sechs standen oder zwanzig. Das Eingabefeld nahm jede Zahl an und hatte
keine Wirkung. Auch hier liegen die Fahnen jetzt gleichmaessig auf dem Umfang, so
viele wie eingegeben.

Fuenf Pruefungen halten das fest: sie zaehlen die Linien, die in den DXF gehen, gegen
die Anzahl, mit der gerechnet wurde, und pruefen, dass jeder Punkt auf dem Umfang
liegt. Mit der alten Zeichenroutine schlagen sie fehl - nachgestellt, bevor sie
geschrieben wurden.

**Punkt 2, Trafo-Reihe in `Load.html`** - behoben. Eine Ziffer: `160` zu `1600`.

Zuerst im Browser nachgestellt, dann behoben, dann wieder gemessen:

| P_inst | Bedarf | vorher | nachher | richtig |
|---|---|---|---|---|
| 1150 kW | 1303,9 kVA | 2000 kVA | 1600 kVA | 1600 kVA |
| 1250 kW | 1417,2 kVA | 2000 kVA | 1600 kVA | 1600 kVA |
| 1400 kW | 1587,3 kVA | 2000 kVA | 1600 kVA | 1600 kVA |

Anschliessend die ganze Reihe durchgefahren, 139 Faelle von 40 bis 2800 kW in
20-kW-Schritten, jeder gegen die Normreihe geprueft: keine Abweichung mehr.

Ueber der Zeile steht jetzt, dass die Reihe aufsteigend sortiert bleiben muss, weil
`calcTrafo` beim ersten passenden Wert abbricht. Genau diese Bedingung hatte der
Tippfehler verletzt.

In `Load.html` bleibt aus dem Lesedurchgang nichts offen: die Motorsicherung ist
behoben, und die angebliche leere Funktion `updateCp()` gibt es nicht - siehe oben.
Dazugekommen sind die Kurzschlussdaten, siehe unten.

---

## Naechste Schritte, in dieser Reihenfolge

1. **Belastbarkeitstabelle in `Kabeldimensionierung` klaeren.** Betrifft die
   Sicherheit und alles andere haengt daran.
2. ~~**`Load.html` 160 auf 1600.**~~ Erledigt.
3. ~~**Erdungsrechnung geradeziehen**~~ Erledigt.
4. ~~**Spannungsfall auf Betriebstemperatur umstellen**~~ Erledigt, in beiden gleich.
5. **Gas und Dampf im Regelventil neu aufsetzen** nach IEC 60534.
6. **Dashboard bauen** und die toten Home-Links darauf zeigen lassen.
7. **Speichern nachruesten**, zuerst dort, wo viel eingetippt wird.
8. **DXF-Export auf Millimeter stellen.**
