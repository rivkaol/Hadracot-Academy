import { CheckCircle2 } from 'lucide-react'

// תחנה בודדת ברשת המסלול של חברה — לא Row ברשימה, כרטיס אנכי עם תמונה אמיתית, סטטוס
// ו-CTA משלו. שלושה מצבים ויזואליים בלבד: completed / current / future.
// לחברת מועדון אין נעילה — כל תחנה פתוחה ללחיצה (ראו MASTER BRIEF §14-15).
function formatDuration(duration) {
  if (!duration) return null
  const trimmed = String(duration).trim()
  return /^\d+$/.test(trimmed) ? `כ-${trimmed} דקות` : trimmed
}

export default function MemberJourneyStep({ tutorial, totalSteps, status, ctaLabel, onSelect }) {
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
    ? { text: '✓ הושלם', className: 'bg-[#EEF3EF] text-[#1F4A3A]' }
    : isCurrent
      ? { text: 'את כאן', className: 'bg-[#7E3F55] text-white' }
      : { text: 'מחכה לך בהמשך', className: 'bg-[#FFFFFF] text-[#9E9188] border border-[#ECE6E1]' }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      aria-current={isCurrent ? 'step' : undefined}
      className={`group h-full flex flex-col bg-white rounded-[1.5rem] overflow-hidden cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0627A] focus-visible:ring-offset-2 ${
        isCurrent
          ? 'border-2 border-[#A0627A] shadow-[0_16px_40px_rgba(126,63,85,0.2)]'
          : 'border border-gray-100 shadow-[0_8px_20px_rgba(31,74,58,0.08)] hover:border-[#A0627A]/40 hover:-translate-y-0.5'
      }`}
    >
        <div className="relative w-full aspect-[16/10] shrink-0 overflow-hidden">
          {tutorial.imageUrl ? (
            <img
              src={tutorial.imageUrl}
              alt={tutorial.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#EEF3EF] to-[#FFFFFF] flex items-center justify-center">
              <span className="text-5xl font-black text-[#A0627A]/25">{tutorial.recommendedOrder}</span>
            </div>
          )}
          {isCompleted && (
            <span className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-full bg-[#1F4A3A] shadow">
              <CheckCircle2 size={16} className="text-white" strokeWidth={3} />
            </span>
          )}
        </div>

        <div className="flex-1 p-5 flex flex-col min-w-0">
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            {tutorial.recommendedOrder != null && (
              <span className="text-sm font-bold text-[#7E3F55]">
                צעד {tutorial.recommendedOrder} מתוך {totalSteps}
              </span>
            )}
            <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${statusPill.className}`}>
              {statusPill.text}
            </span>
          </div>

          <h4 className="text-[19px] font-bold text-[#2B2724] leading-snug mb-1.5">
            {tutorial.title}
          </h4>

          {tutorial.description && (
            <p className="text-[15px] text-[#6B625C] leading-relaxed line-clamp-2 mb-2">
              {tutorial.description}
            </p>
          )}

          {durationLabel && <p className="text-sm text-[#9E9188] mb-3">{durationLabel}</p>}

          <span
            className={`mt-auto inline-flex w-fit items-center gap-1.5 text-sm font-bold ${
              isCurrent ? 'text-white bg-[#7E3F55] px-5 py-2.5 rounded-full shadow-[0_10px_24px_rgba(126,63,85,0.25)]' : 'text-[#7E3F55]'
            }`}
          >
            {ctaLabel}
          </span>
        </div>
    </div>
  )
}
