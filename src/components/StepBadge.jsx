import { seriesLabelFor } from '../lib/series'

// כותרת ההדרכה + שורה קטנה מעליה: "שם הסדרה · חלק N מתוך M" — נקודה אחת לשפת המספור.
// השורה מוצגת רק במקומות שבהם ההדרכה עומדת לבד (דף ההדרכה, "המשך צפייה").
// ברשימות שכבר יושבות תחת כותרת הסדרה — showLabel={false}, כדי לא לחזור על אותו מידע בכל כרטיס.
export default function StepBadge({ tutorial, totalSteps, size = 'base', showLabel = true, className = '' }) {
  const series = showLabel && tutorial ? seriesLabelFor(tutorial.id) : null
  const hasStep = showLabel && !series && tutorial?.recommendedOrder != null && totalSteps > 0
  const sizeClass = size === 'lg' ? 'text-3xl md:text-4xl' : size === 'sm' ? 'text-lg' : 'text-xl'

  return (
    <div className={className}>
      {series && (
        <div className={`text-base font-bold mb-1.5 ${series.isHealth ? 'text-[#4F6249]' : 'text-[#9E626C]'}`}>
          {series.shelfTitle}
          {series.partLabel && <span className="font-medium"> · {series.partLabel}</span>}
        </div>
      )}
      {hasStep && (
        <div className="text-base font-bold text-[#9E626C] mb-1.5">
          צעד {tutorial.recommendedOrder} מתוך {totalSteps}
        </div>
      )}
      <h3 className={`font-bold text-[#3E3935] leading-tight ${sizeClass}`}>{tutorial?.title}</h3>
    </div>
  )
}
