// Woerter fuer Instrument_Selector (Auswahl von Feldgeraeten).
//
// Nicht enthalten und damit unangetastet: die Werkstoffe SS316L und PTFE,
// die Kennwerte dP, Cv, Kv, DN, die Einheiten und der Name "SELECTOR AI".
// Der Codeblock mit den Formeln bleibt ebenfalls stehen - CODE und PRE
// ruehrt der Uebersetzer nicht an, und das ist hier richtig: wer die
// Formel liest, will die Formel sehen, nicht ihre Uebersetzung.
//
// Eine Stelle ist bewusst nicht woertlich: aus "Yes (>5 µS/cm)" wird im
// Persischen "بله (بیش از 5 µS/cm)". Das Groesserzeichen wird in einer
// Zeile, die von rechts nach links laeuft, gespiegelt - aus ">5" kann
// sichtbar "<5" werden. Bei einer Leitfaehigkeitsgrenze ist das keine
// Schoenheitsfrage: magnetisch-induktiv misst unterhalb davon nicht mehr.

(function (ziel) {
  ziel.WZ_WOERTER_ERGAENZEN({
    fa: {
      "Info & Anleitung": "راهنما و دستورالعمل",
      "Seitenname:": "نام صفحه:",
      "Intelligente Auswahl von Feldgeräten (Durchfluss, Füllstand, Druck, Temperatur, Ventile) basierend auf Prozessbedingungen und Einschränkungen, mit Bewertung und Vorschlag der besten Technologie.":
        "انتخاب هوشمند ابزار میدانی (دبی، سطح، فشار، دما، شیرها) بر پایه شرایط و محدودیت‌های فرایند، همراه با امتیازدهی و پیشنهاد بهترین فناوری.",
      "Wählen Sie den Instrumententyp (Flow / Level / Pressure / Temperature / Control Valve).":
        "نوع ابزار را انتخاب کنید (Flow / Level / Pressure / Temperature / Control Valve).",
      "Geben Sie die Prozessbedingungen ein (Zustand, Temperatur, Druck, Viskosität/Dichte, Schaum/Partikel, etc.).":
        "شرایط فرایند را وارد کنید (حالت سیال، دما، فشار، گرانروی و چگالی، کف و ذرات و مانند آن).",
      ", um die Technologien zu bewerten und die beste Option zu ermitteln.":
        "تا فناوری‌ها امتیاز بگیرند و بهترین گزینه مشخص شود.",
      "Im Modus \"Control Valve\" wird zusätzlich eine Cv/Kv-Berechnung zur Grobauslegung angezeigt.":
        "در حالت \"Control Valve\" یک محاسبه Cv/Kv برای اندازه‌گذاری اولیه هم نشان داده می‌شود.",
      "Formeln / Berechnungslogik (Auszug aus dem Code):": "فرمول‌ها و منطق محاسبه (برگرفته از کد):",
      "Hinweis: Wenn sich Formeln oder Projektstandards ändern, müssen diese Zeilen im JavaScript-Code aktualisiert werden, um gültige Ergebnisse zu gewährleisten.":
        "توجه: اگر فرمول‌ها یا استانداردهای پروژه تغییر کنند، همین خط‌ها در کد JavaScript باید به‌روز شوند تا نتیجه معتبر بماند.",
      "1. Instrument Type": "1. نوع ابزار",
      "Flow (Durchfluss)": "دبی (Flow)",
      "Level (Niveau)": "سطح (Level)",
      "Pressure (Druck)": "فشار (Pressure)",
      "Temperature (Temp)": "دما (Temperature)",
      "Control Valve (Regelventil)": "شیر کنترل (Control Valve)",
      "2. Process Conditions": "2. شرایط فرایند",
      "Fluid State": "حالت سیال",
      "Liquid (Clean)": "مایع (تمیز)",
      "Liquid (Dirty/Slurry)": "مایع (آلوده یا دوغاب)",
      "Gas / Air": "گاز یا هوا",
      "Steam (Dampf)": "بخار (Steam)",
      "Temp. (°C)": "دما (°C)",
      "Pressure (bar)": "فشار (bar)",
      "Flow Min": "دبی کمینه",
      "Flow Max": "دبی بیشینه",
      "Viscosity (cP)": "گرانروی (cP)",
      "Conductive?": "رسانا؟",
      "Yes (>5 µS/cm)": "بله (بیش از 5 µS/cm)",
      "Tank Height (m)": "ارتفاع مخزن (m)",
      "Density (kg/m³)": "چگالی (kg/m³)",
      "Agitator / Foam?": "همزن یا کف؟",
      "Flow (m³/h)": "دبی (m³/h)",
      "AI ANALYSE STARTEN": "آغاز تحلیل هوش مصنوعی",
      "Empfohlene Technologien (Ranked by Suitability)": "فناوری‌های پیشنهادی (به ترتیب تناسب)",
      "Bitte Prozessdaten eingeben und Analyse starten.":
        "داده‌های فرایند را وارد کنید و تحلیل را آغاز کنید.",
      "SPEZIFIKATION (DATASHEET)": "مشخصات فنی (DATASHEET)",
      "Bitte Technologie wählen": "یک فناوری انتخاب کنید",
      "Calculated Sizing": "اندازه‌گذاری محاسبه‌شده",
      "Waiting...": "در انتظار...",
      "Recommended Materials": "مواد پیشنهادی",
      "Body:": "بدنه:",
      "Trim/Sensor:": "تریم یا حسگر:",
      "Seals:": "آب‌بندها:",
      "Warnung": "هشدار",
      "ISA DATASHEET EXPORT": "خروجی دیتاشیت ISA",
      "Auswahl pruefen": "بررسی انتخاب",
      "Beurteilung der Messprinzip-Wahl": "ارزیابی انتخاب اصل اندازه‌گیری",
      "Frage dazu, optional. Zum Beispiel: Medium, Einbaulage, Besonderheiten.":
        "پرسش دلخواه. برای نمونه: سیال، وضعیت نصب، نکات ویژه."
    },
    en: {
      "Info & Anleitung": "Info & instructions",
      "Seitenname:": "Page name:",
      "Intelligente Auswahl von Feldgeräten (Durchfluss, Füllstand, Druck, Temperatur, Ventile) basierend auf Prozessbedingungen und Einschränkungen, mit Bewertung und Vorschlag der besten Technologie.":
        "Picks field devices (flow, level, pressure, temperature, valves) from the process conditions and constraints, scores the candidates and proposes the best technology.",
      "Wählen Sie den Instrumententyp (Flow / Level / Pressure / Temperature / Control Valve).":
        "Choose the instrument type (flow / level / pressure / temperature / control valve).",
      "Geben Sie die Prozessbedingungen ein (Zustand, Temperatur, Druck, Viskosität/Dichte, Schaum/Partikel, etc.).":
        "Enter the process conditions (fluid state, temperature, pressure, viscosity and density, foam and particles, and so on).",
      ", um die Technologien zu bewerten und die beste Option zu ermitteln.":
        "to score the technologies and find the best option.",
      "Im Modus \"Control Valve\" wird zusätzlich eine Cv/Kv-Berechnung zur Grobauslegung angezeigt.":
        "In \"Control Valve\" mode a Cv/Kv calculation for first sizing is shown as well.",
      "Formeln / Berechnungslogik (Auszug aus dem Code):": "Formulas and calculation logic (taken from the code):",
      "Hinweis: Wenn sich Formeln oder Projektstandards ändern, müssen diese Zeilen im JavaScript-Code aktualisiert werden, um gültige Ergebnisse zu gewährleisten.":
        "Note: if the formulas or the project standards change, these lines in the JavaScript have to be updated, otherwise the results no longer hold.",
      "Flow (Durchfluss)": "Flow",
      "Level (Niveau)": "Level",
      "Pressure (Druck)": "Pressure",
      "Temperature (Temp)": "Temperature",
      "Control Valve (Regelventil)": "Control valve",
      "Steam (Dampf)": "Steam",
      "Temp. (°C)": "Temperature (°C)",
      "AI ANALYSE STARTEN": "START AI ANALYSIS",
      "Empfohlene Technologien (Ranked by Suitability)": "Recommended technologies (ranked by suitability)",
      "Bitte Prozessdaten eingeben und Analyse starten.":
        "Enter the process data and start the analysis.",
      "SPEZIFIKATION (DATASHEET)": "SPECIFICATION (DATASHEET)",
      "Bitte Technologie wählen": "Select a technology",
      "Warnung": "Warning",
      "Auswahl pruefen": "Check the selection",
      "Beurteilung der Messprinzip-Wahl": "Assessment of the measuring principle",
      "Frage dazu, optional. Zum Beispiel: Medium, Einbaulage, Besonderheiten.":
        "An optional question. For example: medium, mounting position, anything unusual."
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
