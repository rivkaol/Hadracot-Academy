import JourneyTimeline from './JourneyTimeline'
import IntroOfferCard from './IntroOfferCard'

// אחרי 5 הדקות: מפת 13 הצעדים המלאה. הצעד שהתחילה — פתוח/צפית כאן.
// שאר הצעדים — 🔒, אבל הכותרות גלויות. "רגע, אני רק בתחילת הדרך."
export default function TrialTrackMapScreen({ tutorialsData, watchedTutorialId, onJoin }) {
  return (
    <div className="flex-1 pb-[100px] md:pb-8">
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-3">זה מה שמחכה לך מכאן</h1>
          <p className="text-[#716861] leading-[1.8]">
            הצעד הראשון כבר התחיל.
            <br />
            כחברת מועדון, כל המסלול נפתח לך ותוכלי להתקדם בו בקצב שלך.
          </p>
        </div>

        <JourneyTimeline
          tutorialsData={tutorialsData}
          mode="locked"
          completedTutorials={[]}
          currentTutorialId={watchedTutorialId}
          accessibleTutorialIds={watchedTutorialId ? [watchedTutorialId] : []}
        />
      </main>

      <IntroOfferCard onJoin={onJoin} />
    </div>
  )
}
