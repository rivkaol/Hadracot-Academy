import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  Heart,
  MessageCircle,
  PlayCircle,
  Route,
} from 'lucide-react'
import { flattenTutorials, getTrackTutorials, groupByStage } from '../lib/catalogHelpers'
import { STAGE_META } from '../lib/stageMeta'
import { pricingConfig } from '../pricing'
import { trackEvent } from '../lib/trackEvent'
import VisitorTutorialModal from './VisitorTutorialModal'

function findCategoryTitle(tutorialsData, tutorialId) {
  const cat = (tutorialsData || []).find((c) => (c.tutorials || []).some((t) => t.id === tutorialId))
  return cat?.title || ''
}

function durationLabel(duration) {
  if (!duration) return ''
  const value = String(duration).trim()
  return /^\d+$/.test(value) ? `כ־${value} דקות` : value
}

function LessonCard({ tutorial, totalSteps, onOpen, compact = false }) {
  return (
    <button
      onClick={() => onOpen(tutorial)}
      className={`group w-full text-right bg-white overflow-hidden border border-[#ECE6E1] shadow-[0_10px_28px_rgba(43,39,36,.07)] hover:-translate-y-0.5 hover:shadow-[0_16px_38px_rgba(43,39,36,.11)] hover:border-[#A0627A]/35 transition-all ${compact ? 'rounded-[1.35rem]' : 'rounded-[1.6rem]'}`}
    >
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#EEF3EF] via-[#F4E9ED] to-[#FFFFFF] ${compact ? 'aspect-[16/8]' : 'aspect-[16/9]'}`}>
        {tutorial.imageUrl ? (
          <img src={tutorial.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.025] transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl font-black text-[#A0627A]/20">{tutorial.recommendedOrder || '♡'}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2724]/55 via-transparent to-transparent" />
        {tutorial.recommendedOrder != null && (
          <span className="absolute top-3 right-3 bg-white/95 text-[#7E3F55] rounded-full px-3 py-1 text-[15px] font-bold shadow-sm">
            צעד {tutorial.recommendedOrder}{totalSteps ? ` מתוך ${totalSteps}` : ''}
          </span>
        )}
      </div>
      <div className={compact ? 'p-4' : 'p-5'}>
        <h4 className={`${compact ? 'text-[16px]' : 'text-[18px]'} font-bold text-[#2B2724] leading-snug mb-2`}>{tutorial.title}</h4>
        {tutorial.description && !compact && (
          <p className="text-[16px] text-[#6B625C] leading-[1.7] line-clamp-2 mb-3">{tutorial.description}</p>
        )}
        <div className="flex items-center justify-between gap-3">
          <span className="text-[15px] font-bold text-[#7E3F55] inline-flex items-center gap-1">להכיר את ההדרכה <ArrowLeft size={14} /></span>
          {durationLabel(tutorial.duration) && <span className="text-[15px] text-[#9A918B]">{durationLabel(tutorial.duration)}</span>}
        </div>
      </div>
    </button>
  )
}

function InsideClubPreview({ track, onOpen }) {
  const first = track[0]
  const next = track.slice(1, 4)
  if (!first) return null

  return (
    <div className="relative max-w-[980px] mx-auto">
      <div className="absolute -inset-3 md:-inset-5 bg-[#F4E9ED] rounded-[2.5rem]" />
      <div className="relative bg-[#FFFFFF] rounded-[2.15rem] border border-white shadow-[0_28px_70px_rgba(43,39,36,.16)] overflow-hidden">
        <div className="px-5 md:px-8 py-5 bg-white border-b border-[#ECE6E1] flex items-center justify-between gap-4">
          <div className="text-right">
            <p className="text-[15px] font-bold text-[#7E3F55] mb-1">המסלול שלי</p>
            <h3 className="text-[22px] md:text-[28px] font-bold text-[#1F4A3A]">בכל כניסה מחכה לך הצעד הבא</h3>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-[#EEF3EF] text-[#1F4A3A] rounded-full px-4 py-2 text-[15px] font-bold">
            <Route size={15} /> {track.length} צעדים בדרך
          </div>
        </div>

        <div className="p-4 md:p-7 bg-[#FFFFFF]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.14fr_.86fr] gap-5">
            <button
              onClick={() => onOpen(first)}
              className="group relative overflow-hidden rounded-[1.7rem] min-h-[330px] md:min-h-[390px] text-right shadow-[0_14px_36px_rgba(43,39,36,.12)]"
            >
              {first.imageUrl ? (
                <img src={first.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#EEF3EF] to-[#F4E9ED]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B2724]/80 via-[#2B2724]/10 to-transparent" />
              <div className="absolute top-4 right-4 bg-[#F4E9ED] text-[#7E3F55] rounded-full px-4 py-2 text-[15px] font-bold">הצעד הראשון שלך</div>
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white">
                <p className="text-[15px] font-bold text-white/90 mb-2">צעד 1 מתוך {track.length}</p>
                <h4 className="text-[27px] md:text-[34px] font-bold leading-tight mb-3">{first.title}</h4>
                {first.description && <p className="text-[16px] md:text-[15px] text-white/90 leading-[1.7] line-clamp-2 max-w-xl mb-4">{first.description}</p>}
                <span className="inline-flex items-center gap-2 bg-white text-[#2B2724] rounded-full px-5 py-2.5 text-[16px] font-bold">להצצה בהדרכה <ArrowLeft size={15} /></span>
              </div>
            </button>

            <div className="flex flex-col gap-3">
              <div className="bg-white rounded-[1.45rem] p-5 border border-[#ECE6E1] shadow-sm">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[15px] text-[#7E3F55] font-bold">ההתקדמות שלך</p>
                    <p className="text-[20px] font-bold mt-1">הדרך כבר מסודרת עבורך</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#EEF3EF] text-[#1F4A3A] flex items-center justify-center"><Route size={21} /></div>
                </div>
                <div className="h-2.5 bg-[#F1ECE7] rounded-full overflow-hidden"><div className="h-full w-[9%] rounded-full bg-[#A0627A]" /></div>
                <p className="text-[15px] text-[#8D837D] mt-2">מתחילות בצעד הראשון ומתקדמות בקצב שלך</p>
              </div>

              {next.map((tutorial) => (
                <button key={tutorial.id} onClick={() => onOpen(tutorial)} className="bg-white rounded-[1.35rem] border border-[#ECE6E1] p-3 flex items-center gap-3 text-right hover:border-[#A0627A]/35 hover:shadow-sm transition-all">
                  {tutorial.imageUrl ? <img src={tutorial.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" /> : <div className="w-16 h-16 rounded-xl bg-[#F4E9ED] shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-bold text-[#7E3F55]">צעד {tutorial.recommendedOrder}</p>
                    <p className="text-[15px] font-bold leading-snug mt-1">{tutorial.title}</p>
                  </div>
                  <ArrowLeft size={15} className="text-[#A0627A] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VisitorShowroom({ tutorialsData, onStartTrial, onLogin }) {
  const [selected, setSelected] = useState(null)
  const all = useMemo(() => flattenTutorials(tutorialsData).filter((t) => t?.isPublished !== false), [tutorialsData])
  const track = useMemo(() => getTrackTutorials(tutorialsData), [tutorialsData])
  const stages = useMemo(() => groupByStage(tutorialsData), [tutorialsData])
  const extras = useMemo(() => all.filter((t) => !track.some((x) => x.id === t.id)), [all, track])

  useEffect(() => {
    trackEvent('showroom_view', { meta: { tutorials: all.length, trackSteps: track.length } })
  }, [all.length, track.length])

  const openTutorial = (tutorial) => {
    trackEvent('tutorial_card_open', { tutorialId: tutorial.id, meta: { title: tutorial.title } })
    setSelected(tutorial)
  }

  const checkoutClick = (placement) => {
    trackEvent('showroom_checkout_click', { meta: { placement } })
  }

  return (
    <main
      className="visitor-showroom bg-[#FFFFFF] text-[#2B2724] overflow-hidden"
      style={{ fontFamily: '"Rubik", Arial, "Segoe UI", sans-serif' }}
    >
      <section className="relative pt-12 md:pt-16 pb-16 md:pb-20 bg-[#6A3447] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <img src="/img/club/rivka.jpg" alt="רבקה הולצברג" width="880" height="1100" className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-5 rounded-full object-cover object-[center_20%] ring-4 ring-[#D9BD86]/60" />
            <p className="inline-flex items-center gap-3 text-[15px] font-medium text-[#E9D3DB] mb-5"><span aria-hidden="true" className="w-8 h-px bg-[#D9BD86]" />ברוכה הבאה למועדון בריאות שבאה מהלב<span aria-hidden="true" className="w-8 h-px bg-[#D9BD86]" /></p>
            <h1 className="text-[clamp(2.25rem,5vw,4.55rem)] font-bold leading-[1.1] tracking-[-0.025em] mb-6 text-white">מסלול שמלווה אותך מצעד ראשון<br className="hidden md:block" /> לשינוי שהופך לחלק מהחיים.</h1>
            <p className="text-[18px] md:text-[21px] text-[#F8F3EC]/85 leading-[1.85] max-w-3xl mx-auto mb-8">בכל כניסה את יודעת איפה את נמצאת, מה הצעד הבא שלך, ואילו כלים מחכים לך בדרך — יחד עם מפגשים חיים, הדרכות העשרה וקהילה.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
              {[
                [`${track.length || 12} צעדים`, 'במסלול המלא'],
                [`${all.length || 18} הדרכות`, 'שכבר מחכות לך'],
                ['2 מפגשים', 'חיים בכל חודש'],
                ['קהילה', 'שממשיכה איתך בדרך'],
              ].map(([value, label]) => (
                <div key={value + label} className="bg-white/10 rounded-[1.25rem] border border-white/20 p-4">
                  <p className="font-bold text-[20px] md:text-[22px] text-white">{value}</p>
                  <p className="text-[16px] text-[#E9D3DB] mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="max-w-[560px] mx-auto bg-white text-[#2B2724] rounded-[1.6rem] border-t-[6px] border-[#D9BD86] shadow-[0_24px_50px_rgba(0,0,0,.25)] p-5 md:p-6">
              <p className="text-[15px] font-bold text-[#7E3F55] mb-2">חברות חודשית · ביטול בכל עת</p>
              <div className="flex items-end justify-center gap-3 mb-4">
                <p className="text-[64px] leading-none font-bold text-[#6A3447]">{pricingConfig.membershipPrice}<span className="text-[22px]"> ₪</span></p>
                <div className="text-right pb-1"><p className="text-[15px] text-[#6B625C]">לחודש</p></div>
              </div>
              <a href={pricingConfig.membershipCheckoutUrl} target="_blank" rel="noopener noreferrer" onClick={() => checkoutClick('showroom_hero')} className="w-full min-h-[58px] rounded-full bg-[#7E3F55] text-white font-bold text-[18px] flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-transform">אני רוצה להתחיל את המסלול</a>
              <p className="text-[15px] text-[#6B625C] mt-3">גישה מיידית · אפשר לבטל בכל עת</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24 border-b border-[#ECE6E1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
            <p className="text-[#7E3F55] font-bold text-[15px] mb-3">כך זה מרגיש מבפנים</p>
            <h2 className="text-[clamp(2rem,4vw,3.45rem)] font-bold leading-[1.2] mb-5">את נכנסת — והדרך כבר מחכה לך.</h2>
            <p className="text-[#6B625C] text-[17px] md:text-[19px] leading-[1.85]">אזור החברה בנוי סביב ההתקדמות שלך. הצעד הנוכחי מקבל את מרכז הבמה, והמשך הדרך נשאר מול העיניים.</p>
          </div>
          <InsideClubPreview track={track} onOpen={openTutorial} />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <p className="text-[#7E3F55] font-bold text-[15px] mb-3">המסלול המלא</p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.2] mb-5">ארבעה שלבים. דרך אחת שמתחברת יחד.</h2>
            <p className="text-[#6B625C] text-[17px] md:text-[19px] leading-[1.85]">כל שלב נותן בסיס לשלב הבא, וכל הדרכה היא צעד ממשי בתוך התהליך.</p>
          </div>

          <div className="space-y-8 md:space-y-12">
            {STAGE_META.map((meta, stageIndex) => {
              const items = stages[meta.n] || []
              return (
                <article key={meta.n} className="bg-white rounded-[2rem] border border-[#ECE6E1] shadow-[0_14px_36px_rgba(43,39,36,.06)] overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
                    <div className="bg-[#F4E9ED] p-7 md:p-8 flex flex-col justify-between min-h-[220px] border-r-[6px]" style={{ borderColor: ['#E9D3DB', '#C99AAB', '#A0627A', '#6A3447'][stageIndex % 4] }}>
                      <div>
                        <p className="text-[72px] leading-none font-bold mb-4" style={{ color: ['#E9D3DB', '#C99AAB', '#A0627A', '#6A3447'][stageIndex % 4] }}>0{stageIndex + 1}</p>
                        <p className="text-[16px] font-bold text-[#7E3F55] mb-2">שלב {stageIndex + 1}</p>
                        <h3 className="text-[30px] font-bold leading-tight mb-3 text-[#1F4A3A]">{meta.title}</h3>
                        <p className="text-[15px] text-[#6B625C] leading-[1.75]">{meta.question}</p>
                      </div>
                      <div className="mt-5 inline-flex items-center gap-2 text-[16px] font-bold text-[#1F4A3A]"><Route size={14} /> {items.length} צעדים בשלב הזה</div>
                    </div>

                    <div className="p-5 md:p-7">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {items.map((tutorial) => (
                          <LessonCard key={tutorial.id} tutorial={tutorial} totalSteps={track.length} onOpen={openTutorial} compact />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-10 md:mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-[#EEF3EF] text-[#1F4A3A] rounded-full px-5 py-2.5 text-[15px] font-bold"><Route size={16} /> זה המסלול שמוביל את חוויית המועדון</div>
          </div>
        </div>
      </section>

      {extras.length > 0 && (
        <section className="bg-white py-16 md:py-24 border-y border-[#ECE6E1]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-[.8fr_1.2fr] gap-10 lg:gap-14 items-start">
              <div className="text-center lg:text-right lg:sticky lg:top-28">
                <p className="text-[#1F4A3A] font-bold text-[15px] mb-3">ועוד שכבה שמחכה לך</p>
                <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.2] mb-5">הדרכות העשרה שחוזרות איתך לחיים עצמם.</h2>
                <p className="text-[#6B625C] text-[17px] leading-[1.85] mb-6">לצד המסלול מחכות לך הדרכות בנושאי בריאות, תודעה ואורח חיים — כדי שתוכלי להעמיק גם במה שמעסיק אותך עכשיו.</p>
                <div className="inline-flex items-center gap-2 bg-[#FFFFFF] border border-[#ECE6E1] rounded-full px-4 py-2 text-[15px] font-bold text-[#7E3F55]"><BookOpen size={15} /> {extras.length} הדרכות העשרה כרגע</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {extras.map((tutorial) => <LessonCard key={tutorial.id} tutorial={tutorial} onOpen={openTutorial} />)}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#EEF3EF]/65 py-16 md:py-20 border-b border-[#ECE6E1]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-[#1F4A3A] font-bold text-[15px] mb-3">והמועדון ממשיך איתך לאורך החודש</p>
            <h2 className="text-[clamp(1.9rem,3.8vw,3rem)] font-bold leading-[1.2]">מסלול קבוע, תוכן שמתחדש ומקום לחזור אליו.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              [CalendarDays, 'שתי הדרכות חיות בחודש', 'מפגשים חדשים שמוסיפים עוד עומק וכלים לדרך.'],
              [PlayCircle, 'כל ההקלטות נשמרות', 'אפשר לחזור לכל הדרכה בזמן שנוח לך ולהעמיק בקצב שלך.'],
              [MessageCircle, 'קהילה שמלווה אותך', 'מקום לשאלות, חיבור והמשכיות נעימה בין המפגשים.'],
            ].map(([Icon, title, body]) => (
              <div key={title} className="bg-white rounded-[1.55rem] p-6 text-center shadow-[0_9px_25px_rgba(43,39,36,.05)] border border-white">
                <div className="w-12 h-12 rounded-full bg-[#F4E9ED] text-[#7E3F55] flex items-center justify-center mx-auto mb-4"><Icon size={21} /></div>
                <h3 className="font-bold text-[20px] mb-2">{title}</h3>
                <p className="text-[16px] text-[#6B625C] leading-[1.8]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#6A3447] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <p className="inline-flex items-center gap-3 text-[15px] font-medium text-[#E9D3DB] mb-5"><Heart size={16} className="text-[#D9BD86]" /> הדרך שלך יכולה להתחיל כבר היום</p>
          <h2 className="text-[clamp(2rem,4vw,3.45rem)] font-bold leading-[1.2] mb-5 text-white">כל מה שראית כאן נפתח לך יחד.</h2>
          <p className="text-[#F8F3EC]/85 text-[18px] md:text-[19px] leading-[1.85] mb-8 max-w-2xl mx-auto">המסלול המלא, ההדרכות הנוספות, המפגשים החיים והקהילה — במרחב אחד שמלווה אותך לאורך הדרך.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-right mb-8">
            {[`${track.length || 12} צעדים במסלול`, `${extras.length} הדרכות העשרה`, '2 הדרכות חיות בכל חודש', 'כל ההקלטות באזור שלך', 'גישה מיידית', 'אפשר לבטל בכל עת'].map((item) => (
              <div key={item} className="flex gap-2 items-start text-[16px] font-bold text-white"><Check size={18} className="text-[#D9BD86] shrink-0 mt-0.5" /><span>{item}</span></div>
            ))}
          </div>

          <a href={pricingConfig.membershipCheckoutUrl} target="_blank" rel="noopener noreferrer" onClick={() => checkoutClick('showroom_final')} className="w-full max-w-lg mx-auto min-h-[64px] rounded-full bg-[#F8F3EC] text-[#6A3447] font-bold text-[19px] flex items-center justify-center shadow-[0_4px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-transform">אני רוצה להצטרף למועדון</a>
          <p className="text-[16px] text-[#E9D3DB] mt-3">{pricingConfig.membershipPriceLabel} · אפשר לבטל בכל עת</p>
          <button onClick={onLogin} className="mt-6 text-[15px] font-bold text-[#F4E9ED] hover:text-white underline underline-offset-4">כבר חברת מועדון? כניסה לאזור שלך</button>
        </div>
      </section>

      {selected && (
        <VisitorTutorialModal
          tutorial={selected}
          categoryTitle={findCategoryTitle(tutorialsData, selected.id)}
          onClose={() => setSelected(null)}
          onStartTrial={(tutorial) => {
            setSelected(null)
            onStartTrial?.(tutorial)
          }}
        />
      )}
    </main>
  )
}
