// Woerter fuer Structure_CAD (Stahlbau: Halle, Buehne, Pipe Rack, Silo,
// Turm, Foerderbruecke).
//
// Nicht enthalten und damit unangetastet: "ART ENVI" und "STRUCTURE PRO"
// (Namen), die Profilreihen HEB und IPE (Typenbezeichnungen nach
// DIN 1025), die Formelzeichen L, W, H und die Einheit m. Die englischen
// Zweitbezeichnungen in Klammern - (Hall), (Platform), (Tower) - sind vom
// Werkzeug selbst als zweite Sprache gedacht und bleiben ebenfalls stehen.

(function (ziel) {
  ziel.WZ_WOERTER_ERGAENZEN({
    fa: {
      "Struktur CAD | Anleitung": "استراکچر CAD | دستورالعمل",
      "Struktur-Typ wählen:": "انتخاب نوع سازه:",
      "Halle, Plattform, Pipe Rack, Silo, Bridge oder Tower auswählen.":
        "سالن، سکو، پایپ‌رک، سیلو، پل یا برج را انتخاب کنید.",
      "Dimensionen eingeben (m):": "ورود ابعاد (متر):",
      "Länge (L), Breite (W), Höhe (H) und Raster/Bay einstellen. Änderungen aktualisieren das 3D-Modell.":
        "طول (L)، عرض (W)، ارتفاع (H) و گام شبکه (Bay) را وارد کنید. هر تغییر، مدل سه‌بعدی را به‌روز می‌کند.",
      "Profil & Optionen:": "پروفیل و گزینه‌ها:",
      "HEB/IPE wählen, Verbände und Geländer bei Bedarf aktivieren.":
        "پروفیل HEB یا IPE را انتخاب کنید و در صورت نیاز بادبند و نرده را فعال کنید.",
      "CAD Export:": "خروجی CAD:",
      "„DXF Export (CAD)” nutzen, um das Modell als DXF zu exportieren.":
        "برای گرفتن خروجی DXF از دکمه «DXF Export (CAD)» استفاده کنید.",
      "1. Struktur-Typ": "1. نوع سازه",
      "Halle": "سالن صنعتی",
      "Bühne": "سکو",
      "Pipe Rack": "پایپ‌رک",
      "(Brücke)": "(پل)",
      "Silo-Bau": "سازه سیلو",
      "Turm": "برج",
      "Conveyor": "پل نوار نقاله",
      "2. Dimensionen (m)": "2. ابعاد (متر)",
      "Länge (L) [m]": "طول (L) [m]",
      "Breite (W) [m]": "عرض (W) [m]",
      "Höhe (H) [m]": "ارتفاع (H) [m]",
      "Raster (Bay) [m]": "گام شبکه (Bay) [m]",
      "Profil-Typ": "نوع پروفیل",
      "Stützenbreite [mm]": "عرض ستون [mm]",
      "Stützentiefe [mm]": "عمق ستون [mm]",
      // Meldungen, die erst bei einer falschen Eingabe erscheinen.
      "Bitte Länge, Breite, Höhe und Raster mit Zahlen füllen.":
        "لطفاً طول، عرض، ارتفاع و راستر را با عدد پر کنید.",
      "Alle Maße müssen größer als null sein.": "همه اندازه‌ها باید بزرگ‌تر از صفر باشند.",
      "Zu viele Felder für ein Raster dieser Größe.": "برای راستری با این اندازه، دهانه‌ها بیش از حد زیادند.",
      "Stützenbreite und -tiefe müssen Zahlen größer als null sein.":
        "عرض و عمق ستون باید عددی بزرگ‌تر از صفر باشند.",

      "HEB 200 (schwer)": "HEB 200 (سنگین)",
      "IPE 240 (leicht)": "IPE 240 (سبک)",
      "Verbände": "بادبندها",
      "Geländer": "نرده",
      "3. Export": "3. خروجی",
      "DXF Export (CAD)": "خروجی DXF (CAD)",
      "Erstellt: HALL": "ساخته شد: HALL",
      "Erstellt: PLATFORM": "ساخته شد: PLATFORM",
      "Erstellt: RACK": "ساخته شد: RACK",
      "Erstellt: SILO": "ساخته شد: SILO",
      "Erstellt: BRIDGE": "ساخته شد: BRIDGE",
      "Erstellt: TOWER": "ساخته شد: TOWER"
    },
    en: {
      "Struktur CAD | Anleitung": "Structure CAD | Instructions",
      "Struktur-Typ wählen:": "Select the structure type:",
      "Halle, Plattform, Pipe Rack, Silo, Bridge oder Tower auswählen.":
        "Choose hall, platform, pipe rack, silo, bridge or tower.",
      "Dimensionen eingeben (m):": "Enter the dimensions (m):",
      "Länge (L), Breite (W), Höhe (H) und Raster/Bay einstellen. Änderungen aktualisieren das 3D-Modell.":
        "Set length (L), width (W), height (H) and bay spacing. Every change updates the 3D model.",
      "Profil & Optionen:": "Section & options:",
      "HEB/IPE wählen, Verbände und Geländer bei Bedarf aktivieren.":
        "Pick HEB or IPE and switch on bracing and handrails where needed.",
      "CAD Export:": "CAD export:",
      "„DXF Export (CAD)” nutzen, um das Modell als DXF zu exportieren.":
        "Use \"DXF Export (CAD)\" to write the model out as DXF.",
      "1. Struktur-Typ": "1. Structure type",
      "Halle": "Hall",
      "Bühne": "Platform",
      "(Brücke)": "(Bridge)",
      "Silo-Bau": "Silo structure",
      "Turm": "Tower",
      "2. Dimensionen (m)": "2. Dimensions (m)",
      "Länge (L) [m]": "Length (L) [m]",
      "Breite (W) [m]": "Width (W) [m]",
      "Höhe (H) [m]": "Height (H) [m]",
      "Raster (Bay) [m]": "Bay spacing [m]",
      "Profil-Typ": "Section type",
      "Stützenbreite [mm]": "Column width [mm]",
      "Stützentiefe [mm]": "Column depth [mm]",
      "Bitte Länge, Breite, Höhe und Raster mit Zahlen füllen.":
        "Please fill length, width, height and grid with numbers.",
      "Alle Maße müssen größer als null sein.": "All dimensions must be greater than zero.",
      "Zu viele Felder für ein Raster dieser Größe.": "Too many bays for a grid of that size.",
      "Stützenbreite und -tiefe müssen Zahlen größer als null sein.":
        "Column width and depth must be numbers greater than zero.",

      "HEB 200 (schwer)": "HEB (heavy)",
      "IPE 240 (leicht)": "IPE (light)",
      "Verbände": "Bracing",
      "Geländer": "Handrails",
      "3. Export": "3. Export",
      "Erstellt: HALL": "Built: HALL",
      "Erstellt: PLATFORM": "Built: PLATFORM",
      "Erstellt: RACK": "Built: RACK",
      "Erstellt: SILO": "Built: SILO",
      "Erstellt: BRIDGE": "Built: BRIDGE",
      "Erstellt: TOWER": "Built: TOWER"
    }
  }, [
      "Bitte Länge, Breite, Höhe und Raster mit Zahlen füllen.",
      "Alle Maße müssen größer als null sein.",
      "Zu viele Felder für ein Raster dieser Größe.",
      "Stützenbreite und -tiefe müssen Zahlen größer als null sein.",
    // Die Statuszeile entsteht erst, wenn das Modell gebaut ist.
    "Erstellt: HALL", "Erstellt: PLATFORM", "Erstellt: RACK",
    "Erstellt: SILO", "Erstellt: BRIDGE", "Erstellt: TOWER"
  ]);
})(typeof window !== "undefined" ? window : globalThis);
