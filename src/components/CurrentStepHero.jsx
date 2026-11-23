import { PlayCircle, ChevronLeft, Route } from 'lucide-react'
import StepBadge from './StepBadge'

// "הצעד הבא שלך" — האלמנט הכי מודגש במסך, לפני מפת המסלול. שני מצבים:
// trackFullyCompleted (סיימה את כל הצעדים) או המצב הרגיל (חדשה/ממשיכה/צעד הבא).
// כל הלוגיקה (מי צעד נוכחי, האם ממשיכה, האם ראשונה אי פעם) מחושבת ב-MemberDashboard —
// הקומפוננטה הזו רק מציגה.
// עיצוב "הלב": כרטיס שזיף עמוק גדול, כפתור בהיר, קו זהב דק. זה הדבר הראשון שהעין תופסת במסך הבית.
const CARD = 'mb-10 bg-[#6A3447] text-[#F8F3EC] rounded-[1.75rem] md:rounded-[2rem] overflow-hidden shadow-[0_24px_50px_rgba(106,52,71,0.28)]'
const LIGHT_BTN =
  'bg-[#F8F3EC] text-[#6A3447] px-7 py-3.5 rounded-full font-bold inline-flex items-center justify-center gap-2 shadow-[0_4px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-transform focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D9BD86]'

function Kicker({ children }) {
  return (
    <p className="inline-flex items-center gap-3 text-[16px] font-medium text-[#E9D3DB] mb-3">
      <span aria-hidden="true" className="w-8 h-px bg-[#D9BD86]" />
      {children}
    </p>
  )
}

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
      <section className={`${CARD} p-8 md:p-10 text-center`}>
        <Route size={34} className="text-[#D9BD86] mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-[26px] md:text-[30px] font-bold text-white mb-2">השלמת את מסלול היסוד</h3>
        <p className="text-[18px] text-[#F8F3EC]/85 mb-6 max-w-md mx-auto leading-relaxed">
          עברת את כל הצעדים.
          <br />
          עכשיו המסלול הזה נשאר שלך, כדי לחזור אליו בכל פעם שתרצי.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onGoLibrary && (
            <button onClick={onGoLibrary} className={LIGHT_BTN}>
              לספריית ההדרכות
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
          )}
          {firstTrackTutorial && (
            <button
              onClick={() => onSelectTutorial(firstTrackTutorial)}
              className="text-[#E9D3DB] font-bold px-7 py-3 rounded-full hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D9BD86]"
            >
              לעבור שוב על המסלול
            </button>
          )}
        </div>
      </section>
    )
  }

  if (!currentTutorial) return null

  const ctaLabel = isContinuing ? 'ממשיכה לצפות' : isFirstEver ? 'מתחילה את הצעד הראשון' : 'לצעד הבא'
  const kicker = isContinuing ? 'ממשיכות מאיפה שעצרת' : 'הצעד הבא שלך'

  return (
    <section className={CARD}>
      <div className="flex flex-col md:flex-row">
        <div
          onClick={() => onSelectTutorial(currentTutorial)}
          role="button"
          tabIndex={0}
          aria-label={`לצפייה: ${currentTutorial.title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelectTutorial(currentTutorial)
            }
          }}
          className="relative w-full md:w-[42%] aspect-video md:aspect-auto md:min-h-[320px] shrink-0 cursor-pointer group focus-visible:outline-none md:order-2"
        >
          {currentTutorial.imageUrl ? (
            <img src={currentTutorial.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-[#7E3F55]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <PlayCircle size={30} className="text-[#6A3447]" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10 text-center md:text-right flex flex-col justify-center">
          <div>
            <Kicker>{kicker}</Kicker>
          </div>
          <StepBadge tutorial={currentTutorial} totalSteps={totalSteps} size="lg" tone="dark" />
          <button
            onClick={() => onSelectTutorial(currentTutorial)}
            className={`${LIGHT_BTN} mt-7 w-full md:w-fit self-center md:self-auto text-[18px]`}
          >
            {ctaLabel}
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
