import { CheckCircle, Lock, Circle } from 'lucide-react'
import { groupByStage } from '../lib/catalogHelpers'

const STAGE_LABELS = {
  1: 'להבין',
  2: 'לזהות',
  3: 'לבחור אחרת',
  4: 'להטמיע',
  unassigned: 'בהמשך המסלול',
}

// ציר "המסלול שלי" — משמש גם ב-Dashboard לחברה (mode="open", בלי מנעולים),
// גם במפת הטעימה אחרי 5 הדקות (mode="locked", עם מנעולים אבל כותרות גלויות),
// וגם לרוכשת בודדת (mode="locked" מוגבל ל-accessibleTutorialIds שלה).
// מקור נתונים יחיד: groupByStage(tutorialsData) — לא רשימה נפרדת.
export default function JourneyTimeline({
  tutorialsData,
  mode = 'open', // 'open' | 'locked'
  completedTutorials = [],
  currentTutorialId,
  accessibleTutorialIds = [],
  onSelectTutorial,
}) {
  const stages = groupByStage(tutorialsData)
  const stageKeys = Object.keys(stages).sort((a, b) => {
    if (a === 'unassigned') return 1
    if (b === 'unassigned') return -1
    return Number(a) - Number(b)
  })

  return (
    <div className="space-y-8">
      {mode === 'open' && (
        <p className="text-sm text-gray-500">
          מומלץ להתקדם לפי הסדר כדי לקבל את התהליך המלא — אבל תמיד תוכלי לחזור לכל הדרכה שתרצי.
        </p>
      )}
      {stageKeys.map((stageKey) => (
        <div key={stageKey}>
          <h4 className="text-sm font-bold text-[#9E626C] mb-4">{STAGE_LABELS[stageKey] || `שלב ${stageKey}`}</h4>
          <div className="space-y-2">
            {stages[stageKey].map((tutorial) => {
              const isCompleted = completedTutorials.includes(tutorial.id)
              const isCurrent = tutorial.id === currentTutorialId
              const isLocked = mode === 'locked' && !accessibleTutorialIds.includes(tutorial.id)

              return (
                <button
                  key={tutorial.id}
                  onClick={() => !isLocked && onSelectTutorial?.(tutorial)}
                  disabled={isLocked}
                  className={`w-full text-right flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-white border-[#C88F96] shadow-[0_8px_24px_rgba(158,98,108,0.15)]'
                      : isLocked
                        ? 'bg-[#FAF7F2] border-gray-100 cursor-default'
                        : 'bg-white border-gray-100 hover:border-[#C88F96]/40'
                  }`}
                >
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle size={22} className="text-[#687B63]" />
                    ) : isLocked ? (
                      <Lock size={18} className="text-gray-300" />
                    ) : (
                      <Circle size={20} className={isCurrent ? 'text-[#C88F96]' : 'text-gray-300'} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${isLocked ? 'text-gray-400' : 'text-[#3E3935]'}`}>
                      {tutorial.recommendedOrder != null ? `צעד ${tutorial.recommendedOrder} — ` : ''}
                      {tutorial.title}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="shrink-0 text-[10px] font-bold text-white bg-gradient-to-br from-[#C88F96] to-[#9E626C] px-2.5 py-1 rounded-full">
                      את כאן
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
