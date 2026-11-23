// פס התקדמות עדין מעל המסלול. לא אחוזים גדולים, לא גיימיפיקציה — רק
// "כמה כבר עברתי" בצורה רגועה. המספרים מגיעים מ-MemberDashboard (completedCount/
// totalSteps), אין כאן חישוב מקביל.
export default function JourneyProgressHeader({ completedCount, totalSteps, trackFullyCompleted }) {
  if (totalSteps === 0) return null
  const pct = Math.round((completedCount / totalSteps) * 100)

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-2.5 flex-wrap gap-1">
        <p className="text-sm font-bold text-[#7E3F55]">ההתקדמות שלי</p>
        <p className="text-sm font-bold text-[#2B2724]">
          {completedCount} מתוך {totalSteps} צעדים הושלמו
        </p>
      </div>
      <div className="relative w-full h-2.5 rounded-full bg-[#EEF3EF] overflow-hidden">
        <div
          className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-[#7E3F55] to-[#A0627A] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm text-[#9E9188] mt-2">
        {trackFullyCompleted ? 'המסלול הושלם — והדרך ממשיכה.' : 'עוד צעד אחד בכל פעם.'}
      </p>
    </section>
  )
}
