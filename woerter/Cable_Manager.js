// Woerter fuer Cable_Manager (Kabelliste, Querschnitt, Trommelzuschnitt).
//
// Nicht enthalten und damit unangetastet: die Spannungen 400V/230V/690V,
// die Kennwerte cos phi, eta, kappa, die Beispielkennzeichnungen C-101,
// MCC-01, M-101, der Name des Verfahrens "Bin Packing (Best Fit
// Decreasing)" und der Formelblock - CODE und PRE ruehrt der Uebersetzer
// nicht an.
//
// "Tag" heisst hier die Kabelkennzeichnung, nicht der Kalendertag. Darum
// steht das Wort im Werkzeug und nicht in der gemeinsamen Schicht.

(function (ziel) {
  ziel.WZ_WOERTER_ERGAENZEN({
    fa: {
      "Neues Kabel (Single Entry)": "کابل جدید (تک‌ورودی)",
      "Tag Number (Kabel-Nr.)": "شماره تگ (شماره کابل)",
      "Von (Source)": "از (Source)",
      "Nach (Dest)": "به (Dest)",
      "Wellenleistung (kW)": "توان محور (kW)",
      "Spannung / Phasen": "ولتاژ و فاز",
      "400V (3-Phasen)": "400V (سه‌فاز)",
      "230V (1-Phase)": "230V (تک‌فاز)",
      "690V (Industrie)": "690V (صنعتی)",
      "Verlegeart (Installation)": "روش نصب (Installation)",
      "Verbraucher": "مصرف‌کننده",
      "Motor (Wellenleistung)": "موتور (توان محور)",
      "Allgemeine Last (elektrisch)": "بار عمومی (الکتریکی)",
      "Wirkungsgrad η (%)": "بازده η (%)",
      "Kabeltrasse (Luft) - 100%": "سینی کابل در هوا - 100%",
      "Erdverlegung - 80%": "دفن در خاک - 80%",
      "Schutzrohr - 70%": "لوله محافظ - 70%",
      "Hinzufügen & Berechnen": "افزودن و محاسبه",
      "Massenimport": "ورود انبوه",
      "Paste CSV: Tag,kW,Len...": "CSV را اینجا بچسبانید: Tag,kW,Len...",
      "Bulk Import": "ورود انبوه",
      "Projekt Aktionen": "عملیات پروژه",
      "Trommel-Optimierung (AI)": "بهینه‌سازی قرقره (AI)",
      "Export Schedule": "خروجی فهرست کابل",
      "KABEL-LISTE (SCHEDULE)": "فهرست کابل (SCHEDULE)",
      "TROMMELN (DRUMS)": "قرقره‌ها (DRUMS)",
      "STATISTIK": "آمار",
      "Total Cables:": "تعداد کل کابل‌ها:",
      "Total Copper:": "مس کل:",
      "Tag": "تگ",
      "From / To": "از / به",
      "Load (kW)": "بار (kW)",
      "Length (m)": "طول (m)",
      "Calc. Current": "جریان محاسبه‌شده",
      "Cable Size": "سطح مقطع",
      "Voltage Drop": "افت ولتاژ",
      "Gland": "گلند",
      "Action": "عملیات",
      "Standard Trommellänge:": "طول استاندارد قرقره:",
      "Neu Berechnen": "محاسبه دوباره",
      "Fügen Sie Kabel hinzu und klicken Sie auf \"Optimierung\" um Schnittpläne zu generieren.":
        "کابل‌ها را اضافه کنید و روی «Optimierung» بزنید تا نقشه برش ساخته شود.",
      "Cable Manager AI | Anleitung & Formeln": "Cable Manager AI | دستورالعمل و فرمول‌ها",
      "Dieses Tool dient zum Erstellen von": "این ابزار برای ساختن",
      "Kabelisten (Cable Schedule)": "فهرست کابل (Cable Schedule)",
      ", zur Vorschlagung von": "، پیشنهاد",
      "Kabelquerschnitten": "سطح مقطع کابل",
      "Spannungsfallberechnungen": "محاسبه افت ولتاژ",
      "sowie zur": "و همچنین",
      "Optimierung der Zuschnitte auf Trommeln": "بهینه‌سازی برش روی قرقره است",
      "Geben Sie im Bereich": "در بخش",
      "Neues Kabel": "کابل جدید",
      "die Daten Tag, Von/Nach, kW, Länge, Spannung/Phase und Verlegeart ein.":
        "داده‌های تگ، از و به، kW، طول، ولتاژ و فاز و روش نصب را وارد کنید.",
      ", um Strom, Kabelgröße, Spannungsfall und Verschraubung zu berechnen.":
        "تا جریان، سطح مقطع، افت ولتاژ و گلند محاسبه شود.",
      "Für Massenimport nutzen Sie": "برای ورود انبوه از",
      "(CSV zeilenweise).": "استفاده کنید (CSV سطر به سطر).",
      "Zur Optimierung der Trommelzuschnitte wechseln Sie zum Tab":
        "برای بهینه‌سازی برش قرقره به زبانه",
      "und führen Sie": "بروید و",
      "Trommel-Optimierung": "بهینه‌سازی قرقره",
      "aus.": "را اجرا کنید.",
      "Excel-Export:": "خروجی اکسل:",
      "Formeln und Berechnungslogik (entspricht dem Code dieser Seite):":
        "فرمول‌ها و منطق محاسبه (مطابق کد همین صفحه):",
      "Hinweis: Der Spannungsfall ist hier ein vereinfachtes Modell (ohne vollständige X/R-Werte). Für kritische Projekte bitte Normparameter (IEC/VDE) berücksichtigen.":
        "توجه: افت ولتاژ اینجا مدل ساده‌شده است (بدون مقادیر کامل X/R). برای پروژه‌های حساس پارامترهای استاندارد IEC یا VDE را در نظر بگیرید.",
      "Trommel-Optimierung (AI in dieser Datei):": "بهینه‌سازی قرقره (AI در همین فایل):",
      "Der Algorithmus": "الگوریتم",
      "wird für jeden Kabeltyp separat ausgeführt (unterschiedliche Kabeltypen werden nicht auf derselben Trommel gemischt).":
        "برای هر نوع کابل جداگانه اجرا می‌شود؛ انواع مختلف کابل روی یک قرقره مخلوط نمی‌شوند.",
      "Dashboard Link (fix):": "پیوند ثابت داشبورد:",
      "Falls der Browser bei": "اگر مرورگر در",
      "blockiert, öffnen Sie die Datei lokal und nicht über die Adressleiste per Copy-Paste.":
        "مسدود می‌کند، فایل را به‌صورت محلی باز کنید، نه با چسباندن نشانی در نوار آدرس."
    },
    en: {
      "Neues Kabel (Single Entry)": "New cable (single entry)",
      "Tag Number (Kabel-Nr.)": "Tag number (cable no.)",
      "Von (Source)": "From (source)",
      "Nach (Dest)": "To (destination)",
      "Wellenleistung (kW)": "Shaft power (kW)",
      "Spannung / Phasen": "Voltage / phases",
      "400V (3-Phasen)": "400V (three-phase)",
      "230V (1-Phase)": "230V (single-phase)",
      "690V (Industrie)": "690V (industrial)",
      "Verlegeart (Installation)": "Installation method",
      "Verbraucher": "Load type",
      "Motor (Wellenleistung)": "Motor (shaft power)",
      "Allgemeine Last (elektrisch)": "General load (electrical)",
      "Wirkungsgrad η (%)": "Efficiency η (%)",
      "Kabeltrasse (Luft) - 100%": "Cable tray in air - 100%",
      "Erdverlegung - 80%": "Buried in ground - 80%",
      "Schutzrohr - 70%": "Conduit - 70%",
      "Hinzufügen & Berechnen": "Add & calculate",
      "Massenimport": "Bulk import",
      "Paste CSV: Tag,kW,Len...": "Paste CSV: tag,kW,length...",
      "Projekt Aktionen": "Project actions",
      "Trommel-Optimierung (AI)": "Drum optimisation (AI)",
      "KABEL-LISTE (SCHEDULE)": "CABLE SCHEDULE",
      "TROMMELN (DRUMS)": "DRUMS",
      "STATISTIK": "STATISTICS",
      "Total Cables:": "Total cables:",
      "Standard Trommellänge:": "Standard drum length:",
      "Neu Berechnen": "Recalculate",
      "Fügen Sie Kabel hinzu und klicken Sie auf \"Optimierung\" um Schnittpläne zu generieren.":
        "Add cables and press \"Optimierung\" to generate the cutting plans.",
      "Cable Manager AI | Anleitung & Formeln": "Cable Manager AI | instructions & formulas",
      "Dieses Tool dient zum Erstellen von": "This tool builds",
      "Kabelisten (Cable Schedule)": "cable schedules",
      ", zur Vorschlagung von": ", proposes",
      "Kabelquerschnitten": "cable sizes",
      "Spannungsfallberechnungen": "voltage drop calculations",
      "sowie zur": "and handles the",
      "Optimierung der Zuschnitte auf Trommeln": "optimisation of the cuts on drums",
      "Geben Sie im Bereich": "In the",
      "Neues Kabel": "new cable",
      "die Daten Tag, Von/Nach, kW, Länge, Spannung/Phase und Verlegeart ein.":
        "panel, enter tag, from/to, kW, length, voltage/phases and installation method.",
      ", um Strom, Kabelgröße, Spannungsfall und Verschraubung zu berechnen.":
        "to work out current, cable size, voltage drop and gland.",
      "Für Massenimport nutzen Sie": "For bulk entry use",
      "(CSV zeilenweise).": "(one CSV line per cable).",
      "Zur Optimierung der Trommelzuschnitte wechseln Sie zum Tab":
        "For the drum cutting plan switch to the tab",
      "und führen Sie": "and run",
      "Trommel-Optimierung": "Drum optimisation",
      "aus.": ".",
      "Excel-Export:": "Excel export:",
      "Formeln und Berechnungslogik (entspricht dem Code dieser Seite):":
        "Formulas and calculation logic (as in the code of this page):",
      "Hinweis: Der Spannungsfall ist hier ein vereinfachtes Modell (ohne vollständige X/R-Werte). Für kritische Projekte bitte Normparameter (IEC/VDE) berücksichtigen.":
        "Note: the voltage drop here is a simplified model without full X/R values. For critical projects use the standard parameters from IEC or VDE.",
      "Trommel-Optimierung (AI in dieser Datei):": "Drum optimisation (AI inside this file):",
      "Der Algorithmus": "The",
      "wird für jeden Kabeltyp separat ausgeführt (unterschiedliche Kabeltypen werden nicht auf derselben Trommel gemischt).":
        "algorithm runs separately for each cable type; different types are never mixed on one drum.",
      "Dashboard Link (fix):": "Dashboard link (fixed):",
      "Falls der Browser bei": "If the browser blocks",
      "blockiert, öffnen Sie die Datei lokal und nicht über die Adressleiste per Copy-Paste.":
        ", open the file locally instead of pasting the address into the address bar."
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
