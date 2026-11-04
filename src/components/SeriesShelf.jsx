import { CheckCircle2, ChevronLeft, Lock, PlayCircle } from 'lucide-react'

// מדף אחד: סדרה (חלקים ממוספרים לפי הסדר) או מדף הבריאות (בלי מספור).
// שורות גדולות וברורות (קהל 45–70) — כותרת 20px+, תמונה גדולה, שורה שלמה לחיצה, סטטוס במילים ולא רק בצבע.
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
  layout = 'auto', // 'auto' = רשימה בנייד וכרטיסים לרוחב מ-md; 'list' = תמיד רשימה (לצד דף ההדרכה)
  showHeader = true, // false כשכותרת המדף כבר מופיעה ממש מעליו (מדף הבריאות במסך הבית)
}) {
  const cards = layout === 'auto'
  const c = (listCls, cardCls) => (cards ? `${listCls} ${cardCls}` : listCls)
  const t = TONES[tone]
  const total = shelf.tutorials.length
  const done = shelf.tutorials.filter((x) => completedTutorials.includes(x.id)).length
  const isNumbered = shelf.number != null

  return (
    <section className="bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.04)] overflow-hidden">
      {showHeader && (
        <header className="px-5 md:px-7 pt-6 pb-5" style={{ background: t.soft }}>
          <h4 className="text-[26px] md:text-[30px] font-bold text-[#3E3935] leading-tight">
            {isNumbered && <span style={{ color: t.accent }}>סדרה {shelf.number}: </span>}
            {shelf.title}
          </h4>
          {/* התקדמות רק אחרי שהתחילה — "עוד לא התחלת" על כל סדרה הוא רק רעש */}
          {isNumbered && done > 0 && (
            <div className="mt-3">
              <p className="text-lg text-[#5E5650] mb-2">
                {done === total ? 'סיימת את כל הסדרה' : `צפית ב-${done} מתוך ${total}`}
              </p>
              <div className="w-full bg-white rounded-full h-3 overflow-hidden" aria-hidden="true">
                <div className="h-3 rounded-full transition-all" style={{ width: `${(done / total) * 100}%`, background: t.bar }} />
              </div>
            </div>
          )}
        </header>
      )}

      <ol className={c('divide-y divide-gray-100', 'md:divide-y-0 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-5 md:p-6')}>
        {shelf.tutorials.map((tutorial, i) => {
          const isDone = completedTutorials.includes(tutorial.id)
          const isCurrent = tutorial.id === currentTutorialId
          const open = canWatch(tutorial)
          return (
            <li key={tutorial.id}>
              <button
                onClick={() => onSelectTutorial(tutorial)}
                className={`${c('w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-4 text-right transition-all hover:bg-[#FAF7F2] focus-visible:outline-none focus-visible:bg-[#FAF7F2]', 'md:h-full md:flex-col md:items-stretch md:gap-0 md:p-0 md:rounded-2xl md:overflow-hidden md:border md:border-gray-100 md:shadow-sm md:hover:shadow-md md:hover:-translate-y-0.5')} ${isCurrent ? (cards ? 'bg-[#FFF8F0] md:ring-2 md:ring-[#C88F96]' : 'bg-[#FFF8F0]') : ''}`}
              >
                <div className={c('relative w-[118px] sm:w-[150px] aspect-video rounded-xl overflow-hidden shrink-0 bg-[#E8EEE5]', 'md:w-full md:rounded-none')}>
                  {tutorial.imageUrl && (
                    <img src={tutorial.imageUrl} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  )}
                  {isNumbered && (
                    <span
                      className="absolute top-1.5 right-1.5 min-w-[32px] h-[32px] px-1.5 rounded-full text-white text-base font-bold flex items-center justify-center shadow"
                      style={{ background: t.accent }}
                    >
                      {i + 1}
                    </span>
                  )}
                </div>

                <div className={c('flex-1 min-w-0', 'md:p-4')}>
                  <p className="text-[20px] font-bold text-[#3E3935] leading-snug">{tutorial.title}</p>
                  {(isDone || isCurrent || !open) && (
                    <p className="text-[17px] mt-1 flex items-center gap-1.5" style={{ color: isDone ? '#4F6249' : t.accent }}>
                      {!open ? (
                        <><Lock size={18} /> לחברות המועדון</>
                      ) : isCurrent ? (
                        <><PlayCircle size={18} /> את כאן</>
                      ) : (
                        <><CheckCircle2 size={18} /> צפית</>
                      )}
                    </p>
                  )}
                </div>

                <ChevronLeft size={28} className={c('hidden sm:block text-[#9E9188] shrink-0', 'md:hidden')} aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
