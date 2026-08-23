import { useState } from 'react'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import { pricingConfig } from '../pricing'

// תשובות רק על עובדות שאפשר לאמת מהקוד/מ-pricing.js — לא הבטחות שלא אומתו.
const FAQ_ITEMS = [
  {
    q: 'אם אני מצטרפת עכשיו, מאיפה אני מתחילה?',
    a: 'מהצעד הראשון במסלול היסוד, וממשיכה משם צעד אחרי צעד, בקצב שלך. שאר ההדרכות פתוחות לך מהרגע הראשון, גם אם עוד לא הגעת אליהן.',
  },
  {
    q: 'ומה אם אין לי זמן למפגשים חיים?',
    a: 'כל מפגש חי מוקלט ועולה לספרייה, כך שאת יכולה לצפות בו בזמן שנוח לך. אין "לפספס" — יש רק לבחור מתי.',
  },
  {
    q: 'אפשר לצפות בקצב שלי?',
    a: 'כן. אין לוח זמנים קבוע ואין "להספיק". כל הדרכה זמינה לצפייה חוזרת בכל זמן שמתאים לך.',
  },
  {
    q: 'איך מבטלים?',
    a: 'הודעה אחת בוואטסאפ, בלי התחייבות לתקופה קבועה ובלי טפסים.',
  },
  {
    q: 'מה קורה אחרי החודש הראשון ב-29 ₪?',
    a: `מהחודש השני המחיר עובר אוטומטית ל-${pricingConfig.membershipPriceLabel} — המחיר הרגיל של המועדון. אפשר לבטל בכל שלב, גם לפני שזה קורה.`,
  },
]

export default function LandingFAQ({ onJoinClick }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <section className="visitor-landing bg-[#FAF7F2] py-20 md:py-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-[clamp(1.7rem,3.6vw,2.4rem)] font-extrabold text-[#3E3935] leading-[1.3]">
            שאלות שכדאי לדעת
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="bg-white rounded-2xl border border-[#3E3935]/8 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-right p-5 md:p-6"
                >
                  <span className="font-bold text-[#3E3935] text-lg">{item.q}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-[#9E626C] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 md:px-6 pb-5 md:pb-6 text-[#716861] leading-[1.9] text-base md:text-lg">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="text-center mt-16">
          <h3 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold text-[#3E3935] leading-[1.35] mb-7">
            מוכנה להתחיל?
          </h3>
          <a
            href={pricingConfig.introCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onJoinClick}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.3)] hover:-translate-y-0.5 transition-all"
          >
            אני רוצה להיכנס למועדון ב-{pricingConfig.introPrice} ₪
            <ChevronLeft size={20} />
          </a>
          <p className="text-sm text-[#716861] mt-4">
            יש לך שאלה לפני שאת מצטרפת?{' '}
            <a
              href={`${pricingConfig.whatsappBaseUrl}?text=${encodeURIComponent('היי רבקה, יש לי שאלה על המועדון')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9E626C] font-bold hover:underline"
            >
              אפשר לשאול אותי בוואטסאפ
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
