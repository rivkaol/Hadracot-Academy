import JourneyTimeline from './JourneyTimeline'
import IntroOfferCard from './IntroOfferCard'

// אחרי הטעימה: קודם ההצעה, ורק אחריה מפת המסלול כהוכחת עומק נוספת.
// כך ליד חמה לא צריכה לגלול דרך מסלול שלם לפני שהיא בכלל רואה את ההצעה.
export default function TrialTrackMapScreen({ tutorialsData, watchedTutorialId, onJoin }) {
  return (
    <div className="flex-1 pb-[100px] md:pb-8">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 md:pt-10">
        <div className="text-center mb-5">
          <p className="text-[#7E3F55] text-sm font-extrabold mb-2">אהבת את מה שראית?</p>
          <h1 className="text-2xl md:text-4xl font-extrabold text-[#1F4A3A] mb-3">זו הייתה רק הצצה אחת מתוך עולם שלם.</h1>
          <p className="text-[#6B625C] leading-[1.8] max-w-xl mx-auto">
            כל המסלול, ספריית ההדרכות, המפגשים החיים והקהילה יכולים להיפתח לך עכשיו.
          </p>
        </div>
      </main>

      <IntroOfferCard onJoin={onJoin} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8 pt-2">
          <p className="text-[#1F4A3A] text-sm font-extrabold mb-2">רוצה לראות לאן ממשיכים מכאן?</p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1F4A3A] mb-3">זה המסלול שמחכה לך בפנים</h2>
          <p className="text-[#6B625C] leading-[1.8]">
            הצעד הראשון כבר התחיל. כחברת מועדון כל הדרך נפתחת לך,
            ואת יכולה להתקדם בה בקצב שלך.
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
    </div>
  )
}
