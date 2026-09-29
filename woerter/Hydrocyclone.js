// Woerter fuer Hydrocyclone (Zyklonauslegung nach der Excel-Vorlage).
//
// Dieses Werkzeug ist auf Englisch beschriftet; der Schluessel ist
// deshalb der englische Text, so wie er auf der Seite steht.
//
// Nicht enthalten und damit unangetastet: die Formelbloecke, die
// Kennwerte (d50, C1 bis C3, Rr, Ra, Gs, Gl, dw, dp, DN), die Einheiten
// und die Herkunftsangabe der Anpassung (ABA 2025).
//
// Der Pfeil in "Separation Target -> d50,application" wird im Persischen
// zum Wort: von rechts nach links zeigt ein Pfeil nicht mehr dorthin, wo
// er hinzeigen soll.

(function (ziel) {
  ziel.WZ_WOERTER_ERGAENZEN({
      "fa": {
          "Hydrocyclone Calc - Hilfe": "Hydrocyclone Calc - راهنما",
          "This tool mirrors the Excel sizing logic (Vorlage_Hydrozyklone.xlsx): target separation defines a theoretical cyclone size, then the chosen DN is evaluated with the same correction factors and capacity model.": "این ابزار همان منطق اندازه‌گذاری اکسل (Vorlage_Hydrozyklone.xlsx) را دنبال می‌کند: هدف جداسازی یک قطر نظری سیکلون می‌دهد، سپس DN انتخابی با همان ضریب‌های اصلاح و همان مدل ظرفیت ارزیابی می‌شود.",
          "1. Separation Target → d50,application": "1. هدف جداسازی تا d50,application",
          "2. Correction Factors (C1, C2, C3)": "2. ضریب‌های اصلاح (C1، C2، C3)",
          "3. Base Cut & Theoretical Diameter": "3. برش پایه و قطر نظری",
          "4. Chosen DN Performance": "4. عملکرد DN انتخابی",
          "5. Geometry Rules": "5. قواعد هندسی",
          "6. Capacity Model (Vdot/Zyklon)": "6. مدل ظرفیت (دبی هر سیکلون)",
          "Empirical fit from the Excel helper table (ABA 2025):": "برازش تجربی از جدول کمکی اکسل (ABA 2025):",
          "2. Correction Factors": "2. ضریب‌های اصلاح",
          "To obtain the actual application cut point, three correction factors are applied:": "برای رسیدن به نقطه برش واقعی، سه ضریب اصلاح اعمال می‌شود:",
          "C1 (Solid Concentration):": "C1 (غلظت جامد):",
          "Corrections for hindered settling.": "اصلاح برای ته‌نشینی بازدارنده.",
          "// c = Volumetric Solids %": "// c = درصد حجمی جامد",
          "C2 (Pressure Drop):": "C2 (افت فشار):",
          "Impact of pressure energy.": "اثر انرژی فشاری.",
          "// dp = Pressure drop (bar)": "// dp = افت فشار (bar)",
          "C3 (Density Difference):": "C3 (اختلاف چگالی):",
          "Impact of specific gravity.": "اثر وزن مخصوص.",
          "// Gs = Solid Density, Gl = Liquid Density": "// Gs = چگالی جامد، Gl = چگالی مایع",
          "3. Actual Cut Point (d50_app)": "3. نقطه برش واقعی (d50_app)",
          "4. Geometry Rules": "4. قواعد هندسی",
          "Geometric dimensions are derived from the cyclone diameter (D) based on high-efficiency standard ratios:": "ابعاد هندسی از قطر سیکلون (D) و نسبت‌های استاندارد بازده‌بالا به دست می‌آیند:",
          "Inlet Area (Ae):": "سطح ورودی (Ae):",
          "Vortex Finder (l):": "لوله گردابه‌یاب (l):",
          "Cylinder Height (H):": "ارتفاع استوانه (H):",
          "Cone Height (h):": "ارتفاع مخروط (h):",
          "Derived from Cone Angle (θ):": "از زاویه مخروط (θ) به دست می‌آید:",
          "Project Info": "اطلاعات پروژه",
          "Client": "کارفرما",
          "Project No.": "شماره پروژه",
          "Feed Properties (Feed)": "مشخصات خوراک",
          "Flow (V_dot)": "دبی (V_dot)",
          "Solids (c)": "جامد (c)",
          "Density Solid (Gs)": "چگالی جامد (Gs)",
          "Density Fluid (Gl)": "چگالی سیال (Gl)",
          "Pressure drop (ΔP)": "افت فشار (ΔP)",
          "Separation Target": "هدف جداسازی",
          "Particle Size (dw)": "اندازه ذره (dw)",
          "Overflow % passing at dw (Rw)": "درصد عبور از سرریز در dw (Rw)",
          "Recovery Curve (Arterburn)": "منحنی بازیابی (آرتربرن)",
          "Particle diameter to evaluate (d_p)": "قطر ذره برای ارزیابی (d_p)",
          "Liquid split to underflow (Rl)": "سهم مایع به ته‌ریز (Rl)",
          "Geometry Selection": "انتخاب هندسه",
          "Selected Diameter (D_DN)": "قطر انتخابی (D_DN)",
          "Cone Half-Angle (fi)": "نیم‌زاویه مخروط (fi)",
          "Installed Units (optional)": "تعداد نصب‌شده (اختیاری)",
          "auto": "خودکار",
          "GENERATE GERMAN PDF": "ساخت PDF آلمانی",
          "EXPORT EXCEL": "خروجی اکسل",
          "LIVE CALCULATION": "محاسبه زنده",
          "Factor f": "ضریب f",
          "Cut @Target (d50,app)": "برش در هدف (d50,app)",
          "Base Cut (d50,base)": "برش پایه (d50,base)",
          "Theor. Diameter (D_theor)": "قطر نظری (D_theor)",
          "DN Cut (d50,DN,app)": "برش DN (d50,DN,app)",
          "Reduced Recovery Rr (corrected)": "بازیابی کاهش‌یافته Rr (اصلاح‌شده)",
          "Actual Recovery Ra (with bypass)": "بازیابی واقعی Ra (با بای‌پس)",
          "Vdot per Cyclone": "دبی هر سیکلون",
          "Required Units (n)": "تعداد موردنیاز (n)",
          "Total Height (L)": "ارتفاع کل (L)"
      },
      "en": {
          "Hydrocyclone Calc - Hilfe": "Hydrocyclone Calc - help"
      }
  });
})(typeof window !== "undefined" ? window : globalThis);
