// סדרות ההדרכות + מדף הבריאות — מוגדרים כאן בקוד ולא בגיליון (החלטה של רבקה, 4.11.2026).
// בגיליון כל ההדרכות רשומות כ-personal-growth, גם הבריאות, ולכן הקטגוריה משם לא עוזרת לחלוקה.
// סדר ה-ids בכל סדרה = סדר הצפייה. הדרכה חדשה שלא מופיעה כאן לא נעלמת:
// היא נכנסת למדף "עוד הדרכות" עד שמוסיפים אותה לסדרה.
import { flattenTutorials } from './catalogHelpers'

export const SERIES = [
  { id: 'change-within', number: 1, title: 'שינוי שמתחיל מבפנים', ids: [50495, 51777, 53228, 54489, 55235] },
  { id: 'back-to-myself', number: 2, title: 'לחזור לעצמי ולביטחון', ids: [1, 2, 3, 4, 5, 6, 7] },
  { id: 'key-to-heart', number: 3, title: 'מפתח ללב', ids: [8, 9, 10] },
  { id: 'fear-to-bitachon', number: 4, title: 'מפחד לביטחון', ids: [11, 12, 13] },
]

export const HEALTH_SHELF = {
  id: 'health',
  title: 'גוף ובריאות',
  ids: [55376, 56242, 51216, 52271, 53803, 55930],
}

// התמונה על שתי "הדלתות" במסך הבית — לקוחה מתמונת ההדרכה שה-id שלה כאן.
// להחלפת תמונה: לשים כאן id של הדרכה אחרת.
export const DOOR_COVERS = {
  mind: 55235, // לשנות את הקוד שבמוח
  body: 55376, // לב שמח - גוף בריא
}

const OTHER_SHELF ={ id: 'other', title: 'עוד הדרכות' }

function resolve(byId, ids) {
  return ids.map((id) => byId.get(id)).filter(Boolean)
}

// כל המדפים, מוכנים לתצוגה: { series: [...], health, other }.
// כל מדף מחזיק tutorials כאובייקטים מלאים מהקטלוג (ids שלא קיימים בקטלוג מסוננים בשקט).
export function buildShelves(tutorialsData) {
  const all = flattenTutorials(tutorialsData)
  const byId = new Map(all.map((t) => [t.id, t]))
  const placed = new Set([...SERIES.flatMap((s) => s.ids), ...HEALTH_SHELF.ids])

  const series = SERIES.map((s) => ({ ...s, tutorials: resolve(byId, s.ids) })).filter((s) => s.tutorials.length)
  const health = { ...HEALTH_SHELF, tutorials: resolve(byId, HEALTH_SHELF.ids) }
  const other = { ...OTHER_SHELF, tutorials: all.filter((t) => !placed.has(t.id)) }
  return { series, health, other }
}

// תווית קצרה לפי ההגדרה הקבועה בלבד (בלי קטלוג) — לשימוש בתגיות קטנות.
// "סדרה 2 · לחזור לעצמי ולביטחון", "חלק 3 מתוך 7". null אם ההדרכה לא בסדרה ולא במדף הבריאות.
export function seriesLabelFor(tutorialId) {
  const s = SERIES.find((x) => x.ids.includes(tutorialId))
  if (s) {
    return {
      shelfTitle: `סדרה ${s.number} · ${s.title}`,
      partLabel: `חלק ${s.ids.indexOf(tutorialId) + 1} מתוך ${s.ids.length}`,
      isHealth: false,
    }
  }
  if (HEALTH_SHELF.ids.includes(tutorialId)) return { shelfTitle: HEALTH_SHELF.title, partLabel: null, isHealth: true }
  return null
}

// איפה ההדרכה יושבת: { shelf, index, total, isSeries } או null.
export function findShelfOf(tutorialsData, tutorialId) {
  const { series, health, other } = buildShelves(tutorialsData)
  for (const shelf of [...series, health, other]) {
    const index = shelf.tutorials.findIndex((t) => t.id === tutorialId)
    if (index !== -1) return { shelf, index, total: shelf.tutorials.length, isSeries: shelf.number != null }
  }
  return null
}

// החלק הבא באותה סדרה/מדף. בסוף סדרה ממשיכים לחלק הראשון של הסדרה הבאה.
// מחזיר { tutorial, isNewSeries, shelf } או null.
export function getNextInShelf(tutorialsData, tutorialId) {
  const where = findShelfOf(tutorialsData, tutorialId)
  if (!where) return null
  const { shelf, index } = where
  if (index < shelf.tutorials.length - 1) return { tutorial: shelf.tutorials[index + 1], isNewSeries: false, shelf }
  if (!where.isSeries) return null
  const { series } = buildShelves(tutorialsData)
  const nextSeries = series[series.findIndex((s) => s.id === shelf.id) + 1]
  return nextSeries ? { tutorial: nextSeries.tutorials[0], isNewSeries: true, shelf: nextSeries } : null
}
