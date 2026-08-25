import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  Heart,
  MessageCircle,
  Route,
  Sparkles,
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

function TrackLesson({ tutorial, onOpen, index }) {
  return (
    <button
      onClick={() => onOpen(tutorial)}
      className="group w-full text-right bg-white rounded-2xl border border-[#3E3935]/7 p-3.5 sm:p-4 hover:border-[#C88F96]/35 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3">
        {tutorial.imageUrl ? (
          <img src={tutorial.imageUrl} alt="" className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shrink-0" />
        ) : (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-[#E8EEE5] to-[#F1DFE1] shrink-0 grid place-items-center font-extrabold text-[#9E626C]">{index + 1}</div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-[#9E626C] font-extrabold mb-1">צעד {tutorial.recommendedOrder || index + 1}</p>
          <h4 className="font-extrabold text-sm sm:text-base leading-snug">{tutorial.title}</h4>
          <p className="text-xs text-[#716861] mt-1">לחצי להכיר את ההדרכה</p>
        </div>
        <ArrowLeft size={17} className="text-[#C88F96] shrink-0 group-hover:-translate-x-1 transition-transform" />
      </div>
    </button>
  )
}

function ExtraCard({ tutorial, onOpen }) {
  return (
    <button
      onClick={() => onOpen(tutorial)}
      className="group text-right bg-white rounded-[1.45rem] border border-[#3E3935]/7 overflow-hidden shadow-[0_10px_26px_rgba(62,57,53,.06)] hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(62,57,53,.1)] transition-all"
    >
      <div className="aspect-[4/3] relative bg-gradient-to-br from-[#E8EEE5] via-[#F5E8E8] to-[#FAF7F2] overflow-hidden">
        {tutorial.imageUrl && <img src={tutorial.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2F2B28]/35 via-transparent to-transparent" />
        <div className="absolute bottom-3 right-3 bg-white/94 rounded-full px-3 py-1 text-[11px] font-bold text-[#9E626C]">העשרה נוספת במועדון</div>
      </div>
      <div className="p-4 sm:p-5">
        <h3 className="font-extrabold text-base sm:text-lg leading-snug mb-2">{tutorial.title}</h3>
        <p className="text-sm text-[#716861] leading-relaxed line-clamp-3">{tutorial.description || 'הדרכה נוספת שמחכה לך בתוך המועדון.'}</p>
        <div className="mt-4 text-[#9E626C] text-sm font-extrabold inline-flex items-center gap-1">להצצה בהדרכה <ArrowLeft size={14} /></div>
      </div>
    </button>
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
    <main className="visitor-showroom bg-[#FAF7F2] text-[#3E3935] overflow-hidden">
      <section className="relative py-14 md:py-20 border-b border-[#3E3935]/7">
        <div className="absolute -top-40 -right-52 w-[34rem] h-[34rem] bg-[#C88F96]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-28 -left-52 w-[32rem] h-[32rem] bg-[#A8B5A2]/14 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-[#F1DFE1] text-[#9E626C] rounded-full px-4 py-2 text-sm font-extrabold mb-5"><Sparkles size={15} /> ברוכה הבאה להצצה למועדון</span>
            <h1 className="text-[clamp(2.25rem,5vw,4.45rem)] font-extrabold leading-[1.1] tracking-[-0.02em] mb-6">כאן מתחילה דרך שאפשר באמת ללכת בה.</h1>
            <p className="text-lg md:text-xl text-[#716861] leading-[1.85] max-w-3xl mx-auto mb-8">במועדון מחכה לך מסלול מסודר של צעד אחרי צעד, ובצדו הדרכות נוספות, מפגשים חיים וקהילה שתומכת בתהליך לאורך הדרך.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
              {[
                [`${track.length || 12} צעדים`, 'במסלול המלא'],
                [`${extras.length} הדרכות`, 'להעמקה והעשרה'],
                ['2 מפגשים', 'חיים בכל חודש'],
                ['קהילה', 'להמשיך יחד בין המפגשים'],
              ].map(([a, b]) => (
                <div key={a + b} className="bg-white rounded-2xl border border-[#3E3935]/7 p-4 shadow-sm">
                  <p className="font-extrabold text-lg md:text-xl">{a}</p>
                  <p className="text-xs md:text-sm text-[#716861] mt-1">{b}</p>
                </div>
              ))}
            </div>

            <div className="max-w-xl mx-auto bg-white rounded-[1.6rem] border border-white shadow-[0_20px_50px_rgba(74,61,54,.1)] p-5">
              <div className="flex items-end justify-center gap-3 mb-4">
                <div className="text-right"><p className="text-xs text-[#9E626C] font-extrabold">חודש ראשון</p><p className="text-6xl font-extrabold text-[#A96874] leading-none">{pricingConfig.introPrice}<span className="text-xl"> ₪</span></p></div>
                <div className="pb-1 text-right"><p className="line-through text-[#9B918B]">{pricingConfig.membershipPrice} ₪</p><p className="text-xs text-[#716861]">אחר כך {pricingConfig.membershipPrice} ₪ לחודש</p></div>
              </div>
              <a href={pricingConfig.introCheckoutUrl} target="_blank" rel="noopener noreferrer" onClick={() => checkoutClick('showroom_hero')} className="w-full min-h-[58px] rounded-full bg-gradient-to-br from-[#C88F96] to-[#A96874] text-white font-extrabold text-lg flex items-center justify-center shadow-[0_14px_32px_rgba(169,104,116,.25)]">אני רוצה להצטרף למסלול</a>
              <p className="text-xs text-[#8D837D] mt-3">גישה מיידית לכל המסלול ולכל תכני המועדון</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-[#3E3935]/7 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <p className="text-[#9E626C] font-extrabold text-sm mb-3">המסלול שלך במועדון</p>
            <h2 className="text-[clamp(2rem,4vw,3.45rem)] font-extrabold leading-[1.2] mb-5">כל שלב מוביל בעדינות לשלב הבא.</h2>
            <p className="text-[#716861] text-lg leading-[1.85]">אפשר לראות כאן את הדרך כולה, להכיר כל צעד, ולהבין איך התהליך מתחבר יחד למסלול אחד שלם.</p>
          </div>

          <div className="space-y-7 md:space-y-9">
            {STAGE_META.map((meta, index) => {
              const items = stages[meta.n] || []
              return (
                <article key={meta.n} className="relative grid grid-cols-1 md:grid-cols-[180px_1fr] gap-5 md:gap-8 items-start">
                  {index < STAGE_META.length - 1 && <div className="hidden md:block absolute top-24 right-[89px] w-px h-[calc(100%+2.25rem)] bg-gradient-to-b from-[#C88F96]/45 to-[#A8B5A2]/35" />}
                  <div className="relative z-10 bg-[#FAF7F2] rounded-[1.7rem] border border-[#3E3935]/7 p-5 text-center md:sticky md:top-28">
                    <div className="w-12 h-12 rounded-full bg-[#F1DFE1] text-[#9E626C] grid place-items-center font-extrabold text-lg mx-auto mb-3">{index + 1}</div>
                    <h3 className="font-extrabold text-2xl mb-2">{meta.title}</h3>
                    <p className="text-sm text-[#716861] leading-relaxed">{meta.question}</p>
                  </div>
                  <div className="bg-[#FAF7F2] rounded-[1.7rem] border border-[#3E3935]/7 p-4 sm:p-5">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {items.map((tutorial, itemIndex) => (
                        <TrackLesson key={tutorial.id} tutorial={tutorial} index={itemIndex} onOpen={openTutorial} />
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-[#E8EEE5] text-[#687B63] rounded-full px-4 py-2 text-sm font-extrabold"><Route size={16} /> זהו מסלול היסוד שמלווה אותך בתוך המועדון</div>
          </div>
        </div>
      </section>

      {extras.length > 0 && (
        <section className="py-18 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-[#687B63] font-extrabold text-sm mb-3">ולצד המסלול</p>
              <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.2] mb-5">מחכות לך גם הדרכות שמעשירות את הדרך.</h2>
              <p className="text-[#716861] text-lg leading-[1.85]">נושאים של בריאות, תודעה וחיים מאוזנים שאפשר לחזור אליהם כשזה בדיוק מה שאת צריכה עכשיו.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {extras.map((tutorial) => <ExtraCard key={tutorial.id} tutorial={tutorial} onOpen={openTutorial} />)}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#E8EEE5]/65 border-y border-[#3E3935]/6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-[#687B63] font-extrabold text-sm mb-3">והדרך ממשיכה לאורך החודש</p>
            <h2 className="text-[clamp(1.9rem,3.8vw,3rem)] font-extrabold leading-[1.2]">המועדון נותן לך מסגרת לחזור אליה שוב ושוב.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              [CalendarDays, 'שתי הדרכות חיות בחודש', 'מפגשים חדשים שמוסיפים עוד שכבה לתהליך ונותנים מקום ללמוד יחד.'],
              [BookOpen, 'כל ההקלטות נשמרות', 'אפשר לחזור, להעמיק ולצפות בקצב שמתאים לחיים שלך.'],
              [MessageCircle, 'קהילה שמלווה אותך', 'מקום לחיבור, שאלות והמשכיות נעימה בין ההדרכות.'],
            ].map(([Icon, title, body]) => (
              <div key={title} className="bg-white rounded-[1.5rem] p-6 text-center shadow-sm border border-white">
                <div className="w-11 h-11 rounded-full bg-[#C88F96]/12 text-[#9E626C] grid place-items-center mx-auto mb-4"><Icon size={20} /></div>
                <h3 className="font-extrabold text-xl mb-2">{title}</h3><p className="text-sm text-[#716861] leading-[1.8]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-[#F1DFE1] text-[#9E626C] rounded-full px-4 py-2 text-sm font-extrabold mb-5"><Heart size={15} /> הדרך שלך יכולה להתחיל כבר היום</span>
          <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.2] mb-5">מצטרפת, נכנסת למסלול ומתקדמת בקצב שלך.</h2>
          <p className="text-[#716861] text-lg leading-[1.85] mb-7 max-w-2xl mx-auto">כל המסלול, ההדרכות הנוספות, המפגשים והקהילה נפתחים לך יחד במקום אחד.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-right mb-8">
            {[`${track.length || 12} צעדים במסלול`, `${extras.length} הדרכות העשרה`, '2 הדרכות חיות בכל חודש', 'קהילה והקלטות', 'גישה מיידית', 'אפשר לבטל בכל עת'].map((x) => <div key={x} className="flex gap-2 items-start text-sm font-bold"><Check size={17} className="text-[#687B63] shrink-0 mt-0.5" />{x}</div>)}
          </div>
          <a href={pricingConfig.introCheckoutUrl} target="_blank" rel="noopener noreferrer" onClick={() => checkoutClick('showroom_final')} className="w-full max-w-lg mx-auto min-h-[62px] rounded-full bg-gradient-to-br from-[#C88F96] to-[#A96874] text-white font-extrabold text-lg flex items-center justify-center shadow-[0_14px_32px_rgba(169,104,116,.28)]">אני רוצה להתחיל ב־{pricingConfig.introPrice} ₪</a>
          <p className="text-xs text-[#8D837D] mt-3">לחודש הראשון · אחר כך {pricingConfig.membershipPrice} ₪ לחודש</p>
          <button onClick={onLogin} className="mt-6 text-sm font-bold text-[#716861] hover:text-[#9E626C] hover:underline">כבר חברת מועדון? כניסה לאזור שלך</button>
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
