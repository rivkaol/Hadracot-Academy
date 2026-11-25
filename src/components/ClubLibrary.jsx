import { useMemo } from 'react'
import { Sparkles, Leaf, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react'
import { findTutorialById, sortNewestFirst } from '../lib/catalogHelpers'
import { buildShelves, DOOR_COVERS } from '../lib/series'
import { pricingConfig } from '../pricing'
import SeriesShelf from './SeriesShelf'

// "כל ההדרכות" לחברה/VIP: המקום היחיד שבו מופיעה הרשימה המלאה.
// בלי נושא נבחר: שני נושאים גדולים (נפש / גוף) ושורת "חדש במועדון".
// נושא נבחר: רק הרשימה שלו, עם כפתור חזרה גדול.
// יש חיפוש: רשימה אחת של תוצאות, מכל הנושאים.
// הנושא שנבחר נשמר ב-App (libraryTopic), כדי שחזרה מדף הדרכה תחזיר לאותה רשימה.

function TopicCard({ image, Icon, title, subtitle, accent, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative block w-full h-48 md:h-60 rounded-[1.75rem] overflow-hidden text-right shadow-[0_14px_36px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-4"
      style={{ '--tw-ring-color': accent, background: accent }}
    >
      {image && (
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <span className="absolute bottom-0 inset-x-0 p-5 md:p-6 flex items-end gap-3 text-white">
        <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shrink-0" style={{ color: accent }}>
          <Icon size={26} aria-hidden="true" />
        </span>
        <span className="flex-1">
          <span className="block text-[26px] md:text-[30px] font-bold leading-tight drop-shadow">{title}</span>
          <span className="block text-lg mt-0.5">{subtitle}</span>
        </span>
        <span className="w-11 h-11 rounded-full bg-white text-[#2B2724] flex items-center justify-center shrink-0">
          <ChevronLeft size={26} aria-hidden="true" />
        </span>
      </span>
    </button>
  )
}

export default function ClubLibrary({
  tutorialsData,
  topic,
  onSelectTopic,
  searchQuery = '',
  completedTutorials,
  currentTutorialId,
  onSelectTutorial,
}) {
  const { series, health, other } = useMemo(() => buildShelves(tutorialsData), [tutorialsData])
  const seriesCount = series.reduce((n, s) => n + s.tutorials.length, 0) + other.tutorials.length
  const coverOf = (id) => findTutorialById(tutorialsData, id)?.imageUrl || null

  const allTutorials = useMemo(
    () => [...series.flatMap((s) => s.tutorials), ...health.tutorials, ...other.tutorials],
    [series, health, other]
  )
  const newest = useMemo(() => sortNewestFirst(allTutorials).slice(0, 2), [allTutorials])

  const query = searchQuery.trim().toLowerCase()
  const results = useMemo(() => {
    if (!query) return []
    return allTutorials.filter((t) =>
      (t.title || '').toLowerCase().includes(query) || (t.description || '').toLowerCase().includes(query)
    )
  }, [allTutorials, query])

  const shelfProps = { completedTutorials, currentTutorialId, onSelectTutorial }

  return (
    <div className="flex-1">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-[110px] md:py-12">
        {query ? (
          <>
            <h2 className="text-[28px] md:text-[34px] font-bold text-[#1F4A3A] mb-6">
              {results.length ? `נמצאו ${results.length} הדרכות` : 'לא נמצאה הדרכה כזאת'}
            </h2>
            {results.length > 0 ? (
              <SeriesShelf shelf={{ id: 'search', title: 'תוצאות', tutorials: results }} showHeader={false} {...shelfProps} />
            ) : (
              <a
                href={`${pricingConfig.whatsappBaseUrl}?text=${encodeURIComponent('היי רבקה, חיפשתי הדרכה על "' + searchQuery.trim() + '"')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#7E3F55] text-white text-[17px] font-bold px-6 py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.18)]"
              >
                <MessageCircle size={20} aria-hidden="true" />
                לא מצאת? כתבי לי בוואטסאפ
              </a>
            )}
          </>
        ) : !topic ? (
          <>
            <header className="mb-7">
              <h2 className="text-[30px] md:text-[40px] font-bold text-[#1F4A3A] mb-1.5">כל ההדרכות</h2>
              <p className="text-[#4A433E] text-[19px]">בחרי נושא, ותראי את כל ההדרכות שבו.</p>
            </header>

            <nav aria-label="נושאים" className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
              <TopicCard
                image={coverOf(DOOR_COVERS.mind)}
                Icon={Sparkles}
                title="נפש ושינוי מבפנים"
                subtitle={`${series.length} סדרות · ${seriesCount} הדרכות`}
                accent="#7E3F55"
                onClick={() => onSelectTopic('mind')}
              />
              {health.tutorials.length > 0 && (
                <TopicCard
                  image={coverOf(DOOR_COVERS.body)}
                  Icon={Leaf}
                  title="גוף ובריאות"
                  subtitle={`${health.tutorials.length} הדרכות`}
                  accent="#173A2D"
                  onClick={() => onSelectTopic('body')}
                />
              )}
            </nav>

            {newest.length > 0 && (
              <section aria-labelledby="newest-title">
                <h3 id="newest-title" className="text-[24px] md:text-[28px] font-bold text-[#1F4A3A] mb-4">חדש במועדון</h3>
                <SeriesShelf shelf={{ id: 'newest', title: 'חדש במועדון', tutorials: newest }} showHeader={false} {...shelfProps} />
              </section>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => onSelectTopic(null)}
              className="inline-flex items-center gap-1.5 text-[#2B2724] font-bold text-[17px] bg-[#F4E9ED] hover:bg-[#E9D3DB] px-5 py-3 rounded-full mb-6 transition-colors"
            >
              <ChevronRight size={22} aria-hidden="true" />
              לכל הנושאים
            </button>

            {topic === 'mind' ? (
              <section>
                <h2 className="text-[30px] md:text-[38px] font-bold text-[#1F4A3A] mb-2">נפש ושינוי מבפנים</h2>
                <p className="text-[19px] text-[#4A433E] leading-relaxed mb-7 max-w-xl">
                  כל סדרה בנויה חלק אחרי חלק. מומלץ לצפות לפי הסדר, ותמיד אפשר לחזור לכל חלק.
                </p>
                <div className="flex flex-col gap-8">
                  {series.map((shelf) => (
                    <SeriesShelf key={shelf.id} shelf={shelf} {...shelfProps} />
                  ))}
                  {other.tutorials.length > 0 && <SeriesShelf shelf={other} {...shelfProps} />}
                </div>
              </section>
            ) : (
              <section>
                <h2 className="text-[30px] md:text-[38px] font-bold text-[#1F4A3A] mb-2">גוף ובריאות</h2>
                <p className="text-[19px] text-[#4A433E] leading-relaxed mb-7 max-w-xl">
                  כל הדרכה עומדת בפני עצמה. אפשר לבחור לפי מה שמעניין אותך עכשיו.
                </p>
                <SeriesShelf shelf={health} tone="health" showHeader={false} {...shelfProps} />
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
