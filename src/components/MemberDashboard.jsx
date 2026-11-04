import { useMemo } from 'react'
import { Sparkles, Leaf, ChevronDown } from 'lucide-react'
import { getTrackTutorials, findTutorialById } from '../lib/catalogHelpers'
import { buildShelves, DOOR_COVERS } from '../lib/series'
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
// "דלת" עם תמונה גדולה — נפש או גוף. לחיצה קופצת למדף המתאים במסך.
function DoorCard({ image, Icon, title, subtitle, accent, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative block w-full h-52 md:h-64 rounded-[1.75rem] overflow-hidden text-right shadow-[0_14px_36px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-4"
      style={{ '--tw-ring-color': accent, background: accent }}
    >
      {image && (
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <span className="absolute bottom-0 inset-x-0 p-5 md:p-6 flex items-end gap-3 text-white">
        <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shrink-0" style={{ color: accent }}>
          <Icon size={26} />
        </span>
        <span className="flex-1">
          <span className="block text-[26px] md:text-[30px] font-bold leading-tight drop-shadow">{title}</span>
          <span className="block text-lg mt-0.5 opacity-95">{subtitle}</span>
        </span>
        <span className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
          <ChevronDown size={26} aria-hidden="true" />
        </span>
      </span>
    </button>
  )
}

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
  const coverOf = (id) => findTutorialById(tutorialsData, id)?.imageUrl || null

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

        <nav aria-label="מה בא לך לראות" className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          <DoorCard
            image={coverOf(DOOR_COVERS.mind)}
            Icon={Sparkles}
            title="נפש ושינוי מבפנים"
            subtitle={`${series.length} סדרות · ${seriesCount} הדרכות`}
            accent="#9E626C"
            onClick={() => jumpTo('series')}
          />
          {health.tutorials.length > 0 && (
            <DoorCard
              image={coverOf(DOOR_COVERS.body)}
              Icon={Leaf}
              title="גוף ובריאות"
              subtitle={`${health.tutorials.length} הדרכות`}
              accent="#4F6249"
              onClick={() => jumpTo('health')}
            />
          )}
        </nav>

        <section id="series" className="mb-14 scroll-mt-28">
          <h3 className="text-[28px] md:text-[34px] font-bold text-[#3E3935] mb-2">נפש ושינוי מבפנים</h3>
          <p className="text-[19px] text-[#5E5650] leading-relaxed mb-6 max-w-xl">
            כל סדרה בנויה חלק אחרי חלק. מומלץ לצפות לפי הסדר, ותמיד אפשר לחזור לכל חלק.
          </p>
          <div className="flex flex-col gap-8">
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
              showHeader={false}
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
