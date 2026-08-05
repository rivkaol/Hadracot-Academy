import { useState, useEffect, useRef } from 'react'
import { Sparkles, CheckCircle, ChevronLeft, BookOpen, Edit, Download, Save, Loader, FileText, Gift, Crown } from 'lucide-react'
import confetti from 'canvas-confetti'
import Player from '@vimeo/player'
import { apiGetNote, apiSaveNote, apiSetCompleted } from '../api'

const PREVIEW_SECONDS = 300 // חמש דקות טעימה חינם

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
  onLoginRequest,
}) {
  const cred = { email: userEmail, password: userPassword }
  const hasAccess = isClubMember || accessibleTutorialIds.includes(tutorial.id)
  const iframeRef = useRef(null)
  const [gateOpen, setGateOpen] = useState(false)

  const joinUrl =
    tutorial.landingPageUrl ||
    `https://wa.me/504207702?text=${encodeURIComponent('היי רבקה, אשמח להצטרף למועדון ולצפות בהדרכה: ' + tutorial.title)}`

  // שער הטעימה: למי שאינה מנויה — עצירה אחרי 5 דק' וחסימת גרירה קדימה
  useEffect(() => {
    if (hasAccess || !iframeRef.current) return
    const player = new Player(iframeRef.current)
    let locked = false

    const openGate = async () => {
      if (locked) return
      locked = true
      try {
        await player.pause()
        await player.setCurrentTime(PREVIEW_SECONDS)
      } catch (e) { /* התעלמות משגיאות נגן */ }
      setGateOpen(true)
    }

    const onTime = (d) => { if (d.seconds >= PREVIEW_SECONDS) openGate() }
    const onSeek = (d) => { if (d.seconds > PREVIEW_SECONDS) openGate() }

    player.on('timeupdate', onTime)
    player.on('seeking', onSeek)
    player.on('seeked', onSeek)

    return () => {
      player.off('timeupdate', onTime)
      player.off('seeking', onSeek)
      player.off('seeked', onSeek)
    }
  }, [hasAccess, tutorial.id])
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
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#3E3935', '#C88F96', '#687B63', '#C88F96'], disableForReducedMotion: true })
    }

    if (userEmail) {
      apiSetCompleted(cred, tutorial.id, next).catch(console.error)
    }
  }

  const vimeoSrc = `https://player.vimeo.com/video/${tutorial.vimeoId?.toString().trim() || '76979871'}?${tutorial.vimeoHash ? `h=${tutorial.vimeoHash.toString().trim()}&` : ''}color=9E626C&title=0&byline=0&portrait=0&badge=0&dnt=1&playsinline=1`

  return (
    <div className="flex-1 pb-[100px] md:pb-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 w-full max-w-4xl">

            <div className="bg-black aspect-video rounded-2xl overflow-hidden relative shadow-[0_10px_30px_rgba(0,0,0,0.1)] mb-6 border border-black/10">
              <iframe
                ref={iframeRef}
                src={vimeoSrc}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={`הדרכה - ${tutorial.title}`}
              />

              {!hasAccess && !gateOpen && (
                <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#9E626C] text-[11px] md:text-xs font-bold px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
                  <Gift size={13} /> 5 דקות ראשונות לצפייה ללא עלות
                </div>
              )}

              {!hasAccess && gateOpen && (
                <div className="absolute inset-0 z-30 flex items-center justify-center text-center px-6 py-8" dir="rtl" style={{ background: 'rgba(43,39,36,0.95)' }}>
                  <div className="max-w-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white mb-5 shadow-lg mx-auto">
                      <Crown size={30} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#FFFDF9] mb-3">רוצה להמשיך לצפות?</h2>
                    <p className="text-[#E9E0DB] text-base md:text-lg leading-[1.7] mb-7 max-w-md mx-auto">
                      ההדרכה המלאה וכל ספריית התכנים מחכות לך בתוך המועדון — יחד עם כלים ליישום בריאות טבעית בחיים עצמם.
                    </p>
                    <a
                      href={joinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white font-bold text-base md:text-lg px-8 py-4 rounded-full shadow-[0_12px_28px_rgba(158,98,108,0.35)] hover:-translate-y-0.5 transition-all"
                    >
                      להצטרפות למועדון ולצפייה מלאה
                    </a>
                    <div className="mt-5">
                      <button
                        onClick={() => onLoginRequest && onLoginRequest()}
                        className="text-[#E9E0DB] text-sm font-medium hover:text-white underline underline-offset-4 transition-colors"
                      >
                        כבר חברה במועדון? התחברי כאן
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8 text-center flex flex-col items-center">
              <div className="flex items-center justify-center gap-2 text-sm text-[#C88F96] font-bold mb-2">
                <Sparkles size={14} />
                <span>{categoryName || 'תודעה ושינוי מבפנים'}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#3E3935] mb-6 leading-tight text-center">{tutorial.title}</h1>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-b border-gray-200 pb-8 w-full max-w-lg mx-auto">
                <button
                  onClick={handleCompleteLesson}
                  className={`flex items-center justify-center gap-2 font-bold px-8 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto shadow-sm ${isCompleted ? 'bg-[#687B63] text-white hover:bg-opacity-80' : 'bg-[#E8EEE5] text-[#3E3935] hover:bg-[#3E3935] hover:text-white'}`}
                >
                  <CheckCircle size={22} />
                  {isCompleted ? 'הושלם' : 'סיימתי את ההדרכה'}
                </button>

                {hasNext && (isClubMember || accessibleTutorialIds.includes(tutorial.id + 1)) && (
                  <button
                    onClick={onNext}
                    className="flex items-center justify-center gap-2 text-[#3E3935] font-bold bg-white border border-gray-200 hover:border-[#3E3935] hover:bg-gray-50 px-8 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto shadow-sm"
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
                  className={`pb-3 text-base font-medium transition-all relative flex items-center gap-2 whitespace-nowrap ${activeTab === id ? 'text-[#3E3935]' : 'text-gray-500 hover:text-[#3E3935]'}`}
                >
                  <Icon size={18} />
                  {label}
                  {activeTab === id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3E3935] rounded-t-full"></span>}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-sm mb-12">
              {activeTab === 'about' && (
                <div className="text-[#716861] leading-[1.8] text-right">
                  <p className="mb-4">תיאור ההדרכה: {tutorial.title}.</p>
                  <h3 className="text-xl font-bold text-[#3E3935] mt-8 mb-4">נקודות מרכזיות:</h3>
                  <ul className="space-y-3 list-none p-0">
                    <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#C88F96] mt-3 shrink-0"></div><span>הבנת העקרונות הבסיסיים של הנושא.</span></li>
                    <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#C88F96] mt-3 shrink-0"></div><span>כלים פרקטיים ליישום מיידי.</span></li>
                  </ul>
                </div>
              )}

              {activeTab === 'notes' && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-[#3E3935]">הסיכום האישי שלך</h3>
                      <p className="text-[#716861] mt-1 max-w-xl leading-[1.8]">זה המקום שלך לעצור רגע ולכתוב תובנות מההדרכה.</p>
                    </div>
                  </div>
                  <div className="relative">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="התחילי לכתוב כאן..."
                      className="w-full min-h-[250px] p-6 bg-[#FAF7F2] border border-gray-200 rounded-2xl focus:border-[#C88F96] focus:ring-1 focus:ring-[#C88F96] outline-none resize-y text-[#716861] leading-[1.8] shadow-inner transition-all placeholder:text-gray-400 pb-16"
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
                      className="bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-all shadow-[0_12px_28px_rgba(158,98,108,0.25)] hover:shadow-md hover:-translate-y-0.5"
                    >
                      <Save size={18} /> שמירה
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && tutorial.pdfUrl && (
                <div>
                  <h3 className="text-xl font-bold text-[#3E3935] mb-2">חומרים נלווים להדרכה</h3>
                  <p className="text-[#716861] mb-6 leading-[1.8]">כאן ריכזתי עבורך את כל מה שצריך להשלים את הלמידה.</p>
                  <a
                    href={tutorial.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-[#C88F96]/30 transition-all cursor-pointer group"
                  >
                    <div className="w-12 h-12 bg-[#FAF7F2] rounded-full flex items-center justify-center text-[#3E3935] group-hover:bg-[#3E3935] group-hover:text-white transition-colors ml-4">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#3E3935] group-hover:text-[#C88F96] transition-colors">{tutorial.pdfTitle || 'קובץ מצורף להורדה'}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">לחצי כאן לפתיחה והורדה</p>
                    </div>
                    <Download size={20} className="text-gray-400 group-hover:text-[#C88F96]" />
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-80 shrink-0 hidden lg:block">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] p-5 sticky top-24">
              <div className="mb-6">
                <div className="flex justify-between items-center text-sm font-bold text-[#3E3935] mb-2">
                  <span>התקדמות בקטגוריה</span>
                  <span>{completedInCategory} / {categoryTutorials.length}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#687B63] h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
              <h3 className="font-bold text-[#3E3935] mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <Sparkles size={18} className="text-[#C88F96]" /> המשך הסדרה
              </h3>
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#C88F96]/30 flex gap-3 cursor-default relative">
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#C88F96] rounded-r-xl"></div>
                <div className="w-10 h-10 rounded-lg bg-[#3E3935] flex items-center justify-center text-white shrink-0">
                  <Sparkles size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#3E3935] truncate">{tutorial.title}</h4>
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
