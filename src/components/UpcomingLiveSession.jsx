import { Calendar, ChevronLeft } from 'lucide-react'

// כרטיס "המפגש הבא שלנו" — בין המסלול לקהילה. מוצג רק אם pricingConfig.nextLiveSession
// קיים (בדיקה ב-MemberDashboard); אם אין נתון אמיתי, האזור לא קיים בכלל.
export default function UpcomingLiveSession({ session }) {
  const formattedDate = session.date
    ? new Date(session.date).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <section className="mb-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center gap-5">
      <div className="w-14 h-14 rounded-full bg-[#EEF3EF] flex items-center justify-center text-[#1F4A3A] shrink-0">
        <Calendar size={24} />
      </div>
      <div className="flex-1 text-center sm:text-right">
        <p className="text-sm font-bold text-[#7E3F55] mb-1">התחנה הבאה שלנו יחד</p>
        <p className="font-bold text-[#2B2724] text-lg">{session.title}</p>
        {formattedDate && <p className="text-sm text-[#6B625C] mt-0.5">{formattedDate}</p>}
      </div>
      {session.joinUrl && (
        <a
          href={session.joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1.5 text-[#7E3F55] font-bold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A0627A] focus-visible:ring-offset-2 rounded-full px-2 py-1"
        >
          לפרטי המפגש
          <ChevronLeft size={16} />
        </a>
      )}
    </section>
  )
}
