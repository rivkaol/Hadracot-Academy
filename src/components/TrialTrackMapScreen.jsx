import { ChevronLeft } from 'lucide-react'
import JourneyTimeline from './JourneyTimeline'
import { pricingConfig } from '../pricing'

// אחרי 5 הדקות: מפת 13 הצעדים המלאה. הצעד שהתחילה — פתוח/צפית כאן.
// שאר הצעדים — 🔒, אבל הכותרות גלויות. "רגע, אני רק בתחילת הדרך."
export default function TrialTrackMapScreen({ tutorialsData, watchedTutorialId, onJoin }) {
  return (
    <div className="flex-1 pb-[100px] md:pb-8">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-3">הנה הדרך שממשיכה מכאן</h1>
          <p className="text-[#716861]">רק התחלנו. מה שראית עכשיו הוא הצעד הראשון.</p>
        </div>

        <JourneyTimeline
          tutorialsData={tutorialsData}
          mode="locked"
          completedTutorials={[]}
          currentTutorialId={watchedTutorialId}
          accessibleTutorialIds={watchedTutorialId ? [watchedTutorialId] : []}
        />

        <div className="text-center mt-12">
          <a
            href={pricingConfig.membershipCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onJoin}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-8 py-4 rounded-full font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.3)] hover:-translate-y-0.5 transition-all"
          >
            אני רוצה להמשיך במסע
            <ChevronLeft size={20} />
          </a>
          <p className="text-sm text-gray-500 mt-4">כשתצטרפי, המסלול המלא ייפתח לך ותוכלי להמשיך מכאן.</p>
        </div>
      </main>
    </div>
  )
}
