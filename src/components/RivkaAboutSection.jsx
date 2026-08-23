import { ChevronLeft } from 'lucide-react'
import { RIVKA_PHOTO_URL } from '../constants'

// אזור אישי של רבקה — לא Grid, לא כרטיס מכירה. תמונה גדולה + קול אישי, כדי
// שהאורחת תפגוש אדם ולא מערכת. אותה תמונה בדיוק כמו ב-public/join.html.
export default function RivkaAboutSection({ onStartTrial }) {
  return (
    <section className="visitor-landing bg-white py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1fr] gap-10 lg:gap-16 items-center">
          <div className="mx-auto lg:mx-0 w-full max-w-sm">
            <div className="rounded-[2.5rem] overflow-hidden shadow-[0_28px_60px_rgba(74,61,54,0.18)] border-8 border-[#FAF7F2]">
              <img src={RIVKA_PHOTO_URL} alt="רבקה הולצברג" className="w-full aspect-[4/5] object-cover" />
            </div>
          </div>

          <div className="text-center lg:text-right">
            <span className="inline-block text-sm font-bold text-[#9E626C] bg-[#C88F96]/10 px-4 py-1.5 rounded-full mb-5">
              נעים מאוד, אני רבקה
            </span>
            <h2 className="text-[clamp(1.7rem,3.4vw,2.5rem)] font-extrabold text-[#3E3935] leading-[1.35] mb-6">
              רציתי ליצור מקום שלא נעלמים ממנו אחרי שבוע.
            </h2>
            <p className="text-[#716861] text-lg leading-[1.9] mb-4">
              אני לא רוצה שתיכנסי לעוד מקום
              <br />
              שתפתחי פעם אחת ותשכחי ממנו.
            </p>
            <p className="text-[#716861] text-lg leading-[1.9] mb-4">
              רציתי ליצור מקום שאפשר לחזור אליו.
              <br />
              גם אחרי יום שבו הכול הלך בדיוק כמו שרצית.
              <br />
              וגם אחרי שבוע שבו שום דבר לא הסתדר.
            </p>
            <p className="text-[#3E3935] font-bold text-lg leading-[1.9] mb-8">
              מקום שמחזיר אותך בעדינות לשאלה:
              <br />
              מה הצעד הבא שלי עכשיו?
            </p>

            {onStartTrial && (
              <button
                onClick={onStartTrial}
                className="inline-flex items-center gap-2 text-[#9E626C] font-bold hover:underline"
              >
                להתחיל איתי
                <ChevronLeft size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
