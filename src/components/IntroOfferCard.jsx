import { ChevronLeft } from 'lucide-react'
import { pricingConfig } from '../pricing'
import { trackEvent } from '../lib/trackEvent'

// הצעת ההיכרות (29 ₪ לחודש הראשון) — מקום תצוגה יחיד, כדי שהמחיר/הקישור תמיד
// יגיעו מ-pricing.js ולא ייכתבו שוב במקומות שונים. שני מצבים:
// compact — רמז קטן שמופיע מוקדם בדף (Hero), full — הכרטיס המלא שממיר.
export default function IntroOfferCard({ variant = 'full', email, onJoin }) {
  const handleClick = () => {
    trackEvent('intro_offer_click', { email, variant })
    onJoin?.()
  }

  if (variant === 'compact') {
    return (
      <a
        href={pricingConfig.introCheckoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center gap-2 text-sm bg-white/70 border border-[#C88F96]/30 rounded-full px-4 py-2 text-[#9E626C] font-bold hover:bg-white transition-colors"
      >
        <span className="bg-[#9E626C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">הטבה מיוחדת</span>
        חודש ראשון ב-29 ₪ במקום 69 ₪
      </a>
    )
  }

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
      <div className="relative overflow-hidden rounded-[2rem] border border-[#9E626C]/25 bg-[#E8EEE5] p-8 sm:p-10 text-center shadow-[0_20px_50px_rgba(158,98,108,0.1)]">
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#C88F96]/20 rounded-full blur-3xl" />
        <div className="relative">
          <span className="inline-block text-xs font-bold text-[#9E626C] bg-white/70 px-3 py-1 rounded-full mb-5">
            הצעת היכרות · לזמן מוגבל
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-[#3E3935] leading-[1.4] mb-6">
            רוצה להיכנס פנימה
            <br />
            ולהתחיל את הדרך באמת?
          </h2>

          <div className="flex items-end justify-center gap-3 mb-1">
            <span className="text-lg text-gray-400 line-through">{pricingConfig.membershipPrice} ₪</span>
            <span className="text-5xl font-bold text-[#3E3935]">{pricingConfig.introPrice} ₪</span>
          </div>
          <p className="text-sm font-bold text-[#9E626C] mb-6">לחודש הראשון</p>

          <p className="text-sm text-[#716861] leading-[1.9] mb-8">
            מהחודש השני {pricingConfig.membershipPriceLabel}.
            <br />
            ללא התחייבות לתקופה קבועה.
            <br />
            אפשר לבטל בכל שלב בפנייה בוואטסאפ.
          </p>

          <a
            href={pricingConfig.introCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.3)] hover:-translate-y-0.5 transition-all"
          >
            אני רוצה להצטרף ב-{pricingConfig.introPrice} ₪
            <ChevronLeft size={20} />
          </a>

          <p className="text-sm text-[#716861] leading-[1.9] mt-6">
            גישה מיידית למסלול המלא.
            <br />
            לספריית ההדרכות.
            <br />
            למפגשים ולהקלטות.
            <br />
            ולקהילת המועדון.
          </p>
        </div>
      </div>
    </section>
  )
}
