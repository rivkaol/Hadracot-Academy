import { PlayCircle, ChevronLeft } from 'lucide-react'
import { STAGE_META } from '../lib/stageMeta'

// מסך "ברוכה הבאה" מיד אחרי הרשמה לטעימה — לא חוזרים לדף המכירה,
// לא מציגים מחיר, לא את כל הספרייה. רק ההדרכה הראשונה.
export default function TrialWelcomeScreen({ tutorial, onStart, totalSteps }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#FAF7F2] pb-10 text-center">
      <div className="w-full max-w-lg">
        <p className="text-xs font-bold text-[#9E626C] tracking-wide mb-2">
          הטעימה שלך
          {tutorial?.recommendedOrder && totalSteps ? ` · צעד ${tutorial.recommendedOrder} מתוך ${totalSteps}` : ''}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-2">ברוכה הבאה</h1>
        <p className="text-lg font-bold text-[#9E626C] mb-1">זה הצעד הראשון שלך.</p>
        <p className="text-[#716861] mb-6 leading-[1.8]">
          אל תנסי לראות הכול.
          <br />
          מתחילים מכאן.
        </p>

        <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8" aria-hidden="true">
          {STAGE_META.map((s, i) => (
            <div key={s.n} className="flex items-center">
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                  s.n === 1 ? 'bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white' : 'bg-white text-gray-400 border border-gray-200'
                }`}
              >
                {s.title}
              </span>
              {i < STAGE_META.length - 1 && <span className="w-3 sm:w-5 h-px bg-gray-200 mx-0.5" />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
          <div className="aspect-video bg-[#3E3935]/5 rounded-2xl relative overflow-hidden mb-5">
            {tutorial?.imageUrl && (
              <img src={tutorial.imageUrl} alt={tutorial.title} className="absolute inset-0 w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg">
                <PlayCircle size={28} className="text-[#3E3935]" />
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-[#3E3935] mb-6">{tutorial?.title}</h2>
          <button
            onClick={onStart}
            className="w-full bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white py-3.5 rounded-2xl font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.25)] inline-flex items-center justify-center gap-2"
          >
            מתחילה לצפות
            <ChevronLeft size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
