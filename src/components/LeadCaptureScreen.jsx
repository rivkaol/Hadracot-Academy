import { useState } from 'react'
import { ChevronRight, User, Phone, Mail, Loader, Check, AlertCircle } from 'lucide-react'

// ---- ולידציה ----
// טלפון ישראלי: נייד (05X + 8 ספרות) או קווי (0X + 7 ספרות). מקבל גם קידומת 972/+972.
function normalizePhone(raw) {
  let d = String(raw || '').replace(/\D/g, '')
  if (d.startsWith('972')) d = '0' + d.slice(3)
  return d
}
function isValidPhone(raw) {
  const d = normalizePhone(raw)
  return /^05\d{8}$/.test(d) || /^0[2-489]\d{7}$/.test(d)
}
// מייל: מבנה תקין עם שם, @, דומיין וסיומת של שתי אותיות לפחות.
function isValidEmail(raw) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(raw || '').trim())
}

// סיומות מייל נפוצות להשלמה אוטומטית
const EMAIL_DOMAINS = ['gmail.com', 'walla.co.il', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com']

function emailSuggestions(value) {
  const v = String(value || '').trim()
  if (!v || /\s/.test(v)) return []
  const at = v.indexOf('@')
  if (at === -1) {
    // עדיין בלי @ — מציעים שם@דומיין לכל סיומת
    return EMAIL_DOMAINS.map((d) => `${v}@${d}`)
  }
  const local = v.slice(0, at)
  const dom = v.slice(at + 1).toLowerCase()
  if (!local) return []
  // כבר הושלם דומיין מלא ותקין — אין מה להציע
  if (EMAIL_DOMAINS.includes(dom)) return []
  const matches = dom ? EMAIL_DOMAINS.filter((d) => d.startsWith(dom)) : EMAIL_DOMAINS
  return matches.map((d) => `${local}@${d}`)
}

export default function LeadCaptureScreen({ onRegister, onCancel, onLoginRequest, isLoading, tutorialTitle }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState({})
  const [showSuggest, setShowSuggest] = useState(false)

  const phoneOk = isValidPhone(phone)
  const emailOk = isValidEmail(email)
  const nameOk = name.trim().length >= 2
  const valid = nameOk && phoneOk && emailOk

  const suggestions = emailSuggestions(email)

  const markTouched = (f) => setTouched((t) => ({ ...t, [f]: true }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ name: true, phone: true, email: true })
    if (!valid) return
    onRegister({ name: name.trim(), phone: normalizePhone(phone), email: email.trim().toLowerCase() })
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#F4E9ED] pb-10">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-lg border-t-[6px] border-[#7E3F55] shadow-[0_2px_4px_rgba(106,52,71,0.05),0_30px_60px_rgba(106,52,71,0.14)] text-center relative">
        <button
          onClick={onCancel}
          className="absolute top-6 left-6 text-gray-400 hover:text-[#2B2724] transition-colors z-20"
        >
          <ChevronRight size={24} />
        </button>

        <div className="relative z-10 mt-2">
          <img src="/img/club/rivka.jpg" alt="רבקה הולצברג" width="880" height="1100" className="w-24 h-24 mx-auto mb-4 rounded-full object-cover object-[center_20%] ring-4 ring-[#F4E9ED]" />

          <h1 className="text-2xl md:text-3xl font-bold text-[#1F4A3A] mb-2">רגע לפני שמתחילות</h1>
          <p className="text-[#6B625C] mb-6 leading-[1.8]">
            השאירי לי את הפרטים שלך.
            <br />
            אני אשמור לך את הטעימה
            {tutorialTitle ? ` — "${tutorialTitle}"` : ''}, כך שגם אם תצאי ותחזרי — מכסת הצפייה שלך לא תתאפס.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-right" noValidate>
                <Field
                  icon={User}
                  placeholder="השם שלך"
                  value={name}
                  onChange={setName}
                  onBlur={() => markTouched('name')}
                  disabled={isLoading}
                  invalid={touched.name && !nameOk}
                  error="נא למלא שם מלא"
                />

                <Field
                  icon={Phone}
                  placeholder="טלפון (וואטסאפ)"
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  onBlur={() => markTouched('phone')}
                  disabled={isLoading}
                  dir="ltr"
                  invalid={touched.phone && !phoneOk}
                  valid={phoneOk}
                  error="מספר טלפון לא תקין (למשל 0501234567)"
                />

                <div className="relative">
                  <Field
                    icon={Mail}
                    placeholder="כתובת מייל"
                    type="email"
                    value={email}
                    onChange={(v) => { setEmail(v); setShowSuggest(true) }}
                    onFocus={() => setShowSuggest(true)}
                    onBlur={() => { markTouched('email'); setTimeout(() => setShowSuggest(false), 150) }}
                    disabled={isLoading}
                    dir="ltr"
                    invalid={touched.email && !emailOk}
                    valid={emailOk}
                    error="כתובת מייל לא תקינה"
                  />
                  {showSuggest && suggestions.length > 0 && (
                    <ul className="absolute z-30 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden text-left" dir="ltr">
                      {suggestions.slice(0, 4).map((s) => (
                        <li key={s}>
                          <button
                            type="button"
                            onMouseDown={(e) => { e.preventDefault(); setEmail(s); setShowSuggest(false) }}
                            className="w-full text-left px-4 py-2.5 text-sm text-[#2B2724] hover:bg-[#FFFFFF] transition-colors flex items-center gap-2"
                          >
                            <Mail size={14} className="text-gray-400 shrink-0" />
                            <span className="truncate">{s}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !valid}
                  className="w-full bg-[#7E3F55] hover:shadow-lg disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg shadow-[0_4px_0_rgba(0,0,0,0.18)] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <><Loader size={20} className="animate-spin text-white" /> רגע...</>
                  ) : (
                    'מתחילה את הצעד הראשון'
                  )}
                </button>
              </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <button
              onClick={onLoginRequest}
              className="text-[#7E3F55] text-sm font-bold hover:underline"
            >
              כבר חברת מועדון? התחברי כאן
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, placeholder, type = 'text', value, onChange, onBlur, onFocus, disabled, dir, invalid, valid, error }) {
  return (
    <div>
      <div className="relative">
        <input
          type={type}
          dir={dir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          className={`w-full p-4 pr-12 pl-10 bg-[#FFFFFF] border rounded-2xl outline-none focus:ring-2 transition-all text-[#2B2724] placeholder:text-gray-400 ${invalid ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-[#A0627A]'}`}
          disabled={disabled}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Icon size={20} className={invalid ? 'text-red-400' : 'text-gray-400'} />
        </div>
        {valid && !invalid && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Check size={18} className="text-[#1F4A3A]" />
          </div>
        )}
      </div>
      {invalid && error && (
        <p className="text-red-500 text-xs mt-1.5 mr-1 flex items-center gap-1 text-right justify-end">
          {error} <AlertCircle size={13} />
        </p>
      )}
    </div>
  )
}
