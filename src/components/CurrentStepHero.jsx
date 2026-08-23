import { PlayCircle, ChevronLeft, Route } from 'lucide-react'
import StepBadge from './StepBadge'

// "הצעד הבא שלך" — האלמנט הכי מודגש במסך, לפני מפת המסלול. שני מצבים:
// trackFullyCompleted (סיימה את כל 13 הצעדים) או המצב הרגיל (חדשה/ממשיכה/צעד הבא).
// כל הלוגיקה (מי צעד נוכחי, האם ממשיכה, האם ראשונה אי פעם) מחושבת ב-MemberDashboard —
// הקומפוננטה הזו רק מציגה.
export default function CurrentStepHero({
  trackFullyCompleted,
  currentTutorial,
  totalSteps,
  isContinuing,
  isFirstEver,
  onSelectTutorial,
  onGoLibrary,
  firstTrackTutorial,
}) {
  if (trackFullyCompleted) {
    return (
      <section className="mb-10 bg-white rounded-[1.75rem] md:rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-[0_20px_50px_rgba(148,163,136,0.12)] text-center">
        <Route size={34} className="text-[#C88F96] mx-auto mb-4" />
        <h3 className="text-[24px] md:text-[28px] font-bold text-[#3E3935] mb-2">השלמת את מסלול היסוד</h3>
        <p className="text-[17px] text-[#716861] mb-6 max-w-md mx-auto">
          עברת את כל הצעדים.
          <br />
          עכשיו המסלול הזה נשאר שלך — כדי לחזור אליו בכל פעם שתרצי.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onGoLibrary && (
            <button
              onClick={onGoLibrary}
              className="bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-7 py-3 rounded-full font-bold inline-flex items-center gap-2 shadow-[0_12px_28px_rgba(158,98,108,0.25)] hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88F96] focus-visible:ring-offset-2"
            >
              לספריית ההדרכות
              <ChevronLeft size={18} />
            </button>
          )}
          {firstTrackTutorial && (
            <button
              onClick={() => onSelectTutorial(firstTrackTutorial)}
              className="text-[#9E626C] font-bold px-7 py-3 rounded-full hover:bg-[#FAF7F2] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88F96] focus-visible:ring-offset-2"
            >
              לעבור שוב על המסלול
            </button>
          )}
        </div>
      </section>
    )
  }

  if (!currentTutorial) return null

  const label = isContinuing ? 'ממשיכות מהמקום שבו עצרת' : isFirstEver ? 'מכאן מתחילים' : 'הצעד הבא שלך'
  const ctaLabel = isContinuing ? 'ממשיכה לצפות' : isFirstEver ? 'מתחילה את הצעד הראשון' : 'לצעד הבא'

  return (
    <section className="mb-10 bg-white rounded-[1.75rem] md:rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_20px_50px_rgba(148,163,136,0.12)]">
      <div className="flex flex-col md:flex-row">
        <div
          onClick={() => onSelectTutorial(currentTutorial)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelectTutorial(currentTutorial)
            }
          }}
          className="relative w-full md:w-[40%] aspect-video md:aspect-auto md:min-h-[300px] md:max-h-[360px] shrink-0 cursor-pointer group focus-visible:outline-none"
        >
          {currentTutorial.imageUrl ? (
            <img
              src={currentTutorial.imageUrl}
              alt={currentTutorial.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#E8EEE5] to-[#FAF7F2]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          <span className="absolute top-4 right-4 text-sm font-bold text-white bg-black/35 backdrop-blur-sm px-3 py-1 rounded-full">
            {isFirstEver && !isContinuing ? 'הצעד הבא' : 'את כאן'}
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <PlayCircle size={30} className="text-[#3E3935]" />
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-9 text-center md:text-right flex flex-col justify-center">
          <p className="text-sm font-bold text-[#9E626C] mb-3 tracking-wide">{label}</p>
          <StepBadge tutorial={currentTutorial} totalSteps={totalSteps} size="lg" />
          <button
            onClick={() => onSelectTutorial(currentTutorial)}
            className="mt-6 w-full md:w-fit self-center md:self-auto bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-7 py-3.5 rounded-full font-bold inline-flex items-center justify-center gap-2 shadow-[0_12px_28px_rgba(158,98,108,0.25)] hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88F96] focus-visible:ring-offset-2"
          >
            {ctaLabel}
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>
    </section>
  )
}
