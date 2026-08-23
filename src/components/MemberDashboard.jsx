import { useMemo } from 'react'
import { PlayCircle, Sparkles, MessageCircle, ChevronLeft, Calendar, PartyPopper } from 'lucide-react'
import { getTrackTutorials } from '../lib/catalogHelpers'
import StepBadge from './StepBadge'
import JourneyTimeline from './JourneyTimeline'
import { pricingConfig } from '../pricing'

// דף הבית לחברה/VIP בלבד (לא רוכשת בודדת — לה יש אזור נפרד, ראו App.jsx).
// שום תוכן מכירתי — לא כאן. הדבר הראשון שרואים הוא תמיד "המשך צפייה"
// (או "המסע שלך מתחיל כאן" לחדשה לגמרי).
export default function MemberDashboard({
  tutorialsData,
  userName,
  completedTutorials,
  lastWatchedTutorial,
  accessibleTutorialIds,
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

  const newItems = useMemo(() => {
    const items = []
    if (pricingConfig.nextLiveSession) {
      items.push({ kind: 'live', ...pricingConfig.nextLiveSession })
    }
    return items.slice(0, 3)
  }, [])

  return (
    <div className="flex-1 pb-[100px] md:pb-8">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-6">
          {isFirstEver ? `ברוכה הבאה, ${userName} 💛` : `שלום ${userName} 💛`}
        </h2>

        {/* המשך צפייה — האלמנט הבולט ביותר בדף */}
        {trackFullyCompleted ? (
          <section className="mb-10 bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_20px_50px_rgba(148,163,136,0.12)] text-center">
            <PartyPopper size={36} className="text-[#C88F96] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-[#3E3935] mb-2">איזה יופי 💛 השלמת את מסלול היסוד</h3>
            <p className="text-[#716861] mb-5">כל 13 הצעדים מאחורייך. שאר הארכיון מחכה לך בכל זמן שתרצי.</p>
            {onGoLibrary && (
              <button
                onClick={onGoLibrary}
                className="bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-7 py-3 rounded-full font-bold inline-flex items-center gap-2 shadow-[0_12px_28px_rgba(158,98,108,0.25)] hover:-translate-y-0.5 transition-all"
              >
                לכל ההדרכות
                <ChevronLeft size={18} />
              </button>
            )}
          </section>
        ) : (
          currentTutorial && (
            <section className="mb-10 bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-[0_20px_50px_rgba(148,163,136,0.12)] relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div
                  onClick={() => onSelectTutorial(currentTutorial)}
                  className="w-full md:w-1/3 aspect-video bg-[#3E3935]/5 rounded-2xl relative overflow-hidden flex items-center justify-center shrink-0 cursor-pointer group"
                >
                  {currentTutorial.imageUrl ? (
                    <img src={currentTutorial.imageUrl} alt={currentTutorial.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#3E3935]/10 to-transparent" />
                  )}
                  <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg z-10 group-hover:scale-105 transition-transform">
                    <PlayCircle size={28} className="text-[#3E3935]" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-right">
                  <p className="text-sm font-bold text-[#9E626C] mb-2">
                    {isContinuing ? 'ממשיכות מהמקום שבו עצרת?' : isFirstEver ? 'המסע שלך מתחיל כאן 💛' : 'הצעד הבא שלך'}
                  </p>
                  <StepBadge tutorial={currentTutorial} totalSteps={totalSteps} size="lg" />
                  <button
                    onClick={() => onSelectTutorial(currentTutorial)}
                    className="mt-5 bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-7 py-3 rounded-full font-bold inline-flex items-center gap-2 shadow-[0_12px_28px_rgba(158,98,108,0.25)] hover:-translate-y-0.5 transition-all"
                  >
                    {isContinuing ? 'המשיכי לצפות' : isFirstEver ? 'מתחילה את הצעד הראשון' : 'לצעד הבא'}
                    <ChevronLeft size={18} />
                  </button>
                </div>
              </div>
            </section>
          )
        )}

        {/* התקדמות כללית */}
        {totalSteps > 0 && (
          <p className="text-sm text-gray-500 mb-8 text-center md:text-right">
            {completedCount} מתוך {totalSteps} צעדים הושלמו
          </p>
        )}

        {/* המסלול שלי */}
        <section className="mb-10">
          <h3 className="text-xl md:text-2xl font-bold text-[#3E3935] mb-5 flex items-center gap-2">
            <Sparkles size={20} className="text-[#C88F96]" /> המסלול שלי
          </h3>
          <JourneyTimeline
            tutorialsData={tutorialsData}
            mode="open"
            completedTutorials={completedTutorials}
            currentTutorialId={currentTutorial?.id}
            accessibleTutorialIds={accessibleTutorialIds}
            onSelectTutorial={onSelectTutorial}
          />
        </section>

        {/* חדש במועדון — לא מוצג אם אין תוכן חדש */}
        {newItems.length > 0 && (
          <section className="mb-10">
            <h3 className="text-xl font-bold text-[#3E3935] mb-4">חדש במועדון</h3>
            <div className="space-y-3">
              {newItems.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#E8EEE5] flex items-center justify-center text-[#687B63] shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#3E3935]">המפגש הבא שלנו</p>
                    <p className="text-sm text-gray-500">{item.title}</p>
                  </div>
                  {item.joinUrl && (
                    <a href={item.joinUrl} target="_blank" rel="noopener noreferrer" className="text-[#9E626C] text-sm font-bold hover:underline shrink-0">
                      לפרטי המפגש
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* הקהילה שלי */}
        <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-right">
            <p className="font-bold text-[#3E3935]">המועדון הוא לא רק הדרכות</p>
            <p className="text-sm text-gray-500">קבוצת נשים תומכת לשאלות, חיזוק וליווי לאורך הדרך.</p>
          </div>
          <a
            href={`${pricingConfig.whatsappBaseUrl}?text=${encodeURIComponent('היי רבקה, אשמח להצטרף לקבוצת המועדון')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[#E8EEE5] text-[#3E3935] font-bold px-5 py-2.5 rounded-full hover:bg-[#3E3935] hover:text-white transition-colors"
          >
            <MessageCircle size={18} /> כניסה לקבוצת WhatsApp
          </a>
        </section>
      </main>
    </div>
  )
}
