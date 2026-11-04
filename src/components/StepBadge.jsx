import { seriesLabelFor } from '../lib/series'

// שם הסדרה + "חלק N מתוך M" + כותרת — נקודה אחת לעריכת שפת המספור בכל האתר.
// הדרכה בסדרה מוצגת לפי הסדרה (ראו src/lib/series.js). הדרכה מחוץ לסדרות אבל
// במסלול הראשי — "צעד N מתוך TOTAL". הדרכת בריאות — שם המדף בלבד.
export default function StepBadge({ tutorial, totalSteps, size = 'base', className = '' }) {
  const series = tutorial ? seriesLabelFor(tutorial.id) : null
  const hasStep = !series && tutorial?.recommendedOrder != null && totalSteps > 0
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
