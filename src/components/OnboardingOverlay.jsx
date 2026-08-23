import { X } from 'lucide-react'
import { pricingConfig } from '../pricing'

// מסך "ברוכה הבאה" — מוצג פעם אחת בלבד (מיזוג של "אחרי רכישה" ו"היכרות ראשונה",
// כי התוכן כמעט זהה). נסגר עם markOnboardingSeen, לא חוזר בכניסות הבאות.
// הקופי ניטרלי בכוונה: אחרי ה-migration גם חברות ותיקות יקבלו את המסך הזה
// פעם אחת (כי has_seen_onboarding מתחיל false לכולן) — לא צריך להישמע כאילו
// הן הצטרפו הרגע.
export default function OnboardingOverlay({ onDismiss, onJoinCommunity }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" style={{ background: 'rgba(43,39,36,0.55)' }}>
      <div className="w-full max-w-md bg-white rounded-[2rem] p-8 text-center relative shadow-2xl">
        <button onClick={onDismiss} className="absolute top-5 left-5 text-gray-400 hover:text-[#3E3935]">
          <X size={22} />
        </button>
        <div className="text-4xl mb-4">💛</div>
        <h1 className="text-2xl font-bold text-[#3E3935] mb-3">ברוכה הבאה 💛 בואי נעשה לך סדר</h1>
        <p className="text-[#716861] leading-[1.8] mb-6">
          מהיום לא צריך לחפש בין כל ההדרכות. בכל כניסה תוכלי לראות איפה את נמצאת ומה הצעד הבא שמומלץ לך.
        </p>
        <ol className="text-right space-y-2 mb-7 text-sm text-[#3E3935] bg-[#FAF7F2] rounded-2xl p-5">
          <li>1. תתחילי מההדרכה הראשונה</li>
          <li>2. הצטרפי לקבוצת המועדון</li>
          <li>3. סמני כל הדרכה שסיימת ✓</li>
        </ol>
        <button
          onClick={onDismiss}
          className="w-full bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white py-3.5 rounded-2xl font-bold shadow-[0_12px_28px_rgba(158,98,108,0.25)] mb-3"
        >
          יאללה, מתחילות
        </button>
        <a
          href={`${pricingConfig.whatsappBaseUrl}?text=${encodeURIComponent('היי רבקה, אשמח להצטרף לקבוצת המועדון')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onJoinCommunity}
          className="block text-[#9E626C] text-sm font-bold hover:underline"
        >
          הצטרפות לקבוצת המועדון
        </a>
      </div>
    </div>
  )
}
