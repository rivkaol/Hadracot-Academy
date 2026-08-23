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
