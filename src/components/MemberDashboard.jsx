import { useMemo } from 'react'
import { LayoutGrid, ChevronLeft } from 'lucide-react'
import { getTrackTutorials } from '../lib/catalogHelpers'
import { findShelfOf } from '../lib/series'
import { pricingConfig } from '../pricing'
import CurrentStepHero from './CurrentStepHero'
import SeriesShelf from './SeriesShelf'
import UpcomingLiveSession from './UpcomingLiveSession'
import CommunityCard from './CommunityCard'

// דף הבית לחברה/VIP בלבד (לא רוכשת בודדת — לה יש אזור נפרד, ראו App.jsx).
// שום תוכן מכירתי — לא כאן. מסך קצר, "מה עכשיו" בלבד (החלטה של רבקה, 25.11.2026):
// 1. "המשך צפייה" (או "הצעד הראשון שלך" לחדשה לגמרי)
// 2. הסדרה שהיא נמצאת בה, עם ההתקדמות שלה
// 3. כפתור גדול "לכל ההדרכות". הרשימה המלאה נמצאת רק שם (ClubLibrary), לא כאן.
// 4. שיעור חי וקבוצה
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

  const nextLiveSession = pricingConfig.nextLiveSession

  // הסדרה של הצעד הנוכחי. כשהמסלול הושלם כולו, אין "סדרה נוכחית" ולא מציגים אותה.
  const currentShelf = useMemo(() => {
    if (trackFullyCompleted || !currentTutorial) return null
    const found = findShelfOf(tutorialsData, currentTutorial.id)
    return found && found.isSeries ? found.shelf : null
  }, [tutorialsData, currentTutorial, trackFullyCompleted])

  return (
    <div className="flex-1 pb-[110px] md:pb-8">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <header className="mb-8">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#1F4A3A] leading-tight">
            {isFirstEver ? `ברוכה הבאה, ${userName}` : `שלום ${userName}`}
          </h2>
          <p className="text-[19px] text-[#5E5954] mt-2 max-w-lg leading-relaxed">
            {isFirstEver
              ? 'כאן מחכות לך כל ההדרכות, מסודרות בסדרות. מתחילות מהכפתור למטה.'
              : 'טוב שחזרת. אפשר להמשיך בדיוק מהמקום שעצרת.'}
          </p>
        </header>

        {totalSteps > 0 && (
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
        )}

        {currentShelf && (
          <section aria-labelledby="my-series" className="mb-10">
            <h3 id="my-series" className="text-[26px] md:text-[32px] font-bold text-[#1F4A3A] mb-4">הסדרה שלך</h3>
            <SeriesShelf
              shelf={currentShelf}
              completedTutorials={completedTutorials}
              currentTutorialId={currentTutorial?.id}
              onSelectTutorial={onSelectTutorial}
            />
          </section>
        )}

        <button
          onClick={onGoLibrary}
          className="w-full flex items-center gap-4 bg-[#1F4A3A] hover:bg-[#173A2D] text-white rounded-[1.5rem] p-5 md:p-6 text-right shadow-[0_4px_0_rgba(0,0,0,0.25)] mb-12 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#A0627A]"
        >
          <span className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <LayoutGrid size={26} aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block text-[22px] md:text-[26px] font-bold leading-tight">לכל ההדרכות</span>
            <span className="block text-[17px] text-white/90 mt-0.5">נפש ושינוי מבפנים · גוף ובריאות</span>
          </span>
          <ChevronLeft size={28} aria-hidden="true" className="shrink-0" />
        </button>

        {nextLiveSession && <UpcomingLiveSession session={nextLiveSession} />}

        <CommunityCard />
      </main>
    </div>
  )
}
