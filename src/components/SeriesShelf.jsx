import { CheckCircle2, ChevronLeft, Lock, PlayCircle } from 'lucide-react'

// מדף אחד: סדרה (חלקים ממוספרים לפי הסדר) או מדף הבריאות (בלי מספור).
// שורות גדולות וברורות — כותרת 18px, שורה שלמה לחיצה, סטטוס במילים ולא רק בצבע.
const TONES = {
  series: { accent: '#9E626C', soft: '#F6ECEE', bar: '#C88F96' },
  health: { accent: '#4F6249', soft: '#E8EEE5', bar: '#687B63' },
}

export default function SeriesShelf({
  shelf,
  tone = 'series',
  completedTutorials = [],
  currentTutorialId,
  canWatch = () => true,
  onSelectTutorial,
}) {
  const t = TONES[tone]
  const total = shelf.tutorials.length
  const done = shelf.tutorials.filter((x) => completedTutorials.includes(x.id)).length
  const isNumbered = shelf.number != null

  return (
    <section className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden">
      <header className="px-5 md:px-6 pt-5 pb-4" style={{ background: t.soft }}>
        {isNumbered && (
          <p className="text-base font-bold mb-1" style={{ color: t.accent }}>
            סדרה {shelf.number} · {total} חלקים
          </p>
        )}
        <h4 className="text-[22px] md:text-[24px] font-bold text-[#3E3935] leading-tight">{shelf.title}</h4>
        {isNumbered && (
          <div className="mt-3">
            <div className="flex justify-between text-base text-[#5E5650] mb-1.5">
              <span>{done === total ? 'סיימת את כל הסדרה' : done === 0 ? 'עוד לא התחלת' : `צפית ב-${done} מתוך ${total}`}</span>
            </div>
            <div className="w-full bg-white rounded-full h-2.5 overflow-hidden" aria-hidden="true">
              <div className="h-2.5 rounded-full transition-all" style={{ width: `${total ? (done / total) * 100 : 0}%`, background: t.bar }} />
            </div>
          </div>
        )}
      </header>

      <ol className="divide-y divide-gray-100">
        {shelf.tutorials.map((tutorial, i) => {
          const isDone = completedTutorials.includes(tutorial.id)
          const isCurrent = tutorial.id === currentTutorialId
          const open = canWatch(tutorial)
          return (
            <li key={tutorial.id}>
              <button
                onClick={() => onSelectTutorial(tutorial)}
                className={`w-full flex items-center gap-3 md:gap-4 px-4 md:px-5 py-3.5 text-right transition-colors hover:bg-[#FAF7F2] focus-visible:outline-none focus-visible:bg-[#FAF7F2] ${isCurrent ? 'bg-[#FFF8F0]' : ''}`}
              >
                <div className="relative w-[88px] md:w-[104px] aspect-video rounded-lg overflow-hidden shrink-0 bg-[#E8EEE5]">
                  {tutorial.imageUrl && (
                    <img src={tutorial.imageUrl} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  {isNumbered && (
                    <span
                      className="absolute top-1 right-1 min-w-[26px] h-[26px] px-1 rounded-full text-white text-sm font-bold flex items-center justify-center shadow"
                      style={{ background: t.accent }}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[18px] font-bold text-[#3E3935] leading-snug">{tutorial.title}</p>
                  {(isDone || isCurrent || !open) && (
                    <p className="text-base mt-0.5 flex items-center gap-1.5" style={{ color: isDone ? '#4F6249' : t.accent }}>
                      {!open ? (
                        <><Lock size={16} /> לחברות המועדון</>
                      ) : isCurrent ? (
                        <><PlayCircle size={16} /> את כאן</>
                      ) : (
                        <><CheckCircle2 size={16} /> צפית</>
                      )}
                    </p>
                  )}
                </div>

                <ChevronLeft size={24} className="text-[#9E9188] shrink-0" aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
