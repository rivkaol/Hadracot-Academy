import { useMemo } from 'react'
import { Sparkles, Leaf, ChevronDown } from 'lucide-react'
import { getTrackTutorials } from '../lib/catalogHelpers'
import { buildShelves } from '../lib/series'
import { pricingConfig } from '../pricing'
import CurrentStepHero from './CurrentStepHero'
import SeriesShelf from './SeriesShelf'
import UpcomingLiveSession from './UpcomingLiveSession'
import CommunityCard from './CommunityCard'

// דף הבית לחברה/VIP בלבד (לא רוכשת בודדת — לה יש אזור נפרד, ראו App.jsx).
// שום תוכן מכירתי — לא כאן. הסדר במסך:
// 1. "המשך צפייה" (או "הצעד הראשון שלך" לחדשה לגמרי)
// 2. שתי דלתות: נפש / גוף — קפיצה למדף המתאים
// 3. הסדרות, כל סדרה מדף משלה (src/lib/series.js)
// 4. מדף הבריאות, בירוק
export default function MemberDashboard({
  tutorialsData,
  userName,
  completedTutorials,
  lastWatchedTutorial,
  onSelectTutorial,
  onGoLibrary,
}) {
  const track = useMemo(() => getTrackTutorials(tutorialsData), [tutorialsData])
  const { series, health, other } = useMemo(() => buildShelves(tutorialsData), [tutorialsData])
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

  const seriesCount = series.reduce((n, s) => n + s.tutorials.length, 0)
  const nextLiveSession = pricingConfig.nextLiveSession

  const jumpTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="flex-1 pb-[110px] md:pb-8">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <header className="mb-8">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#3E3935] leading-tight">
            {isFirstEver ? `ברוכה הבאה, ${userName}` : `שלום ${userName}`}
          </h2>
          <p className="text-[19px] text-[#5E5650] mt-2 max-w-lg leading-relaxed">
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

        <nav aria-label="מה בא לך לראות" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <button
            onClick={() => jumpTo('series')}
            className="flex items-center gap-4 text-right bg-white rounded-[1.5rem] border-2 border-[#C88F96]/40 hover:border-[#C88F96] p-5 md:p-6 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88F96]"
          >
            <span className="w-14 h-14 rounded-full bg-[#F6ECEE] text-[#9E626C] flex items-center justify-center shrink-0">
              <Sparkles size={28} />
            </span>
            <span className="flex-1">
              <span className="block text-[22px] font-bold text-[#3E3935]">נפש ושינוי מבפנים</span>
              <span className="block text-base text-[#5E5650] mt-0.5">{series.length} סדרות · {seriesCount} הדרכות</span>
            </span>
            <ChevronDown size={26} className="text-[#9E626C] shrink-0" aria-hidden="true" />
          </button>
          {health.tutorials.length > 0 && (
            <button
              onClick={() => jumpTo('health')}
              className="flex items-center gap-4 text-right bg-white rounded-[1.5rem] border-2 border-[#687B63]/40 hover:border-[#687B63] p-5 md:p-6 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#687B63]"
            >
              <span className="w-14 h-14 rounded-full bg-[#E8EEE5] text-[#4F6249] flex items-center justify-center shrink-0">
                <Leaf size={28} />
              </span>
              <span className="flex-1">
                <span className="block text-[22px] font-bold text-[#3E3935]">גוף ובריאות</span>
                <span className="block text-base text-[#5E5650] mt-0.5">{health.tutorials.length} הדרכות</span>
              </span>
              <ChevronDown size={26} className="text-[#4F6249] shrink-0" aria-hidden="true" />
            </button>
          )}
        </nav>

        <section id="series" className="mb-14 scroll-mt-28">
          <h3 className="text-[28px] md:text-[34px] font-bold text-[#3E3935] mb-2">נפש ושינוי מבפנים</h3>
          <p className="text-[19px] text-[#5E5650] leading-relaxed mb-6 max-w-xl">
            כל סדרה בנויה חלק אחרי חלק. מומלץ לצפות לפי הסדר, ותמיד אפשר לחזור לכל חלק.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {series.map((shelf) => (
              <SeriesShelf
                key={shelf.id}
                shelf={shelf}
                completedTutorials={completedTutorials}
                currentTutorialId={trackFullyCompleted ? null : currentTutorial?.id}
                onSelectTutorial={onSelectTutorial}
              />
            ))}
          </div>
        </section>

        {health.tutorials.length > 0 && (
          <section id="health" className="mb-14 scroll-mt-28">
            <h3 className="text-[28px] md:text-[34px] font-bold text-[#3E3935] mb-2">גוף ובריאות</h3>
            <p className="text-[19px] text-[#5E5650] leading-relaxed mb-6 max-w-xl">
              הדרכות שעומדות כל אחת בפני עצמה. אפשר לבחור לפי מה שמעניין אותך עכשיו.
            </p>
            <SeriesShelf
              shelf={health}
              tone="health"
              completedTutorials={completedTutorials}
              onSelectTutorial={onSelectTutorial}
            />
          </section>
        )}

        {other.tutorials.length > 0 && (
          <section className="mb-14">
            <SeriesShelf shelf={other} completedTutorials={completedTutorials} onSelectTutorial={onSelectTutorial} />
          </section>
        )}

        {nextLiveSession && <UpcomingLiveSession session={nextLiveSession} />}

        <CommunityCard />
      </main>
    </div>
  )
}
