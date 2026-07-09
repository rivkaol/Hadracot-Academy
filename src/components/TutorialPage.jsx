import { useState, useEffect, useRef } from 'react'
import { Sparkles, CheckCircle, ChevronLeft, BookOpen, Edit, Download, Save, Loader, FileText } from 'lucide-react'
import confetti from 'canvas-confetti'
import { apiGetNote, apiSaveNote, apiSetCompleted } from '../api'

export default function TutorialPage({
  tutorial,
  tutorialsData,
  categoryName,
  onBack,
  onNext,
  hasNext,
  accessibleTutorialIds,
  userEmail,
  userPassword,
  completedTutorials,
  setCompletedTutorials,
  isClubMember,
}) {
  const cred = { email: userEmail, password: userPassword }
  const [activeTab, setActiveTab] = useState('notes')
  const [notes, setNotes] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [isSavingAuto, setIsSavingAuto] = useState(false)
  const [isCompleted, setIsCompleted] = useState(completedTutorials.includes(tutorial.id))
  const notesRef = useRef(notes)

  const currentCategory = tutorialsData.find((cat) => cat.tutorials.some((t) => t.id === tutorial.id))
  const categoryTutorials = currentCategory ? currentCategory.tutorials : []
  const completedInCategory = categoryTutorials.filter((t) => completedTutorials.includes(t.id)).length
  const progressPercent = categoryTutorials.length > 0 ? Math.round((completedInCategory / categoryTutorials.length) * 100) : 0

  useEffect(() => { notesRef.current = notes }, [notes])

  useEffect(() => {
    setNotes('')
    setIsCompleted(completedTutorials.includes(tutorial.id))
    setIsSaved(false)
    if (activeTab === 'resources' && !tutorial.pdfUrl) setActiveTab('notes')

    if (!userEmail) return
    apiGetNote(cred, tutorial.id)
      .then(({ text }) => setNotes(text || ''))
      .catch((err) => console.error('שגיאה בטעינת סיכום:', err))

    return () => {
      if (notesRef.current.trim() && userEmail) {
        apiSaveNote(cred, tutorial.id, notesRef.current).catch(console.error)
      }
    }
  }, [tutorial.id, userEmail])

  useEffect(() => {
    if (!userEmail || notes === '') return
    setIsSavingAuto(true)
    const timer = setTimeout(() => {
      apiSaveNote(cred, tutorial.id, notes)
        .then(() => setIsSavingAuto(false))
        .catch(() => setIsSavingAuto(false))
    }, 1500)
    return () => clearTimeout(timer)
  }, [notes, userEmail, tutorial.id])

  const handleSaveNotes = async () => {
    if (!userEmail) return
    await apiSaveNote(cred, tutorial.id, notes)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleCompleteLesson = async () => {
    const next = !isCompleted
    setIsCompleted(next)
    const newArr = next
      ? [...completedTutorials, tutorial.id]
      : completedTutorials.filter((id) => id !== tutorial.id)
    setCompletedTutorials(newArr)

    if (next) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#1B4D3E', '#D4AF37', '#94A388', '#C5A18E'], disableForReducedMotion: true })
    }

    if (userEmail) {
      apiSetCompleted(cred, tutorial.id, next).catch(console.error)
    }
  }

  const vimeoSrc = `https://player.vimeo.com/video/${tutorial.vimeoId?.toString().trim() || '76979871'}?${tutorial.vimeoHash ? `h=${tutorial.vimeoHash.toString().trim()}&` : ''}color=1B4D3E&title=0&byline=0&portrait=0&badge=0&dnt=1&playsinline=1`

  return (
    <div className="flex-1 pb-[100px] md:pb-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 w-full max-w-4xl">

            <div className="bg-black aspect-video rounded-2xl overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.1)] mb-6 border border-black/10">
              <iframe
                src={vimeoSrc}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={`הדרכה - ${tutorial.title}`}
              />
            </div>

            <div className="mb-8 text-center flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 text-sm text-[#D4AF37] font-bold mb-2">
                <Sparkles size={14} />
                <span>{categoryName || 'תודעה ושינוי מבפנים'}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1B4D3E] mb-6 leading-tight text-center">{tutorial.title}</h1>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-b border-gray-200 pb-8 w-full max-w-lg mx-auto">
                <button
                  onClick={handleCompleteLesson}
                  className={`flex items-center justify-center gap-2 font-bold px-8 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto shadow-sm ${isCompleted ? 'bg-[#94A388] text-white hover:bg-opacity-80' : 'bg-[#E8F0ED] text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white'}`}
                >
                  <CheckCircle size={22} />
                  {isCompleted ? 'הושלם' : 'סיימתי את ההדרכה'}
                </button>

                {hasNext && (isClubMember || accessibleTutorialIds.includes(tutorial.id + 1)) && (
                  <button
                    onClick={onNext}
                    className="flex items-center justify-center gap-2 text-[#1B4D3E] font-bold bg-white border border-gray-200 hover:border-[#1B4D3E] hover:bg-gray-50 px-8 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto shadow-sm"
                  >
                    להמשך ההדרכה הבאה
                    <ChevronLeft size={22} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex overflow-x-auto hide-scrollbar gap-8 border-b border-gray-200 mb-6">
              {[
                { id: 'about', label: 'מה תקבלי מההדרכה', Icon: BookOpen },
                { id: 'notes', label: 'המחברת האישית שלך', Icon: Edit },
                ...(tutorial.pdfUrl ? [{ id: 'resources', label: 'חומרים להורדה', Icon: Download }] : []),
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`pb-3 text-base font-medium transition-all relative flex items-center gap-2 whitespace-nowrap ${activeTab === id ? 'text-[#1B4D3E]' : 'text-gray-500 hover:text-[#1B4D3E]'}`}
                >
                  <Icon size={18} />
                  {label}
                  {activeTab === id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B4D3E] rounded-t-full"></span>}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm mb-12">
              {activeTab === 'about' && (
                <div className="text-[#2F4858] leading-[1.8] text-right">
                  <p className="mb-4">תיאור ההדרכה: {tutorial.title}.</p>
                  <h3 className="text-xl font-bold text-[#1B4D3E] mt-8 mb-4">נקודות מרכזיות:</h3>
                  <ul className="space-y-3 list-none p-0">
                    <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-3 shrink-0"></div><span>הבנת העקרונות הבסיסיים של הנושא.</span></li>
                    <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-3 shrink-0"></div><span>כלים פרקטיים ליישום מיידי.</span></li>
                  </ul>
                </div>
              )}

              {activeTab === 'notes' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-[#1B4D3E]">הסיכום האישי שלך</h3>
                      <p className="text-[#2F4858] mt-1 max-w-xl leading-[1.8]">זה המקום שלך לעצור רגע ולכתוב תובנות מההדרכה.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="התחילי לכתוב כאן..."
                      className="w-full min-h-[250px] p-6 bg-[#F7F9FA] border border-gray-200 rounded-2xl focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none resize-y text-[#2F4858] leading-[1.8] shadow-inner transition-all placeholder:text-gray-400 pb-16"
                    />
                    <div className="absolute bottom-4 left-4 flex items-center z-10">
                      {isSavingAuto ? (
                        <span className="bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 flex items-center gap-1.5">
                          <Loader size={14} className="animate-spin" /> שומר עכשיו...
                        </span>
                      ) : isSaved ? (
                        <span className="bg-green-50/90 backdrop-blur-sm border border-green-100 shadow-sm px-3 py-1.5 rounded-lg text-xs font-bold text-green-600 flex items-center gap-1.5">
                          <CheckCircle size={14} /> נשמר בהצלחה
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 px-2 font-medium">הסיכום נשמר אוטומטית</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <button
                      onClick={handleSaveNotes}
                      className="bg-[#1B4D3E] hover:bg-[#153D31] text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
                    >
                      <Save size={18} /> שמירה
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && tutorial.pdfUrl && (
                <div>
                  <h3 className="text-xl font-bold text-[#1B4D3E] mb-2">חומרים נלווים להדרכה</h3>
                  <p className="text-[#2F4858] mb-6 leading-[1.8]">כאן ריכזתי עבורך את כל מה שצריך להשלים את הלמידה.</p>
                  <a
                    href={tutorial.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-[#D4AF37]/30 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-[#F7F9FA] rounded-full flex items-center justify-center text-[#1B4D3E] group-hover:bg-[#1B4D3E] group-hover:text-white transition-colors ml-4">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#1B4D3E] group-hover:text-[#D4AF37] transition-colors">{tutorial.pdfTitle || 'קובץ מצורף להורדה'}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">לחצי כאן לפתיחה והורדה</p>
                    </div>
                    <Download size={20} className="text-gray-400 group-hover:text-[#D4AF37]" />
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-80 shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-5 sticky top-24">
              <div className="mb-6">
                <div className="flex justify-between items-center text-sm font-bold text-[#1B4D3E] mb-2">
                  <span>התקדמות בקטגוריה</span>
                  <span>{completedInCategory} / {categoryTutorials.length}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#94A388] h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
              <h3 className="font-bold text-[#1B4D3E] mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Sparkles size={18} className="text-[#D4AF37]" /> המשך הסדרה
              </h3>
              <div className="p-3 bg-[#F7F9FA] rounded-xl border border-[#D4AF37]/30 flex gap-3 cursor-default relative">
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#D4AF37] rounded-r-xl"></div>
                <div className="w-10 h-10 rounded-lg bg-[#1B4D3E] flex items-center justify-center text-white shrink-0">
                  <Sparkles size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#1B4D3E] truncate">{tutorial.title}</h4>
                  <span className="text-xs text-gray-500 mt-0.5 block">מתנגן עכשיו</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
