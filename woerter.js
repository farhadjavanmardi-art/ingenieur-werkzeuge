// Woerterbuch Deutsch -> Persisch / Englisch.
//
// Der Schluessel ist der deutsche Text, genau wie er im Werkzeug steht. Was
// hier fehlt, bleibt auf der Seite Deutsch - das ist Absicht, siehe
// uebersetzung.js.
//
// ABSICHTLICH NICHT ENTHALTEN:
//   - Normnamen (IEC 60751, DIN VDE 0100-430) - die heissen ueberall gleich.
//   - Einheiten und Formelzeichen (mm2, bar, cos phi, L, A, T).
//   - Produktbezeichnungen (NYM-J 3x1.5, HEA 100) - das sind Typennamen.
//   - "Tag". Das Wort steht in drei Werkzeugen, aber nie als Kalendertag:
//     es ist die Messstellenkennzeichnung (TAG) nach IEC 81346. Ein Wort,
//     das je nach Werkzeug etwas anderes heisst, gehoert nicht hierher.
//   - "OK" und "Standard". "OK" ist mal ein Knopf, mal ein Zustand;
//     "Standard" mal die Voreinstellung, mal die Norm. Beide bekommen ihre
//     Uebersetzung dort, wo klar ist, was gemeint ist.
//
// Bei den Armaturen ist die Unterscheidung keine Feinheit: zwischen
// Rueckschlagklappe und Rueckschlagventil liegt in diesem Projekt der
// Faktor 65 im Widerstandsbeiwert. Wer sie in der Uebersetzung verwechselt,
// legt die Pumpe falsch aus.

(function (ziel) {
  ziel.WZ_WOERTER = {
    fa: {
          "Zurück zum Dashboard": "بازگشت به داشبورد",
          "Zurück zum KI-Engineering Dashboard": "بازگشت به داشبورد مهندسی",
          "Zurück zum KI-Engineering-Dashboard": "بازگشت به داشبورد مهندسی",
          "Back to Dashboard": "بازگشت به داشبورد",
          "Dashboard": "داشبورد",
          "Home": "خانه",
          "Info": "راهنما",
          "Anleitung": "دستورالعمل",
          "Hilfe & Anleitung": "راهنما و دستورالعمل",
          "Info / Anleitung": "راهنما / دستورالعمل",
          "Info & Formeln": "راهنما و فرمول‌ها",
          "Info: Zweck, Nutzung & Formeln": "راهنما: هدف، کاربرد و فرمول‌ها",
          "Info / Formulas": "راهنما / فرمول‌ها",
          "Schliessen": "بستن",
          "Schließen": "بستن",
          "Close": "بستن",
          "Zweck": "هدف",
          "Zweck:": "هدف:",
          "Zweck dieser Seite": "هدف این صفحه",
          "Nutzung": "کاربرد",
          "Nutzung:": "کاربرد:",
          "Verwendung": "کاربرد",
          "Verwendung:": "کاربرد:",
          "Anwendung dieser Seite": "کاربرد این صفحه",
          "Anwendung dieser Seite:": "کاربرد این صفحه:",
          "Berechnungsgrundlagen": "مبانی محاسبه",
          "Beschreibung": "شرح",
          "Berechnen": "محاسبه",
          "Hinzufügen": "افزودن",
          "Löschen": "حذف",
          "Reset": "بازنشانی",
          "Export": "خروجی",
          "Excel Export": "خروجی اکسل",
          "DXF Export": "خروجی DXF",
          "Anzahl": "تعداد",
          "Anz.": "تعداد",
          "Menge": "مقدار",
          "Einheit": "واحد",
          "Material": "جنس",
          "Status": "وضعیت",
          "Status:": "وضعیت:",
          "Gesamtgewicht": "وزن کل",
          "und": "و",
          "oder": "یا",
          "Ergebnis einordnen": "ارزیابی نتیجه",
          "Einordnung des Ergebnisses": "ارزیابی نتیجه",
          "Fragen": "پرسیدن",
          "Spannungsfall": "افت ولتاژ",
          "Nennstrom (In)": "جریان نامی (In)",
          "Scheinleistung (S)": "توان ظاهری (S)",
          "Leitermaterial": "جنس هادی",
          "Leitertemperatur": "دمای هادی",
          "Kompensation (PFC)": "اصلاح ضریب توان",
          "Leistungsfaktor (cos φ)": "ضریب توان (cos φ)",
          "70 °C - PVC im Betrieb": "۷۰ °C ـ PVC در بهره‌برداری",
          "90 °C - XLPE / EPR im Betrieb": "۹۰ °C ـ XLPE / EPR در بهره‌برداری",
          "20 °C - Tabellenwert, kalt": "۲۰ °C ـ مقدار جدول، سرد",
          "Absperrschieber": "شیر کشویی",
          "Kugelhahn": "شیر توپی",
          "Rückschlagklappe": "دریچه‌ی یک‌طرفه",
          "Rückschlagventil": "شیر یک‌طرفه",
          "T-Stück (Abzweig)": "سه‌راهی (انشعاب)",
          "Bogen 90°": "زانوی ۹۰°",
          "Dichte (kg/m³)": "چگالی (kg/m³)",
          "Turbulent": "آشفته",
          "Laminar": "آرام",
          "Übergang": "گذار",
          "Wand": "دیوار",
          "Würfel": "مکعب",
          "Kugel": "کره",
          "Zylinder": "استوانه",
          "Kegel": "مخروط",
          "Eingabe fehlt": "ورودی ناقص است",
          "Werte pruefen": "مقادیر را بررسی کنید",
          "Die Zahlen kommen aus der Formel im Werkzeug. Das Modell ordnet sie nur ein.":
            "اعداد از فرمول همین ابزار می‌آیند. مدل فقط آنها را تفسیر می‌کند.",
          "Länge (m)": "طول (m)",
          "Typ": "نوع",
          "Kategorie": "دسته",
          "Category": "دسته",
          "Copy": "رونوشت",
          "Select": "انتخاب",
          "None": "هیچ‌کدام",
          "Yes": "بله",
          "No": "خیر",
          "Delete Selected": "حذف موارد انتخاب‌شده",
          "Saved locally in this browser (LocalStorage).":
            "به‌صورت محلی در همین مرورگر ذخیره می‌شود (LocalStorage).",
          "Frage dazu, optional. Zum Beispiel: welche Stellschraube zuerst?":
            "پرسش دلخواه. برای نمونه: اول کدام پارامتر را تغییر دهم؟",
          "KI Engineering Topbar": "نوار بالای مهندسی هوش مصنوعی",
          "Klicken Sie auf": "کلیک کنید روی"
    },
    en: {
          "Zurück zum Dashboard": "Back to Dashboard",
          "Zurück zum KI-Engineering Dashboard": "Back to Engineering Dashboard",
          "Zurück zum KI-Engineering-Dashboard": "Back to Engineering Dashboard",
          "Back to Dashboard": "Back to Dashboard",
          "Dashboard": "Dashboard",
          "Home": "Home",
          "Info": "Info",
          "Anleitung": "Instructions",
          "Hilfe & Anleitung": "Help & instructions",
          "Info / Anleitung": "Info / instructions",
          "Info & Formeln": "Info & formulas",
          "Info: Zweck, Nutzung & Formeln": "Info: purpose, usage & formulas",
          "Info / Formulas": "Info / formulas",
          "Schliessen": "Close",
          "Schließen": "Close",
          "Close": "Close",
          "Zweck": "Purpose",
          "Zweck:": "Purpose:",
          "Zweck dieser Seite": "Purpose of this page",
          "Nutzung": "Usage",
          "Nutzung:": "Usage:",
          "Verwendung": "Usage",
          "Verwendung:": "Usage:",
          "Anwendung dieser Seite": "How to use this page",
          "Anwendung dieser Seite:": "How to use this page:",
          "Berechnungsgrundlagen": "Calculation basis",
          "Beschreibung": "Description",
          "Berechnen": "Calculate",
          "Hinzufügen": "Add",
          "Löschen": "Delete",
          "Reset": "Reset",
          "Export": "Export",
          "Excel Export": "Excel export",
          "DXF Export": "DXF export",
          "Anzahl": "Quantity",
          "Anz.": "Qty",
          "Menge": "Quantity",
          "Einheit": "Unit",
          "Material": "Material",
          "Status": "Status",
          "Status:": "Status:",
          "Gesamtgewicht": "Total weight",
          "und": "and",
          "oder": "or",
          "Ergebnis einordnen": "Interpret result",
          "Einordnung des Ergebnisses": "Result interpretation",
          "Fragen": "Ask",
          "Spannungsfall": "Voltage drop",
          "Nennstrom (In)": "Rated current (In)",
          "Scheinleistung (S)": "Apparent power (S)",
          "Leitermaterial": "Conductor material",
          "Leitertemperatur": "Conductor temperature",
          "Kompensation (PFC)": "Power factor correction",
          "Leistungsfaktor (cos φ)": "Power factor (cos φ)",
          "70 °C - PVC im Betrieb": "70 °C - PVC in service",
          "90 °C - XLPE / EPR im Betrieb": "90 °C - XLPE / EPR in service",
          "20 °C - Tabellenwert, kalt": "20 °C - table value, cold",
          "Absperrschieber": "Gate valve",
          "Kugelhahn": "Ball valve",
          "Rückschlagklappe": "Swing check valve",
          "Rückschlagventil": "Lift check valve",
          "T-Stück (Abzweig)": "Tee (branch)",
          "Bogen 90°": "Elbow 90°",
          "Dichte (kg/m³)": "Density (kg/m³)",
          "Turbulent": "Turbulent",
          "Laminar": "Laminar",
          "Übergang": "Transition",
          "Wand": "Wall",
          "Würfel": "Cube",
          "Kugel": "Sphere",
          "Zylinder": "Cylinder",
          "Kegel": "Cone",
          "Eingabe fehlt": "Input missing",
          "Werte pruefen": "Check the values",
          "Die Zahlen kommen aus der Formel im Werkzeug. Das Modell ordnet sie nur ein.":
            "The numbers come from the formula in the tool. The model only puts them in context.",
          "Länge (m)": "Length (m)",
          "Typ": "Type",
          "Kategorie": "Category",
          "Frage dazu, optional. Zum Beispiel: welche Stellschraube zuerst?":
            "An optional question. For example: which screw do I turn first?",
          "KI Engineering Topbar": "AI engineering top bar",
          "Klicken Sie auf": "Click"
    }
  };

  // Jedes Werkzeug bringt sein eigenes Woerterbuch mit: woerter/<Name>.js
  // haengt sich hier ein. Der Grund ist nicht Ordnungsliebe - stuende alles
  // in dieser Datei, laedt jedes Werkzeug die Woerter der 26 anderen mit.
  //
  // Die gemeinsame Schicht gewinnt. Ein Werkzeug darf ergaenzen, aber keinen
  // Begriff umdeuten, der ueberall gilt: sonst hiesse dasselbe Wort je nach
  // Seite etwas anderes, und niemand koennte sagen, welche Seite recht hat.
  // Wo ein Begriff im Werkzeug wirklich etwas anderes bedeutet, gehoert er
  // aus der gemeinsamen Schicht heraus. Eine Pruefung nennt jede Dopplung.
  ziel.WZ_WOERTER_DOPPELT = [];
  ziel.WZ_WOERTER_EIGEN = [];
  ziel.WZ_WOERTER_DYNAMISCH = [];

  // erstBeimRechnen: Schluessel, die beim Laden noch nicht auf der Seite
  // stehen, weil das Werkzeug sie erst beim Rechnen schreibt. Sie muessen
  // genannt werden, damit die Pruefung einen Tippfehler im Schluessel von
  // einer Meldung unterscheiden kann, die es erst spaeter gibt. Ein
  // Schluessel mit Tippfehler uebersetzt nichts und faellt sonst niemandem
  // auf - er sieht aus wie ein Wort, das eben noch deutsch ist.
  ziel.WZ_WOERTER_ERGAENZEN = function (zusatz, erstBeimRechnen) {
    for (const sprache in zusatz) {
      const buch = ziel.WZ_WOERTER[sprache] || (ziel.WZ_WOERTER[sprache] = {});
      for (const schluessel in zusatz[sprache]) {
        if (ziel.WZ_WOERTER_EIGEN.indexOf(schluessel) < 0) ziel.WZ_WOERTER_EIGEN.push(schluessel);
        if (buch[schluessel] !== undefined) { ziel.WZ_WOERTER_DOPPELT.push(sprache + ": " + schluessel); continue; }
        buch[schluessel] = zusatz[sprache][schluessel];
      }
    }
    if (erstBeimRechnen) ziel.WZ_WOERTER_DYNAMISCH = ziel.WZ_WOERTER_DYNAMISCH.concat(erstBeimRechnen);
  };
})(typeof window !== "undefined" ? window : globalThis);
