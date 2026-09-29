// Die Werkzeugliste: Namen, Kurzbeschreibungen, Gruppen.
//
// Dashboard und Verkaufsseite zeigen dieselbe Liste - dieselben 27 Namen,
// dieselben Kurzbeschreibungen. Sie stehen deshalb hier und nicht zweimal.
// Zwei Kopien heisst, dass eine Karte im Dashboard bald etwas anderes
// verspricht als dieselbe Karte im Verkauf.
//
// In die gemeinsame Schicht (../woerter.js) gehoert das nicht: dort
// stehen Woerter, die in allen Werkzeugen gelten. Diese gelten auf zwei
// Seiten.
//
// Nicht enthalten und damit unangetastet: die Dateinamen (Load.html und
// so fort) - sie sind der Weg zur Datei, kein Text - und die Namen, die
// schon englisch sind. Ein Werkzeug hat einen Namen, keine Uebersetzung.

(function (ziel) {
  ziel.WZ_WOERTER_ERGAENZEN({
      "fa": {
          "Prüfbericht": "گزارش آزمون",
          "Elektrotechnik": "برق",
          "Kabeldimensionierung & Spannungsfall": "طراحی سطح مقطع کابل و افت ولتاژ",
          "Findet den Querschnitt, der Strombelastbarkeit und Spannungsfall gleichzeitig erfüllt.": "سطح مقطعی را پیدا می‌کند که هم‌زمان جریان مجاز و افت ولتاژ را برآورده کند.",
          "Kabelliste je Verbraucher, mit Verschraubung und Trommelbelegung.": "فهرست کابل برای هر مصرف‌کننده، همراه با گلند و چیدمان قرقره.",
          "E-Technik Toolbox": "جعبه‌ابزار برق",
          "Die vier Rechnungen, die man am Tag zwanzigmal braucht.": "همان چهار محاسبه‌ای که روزی بیست بار لازم می‌شود.",
          "Trafo-Auslegung, Motorabgang und elektrische Heizung.": "انتخاب ترانسفورماتور، فیدر موتور و گرمکن الکتریکی.",
          "Erdungsnetz zeichnen und den Erdungswiderstand abschätzen.": "ترسیم شبکه ارت و برآورد مقاومت ارت.",
          "Wie viele Leuchten braucht der Raum, und wie werden sie verteilt.": "فضا چند چراغ می‌خواهد و چراغ‌ها چگونه چیده می‌شوند.",
          "Einpoliges Übersichtsschaltbild aufbauen und als DXF ausgeben.": "ساخت نقشه تک‌خطی و گرفتن خروجی DXF.",
          "Schaltschrank CAD": "CAD تابلو برق",
          "Montageplatte bestücken, als DXF und PDF ausgeben.": "چیدن قطعات روی صفحه نصب و گرفتن خروجی DXF و PDF.",
          "Loop-Blätter für die ganze Messstellenliste auf einmal.": "ساخت برگه لوپ برای کل فهرست تگ‌ها، یکجا.",
          "Einzelne Loop-Schaltbilder frei zeichnen.": "ترسیم آزاد نقشه تک‌تک لوپ‌ها.",
          "Skalierung, Pt100 und Einheiten - das Werkzeug für die Inbetriebnahme.": "مقیاس‌بندی، Pt100 و یکاها - ابزار روزهای راه‌اندازی.",
          "Messprinzip zur Aufgabe finden und grob auslegen.": "یافتن اصل اندازه‌گیری مناسب و اندازه‌گذاری اولیه.",
          "Cause & Effect Matrix": "ماتریس علت و معلول",
          "Ursache-Wirkungs-Matrix aufbauen, prüfen und simulieren.": "ساخت، بررسی و شبیه‌سازی ماتریس علت و معلول.",
          "Regelventil-Auslegung": "طراحی شیر کنترل",
          "Kv und Cv für Flüssigkeit, Gas und Dampf, mit Stellcharakteristik.": "محاسبه Kv و Cv برای مایع، گاز و بخار، همراه با منحنی مشخصه.",
          "Hydraulik Calculator": "محاسبه‌گر هیدرولیک",
          "Rohrnetz abschnittsweise rechnen, mit Formstücken und Höhe.": "محاسبه شبکه لوله بخش به بخش، با اتصالات و اختلاف ارتفاع.",
          "Nennweiten vergleichen: Druckverlust, NPSH und Betriebskosten nebeneinander.": "مقایسه قطرهای اسمی: افت فشار، NPSH و هزینه بهره‌برداری کنار هم.",
          "Hydrozyklon auslegen, mit allen Korrekturen und Kennlinien.": "طراحی هیدروسیکلون با همه ضریب‌های اصلاح و منحنی‌ها.",
          "Kalkulation": "برآورد هزینه",
          "Kostenschätzung für die Instrumentierung, Position für Position nachvollziehbar.": "برآورد هزینه ابزاردقیق، قلم به قلم و قابل ردیابی.",
          "Kostenschätzung für Pumpenpakete, vom Motorstarter bis zur Inbetriebnahme.": "برآورد هزینه بسته پمپ، از راه‌انداز موتور تا راه‌اندازی.",
          "Bautechnik Rechner": "محاسبه‌گر سازه",
          "Beton, DIN-Stahlprofile und Bewehrung.": "بتن، پروفیل فولادی DIN و میلگرد.",
          "Bauteile räumlich zusammensetzen: Stahlprofile, Beton, Holz - mit DXF.": "قطعه‌ها را در فضا کنار هم بگذارید: پروفیل فولادی، بتن، چوب - با خروجی DXF.",
          "Stahlbau-Grundgerüst erzeugen: Silo, Halle, Bühne, Rack, Turm.": "ساخت اسکلت فولادی: سیلو، سالن، سکو، رک، برج.",
          "Kabeltrassen räumlich führen, mit Formstücken und Stückliste.": "مسیریابی فضایی سینی کابل، با قطعات اتصال و فهرست قطعات.",
          "Visueller Kabeltrassen-Rechner": "محاسبه‌گر تصویری سینی کابل",
          "Zeigt im Querschnitt, wie voll die Trasse wirklich wird.": "در نمای مقطع نشان می‌دهد سینی واقعاً چقدر پر می‌شود.",
          "Trassen- und Rohrrechner": "محاسبه‌گر سینی و لوله",
          "Aus der Kabelliste die Trassenbreite und die Rohrgröße.": "از روی فهرست کابل، عرض سینی و اندازه لوله.",
          "Aus einem Foto der Anlage eine maßstäbliche Zeichnung machen.": "از یک عکس تأسیسات، نقشه مقیاس‌دار می‌سازد.",
          "Brandschutz Master": "مستر حفاظت در برابر آتش",
          "Regelwerk und Aufgabenliste Brandschutz, mit Normen-Zuordnung.": "مقررات و فهرست کارهای حفاظت در برابر آتش، با نگاشت استانداردها.",
          "© 2026 Farhad Javanmardi · Karlsruhe": "© 2026 فرهاد جوانمردی · کارلسروهه"
      },
      "en": {
          "Prüfbericht": "Test report",
          "Elektrotechnik": "Electrical",
          "Kabeldimensionierung & Spannungsfall": "Cable sizing & voltage drop",
          "Findet den Querschnitt, der Strombelastbarkeit und Spannungsfall gleichzeitig erfüllt.": "Finds the size that satisfies current capacity and voltage drop at once.",
          "Kabelliste je Verbraucher, mit Verschraubung und Trommelbelegung.": "Cable schedule per load, with glands and drum allocation.",
          "E-Technik Toolbox": "Electrical toolbox",
          "Die vier Rechnungen, die man am Tag zwanzigmal braucht.": "The four calculations you need twenty times a day.",
          "Trafo-Auslegung, Motorabgang und elektrische Heizung.": "Transformer selection, motor feeder and electric heating.",
          "Erdungsnetz zeichnen und den Erdungswiderstand abschätzen.": "Draw the earthing grid and estimate its resistance.",
          "Wie viele Leuchten braucht der Raum, und wie werden sie verteilt.": "How many luminaires the room needs, and how they are laid out.",
          "Einpoliges Übersichtsschaltbild aufbauen und als DXF ausgeben.": "Build a single line diagram and export it as DXF.",
          "Schaltschrank CAD": "Enclosure CAD",
          "Montageplatte bestücken, als DXF und PDF ausgeben.": "Populate the mounting plate, export as DXF and PDF.",
          "Loop-Blätter für die ganze Messstellenliste auf einmal.": "Loop sheets for the whole tag list at once.",
          "Einzelne Loop-Schaltbilder frei zeichnen.": "Draw single loop diagrams freely.",
          "Skalierung, Pt100 und Einheiten - das Werkzeug für die Inbetriebnahme.": "Scaling, Pt100 and units - the tool for commissioning days.",
          "Messprinzip zur Aufgabe finden und grob auslegen.": "Find the measuring principle for the task and size it roughly.",
          "Cause & Effect Matrix": "Cause and effect matrix",
          "Ursache-Wirkungs-Matrix aufbauen, prüfen und simulieren.": "Build, check and simulate a cause and effect matrix.",
          "Regelventil-Auslegung": "Control valve sizing",
          "Kv und Cv für Flüssigkeit, Gas und Dampf, mit Stellcharakteristik.": "Kv and Cv for liquid, gas and steam, with the valve characteristic.",
          "Hydraulik Calculator": "Hydraulics calculator",
          "Rohrnetz abschnittsweise rechnen, mit Formstücken und Höhe.": "Compute the pipe network section by section, with fittings and head.",
          "Nennweiten vergleichen: Druckverlust, NPSH und Betriebskosten nebeneinander.": "Compare nominal sizes: pressure loss, NPSH and running cost side by side.",
          "Hydrozyklon auslegen, mit allen Korrekturen und Kennlinien.": "Size a hydrocyclone with all corrections and curves.",
          "Kalkulation": "Estimating",
          "Kostenschätzung für die Instrumentierung, Position für Position nachvollziehbar.": "Instrumentation cost estimate, traceable item by item.",
          "Kostenschätzung für Pumpenpakete, vom Motorstarter bis zur Inbetriebnahme.": "Pump package cost estimate, from the starter to commissioning.",
          "Bautechnik Rechner": "Civil calculator",
          "Beton, DIN-Stahlprofile und Bewehrung.": "Concrete, DIN steel sections and reinforcement.",
          "Bauteile räumlich zusammensetzen: Stahlprofile, Beton, Holz - mit DXF.": "Assemble building elements in space: steel sections, concrete, timber - with DXF.",
          "Stahlbau-Grundgerüst erzeugen: Silo, Halle, Bühne, Rack, Turm.": "Generate a steel frame: silo, hall, platform, rack, tower.",
          "Kabeltrassen räumlich führen, mit Formstücken und Stückliste.": "Route cable trays in 3D, with fittings and a parts list.",
          "Visueller Kabeltrassen-Rechner": "Visual cable tray calculator",
          "Zeigt im Querschnitt, wie voll die Trasse wirklich wird.": "Shows in cross-section how full the tray really gets.",
          "Trassen- und Rohrrechner": "Tray and conduit calculator",
          "Aus der Kabelliste die Trassenbreite und die Rohrgröße.": "Tray width and conduit size from the cable list.",
          "Aus einem Foto der Anlage eine maßstäbliche Zeichnung machen.": "Turn a photo of the plant into a scaled drawing.",
          "Brandschutz Master": "Fire protection master",
          "Regelwerk und Aufgabenliste Brandschutz, mit Normen-Zuordnung.": "Fire safety codes and task list, mapped to the standards."
      }
  });
})(typeof window !== "undefined" ? window : globalThis);
