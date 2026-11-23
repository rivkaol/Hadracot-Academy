import { MessageCircle } from 'lucide-react'
import { pricingConfig } from '../pricing'

// קהילה כחלק מהדרך — לא כרטיס אקראי בתחתית. תמיד מוצג, לכל חברה.
// "הלב": ורוד-שזיף רך, חתימה בכתב יד, כפתור שזיף.
export default function CommunityCard() {
  return (
    <section className="bg-[#F4E9ED] rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
      <div className="text-center sm:text-right">
        <p className="font-bold text-[#1F4A3A] text-[20px]">את לא צריכה ללכת בדרך הזאת לבד</p>
        <p className="text-[17px] text-[#5E5954] mt-1">קבוצת המועדון מחכה לך, לשאלות, לחיזוק וליווי.</p>
        <p className="font-hand text-[32px] leading-none text-[#7E3F55] mt-2">רבקה</p>
      </div>
      <a
        href={`${pricingConfig.whatsappBaseUrl}?text=${encodeURIComponent('היי רבקה, אשמח להצטרף לקבוצת המועדון')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center gap-2 bg-[#7E3F55] text-white font-bold px-6 py-3 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0627A] focus-visible:ring-offset-2"
      >
        <MessageCircle size={18} aria-hidden="true" /> כניסה לקבוצת המועדון
      </a>
    </section>
  )
}
