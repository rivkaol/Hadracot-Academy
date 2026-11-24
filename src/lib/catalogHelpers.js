// עוזרי קטלוג — פונקציות משותפות שקוראות תמיד מאותו מקור נתונים (tutorialsData),
// כדי שלא ייווצרו עותקים נפרדים של אותה הדרכה במקומות שונים באתר.

// כל ההדרכות משוטחות למערך אחד, בסדר recommendedOrder (המסלול הראשי).
export function flattenTutorials(tutorialsData) {
  const all = []
  ;(tutorialsData || []).forEach((cat) => {
    ;(cat.tutorials || []).forEach((t) => all.push(t))
  })
  return all
}

// "כמה חדשה ההדרכה" — לסידור "הכי חדשות" ב"כל ההדרכות".
// לפי מספר הסרטון ב-Vimeo, שעולה תמיד עם זמן ההעלאה (נבדק מול הגיליון 24.11.2026:
// "עוגנים", ההדרכה האחרונה, הכי גבוה). כך הסידור עובד לבד, בלי לתחזק תאריכים בגיליון.
// הדרכה בלי סרטון אמיתי (ברירת המחדל) יורדת לסוף.
const DEFAULT_VIMEO_ID = '76979871'
export function newnessKey(tutorial) {
  const vimeo = String(tutorial?.vimeoId || '').trim()
  return vimeo && vimeo !== DEFAULT_VIMEO_ID ? Number(vimeo) || 0 : 0
}

export function sortNewestFirst(tutorials) {
  return [...(tutorials || [])].sort((a, b) => newnessKey(b) - newnessKey(a))
}

// הדרכות המסלול הראשי (עם recommendedOrder), ממוינות.
export function getTrackTutorials(tutorialsData) {
  return flattenTutorials(tutorialsData)
    .filter((t) => t.recommendedOrder != null)
    .sort((a, b) => a.recommendedOrder - b.recommendedOrder)
}

// קיבוץ הדרכות המסלול ל-4 שלבים (stage 1-4). הדרכות בלי stage מקובצות תחת stage null
// ("טרם שויכו לשלב") כדי שכלום לא ייעלם בשקט אם רבקה לא מילאה את העמודה עדיין.
export function groupByStage(tutorialsData) {
  const track = getTrackTutorials(tutorialsData)
  const stages = {}
  track.forEach((t) => {
    const key = t.stage || 'unassigned'
    if (!stages[key]) stages[key] = []
    stages[key].push(t)
  })
  return stages
}

// ההדרכה הבאה שהצופה הזו יכולה לגשת אליה, לפי סדר אמיתי במסלול —
// לא אריתמטיקת id+1 (ה-id-ים לא רציפים, ורק יחמיר עם VIP/רוכשות).
export function getNextAccessibleTutorial(tutorialsData, currentTutorial, { hasFullAccess, accessibleTutorialIds }) {
  const track = getTrackTutorials(tutorialsData)
  const idx = track.findIndex((t) => t.id === currentTutorial?.id)
  if (idx === -1) return null
  for (let i = idx + 1; i < track.length; i++) {
    const candidate = track[i]
    if (hasFullAccess || (accessibleTutorialIds || []).includes(candidate.id)) return candidate
  }
  return null
}

// הדרכה לפי id, מהמקור היחיד.
export function findTutorialById(tutorialsData, id) {
  return flattenTutorials(tutorialsData).find((t) => t.id === id) || null
}
