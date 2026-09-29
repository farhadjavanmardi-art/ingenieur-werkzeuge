// Woerter fuer MSR_Loop_Check_Skalierung (Analogskalierung, Pt100/Pt1000,
// Einheitenumrechnung).
//
// Nicht enthalten und damit unangetastet: die Kopfzeile "ART ENVI | MSR
// LOOP CHECK" (Name des Werkzeugs), die Fuehlertypen Pt100 und Pt1000, die
// Normnamen IEC 60751 und DIN EN 60751, die Einheiten mA, V, EU, Ohm, bar,
// PSI, Grad C und Grad F sowie die Signalwerte 4 mA und 20 mA.
//
// Eine Stelle ist bewusst nicht woertlich: "Temp -> Widerstand" wird im
// Persischen mit dem Wort "be" (zu) geschrieben statt mit dem Pfeil. Auf
// einer Seite, die von rechts nach links laeuft, zeigt ein Pfeil nicht mehr
// zuverlaessig in die Richtung, in der er gemeint war - und die Richtung
// ist hier genau der Unterschied zwischen den beiden Rechenwegen.

(function (ziel) {
  ziel.WZ_WOERTER_ERGAENZEN({
    fa: {
      "Analogwert-Kalibrierung & Sensorik": "کالیبراسیون مقادیر آنالوگ و حسگرها",
      "Analog-Skalierung (Scaling)": "مقیاس‌بندی آنالوگ",
      "Eingang Min (mA/V)": "ورودی کمینه (mA/V)",
      "Eingang Max (mA/V)": "ورودی بیشینه (mA/V)",
      "Skala Min (EU)": "مقیاس کمینه (EU)",
      "Skala Max (EU)": "مقیاس بیشینه (EU)",
      "Signal Simulation": "شبیه‌سازی سیگنال",
      "Aktueller Wert": "مقدار فعلی",
      "Eingang": "ورودی",
      "Prozent": "درصد",
      "Pt100 / Pt1000 (IEC 60751, -200 bis 850 °C)": "Pt100 / Pt1000 (IEC 60751, -200 تا 850 °C)",
      "Fuehlertyp": "نوع حسگر",
      "Modus": "حالت",
      "Temp (°C) → Widerstand (Ω)": "دما (°C) به مقاومت (Ω)",
      "Widerstand (Ω) → Temp (°C)": "مقاومت (Ω) به دما (°C)",
      "Eingabewert": "مقدار ورودی",
      "ERGEBNIS": "نتیجه",
      "Einheiten-Konverter": "مبدل یکاها",
      "Wert": "مقدار",
      "KONVERTIERT": "تبدیل‌شده",
      "MSR Loop Check - Hilfe": "MSR Loop Check - راهنما",
      "1. Analog-Skalierung:": "1. مقیاس‌بندی آنالوگ:",
      "Dient zur Umrechnung von elektrischen Signalen (z.B. 4-20 mA) in physikalische Prozesswerte (EU). Ideal für die Prüfung von SPS-Eingängen oder Feldgeräten.":
        "برای تبدیل سیگنال الکتریکی (مثلاً 4-20 mA) به مقدار فیزیکی فرایند (EU). مناسب برای آزمون ورودی‌های PLC و ابزارهای میدانی.",
      "Berechnung nach Norm DIN EN 60751 (Callendar-Van Dusen). Wandelt Widerstandswerte präzise in Temperatur um und umgekehrt.":
        "محاسبه بر پایه DIN EN 60751 (کالندار-ون دوزن). مقاومت را دقیق به دما و دما را به مقاومت تبدیل می‌کند.",
      "3. Einheiten:": "3. یکاها:",
      "Schnelle Konvertierung der gängigsten Industriestandards für Druck und Temperatur.":
        "تبدیل سریع رایج‌ترین یکاهای صنعتی فشار و دما.",
      "Hinweis:": "توجه:",
      "Überprüfen Sie bei Loop-Checks immer die Polarität der Messumformer und die Bürde.":
        "در لوپ‌چک همیشه قطبیت ترانسمیترها و بار حلقه (Bürde) را بررسی کنید."
    },
    en: {
      "Analogwert-Kalibrierung & Sensorik": "Analogue calibration and sensors",
      "Analog-Skalierung (Scaling)": "Analogue scaling",
      "Eingang Min (mA/V)": "Input min (mA/V)",
      "Eingang Max (mA/V)": "Input max (mA/V)",
      "Skala Min (EU)": "Scale min (EU)",
      "Skala Max (EU)": "Scale max (EU)",
      "Aktueller Wert": "Present value",
      "Eingang": "Input",
      "Prozent": "Percent",
      "Pt100 / Pt1000 (IEC 60751, -200 bis 850 °C)": "Pt100 / Pt1000 (IEC 60751, -200 to 850 °C)",
      "Fuehlertyp": "Sensor type",
      "Modus": "Mode",
      "Temp (°C) → Widerstand (Ω)": "Temperature (°C) → resistance (Ω)",
      "Widerstand (Ω) → Temp (°C)": "Resistance (Ω) → temperature (°C)",
      "Eingabewert": "Input value",
      "ERGEBNIS": "RESULT",
      "Einheiten-Konverter": "Unit converter",
      "Wert": "Value",
      "KONVERTIERT": "CONVERTED",
      "MSR Loop Check - Hilfe": "MSR Loop Check - Help",
      "1. Analog-Skalierung:": "1. Analogue scaling:",
      "Dient zur Umrechnung von elektrischen Signalen (z.B. 4-20 mA) in physikalische Prozesswerte (EU). Ideal für die Prüfung von SPS-Eingängen oder Feldgeräten.":
        "Converts an electrical signal (4-20 mA, for example) into the physical process value (EU). Made for checking PLC inputs and field devices.",
      "Berechnung nach Norm DIN EN 60751 (Callendar-Van Dusen). Wandelt Widerstandswerte präzise in Temperatur um und umgekehrt.":
        "Calculated to DIN EN 60751 (Callendar-Van Dusen). Converts resistance to temperature and back.",
      "3. Einheiten:": "3. Units:",
      "Schnelle Konvertierung der gängigsten Industriestandards für Druck und Temperatur.":
        "Quick conversion of the usual industrial units for pressure and temperature.",
      "Hinweis:": "Note:",
      "Überprüfen Sie bei Loop-Checks immer die Polarität der Messumformer und die Bürde.":
        "During a loop check, always verify transmitter polarity and the loop burden."
    }
  });
})(typeof window !== "undefined" ? window : globalThis);
