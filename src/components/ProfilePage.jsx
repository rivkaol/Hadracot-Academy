import { useState, useEffect } from 'react'
import { BookOpen, Edit, CheckCircle, PlayCircle, Loader, Crown } from 'lucide-react'
import { apiListNotes } from '../api'

export default function ProfilePage({ userEmail, userPassword, userName, completedTutorials, isClubMember, tutorialsData, onSelectTutorial }) {
  const [userNotes, setUserNotes] = useState([])
  const [loadingNotes, setLoadingNotes] = useState(true)

  useEffect(() => {
    if (!userEmail) return
    apiListNotes({ email: userEmail, password: userPassword })
      .then(({ notes }) => setUserNotes(notes || []))
      .catch((err) => console.error('שגיאה במשיכת סיכומים', err))
      .finally(() => setLoadingNotes(false))
  }, [userEmail])

  const totalTutorials = tutorialsData.reduce((sum, cat) => sum + cat.tutorials.length, 0)
  const progressPercent = totalTutorials > 0 ? Math.round((completedTutorials.length / totalTutorials) * 100) : 0

  const getTutorialDetails = (id) => {
    for (const cat of tutorialsData) {
      const tut = cat.tutorials.find((t) => t.id === id)
      if (tut) return tut
    }
    return null
  }

  return (
    <div className="flex-1 pb-[100px] md:pb-8">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <h2 className="text-3xl font-bold text-[#1B4D3E] mb-8">האזור האישי שלי</h2>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-10 -translate-x-10"></div>

          <div className="w-24 h-24 bg-[#1B4D3E] rounded-full flex items-center justify-center text-[#D4AF37] font-serif font-bold text-4xl shrink-0 shadow-md relative">
            {userName ? userName.charAt(0) : 'ר'}
            {isClubMember && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-[#D4AF37] to-[#B8962D] w-8 h-8 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <Crown size={16} className="text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-right z-10 w-full">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
              <h3 className="text-2xl font-bold text-[#1B4D3E]">{userName}</h3>
              {isClubMember && (
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#B8962D] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm inline-flex items-center gap-1 justify-center w-max mx-auto md:mx-0">
                  <Crown size={12} /> חברת מועדון VIP
                </span>
              )}
            </div>
            <p className="text-gray-500 mb-6">{userEmail}</p>

            <div className="w-full max-w-md mx-auto md:mx-0 bg-[#F7F9FA] p-5 rounded-2xl border border-gray-200/60">
              <div className="flex justify-between items-center text-sm font-bold text-[#1B4D3E] mb-3">
                <span>התקדמות במרחב ההדרכות</span>
                <span className="bg-white px-2 py-1 rounded-md text-[#94A388] shadow-sm">
                  {completedTutorials.length} / {totalTutorials}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-[#94A388] h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-[#1B4D3E] mb-6 flex items-center gap-2">
          <BookOpen size={24} className="text-[#D4AF37]" />
          המחברת שלי (סיכומים)
        </h3>

        {loadingNotes ? (
          <div className="flex justify-center py-12">
            <Loader size={32} className="animate-spin text-[#D4AF37]" />
          </div>
        ) : userNotes.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm">
            <Edit size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-lg font-medium text-[#1B4D3E] mb-2">המחברת שלך עדיין ריקה</p>
            <p className="text-gray-500 max-w-sm mx-auto">
              כשאת צופה בהדרכות, תוכלי לכתוב תובנות וסיכומים, והם יופיעו כאן בצורה מסודרת.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 mb-12">
            {userNotes.map((note, idx) => {
              const tut = getTutorialDetails(note.tutorialId)
              if (!tut) return null
              return (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-4">
                    <div>
                      <h4 className="font-bold text-[#1B4D3E] text-lg mb-1">{tut.title}</h4>
                      <p className="text-xs text-[#D4AF37] font-medium flex items-center gap-1">
                        <CheckCircle size={12} /> נשמר בהצלחה
                      </p>
                    </div>
                    <button
                      onClick={() => onSelectTutorial(tut)}
                      className="text-sm font-bold text-[#1B4D3E] bg-[#F7F9FA] hover:bg-[#E8F0ED] px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 self-start shrink-0 border border-gray-200"
                    >
                      <PlayCircle size={16} className="text-[#D4AF37]" /> צפייה בהדרכה
                    </button>
                  </div>
                  <div className="bg-[#F7F9FA] p-5 rounded-2xl text-gray-700 leading-relaxed whitespace-pre-wrap text-sm border border-gray-100/50">
                    {note.text}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
