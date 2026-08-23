// עדויות אמיתיות בלבד — לא ממציאים שמות/ציטוטים (הנחיית רבקה, 2026-08-23).
// אין עדיין מקור מאושר לעדויות אמיתיות (למשל screenshots של וואטסאפ) בקוד/בנכסים
// של הפרויקט, ולכן המערך למטה ריק והסקשן לא מוצג. ברגע שיש עדויות אמיתיות
// מאושרות — למלא כאן {quote, author} ולוודא ש-TESTIMONIALS.length > 0.
const TESTIMONIALS = []

export default function LandingTestimonials() {
  if (TESTIMONIALS.length === 0) return null

  return (
    <section className="visitor-landing bg-white py-20 md:py-28 border-y border-[#3E3935]/8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-[clamp(1.7rem,3.6vw,2.6rem)] font-extrabold text-[#3E3935] leading-[1.3]">
            ומה קורה כשמתחילים ללכת בדרך?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#3E3935]/6">
              <p className="text-[#3E3935] leading-[1.8] mb-4">{t.quote}</p>
              <p className="text-[#9E626C] font-bold text-sm">{t.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
