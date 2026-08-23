import { Crown, Compass } from 'lucide-react'

// שער כניסה ניטרלי — הדבר הראשון שמישהי לא-מזוהה רואה בכתובת הבית.
// לא מניח מי היא: שואל "מי את?" ושולח למקום הנכון, במקום לפתוח ישר בדף מכירה.
// חברה שכבר זוהתה (cached_user_data) לעולם לא מגיעה למסך הזה — ראו App.jsx.
export default function ClubGateway({ onGoLogin, onExploreClub }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 bg-[#FAF7F2] text-center">
      <div className="w-full max-w-md">
        <div className="text-4xl mb-4">💛</div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-10">
          ברוכה הבאה למועדון
          <br />
          "בריאות שבאה מהלב"
        </h1>

        <button
          onClick={onGoLogin}
          className="w-full bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white rounded-[1.75rem] p-6 text-right shadow-[0_12px_28px_rgba(158,98,108,0.3)] hover:-translate-y-0.5 transition-all mb-4 flex items-center gap-4"
        >
          <Crown size={28} className="shrink-0" />
          <span className="flex-1">
            <span className="block font-bold text-lg mb-1">אני חברת מועדון</span>
            <span className="block text-sm text-white/85">כבר הצטרפת? היכנסי ישירות לאזור שלך — כניסה למועדון ←</span>
          </span>
        </button>

        <button
          onClick={onExploreClub}
          className="w-full bg-white border border-gray-200 rounded-[1.75rem] p-6 text-right shadow-sm hover:border-[#C88F96]/40 transition-all flex items-center gap-4"
        >
          <Compass size={28} className="shrink-0 text-[#9E626C]" />
          <span className="flex-1">
            <span className="block font-bold text-lg text-[#3E3935] mb-1">אני עדיין לא חברה</span>
            <span className="block text-sm text-[#716861]">רוצה להבין מה מחכה לך כאן ולטעום מהתהליך? — רוצה להכיר את המועדון ←</span>
          </span>
        </button>
      </div>
    </div>
  )
}
