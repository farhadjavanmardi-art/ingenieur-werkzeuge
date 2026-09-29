# Pruefbericht vor dem Verkauf

Zweiter, tieferer Durchgang durch alle 27 Werkzeuge, mit dem Massstab "wird an
Ingenieurbueros verkauft" statt "laeuft bei mir auf dem Netzlaufwerk".

Alles hier ist nachgestellt, nicht vermutet: die Werkzeuge wurden in Chromium
geladen, mit echten Eingaben gefuettert und die Ausgaben ausgelesen. Wo ich etwas
nicht pruefen konnte, steht es dabei.

Vier Befunde aus dem ersten Durchgang sind bereits behoben (PR #77 bis #80). Die
stehen hier nicht noch einmal.

Was in diesem Bericht als behoben markiert ist, wird seit PR #86 von einer
ausfuehrbaren Pruefung festgehalten: `tests/run.cjs`, 87 Faelle in einem echten
Browser mit abgeschaltetem Netz. Die Sollwerte darin sind die hier genannten
Zahlen. Wer eine Formel aendert, bekommt es gesagt.

---

## 1. Was einen Verkauf sofort blockiert

### 1.1 Ohne Internet war die Haelfte der Werkzeuge tot *(behoben)*

23 von 27 Werkzeugen holten ihre Bibliotheken zur Laufzeit von cdnjs, jsdelivr
oder unpkg: 21 ueber `<script src=...>`, zwei (`Bau_CAD`, `Structure_CAD`) ueber
eine `importmap`. Fiel das aus, starben sie **still und vollstaendig**: kein
Fehlertext, die Seite sah normal aus, die Knoepfe taten nichts. Ein
fehlgeschlagener `import` bricht das ganze Modul ab, die `window.x = ...`-
Zuweisungen am Ende laufen nie.

Im Test ohne Netz waren betroffen:

| Datei | tote Knoepfe |
|---|---|
| `photo_CAD.html` | 14 |
| `Trasse_CAD.html` | 6 |
| `Structure_CAD.html` | 3 |
| `Bau_CAD.html` | 2 |
| `Earthing_CADE.html` | 1 (Rechnung laeuft seit PR #79 weiter) |
| `Brandschutz_Master...` | (siehe unten, war auch **mit** Netz kaputt) |

**Erledigt.** Die Bibliotheken liegen jetzt unter `bibliotheken/` im Projekt,
6,5 MB, aus npm geholt und auf das beschraenkt, was wirklich gebraucht wird:
von den Three.js-Zusatzmodulen drei Dateien statt des ganzen Ordners, von
MathJax ein Bundle und die Schriften statt aller Ausgabeformate. Kein Werkzeug
verweist mehr nach draussen - auch die Schriftart nicht.

| Bibliothek | Fassung | wofuer |
|---|---|---|
| three.js | 0.128.0 | Erdung, Licht, Trasse, Fotogrammetrie, Brandschutz |
| three.js | 0.150.1 | Bau_CAD, Structure_CAD (als ES-Modul) |
| Font Awesome | 6.4.0 | Sinnbilder in 26 Werkzeugen |
| SheetJS (xlsx) | 0.18.5 | Excel-Ausgabe |
| Chart.js | 4.4.1 | Diagramme |
| jsPDF + AutoTable | 2.5.1 / 3.5.28 | PDF-Ausgabe |
| Paper.js | 0.12.17 | Trassenzeichnung |
| html2canvas | 1.4.1 | Bildschirmabzug |
| imagetracerjs | 1.2.6 | Bild zu Vektor |
| MathJax | 3.2.2 | Formelsatz |
| Inter | 5.0.16 | Schriftart in Schaltschrank_CAD |

Zwei Verweise hatten **keine feste Version**: `chart.js` und `mathjax@3`. Beim
naechsten Major-Sprung waeren die Seiten still gebrochen. Jetzt sind alle
Fassungen festgeschrieben.

**Ein Verweis war schon vorher kaputt, mit Netz wie ohne.**
`Brandschutz_Master` lud `three@0.160.0/examples/js/controls/OrbitControls.js`.
Den Ordner `examples/js` gibt es ab r148 nicht mehr, der Verweis lief also immer
ins Leere. Zu praezisieren ist die frueher hier notierte Vermutung: `three.min.js`
wurde **nicht** entfernt, das gibt es in r160 durchaus - nur `examples/js` fehlt.
Das Werkzeug laeuft jetzt auf derselben Fassung 0.128 wie die anderen vier und
ist damit zum ersten Mal ueberhaupt bedienbar.

**Die Pruefung testet jetzt ueber einen ortlichen Web-Server statt ueber
`file://`.** Das war noetig und ist ausserdem richtiger: ES-Module verweigert
der Browser unter `file://` grundsaetzlich, weshalb `Bau_CAD` und
`Structure_CAD` dort kaputt aussahen, obwohl sie es nicht waren. Verkauft wird
ohnehin ein Web-Server. Nach draussen geht in der Pruefung weiterhin nichts.

Die Liste `OHNE_NETZ_TOT` in `tests/run.cjs` ist damit leer. Sie bleibt stehen:
wer wieder etwas von einem fremden Server holt, muss es dort eintragen - und
merkt dabei, was er tut.

### 1.2 Die Werkzeuge zeigen `NaN` statt einer Fehlermeldung *(behoben)*

Systematisch getestet: jedes Zahlenfeld leer, dann auf 0, dann auf -5, und
nachgesehen, was im Ergebnis steht.

**10 Rechenwege geben `NaN` an den Nutzer aus:**

| Datei | Funktion | Eingabe | Ausgabe |
|---|---|---|---|
| `Bau_Rechner` | Beton | leer | `NaN m³`, `NaN kg` |
| `Bau_Rechner` | Stahl | leer | `NaN kg` |
| `Bau_Rechner` | Bewehrung | leer | `NaN` |
| `Electrical_Toolbox` | Motor | leer, **0** | `NaN A`, `NaN kVA` |
| `Electrical_Toolbox` | Blindleistung | leer, **negativ** | `NaN kVAR` |
| `Electrical_Toolbox` | Spannungsfall | leer | `NaN V (NaN%)` |
| `Load` | Trafo | leer, **0** | `NaN kVA` |
| `Load` | Motor | leer, **0** | `NaN A`, `NaN kVA`, `NaN A` |
| `Load` | Heizung | leer | `NaN kW`, `NaN kWh`, `NaN A` |
| `MSR_Loop_Check` | Umrechnung | leer | `NaN PSI` |

Besonders unschoen ist die Blindleistung: ein cos phi ausserhalb 0 bis 1 laeuft in
`Math.acos()` und ergibt `NaN`, statt zu sagen, dass der Wert nicht sein kann.

Das ist reine Eingabepruefung, ohne fremde Daten zu beheben. Fuer ein verkauftes
Werkzeug ist `NaN` im Ergebnisfeld das Erste, was ein Pruefer sieht.

**Behoben.** Beim Nachfassen kamen zwei weitere Faelle dazu, die der erste Test
verdeckt hatte:

- `Lighting_CAD` schrieb bei leeren Feldern ueberall `NaN`. Der Test hatte nur die
  Ausnahme aus der 3D-Darstellung gesehen und gar nicht mehr in die Ergebnisfelder
  geschaut.
- `Regelventil` ebenso. Dort gab es zwar eine Pruefung `p2 >= p1`, aber bei leeren
  Feldern ist `NaN >= NaN` falsch - die Pruefung lief also ins Leere.

Es waren also **zwoelf** Rechenwege, nicht zehn. Alle zwoelf geben jetzt eine
Meldung aus. Derselbe Test danach: **0 von 42 Kombinationen auffaellig.**
Gegenprobe mit gueltigen Eingaben: 11 von 11 Rechenwegen liefern Zeichen fuer
Zeichen dasselbe wie vorher.

### 1.3 Die Strombelastbarkeit: Widerspruch weg, Norm weiterhin offen

Zwei Werkzeuge fuehrten getrennte Tabellen fuer dieselbe Groesse und wichen
14 bis 26 Prozent voneinander ab: bei 16 mm2 sagte das eine 100 A, das andere
85 A. Wer beide benutzte, bekam zwei Antworten und keinen Hinweis darauf,
welche gilt. **Das war der schlimmere Teil** - ein Werkzeug, das sich selbst
widerspricht, ist schlimmer als eines, das eine unsichere Zahl offen ausweist.

**Der Widerspruch ist weg.** Beide laden jetzt `strombelastbarkeit.js`, und wo
die alten Tabellen sich widersprachen, steht dort der kleinere Wert. Das ist
die sichere Richtung: eine zu klein angenommene Belastbarkeit fuehrt zu einem
groesseren Leiter, nie zu einem zu kleinen. Bei 16 mm2 gilt also 85 A.

Die Pruefung haelt das fest - legt jemand wieder eine eigene Tabelle an, faellt
sie um. Dazu ein Fall, bei dem die Belastbarkeit bindet und nicht der
Spannungsfall (43,6 kW auf 10 m), damit die niedrigeren Werte nicht
unbemerkt wieder steigen koennen.

**Was weiterhin offen ist:** die Werte sind nicht gegen den Text der
DIN VDE 0298-4 geprueft. Wir haben die Norm nicht. Sie tragen deshalb
ausdruecklich nicht deren Namen - eine Zahl mit einem Normnamen darauf, den
niemand nachgesehen hat, ist schlimmer als eine Zahl ohne. Auch der Versuch,
die Tabelle aus oeffentlichen Quellen zu belegen, ist gescheitert: die
Herstellerseiten, die sie fuehren, waren aus dieser Umgebung nicht abrufbar,
und was eine Suchmaschine zusammenfasst, ist kein Beleg.

Drei Werte (185, 240, 300 mm2) kannte nur eine der beiden alten Tabellen. Sie
stehen unveraendert drin und sind mit `quelle: "einzeln"` markiert - sie haben
keine zweite Meinung hinter sich.

**Was ein Kaeufer damit tun kann:** Die Tabelle ist eine einzelne, lesbare
Datei. Ein Ingenieurbuero hat die Norm ohnehin; es traegt seine Werte ein,
setzt `GRUNDLAGE.geprueft` auf `true` und der Warnhinweis verschwindet von
selbst. Das ist so gebaut: der Hinweis soll nur so lange stehen, wie er stimmt.

---

## 2. Eingaben, die nichts tun *(behoben)*

Der Nutzer stellt etwas ein, und die Zahl aendert sich nicht. Fuer ein Produkt ist
das die schaedlichste Sorte Fehler, weil sie das Vertrauen in **alle** anderen
Zahlen zerstoert, sobald sie einmal auffaellt.

| Datei | Feld | Was der Nutzer erwartet |
|---|---|---|
| `Bau_Rechner.html` | Bauteil-Typ | Bodenplatte / Wand / Stuetze / Streifenfundament stehen zur Auswahl - der Wert wird **nie ausgelesen**, alles rechnet stur L*B*H |
| `Instrument_Selector.html` | Flow Min | **nie ausgelesen**. Gerade der Mindestdurchfluss entscheidet ueber die Messspanne und damit ueber das Messprinzip |
| `Kabelterasse_Rechner.html` | Rohrtyp | loest `calculate()` aus, der **Wert wird nie gelesen**: es rechnet neu und identisch |
| `Kabeldimensionierung` | Kabeltyp NYM/NYY/NHXH | seit PR #77 dokumentiert, weiterhin ohne Wirkung |
| `Earthing_CADE` | Verlegetiefe | seit PR #79 dokumentiert, geht nur in die Zeichnung |

Drei weitere Verdachtsfaelle habe ich geprueft und **entkraeftet**: `importFile`,
`excelInput` und `signalSlider` geben `this` bzw. `this.value` weiter und wirken.

**Behoben, jedes auf die Art, die ohne erfundene Daten auskommt:**

- `Bau_Rechner`: der Bauteil-Typ benennt jetzt die drei Massfelder um. Bei einer
  Stuetze steht "Querschnitt a / Querschnitt b / Hoehe" statt "Laenge / Breite /
  Hoehe". Die Rechnung bleibt dieselbe, weil alle vier Typen Prismen sind - der
  Nutzer weiss jetzt aber, was er wo eintraegt.
- `Instrument_Selector`: `q_min` wird ausgelesen und die Messspanne Qmax/Qmin
  angezeigt, mit Warnung ab 100:1. Die **Rangfolge** der Messprinzipien nutzt sie
  noch nicht; dafuer fehlen belastbare Spannenangaben je Prinzip. Das steht auch so
  im Code.
- `Kabelterasse_Rechner`: der Rohrtyp wird ausgelesen. Die hinterlegten
  Innendurchmesser gelten fuer starres PVC nach EN 61386; bei Wellrohr und Stahlrohr
  sagt das Werkzeug jetzt, dass die Werte abweichen und die Herstellerangabe gilt.
  Eigene Zahlen dafuer zu erfinden waere schlimmer als der Hinweis.

---

## 3. Neue fachliche Befunde

### `Cause_Effect.html` - Import kann Ausloesungen still verlieren

Beim Excel-Import wird die Ursachen-Kennung so gebildet:

    const causeId = parseInt(row[0]) || r;

Zwei Probleme, beide still:

1. **Kein Schutz gegen doppelte Kennungen.** Eine Zeile ohne ID bekommt die
   Zeilennummer, eine spaetere Zeile mit ausdruecklicher ID kann dieselbe Zahl
   tragen. Die Verknuepfungen liegen unter `${causeId}-${effId}`, also
   **ueberschreibt die zweite Ursache die Ausloesungen der ersten**. In einer
   Sicherheitsmatrix ist das genau der Fehler, den man nie sehen will.
2. **Eine ID von 0 faellt durch.** `parseInt("0") || r` ergibt die Zeilennummer.

Dazu: die Simulation wertet nur `X` und `T` als aktiv. Eine importierte Matrix, die
ein anderes Zeichen benutzt, wird anstandslos eingelesen, angezeigt - und
simuliert dann **nichts**, ohne Hinweis.

### DXF-Export: die Einheit ist nirgends erklaert

9 von 10 Exportern schreiben kein `$INSUNITS` in den Kopf. Das empfangende CAD nimmt
dann "einheitenlos" an. Erschwerend kommt dazu, dass die Werkzeuge nicht dasselbe
schreiben: `Visueller_Kabeltrassen_CAD` und `Schaltschrank_CAD` rechnen in
Millimetern, `Loop_Library` schreibt dagegen die **SVG-Bildschirmkoordinaten**
direkt in die Datei.

Der Abschluss der Dateien ist dagegen bei allen zehn in Ordnung - `0/EOF` wird
ueberall geschrieben. (Das hatte ich im ersten Durchgang zu knapp geprueft.)

### Kein Werkzeug speichert seinen Zustand, mit vier Ausnahmen

Aus dem ersten Durchgang, nachgezaehlt: 23 von 27 verlieren beim Neuladen alles.
Bei `Loop_CAD`, `Cause_Effect` und `Trasse_CAD` sind das Stunden Arbeit. Fuer ein
verkauftes Werkzeug ist das kaum haltbar.

---

## 4. Aus dem ersten Durchgang, noch offen

Unveraendert gueltig, hier nur als Liste:

- ~~`Regelventil`~~ *(behoben)*: siehe Abschnitt 7.
- ~~`Petrochem_Hydraulic`~~ *(behoben)*: Vorzeichen, NPSHa und Anlagenkennlinie,
  siehe README.
- ~~`Hydrocyclone`~~ *(behoben, mit Korrektur)*: der gemeldete Einheiten-Widerspruch
  bei C2 **existiert nicht** - die Diagrammachse ist in kPa und der Marker rechnet
  vorher um, beide Stellen liefern denselben Wert. Der Befund war falsch. Der echte
  Fehler war, dass nicht rechenbare Ergebnisse als **0** angezeigt wurden (0,0 µm
  Trennkorngroesse), also wie das beste statt wie gar kein Ergebnis. Siehe README.
- ~~`Electrical_Toolbox`~~ *(behoben)*: `eval()` auf der Taschenrechner-Eingabe,
  ersetzt durch einen eigenen Auswerter. Siehe README.
- `Load`: Motorsicherung auf Nennstrom statt 1,5- bis 2-fachem.
- `Cable_Manager`: Motorstrom ohne Wirkungsgrad, 5 bis 10 % zu klein.
- `Electrical_Toolbox`: Kondensatorstufe rundet jetzt auf statt auf den
  naechstliegenden Wert. *(behoben)*
- `Lighting_CAD`: die 3D-Darstellung reisst die Rechnung nicht mehr mit. *(behoben)*
- ~~`Lighting_CAD`~~ *(behoben)*: der Betriebswirkungsgrad ist eine erfundene Kurve,
  ersetzt durch die Strahlungsbilanz des Raumes. Siehe README.
- ~~Spannungsfall ohne induktiven Anteil X, ab etwa 95 mm2 spuerbar.~~ *(behoben)*
  Es fehlte zusaetzlich cos phi. Siehe README.
- ~~Beide Estimatoren: die Reserve wird nur auf Material und Montage gerechnet, nicht
  auf Planung und Inbetriebnahme; eine Summe mit `UNKNOWN`-Positionen wird nicht als
  vorlaeufig gekennzeichnet.~~ *(behoben)* Siehe README.
- ~~`Schaltschrank_CAD`~~ *(behoben)*: keine Verlustleistungs- und Kuehlrechnung
  (IEC 61439-1). Nutzoberflaeche nach IEC 60890, Luftmenge aus der
  Waermekapazitaet der Luft. Siehe README.

---

## 5. Was geprueft wurde und stimmt

Damit klar ist, wo **nichts** zu tun ist. Alles einzeln nachgerechnet:

- DIN-Profiltabelle HEA/HEB/IPE/UNP, Bewehrungsformel `d²/162`
- Leiterwiderstaende Cu und Al gegen IEC 60228, alle Werte
- Spannungsfall-, Motor-, Trafo- und Blindleistungsformeln
- Swamee-Jain, Darcy-Weisbach, geodaetischer Anteil
- Churchill-Gleichung
- Kv/Cv fuer Fluessigkeiten, Kavitationsgrenze, gleichprozentige Kennlinie
- Arterburn/Krebs und die reduzierte Trennkurve nach Lynch-Rao
- Raumindex und Wirkungsgradverfahren
- Callendar-Van-Dusen ueber 0 °C samt Umkehrformel
- Rohrfuellgrad 40 % und die Fuellgradgeometrie
- Abschluss aller zehn DXF-Dateien

Die beiden Estimatoren sind die am saubersten gebauten Programme im Ordner: jede
Position traegt `status` (OK / UNKNOWN / RFQ_REQUIRED) und einen `source`-Text.

---

## 6. Was ich nicht pruefen kann und was nicht in meiner Hand liegt

**Technisch nicht pruefbar in dieser Umgebung:**
- ob die CDN-Pfade heute noch aufloesen (kein Netzzugang), insbesondere three.js r160
- wie die DXF-Dateien in AutoCAD tatsaechlich ankommen
- die Zahlenwerte der Strombelastbarkeit gegen VDE 0298-4

**Nicht technisch, aber vor einem Verkauf zu klaeren:**

Wer Berechnungssoftware an Ingenieurbueros verkauft, uebernimmt eine andere Rolle
als jemand, der ein eigenes Hilfsmittel benutzt. Dazu gehoeren mindestens:
Haftungsregelung und Lizenzbedingungen, eine nachvollziehbare Angabe, gegen welche
Norm in welcher Ausgabe gerechnet wird, und ein Nachweis, dass die Ergebnisse
geprueft wurden. Mehrere Werkzeuge sagen im Hilfetext selbst, dass sie
Schaetzungen liefern - das gehoert dann auch ins Angebot und nicht nur in ein Modal.

Das ist keine Programmieraufgabe und nichts, was ich fuer dich entscheiden kann.
Ich sage es, weil der Rest dieses Berichts sonst den Eindruck erweckt, mit dem
Abarbeiten der Liste sei die Sache erledigt.

---

## 7. Vorschlag fuer die Reihenfolge

1. ~~**Bibliotheken lokal mitliefern.**~~ Erledigt, aus npm statt vom CDN.
   Die Sperre lag an cdnjs, nicht am Container: npm war die ganze Zeit
   erreichbar.
2. ~~**Eingabepruefung ueberall.**~~ Erledigt, 12 Rechenwege.
3. ~~**Die drei toten Eingabefelder.**~~ Erledigt.
4. ~~**Die beiden Tabellen widersprechen sich.**~~ Erledigt: eine gemeinsame
   Tabelle in `strombelastbarkeit.js`, und wo sie sich widersprachen, gilt der
   kleinere Wert. **Gegen die Norm geprueft ist sie weiterhin nicht** - das
   sagt das Werkzeug auf dem Bildschirm, und die Tabelle laesst sich durch
   eine eigene ersetzen. Dafuer braucht es jemanden mit der Norm.
5. **Die fachlichen Fehler aus Abschnitt 4**, angefangen bei `Regelventil` und
   `Petrochem`.
6. **Speichern nachruesten**, zuerst bei `Loop_CAD`, `Cause_Effect`, `Trasse_CAD`.
7. **`$INSUNITS` und einheitliche Millimeter** in allen DXF-Exportern.
8. **Dashboard bauen** und die toten Home-Links darauf zeigen lassen.
