import { useMemo } from 'react'
import { Route, BookOpen, Calendar, Layers, MessageCircle, Compass } from 'lucide-react'
import { flattenTutorials } from '../lib/catalogHelpers'
import { pricingConfig } from '../pricing'

// "וזה רק מסלול היסוד" — Mosaic של כל מה שיש במועדון מעבר ל-13 הצעדים, כדי שהעושר
// יורגש (לא רק "יש כאן עוד כמה שיעורים"). כרטיסים לא אחידים בכוונה.
export default function ClubRichnessShowcase({ tutorialsData }) {
  const thumbnails = useMemo(
    () => flattenTutorials(tutorialsData).map((t) => t.imageUrl).filter(Boolean).slice(0, 8),
    [tutorialsData]
  )

  return (
    <section className="bg-[#FAF7F2] py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-[#3E3935] mb-4">וזה רק מסלול היסוד.</h2>
          <p className="text-[#716861] leading-[1.8] max-w-md mx-auto">
            המועדון ממשיך להתפתח איתך.
            <br />
            יש בו עוד שכבות של תוכן, מפגשים וחיבור.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-[#C88F96]/15 text-[#9E626C] flex items-center justify-center mb-4">
              <Route size={20} />
            </div>
            <h3 className="font-bold text-[#3E3935] mb-2">מסלול היסוד</h3>
            <p className="text-sm text-[#716861] leading-[1.7] mb-4">מסלול מסודר צעד אחרי צעד.</p>
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="flex-1 h-1.5 rounded-full bg-[#C88F96]/25" />
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden">
            <div className="w-11 h-11 rounded-full bg-[#687B63]/15 text-[#687B63] flex items-center justify-center mb-4">
              <BookOpen size={20} />
            </div>
            <h3 className="font-bold text-[#3E3935] mb-2">ספריית הדרכות עשירה</h3>
            <p className="text-sm text-[#716861] leading-[1.7] mb-5">
              לחזור.
              <br />
              להעמיק.
              <br />
              ולבחור נושא שמעסיק אותך עכשיו.
            </p>
            {thumbnails.length > 0 && (
              <div className="flex -space-x-4 space-x-reverse">
                {thumbnails.map((src, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-white shadow-md shrink-0"
                    style={{ zIndex: thumbnails.length - i }}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-[#E8EEE5] text-[#687B63] flex items-center justify-center mb-4">
              <Calendar size={20} />
            </div>
            <h3 className="font-bold text-[#3E3935] mb-2">מפגשים חיים</h3>
            <p className="text-sm text-[#716861] leading-[1.7]">
              {pricingConfig.nextLiveSession
                ? pricingConfig.nextLiveSession.title
                : 'הדרכות ומפגשים חדשים שממשיכים את הדרך.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-[#C88F96]/15 text-[#9E626C] flex items-center justify-center mb-4">
              <Layers size={20} />
            </div>
            <h3 className="font-bold text-[#3E3935] mb-2">כל ההקלטות במקום אחד</h3>
            <p className="text-sm text-[#716861] leading-[1.7]">לא מפספסים כלום — הכול נשאר שמור וזמין.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-[#687B63]/15 text-[#687B63] flex items-center justify-center mb-4">
              <MessageCircle size={20} />
            </div>
            <h3 className="font-bold text-[#3E3935] mb-2">הקהילה</h3>
            <p className="text-sm text-[#716861] leading-[1.7]">
              ליווי.
              <br />
              שאלות.
              <br />
              חיזוק. נשים שמתקדמות יחד.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="w-11 h-11 rounded-full bg-[#E8EEE5] text-[#687B63] flex items-center justify-center mb-4">
              <Compass size={20} />
            </div>
            <h3 className="font-bold text-[#3E3935] mb-2">בקצב שלך</h3>
            <p className="text-sm text-[#716861] leading-[1.7]">
              אין "להספיק".
              <br />
              נכנסת, רואה את הצעד הבא, מתקדמת.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
