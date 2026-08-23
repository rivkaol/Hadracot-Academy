import { PlayCircle, ChevronLeft, ChevronDown, Sparkles } from 'lucide-react'
import { STAGE_META } from '../lib/stageMeta'
import { flattenTutorials } from '../lib/catalogHelpers'
import { pricingConfig } from '../pricing'

// מסך "ברוכה הבאה" מיד אחרי הרשמה לטעימה — לא חוזרים לדף המכירה,
// לא מציגים מחיר, לא את כל הספרייה. רק ההדרכה הראשונה לצפייה +
// 3 הצצות ויזואליות (לא לצפייה) שמראות שהמועדון רחב מהסרטון היחיד הזה.
// במכוון בלי מנגנון קליפים ערוכים/45 שניות לכל הדרכה — זה עוד פיתוח ועוד
// tracking. קודם משיקות טעימה אחת + 3 הצצות + מפת מסלול מלאה, ורואות
// התנהגות (נרשמות לטעימה מול מצטרפות בפועל) לפני שמשקיעות שם.
const TEASER_COPY = {
  'personal-growth': {
    kicker: 'תודעה והרגלים',
    accent: '#9E626C',
    hook: 'ומה קורה כשאת יודעת בדיוק מה את רוצה — אבל שוב אין לך זמן לעצמך?',
  },
  health: {
    kicker: 'בריאות ואורח חיים',
    accent: '#687B63',
    hook: 'כי שינוי אמיתי לא נשאר רק בראש. הוא פוגש גם את הגוף ואת החיים עצמם.',
  },
}

function TeaserCard({ kicker, accent, title, hook, imageUrl }) {
  if (!title) return null
  return (
    <div className="relative bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden text-right">
      <div className="aspect-[4/3] relative bg-[#3E3935]/5">
        {imageUrl && <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <span
          className="absolute top-2.5 right-2.5 text-[10px] font-bold text-white px-2.5 py-1 rounded-full shadow-sm"
          style={{ backgroundColor: `${accent}D9` }}
        >
          לחברות המועדון
        </span>
      </div>
      <div className="p-4">
        <p className="text-[11px] font-bold mb-1.5" style={{ color: accent }}>
          {kicker}
        </p>
        <p className="font-bold text-[#3E3935] text-sm leading-snug mb-1.5">{title}</p>
        <p className="text-xs text-[#716861] leading-[1.6]">{hook}</p>
      </div>
    </div>
  )
}

export default function TrialWelcomeScreen({ tutorial, tutorialsData, onStart, onShowTrackMap, totalSteps }) {
  const trialId = tutorial?.id
  const allTutorials = flattenTutorials(tutorialsData)

  const pickFromCategory = (catId) =>
    allTutorials.find((t) => t.categoryId === catId && t.id !== trialId && t.imageUrl) ||
    allTutorials.find((t) => t.categoryId === catId && t.id !== trialId)

  const mindsetTeaser = pickFromCategory('personal-growth')
  const healthTeaser = pickFromCategory('health')

  const usedIds = new Set([trialId, mindsetTeaser?.id, healthTeaser?.id].filter(Boolean))
  const moreTeaser =
    allTutorials.find((t) => !usedIds.has(t.id) && t.imageUrl) ||
    allTutorials.find((t) => !usedIds.has(t.id))

  const teasers = [
    mindsetTeaser && { ...TEASER_COPY['personal-growth'], title: mindsetTeaser.title, imageUrl: mindsetTeaser.imageUrl },
    healthTeaser && { ...TEASER_COPY.health, title: healthTeaser.title, imageUrl: healthTeaser.imageUrl },
    moreTeaser && {
      kicker: 'עוד מתוך המועדון',
      accent: '#3E3935',
      title: moreTeaser.title,
      imageUrl: moreTeaser.imageUrl,
      hook: pricingConfig.nextLiveSession
        ? `מפגש חי קרוב: ${pricingConfig.nextLiveSession.title}`
        : 'ועוד תכנים ממשיכים להתווסף לאורך הדרך.',
    },
  ].filter(Boolean)

  return (
    <div className="flex-1 flex flex-col items-center p-4 bg-[#FAF7F2] pb-14">
      <div className="w-full max-w-lg text-center">
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

      {teasers.length > 0 && (
        <div className="w-full max-w-3xl mt-12 text-center">
          <p className="text-[#716861] font-medium mb-6">וזו רק דלת אחת לתוך המועדון...</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {teasers.map((t, i) => (
              <TeaserCard key={i} {...t} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 text-[#9E626C] mb-3">
            <Sparkles size={16} />
            <p className="font-bold text-sm">וזה רק חלק קטן ממה שמחכה לך בפנים.</p>
          </div>

          {onShowTrackMap && (
            <button
              onClick={onShowTrackMap}
              className="text-[#3E3935] font-bold underline underline-offset-4 hover:text-[#9E626C] transition-colors inline-flex items-center gap-1.5"
            >
              לראות את כל הדרך
              <ChevronDown size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
