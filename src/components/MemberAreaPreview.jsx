import { useMemo } from 'react'
import { CheckCircle, Circle, PlayCircle } from 'lucide-react'
import { getTrackTutorials } from '../lib/catalogHelpers'

// הצצה ויזואלית בלבד (לא MemberDashboard אמיתי, לא ניתן ללחיצה) — כדי שמבקרת
// תוכל לדמיין את עצמה בפנים. הצעד "הנוכחי" שנבחר להדגמה הוא צעד 4 (או האחרון
// הזמין אם המסלול קצר יותר), רק כדי להראות שאפשר "לחזור למקום שעצרת בו".
export default function MemberAreaPreview({ tutorialsData }) {
  const track = useMemo(() => getTrackTutorials(tutorialsData), [tutorialsData])
  const currentIndex = Math.min(3, track.length - 1)
  const current = track[currentIndex]
  const preview = track.slice(0, Math.min(6, track.length))

  if (!current) return null

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 md:py-20">
      <div className="text-center mb-8">
        <span className="inline-block text-xs font-bold text-[#9E626C] bg-[#C88F96]/10 px-3 py-1 rounded-full mb-4">
          ככה נראה האזור של חברת מועדון
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-[#3E3935] leading-[1.4]">
          ברגע שאת נכנסת —
          <br />
          כבר לא צריך לחפש מה לראות.
        </h2>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_20px_50px_rgba(148,163,136,0.12)] p-6 md:p-8 select-none" aria-hidden="true">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="w-full md:w-1/3 aspect-video bg-[#3E3935]/5 rounded-2xl relative overflow-hidden flex items-center justify-center shrink-0">
            {current.imageUrl ? (
              <img src={current.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-[#3E3935]/10 to-transparent" />
            )}
            <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-lg z-10">
              <PlayCircle size={24} className="text-[#3E3935]" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-right">
            <p className="text-sm font-bold text-[#9E626C] mb-2">ממשיכות מהמקום שבו עצרת?</p>
            <p className="text-xs font-bold text-[#9E626C] mb-1 tracking-wide">
              צעד {current.recommendedOrder} מתוך {track.length}
            </p>
            <h3 className="font-bold text-[#3E3935] text-lg leading-tight mb-4">{current.title}</h3>
            <span className="inline-flex items-center gap-2 bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-6 py-2.5 rounded-full font-bold text-sm cursor-default opacity-90">
              המשיכי לצפות
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 space-y-2">
          {preview.map((t, i) => {
            const isDone = i < currentIndex
            const isCurrent = i === currentIndex
            return (
              <div key={t.id} className="flex items-center gap-3 text-sm">
                {isDone ? (
                  <CheckCircle size={16} className="text-[#687B63] shrink-0" />
                ) : (
                  <Circle size={14} className={isCurrent ? 'text-[#C88F96]' : 'text-gray-300 shrink-0'} />
                )}
                <span className={`truncate ${isCurrent ? 'font-bold text-[#3E3935]' : isDone ? 'text-gray-400' : 'text-gray-400'}`}>
                  צעד {t.recommendedOrder} — {t.title}
                </span>
                {isCurrent && (
                  <span className="shrink-0 text-[10px] font-bold text-white bg-gradient-to-br from-[#C88F96] to-[#9E626C] px-2 py-0.5 rounded-full mr-auto">
                    את כאן
                  </span>
                )}
              </div>
            )
          })}
          {track.length > preview.length && <p className="text-xs text-gray-400 pr-6">...וממשיך מכאן</p>}
        </div>
      </div>
    </section>
  )
}
