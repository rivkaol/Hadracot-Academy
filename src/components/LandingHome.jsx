import { useMemo } from 'react'
import { ChevronLeft, Lock, PlayCircle } from 'lucide-react'
import { getTrackTutorials } from '../lib/catalogHelpers'
import StepBadge from './StepBadge'
import { pricingConfig } from '../pricing'

const STAGES = [
  { n: 1, title: 'להבין', desc: 'מה באמת מנהל אותי — כוח רצון, כאב ועונג, הרגלים ומה גורם לנו להתחיל ולהפסיק.' },
  { n: 2, title: 'לזהות', desc: 'מה פועל אצלי באופן אוטומטי — תפיסות, אמונות, מחשבות ודפוסים שחוזרים שוב ושוב.' },
  { n: 3, title: 'לבחור אחרת', desc: 'איך יוצרים תגובה חדשה — וכיצד הופכים הבנה למשהו מעשי.' },
  { n: 4, title: 'להטמיע', desc: 'איך גורמים לשינוי להחזיק — תרגול, חזרה, המשכיות וחיבור בין התודעה לחיים עצמם.' },
]

// דף הבית למי שעדיין לא חברה (ולטעימה שחוזרת). "מוכרת את הדרך" — לא Grid של הדרכות.
export default function LandingHome({ tutorialsData, onStartTrial, onLogin, isReturningTrial }) {
  const teaserTutorials = useMemo(() => getTrackTutorials(tutorialsData).slice(0, 3), [tutorialsData])
  const totalSteps = useMemo(() => getTrackTutorials(tutorialsData).length, [tutorialsData])
  const trialLesson = isReturningTrial ? teaserTutorials[0] : null

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-[#3E3935] leading-[1.25] mb-6">
          את כבר יודעת כל כך הרבה על מה נכון לך.
          <br />
          אז למה כל כך קשה באמת לעשות שינוי?
        </h1>
        <p className="text-lg text-[#716861] leading-[1.8] mb-8 max-w-xl mx-auto">
          כי שינוי אמיתי לא מתחיל בעוד טיפ. הוא מתחיל כשאנחנו לומדות לזהות את הדפוסים האוטומטיים שמנהלים אותנו —
          ובהדרגה יוצרות דרך חדשה.
        </p>
        <p className="text-sm font-bold text-[#9E626C] mb-1">מועדון "בריאות שבאה מהלב"</p>
        <p className="text-base text-[#3E3935] font-medium mb-8">מסע מעשי מתודעה לשינוי — צעד אחרי צעד.</p>

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
              onClick={() => onStartTrial(teaserTutorials[0])}
              className="bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.3)] hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
            >
              אני רוצה להתחיל את המסע שלי
              <ChevronLeft size={20} />
            </button>
            <p className="text-sm text-gray-500 mt-3">אפשר להתחיל ב-5 דקות טעימה ללא תשלום</p>
          </>
        )}
        <div className="mt-4">
          <button onClick={onLogin} className="text-sm font-bold text-[#9E626C] hover:underline">
            אני כבר חברת מועדון
          </button>
        </div>
      </section>

      {/* הזדהות */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-5">"אבל אני כבר יודעת מה אני צריכה לעשות..."</h2>
          <p className="text-[#716861] leading-[1.9] text-lg mb-6">
            את יודעת שאת רוצה יותר בריאות, יותר רוגע, יותר זמן לעצמך. ואת אפילו מתחילה. אבל אז מגיע יום עמוס, הרגל
            ישן חוזר, מחשבה מוכרת עולה — ואת מוצאת את עצמך שוב באותו המקום.
          </p>
          <p className="text-[#3E3935] font-bold leading-[1.9] text-lg">
            ידע הוא חשוב — אבל ידע לבדו לא תמיד יוצר שינוי. חלק גדול מהבחירות שלנו הופכות במשך השנים להרגלים ודפוסים
            אוטומטיים. ובדיוק שם מתחילה העבודה של המועדון: להבין → לזהות → לבחור אחרת → להטמיע.
          </p>
        </div>
      </section>

      {/* מפת השינוי */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-[#3E3935] mb-3">שינוי לא קורה ביום אחד.<br />לכן בניתי לך דרך.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STAGES.map((s) => (
            <div key={s.n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#C88F96]/15 text-[#9E626C] font-bold flex items-center justify-center mb-4">
                {s.n}
              </div>
              <h3 className="font-bold text-[#3E3935] text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-[#716861] leading-[1.7]">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-[#3E3935] font-bold text-lg mt-10">
          את לא צריכה לראות הכול. את רק צריכה לדעת מה הצעד הבא שלך.
        </p>
      </section>

      {/* טעימת תוכן */}
      {teaserTutorials.length > 0 && (
        <section className="bg-white border-y border-gray-100 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-8 text-center">קצת ממה שמחכה לך בדרך</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {teaserTutorials.map((t) => (
                <div key={t.id} className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-gray-100">
                  <div className="aspect-video bg-[#3E3935]/5 relative">
                    {t.imageUrl && <img src={t.imageUrl} alt={t.title} className="absolute inset-0 w-full h-full object-cover" />}
                  </div>
                  <div className="p-5">
                    <StepBadge tutorial={t} totalSteps={totalSteps} size="sm" />
                  </div>
                </div>
              ))}
              <div className="bg-[#FAF7F2]/60 rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center">
                <Lock size={28} className="text-[#C88F96]/50 mb-3" />
                <p className="text-sm text-gray-500 font-medium">ויש עוד דרך שלמה שממשיכה מכאן...</p>
              </div>
            </div>
          </div>
        </section>
      )}

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
        <p className="text-[#3E3935] font-bold mt-8">לא צריך להספיק את המועדון. צריך להתקדם בו.</p>
      </section>

      {/* טעימת 5 דקות */}
      {!trialLesson && (
        <section className="bg-[#E8EEE5] py-16">
          <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-4">רוצה להרגיש איך זה עובד לפני שאת מחליטה?</h2>
            <p className="text-[#716861] mb-7 leading-[1.8]">אני מזמינה אותך להתחיל איתי את הצעד הראשון. 5 דקות אמיתיות מתוך המועדון — ללא תשלום.</p>
            <button
              onClick={() => onStartTrial(teaserTutorials[0])}
              className="bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.3)] hover:-translate-y-0.5 transition-all"
            >
              כן, אני רוצה להתחיל
            </button>
          </div>
        </section>
      )}

      {/* אזור מכירה — תמיד אחרון */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-8">מוכנה להמשיך איתי?</h2>
        <ul className="text-right space-y-3 mb-10 max-w-md mx-auto text-[#3E3935]">
          {[
            'כל מסלול ההדרכות הקיים',
            'הדרכות חדשות שממשיכות את התהליך',
            'ההקלטות במקום אחד',
            'המפגשים החיים של המועדון',
            'הקהילה והעדכונים',
            'אפשרות לחזור לכל צעד מתי שאת רוצה',
          ].map((b) => (
            <li key={b} className="flex items-center gap-2">
              <PlayCircle size={16} className="text-[#687B63] shrink-0" />
              {b}
            </li>
          ))}
        </ul>
        <a
          href={pricingConfig.membershipCheckoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.3)] hover:-translate-y-0.5 transition-all"
        >
          להצטרפות למועדון — {pricingConfig.membershipPriceLabel}
        </a>
      </section>
    </div>
  )
}
