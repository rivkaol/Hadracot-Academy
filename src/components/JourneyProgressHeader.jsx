// פס התקדמות עדין מעל המסלול. לא אחוזים גדולים, לא גיימיפיקציה — רק
// "כמה כבר עברתי" בצורה רגועה. המספרים מגיעים מ-MemberDashboard (completedCount/
// totalSteps), אין כאן חישוב מקביל.
export default function JourneyProgressHeader({ completedCount, totalSteps, trackFullyCompleted }) {
  if (totalSteps === 0) return null
  const pct = Math.round((completedCount / totalSteps) * 100)

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-2.5 flex-wrap gap-1">
        <p className="text-sm font-bold text-[#9E626C]">ההתקדמות שלי</p>
        <p className="text-sm font-bold text-[#3E3935]">
          {completedCount} מתוך {totalSteps} צעדים הושלמו
        </p>
      </div>
      <div className="relative w-full h-2.5 rounded-full bg-[#E8EEE5] overflow-hidden">
        <div
          className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-[#9E626C] to-[#C88F96] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm text-[#9E9188] mt-2">
        {trackFullyCompleted ? 'המסלול הושלם — והדרך ממשיכה.' : 'עוד צעד אחד בכל פעם.'}
      </p>
    </section>
  )
}
