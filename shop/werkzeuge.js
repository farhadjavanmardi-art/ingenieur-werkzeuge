// Die 27 Werkzeuge, wie sie auf der Seite beschrieben werden.
//
// "grundlage" nennt die Rechenvorschrift, nach der gerechnet wird. Sie steht
// bewusst bei jedem Werkzeug: wer so etwas kauft, will wissen, woher die Zahl
// kommt. "grenze" sagt, was das Werkzeug NICHT leistet. Auch das gehört
// dazu - ein Ingenieurbüro merkt ohnehin, wenn eine Zusage nicht hält.

const WERKZEUGE = [
{
  id: 'kabeldimensionierung', datei: 'Kabeldimensionierung_Spannungsfall.html',
  gruppe: 'elektro', name: 'Kabeldimensionierung & Spannungsfall',
  kurz: 'Findet den Querschnitt, der Strombelastbarkeit und Spannungsfall gleichzeitig erfüllt.',
  lang: 'Sie geben Leistung oder Strom, Spannung, Länge, cos phi und den zulässigen Spannungsfall ein. Das Werkzeug rechnet die ganze Querschnittsreihe von 1,5 bis 300 mm² durch, für Kupfer und Aluminium, und markiert den ersten Querschnitt, der beide Bedingungen erfüllt. Jede Zeile zeigt, woran es scheitert: zu wenig Belastbarkeit oder zu viel Spannungsfall.',
  nutzen: 'Statt zwei Tabellen und einer Excel-Zeile pro Abgang sehen Sie die gesamte Reihe auf einen Blick und erkennen sofort, welche Bedingung bindet. Bei langen Leitungen ist das fast immer der Spannungsfall, und genau dort wird von Hand gern zu klein gewählt.',
  grundlage: 'Leiterwiderstände nach IEC 60228, gerechnet mit dem Widerstand bei Leitertemperatur, nicht mit dem kalten Tabellenwert. Spannungsfall mit dU = sqrt(3) I L (R cos phi + X sin phi) — mit beiden Anteilen. Ohne cos phi kommt bei kleinen Querschnitten zu viel heraus, ohne X ab etwa 95 mm² zu wenig: 250 A auf 250 m ergaben 240 mm², nötig sind 300.',
  grenze: 'Die Tabelle der Strombelastbarkeit ist nicht gegen DIN VDE 0298-4 geprüft — das Werkzeug sagt das selbst auf dem Bildschirm, und die Tabelle lässt sich durch Ihre eigene ersetzen. Der Reaktanzbelag ist mit 0,08 Ohm/km voreingestellt; wer das Datenblatt hat, trägt seinen Wert ein.'
},
{
  id: 'cable_manager', datei: 'Cable_Manager.html',
  gruppe: 'elektro', name: 'Cable Manager',
  kurz: 'Kabelliste je Verbraucher, mit Verschraubung und Trommelbelegung.',
  lang: 'Verbraucher eintragen, Leistung und Länge dazu, und das Werkzeug führt die Liste: Strom, Querschnitt, Spannungsfall, passende Verschraubung nach Außendurchmesser. Am Ende steht, wie viele Trommeln welcher Länge Sie brauchen.',
  nutzen: 'Die Kabelliste ist in fast jedem Projekt das Dokument, das am öftesten angefasst wird. Hier entsteht sie nebenbei und bleibt in sich stimmig, statt in drei Excel-Ständen zu existieren.',
  grundlage: 'Dieselbe Spannungsfallrechnung wie in der Kabeldimensionierung, mit derselben Leitertemperatur — und dieselbe Tabelle der Strombelastbarkeit. Beide führten vorher eine eigene und wichen um 14 bis 26 Prozent voneinander ab; jetzt gibt es nur noch eine, und wo sie sich widersprachen, gilt der kleinere Wert.',
  grenze: 'Die Kabeltypen unterscheiden sich nur in der zulässigen Leitertemperatur, nicht in eigenen Belastbarkeitswerten — dafür fehlt eine geprüfte Tabelle je Typ.'
},
{
  id: 'electrical_toolbox', datei: 'Electrical_Toolbox.html',
  gruppe: 'elektro', name: 'E-Technik Toolbox',
  kurz: 'Die vier Rechnungen, die man am Tag zwanzigmal braucht.',
  lang: 'Leistung und Strom ineinander umrechnen, für Gleichstrom, Wechselstrom und Drehstrom. Motorstrom und Scheinleistung aus Wirkungsgrad und cos phi. Die nötige Kondensatorleistung für einen Ziel-cos-phi, samt nächster Standardstufe. Spannungsfall aus Strom, Länge und Querschnitt. Dazu ein wissenschaftlicher Taschenrechner.',
  nutzen: 'Das ist das Werkzeug, das offen bleibt. Es ersetzt den Zettel neben der Tastatur und die Formelsammlung im Regal.',
  grundlage: 'Q = P (tan phi1 - tan phi2) für die Blindleistung, dU = f L I / (kappa A) für den Spannungsfall. Die Kondensatorstufe wird aufgerundet, nicht auf den nächstliegenden Wert gerundet - eine kleinere Stufe würde den Ziel-cos-phi verfehlen.',
  grenze: 'Die 3-Prozent-Grenze beim Spannungsfall ist pauschal gesetzt; DIN 18015-1 meint damit Endstromkreise.'
},
{
  id: 'load', datei: 'Load.html',
  gruppe: 'elektro', name: 'Load Master',
  kurz: 'Trafo-Auslegung, Motorabgang und elektrische Heizung.',
  lang: 'Aus installierter Leistung, Gleichzeitigkeit, cos phi, Wirkungsgrad und Reserve ergibt sich die Scheinleistung und daraus der Trafo aus der Normreihe, mit Sekundärstrom und Auslastung. Der Motorteil liefert Strom, Scheinleistung, Anlaufstrom bei Direkt- und Stern-Dreieck-Anlauf und einen Sicherungsvorschlag. Der Heizungsteil rechnet aus Masse, Wärmekapazität, Temperaturhub und Zeit die nötige Leistung und die Ströme.',
  nutzen: 'Die Trafogröße ist eine der teuersten Einzelentscheidungen in einer Anlage. Die Auslastung daneben zeigt sofort, ob Sie an der Grenze fahren oder Geld verschenken.',
  grundlage: 'Normreihe der Bemessungsleistungen von 50 bis 3150 kVA. Motorschutz nach DIN VDE 0100-430: die Sicherung trägt den Anlaufstrom, das Überlastrelais schützt den Motor — zwei Aufgaben, zwei Geräte. Kurzschlussdaten an der Unterspannungsschiene nach IEC 60909, mit kappa aus u_k und P_k des Typenschilds statt aus dem Pauschalwert 1,8. Heizung nach Q = m cp dT.',
  grenze: 'Beim Kurzschluss wird das vorgelagerte Netz weggelassen. Seine Impedanz käme in Reihe dazu und würde den Strom kleiner machen — ohne sie kommt zu viel heraus, und beim Schaltvermögen ist zu viel die sichere Richtung. Wer die Netzkurzschlussleistung des Versorgers hat, rechnet genauer.'
},
{
  id: 'earthing', datei: 'Earthing_CADE.html',
  gruppe: 'elektro', name: 'Earthing Master 3D',
  kurz: 'Erdungsnetz zeichnen und den Erdungswiderstand abschätzen.',
  lang: 'Sie geben Fläche, Rastermaß, Bodenwiderstand, Tiefenerder und Anschlussfahnen ein. Das Werkzeug zeichnet das Netz räumlich, gibt es als 3D-DXF aus und rechnet den Erdungswiderstand: Netz allein, Stäbe allein, beides zusammen. Bandlänge und Ersatzradius stehen daneben, damit die Zahl nachvollziehbar bleibt.',
  nutzen: 'Frühe Abschätzung, ob das Fundament allein reicht oder Tiefenerder dazu müssen - bevor der Beton steht.',
  grundlage: 'Näherung nach Laurent/Niemann aus IEEE 80 für das Netz, Dwight für den Einzelstab, mit einem einstellbaren Ausnutzungsgrad für die gegenseitige Beeinflussung der Stäbe.',
  grenze: 'Gilt für gleichmäßigen Boden. Die Kopplung zwischen Netz und Stäben ist nicht enthalten, der wahre Wert liegt dadurch etwas höher. Die Verlegetiefe geht nur in die Zeichnung ein. Der Erdungswiderstand einer Anlage ist zu messen - das Werkzeug sagt das selbst.'
},
{
  id: 'lighting', datei: 'Lighting_CAD.html',
  gruppe: 'elektro', name: 'Lighting Calculation Pro',
  kurz: 'Wie viele Leuchten braucht der Raum, und wie werden sie verteilt.',
  lang: 'Raummaße, Nutzebene, Soll-Beleuchtungsstärke, Lichtstrom und Leistung je Leuchte, Wartungsfaktor. Heraus kommen Raumindex, nötiger Gesamtlichtstrom, Anzahl der Leuchten, ein sinnvolles Raster, die tatsächlich erreichte Beleuchtungsstärke und die Leistungsdichte in W/m². Dazu eine räumliche Darstellung des Raums mit den Leuchtenpositionen.',
  nutzen: 'In zwei Minuten die Größenordnung für ein Angebot oder eine Vorplanung, statt auf die Lichtplanung zu warten.',
  grundlage: 'Wirkungsgradverfahren: Phi = E A / (UF MF), Raumindex k = L B / ((L+B) h). Der Betriebswirkungsgrad kommt aus der Strahlungsbilanz des Raumes — Direktanteil als Formfaktor nach Hottel, Zwischenreflexion über Decke, Wände und Nutzebene. Die Gleichmäßigkeit U0 wird punktweise ausgerechnet, ohne den Randstreifen von 0,5 m nach EN 12464-1.',
  grenze: 'Der gerechnete UF gilt für diffuse Reflexion und eine gleichmäßig belegte Leuchtenebene. Wer die Wirkungsgradtabelle seiner Leuchte hat, stellt auf „aus dem Datenblatt“ um — der Hersteller kennt die Lichtverteilung, dieses Werkzeug nicht. Blendung (UGR) wird nicht geprüft. Für die Auslegung brauchbar, als Nachweis nach EN 12464-1 nicht ausreichend.'
},
{
  id: 'sld', datei: 'SLD_CAD.html',
  gruppe: 'elektro', name: 'SLD Generator',
  kurz: 'Einpoliges Übersichtsschaltbild aufbauen und als DXF ausgeben.',
  lang: 'Einspeisung, Trafo, Sammelschiene und Abgänge zusammenklicken, Bezeichnungen und Nennwerte eintragen, als DXF exportieren und im CAD weiterzeichnen.',
  nutzen: 'Das Übersichtsschaltbild ist oft das erste Blatt, das ein Kunde sieht. Hier steht es in Minuten statt in Stunden.',
  grundlage: 'Symbolik nach IEC-Konvention.',
  grenze: 'Zeichenwerkzeug, keine Netzberechnung. Kurzschlussströme und Selektivität gehören in eine Netzberechnung.'
},
{
  id: 'schaltschrank', datei: 'Schaltschrank_CAD.html',
  gruppe: 'elektro', name: 'Schaltschrank CAD',
  kurz: 'Montageplatte bestücken, als DXF und PDF ausgeben.',
  lang: 'Schrankmaß wählen, Komponenten aus der Bibliothek auf die Montageplatte ziehen, Hutschienen und Kanäle anordnen. Ausgabe als 3D-DXF für den Schrankbauer und als PDF für die Dokumentation.',
  nutzen: 'Die Bestückungsplanung wird sonst in CAD gemacht oder gar nicht. Hier geht sie schnell genug, um sie auch für kleine Schränke wirklich zu machen.',
  grundlage: 'Maßgenaue Anordnung in Millimetern. Wärmebilanz nach IEC 61439-1: Nutzoberfläche aus den Oberflächenfaktoren der IEC 60890, Übertemperatur aus Pv/(k·Ae). Reicht die Eigenkonvektion nicht, nennt das Werkzeug die Lüfterluftmenge — hergeleitet aus der Wärmekapazität der Luft — oder die Kühlleistung.',
  grenze: 'IEC 60890 gibt die Übertemperatur über Kurven an, die uns nicht vorliegen; gerechnet wird mit dem linearen k·A-Modell, mit dem die Schrankhersteller ihre Kühlgeräte auslegen. Für die Auslegung brauchbar, als Nachweis nicht ausreichend. Die Verlustleistungen sind Typwerte und am Bauteil änderbar.'
},
{
  id: 'loop_cad', datei: 'Loop_CAD.html',
  gruppe: 'msr', name: 'Batch Loop Generator',
  kurz: 'Loop-Blätter für die ganze Messstellenliste auf einmal.',
  lang: 'Sie importieren die Messstellenliste aus Excel. Das Werkzeug erzeugt daraus die Loop-Blätter: Feldgerät, Klemmkasten, Rangierverteiler, Karte, mit Schirmführung und Klemmenbezeichnung. Ausgabe als SVG und DXF, dazu ein Bericht, was aus der Liste nicht gelesen werden konnte.',
  nutzen: 'Das ist die größte einzelne Zeitersparnis der ganzen Sammlung. Loop-Blätter sind stumpfe, fehleranfällige Arbeit; bei 300 Messstellen reden wir über Wochen.',
  grundlage: 'Aufbau nach der üblichen EMSR-Praxis, Schirm je Segment nachvollziehbar.',
  grenze: 'Die Excel-Vorlage muss eingehalten werden. Was nicht passt, steht im Bericht und wird nicht stillschweigend erfunden.'
},
{
  id: 'loop_library', datei: 'Loop_Library.html',
  gruppe: 'msr', name: 'IEC Loop Designer',
  kurz: 'Einzelne Loop-Schaltbilder frei zeichnen.',
  lang: 'Symbole setzen, Klemmen verbinden, beschriften, als DXF ausgeben. Für den Sonderfall, der nicht aus der Liste kommt.',
  nutzen: 'Ergänzt den Batch-Generator dort, wo ein Kreis von Hand gezeichnet werden muss.',
  grundlage: 'IEC-Symbolik für Messen, Steuern, Regeln.',
  grenze: 'Zeichenwerkzeug ohne Prüfung der Logik.'
},
{
  id: 'loop_check', datei: 'MSR_Loop_Check_Skalierung.html',
  gruppe: 'msr', name: 'MSR Loop Check',
  kurz: 'Skalierung, Pt100 und Einheiten - das Werkzeug für die Inbetriebnahme.',
  lang: 'Ein Schieberegler von 4 bis 20 mA zeigt den zugehörigen Messwert und den Prozentwert. Pt100 in beide Richtungen: Temperatur zu Widerstand und zurück. Dazu bar/psi und Grad C/Grad F.',
  nutzen: 'Bei der Inbetriebnahme steht man am Gerät und braucht die Zahl sofort. Läuft auf dem Telefon.',
  grundlage: 'Lineare Skalierung 4 bis 20 mA. Pt100 und Pt1000 nach Callendar-Van-Dusen der IEC 60751, mit A, B und dem C-Term für negative Temperaturen. Zehn Punkte der Normtabelle von -200 bis 850 Grad stimmen auf zwei Stellen. Der Rückweg wird unter null Grad eingeschachtelt, weil es dort keine geschlossene Lösung gibt.',
  grenze: 'Außerhalb des Geltungsbereichs der Norm — -200 bis 850 Grad — rechnet das Werkzeug nicht weiter, sondern nennt die Grenze. Toleranzklassen (AA, A, B) sind nicht hinterlegt.'
},
{
  id: 'instrument_selector', datei: 'Instrument_Selector.html',
  gruppe: 'msr', name: 'Instrumentation Selector',
  kurz: 'Messprinzip zur Aufgabe finden und grob auslegen.',
  lang: 'Medium, Aggregatzustand, Temperatur, Druck, Viskosität und Leitfähigkeit eingeben. Das Werkzeug bewertet die in Frage kommenden Messprinzipien für Durchfluss, Füllstand und Stellventil, sortiert sie und legt das Ausgewählte grob aus - Nennweite für Messgeräte, Kv/Cv für Ventile. Die Messspanne Qmax/Qmin wird angezeigt und ab 100:1 gewarnt.',
  nutzen: 'Die Vorauswahl macht man sonst aus dem Gedächtnis oder mit dem Katalog eines einzelnen Herstellers. Hier steht die Begründung daneben.',
  grundlage: 'Kv = 1,16 Q sqrt(SG/dP), Messgerät ausgelegt auf 2 m/s.',
  grenze: 'Die Messspanne wird gezeigt, geht aber noch nicht in die Rangfolge ein - dafür fehlen belastbare Spannenangaben je Prinzip. Steht auch so im Werkzeug.'
},
{
  id: 'cause_effect', datei: 'Cause_Effect.html',
  gruppe: 'msr', name: 'Cause & Effect Matrix',
  kurz: 'Ursache-Wirkungs-Matrix aufbauen, prüfen und simulieren.',
  lang: 'Ursachen und Wirkungen anlegen, Verknüpfungen setzen, aus Excel importieren und wieder exportieren. Im Simulationsmodus klicken Sie eine Ursache an und sehen, welche Wirkungen auslösen.',
  nutzen: 'Die C&E-Matrix ist das Dokument, über das Betreiber, Planer und Prüfer gemeinsam schauen. Der Simulationsmodus beantwortet die Frage "was passiert, wenn dieser Geber kommt" im Gespräch statt im Nachgang.',
  grundlage: 'X und T als Kennzeichnung, wie in der Praxis üblich.',
  grenze: 'Keine Kaskade: eine Wirkung, die ihrerseits Ursache ist, wird nicht weiterverfolgt. Die Matrix wird nicht gespeichert, ein Neuladen löscht sie - Export nicht vergessen.'
},
{
  id: 'regelventil', datei: 'Regelventil.html',
  gruppe: 'prozess', name: 'Regelventil-Auslegung',
  kurz: 'Kv und Cv für Flüssigkeit, Gas und Dampf, mit Stellcharakteristik.',
  lang: 'Medium wählen, Drücke, Durchfluss, Dichte und Temperatur eingeben. Heraus kommen Kv und Cv, eine Aussage zu Kavitation und Flashing bei Flüssigkeiten und zu kritischer Strömung bei Gas und Dampf, ein Vorschlag für den Kvs aus der Normreihe und die Ventilstellung im Betriebspunkt. Die Kennlinie zeigt linear und gleichprozentig im Vergleich.',
  nutzen: 'Ein zu groß gewähltes Ventil regelt im unteren Hub und schwingt. Die Anzeige der Stellung im Betriebspunkt macht genau diesen Fehler sichtbar, bevor bestellt wird.',
  grundlage: 'IEC 60534: Kv für Flüssigkeiten, Expansionsfaktor Y = 1 - x/(3 F_gamma xT) für Gas und Dampf, Kavitationsgrenze über FL. FL, xT und kappa sind Eingaben aus dem Datenblatt des Ventils, keine festen Annahmen.',
  grenze: 'Das spezifische Volumen für Dampf kommt aus der Dampftafel und muss eingegeben werden — das Werkzeug verlangt es ausdrücklich, statt einen Wert zu erfinden. Die Richtwerte je Ventilbauart sind Tabellenwerte, keine Messung an Ihrem Ventil; das Datenblatt gewinnt.'
},
{
  id: 'druckverlust', datei: 'Druckverlustberechnung.html',
  gruppe: 'prozess', name: 'Hydraulik Calculator',
  kurz: 'Rohrnetz abschnittsweise rechnen, mit Formstücken und Höhe.',
  lang: 'Das Netz in Abschnitte teilen, je Abschnitt Nennweite, Länge, Höhendifferenz und Formstücke eintragen. Je Abschnitt sehen Sie Geschwindigkeit, Reynolds, Strömungsart, Rohrreibungszahl und Verlusthöhe, am Ende die Summe. Eine Warnung meldet, wenn die Geschwindigkeit außerhalb des üblichen Bereichs liegt.',
  nutzen: 'Die abschnittsweise Darstellung zeigt sofort, welcher Teil der Leitung den Druckverlust macht - meist ist es ein kurzes Stück mit zu kleiner Nennweite.',
  grundlage: 'Darcy-Weisbach. Die Rohrreibungszahl wird iterativ nach Colebrook-White gelöst, nicht genähert; laminar 64/Re. Einzelwiderstände über Zeta aus derselben Tabelle wie im Petrochem-Werkzeug.',
  grenze: 'Zwischen Re 2300 und 4000 wird mit der turbulenten Formel gerechnet. Das ist üblich, aber der Übergangsbereich ist von Natur aus unsicher; das Werkzeug sagt es an. Die Rauheitswerte sind Anhaltswerte, keine Messung an Ihrem Rohr — das Feld ist frei beschreibbar.'
},
{
  id: 'petrochem', datei: 'Petrochem_Hydraulic_Analysis.html',
  gruppe: 'prozess', name: 'Petrochem Hydraulic Studio',
  kurz: 'Nennweiten vergleichen: Druckverlust, NPSH und Betriebskosten nebeneinander.',
  lang: 'Ein Durchfluss, eine Leitung, und das Werkzeug rechnet die ganze DN-Reihe von 15 bis 400 durch. Je Nennweite: Geschwindigkeit, Druckverlust, Reynolds, NPSHa, hydraulische Leistung und die Stromkosten im Jahr. Eine Ampel markiert Erosion, zu hohe Geschwindigkeit und Ablagerungsgefahr. Die günstigste brauchbare Nennweite ist hervorgehoben.',
  nutzen: 'Die Nennweite ist ein Abwägen zwischen Investition und Stromkosten über zwanzig Jahre. Diese Tabelle macht aus dem Bauchgefühl eine Zahl, die man ins Angebot schreiben kann.',
  grundlage: 'Churchill-Gleichung für die Rohrreibungszahl. NPSHa aus Saugbehälterdruck, Zulaufhöhe und den Verlusten der Saugleitung - mit eigenen Eingaben für die Saugseite, weil NPSHa nur an ihr hängt.',
  grenze: 'Die Zeta-Werte sind Tabellenwerte, keine Herstellerangaben — wer dessen Unterlagen hat, rechnet genauer. Die Pumpenkennlinie selbst ist nicht hinterlegt; verglichen werden Nennweiten, nicht Pumpen.'
},
{
  id: 'hydrocyclone', datei: 'Hydrocyclone.html',
  gruppe: 'prozess', name: 'Hydrocyclone Pro',
  kurz: 'Hydrozyklon auslegen, mit allen Korrekturen und Kennlinien.',
  lang: 'Aus Zielkorngröße, Feststoffgehalt, Dichten und Druckabfall ergeben sich der theoretische Durchmesser, die Trennkorngröße der gewählten Baugröße, die Geometrie von Einlauf, Vortex und Unterlauf, der Durchsatz je Zyklon und die nötige Anzahl. Sechs Kennlinien zeigen, wie jede Einflussgröße wirkt. Ausgabe als PDF und Excel.',
  nutzen: 'Das ist das Werkzeug mit der größten Tiefe in der Sammlung. Wer Zyklone auslegt, rechnet das sonst in einem gewachsenen Excel, das niemand außer dem Autor versteht.',
  grundlage: 'Arterburn/Krebs: d50 = 2,84 D^0,66 mit den Korrekturen C1 für Feststoffgehalt, C2 für Druckabfall und C3 für die Dichte. Trennkurve nach Lynch-Rao.',
  grenze: 'Außerhalb des Gültigkeitsbereichs der Korrekturen rechnet das Werkzeug nicht weiter, sondern sagt, welche Korrektur aussteigt und warum. C1 gilt nur unter 53 Prozent Feststoff.'
},
{
  id: 'instr_estimator', datei: 'MSR_Instrumentation_Estimator_AI_ExcelAligned_v2.html',
  gruppe: 'kalkulation', name: 'Instrumentation Estimator',
  kurz: 'Kostenschätzung für die Instrumentierung, Position für Position nachvollziehbar.',
  lang: 'Messstellen nach Typ und Anzahl eintragen, Signalklasse und Zubehör wählen. Das Werkzeug baut daraus die Positionsliste mit Material, Montage, Planung, Programmierung, FAT/SAT und Reserve, aufgeteilt nach Gewerk. Jede Position trägt ihren Status - Preis bekannt, Preis unbekannt, Anfrage nötig - und einen Herkunftstext. Ausgabe als Excel im gewohnten Aufbau, dazu ein Anfragetext für Lieferanten.',
  nutzen: 'Eine Schätzung, bei der man sieht, welche Position auf welcher Annahme beruht, hält im Gespräch mit dem Einkauf. Eine Summe ohne Herkunft nicht.',
  grundlage: 'Katalogbasiert mit eigenen Preisen. Planung als Stunden mal Satz oder als Prozentsatz.',
  grenze: 'Die Preise sind Ihre eigenen; der mitgelieferte Katalog ist ein Anfang, kein Marktpreis. Positionen ohne gesicherten Preis bleiben als UNKNOWN sichtbar und gehen in die Anfrage-Mail.'
},
{
  id: 'pump_estimator', datei: 'MSR_Pump_Estimator_AI_ExcelAligned_v2.html',
  gruppe: 'kalkulation', name: 'Pump Estimator',
  kurz: 'Kostenschätzung für Pumpenpakete, vom Motorstarter bis zur Inbetriebnahme.',
  lang: 'Pumpen nach Typ, Leistung und Antriebsart eintragen - Direktstart, Sanftanlauf oder Frequenzumrichter. Das Werkzeug ergänzt Starter, Leistungsschalter, Reparaturschalter, Klemmkasten, Signalschnittstelle und Installationsmaterial, rechnet Kabelmeter und Kanäle und führt Planung, Montage und Inbetriebnahme mit. Auch hier trägt jede Position Status und Herkunft.',
  nutzen: 'Pumpenpakete werden fast immer zu knapp geschätzt, weil die Peripherie vergessen wird. Diese Liste vergisst sie nicht.',
  grundlage: 'Preise als Grundbetrag plus Betrag je kW, aus dem eigenen Katalog.',
  grenze: 'Die Preise sind Ihre eigenen; der mitgelieferte Katalog ist ein Anfang, kein Marktpreis. Eine Summe mit ungesicherten Preisen wird als vorläufig gekennzeichnet, samt Betrag — aber sie bleibt eine Schätzung, kein Angebot.'
},
{
  id: 'bau_rechner', datei: 'Bau_Rechner.html',
  gruppe: 'bau', name: 'Bautechnik Rechner',
  kurz: 'Beton, DIN-Stahlprofile und Bewehrung.',
  lang: 'Betonvolumen und -gewicht für Bodenplatte, Wand, Stütze und Streifenfundament - die Bezeichnung der Maße passt sich dem Bauteil an. Gewicht von HEA-, HEB-, IPE- und UNP-Profilen aus der hinterlegten DIN-Tabelle. Bewehrungsgewicht als Liste, die sich aufaddiert.',
  nutzen: 'Für Fundamente, Konsolen und Bühnen im Anlagenbau, wo der EMSR-Planer die Maße selbst braucht, ohne den Statiker zu fragen.',
  grundlage: 'DIN-Profiltabelle, Bewehrung nach d2/162.',
  grenze: 'Mengen und Gewichte, keine Statik.'
},
{
  id: 'bau_cad', datei: 'Bau_CAD.html',
  gruppe: 'bau', name: 'Master CAD',
  kurz: 'Bauteile räumlich zusammensetzen: Stahlprofile, Beton, Holz - mit DXF.',
  lang: 'Setzt 22 Bauteile als Körper in den Raum: Stahlprofile (IPE, HEA, UNP, L, T, Rohr), Beton (Fundament, Wand, Stütze eckig und rund, Balken, Deckenplatte), Holzbalken und -platte, gekrümmte Wände und Balken, Rampen und Rohrbögen. Maße in Millimetern, Fang auf ein anderes Bauteil, Ausgabe als 3D-DXF.',
  nutzen: 'Für die Skizze, für die das große CAD zu langsam startet.',
  grundlage: 'Zeichnen in Millimetern.',
  grenze: 'Kein Ersatz für ein CAD-System.'
},
{
  id: 'structure_cad', datei: 'Structure_CAD.html',
  gruppe: 'bau', name: 'Structure Generator',
  kurz: 'Stahlbau-Grundgerüst erzeugen: Silo, Halle, Bühne, Rack, Turm.',
  lang: 'Typ wählen, Hauptmaße und Rastermaß eingeben, und das Werkzeug baut das Traggerüst mit Stützen, Riegeln, Verbänden, Geländer und Fundamentpunkten. Ausgabe als 3D-DXF.',
  nutzen: 'Das Grundgerüst für eine Vorplanung oder ein Angebot steht in Minuten statt in einem halben Tag.',
  grundlage: 'Geometrie nach Raster, Profile aus der Auswahl.',
  grenze: 'Erzeugt Geometrie, keine Bemessung. Die Statik bleibt beim Statiker.'
},
{
  id: 'trasse_cad', datei: 'Trasse_CAD.html',
  gruppe: 'trasse', name: 'Trasse CAD Pro',
  kurz: 'Kabeltrassen räumlich führen, mit Formstücken und Stückliste.',
  lang: 'Trassenverlauf im Raum ziehen, Bogen, T-Stücke und Reduzierungen setzen, Abzweige anschließen. Das Werkzeug führt die Stückliste mit und gibt die Trasse als 3D-DXF aus.',
  nutzen: 'Die Trassenführung entscheidet über Kabellängen und damit über einen der größeren Materialposten. Räumlich geplant fällt eher auf, wo es eng wird.',
  grundlage: 'Maßgenau in Millimetern, Formstücke nach Katalogmaße.',
  grenze: 'Keine Belegungs- und Lastprüfung - dafür gibt es die beiden folgenden Werkzeuge.'
},
{
  id: 'visuell_trasse', datei: 'Visueller_Kabeltrassen_CAD.html',
  gruppe: 'trasse', name: 'Visueller Kabeltrassen-Rechner',
  kurz: 'Zeigt im Querschnitt, wie voll die Trasse wirklich wird.',
  lang: 'Kabel aus der Liste wählen, und das Werkzeug legt sie maßstäblich in den Trassenquerschnitt oder in das Rohr. Sie sehen Füllgrad, Gewicht je Meter und ob es passt - als Bild, nicht als Zahl.',
  nutzen: 'Ein Füllgrad von 68 Prozent sagt wenig. Das Bild sagt sofort, ob die dicken Kabel nebeneinander passen oder nicht.',
  grundlage: 'Flächenbelegung und Rohrfüllgrad von 40 Prozent nach DIN/NEC.',
  grenze: 'Zweidimensionaler Querschnitt, keine Lagenbildung über die Länge.'
},
{
  id: 'kabelterasse', datei: 'Kabelterasse_Rechner.html',
  gruppe: 'trasse', name: 'Trassen- und Rohrrechner',
  kurz: 'Aus der Kabelliste die Trassenbreite und die Rohrgröße.',
  lang: 'Kabel mit Anzahl eintragen, Reserve wählen, und heraus kommen die nötige Trassenbreite, die passende Rohrgröße mit 40 Prozent Füllgrad, das Gewicht je Meter gegen die zulässige Last und eine Stückliste mit Kupplungen, Konsolen und Schellen.',
  nutzen: 'Die Stückliste für die Montage entsteht nebenbei aus derselben Eingabe.',
  grundlage: 'Die Trassenbreite hängt an der Verlegeart: einlagig berührend über die Summe der Durchmesser, einlagig mit Abstand über das Doppelte, gebündelt über den Querschnitt bei wählbarem Füllgrad. Innendurchmesser der Rohre nach EN 61386.',
  grenze: 'Die hinterlegten Innendurchmesser gelten für starres PVC-Rohr; bei Wellrohr und Stahlrohr weist das Werkzeug darauf hin, statt eine falsche Größe vorzuschlagen. Die Lastprüfung der Trasse rechnet mit einem Standardwert, nicht mit der Kennlinie Ihres Herstellers.'
},
{
  id: 'photo_cad', datei: 'photo_CAD.html',
  gruppe: 'trasse', name: 'Photo CAD',
  kurz: 'Aus einem Foto der Anlage eine maßstäbliche Zeichnung machen.',
  lang: 'Foto laden, einen bekannten Abstand als Maßstab angeben, nachzeichnen oder automatisch vektorisieren lassen, als DXF ausgeben.',
  nutzen: 'Im Bestand gibt es oft keine brauchbare Zeichnung. Aus einem Foto von der Begehung wird so eine Grundlage, mit der sich weiterarbeiten lässt.',
  grundlage: 'Maßstab über eine bekannte Referenzstrecke.',
  grenze: 'Die Genauigkeit hängt am Foto. Perspektivische Verzerrung wird nicht herausgerechnet.'
},
{
  id: 'brandschutz', datei: 'Brandschutz_Master_Global_Framework.html',
  gruppe: 'sonstiges', name: 'Brandschutz Master',
  kurz: 'Regelwerk und Aufgabenliste Brandschutz, mit Normen-Zuordnung.',
  lang: 'Führt durch die Anforderungen an den anlagentechnischen Brandschutz, ordnet sie den Regelwerken zu - EN 13501, NFPA 13 und 72, nationale Regeln - und erzeugt daraus eine Aufgabenliste mit Status. Projekte lassen sich speichern.',
  nutzen: 'Brandschutz zieht sich durch alle Gewerke und fällt gern zwischen die Stühle. Diese Liste hält fest, was offen ist und worauf es sich stützt.',
  grundlage: 'Zuordnung zu den genannten Regelwerken.',
  grenze: 'Eine Arbeitshilfe, kein Brandschutzkonzept. Das erstellt ein Fachplaner.'
}
];

const GRUPPEN = [
  { id: 'elektro',     name: 'Elektrotechnik',      hinweis: 'Kabel, Lasten, Erdung, Licht, Schaltanlagen' },
  { id: 'msr',         name: 'MSR-Technik',         hinweis: 'Loops, Skalierung, Geräteauswahl, C&E' },
  { id: 'prozess',     name: 'Verfahrenstechnik',   hinweis: 'Ventile, Hydraulik, Trennverfahren' },
  { id: 'kalkulation', name: 'Kalkulation',         hinweis: 'Kostenschätzung mit nachvollziehbaren Positionen' },
  { id: 'trasse',      name: 'Trassen und Kabelwege', hinweis: 'Führung, Belegung, Stückliste' },
  { id: 'bau',         name: 'Bau und Stahlbau',    hinweis: 'Mengen, Profile, Traggerüst' },
  { id: 'sonstiges',   name: 'Übergreifend',       hinweis: 'Regelwerk und Organisation' }
];
