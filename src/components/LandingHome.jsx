import { useMemo, useState, useEffect } from 'react'
import { ChevronLeft, Route, BookOpen, Compass } from 'lucide-react'
import { getTrackTutorials } from '../lib/catalogHelpers'
import { RIVKA_PHOTO_URL } from '../constants'
import { pricingConfig } from '../pricing'
import JourneyShowcase from './JourneyShowcase'
import ClubRichnessShowcase from './ClubRichnessShowcase'
import MemberAreaPreview from './MemberAreaPreview'
import RivkaAboutSection from './RivkaAboutSection'
import LandingTestimonials from './LandingTestimonials'
import IntroOfferCard from './IntroOfferCard'
import LandingFAQ from './LandingFAQ'

// דף הבית למי שעדיין לא חברה (ולטעימה שחוזרת). לא "מסבירה מערכת" — מזמינה לעולם
// של רבקה קודם, ורק אחר כך מראה שהעולם הזה גם מסודר צעד־אחר־צעד.
// קצב הסקשנים במכוון (ראו בריף "warm visitor landing"):
// Hero+תמונה → Trust strip → הזדהות/סיפור → "מה שונה כאן" → מסלול מלא →
// עושר הספרייה → רבקה אישית → הצצה לאזור החברה → עדויות (אם קיימות) →
// הצעת 29 ₪ → הזמנה לטעימה → FAQ/CTA סופי.
export default function LandingHome({ tutorialsData, onStartTrial, onLogin, isReturningTrial }) {
  const track = useMemo(() => getTrackTutorials(tutorialsData), [tutorialsData])
  const trialLesson = isReturningTrial ? track[0] : null
  const [showStickyCta, setShowStickyCta] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > 640)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToJourney = () => {
    document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="visitor-landing flex-1">
      {/* ===== Hero ===== */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 md:pt-16 pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* קופי — ראשון ב-DOM: במובייל מוצג ראשון (לפני התמונה), בדסקטופ מוצג מימין
              (RTL, בלי צורך ב-order). */}
          <div className="text-center lg:text-right">
            <span className="inline-flex items-center gap-2 bg-[#C88F96]/12 text-[#9E626C] rounded-full px-4 py-1.5 text-sm font-bold mb-6">
              מועדון בריאות שבאה מהלב
            </span>

            <h1 className="text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold text-[#3E3935] leading-[1.15] mb-6">
              הגיע הזמן להפסיק רק להבין.
              <br />
              ולהתחיל לחיות אחרת.
            </h1>

            <p className="text-lg md:text-xl text-[#716861] leading-[1.9] mb-6 max-w-xl mx-auto lg:mx-0">
              את יודעת מה נכון לך. את באמת רוצה לעשות שינוי.
              <br />
              אבל בין הרצון לבין החיים עצמם נכנסים הרגלים, מחשבות ודפוסים
              שכבר הפכו לאוטומטיים.
              <br />
              ובדיוק שם אנחנו מתחילות לעבוד יחד.
            </p>

            <p className="text-lg md:text-xl font-bold text-[#3E3935] leading-[1.8] mb-9">
              לא עוד מקום לצבור בו ידע.
              <br />
              מקום שעוזר להפוך ידע לשינוי — צעד אחרי צעד.
            </p>

            <div className="flex flex-col lg:flex-row items-center gap-3 mb-4">
              <button
                onClick={scrollToJourney}
                className="w-full lg:w-auto bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.3)] hover:-translate-y-0.5 transition-all"
              >
                אני רוצה להכיר את המועדון
              </button>
              <button
                onClick={() => onStartTrial(trialLesson || track[0])}
                className="w-full lg:w-auto text-[#9E626C] font-bold px-4 py-3 inline-flex items-center justify-center gap-1.5 hover:underline"
              >
                {trialLesson ? 'להמשיך לצפות בטעימה שלך' : 'או להתחיל ב-5 דקות טעימה'}
                <ChevronLeft size={18} />
              </button>
            </div>

            <button onClick={onLogin} className="text-sm font-bold text-[#3E3935]/50 hover:text-[#9E626C]">
              כבר חברת מועדון? התחברי כאן
            </button>
          </div>

          {/* תמונת רבקה — שנייה ב-DOM: במובייל מוצגת אחרי הקופי, בדסקטופ משמאל (RTL). */}
          <div className="relative max-w-md mx-auto lg:max-w-none">
            <div className="rounded-[2.5rem] overflow-hidden shadow-[0_28px_65px_rgba(74,61,54,0.2)]">
              <img src={RIVKA_PHOTO_URL} alt="רבקה הולצברג" className="w-full aspect-[4/5] object-cover" />
            </div>

            <div className="hidden sm:block absolute -top-5 -right-5 bg-white/95 backdrop-blur rounded-2xl shadow-[0_14px_34px_rgba(74,61,54,0.14)] px-5 py-4 max-w-[220px] border border-white">
              <p className="text-sm font-bold text-[#3E3935] leading-snug">
                מסלול מסודר · ספרייה עשירה · מפגשים · קהילה
              </p>
            </div>

            <div className="absolute -bottom-5 -left-3 sm:-left-5 bg-white/95 backdrop-blur rounded-2xl shadow-[0_14px_34px_rgba(74,61,54,0.14)] px-4 py-3 flex items-center gap-3 border border-white">
              <img src={RIVKA_PHOTO_URL} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
              <div className="text-right">
                <p className="font-bold text-[#3E3935] text-sm leading-tight">רבקה הולצברג</p>
                <p className="text-xs text-[#716861] mt-0.5">12 שנים של ליווי והדרכה</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trust strip ===== */}
      <section className="bg-white border-y border-[#3E3935]/8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-[#3E3935]/8">
          {[
            {
              icon: Route,
              title: track.length > 0 ? `מסלול יסוד מלא — ${track.length} צעדים` : 'מסלול יסוד מלא',
              sub: 'דרך מסודרת, צעד אחרי צעד.',
            },
            { icon: BookOpen, title: 'ספריית הדרכות', sub: 'תכנים והקלטות לצפייה בקצב שלך.' },
            {
              icon: Compass,
              title: `${pricingConfig.introPrice} ₪`,
              sub: `לחודש הראשון במקום ${pricingConfig.membershipPrice} ₪`,
            },
          ].map(({ icon: Icon, title, sub }, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 px-6 py-8">
              <Icon size={22} className="text-[#9E626C] mb-1" />
              <p className="font-extrabold text-[#3E3935] text-lg">{title}</p>
              <p className="text-[#716861] text-sm">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== הזדהות / סיפור ===== */}
      <section className="bg-[#FAF7F2] py-20 md:py-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-block text-sm font-bold text-[#9E626C] bg-white px-4 py-1.5 rounded-full mb-6">
            למה זה כל כך מוכר?
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold text-[#3E3935] leading-[1.3] mb-8">
            ניסית להבין.
            <br />
            ניסית להחליט.
            <br />
            ניסית להתחיל מחדש.
          </h2>

          <p className="text-[#716861] text-lg leading-[1.9] mb-6">
            את אישה חכמה.
            <br />
            את יודעת הרבה על בריאות, על הרגלים ועל מה נכון לך.
          </p>
          <p className="text-[#716861] text-lg leading-[1.9] mb-6">
            ובכל זאת לפעמים מגיע ערב
            <br />
            ואת מגלה ששוב חזרת בדיוק לאותו המקום.
            <br />
            שוב דחית.
            <br />
            שוב ויתרת על עצמך.
            <br />
            שוב אמרת: "מחר אני מתחילה מחדש."
          </p>

          <p className="text-[#3E3935] font-bold text-lg leading-[1.9] mb-4">
            אולי הבעיה היא לא שחסר לך ידע.
          </p>
          <p className="text-[#716861] text-lg leading-[1.9] mb-6">
            הרבה מהבחירות שלנו כבר הפכו במשך השנים
            <br />
            להרגלים ולדפוסים אוטומטיים.
          </p>
          <p className="text-[#3E3935] font-bold text-lg leading-[1.9]">
            ולכן במועדון אנחנו לא רק שואלות:
            <br />
            "מה נכון לי לעשות?"
            <br />
            אנחנו לומדות גם:
            <br />
            איך להפוך את מה שאני כבר יודעת — למשהו שאני באמת חיה.
          </p>
        </div>
      </section>

      {/* ===== אז מה שונה כאן ===== */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.9rem,4.2vw,3rem)] font-extrabold text-[#3E3935] leading-[1.25]">
              אז מה שונה כאן?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                title: 'דרך שעובדת לעומק',
                body: 'לא עוד רשימת טיפים. אנחנו לומדות לזהות מה מפעיל אותנו מתחת להרגלים עצמם.',
              },
              {
                title: 'רצף שבונה את עצמו',
                body: 'את לא נכנסת לספרייה מבולגנת ושואלת את עצמך מה לראות. יש לך דרך. צעד אחד מוביל לצעד הבא.',
              },
              {
                title: 'מסגרת שמחזיקה אותך',
                body: 'הדרכות. מפגשים. קהילה. ומקום לחזור אליו גם אחרי שבוע שבו הכול התבלגן.',
              },
            ].map((p, i) => (
              <div key={i} className="text-center md:text-right">
                <h3 className="text-2xl font-extrabold text-[#3E3935] mb-4">{p.title}</h3>
                <p className="text-[#716861] text-lg leading-[1.9]">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="journey">
        <JourneyShowcase tutorialsData={tutorialsData} />
      </div>

      <ClubRichnessShowcase tutorialsData={tutorialsData} />

      <RivkaAboutSection onStartTrial={() => onStartTrial(trialLesson || track[0])} />

      <MemberAreaPreview tutorialsData={tutorialsData} />

      <LandingTestimonials />

      <IntroOfferCard variant="full" onStartTrial={() => onStartTrial(trialLesson || track[0])} />

      {/* ===== הזמנה לטעימה — רק למי שעוד לא בטעימה ===== */}
      {!trialLesson && track.length > 0 && (
        <section className="bg-white py-20 md:py-24 border-t border-[#3E3935]/8">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-block text-sm font-bold text-[#687B63] bg-[#E8EEE5] px-4 py-1.5 rounded-full mb-6">
              רוצה להרגיש לפני שאת מחליטה?
            </span>
            <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)] font-extrabold text-[#3E3935] leading-[1.3] mb-6">
              תני לי 5 דקות.
            </h2>
            <p className="text-[#716861] text-lg leading-[1.9] mb-8">
              אני מזמינה אותך לפתוח את הצעד הראשון.
              <br />
              לא סרטון הדגמה. לא טריילר.
              <br />
              5 דקות אמיתיות מתוך ההדרכה הראשונה במועדון.
            </p>
            <button
              onClick={() => onStartTrial(track[0])}
              className="bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.3)] hover:-translate-y-0.5 transition-all"
            >
              אני רוצה להתחיל את הטעימה
            </button>
          </div>
        </section>
      )}

      <LandingFAQ />

      {/* ===== Sticky CTA למובייל ===== */}
      {showStickyCta && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-3 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent">
          <button
            onClick={() => onStartTrial(trialLesson || track[0])}
            className="w-full bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white py-3.5 rounded-full font-bold shadow-[0_12px_28px_rgba(158,98,108,0.3)]"
          >
            {trialLesson ? 'להמשיך לצפות בטעימה שלך' : 'אני רוצה להתחיל ב-5 דקות טעימה'}
          </button>
        </div>
      )}
    </div>
  )
}
