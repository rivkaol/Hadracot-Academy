import { ChevronLeft } from 'lucide-react'
import { pricingConfig } from '../pricing'
import { trackEvent } from '../lib/trackEvent'

// הצעת ההיכרות (29 ₪ לחודש הראשון) — מקום תצוגה יחיד, כדי שהמחיר/הקישור תמיד
// יגיעו מ-pricing.js ולא ייכתבו שוב במקומות שונים. שני מצבים:
// compact — רמז קטן שמופיע מוקדם בדף (Hero), full — הכרטיס המלא שממיר.
// במכוון בלי SALE/countdown/אדום — זו הזמנה, לא מבצע.
export default function IntroOfferCard({ variant = 'full', email, onJoin, onStartTrial }) {
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
        <span className="bg-[#687B63] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">הצעת היכרות</span>
        חודש ראשון ב-{pricingConfig.introPrice} ₪ במקום {pricingConfig.membershipPrice} ₪
      </a>
    )
  }

  return (
    <section className="visitor-landing max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#3E3935] p-8 sm:p-14 text-center shadow-[0_30px_70px_rgba(63,58,54,0.35)]">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#687B63]/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#C88F96]/20 rounded-full blur-3xl" />
        <div className="relative">
          <span className="inline-block text-xs font-bold text-[#F4ECE5] bg-white/10 px-4 py-1.5 rounded-full mb-6 tracking-wide">
            הצעת היכרות
          </span>
          <h2 className="text-[clamp(1.7rem,3.6vw,2.6rem)] font-extrabold text-white leading-[1.3] mb-8">
            אפשר להתחיל בלי החלטה גדולה.
          </h2>

          <div className="flex items-end justify-center gap-3 mb-1">
            <span className="text-xl text-white/40 line-through">{pricingConfig.membershipPrice} ₪</span>
            <span className="text-6xl font-extrabold text-white">{pricingConfig.introPrice} ₪</span>
          </div>
          <p className="text-sm font-bold text-[#E8D6BA] mb-7">לחודש הראשון</p>

          <p className="text-white/70 leading-[1.9] mb-9 max-w-sm mx-auto">
            מהחודש השני {pricingConfig.membershipPriceLabel}.
            <br />
            ללא התחייבות. אפשר לבטל בכל עת.
          </p>

          <a
            href={pricingConfig.introCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2 bg-white text-[#3E3935] px-8 py-4 rounded-full font-bold text-lg shadow-[0_14px_32px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all"
          >
            אני רוצה להיכנס למועדון ב-{pricingConfig.introPrice} ₪
            <ChevronLeft size={20} />
          </a>

          {onStartTrial && (
            <div className="mt-5">
              <button
                onClick={onStartTrial}
                className="text-sm font-bold text-white/70 hover:text-white underline underline-offset-4 transition-colors"
              >
                עוד לא בטוחה? תני לי 5 דקות
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
