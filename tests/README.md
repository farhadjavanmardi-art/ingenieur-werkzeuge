# Pruefung der Ingenieur-Werkzeuge

229 Pruefungen, die jedes Werkzeug in einem echten Chromium oeffnen, Werte
eintragen und ablesen, was auf dem Bildschirm steht.

    cd ingenieur-werkzeuge/tests
    npm install          # einmalig, holt Playwright
    node run.cjs

Rueckgabewert 0, wenn alles stimmt, sonst 1. Ein Argument filtert:

    node run.cjs Regelventil
    node run.cjs nan
    node run.cjs struktur
    node run.cjs shop

## Warum es diese Pruefung gibt

Beim Durchsehen der Werkzeuge ist zweierlei passiert, das den Aufwand erklaert:

- Zwei Fehler, die beim blossen **Lesen** des Codes nicht aufgefallen sind, kamen
  erst beim **Ausfuehren** heraus. `Lighting_CAD` und `Regelventil` schrieben bei
  leeren Feldern `NaN` ins Ergebnis. In `Regelventil` gab es sogar eine Pruefung
  dagegen - sie lief nur ins Leere, weil `NaN >= NaN` falsch ist.
- Ein gemeldeter Fehler war **keiner**: der angebliche Einheiten-Widerspruch in
  `Hydrocyclone` existierte nicht, die Diagrammachse war bloss in kPa statt in bar.

Lesen allein reicht also nicht, in beide Richtungen. Diese Pruefung fuehrt aus.

## Was geprueft wird

**1. Rechenwerte.** Feste Sollwerte fuer Regelventil, Load, Earthing, Petrochem,
Hydrocyclone, Kabeldimensionierung, Bau_Rechner, Electrical_Toolbox, Lighting_CAD
und MSR_Loop_Check. Jeder Sollwert ist am Werkzeug gemessen **und** von Hand
nachgerechnet worden, nachdem der jeweilige Fehler behoben war.

Die Faelle sitzen bewusst dort, wo es frueher schiefging: 1150 kW Trafobedarf
(die uebersprungene Luecke), Gas bei x = 0,67 (knapp unter der kritischen Grenze),
eine bergab laufende Leitung (das Vorzeichen), Feststoff ueber 53 Prozent
(ausserhalb des Gueltigkeitsbereichs).

**2. Kein NaN im Ergebnisfeld.** Jedes Zahlenfeld wird leer gemacht, dann auf 0,
dann auf -5 gesetzt. In keinem Ergebnisfeld darf danach `NaN`, `Infinity` oder
`undefined` stehen. Das war einmal in zwoelf Rechenwegen der Fall.

**3. Struktur aller 27 Dateien.** Doppelte Element-IDs und Handler, die auf keine
Funktion zeigen.

**4. Das Dashboard** unter `dashboard/`. Es ist der Einstieg zu allen Werkzeugen,
also faellt ein Fehler dort an 27 Stellen auf. Geprueft wird, dass keine Datei mehr
auf das Netzlaufwerk zeigt, dass alle 27 auf das Dashboard verweisen, dass kein
Verweis eine Datei meint, die es nicht gibt, dass alle 27 in vier Abschnitten
erscheinen, dass die Suche wirklich eingrenzt (auch mit zwei Begriffen) und wieder
aufmacht, und dass die Seite auch unter `/dashboard` ohne Schraegstrich laedt -
daran ist die Verkaufsseite schon einmal leer geblieben. Zuletzt wird der
Quelltext nach Schluesseln durchsucht: dass dort keiner steht, ist der teuerste
denkbare Fehler dieser Seite.

**5. Ein Katalog fuer Seite und Modell.** Die Edge Function `werkzeug-assistent`
fuehrt eine verkuerzte Kopie der Werkzeugliste, weil sie nicht in das Web-Projekt
hineingreifen kann. Die Pruefung haelt sie gegen `shop/werkzeuge.js`. Wer ein
Werkzeug hinzufuegt und den Katalog vergisst, bekommt eine rote Zeile - sonst
wuerde das Modell das neue Werkzeug einfach nie vorschlagen, und das faellt
niemandem auf.

**6. Der KI-Helfer** in vierzehn Werkzeugen. Geprueft wird das, was dabei
wirklich schiefgehen kann: dass in keiner Seite und im Helfer selbst ein
Schluessel steht (der teuerste denkbare Fehler - jede dieser Seiten ist
oeffentlich lesbar); dass jede Betriebsart eine ist, die die Edge Function
kennt (ein Tippfehler im Modus faellt sonst erst beim Benutzer auf); dass die
Ergebnisse des Werkzeugs beim Helfer wirklich ankommen (sonst fragt das Modell
ueber nichts und kostet trotzdem); und dass der Helfer ohne Netz seine Meldung
zeigt, statt still zu bleiben - waehrend das Werkzeug weiterrechnet. Das Netz
ist in dieser Pruefung ohnehin abgeschaltet, das ist also der echte Fall und
keine Nachstellung.

**7. Ein Aussehen fuer alle.** Schrift, Grundflaeche, Textfarbe, Eingabefelder,
Hauptknopf und Eckenradien muessen in allen 27 Werkzeugen gleich sein, und es
darf kein zwoelfter Gruenton dazukommen. Gemessen wird am gerenderten
Dokument, nicht am CSS-Text - eine Regel, die von einer anderen
ueberschrieben wird, stuende sonst als Tatsache da. Zwei Knoepfe in
`Trasse_CAD` sind ausdruecklich erlaubt: ihre Farbe ist die des Teils, das
sie zeichnen. Zuletzt wird geprueft, dass der schwebende Knopf des KI-Helfers
nichts Bedienbares zudeckt - in zwei Werkzeugen lag dort etwas.

**8. Denselben Motor, denselben Strom.** `Load` und `Cable_Manager` rechnen
denselben Motorstrom; `Cable_Manager` liess den Wirkungsgrad weg und kam 5 bis 10
Prozent zu niedrig heraus. Die Pruefung haelt beide fuer drei Motoren gegeneinander
und prueft dazu, dass eine allgemeine Last ohne Wirkungsgrad rechnet.

**9. Der Taschenrechner fuehrt nichts aus.** Die Eingabezeile des Taschenrechners
in `Electrical_Toolbox` ging frueher in `eval()`. Die Pruefung haelt drei Dinge
fest: `eval(` kommt im Code nicht mehr vor; 16 gueltige Ausdruecke rechnen auf die
Ziffer genau wie vorher; und 14 Eingaben, die kein Ausdruck sind, kommen nicht
durch. Dazu die Bedingung, dass `5/0` einen Fehler meldet statt `Infinity`.

**10. Der Betriebswirkungsgrad im Lighting_CAD.** Frueher eine erfundene Kurve, die
die Reflexionsgrade nicht einmal gelesen hat. Geprueft werden feste Werte fuer vier
Raeume, dass der UF aus dem Datenblatt die Rechnung schlaegt, dass ein unmoeglicher
Wert von Hand abgelehnt wird - und die Richtung, auf die es ankommt: derselbe Raum
mit dunklen Oberflaechen braucht mehr Leuchten als mit hellen.

**11. Spannungsfall mit cos phi und induktivem Anteil.** Frueher stand dort
`dU = sqrt(3) * I * R * L` - ohne beides. Geprueft wird der Fall, in dem das Kabel
dadurch zu klein gewaehlt wurde (250 A auf 250 m: 240 statt 300 mm2), der Fall, in
dem es unnoetig dick wurde (63 A auf 80 m: 25 statt 16 mm2), die Aufteilung in
ohmschen und induktiven Anteil, dass Gleichstrom keinen induktiven Anteil hat, und
dass eine Gummileitung bei 90 Grad einen Hinweis bekommt.

**12. Pt100 und Pt1000 unter null Grad.** Der C-Term der Callendar-Van-Dusen-
Gleichung fehlte, und das Werkzeug hat unter null Grad gar nichts gerechnet.
Geprueft werden fuenf Punkte der Normtabelle (-200, -100, 0, 100, 850 Grad), der
Rueckweg vom Widerstand zur Temperatur unter null, Pt1000 als derselbe Fuehler mit
zehnfachem R0, und dass ausserhalb des Geltungsbereichs die Grenze dasteht statt
einer Zahl.

**13. Die Waermebilanz im Schaltschrank_CAD.** Es gab keine. Geprueft wird die
Nutzoberflaeche fuer vier Aufstellungsarten gegen die von Hand nachgerechneten Werte,
die Summe der Verlustleistungen, der Fall in dem die Eigenkonvektion reicht, der Fall
in dem Luftmenge und Kuehlleistung beziffert werden, der Fall in dem die Umgebung
waermer ist als das Ziel und ein Luefter nicht mehr hilft, und dass der Wert aus dem
Datenblatt den Typwert schlaegt.

**14. Die Zuschlaege in beiden Estimatoren.** Der Risikozuschlag lag nur auf Material
und Montage, nicht auf Planung und Inbetriebnahme. Geprueft wird ein bewusst magerer
Fall - 950 Euro Material gegen 10.000 Euro Stunden -, an dem aus 95 Euro Zuschlag
1.095 werden, dazu dass ohne Zuschlag alles bleibt wie vorher, und dass eine Summe mit
ungesicherten Preisen sich selbst als vorlaeufig meldet und den Betrag nennt, nicht nur
die Anzahl der Positionen.

**15. Die Kurzschlussdaten im Load.** Nach der Trafogroesse kommt die Frage nach dem
Schaltvermoegen des Hauptschalters. Geprueft werden I_k", i_p und S_k" fuer 1000 kVA
gegen von Hand nachgerechnete Werte, die naechste genormte Stufe des Schaltvermoegens,
der Unterschied zwischen u_k 4 und 6 Prozent, dass kappa aus dem Typenschild gerechnet
und nicht geschaetzt wird, und dass ein unmoegliches Typenschild gemeldet statt
gerechnet wird.

**16. Die Gleichmaessigkeit im Lighting_CAD.** Sie wurde nie geprueft, obwohl im
Kommentar "S/H ratio check" stand. Geprueft werden U0 und E_min im Vorgaberaum, der
Unterschied zwischen Wandabstand S/2 und S/3, und der Fall, auf den es ankommt: eine
Halle, die hell genug ist und trotzdem durchfaellt - dieselben zwanzig Leuchten
bestehen, sobald der Wandabstand von S/2 auf S/3 geht. Dazu die strengere Forderung
0,70, bei der dieselbe Anlage wieder nicht reicht.

**17. Rauheit und Colebrook im Druckverlust.** Die Rauheit stand fest auf 0,045 mm.
Geprueft werden vier Werkstoffe gegen einen eigenen Colebrook-Loeser - vom Kunststoff
bis zur verkrusteten Leitung liegt das Zweieinhalbfache dazwischen -, dass laminar
weiter mit 64/Re gerechnet wird, und dass die Werkstoffauswahl die Rauheit ins Feld
setzt.

**18. Dieselben Formstuecke in beiden Werkzeugen.** `Druckverlust` und `Petrochem`
hatten eigene Zeta-Tabellen mit verschiedenen Zahlen. Jetzt lesen beide aus
`formstuecke.js`, und drei Pruefungen halten sie dagegen - in derselben Bauart wie
die Pruefung der Strombelastbarkeit. Dazu zwei Faelle, die zeigen, was der
Unterschied zwischen Rueckschlagklappe und Rueckschlagventil im Jahr kostet.

**19. Ventilbauart und Autoritaet im Regelventil.** Geprueft wird, dass die Bauart
FL und xT auf die Tabellenwerte setzt, und der Fall, auf den es ankommt: bei P1 = 6
auf P2 = 2 bar braucht das Durchgangsventil Kv 12,50, die 90-Grad-Klappe 18,59, weil
sie frueher kritisch wird. Dazu zwei Faelle zur Ventilautoritaet - derselbe Kv, einmal
regelbar und einmal nicht.

**20. Die Verlegeart auf der Kabeltrasse.** Gerechnet wurde immer einlagig
beruehrend, und das stand nirgends. Geprueft werden drei Verlegearten mit denselben
20 Kabeln: 312 mm beruehrend, 624 mm mit Abstand, 123 mm gebuendelt - Trasse 400
gegen > 600 gegen 150. Dazu der vorsichtigere Fuellgrad und dass am Ergebnis steht,
worauf es beruht.

**21. Null ist eine Eingabe, kein fehlender Wert.** In JavaScript ist `0 || 0.25`
gleich `0.25`. Geprueft wird, dass null Euro je kWh und null Betriebsstunden im
`Petrochem` auch null Kosten ergeben und nicht die 3.412 Euro des Ersatzwerts. Dazu,
dass der Fuellgrad im `Kabelterasse_Rechner` auch fuer das Rohr gilt und nicht nur
fuer die Trasse.

**22. Die Sprachumschaltung.** Geprueft wird der Rueckweg - wer auf Persisch
umschaltet und zurueck, muss genau den deutschen Text wiederbekommen, sonst ist die
Seite nach zwei Klicks kaputt. Dazu die Leserichtung (Persisch rechts nach links,
Zahlenfelder nicht), dass Normnamen und Einheiten nicht im Woerterbuch stehen, und
dass der Sprachwaehler in keinem der 27 Werkzeuge etwas Bedienbares zudeckt. Zuletzt
wird die Luecke gezaehlt und ausgegeben: wieviele Texte noch keinen Eintrag haben.

**23. Die Verkaufsseite** unter `shop/`. Sie ist Teil des Produkts, also wird sie
mitgeprueft. Drei Fehler sind beim Bauen passiert und duerfen nicht zurueckkommen:
im Text stand 26, im Ordner lagen 27 Werkzeuge; eine Karte zeigte auf eine Datei,
die es nicht gibt; und ohne erreichbare Datenbank blieb die Preisliste leer. Die
Pruefung zaehlt die Karten gegen die Dateien im Ordner, vergleicht jede genannte
Anzahl damit, prueft jeden Verweis und laesst das Formular ohne Datenbank
absenden - es muss dann die E-Mail-Adresse nennen statt still zu bleiben.

## Das Netz ist abgeschaltet

`lib.cjs` startet fuer die Dauer der Pruefung einen winzigen Web-Server auf
127.0.0.1 und laesst nur Anfragen an ihn durch. Alles andere wird geblockt,
auch auf einem Rechner mit Internet. Zwei Gruende:

1. Reproduzierbar. Das Ergebnis haengt nicht daran, ob gerade ein fremder Server
   erreichbar ist.
2. Es faellt auf, wenn eine **Rechnung** wieder anfaengt, von einem fremden Server
   abzuhaengen. Genau das war der Grund, warum `Earthing_CADE` ohne Netz gar keinen
   Widerstand mehr anzeigte.

Frueher wurden die Dateien ueber `file://` geoeffnet. Das ging nicht weit genug:
ES-Module verweigert der Browser unter `file://` grundsaetzlich, auch wenn die
Datei danebenliegt. `Bau_CAD` und `Structure_CAD` sahen deshalb kaputt aus,
obwohl sie es nicht waren. Verkauft wird ohnehin ein Web-Server, also wird
genauso geprueft.

## Die bekannte Luecke - geschlossen

Sechs Werkzeuge holten ihre Bibliothek (three.js, paper.js) zur Laufzeit von
einem oeffentlichen CDN und waren ohne Netz funktionslos. Die Bibliotheken
liegen jetzt unter `bibliotheken/` im Projekt; kein Werkzeug verweist mehr nach
draussen. Hintergrund: `PRUEFBERICHT.md`, Abschnitt 1.1.

Die Liste `OHNE_NETZ_TOT` in `run.cjs` ist deshalb leer. Sie bleibt stehen: wer
wieder etwas von einem fremden Server holt, muss es dort eintragen - und merkt
dabei, was er tut.

## Wenn eine Pruefung rot wird

Ein Sollwert ist kein Vorschlag. Wird eine Pruefung rot, ist erst einmal die
**Aenderung** verdaechtig, nicht die Pruefung. Einen Sollwert nur dann anpassen,
wenn klar ist, warum das Ergebnis jetzt ein anderes sein soll - und den Grund in
den Commit schreiben.

Beide Male, als beim Aufbau dieser Pruefung etwas rot war, lag es uebrigens an der
Pruefung selbst: ein falsch geratener Sollwert, und ein Suchmuster, das das
deutsche Wort "null" in einer Fehlermeldung fuer den JavaScript-Wert `null` hielt.
Auch das gehoert zum Bild.

## Dateien

| Datei | |
|---|---|
| `run.cjs` | Ablauf, Ausgabe, Rueckgabewert |
| `faelle.cjs` | die Pruefaelle mit ihren Sollwerten |
| `lib.cjs` | Browser starten, Netz abschalten, Felder setzen und lesen |
