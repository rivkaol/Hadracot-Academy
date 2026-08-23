import { useMemo } from 'react'
import { getTrackTutorials } from '../lib/catalogHelpers'
import { pricingConfig } from '../pricing'
import JourneyProgressHeader from './JourneyProgressHeader'
import CurrentStepHero from './CurrentStepHero'
import MemberJourneyMap from './MemberJourneyMap'
import UpcomingLiveSession from './UpcomingLiveSession'
import CommunityCard from './CommunityCard'

// דף הבית לחברה/VIP בלבד (לא רוכשת בודדת — לה יש אזור נפרד, ראו App.jsx).
// שום תוכן מכירתי — לא כאן. הדבר הראשון שרואים הוא תמיד "המשך צפייה"
// (או "הצעד הראשון שלך" לחדשה לגמרי).
//
// חוויית "מפת דרך" — ראו MemberJourneyMap.jsx. JourneyTimeline.jsx נשאר כמו
// שהוא, בשימוש רק במסכי טעימה/נעילה (TrialTrackMapScreen), לא כאן יותר.
export default function MemberDashboard({
  tutorialsData,
  userName,
  completedTutorials,
  lastWatchedTutorial,
  onSelectTutorial,
  onGoLibrary,
}) {
  const track = useMemo(() => getTrackTutorials(tutorialsData), [tutorialsData])
  const totalSteps = track.length
  const trackIds = useMemo(() => new Set(track.map((t) => t.id)), [track])

  // "הצעד הנוכחי": ההדרכה שנצפתה לאחרונה — אבל רק אם היא שייכת למסלול הראשי
  // וגם עוד לא הושלמה. הדרכת בריאות/מיוחדת שנצפתה לאחרונה לא הופכת ל"צעד נוכחי",
  // וצעד שכבר הושלם לא מוצע שוב — עוברים לראשון הבא שעוד לא הושלם.
  const lastWatchedInTrack =
    lastWatchedTutorial && trackIds.has(lastWatchedTutorial.id) ? lastWatchedTutorial : null
  const lastWatchedIncomplete = lastWatchedInTrack && !completedTutorials.includes(lastWatchedInTrack.id)
  const firstIncomplete = track.find((t) => !completedTutorials.includes(t.id)) || null
  const trackFullyCompleted = totalSteps > 0 && !firstIncomplete
  const currentTutorial = lastWatchedIncomplete ? lastWatchedInTrack : firstIncomplete
  const isContinuing = !!lastWatchedIncomplete
  const isFirstEver = !lastWatchedTutorial
  // רק השלמות ששייכות למסלול הראשי — completedTutorials עשוי לכלול גם הדרכות
  // בריאות/מיוחדות שאינן חלק מ-13 הצעדים, ואז "X מתוך 13" יכול לחרוג מ-13.
  const completedCount = completedTutorials.filter((id) => trackIds.has(id)).length

  const nextLiveSession = pricingConfig.nextLiveSession

  return (
    <div className="flex-1 pb-[100px] md:pb-8">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <header className="mb-8">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#3E3935] leading-tight">
            {isFirstEver ? `ברוכה הבאה, ${userName}` : `שלום ${userName}`}
          </h2>
          <p className="text-[17px] text-[#716861] mt-2 max-w-lg">
            {isFirstEver ? (
              <>
                מכאן לא צריך לחפש בין כל ההדרכות.
                <br />
                אני אראה לך בכל פעם מה הצעד הבא שלך.
              </>
            ) : (
              <>
                טוב שחזרת. כאן תוכלי לראות בדיוק איפה את נמצאת
                <br />
                ומה הצעד הבא שלך בדרך.
              </>
            )}
          </p>
        </header>

        {totalSteps === 0 ? (
          <section className="mb-10 bg-white rounded-[1.75rem] p-8 border border-gray-100 shadow-sm text-center">
            <p className="text-[#716861]">המסלול שלך מתעדכן כרגע.</p>
          </section>
        ) : (
          <>
            <JourneyProgressHeader
              completedCount={completedCount}
              totalSteps={totalSteps}
              trackFullyCompleted={trackFullyCompleted}
            />

            <CurrentStepHero
              trackFullyCompleted={trackFullyCompleted}
              currentTutorial={currentTutorial}
              totalSteps={totalSteps}
              isContinuing={isContinuing}
              isFirstEver={isFirstEver}
              onSelectTutorial={onSelectTutorial}
              onGoLibrary={onGoLibrary}
              firstTrackTutorial={track[0]}
            />

            <section className="mb-10">
              <p className="text-sm font-bold text-[#9E626C] mb-1.5">הדרך שלי</p>
              <h3 className="text-[28px] md:text-[34px] font-bold text-[#3E3935] mb-4">המסלול שלי</h3>
              <p className="text-[17px] text-[#716861] leading-relaxed mb-8 max-w-lg">
                מומלץ להתקדם לפי הסדר
                <br />
                כדי שכל צעד ייבנה על הקודם.
                <br />
                אבל תמיד תוכלי לחזור
                <br />
                לכל הדרכה שתרצי.
              </p>

              <MemberJourneyMap
                tutorialsData={tutorialsData}
                completedTutorials={completedTutorials}
                currentTutorialId={currentTutorial?.id}
                isContinuing={isContinuing}
                onSelectTutorial={onSelectTutorial}
              />
            </section>
          </>
        )}

        {nextLiveSession && <UpcomingLiveSession session={nextLiveSession} />}

        <CommunityCard />
      </main>
    </div>
  )
}
