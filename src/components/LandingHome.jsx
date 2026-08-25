import VisitorShowroom from './VisitorShowroom'

// דף המבקרת הוא כעת Showroom אמיתי של המועדון: כל העושר גלוי,
// כל הדרכה נפתחת להצצה תוכנית, ורק הווידאו המלא נשאר מאחורי חברות/טעימה.
// שומרים את אותו contract של LandingHome כדי לא לגעת בלוגיקת App/auth.
export default function LandingHome({ tutorialsData, onStartTrial, onLogin }) {
  return (
    <VisitorShowroom
      tutorialsData={tutorialsData}
      onStartTrial={onStartTrial}
      onLogin={onLogin}
    />
  )
}
