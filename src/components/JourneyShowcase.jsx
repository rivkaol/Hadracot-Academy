import { useMemo } from 'react'
import { PlayCircle, Lock } from 'lucide-react'
import { getTrackTutorials, groupByStage } from '../lib/catalogHelpers'
import { STAGE_META } from '../lib/stageMeta'

// הסקשן המרכזי ב-Landing: מפת המסלול המלאה, לא Grid יבש. כל שמות הצעדים גלויים
// (גם ללא-חברה) — מסתירים גישה, לא עושר. תמיד נגזר מ-tutorialsData/getTrackTutorials,
// אף פעם לא רשימה מוקלדת ידנית.
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
    ...assignedStages.map((meta) => ({ key: meta.n, title: meta.title, question: meta.question, steps: stages[meta.n] })),
    ...(unassigned.length > 0
      ? [{
          key: 'unassigned',
          title: assignedStages.length > 0 ? 'בהמשך המסלול' : 'כל צעדי המסלול',
          question: '',
          steps: unassigned,
        }]
      : []),
  ]

  return (
    <section className="bg-white border-y border-gray-100 py-16 md:py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-4xl font-bold text-[#3E3935] leading-[1.35] mb-4">
            לא אספתי לך עוד הדרכות.
            <br />
            בניתי לך מסלול.
          </h2>
          <p className="text-[#716861] leading-[1.8]">
            מסלול יסוד.
            <br />
            {STAGE_META.length} שלבים.
            <br />
            דרך אחת שמתקדמת איתך מהבנה — ליישום.
          </p>
        </div>

        <div className="space-y-14">
          {blocks.map(({ key, title, question, steps }) => {
            return (
              <div key={key} className="relative">
                <div className={`flex items-baseline gap-3 ${question ? 'mb-1' : 'mb-5'}`}>
                  {typeof key === 'number' && (
                    <span className="text-4xl font-bold text-[#C88F96]/25 select-none">0{key}</span>
                  )}
                  <h3 className="text-xl font-bold text-[#3E3935]">{title}</h3>
                </div>
                {question && <p className="text-sm text-[#716861] mb-5 mr-1">{question}</p>}

                <div className="relative">
                  <div className="absolute top-1 bottom-1 right-[19px] w-px bg-gradient-to-b from-[#C88F96]/40 to-[#C88F96]/10" />
                  <div className="space-y-2.5">
                    {steps.map((tutorial) => {
                      const isOpen = tutorial.id === firstStepId
                      return (
                        <div
                          key={tutorial.id}
                          className={`relative z-10 flex items-center gap-4 rounded-2xl border p-3.5 ${
                            isOpen
                              ? 'bg-white border-[#C88F96] shadow-[0_8px_24px_rgba(158,98,108,0.15)]'
                              : 'bg-[#FAF7F2]/70 border-gray-100'
                          }`}
                        >
                          <div
                            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              isOpen ? 'bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white' : 'bg-white text-gray-300 border border-gray-200'
                            }`}
                          >
                            {isOpen ? <PlayCircle size={18} /> : <Lock size={16} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-bold truncate ${isOpen ? 'text-[#3E3935]' : 'text-[#716861]'}`}>
                              צעד {tutorial.recommendedOrder} — {tutorial.title}
                            </p>
                            <p className={`text-xs mt-0.5 ${isOpen ? 'text-[#9E626C] font-bold' : 'text-gray-400'}`}>
                              {isOpen ? 'טעימה פתוחה · 5 דקות' : 'נפתח לחברות המועדון'}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-[#3E3935] font-bold text-lg mt-14">
          {track.length} צעדים במסלול היסוד.
        </p>
      </div>
    </section>
  )
}
