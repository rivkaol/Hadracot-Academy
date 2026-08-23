// 4 שלבי המסע — קבועים במבנה. תוכן ההדרכות בתוך כל שלב תמיד נגזר מ-tutorialsData
// (groupByStage), לא מכאן. קובץ זה רק את הכותרת/השאלה של כל שלב, כדי שלא תיכתב
// פעמיים במקומות שונים (Hero, JourneyShowcase, TrialWelcomeScreen, MemberAreaPreview).
export const STAGE_META = [
  { n: 1, title: 'להבין', question: 'מה באמת מנהל אותי היום?' },
  { n: 2, title: 'לזהות', question: 'אילו מחשבות, אמונות והרגלים פועלים אצלי אוטומטית?' },
  { n: 3, title: 'לבחור אחרת', question: 'איך מתחילים ליצור תגובה והרגל חדשים?' },
  { n: 4, title: 'להטמיע', question: 'איך שינוי קטן הופך לדרך שנשארת?' },
]
