import { useState } from 'react'
import { ChevronRight, Mail, KeyRound, Loader, Sparkles } from 'lucide-react'

export default function LoginScreen({ onLogin, onCancel, isLoading, error, pendingTutorial, clearError }) {
  const [emailInput, setEmailInput] = useState('')
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
    `https://wa.me/504207702?text=${encodeURIComponent('היי רבקה, אשמח לקבל פרטים ולינק רכישה להדרכה: ' + (pendingTutorial?.title || ''))}`

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#FAF7F2] pb-10">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 text-center relative overflow-hidden">
        <button
          onClick={onCancel}
          className="absolute top-6 left-6 text-gray-400 hover:text-[#3E3935] transition-colors z-20"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C88F96]/10 rounded-full blur-3xl -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#3E3935]/5 rounded-full blur-3xl translate-y-10 -translate-x-10"></div>

        <div className="relative z-10 mt-2">
          <img
            src="/logo.jpg.png"
            alt="לוגו"
            className="h-16 w-auto mx-auto mb-4 object-contain"
            onError={(e) => { e.target.style.display = 'none' }}
          />

          <h1 className="text-3xl font-bold text-[#3E3935] mb-2">ברוכה הבאה</h1>
          <p className="text-[#716861] mb-6 font-medium leading-[1.8]">התחברי כדי לגשת להדרכות שרכשת</p>

          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            <div>
              <label className="block text-sm font-bold text-[#3E3935] mb-2 px-1">כתובת מייל</label>
              <div className="relative">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full p-4 pr-12 bg-[#FAF7F2] border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#C88F96] transition-all text-[#716861]"
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
                    className="text-[11px] font-medium bg-gray-100 hover:bg-[#C88F96]/20 hover:text-[#9E626C] text-gray-500 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#3E3935] mb-2 px-1">סיסמה</label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-4 pr-12 bg-[#FAF7F2] border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#C88F96] transition-all text-[#716861]"
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
              className="w-full bg-gradient-to-br from-[#C88F96] to-[#9E626C] hover:shadow-lg disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.25)] transition-all flex items-center justify-center gap-2 mt-4"
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
            <p className="text-[#716861] text-base mb-3 font-bold">עדיין לא רכשת את ההדרכה?</p>
            <a
              href={purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#9E626C] border border-[#C88F96]/50 hover:bg-[#C88F96]/10 font-bold py-2.5 px-6 rounded-xl transition-all shadow-sm w-full"
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
