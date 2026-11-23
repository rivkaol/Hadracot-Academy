import { Crown, Compass, ChevronLeft } from 'lucide-react'

// שער כניסה ניטרלי — הדבר הראשון שמישהי לא-מזוהה רואה בכתובת הבית.
// לא מניח מי היא: שואל "מי את?" ושולח למקום הנכון, במקום לפתוח ישר בדף מכירה.
// חברה שכבר זוהתה (cached_user_data) לעולם לא מגיעה למסך הזה — ראו App.jsx.
// עיצוב "הלב" (כמו דף ההצטרפות /join): שזיף עמוק, תמונה אחת של רבקה בקשת עם קו זהב, חתימה בכתב יד.
export default function ClubGateway({ onGoLogin, onExploreClub }) {
  return (
    <div className="flex-1 bg-[#6A3447] text-[#F8F3EC] flex items-center">
      <div className="w-full max-w-5xl mx-auto px-5 py-12 md:py-20 grid md:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-16 items-center">
        <figure className="relative w-full max-w-[230px] md:max-w-[340px] justify-self-center md:order-2">
          <span
            aria-hidden="true"
            className="absolute -top-3 -right-3 bottom-3 left-3 border border-[#D9BD86]/60 rounded-t-[999px] rounded-b-lg pointer-events-none"
          />
          <img
            src="/img/club/rivka.jpg"
            alt="רבקה הולצברג"
            width="880"
            height="1100"
            className="relative w-full h-auto aspect-[4/5] object-cover rounded-t-[999px] rounded-b-lg"
          />
          <figcaption className="absolute -bottom-5 -left-4 bg-white text-[#7E3F55] px-4 py-1.5 rounded-md shadow-[0_16px_32px_rgba(0,0,0,0.25)] font-hand text-[30px] leading-none">
            רבקה
          </figcaption>
        </figure>

        <div className="text-center md:text-right">
          <p className="inline-flex items-center gap-3 text-[15px] font-medium text-[#E9D3DB] mb-4">
            <span aria-hidden="true" className="w-8 h-px bg-[#D9BD86]" />
            המועדון של רבקה הולצברג
          </p>
          <h1 className="text-[34px] md:text-[52px] font-bold leading-[1.12] text-white mb-10">
            ברוכה הבאה למועדון
            <span className="block font-normal text-[#E9D3DB]">בריאות שבאה מהלב</span>
          </h1>

          <div className="flex flex-col gap-4 max-w-md mx-auto md:mx-0">
            <button
              onClick={onGoLogin}
              className="w-full bg-[#F8F3EC] text-[#6A3447] rounded-2xl p-5 text-right shadow-[0_4px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-transform flex items-center gap-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D9BD86]"
            >
              <Crown size={28} className="shrink-0" aria-hidden="true" />
              <span className="flex-1">
                <span className="block font-bold text-[20px]">אני חברת מועדון</span>
                <span className="block text-[16px] text-[#7E3F55]">כניסה לאזור שלך</span>
              </span>
              <ChevronLeft size={24} aria-hidden="true" />
            </button>

            <button
              onClick={onExploreClub}
              className="w-full border border-[#E9D3DB]/50 text-white rounded-2xl p-5 text-right hover:bg-white/10 transition-colors flex items-center gap-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#D9BD86]"
            >
              <Compass size={28} className="shrink-0 text-[#E9D3DB]" aria-hidden="true" />
              <span className="flex-1">
                <span className="block font-bold text-[20px]">אני עדיין לא חברה</span>
                <span className="block text-[16px] text-[#E9D3DB]">רוצה להכיר את המועדון</span>
              </span>
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
