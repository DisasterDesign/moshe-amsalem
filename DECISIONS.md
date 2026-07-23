# DECISIONS — moshe-amsalem

## 2026-07-09 — רדיזיין מלא: מעבר מ-שחור+זהב ל-טורקיז+קרם (מקור: McIntyre Legal)

**הקשר:**
הלקוח (עו"ד משה אמסלם) ביקש קו עיצובי חדש, אנושי וחם יותר, במקום העיצוב
הכהה (`#0A0A0A`) + זהב (`#C9A962`) הקיים. לאחר מחקר ודחיית 3 כיוונים שהוצעו,
הלקוח בחר לקחת את **הצבעים מאתר McIntyre Legal** (`mcintyrelegal.com.au`).

**אופציות שנשקלו:**
- 3 כיווני פלטה שהוצעו (זהב-על-שנהב / אבן-וזית / טרקוטה) — נדחו.
- פלטת McIntyre שחולצה מהאתר בפועל (מדידת צבעים נצפים, לא ברירות-מחדל של Astra).

**ההחלטה:**
פלטת טורקיז light-first שחולצה מ-McIntyre:
- `#153243` טורקיז-נייבי עמוק (סקשנים כהים, sidebar, footer, טקסט ראשי) — מחליף את השחור.
- `#27717F` / `#327B87` טורקיז accent (כפתורים, לינקים, אייקונים) — מחליף את הזהב כ-accent ראשי.
- `#FBFAF7` / `#F3F1EA` קרם חם (רקעי light-first).
- `#153243` ink לטקסט על בהיר.
- הזהב `#C9985E` (מהלוגו) **נשמר** כ-accent משני עדין (רצף מותגי — הלוגו נועל את הזהב).
- ירוק וואטסאפ `#25D366` לכפתור הצף ולבועות הצ'אט.
- פונטים: Rubik → **Assistant (גוף) + Heebo (כותרות)**, self-hosted דרך next/font.

**משמעויות (קוד):**
- `tailwind.config.ts` + `globals.css` — tokens חדשים; שמות legacy (`primary`/`dark`/`light`) מופו-מחדש כדי לצבוע קלאסים קיימים אוטומטית, לצד tokens חדשים (`ink`/`cream`/`gold`/`whatsapp`).
- Hero: הוסר מודל ה-Three.js (מאזני צדק) לטובת פורטרט אמיתי (`/moshe-amsalem.jpeg`, זמני עד קבלת תמונה ייעודית). ה-Hero דה-אנימציה (ללא framer-motion) כדי שתוכן above-the-fold יופיע ללא JS.
- קומפוננטות חדשות: `FloatingWhatsApp`, `Process`, `TestimonialsWhatsApp`, `GoogleReviews`, `HomeContact`.
- עמוד הבית שוכתב: Hero → שירותים → תהליך → המלצות וואטסאפ → ביקורות גוגל → CTA → טופס בתחתית.
- עמודי about/services/contact הוסבו לסכמה הבהירה עם באנר-כותרת טורקיז.

**מועמד לחילוץ?** כן — הפלטה light-first + מבנה תדמית עו"ד/יועץ. אם חוזר ב-2 לקוחות נוספים → primitive.

---

## 2026-07-09 — קרוסלת המלצות בסגנון WhatsApp (hover reveal)

**הקשר:** דרישת הלקוח — הוכחה חברתית מתכתובות וואטסאפ אמיתיות של לקוחות, מעוצבת
(לא צילומי מסך גולמיים) אך אותנטית.

**ההחלטה:** `TestimonialsWhatsApp` — בועות צ'אט מרונדרות ב-HTML אמיתי (RTL, header
ירוק `#075E54`, wallpaper `#ECE5DD`, בועה `#DCF8C6`, טיקים כחולים). ברירת-מחדל =
העיצוב; hover (דסקטופ) / tap (מובייל, נגיש, `aria-pressed`) חושף את **צילום המסך המקורי**.

**סטטוס / TODO:**
- התוכן כרגע **placeholder** (3 המלצות דמו). חובה להחליף בצילומים אמיתיים שחולצו
  מהשיחה עם הלקוח, **עם הסכמה מפורשת בכתב + טשטוש PII** (שמות/טלפונים) לפני עלייה לאוויר.
- לשים את הצילומים ב-`/public/testimonials/` ולהגדיר `realSrc` בכל entry.

**מועמד לחילוץ?** כן — pattern ייחודי ורב-ערך.

---

## 2026-07-09 — ביקורות גוגל: ידני עכשיו, Featurable-headless בהמשך

**הקשר:** דרישת הלקוח — הצגת ביקורות גוגל, בעדיפות לשאיבה אוטומטית.

**אופציות שנשקלו:**
- Google Places API רשמי — **נדחה כברירת-מחדל**: חסום ל-~5 ביקורות, בלי sort, SKU יקר,
  וה-ToS אוסר caching של טקסט הביקורות.
- Featurable (תוכנית חינמית, headless) — שאיבת JSON ורינדור בקומפוננטות שלנו.
- ידני-אוצר (JSON committed, רענון רבעוני).

**ההחלטה:** כרגע **ידני** (`GoogleReviews.tsx`, placeholder) עד קבלת ה-Google Business
Profile / Place ID של הלקוח. יעד: Featurable-headless עם attribution תקין (שם מחבר +
קישור לפרופיל). האתר static-export על Cloudflare Pages — כל fetch יעבור דרך Pages Function
(כמו טופס הצור-קשר הקיים).

**סטטוס / TODO:** לקבל Place ID / קישור לפרופיל; לחווט Featurable או לעדכן ידנית.

**מועמד לחילוץ?** כן (שירות חיצוני — Featurable).

---

## 2026-07-23 — ביקורות גוגל חיות דרך Places API (New) + Pages Function (מחליף את ההחלטה הקודמת)

**הקשר:**
הלקוח ביקש חיבור API מתעדכן יומי לדירוג ולביקורות, בקרוסלה בדף הבית, כולל
כפתור לכתיבת ביקורת. ההחלטה הקודמת (ידני / Featurable) מוחלפת.

**אופציות שנשקלו:**
- Featurable headless — עדיין דורש הרשמה לצד-שלישי, ותלות בשירות חינמי.
- Places API (New) דרך Pages Function — first-party, בלי תלות חיצונית.
- שמירה על ידני — נדחה, הלקוח ביקש עדכון אוטומטי.

**ההחלטה:**
`functions/api/reviews.ts` — Cloudflare Pages Function שקוראת ל-Places API (New),
מחזירה JSON מנורמל, ומקאשת **24 שעות** ב-edge cache (`caches.default`).
המפתח נשאר בצד השרת ולא נחשף בדפדפן. `?refresh=1` עוקף קאש.

- Place resolution: `GOOGLE_PLACE_ID` אם קיים, אחרת Text Search לפי `GOOGLE_PLACE_QUERY`.
- סינון: מוצגות רק ביקורות עם דירוג ≥ 4 וטקסט לא ריק ("התגובות הנבחרות").
- `GoogleReviews.tsx` הפך לקרוסלה, מושך מה-API ב-`useEffect`, **ונופל חזרה
  לסנאפשוט מוטמע** (5 ביקורות, יולי 2026) אם ה-API לא זמין — הסקשן לעולם לא ריק.
- כפתור "כתבו ביקורת בגוגל": ה-API מחזיר `writeReviewUrl` מדויק לפי place id;
  ה-fallback משתמש ב-`.../data=!4m3!3m2!1s<FEATURE_ID>!12e1` שפותח את דיאלוג
  כתיבת הביקורת ישירות.

**משמעויות:**
- דורש `GOOGLE_PLACES_API_KEY` ב-Cloudflare Pages (ראה `.env.example`).
- מגבלת Google: **עד 5 ביקורות** מה-API, בלי שליטה על מיון. מעבר לכך נדרש
  צד-שלישי. כרגע ללקוח יש בדיוק 5, אז אין פער.
- SKU: Place Details Enterprise+Atmosphere. עם קאש יומי — ~30-60 קריאות/חודש,
  הרבה מתחת ל-free tier.
- attribution נשמר: שם המחבר, תמונה, קישור לפרופיל וקישור לביקורת.

**מועמד לחילוץ?** כן — primitive `google-reviews` (Pages Function + קרוסלה + fallback).
