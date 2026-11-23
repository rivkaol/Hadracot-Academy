import { Calendar, ChevronLeft } from 'lucide-react'

// כרטיס "המפגש הבא שלנו" — בין המסלול לקהילה. מוצג רק אם pricingConfig.nextLiveSession
// קיים (בדיקה ב-MemberDashboard); אם אין נתון אמיתי, האזור לא קיים בכלל.
// המפגשים החיים בטורקיז (משפחת צבעי המוצרים: רקע בהיר, אייקון וקו בטורקיז, לא כפתור מלא).
export default function UpcomingLiveSession({ session }) {
  const formattedDate = session.date
    ? new Date(session.date).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <section className="mb-10 bg-[#E3EFEE] rounded-2xl p-6 border-r-4 border-[#3E7C7B] flex flex-col sm:flex-row items-center gap-5">
      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#3E7C7B] shrink-0">
        <Calendar size={24} aria-hidden="true" />
      </div>
      <div className="flex-1 text-center sm:text-right">
        <p className="text-[15px] font-bold text-[#2F5F5E] mb-1">התחנה הבאה שלנו יחד</p>
        <p className="font-bold text-[#1F4A3A] text-[20px]">{session.title}</p>
        {formattedDate && <p className="text-[16px] text-[#2B2724] mt-0.5">{formattedDate}</p>}
      </div>
      {session.joinUrl && (
        <a
          href={session.joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 bg-[#7E3F55] text-white font-bold rounded-full px-5 py-2.5 shadow-[0_4px_0_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3E7C7B] focus-visible:ring-offset-2"
        >
          לפרטי המפגש
          <ChevronLeft size={16} aria-hidden="true" />
        </a>
      )}
    </section>
  )
}
