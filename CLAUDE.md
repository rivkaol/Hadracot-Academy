# hadracot-academy — מפת פרויקט

מועדון הדרכות וידאו בעברית. React SPA → פונקציית שרת אחת (`api/hub.js`) → Supabase. תוכן ההדרכות מגיע מ-Google Sheets. אירוח: Vercel.

> תיעוד מלא ומקושר: תיקיית `vault/` (Obsidian). התחל מ-`vault/🗺️ מפת-על.md`.

## מפת קבצים
| קובץ | תפקיד |
|------|--------|
| `src/App.jsx` | מצב מרכזי + ניתוב לפי `view` (home/tutorial/login/register/profile/library/trialWelcome/trialTrackMap/admin). אין ראוטר חיצוני. מחשב `viewerState` (visitor/trial/purchaser/inactive/member/vip) דרך `useViewerState`. |
| `src/hooks/useViewerState.js` | מקור האמת היחיד ל"איזה מצב רואה מי" — ראו `## 4 מצבי משתמשת` למטה. |
| `src/lib/catalogHelpers.js` | `getTrackTutorials`/`groupByStage`/`getNextAccessibleTutorial`/`findTutorialById` — כל מסך שצריך "סדר במסלול" קורא מכאן, לא בונה רשימה משלו. |
| `src/lib/trackEvent.js` | Analytics — עוטף `apiTrackEvent`, נכשל בשקט. |
| `src/pricing.js` | מקור אמת יחיד למחיר/קישור תשלום (חברות + VIP). |
| `src/api.js` | עוטף כל פעולה כ-`POST /api/hub` עם שדה `action`. הדפדפן לא נוגע ב-Supabase. |
| `src/useCatalog.js` | מושך קטלוג הדרכות מ-Google Sheets (`SHEETS_URL`), עם `fallbackTutorialsData`. כולל אזהרת קונסול קבועה על מזהי הדרכה כפולים/חסרים. |
| `src/constants.js` | `SHEETS_URL`, `themeConfig` (צבעי קטגוריות), קטגוריות ברירת מחדל. |
| `src/components/*.jsx` | מסכים: `LandingHome` (בית למבקרת/טעימה), `MemberDashboard` (בית לחברה/VIP/רוכשת), `TutorialsHub` (ארכיון "כל ההדרכות"), `TutorialPage`, `JourneyTimeline`, `StepBadge`, `TrialWelcomeScreen`, `TrialTrackMapScreen`, `OnboardingOverlay`, `LoginScreen`, `LeadCaptureScreen`, `ProfilePage`, `AdminPage`, `SkeletonGallery`. |
| `api/hub.js` | **"השומר"** — הפונקציה היחידה שניגשת ל-Supabase עם `service_role`. מנתב לפי `action`. |
| `migration/*.sql` | הקמת טבלאות: `hadracot_users` (+`is_vip`, `has_seen_onboarding`), `hadracot_notes`, `hadracot_leads`, `hadracot_lead_progress`, `hadracot_member_progress`. |
| `public/join*.html` | דפי טעימה סטטיים בנתיב `/join` — **fallback בלבד** מאז שהמעבר אחרי טעימה עבר to in-app (`TrialTrackMapScreen`). תוכן לא מסונכרן אוטומטית עם הקטלוג — לעדכן ידנית אם מקשרים אליהם. |
| `vercel.json` | `cleanUrls` + rewrite של כל נתיב (מלבד `/api` ו-`/join`) ל-`index.html`. |

## 4 מצבי משתמשת (`useViewerState`)
`visitor` (לא רשומה) → `LandingHome` · `trial` (נרשמה לטעימה) → `LandingHome` (בלי טופס) · `purchaser` (`is_club_member=false` + `purchased_products` לא ריק) → `MemberDashboard` עם מסלול נעול חלקית · `inactive` (מחוברת, בלי גישה בכלל) → מסך חידוש מנוי · `member`/`vip` (`is_club_member` ו/או `is_vip`) → `MemberDashboard` מלא. **חברה מחוברת (member/vip/purchaser/inactive) לעולם לא רואה תוכן מכירתי מחוץ למסך "מנוי לא פעיל".**

## זרימת נתונים
`App.jsx` → `api.js` → `POST /api/hub` → `api/hub.js` (service_role) → Supabase.
קטלוג במקביל: `useCatalog.js` → Google Sheets.

## פעולות השרת (`action` ב-api/hub.js)
- ציבורי: `registerLead`, `logProgress`, `adminLeads` (מוגן `ADMIN_KEY`), `trackEvent`.
- מאומת (email+password): `login`, `lastWatched`, `setCompleted`, `getNote`, `saveNote`, `listNotes`, `markOnboardingSeen`, `logMemberProgress`.

## כללים חשובים
- 🔒 אין גישה ישירה ל-Supabase מהאתר — הכל דרך `api/hub.js`.
- 🔑 סודות (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`, `ADMIN_KEY`) רק ב-Vercel env, לא ב-git. ראה `.env.example`.
- 📧 `normEmail` מנרמל Gmail (בלי נקודות/`+alias`).
- 📦 מזהי הדרכות נשמרים כ-CSV (`csvToIds`/`idsToCsv`).
- 📝 תוכן ההדרכות בגיליון חיצוני — הוספת תוכן בלי deploy.
- ⚠️ קבצים רגישים (אימיילים/סיסמאות אמיתיים): `migration/setup_hadracot_users.sql`, וקובץ ה-`.xlsx` בשורש. לא לחשוף, לא ל-git.
- 🔓 סיסמאות משתמשות בטקסט גלוי — נקודה לשיפור.

## הרשאות
`is_club_member` או `is_vip` → כל ההדרכות · רוכשת → רק `purchased_products` · ליד → טעימה 5 דק'.
⚠️ אין ממשק ניהול ל-VIP — `is_vip=true` לבדו כבר נותן גישה מלאה (`hasFullAccess = isClubMember || isVip`), אבל זה שילוב לא-שגרתי. כשמעניקים VIP ב-SQL יש לסמן **גם** `is_club_member=true` **וגם** `is_vip=true` יחד, כדי לשמור על נתונים עקביים.

## מלכודות נפוצות (edge cases)
- **סיסמאות = מחרוזות מדויקות.** ההשוואה ב-`login` היא `String(user.password) === password` + `password !== ''`. הסיסמאות הן מספרי טלפון — **אפסים מובילים משמעותיים** (`0521...`), אל תמירי ל-Number ואל תחתכי רווחים אחרת.
- **`normEmail` מנרמל רק Gmail/Googlemail.** נקודות ו-`+alias` מוסרים רק שם. אימייל שאינו gmail עם נקודות יישאר כמו שהוא — ודאי שהוא נשמר זהה ב-DB.
- **מזהי הדרכות = CSV, לא מערך.** `purchased_products`/`completed` נשמרים כמחרוזת (`"50495,51216"`). תמיד דרך `csvToIds`/`idsToCsv`; ערכים לא-מספריים מסוננים בשקט.
- **ברירת מחדל של וידאו: `'76979871'`.** אם להדרכה חסר `vimeoId` בגיליון — יוצג סרטון ברירת מחדל של Vimeo, לא שגיאה. חוסר תוכן נראה כמו "עובד".
- **`logProgress` שומר מקסימום, לא מצטבר.** `max_seconds` = הצפייה הארוכה ביותר; `attempts` עולה רק כש-`newAttempt=true`.
- **`adminLeads` נכשל (401) אם `ADMIN_KEY` לא מוגדר** ב-env — לא רק אם המפתח שגוי.
- **אין session/token.** `{email, password}` נשלחים בכל קריאה מאומתת מחדש.
- **rewrites קריטי לניתוב.** נתיב חדש שצריך להישאר סטטי (כמו `/join`) חייב חריגה ב-`vercel.json`, אחרת יוחזר `index.html`.
- **`is_club_member` "דביק" בייבוא.** ב-`on conflict` שבמיגרציה הוא נשמר ב-OR — ייבוא חוזר לא יבטל חברות קיימת.
- **קבצים/תמונות נוספים לשיעור = עמודת "כותרת הקובץ | קישור" בגיליון "ניהול הדרכות".** כל שורה = "כותרת | קישור" (או רק קישור); כמה קבצים לשיעור מפרידים בשורה חדשה או `;`. קישור לתמונה (jpg/png/gif/webp/avif/svg) מוצג בעמוד ההדרכה כתמונה מוטמעת עם alt נגיש (מ-`parseFiles` ב-`useCatalog.js`), לא רק כקישור הורדה. הקוד גם מזהה כל כותרת עמודה שמכילה גם "קובץ" וגם "קישור", כך שגמישות בניסוח הכותרת לא שוברת את הפיצ'ר.
- **מזהי הדרכה בגיליון חייבים להיות ייחודיים ומספריים.** `useCatalog.js` מוציא `console.error` אם הדרכה חסרה `id`/`id` לא מספרי, או אם שתי הדרכות חולקות `id`. אל "תתקן" את זה בקוד — מקור התוכן הוא הגיליון; להוסיף/לתקן שם.
- **`stage` (שלב 1-4 במסלול) נקבע בגיליון**, לא בקוד — עמודה חדשה `שלב`, באותו עיקרון כמו `סדרת התחלה`/`recommendedOrder`.
- **"ההדרכה הבאה" נגזרת מסדר `recommendedOrder`, לא מ-`id+1`.** ה-id-ים לא רציפים (ולעולם לא יהיו, כי חלק מההדרכות לא נמכרות בנפרד). תמיד להשתמש ב-`getNextAccessibleTutorial` מ-`src/lib/catalogHelpers.js`.
- **אין `updateProfile`/ביטול מנוי עצמאי ב-API.** עדכון פרטים וביטול מנוי עדיין קורים דרך WhatsApp — `ProfilePage` רק מפנה לשם, לא בונה טופס.

## פקודות
```
npm run dev      # פיתוח (Vite)
npm run build    # build ל-dist/
npm run lint     # ESLint
```
