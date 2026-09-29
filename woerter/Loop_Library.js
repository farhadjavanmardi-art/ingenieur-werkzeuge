// Woerter fuer Loop_Library (IEC 62424 Symbolbibliothek).
//
// Dieses Werkzeug ist auf Englisch beschriftet, nicht auf Deutsch - der
// Schluessel ist deshalb der englische Text, so wie er auf der Seite steht.
//
// Nicht enthalten und damit unangetastet: die Kennbuchstaben auf den
// Symbolen (P, T, F, L, M, AI, JB, FCV, SOV). Das sind Kurzzeichen nach
// IEC 62424 und stehen so auch im Schaltplan des Kunden; ein uebersetztes
// Kurzzeichen waere ein falsches Kurzzeichen. Ebenso bleibt die Kopfzeile
// "IEC 62424 DESIGNER" stehen - eine Norm heisst ueberall gleich.

(function (ziel) {
  ziel.WZ_WOERTER_ERGAENZEN({
    fa: {
      "Pressure (PT)": "فشار (PT)",
      "Temperature (TT)": "دما (TT)",
      "Flow (FT)": "دبی (FT)",
      "Level (LT)": "سطح (LT)",
      "Control Valve": "شیر کنترل",
      "Solenoid Valve": "شیر برقی",
      "Motor": "موتور",
      "PLC Card (AI)": "کارت PLC (ورودی آنالوگ)",
      "Junction Box": "جعبه تقسیم",
      "System Ready": "سامانه آماده است",
      "Move": "جابه‌جایی",
      "Wire": "سیم‌کشی",
      "Export DXF": "خروجی DXF",
      "Clear": "پاک کردن"
    },
    en: {}
  });
})(typeof window !== "undefined" ? window : globalThis);
