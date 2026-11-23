import { seriesLabelFor } from '../lib/series'

// כותרת ההדרכה + שורה קטנה מעליה: "שם הסדרה · חלק N מתוך M" — נקודה אחת לשפת המספור.
// השורה מוצגת רק במקומות שבהם ההדרכה עומדת לבד (דף ההדרכה, "המשך צפייה").
// ברשימות שכבר יושבות תחת כותרת הסדרה — showLabel={false}, כדי לא לחזור על אותו מידע בכל כרטיס.
// tone="dark" — על רקע שזיף עמוק (כרטיס "הצעד הבא שלך"): שורת הסדרה בוורוד-שזיף בהיר, הכותרת בלבן.
export default function StepBadge({ tutorial, totalSteps, size = 'base', showLabel = true, className = '', tone = 'light' }) {
  const series = showLabel && tutorial ? seriesLabelFor(tutorial.id) : null
  const hasStep = showLabel && !series && tutorial?.recommendedOrder != null && totalSteps > 0
  const sizeClass = size === 'lg' ? 'text-3xl md:text-4xl' : size === 'sm' ? 'text-lg' : 'text-xl'
  const dark = tone === 'dark'
  const labelColor = dark ? 'text-[#E9D3DB]' : series?.isHealth ? 'text-[#173A2D]' : 'text-[#7E3F55]'

  return (
    <div className={className}>
      {series && (
        <div className={`text-base font-bold mb-1.5 ${labelColor}`}>
          {series.shelfTitle}
          {series.partLabel && <span className="font-medium"> · {series.partLabel}</span>}
        </div>
      )}
      {hasStep && (
        <div className={`text-base font-bold mb-1.5 ${dark ? 'text-[#E9D3DB]' : 'text-[#7E3F55]'}`}>
          צעד {tutorial.recommendedOrder} מתוך {totalSteps}
        </div>
      )}
      <h3 className={`font-bold leading-tight ${dark ? 'text-white' : 'text-[#1F4A3A]'} ${sizeClass}`}>{tutorial?.title}</h3>
    </div>
  )
}
