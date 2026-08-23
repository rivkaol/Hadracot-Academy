import { useMemo } from 'react'
import { Calendar, Layers, MessageCircle, Compass } from 'lucide-react'
import { flattenTutorials } from '../lib/catalogHelpers'
import { pricingConfig } from '../pricing'

// "וזה רק מסלול היסוד" — קולאז' אמיתי של תמונות מתוך הספרייה, לא Grid של כרטיסים
// אחידים. המטרה שהעושר *יורגש* ויראה כמו ספרייה מלאה, לא עוד רשימת יתרונות.
const BENEFITS = [
  { icon: Calendar, label: 'מפגשים חיים' },
  { icon: Layers, label: 'כל ההקלטות' },
  { icon: MessageCircle, label: 'קהילה' },
  { icon: Compass, label: 'בקצב שלך' },
]

// מיקומים/גדלים שונים במכוון לכל thumbnail בקולאז', כדי שירגיש כמו ספרייה
// עשירה ולא כמו שורת תמונות זהות.
const COLLAGE_LAYOUT = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1 mt-6',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1 -mt-3',
  'col-span-1 row-span-1 mt-4',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1 mt-6',
]

export default function ClubRichnessShowcase({ tutorialsData }) {
  const thumbnails = useMemo(
    () => flattenTutorials(tutorialsData).map((t) => t.imageUrl).filter(Boolean).slice(0, 8),
    [tutorialsData]
  )

  return (
    <section className="visitor-landing bg-[#FAF7F2] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* קולאז' */}
          {thumbnails.length > 0 && (
            <div className="grid grid-cols-3 gap-3 md:gap-4 order-2 lg:order-1">
              {thumbnails.map((src, i) => (
                <div
                  key={i}
                  className={`${COLLAGE_LAYOUT[i % COLLAGE_LAYOUT.length]} rounded-2xl overflow-hidden shadow-[0_14px_34px_rgba(74,61,54,.14)] border-2 border-white ${i % 3 === 0 ? '-rotate-1' : i % 3 === 1 ? 'rotate-1' : ''}`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover aspect-square" />
                </div>
              ))}
            </div>
          )}

          {/* טקסט */}
          <div className={`text-center lg:text-right ${thumbnails.length > 0 ? 'order-1 lg:order-2' : ''}`}>
            <h2 className="text-[clamp(1.9rem,4vw,3rem)] font-extrabold text-[#3E3935] leading-[1.2] mb-5">
              וזה רק מסלול היסוד.
            </h2>
            <p className="text-[#716861] text-lg leading-[1.9] mb-3">
              כי החיים לא מתרחשים לפי רשימת שיעורים.
            </p>
            <p className="text-[#716861] text-lg leading-[1.9] mb-8">
              לכן בתוך המועדון מחכה לך גם ספריית הדרכות עשירה
              <br />
              שאפשר לחזור אליה בכל פעם שעולה צורך חדש —
              <br />
              לחזור. להעמיק. לבחור נושא שמעסיק אותך עכשיו.
            </p>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-sm mx-auto lg:mx-0">
              {BENEFITS.map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-3 justify-center lg:justify-start">
                  <div className="w-9 h-9 rounded-full bg-[#C88F96]/12 text-[#9E626C] flex items-center justify-center shrink-0">
                    <Icon size={17} />
                  </div>
                  <span className="font-bold text-[#3E3935]">
                    {i === 0 && pricingConfig.nextLiveSession ? pricingConfig.nextLiveSession.title : label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
