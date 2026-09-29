// Woerter fuer SLD_CAD (Einliniendiagramm-Generator).
//
// Nicht enthalten und damit unangetastet: "SLD GENERATOR" (Name des
// Werkzeugs), die Netzangabe 400V / 50Hz, die Betriebsmittelkuerzel
// ACB/MCCB, GV2, VFD, CT, VT, OL, die Rollen INCOMER/MOTOR/OUTGOING im
// Diagramm und die Beispiel-Messstellen T1, P-101, F-201, UV-1. Das sind
// Kennzeichnungen nach IEC 81346 und stehen so auch im Plan des Kunden.
//
// Die Beschriftungen tragen ihre englische Entsprechung schon in Klammern
// ("Abgang (Feeder)"). Im Persischen bleibt die Klammer stehen: sie ist
// das, was der Anlagenbauer im Schaltplan wiederfindet.

(function (ziel) {
  ziel.WZ_WOERTER_ERGAENZEN({
    fa: {
      "SLD Generator Anleitung": "راهنمای SLD Generator",
      "Abgänge hinzufügen:": "افزودن فیدر:",
      "Klicken Sie auf \"+ Neuer Abgang\", um einen neuen Stromkreis zur Sammelschiene hinzuzufügen.":
        "برای افزودن یک مدار تازه به شین، روی «+ Neuer Abgang» کلیک کنید.",
      "Konfiguration:": "پیکربندی:",
      "Wählen Sie einen Abgang in der Liste. Definieren Sie unten den Typ (Motor, Einspeisung), die Leistung (kW) und die Komponenten (Sicherung, Schütz, etc.).":
        "یک فیدر را از فهرست انتخاب کنید. سپس در پایین نوع آن (موتور، ورودی)، توان (kW) و تجهیزات (فیوز، کنتاکتور و مانند آن) را تعیین کنید.",
      "Visualisierung:": "نمایش:",
      "Das Einliniendiagramm (Single Line Diagram) wird automatisch aktualisiert. Kabelquerschnitte werden basierend auf der Leistung geschätzt.":
        "نقشه تک‌خطی خودکار به‌روز می‌شود. سطح مقطع کابل بر پایه توان برآورد می‌شود.",
      "Verwenden Sie \"DXF Export\", um den Plan in AutoCAD oder EPLAN importieren zu können.":
        "برای بردن نقشه به AutoCAD یا EPLAN از «DXF Export» استفاده کنید.",
      "BUSBAR (Sammelschiene)": "BUSBAR (شین)",
      "Einspeisung T1": "ورودی T1",
      "Pumpe P-101": "پمپ P-101",
      "Lüfter F-201": "فن F-201",
      "Verteilung UV-1": "تابلو توزیع UV-1",
      "+ Neuer Abgang (Add Feeder)": "+ فیدر جدید (Add Feeder)",
      "Eigenschaften (Properties)": "مشخصات (Properties)",
      "Name (Tag)": "نام (Tag)",
      "Einspeisung (Incomer)": "ورودی (Incomer)",
      "Motor Starter": "راه‌انداز موتور (Motor Starter)",
      "Abgang (Feeder)": "فیدر (Feeder)",
      "Leistung (kW)": "توان (kW)",
      "Scheinleistung (kVA)": "توان ظاهری (kVA)",
      "Wirkungsgrad (%)": "بازده (%)",
      "Ein Trafo ist in kVA angegeben, da geht kein cos phi hinein.":
        "ترانسفورماتور بر پایه kVA داده می‌شود؛ cos phi در آن جایی ندارد.",
      "Nur beim Motor: dort ist die Leistung die Wellenleistung.":
        "فقط برای موتور: آنجا توان، توان محور است.",
      "Strom (A)": "جریان (A)",
      "Komponenten (Mehrfachauswahl mit Strg)": "تجهیزات (انتخاب چندتایی با کلید Strg)",
      "Trenner (Disconnector)": "جداکننده (Disconnector)",
      "Leistungsschalter (ACB/MCCB)": "کلید قدرت (ACB/MCCB)",
      "Motorschutzschalter (GV2)": "کلید حفاظت موتور (GV2)",
      "Sicherung (Fuse)": "فیوز (Fuse)",
      "Schütz (Contactor)": "کنتاکتور (Contactor)",
      "Überlastrelais (OL)": "رله اضافه‌بار (OL)",
      "Softstarter": "راه‌انداز نرم (Softstarter)",
      "Frequenzumrichter (VFD)": "درایو دور متغیر (VFD)",
      "Stromwandler (CT)": "ترانس جریان (CT)",
      "Spannungswandler (VT)": "ترانس ولتاژ (VT)",
      "Update View": "به‌روزرسانی نما"
    },
    en: {
      "SLD Generator Anleitung": "SLD generator instructions",
      "Abgänge hinzufügen:": "Adding feeders:",
      "Klicken Sie auf \"+ Neuer Abgang\", um einen neuen Stromkreis zur Sammelschiene hinzuzufügen.":
        "Click \"+ Neuer Abgang\" to add another circuit to the busbar.",
      "Konfiguration:": "Configuration:",
      "Wählen Sie einen Abgang in der Liste. Definieren Sie unten den Typ (Motor, Einspeisung), die Leistung (kW) und die Komponenten (Sicherung, Schütz, etc.).":
        "Select a feeder from the list, then set its type (motor, incomer), its rating (kW) and its devices (fuse, contactor and so on) below.",
      "Visualisierung:": "Diagram:",
      "Das Einliniendiagramm (Single Line Diagram) wird automatisch aktualisiert. Kabelquerschnitte werden basierend auf der Leistung geschätzt.":
        "The single line diagram updates itself. Cable sizes are estimated from the rating.",
      "Verwenden Sie \"DXF Export\", um den Plan in AutoCAD oder EPLAN importieren zu können.":
        "Use \"DXF Export\" to take the drawing into AutoCAD or EPLAN.",
      "BUSBAR (Sammelschiene)": "BUSBAR",
      "Einspeisung T1": "Incomer T1",
      "Pumpe P-101": "Pump P-101",
      "Lüfter F-201": "Fan F-201",
      "Verteilung UV-1": "Distribution board UV-1",
      "+ Neuer Abgang (Add Feeder)": "+ Add feeder",
      "Eigenschaften (Properties)": "Properties",
      "Name (Tag)": "Name (tag)",
      "Einspeisung (Incomer)": "Incomer",
      "Abgang (Feeder)": "Feeder",
      "Leistung (kW)": "Rating (kW)",
      "Scheinleistung (kVA)": "Apparent power (kVA)",
      "Wirkungsgrad (%)": "Efficiency (%)",
      "Ein Trafo ist in kVA angegeben, da geht kein cos phi hinein.":
        "A transformer is rated in kVA; no cos phi goes into it.",
      "Nur beim Motor: dort ist die Leistung die Wellenleistung.":
        "Only for a motor: there the rating is the shaft power.",
      "Strom (A)": "Current (A)",
      "Komponenten (Mehrfachauswahl mit Strg)": "Devices (multiple selection with Ctrl)",
      "Trenner (Disconnector)": "Disconnector",
      "Leistungsschalter (ACB/MCCB)": "Circuit breaker (ACB/MCCB)",
      "Motorschutzschalter (GV2)": "Motor protection switch (GV2)",
      "Sicherung (Fuse)": "Fuse",
      "Schütz (Contactor)": "Contactor",
      "Überlastrelais (OL)": "Overload relay (OL)",
      "Frequenzumrichter (VFD)": "Variable frequency drive (VFD)",
      "Stromwandler (CT)": "Current transformer (CT)",
      "Spannungswandler (VT)": "Voltage transformer (VT)"
    }
  }, [
      // Die Beschriftung des Leistungsfeldes haengt am Typ des Abgangs. Beim
      // Laden steht die Einspeisung vorn, dort heisst es "Scheinleistung
      // (kVA)"; "Leistung (kW)" erscheint erst, wenn ein Motor oder Abgang
      // gewaehlt wird.
      "Leistung (kW)"
  ]);
})(typeof window !== "undefined" ? window : globalThis);
