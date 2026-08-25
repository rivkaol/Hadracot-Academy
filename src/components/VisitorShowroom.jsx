import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  Heart,
  Lock,
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

function TutorialCard({ tutorial, onOpen }) {
  return (
    <button
      onClick={() => onOpen(tutorial)}
      className="group text-right bg-white rounded-[1.45rem] border border-[#3E3935]/7 overflow-hidden shadow-[0_10px_26px_rgba(62,57,53,.06)] hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(62,57,53,.1)] transition-all"
    >
      <div className="aspect-[4/3] relative bg-gradient-to-br from-[#E8EEE5] via-[#F5E8E8] to-[#FAF7F2] overflow-hidden">
        {tutorial.imageUrl && <img src={tutorial.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2F2B28]/45 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 bg-white/92 rounded-full px-2.5 py-1 text-[11px] font-bold text-[#716861] inline-flex items-center gap-1">
          <Lock size={11} /> פתוח לחברות
        </div>
      </div>
      <div className="p-4.5 p-4 sm:p-5">
        <h3 className="font-extrabold text-base sm:text-lg leading-snug mb-2">{tutorial.title}</h3>
        <p className="text-sm text-[#716861] leading-relaxed line-clamp-3">{tutorial.description || 'לחצי כדי לראות מה מחכה לך בהדרכה הזו.'}</p>
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
    <main className="bg-[#FAF7F2] text-[#3E3935] overflow-hidden">
      <section className="relative py-14 md:py-20 border-b border-[#3E3935]/7">
        <div className="absolute -top-40 -right-52 w-[34rem] h-[34rem] bg-[#C88F96]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-[#F1DFE1] text-[#9E626C] rounded-full px-4 py-2 text-sm font-extrabold mb-5"><Sparkles size={15} /> הצצה אמיתית למועדון</span>
            <h1 className="text-[clamp(2.3rem,5vw,4.6rem)] font-extrabold leading-[1.08] tracking-[-0.025em] mb-6">בואי לראות מה באמת מחכה לך בפנים.</h1>
            <p className="text-lg md:text-xl text-[#716861] leading-[1.9] max-w-3xl mx-auto mb-8">לא דף מכירה שמספר לך שיש “הרבה תוכן”, אלא המועדון עצמו — המסלול, ההדרכות והנושאים שכבר מחכים לך היום.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
              {[
                [`${track.length || 12} צעדים`, 'במסלול היסוד'],
                [`${all.length || 18} הדרכות`, 'זמינות כבר עכשיו'],
                ['2 מפגשים', 'חיים בכל חודש'],
                ['קהילה סגורה', 'להמשיך גם בין המפגשים'],
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
              <a href={pricingConfig.introCheckoutUrl} target="_blank" rel="noopener noreferrer" onClick={() => checkoutClick('showroom_hero')} className="w-full min-h-[58px] rounded-full bg-gradient-to-br from-[#C88F96] to-[#A96874] text-white font-extrabold text-lg flex items-center justify-center shadow-[0_14px_32px_rgba(169,104,116,.25)]">לפתוח את כל המועדון</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-18 md:py-24 bg-white border-b border-[#3E3935]/7">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#9E626C] font-extrabold text-sm mb-3">קודם כל — הדרך</p>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.2] mb-5">את לא נכנסת לספרייה. את נכנסת למסלול.</h2>
            <p className="text-[#716861] text-lg leading-[1.9]">כל שם של הדרכה גלוי. הגישה נעולה — לא העושר.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {STAGE_META.map((meta, index) => {
              const items = stages[meta.n] || []
              return (
                <article key={meta.n} className="bg-[#FAF7F2] rounded-[1.7rem] p-5 border border-[#3E3935]/7">
                  <p className="text-[#9E626C] text-xs font-extrabold mb-2">שלב {index + 1}</p>
                  <h3 className="font-extrabold text-2xl mb-2">{meta.title}</h3>
                  <p className="text-sm text-[#716861] leading-relaxed mb-5 min-h-[44px]">{meta.question}</p>
                  <div className="space-y-2.5">
                    {items.map((tutorial) => (
                      <button key={tutorial.id} onClick={() => openTutorial(tutorial)} className="w-full text-right bg-white rounded-xl p-3 border border-white hover:border-[#C88F96]/30 transition-colors">
                        <div className="flex items-start gap-2.5"><div className="w-7 h-7 rounded-full bg-[#C88F96]/12 text-[#9E626C] grid place-items-center shrink-0"><Lock size={12} /></div><p className="font-bold text-sm leading-snug">{tutorial.title}</p></div>
                      </button>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#687B63] font-extrabold text-sm mb-3">ומה אם מה שמעסיק אותך עכשיו הוא משהו אחר?</p>
            <h2 className="text-[clamp(2rem,4vw,3.35rem)] font-extrabold leading-[1.2] mb-5">כאן בדיוק הספרייה נכנסת לתמונה.</h2>
            <p className="text-[#716861] text-lg leading-[1.9]">פתחי כל הדרכה שמסקרנת אותך ותראי במה היא עוסקת — בלי להשאיר פרטים ובלי להתחייב.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {all.map((tutorial) => <TutorialCard key={tutorial.id} tutorial={tutorial} onOpen={openTutorial} />)}
          </div>
        </div>
      </section>

      <section className="bg-[#E8EEE5]/65 border-y border-[#3E3935]/6 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              [CalendarDays, 'שתי הדרכות חיות בחודש', 'כדי שהמועדון לא יהפוך למחסן של תכנים אלא ימשיך לנוע איתך.'],
              [BookOpen, 'כל ההקלטות נשמרות', 'אפשר לחזור, להעמיק ולצפות בקצב שמתאים לחיים שלך.'],
              [MessageCircle, 'קהילה סגורה', 'מקום לחיבור, שאלות והמשכיות בין ההדרכות.'],
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
          <span className="inline-flex items-center gap-2 bg-[#F1DFE1] text-[#9E626C] rounded-full px-4 py-2 text-sm font-extrabold mb-5"><Heart size={15} /> כל מה שראית כאן נפתח מיד</span>
          <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-extrabold leading-[1.2] mb-6">לא צריך לבחור קורס. לא צריך לדעת מאיפה להתחיל.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-right mb-8">
            {[`${track.length || 12} צעדים במסלול`, `${extras.length} הדרכות נוספות בספרייה`, '2 הדרכות חדשות בחודש', 'קהילה והקלטות', 'גישה מיידית', 'ביטול בכל עת'].map((x) => <div key={x} className="flex gap-2 items-start text-sm font-bold"><Check size={17} className="text-[#687B63] shrink-0 mt-0.5" />{x}</div>)}
          </div>
          <a href={pricingConfig.introCheckoutUrl} target="_blank" rel="noopener noreferrer" onClick={() => checkoutClick('showroom_bottom')} className="w-full max-w-xl mx-auto min-h-[64px] rounded-full bg-gradient-to-br from-[#C88F96] to-[#A96874] text-white font-extrabold text-lg md:text-xl flex items-center justify-center shadow-[0_15px_35px_rgba(169,104,116,.28)]">כן, אני רוצה להצטרף ב־{pricingConfig.introPrice} ₪</a>
          <p className="text-xs text-[#8D837D] mt-3">אחר כך {pricingConfig.membershipPrice} ₪ לחודש · אפשר לבטל בכל עת</p>
          <button onClick={onLogin} className="mt-7 text-sm text-[#716861] font-bold hover:underline">כבר חברת מועדון? התחברי כאן</button>
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
