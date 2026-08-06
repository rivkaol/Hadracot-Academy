import { useState } from 'react'
import { ChevronRight, User, Phone, Mail, Sparkles, Loader } from 'lucide-react'

export default function LeadCaptureScreen({ onRegister, onCancel, onLoginRequest, isLoading, tutorialTitle }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const valid = name.trim() && phone.trim() && email.trim().includes('@')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!valid) return
    onRegister({ name: name.trim(), phone: phone.trim(), email: email.trim() })
  }

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

        <div className="relative z-10 mt-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white mb-4 shadow-md mx-auto">
            <Sparkles size={26} />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-2">רגע לפני שמתחילות</h1>
          <p className="text-[#716861] mb-6 leading-[1.8]">
            השאירי פרטים וקבלי גישה מיידית לצפייה בהדרכה{tutorialTitle ? ` "${tutorialTitle}"` : ''}. נשמח להישאר בקשר וללוות אותך בדרך.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            <Field icon={User} placeholder="השם שלך" value={name} onChange={setName} disabled={isLoading} />
            <Field icon={Phone} placeholder="טלפון (וואטסאפ)" type="tel" value={phone} onChange={setPhone} disabled={isLoading} dir="ltr" />
            <Field icon={Mail} placeholder="כתובת מייל" type="email" value={email} onChange={setEmail} disabled={isLoading} dir="ltr" />

            <button
              type="submit"
              disabled={isLoading || !valid}
              className="w-full bg-gradient-to-br from-[#C88F96] to-[#9E626C] hover:shadow-lg disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg shadow-[0_12px_28px_rgba(158,98,108,0.25)] transition-all flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <><Loader size={20} className="animate-spin text-white" /> רגע...</>
              ) : (
                'לצפייה בהדרכה'
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <button
              onClick={onLoginRequest}
              className="text-[#9E626C] text-sm font-bold hover:underline"
            >
              כבר חברת מועדון? התחברי כאן
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ icon: Icon, placeholder, type = 'text', value, onChange, disabled, dir }) {
  return (
    <div className="relative">
      <input
        type={type}
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 pr-12 bg-[#FAF7F2] border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-[#C88F96] transition-all text-[#3E3935] placeholder:text-gray-400"
        required
        disabled={disabled}
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Icon size={20} className="text-gray-400" />
      </div>
    </div>
  )
}
