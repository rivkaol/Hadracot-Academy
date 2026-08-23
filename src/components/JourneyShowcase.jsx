import { useMemo } from 'react'
import { PlayCircle, Lock } from 'lucide-react'
import { getTrackTutorials, groupByStage } from '../lib/catalogHelpers'
import { STAGE_META } from '../lib/stageMeta'

// הסקשן המרכזי ב-Landing: מפת המסלול המלאה כ-WOW visual, לא Grid יבש ולא רשימת
// משימות. כל שמות הצעדים גלויים (גם ללא-חברה) — מסתירים גישה, לא עושר. תמיד נגזר
// מ-tutorialsData/getTrackTutorials, אף פעם לא רשימה מוקלדת ידנית.
export default function JourneyShowcase({ tutorialsData }) {
  const track = useMemo(() => getTrackTutorials(tutorialsData), [tutorialsData])
  const stages = useMemo(() => groupByStage(tutorialsData), [tutorialsData])
  const firstStepId = track[0]?.id

  if (track.length === 0) return null

  const assignedStages = STAGE_META.filter((meta) => (stages[meta.n] || []).length > 0)
  const unassigned = stages.unassigned || []
  // אם אף הדרכה עוד לא תויגה בעמודת "שלב" בגיליון — לא ממציאים שיוך בקוד (ראו
  // CLAUDE.md). מציגים את כל הצעדים תחת כותרת ניטרלית אחת, במקום שלא להציג כלום.
  const blocks = [
    ...assignedStages.map((meta, i) => ({
      key: meta.n,
      number: String(i + 1).padStart(2, '0'),
      title: meta.title,
      question: meta.question,
      steps: stages[meta.n],
    })),
    ...(unassigned.length > 0
      ? [{
          key: 'unassigned',
          number: String(assignedStages.length + 1).padStart(2, '0'),
          title: assignedStages.length > 0 ? 'בהמשך המסלול' : 'כל צעדי המסלול',
          question: '',
          steps: unassigned,
        }]
      : []),
  ]

  return (
    <section className="visitor-landing bg-white border-y border-[#3E3935]/8 py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 md:mb-20 max-w-2xl mx-auto">
          <h2 className="text-[clamp(1.9rem,4.2vw,3.2rem)] font-extrabold text-[#3E3935] leading-[1.2] mb-5">
            והדרך כבר מחכה לך.
          </h2>
          <p className="text-[#716861] text-lg md:text-xl leading-[1.9]">
            כל צעד ממשיך את הקודם.
            <br />
            את לא צריכה לדעת לאן ללכת.
            <br />
            רק להתחיל.
          </p>
        </div>

        <div className="space-y-20 md:space-y-24">
          {blocks.map(({ key, number, title, question, steps }) => {
            const openStepInBlock = steps.find((t) => t.id === firstStepId)
            return (
              <div key={key} className="relative">
                <div className="flex items-start gap-5 mb-8 md:mb-10">
                  <span className="text-6xl md:text-8xl font-extrabold text-[#C88F96]/15 leading-none select-none shrink-0">
                    {number}
                  </span>
                  <div className="pt-2 md:pt-4">
                    <h3 className="text-2xl md:text-3xl font-extrabold text-[#3E3935] mb-1.5">{title}</h3>
                    {question && <p className="text-[#9E626C] font-medium text-base md:text-lg">{question}</p>}
                  </div>
                </div>

                {/* מסלול: הצעד הפתוח כתמונה גדולה, שאר הצעדים כ-route nodes לאורך קו */}
                <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-6 md:gap-10 items-start">
                  {openStepInBlock ? (
                    <div className="relative rounded-[1.75rem] overflow-hidden bg-[#3E3935] shadow-[0_20px_50px_rgba(158,98,108,0.22)] group">
                      <div className="aspect-video relative">
                        {openStepInBlock.imageUrl ? (
                          <img
                            src={openStepInBlock.imageUrl}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover opacity-80"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#C88F96]/40 to-[#3E3935]" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                            <PlayCircle size={30} className="text-[#9E626C]" />
                          </div>
                        </div>
                      </div>
                      <div className="p-5 md:p-6 bg-white">
                        <p className="text-[#9E626C] font-bold text-sm mb-1.5">טעימה פתוחה · 5 דקות</p>
                        <p className="font-extrabold text-[#3E3935] text-lg leading-snug">{openStepInBlock.title}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="hidden md:block" />
                  )}

                  <div className="relative">
                    <div className="absolute top-1 bottom-1 right-[19px] w-px bg-gradient-to-b from-[#C88F96]/35 to-[#C88F96]/5" />
                    <div className="space-y-3">
                      {steps
                        .filter((t) => t.id !== firstStepId)
                        .map((tutorial) => (
                          <div
                            key={tutorial.id}
                            className="relative z-10 flex items-center gap-4 rounded-2xl border border-[#3E3935]/6 bg-[#FAF7F2]/70 p-4 hover:bg-white hover:shadow-[0_8px_24px_rgba(158,98,108,0.1)] transition-all"
                          >
                            <div className="shrink-0 w-10 h-10 rounded-full bg-[#C88F96]/12 text-[#9E626C] flex items-center justify-center">
                              <Lock size={16} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[#3E3935] truncate">
                                צעד {tutorial.recommendedOrder} — {tutorial.title}
                              </p>
                              <p className="text-xs mt-0.5 text-[#9E626C]/70 font-medium">נפתח לחברות המועדון</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-[#3E3935] font-extrabold text-xl md:text-2xl mt-16 md:mt-20">
          {track.length} צעדים במסלול היסוד.
        </p>
      </div>
    </section>
  )
}
