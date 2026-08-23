// "צעד N מתוך TOTAL" + כותרת — נקודה אחת לעריכת שפת המספור בכל האתר
// (במקום "שיעור N" בכל מקום בנפרד). אם אין recommendedOrder (הדרכה מחוץ למסלול
// הראשי, כמו הדרכות בריאות/מיוחדות) — מוצגת רק הכותרת, בלי מספור.
export default function StepBadge({ tutorial, totalSteps, size = 'base', className = '' }) {
  const hasStep = tutorial?.recommendedOrder != null && totalSteps > 0
  const sizeClass = size === 'lg' ? 'text-3xl md:text-4xl' : size === 'sm' ? 'text-base' : 'text-xl'

  return (
    <div className={className}>
      {hasStep && (
        <div className="text-xs font-bold text-[#9E626C] mb-1.5 tracking-wide">
          צעד {tutorial.recommendedOrder} מתוך {totalSteps}
        </div>
      )}
      <h3 className={`font-bold text-[#3E3935] leading-tight ${sizeClass}`}>{tutorial?.title}</h3>
    </div>
  )
}
