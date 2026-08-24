import { useMemo, useState, useEffect } from 'react'
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Compass,
  Heart,
  Lock,
  MessageCircle,
  PlayCircle,
  Route,
  Sparkles,
} from 'lucide-react'
import { flattenTutorials, getTrackTutorials, groupByStage } from '../lib/catalogHelpers'
import { STAGE_META } from '../lib/stageMeta'
import { RIVKA_PHOTO_URL } from '../constants'
import { pricingConfig } from '../pricing'

const FAQ = [
  {
    q: 'אני חייבת להשתתף במפגשים החיים?',
    a: 'לא. המפגשים מוקלטים ועולים לאזור החברה, כך שתוכלי לצפות בזמן שנוח לך. מי שאוהבת את האנרגיה של מפגש חי כמובן מוזמנת להצטרף.',
  },
  {
    q: 'מה אני מקבלת מיד אחרי ההצטרפות?',
    a: 'גישה לאזור החברה, למסלול היסוד, לספריית ההדרכות הקיימת ולקהילה. את לא צריכה לחכות למפגש הבא כדי להתחיל.',
  },
  {
    q: 'אני צריכה לצפות בכל ההדרכות?',
    a: 'ממש לא. יש מסלול שמראה לך מאיפה להתחיל, ובמקביל ספרייה שאפשר לבחור ממנה לפי מה שמעסיק אותך עכשיו. המטרה היא לא להספיק — אלא להתקדם.',
  },
  {
    q: 'יש התחייבות?',
    a: 'לא. החברות חודשית ואפשר לבטל בכל עת. החודש הראשון הוא במחיר היכרות, ולאחריו המחיר החודשי הרגיל.',
  },
]

function TutorialCover({ tutorial, className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-[1.45rem] bg-[#EEE7E1] ${className}`}>
      {tutorial?.imageUrl ? (
        <img src={tutorial.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8EEE5] via-[#F5E8E8] to-[#FAF7F2]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2F2B28]/65 via-transparent to-transparent" />
      {tutorial?.title && (
        <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-right">
          <p className="text-white font-extrabold leading-snug text-sm md:text-base drop-shadow-sm">{tutorial.title}</p>
          {tutorial.duration && <p className="text-white/75 text-xs mt-1">{tutorial.duration}</p>}
        </div>
      )}
    </div>
  )
}

function Stat({ icon: Icon, title, sub }) {
  return (
    <div className="flex flex-col items-center text-center px-4 py-6 md:py-7">
      <div className="w-10 h-10 rounded-full bg-[#C88F96]/12 text-[#9E626C] flex items-center justify-center mb-3">
        <Icon size={19} />
      </div>
      <p className="text-[#3E3935] font-extrabold text-lg leading-tight">{title}</p>
      <p className="text-[#716861] text-sm mt-1.5 leading-relaxed">{sub}</p>
    </div>
  )
}

export default function LandingHome({ tutorialsData, onStartTrial, onLogin, isReturningTrial }) {
  const allTutorials = useMemo(() => flattenTutorials(tutorialsData).filter((t) => t?.isPublished !== false), [tutorialsData])
  const track = useMemo(() => getTrackTutorials(tutorialsData), [tutorialsData])
  const stages = useMemo(() => groupByStage(tutorialsData), [tutorialsData])
  const library = useMemo(
    () => allTutorials.filter((tutorial) => !track.some((step) => step.id === tutorial.id)),
    [allTutorials, track]
  )
  const collage = useMemo(() => allTutorials.filter((t) => t.imageUrl).slice(0, 9), [allTutorials])
  const [sticky, setSticky] = useState(false)

  useEffect(() => {
    const onScroll = () => setSticky(window.scrollY > 720)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const join = () => {
    window.location.href = pricingConfig.introCheckoutUrl
  }

  const scrollToJourney = () => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main className="visitor-landing bg-[#FAF7F2] text-[#3E3935] overflow-hidden">
      {/* HERO */}
      <section className="relative">
        <div className="absolute -top-40 -right-44 w-[32rem] h-[32rem] rounded-full bg-[#C88F96]/12 blur-3xl pointer-events-none" />
        <div className="absolute top-64 -left-56 w-[34rem] h-[34rem] rounded-full bg-[#A8B5A2]/14 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 md:pt-14 pb-14 md:pb-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.02fr_.98fr] gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-right order-1">
              <span className="inline-flex items-center gap-2 bg-[#F1DFE1] text-[#9E626C] rounded-full px-4 py-2 text-sm font-extrabold mb-6">
                <Sparkles size={15} /> מועדון בריאות שבאה מהלב
              </span>

              <h1 className="text-[clamp(2.35rem,5.3vw,4.7rem)] font-extrabold leading-[1.08] tracking-[-0.025em] mb-6">
                מקום אחד שעוזר לך
                <br />
                <span className="text-[#A96874]">לא רק לדעת — אלא לחיות אחרת.</span>
              </h1>

              <p className="text-lg md:text-[1.28rem] text-[#716861] leading-[1.9] max-w-2xl mx-auto lg:mx-0 mb-7">
                מסלול מסודר לשינוי מבפנים, ספריית הדרכות עשירה בנושאי תודעה ובריאות,
                שתי הדרכות חיות בכל חודש וקהילה שממשיכה איתך גם בין המפגשים.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-x-5 gap-y-2 text-sm md:text-base font-bold text-[#3E3935]/80 mb-8">
                <span className="inline-flex items-center gap-1.5"><Check size={17} className="text-[#687B63]" /> {track.length || 12} צעדים במסלול היסוד</span>
                <span className="inline-flex items-center gap-1.5"><Check size={17} className="text-[#687B63]" /> {allTutorials.length || 18} הדרכות זמינות עכשיו</span>
                <span className="inline-flex items-center gap-1.5"><Check size={17} className="text-[#687B63]" /> ללא התחייבות</span>
              </div>

              <div className="max-w-xl mx-auto lg:mx-0 bg-white/90 border border-white rounded-[1.65rem] shadow-[0_20px_50px_rgba(74,61,54,.1)] p-5 md:p-6 mb-5">
                <div className="flex items-end justify-center lg:justify-start gap-3 mb-4">
                  <div>
                    <p className="text-xs md:text-sm text-[#9E626C] font-extrabold mb-1">חודש ראשון במחיר היכרות</p>
                    <div className="flex items-end gap-2">
                      <span className="text-6xl md:text-7xl leading-none font-extrabold text-[#A96874]">{pricingConfig.introPrice}</span>
                      <span className="text-2xl font-bold pb-1">₪</span>
                    </div>
                  </div>
                  <div className="pb-1 text-right">
                    <p className="line-through text-[#9B918B] text-lg">{pricingConfig.membershipPrice} ₪</p>
                    <p className="text-xs text-[#716861] leading-relaxed">אחר כך {pricingConfig.membershipPrice} ₪ לחודש</p>
                  </div>
                </div>

                <button
                  onClick={join}
                  className="w-full min-h-[60px] rounded-full bg-gradient-to-br from-[#C88F96] to-[#A96874] text-white font-extrabold text-lg shadow-[0_14px_32px_rgba(169,104,116,.28)] hover:-translate-y-0.5 transition-transform"
                >
                  אני רוצה להצטרף עכשיו ב־{pricingConfig.introPrice} ₪
                </button>
                <p className="text-center text-xs text-[#8D837D] mt-3">גישה מיידית · תשלום מאובטח · אפשר לבטל בכל עת</p>
              </div>

              <button onClick={scrollToJourney} className="text-[#9E626C] font-bold text-sm hover:underline inline-flex items-center gap-1.5">
                לפני שאת מצטרפת — תראי מה כבר מחכה לך בפנים <ArrowLeft size={16} />
              </button>
            </div>

            {/* genuine member-area visual assembled from live catalog assets */}
            <div className="order-2 relative max-w-[590px] mx-auto w-full">
              <div className="absolute -inset-5 bg-white/55 rounded-[3rem] rotate-2" />
              <div className="relative bg-[#FFFDF9] rounded-[2.2rem] border border-white shadow-[0_34px_80px_rgba(74,61,54,.17)] overflow-hidden">
                <div className="h-16 px-5 md:px-7 flex items-center justify-between border-b border-[#3E3935]/8 bg-white">
                  <div className="text-right">
                    <p className="font-extrabold text-sm md:text-base">המרחב שלך</p>
                    <p className="text-[11px] md:text-xs text-[#9E626C]">צמיחה · רוגע · בריאות אמיתית</p>
                  </div>
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#E8EEE5]">
                    <img src={RIVKA_PHOTO_URL} alt="רבקה הולצברג" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="p-4 md:p-6 bg-[#FAF7F2]">
                  <div className="rounded-[1.6rem] bg-gradient-to-l from-[#F1DFE1] to-[#FFF8F4] p-5 md:p-6 mb-4 text-right">
                    <p className="text-xs font-extrabold text-[#9E626C] mb-1">המסלול שלי</p>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="font-extrabold text-xl md:text-2xl">מתחילות מהצעד הראשון</h3>
                        <p className="text-[#716861] text-xs md:text-sm mt-1">דרך ברורה שממשיכה צעד אחרי צעד.</p>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#A96874] shadow-sm shrink-0"><Route size={23} /></div>
                    </div>
                    <div className="h-2 bg-white/75 rounded-full mt-5 overflow-hidden"><div className="h-full w-[18%] bg-[#C88F96] rounded-full" /></div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {allTutorials.slice(0, 4).map((tutorial, i) => (
                      <TutorialCover key={tutorial.id || i} tutorial={tutorial} className={i === 0 ? 'col-span-2 aspect-[16/7]' : 'aspect-[4/3]'} />
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[
                      ['המסלול שלי', Compass],
                      ['כל ההדרכות', BookOpen],
                      ['הקהילה', MessageCircle],
                    ].map(([label, Icon]) => (
                      <div key={label} className="bg-white rounded-xl border border-[#3E3935]/6 py-3 px-2 text-center">
                        <Icon size={17} className="mx-auto text-[#9E626C] mb-1" />
                        <p className="text-[11px] md:text-xs font-bold">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-3 md:-left-7 bg-white rounded-2xl shadow-[0_15px_35px_rgba(74,61,54,.15)] p-3.5 md:p-4 flex items-center gap-3 border border-white">
                <div className="w-10 h-10 rounded-full bg-[#E8EEE5] flex items-center justify-center text-[#687B63]"><Heart size={19} /></div>
                <div className="text-right">
                  <p className="font-extrabold text-sm">נכנסת ומתחילה מיד</p>
                  <p className="text-xs text-[#716861]">כל העולם הזה נפתח לך</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-white border-y border-[#3E3935]/7">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 divide-x divide-x-reverse divide-y lg:divide-y-0 divide-[#3E3935]/7">
          <Stat icon={Route} title={`${track.length || 12} צעדים`} sub="מסלול יסוד בנוי, לא ספרייה מבולגנת" />
          <Stat icon={BookOpen} title={`${allTutorials.length || 18}+ הדרכות`} sub="תודעה, שינוי פנימי ובריאות" />
          <Stat icon={CalendarDays} title="2 מפגשים בחודש" sub="הדרכות זום חיות עם רבקה" />
          <Stat icon={MessageCircle} title="קהילה סגורה" sub="מקום לחזור אליו בין המפגשים" />
        </div>
      </section>

      {/* IDENTIFICATION */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 text-[#9E626C] text-sm font-extrabold shadow-sm mb-6">אולי זה מוכר לך</span>
          <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-[1.22] mb-8">
            את כבר יודעת הרבה.
            <br />
            אבל לדעת — זה לא תמיד מספיק כדי להשתנות.
          </h2>
          <div className="space-y-5 text-lg md:text-xl text-[#716861] leading-[1.95]">
            <p>את יכולה לדעת מה נכון לך לאכול, איך כדאי לחשוב, למה חשוב לנוח ומה את רוצה לשנות — ועדיין למצוא את עצמך חוזרת בדיוק לאותם הרגלים.</p>
            <p className="font-bold text-[#3E3935]">לא כי חסר לך כוח. ולא כי את צריכה עוד רשימת טיפים.</p>
            <p>אלא כי שינוי אמיתי נבנה כשמבינים מה מנהל אותנו, מזהים את האוטומטים, לומדים לבחור אחרת — ואז מטמיעים את הבחירה החדשה בתוך החיים.</p>
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section id="journey" className="bg-white border-y border-[#3E3935]/7 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14 md:mb-18">
            <p className="text-[#9E626C] font-extrabold text-sm mb-3">זה לא אוסף סרטונים. זו דרך.</p>
            <h2 className="text-[clamp(2.1rem,4.7vw,3.8rem)] font-extrabold leading-[1.18] mb-5">המסלול שלך כבר בנוי.</h2>
            <p className="text-[#716861] text-lg md:text-xl leading-[1.9]">במקום להיכנס לעוד ספרייה ולשאול “מה לראות עכשיו?”, יש לך מסלול שמתקדם בארבעה שלבים ברורים.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {STAGE_META.map((meta, index) => {
              const steps = stages[meta.n] || []
              return (
                <article key={meta.n} className="relative bg-[#FAF7F2] rounded-[1.8rem] p-6 border border-[#3E3935]/7 min-h-[360px] flex flex-col overflow-hidden">
                  <span className="absolute -left-2 -top-5 text-[7.5rem] font-extrabold text-[#C88F96]/10 leading-none select-none">0{index + 1}</span>
                  <div className="relative z-10">
                    <p className="text-[#9E626C] font-extrabold text-sm mb-2">שלב {index + 1}</p>
                    <h3 className="text-2xl font-extrabold mb-2">{meta.title}</h3>
                    <p className="text-sm text-[#716861] leading-relaxed min-h-[48px]">{meta.question}</p>
                  </div>
                  <div className="relative z-10 mt-6 space-y-3 flex-1">
                    {steps.length > 0 ? steps.map((step) => (
                      <div key={step.id} className="flex gap-3 items-start bg-white/90 rounded-xl p-3 border border-white">
                        <div className="w-7 h-7 rounded-full bg-[#C88F96]/12 text-[#9E626C] flex items-center justify-center shrink-0 mt-0.5"><Lock size={12} /></div>
                        <p className="font-bold text-sm leading-snug">{step.title}</p>
                      </div>
                    )) : (
                      <p className="text-sm text-[#716861]">הצעדים בשלב הזה יופיעו כאן מתוך הקטלוג שלך.</p>
                    )}
                  </div>
                </article>
              )
            })}
          </div>

          {track.length > 0 && (
            <p className="text-center mt-10 font-extrabold text-xl text-[#3E3935]">{track.length} צעדים במסלול אחד שממשיך לבנות את עצמו.</p>
          )}
        </div>
      </section>

      {/* RICHNESS */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_.92fr] gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              {collage.length > 0 ? (
                <div className="grid grid-cols-3 auto-rows-[105px] sm:auto-rows-[145px] md:auto-rows-[170px] gap-3 md:gap-4">
                  {collage.map((tutorial, i) => {
                    const shapes = [
                      'col-span-2 row-span-2',
                      'col-span-1 row-span-1 mt-5',
                      'col-span-1 row-span-1',
                      'col-span-1 row-span-1 -mt-2',
                      'col-span-1 row-span-1 mt-3',
                      'col-span-2 row-span-1',
                      'col-span-1 row-span-1',
                      'col-span-1 row-span-1 mt-5',
                      'col-span-1 row-span-1',
                    ]
                    return <TutorialCover key={tutorial.id || i} tutorial={tutorial} className={`${shapes[i] || ''} shadow-[0_15px_35px_rgba(74,61,54,.13)] border-2 border-white ${i % 3 === 0 ? '-rotate-1' : i % 3 === 1 ? 'rotate-1' : ''}`} />
                  })}
                </div>
              ) : (
                <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-[#F1DFE1] to-[#E8EEE5]" />
              )}
            </div>

            <div className="order-1 lg:order-2 text-center lg:text-right">
              <p className="text-[#687B63] font-extrabold text-sm mb-3">וזה רק מסלול היסוד</p>
              <h2 className="text-[clamp(2.1rem,4.5vw,3.7rem)] font-extrabold leading-[1.17] mb-6">כי החיים לא מגיעים לפי סדר של שיעורים.</h2>
              <p className="text-[#716861] text-lg md:text-xl leading-[1.9] mb-7">
                לפעמים מה שמעסיק אותך עכשיו הוא כוח רצון. לפעמים עיכול. לפעמים ביטחון, ממתיקים, מערכת החיסון או פשוט הרצון לחזור לעצמך.
              </p>
              <p className="font-bold text-lg md:text-xl leading-[1.8] mb-7">לכן לצד המסלול מחכה לך גם ספריית הדרכות שאפשר לפתוח לפי מה שאת צריכה עכשיו.</p>

              <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0 text-right">
                {[
                  ['תודעה ושינוי מבפנים', Sparkles],
                  ['גוף ואורח חיים', Heart],
                  ['הדרכות מיוחדות', PlayCircle],
                  ['הקלטות לצפייה בקצב שלך', Clock3],
                ].map(([label, Icon]) => (
                  <div key={label} className="bg-white rounded-xl p-3.5 border border-[#3E3935]/7 flex items-center gap-2.5 shadow-sm">
                    <Icon size={17} className="text-[#9E626C] shrink-0" />
                    <p className="text-sm font-bold leading-snug">{label}</p>
                  </div>
                ))}
              </div>

              {library.length > 0 && <p className="mt-6 text-sm font-bold text-[#9E626C]">ועוד {library.length} הדרכות מעבר למסלול שמחכות לך כבר עכשיו.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* MONTHLY EXPERIENCE */}
      <section className="bg-[#E8EEE5]/60 border-y border-[#3E3935]/6 py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-[#687B63] font-extrabold text-sm mb-3">המועדון ממשיך איתך</p>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[1.2] mb-5">לא קונים ונעלמים. בכל חודש יש סיבה לחזור.</h2>
            <p className="text-[#716861] text-lg leading-[1.9]">הספרייה נותנת לך עומק, אבל המסגרת החודשית היא זו ששומרת על התנועה.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: CalendarDays, title: 'שתי הדרכות חיות', body: 'נושא חדש, מפגש עם רבקה וזמן לעצור וללמוד יחד.' },
              { icon: BookOpen, title: 'הכל נשמר באזור שלך', body: 'פספסת מפגש? רוצה לחזור? ההקלטות מחכות לך.' },
              { icon: MessageCircle, title: 'קהילה בין המפגשים', body: 'מקום לשאלות, שיתוף וחיבור לנשים שנמצאות באותה דרך.' },
            ].map(({ icon: Icon, title, body }) => (
              <article key={title} className="bg-white rounded-[1.6rem] p-7 text-center shadow-[0_12px_30px_rgba(74,61,54,.07)] border border-white">
                <div className="w-12 h-12 rounded-full bg-[#C88F96]/12 text-[#9E626C] mx-auto flex items-center justify-center mb-4"><Icon size={21} /></div>
                <h3 className="font-extrabold text-xl mb-2">{title}</h3>
                <p className="text-[#716861] text-sm leading-[1.8]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-[.82fr_1.18fr] gap-10 md:gap-14 items-center">
          <div className="relative max-w-sm mx-auto md:max-w-none">
            <div className="absolute inset-4 bg-[#F1DFE1] rounded-[2rem] rotate-3" />
            <img src={RIVKA_PHOTO_URL} alt="רבקה הולצברג" className="relative w-full aspect-[4/5] object-cover rounded-[2rem] shadow-[0_24px_60px_rgba(74,61,54,.17)]" />
          </div>
          <div className="text-center md:text-right">
            <p className="text-[#9E626C] font-extrabold text-sm mb-3">נעים להכיר</p>
            <h2 className="text-[clamp(2rem,4vw,3.25rem)] font-extrabold leading-[1.2] mb-6">אני רבקה, ואני לא מאמינה בשינוי שנשען רק על כוח רצון.</h2>
            <div className="space-y-4 text-[#716861] text-lg leading-[1.9]">
              <p>במשך שנים אני מלווה נשים סביב בריאות, תזונה, הרגלים והשינויים שאנחנו כל כך רוצות לעשות — אבל לא תמיד מצליחות להחזיק.</p>
              <p>המועדון נולד כדי לחבר בין הידע לבין החיים עצמם: להבין מה קורה במוח ובתודעה, לקבל כלים שאפשר ליישם, ולהיות בתוך מסגרת שמאפשרת לחזור שוב ושוב.</p>
              <p className="font-bold text-[#3E3935]">לא כדי להיות מושלמת. כדי להיות קצת יותר מחוברת, קצת יותר ברורה וקצת יותר נאמנה לעצמך.</p>
            </div>
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2] to-[#F3E5E6] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="bg-[#FFFDF9] rounded-[2.2rem] shadow-[0_30px_80px_rgba(74,61,54,.14)] border border-white overflow-hidden">
            <div className="p-7 md:p-11 text-center">
              <span className="inline-flex items-center gap-2 bg-[#E8EEE5] text-[#687B63] rounded-full px-4 py-2 text-sm font-extrabold mb-5"><Heart size={15} /> אפשר פשוט להיכנס ולנסות</span>
              <h2 className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold leading-[1.18] mb-4">כל המועדון פתוח לך מהיום הראשון.</h2>
              <p className="text-[#716861] text-lg leading-[1.9] max-w-xl mx-auto mb-8">בלי לקנות קורס נוסף, בלי לבחור חבילה ובלי לחכות. מצטרפת — ונכנסת.</p>

              <div className="flex justify-center items-end gap-3 mb-7">
                <div className="text-right">
                  <p className="text-sm font-extrabold text-[#9E626C]">חודש ראשון</p>
                  <p className="text-7xl md:text-8xl font-extrabold text-[#A96874] leading-none">{pricingConfig.introPrice}<span className="text-2xl"> ₪</span></p>
                </div>
                <div className="pb-1 text-right">
                  <p className="line-through text-[#9B918B] text-xl">{pricingConfig.membershipPrice} ₪</p>
                  <p className="text-xs text-[#716861]">אחר כך {pricingConfig.membershipPrice} ₪ לחודש</p>
                </div>
              </div>

              <div className="max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-right mb-8">
                {[
                  `${track.length || 12} צעדים במסלול היסוד`,
                  `${allTutorials.length || 18} הדרכות זמינות מיד`,
                  '2 הדרכות זום חיות בחודש',
                  'כל ההקלטות באזור האישי',
                  'קהילת חברות סגורה',
                  'ביטול בכל עת',
                ].map((item) => (
                  <div key={item} className="flex gap-2 items-start text-sm font-bold"><Check size={17} className="text-[#687B63] shrink-0 mt-0.5" /><span>{item}</span></div>
                ))}
              </div>

              <button onClick={join} className="w-full max-w-lg min-h-[64px] rounded-full bg-gradient-to-br from-[#C88F96] to-[#A96874] text-white text-lg md:text-xl font-extrabold shadow-[0_15px_35px_rgba(169,104,116,.3)] hover:-translate-y-0.5 transition-transform">
                כן, אני רוצה להצטרף ב־{pricingConfig.introPrice} ₪
              </button>
              <p className="text-xs text-[#8D837D] mt-3">התשלום מאובטח · אין תקופת התחייבות</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-[#9E626C] font-extrabold text-sm mb-3">לפני שאת מצטרפת</p>
            <h2 className="text-3xl md:text-5xl font-extrabold">כמה שאלות שחשוב לדעת</h2>
          </div>
          <div className="space-y-3">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group bg-[#FAF7F2] rounded-2xl border border-[#3E3935]/7 overflow-hidden">
                <summary className="list-none cursor-pointer p-5 md:p-6 font-extrabold flex items-center justify-between gap-4">
                  <span>{q}</span><ChevronDown size={20} className="text-[#9E626C] transition-transform group-open:rotate-180 shrink-0" />
                </summary>
                <p className="px-5 md:px-6 pb-6 text-[#716861] leading-[1.85] text-sm md:text-base">{a}</p>
              </details>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={onLogin} className="text-sm font-bold text-[#716861] hover:text-[#9E626C] hover:underline">כבר חברת מועדון? התחברי כאן</button>
          </div>
        </div>
      </section>

      {/* optional trial kept available for returning lead, but deliberately secondary */}
      {isReturningTrial && track[0] && (
        <section className="bg-[#FAF7F2] py-8 border-t border-[#3E3935]/7">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-right">
            <p className="text-sm text-[#716861]">כבר התחלת טעימה בעבר? אפשר להמשיך מאיפה שעצרת.</p>
            <button onClick={() => onStartTrial(track[0])} className="text-[#9E626C] font-extrabold text-sm inline-flex items-center gap-1 hover:underline">להמשך הטעימה <ArrowLeft size={15} /></button>
          </div>
        </section>
      )}

      {/* mobile sticky CTA */}
      <div className={`md:hidden fixed bottom-0 inset-x-0 z-[70] transition-all duration-300 ${sticky ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="bg-white/95 backdrop-blur-xl border-t border-[#3E3935]/10 shadow-[0_-10px_35px_rgba(74,61,54,.12)] p-2.5 flex items-center gap-3" style={{ paddingBottom: 'calc(.625rem + env(safe-area-inset-bottom))' }}>
          <div className="shrink-0 text-right pr-1">
            <p className="font-extrabold text-xl leading-none text-[#A96874]">{pricingConfig.introPrice} ₪</p>
            <p className="text-[10px] text-[#716861] mt-1">לחודש הראשון</p>
          </div>
          <button onClick={join} className="flex-1 min-h-[50px] rounded-full bg-gradient-to-br from-[#C88F96] to-[#A96874] text-white font-extrabold shadow-md">להצטרפות למועדון</button>
        </div>
      </div>
    </main>
  )
}
