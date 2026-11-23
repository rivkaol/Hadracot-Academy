import { useState } from 'react'
import { ChevronRight, Mail, KeyRound, Loader, Sparkles } from 'lucide-react'
import { pricingConfig } from '../pricing'

export default function LoginScreen({ onLogin, onCancel, isLoading, error, pendingTutorial, clearError, prefillEmail, knownMember }) {
  const [emailInput, setEmailInput] = useState(prefillEmail || '')
  const [passwordInput, setPasswordInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (emailInput.trim() && passwordInput.trim()) {
      onLogin(emailInput.trim(), passwordInput.trim())
    }
  }

  const handleEmailAppend = (domain) => {
    setEmailInput((prev) => (prev.includes('@') ? prev.split('@')[0] + domain : prev + domain))
    if (clearError) clearError()
  }

  const purchaseUrl =
    pendingTutorial?.landingPageUrl ||
    `${pricingConfig.whatsappBaseUrl}?text=${encodeURIComponent('היי רבקה, אשמח לקבל פרטים ולינק רכישה להדרכה: ' + (pendingTutorial?.title || ''))}`

  return (
    // "הלב": רקע ורוד-שזיף רך, כרטיס לבן עם פס שזיף עליון ותמונה של רבקה. הטופס עצמו נשאר ישר ונקי.
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#F4E9ED] pb-10">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-lg border-t-[6px] border-[#7E3F55] shadow-[0_2px_4px_rgba(106,52,71,0.05),0_30px_60px_rgba(106,52,71,0.14)] text-center relative">
        <button
          onClick={onCancel}
          aria-label="חזרה"
          className="absolute top-6 left-6 text-gray-400 hover:text-[#2B2724] transition-colors z-20"
        >
          <ChevronRight size={24} />
        </button>

        <div className="relative z-10 mt-2">
          <img
            src="/img/club/rivka.jpg"
            alt="רבקה הולצברג"
            width="880"
            height="1100"
            className="w-24 h-24 mx-auto mb-4 rounded-full object-cover object-[center_20%] ring-4 ring-[#F4E9ED]"
          />

          <h1 className="text-3xl font-bold text-[#1F4A3A] mb-2">ברוכה הבאה</h1>
          {knownMember ? (
            <div className="bg-[#F4E9ED] text-[#6A3447] text-[15px] font-bold px-4 py-3 rounded-2xl mb-6 leading-[1.7]">
              נראה שאת כבר מנויה במועדון!<br />
              התחברי עם הסיסמה שלך (מספר הטלפון) כדי להיכנס לצפייה מלאה.
            </div>
          ) : (
            <p className="text-[#6B625C] mb-6 font-medium leading-[1.8]">התחברי כדי לגשת להדרכות שרכשת</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            <div>
              <label className="block text-sm font-bold text-[#2B2724] mb-2 px-1">כתובת מייל</label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-4 pr-12 bg-[#FFFFFF] border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#A0627A] transition-all text-[#6B625C]"
                  required
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Mail size={20} className="text-gray-400" />
                </div>
              </div>
              <div className="flex gap-2 mt-2 justify-start px-1" dir="ltr">
                {['@gmail.com', '@yahoo.com'].map((domain) => (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => handleEmailAppend(domain)}
                    className="text-[13px] font-medium bg-gray-100 hover:bg-[#A0627A]/20 hover:text-[#7E3F55] text-gray-500 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2B2724] mb-2 px-1">סיסמה</label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-4 pr-12 bg-[#FFFFFF] border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#A0627A] transition-all text-[#6B625C]"
                  required
                  disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <KeyRound size={20} className="text-gray-400" />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-xl border border-red-100 text-center mt-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !emailInput.trim() || !passwordInput.trim()}
              className="w-full bg-[#7E3F55] hover:-translate-y-0.5 disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed text-white py-4 rounded-full font-bold text-lg shadow-[0_4px_0_rgba(0,0,0,0.18)] transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader size={20} className="animate-spin text-white" /> מתחברת...
                </>
              ) : (
                'התחברי למרחב ההדרכות'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-[#6B625C] text-base mb-3 font-bold">עדיין לא רכשת את ההדרכה?</p>
            <a
              href={purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#7E3F55] border border-[#A0627A]/50 hover:bg-[#A0627A]/10 font-bold py-2.5 px-6 rounded-full transition-all w-full"
            >
              <Sparkles size={16} />
              לפרטים והרשמה
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
