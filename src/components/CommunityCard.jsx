import { MessageCircle } from 'lucide-react'
import { pricingConfig } from '../pricing'

// קהילה כחלק מהדרך — לא כרטיס אקראי בתחתית. תמיד מוצג, לכל חברה.
export default function CommunityCard() {
  return (
    <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-center sm:text-right">
        <p className="font-bold text-[#3E3935]">את לא צריכה ללכת בדרך הזאת לבד</p>
        <p className="text-[15px] text-[#716861] mt-0.5">קבוצת המועדון מחכה לך — לשאלות, חיזוק וליווי.</p>
      </div>
      <a
        href={`${pricingConfig.whatsappBaseUrl}?text=${encodeURIComponent('היי רבקה, אשמח להצטרף לקבוצת המועדון')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 inline-flex items-center gap-2 bg-[#E8EEE5] text-[#3E3935] font-bold px-5 py-2.5 rounded-full hover:bg-[#3E3935] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88F96] focus-visible:ring-offset-2"
      >
        <MessageCircle size={18} /> כניסה לקבוצת המועדון
      </a>
    </section>
  )
}
