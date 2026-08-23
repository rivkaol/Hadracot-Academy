import { useMemo } from 'react'
import { ChevronLeft, PlayCircle } from 'lucide-react'
import { getTrackTutorials } from '../lib/catalogHelpers'
import { STAGE_META } from '../lib/stageMeta'
import JourneyShowcase from './JourneyShowcase'
import ClubRichnessShowcase from './ClubRichnessShowcase'
import MemberAreaPreview from './MemberAreaPreview'
import IntroOfferCard from './IntroOfferCard'

// דף הבית למי שעדיין לא חברה (ולטעימה שחוזרת). "מוכרת את הדרך" — לא Grid של הדרכות.
// סדר הסקשנים במכוון: Hero → הזדהות → מפת המסלול המלאה → עושר המועדון →
// הצצה לאזור החברה → איך זה עובד → הצעת ההיכרות → הזמנה לטעימה.
export default function LandingHome({ tutorialsData, onStartTrial, onLogin, isReturningTrial }) {
  const track = useMemo(() => getTrackTutorials(tutorialsData), [tutorialsData])
  const heroPreviewSteps = useMemo(() => track.slice(0, 3), [track])
  const trialLesson = isReturningTrial ? track[0] : null

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* טקסט */}
          <div className="text-center lg:text-right">
            <h1 className="text-3xl md:text-5xl font-bold text-[#3E3935] leading-[1.3] mb-6">
              את כבר יודעת כל כך הרבה על מה נכון לך.
              <br />
              אז למה כל כך קשה באמת לעשות שינוי?
            </h1>
            <p className="text-lg text-[#716861] leading-[1.9] mb-8 max-w-xl mx-auto lg:mx-0">
              כי שינוי אמיתי לא מתחיל בעוד טיפ.
              <br />
              הוא מתחיל כשאנחנו לומדות לזהות את הדפוסים האוטומטיים שמנהלים אותנו.
              <br />
              ובהדרגה ליצור דרך חדשה.
            </p>
            <p className="text-sm font-bold text-[#9E626C] mb-1">מועדון "בריאות שבאה מהלב"</p>
            <p className="text-base text-[#3E3935] font-medium leading-[1.8] mb-8">
              לא עוד מקום לצבור בו ידע.
              <br />
              מקום שעוזר לך להפוך ידע לשינוי — צעד אחרי צעד.
            </p>

            {trialLesson ? (
              <button
                onClick={() => onStartTrial(trialLesson)}
                className="bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.3)] hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
              >
                להמשיך לצפות בטעימה שלך
                <ChevronLeft size={20} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onStartTrial(track[0])}
                  className="bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.3)] hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
                >
                  אני רוצה להתחיל ב-5 דקות טעימה
                  <ChevronLeft size={20} />
                </button>
                <p className="text-sm text-gray-500 mt-3 leading-[1.8]">
                  ללא תשלום.
                  <br />
                  ללא התחייבות.
                </p>
                <div className="mt-4">
                  <IntroOfferCard variant="compact" />
                </div>
              </>
            )}
            <div className="mt-5">
              <button onClick={onLogin} className="text-sm font-bold text-[#9E626C] hover:underline">
                כבר חברת מועדון? התחברי כאן
              </button>
            </div>
          </div>

          {/* ויזואל: תצוגה מקדימה של המסלול */}
          {heroPreviewSteps.length > 0 && (
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_20px_50px_rgba(148,163,136,0.12)] p-6 md:p-7">
              <h2 className="font-bold text-[#3E3935] text-center mb-6">המסע שלך במועדון</h2>
              <div className="flex items-center justify-between mb-7">
                {STAGE_META.map((s, i) => (
                  <div key={s.n} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <div className="w-9 h-9 rounded-full bg-[#C88F96]/15 text-[#9E626C] font-bold text-xs flex items-center justify-center">
                        0{s.n}
                      </div>
                      <span className="text-[11px] font-bold text-[#3E3935] whitespace-nowrap">{s.title}</span>
                    </div>
                    {i < STAGE_META.length - 1 && (
                      <span className="flex-1 h-px bg-gradient-to-l from-[#C88F96]/40 to-[#C88F96]/10 mx-1 mt-[-14px]" />
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2.5">
                {heroPreviewSteps.map((t, i) => (
                  <div
                    key={t.id}
                    className={`flex items-center gap-3 rounded-xl border p-3 ${i === 0 ? 'bg-[#FAF7F2] border-[#C88F96]/40' : 'bg-[#FAF7F2]/60 border-gray-100'}`}
                    style={{ opacity: 1 - i * 0.18 }}
                  >
                    <div className="shrink-0 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#9E626C]">
                      {i === 0 ? <PlayCircle size={14} /> : <span className="text-[10px] font-bold">{t.recommendedOrder}</span>}
                    </div>
                    <span className="text-sm font-bold text-[#3E3935] truncate">{t.title}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs font-bold text-[#9E626C] mt-5">
                {track.length} צעדים במסלול היסוד
              </p>
            </div>
          )}
        </div>
      </section>

      {/* הזדהות */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-6">"אבל אני כבר יודעת מה אני צריכה לעשות..."</h2>
          <p className="text-[#716861] leading-[1.9] text-lg mb-6">
            את יודעת שאת רוצה יותר בריאות.
            <br />
            יותר רוגע.
            <br />
            יותר זמן לעצמך.
            <br />
            את אפילו מתחילה.
            <br />
            <br />
            ואז מגיע יום עמוס.
            <br />
            הרגל ישן חוזר.
            <br />
            מחשבה מוכרת עולה.
            <br />
            ופתאום את שוב בדיוק באותו המקום.
          </p>
          <p className="text-[#3E3935] font-bold leading-[1.9] text-lg">
            וזה בדיוק ההבדל בין לדעת — לבין להשתנות.
            <br />
            <br />
            ידע הוא חלק מהדרך.
            <br />
            אבל ידע לבדו לא תמיד מספיק.
            <br />
            אנחנו רוצות להבין מה מפעיל אותנו אוטומטית, לזהות את הדפוסים, לתרגל תגובה אחרת —
            ולהפוך אותה בהדרגה לדרך חיים.
          </p>
        </div>
      </section>

      <JourneyShowcase tutorialsData={tutorialsData} />
      <ClubRichnessShowcase tutorialsData={tutorialsData} />
      <MemberAreaPreview tutorialsData={tutorialsData} />

      {/* איך זה עובד */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-10">איך המועדון עובד?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { t: 'צופה', d: 'בכל פעם בהדרכה אחת.' },
            { t: 'עוצרת', d: 'לוקחת ממנה דבר אחד לחיים.' },
            { t: 'ממשיכה', d: 'כשהיא מוכנה לצעד הבא.' },
          ].map((s, i) => (
            <div key={i}>
              <div className="w-10 h-10 rounded-full bg-[#E8EEE5] text-[#687B63] font-bold flex items-center justify-center mx-auto mb-3">
                {i + 1}
              </div>
              <h3 className="font-bold text-[#3E3935] mb-1">{s.t}</h3>
              <p className="text-sm text-[#716861]">{s.d}</p>
            </div>
          ))}
        </div>
        <p className="text-[#3E3935] font-bold mt-8">
          לא צריך להספיק את המועדון.
          <br />
          צריך להתקדם בו.
        </p>
      </section>

      <IntroOfferCard variant="full" />

      {/* הזמנה לטעימה — רק למי שעוד לא בטעימה */}
      {!trialLesson && track.length > 0 && (
        <section className="bg-[#E8EEE5] py-16 mt-4">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-4">
              רוצה להרגיש איך זה עובד לפני שאת מחליטה?
            </h2>
            <p className="text-[#716861] mb-7 leading-[1.9]">
              את לא צריכה להחליט עכשיו.
              <br />
              אני מזמינה אותך לפתוח את הדלת ולהתחיל איתי את הצעד הראשון.
              <br />
              5 דקות אמיתיות מתוך ההדרכה הראשונה, ללא תשלום.
            </p>
            <button
              onClick={() => onStartTrial(track[0])}
              className="bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.3)] hover:-translate-y-0.5 transition-all"
            >
              כן, אני רוצה להתחיל
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
