import { CheckCircle2 } from 'lucide-react'

// תחנה בודדת במפת המסלול של חברה — לא Row ברשימה, כרטיס עם תמונה אמיתית, סטטוס
// ו-CTA משלו. שלושה מצבים ויזואליים בלבד: completed / current / future.
// לחברת מועדון אין נעילה — כל תחנה פתוחה ללחיצה (ראו MASTER BRIEF §14-15).
function formatDuration(duration) {
  if (!duration) return null
  const trimmed = String(duration).trim()
  return /^\d+$/.test(trimmed) ? `כ-${trimmed} דקות` : trimmed
}

export default function MemberJourneyStep({ tutorial, totalSteps, status, ctaLabel, align, onSelect }) {
  const isCompleted = status === 'completed'
  const isCurrent = status === 'current'
  const durationLabel = formatDuration(tutorial.duration)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  const statusPill = isCompleted
    ? { text: '✓ הושלם', className: 'bg-[#E8EEE5] text-[#687B63]' }
    : isCurrent
      ? { text: 'את כאן', className: 'bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white' }
      : { text: 'מחכה לך בהמשך', className: 'bg-[#FAF7F2] text-[#9E9188] border border-[#EDE6DC]' }

  return (
    <div className={`relative pr-9 md:pr-0 md:w-[46%] ${align === 'right' ? 'md:ml-auto' : 'md:mr-auto'}`}>
      {/* מסמן על הציר */}
      <div
        className={`absolute z-10 top-6 flex items-center justify-center rounded-full transition-all ${
          isCurrent ? 'w-5 h-5' : 'w-3.5 h-3.5'
        } ${
          align === 'right'
            ? 'right-[3px] md:right-auto md:-left-[47px]'
            : 'right-[3px] md:right-auto md:-right-[47px]'
        } ${
          isCompleted
            ? 'bg-[#687B63]'
            : isCurrent
              ? 'bg-[#C88F96] ring-4 ring-[#C88F96]/25'
              : 'bg-white border-2 border-[#D9CFC2]'
        }`}
      >
        {isCompleted && <CheckCircle2 size={11} className="text-white" strokeWidth={3} />}
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={handleKeyDown}
        aria-current={isCurrent ? 'step' : undefined}
        className={`group flex flex-col md:flex-row items-stretch bg-white rounded-[1.75rem] overflow-hidden cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88F96] focus-visible:ring-offset-2 ${
          isCurrent
            ? 'border-2 border-[#C88F96] shadow-[0_16px_40px_rgba(158,98,108,0.2)]'
            : 'border border-gray-100 shadow-[0_8px_20px_rgba(148,163,136,0.08)] hover:border-[#C88F96]/40 hover:-translate-y-0.5'
        }`}
      >
        <div className="relative w-full aspect-[16/10] md:aspect-auto md:w-[210px] shrink-0 overflow-hidden">
          {tutorial.imageUrl ? (
            <img
              src={tutorial.imageUrl}
              alt={tutorial.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#E8EEE5] to-[#FAF7F2] flex items-center justify-center">
              <span className="text-5xl font-black text-[#C88F96]/25">{tutorial.recommendedOrder}</span>
            </div>
          )}
        </div>

        <div className="flex-1 p-5 md:p-6 flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            {tutorial.recommendedOrder != null && (
              <span className="text-sm font-bold text-[#9E626C]">
                צעד {tutorial.recommendedOrder} מתוך {totalSteps}
              </span>
            )}
            <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${statusPill.className}`}>
              {statusPill.text}
            </span>
          </div>

          <h4 className="text-[20px] md:text-[22px] font-bold text-[#3E3935] leading-snug mb-1.5">
            {tutorial.title}
          </h4>

          {tutorial.description && (
            <p className="text-[15px] text-[#716861] leading-relaxed line-clamp-2 mb-2">
              {tutorial.description}
            </p>
          )}

          {durationLabel && <p className="text-sm text-[#9E9188] mb-3">{durationLabel}</p>}

          <span
            className={`inline-flex w-fit items-center gap-1.5 text-sm font-bold ${
              isCurrent ? 'text-white bg-gradient-to-br from-[#C88F96] to-[#9E626C] px-5 py-2.5 rounded-full shadow-[0_10px_24px_rgba(158,98,108,0.25)]' : 'text-[#9E626C]'
            }`}
          >
            {ctaLabel}
          </span>
        </div>
      </div>
    </div>
  )
}
