import { BookOpen, Clock3, PlayCircle, Sparkles, X } from 'lucide-react'
import { pricingConfig } from '../pricing'
import { trackEvent } from '../lib/trackEvent'

export default function VisitorTutorialModal({ tutorial, categoryTitle, onClose, onStartTrial }) {
  if (!tutorial) return null

  const join = () => {
    trackEvent('showroom_checkout_click', {
      tutorialId: tutorial.id,
      meta: { placement: 'tutorial_modal', title: tutorial.title },
    })
  }

  const trial = () => {
    trackEvent('showroom_trial_click', {
      tutorialId: tutorial.id,
      meta: { placement: 'tutorial_modal', title: tutorial.title },
    })
    onStartTrial?.(tutorial)
  }

  return (
    <div
      className="fixed inset-0 z-[90] bg-[#2F2B28]/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-5"
      dir="rtl"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.() }}
    >
      <div className="visitor-showroom w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto bg-[#FFFDF9] rounded-t-[2rem] sm:rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,.3)] border border-white">
        <div className="relative">
          <div className="aspect-[16/8] sm:aspect-[16/7] bg-gradient-to-br from-[#E8EEE5] via-[#F5E8E8] to-[#FAF7F2] overflow-hidden">
            {tutorial.imageUrl && <img src={tutorial.imageUrl} alt="" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-[#2F2B28]/65 via-transparent to-transparent" />
          </div>
          <button onClick={onClose} aria-label="סגירה" className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/95 text-[#3E3935] grid place-items-center shadow-lg"><X size={20} /></button>
          <div className="absolute bottom-0 inset-x-0 p-5 sm:p-7 text-right">
            <span className="inline-flex items-center gap-1.5 bg-white/92 text-[#9E626C] text-xs font-extrabold px-3 py-1.5 rounded-full mb-3"><Sparkles size={13} /> {categoryTitle || 'מתוך המועדון'}</span>
            <h2 className="text-white text-2xl sm:text-4xl font-extrabold leading-tight drop-shadow-sm">{tutorial.title}</h2>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {tutorial.recommendedOrder != null && (
              <span className="inline-flex items-center gap-1.5 bg-[#F1DFE1] text-[#9E626C] rounded-full px-3 py-1.5 text-xs font-bold"><BookOpen size={13} /> צעד {tutorial.recommendedOrder} במסלול</span>
            )}
            {tutorial.duration && (
              <span className="inline-flex items-center gap-1.5 bg-[#E8EEE5] text-[#687B63] rounded-full px-3 py-1.5 text-xs font-bold"><Clock3 size={13} /> {tutorial.duration}</span>
            )}
          </div>

          <div className="text-[#716861] text-base sm:text-lg leading-[1.9] mb-7">
            <p>{tutorial.description || 'הדרכה שמעמיקה בנושא הזה ונותנת לך עוד צעד ברור בתוך הדרך שלך במועדון.'}</p>
          </div>

          <div className="rounded-[1.45rem] bg-[#FAF7F2] border border-[#3E3935]/7 p-5 sm:p-6 mb-6 text-right">
            <h3 className="font-extrabold text-lg mb-2">כחברת מועדון ההדרכה הזו מחכה לך במלואה</h3>
            <p className="text-sm text-[#716861] leading-relaxed">יחד איתה נפתח לך כל המסלול, ההדרכות הנוספות, המפגשים החיים והקהילה — הכול במקום אחד.</p>
          </div>

          <a href={pricingConfig.introCheckoutUrl} target="_blank" rel="noopener noreferrer" onClick={join} className="w-full min-h-[60px] rounded-full bg-gradient-to-br from-[#C88F96] to-[#A96874] text-white font-extrabold text-lg shadow-[0_14px_32px_rgba(169,104,116,.28)] flex items-center justify-center text-center px-5 hover:-translate-y-0.5 transition-transform">להצטרף למסלול ב־{pricingConfig.introPrice} ₪</a>
          <p className="text-center text-xs text-[#8D837D] mt-2.5">לחודש הראשון · אחר כך {pricingConfig.membershipPrice} ₪ לחודש · אפשר לבטל בכל עת</p>

          <button onClick={trial} className="mt-5 w-full inline-flex items-center justify-center gap-2 text-[#9E626C] font-extrabold text-sm py-2 hover:underline"><PlayCircle size={18} /> רוצה גם להרגיש איך רבקה מלמדת? אפשר לצפות ב־5 דקות</button>
        </div>
      </div>
    </div>
  )
}
