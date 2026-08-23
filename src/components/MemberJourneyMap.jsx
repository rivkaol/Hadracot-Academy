import { groupByStage, getTrackTutorials } from '../lib/catalogHelpers'
import MemberJourneyStep from './MemberJourneyStep'

// מפת המסלול לחברות/VIP בלבד — לא JourneyTimeline (שנשאר כמו שהוא למסכי
// טעימה/נעילה). שביל מתפתל עם תחנות אמיתיות, לא רשימת שיעורים.
// מקור נתונים יחיד: groupByStage/getTrackTutorials מ-catalogHelpers — בדיוק
// כמו JourneyTimeline, כדי שהסדר לעולם לא יתפצל לשני מקורות אמת.
const STAGE_LABELS = {
  1: 'להבין',
  2: 'לזהות',
  3: 'לבחור אחרת',
  4: 'להטמיע',
}
const STAGE_SUBTEXT = {
  1: 'להבין מה באמת מפעיל אותי.',
  2: 'לזהות את הדפוסים שחוזרים על עצמם.',
  3: 'לבחור תגובה אחרת, מתוך בחירה.',
  4: 'להטמיע את השינוי לתוך החיים עצמם.',
}
const PRINCIPLES = ['להבין', 'לזהות', 'לבחור אחרת', 'להטמיע']

export default function MemberJourneyMap({
  tutorialsData,
  completedTutorials = [],
  currentTutorialId,
  isContinuing,
  onSelectTutorial,
}) {
  const totalSteps = getTrackTutorials(tutorialsData).length
  const stages = groupByStage(tutorialsData)
  const stageKeys = Object.keys(stages).sort((a, b) => {
    if (a === 'unassigned') return 1
    if (b === 'unassigned') return -1
    return Number(a) - Number(b)
  })
  const hasStages = stageKeys.some((key) => key !== 'unassigned')

  if (totalSteps === 0) return null

  const indexById = new Map(
    stageKeys.flatMap((stageKey) => stages[stageKey]).map((tutorial, i) => [tutorial.id, i])
  )

  return (
    <div className="relative max-w-[1000px] mx-auto">
      <div className="hidden md:block absolute top-6 bottom-6 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-[#C88F96]/35 to-transparent" />
      <div className="md:hidden absolute top-6 bottom-6 right-[19px] w-px bg-gradient-to-b from-transparent via-[#C88F96]/35 to-transparent" />

      {!hasStages && (
        <div className="relative mb-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-bold text-[#9E626C]">
          {PRINCIPLES.map((p, i) => (
            <span key={p} className="flex items-center gap-3">
              {i > 0 && <span className="text-[#C88F96]/40">·</span>}
              {p}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-10 md:space-y-14">
        {stageKeys.map((stageKey) => (
          <div key={stageKey} className="space-y-10 md:space-y-14">
            {stageKey !== 'unassigned' && (
              <div className="relative text-center py-2">
                <span className="block text-6xl md:text-7xl font-black text-[#E8EEE5] leading-none select-none">
                  {String(stageKey).padStart(2, '0')}
                </span>
                <span className="block -mt-8 md:-mt-9 text-lg md:text-xl font-bold text-[#3E3935]">
                  {STAGE_LABELS[stageKey] || `שלב ${stageKey}`}
                </span>
                {STAGE_SUBTEXT[stageKey] && (
                  <span className="block text-sm text-[#716861] mt-1">{STAGE_SUBTEXT[stageKey]}</span>
                )}
              </div>
            )}

            {stages[stageKey].map((tutorial) => {
              const globalIndex = indexById.get(tutorial.id)
              const isCompleted = completedTutorials.includes(tutorial.id)
              const isCurrent = tutorial.id === currentTutorialId
              const status = isCompleted ? 'completed' : isCurrent ? 'current' : 'future'
              const ctaLabel = isCompleted
                ? 'לצפייה חוזרת'
                : isCurrent
                  ? isContinuing
                    ? 'ממשיכה לצפות'
                    : 'מתחילה את הצעד הזה'
                  : 'לצפייה'

              return (
                <MemberJourneyStep
                  key={tutorial.id}
                  tutorial={tutorial}
                  totalSteps={totalSteps}
                  status={status}
                  ctaLabel={ctaLabel}
                  align={globalIndex % 2 === 0 ? 'right' : 'left'}
                  onSelect={() => onSelectTutorial(tutorial)}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
