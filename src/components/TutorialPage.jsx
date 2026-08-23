import { useState, useEffect, useRef } from 'react'
import { Sparkles, CheckCircle, ChevronLeft, BookOpen, Edit, Download, Save, Loader, FileText, Crown } from 'lucide-react'
import confetti from 'canvas-confetti'
import Player from '@vimeo/player'
import { apiGetNote, apiSaveNote, apiSetCompleted, apiLogProgress, apiLogMemberProgress, apiGetTrialProgress } from '../api'
import { getTrackTutorials, getNextAccessibleTutorial } from '../lib/catalogHelpers'
import { trackEvent } from '../lib/trackEvent'
import StepBadge from './StepBadge'

const PREVIEW_SECONDS = 300 // חמש דקות טעימה חינם

export default function TutorialPage({
  tutorial,
  tutorialsData,
  categoryName,
  onNext,
  hasNext,
  accessibleTutorialIds,
  userEmail,
  userPassword,
  completedTutorials,
  setCompletedTutorials,
  isClubMember, // בפועל hasFullAccess (חברה או VIP) — נשלח כך מ-App.jsx
  leadEmail,
  onLoginRequest,
  onShowTrackMap,
}) {
  const cred = { email: userEmail, password: userPassword }
  const hasAccess = isClubMember || accessibleTutorialIds.includes(tutorial.id)
  const viewerEmail = userEmail || leadEmail || '' // מי שנרשמה/מחוברת — למעקב מעורבות
  const totalSteps = getTrackTutorials(tutorialsData).length
  const iframeRef = useRef(null)
  const maxSecRef = useRef(0)
  const lastSentRef = useRef(0)
  const [gateOpen, setGateOpen] = useState(false)
  const [trialSecondsWatched, setTrialSecondsWatched] = useState(0)

  // שער הטעימה: למי שאינה מנויה — עצירה פיזית אחרי 5 דק' צפייה מצטברת (לא מיקום
  // מקסימלי בסרטון), חסימת גרירה, ומעקב מעורבות. נטען קודם ההתקדמות הקיימת
  // מהשרת — Refresh/כניסה חוזרת לא מאפסים את הטעימה, ומי שכבר הגיעה לגבול
  // מקבלת את השער מיד בלי צפייה נוספת.
  useEffect(() => {
    if (hasAccess || !iframeRef.current) return
    const player = new Player(iframeRef.current)
    let cancelled = false
    let locked = false
    let firedQuarter = false
    let firedHalf = false
    let lastPlayerPos = 0
    maxSecRef.current = 0
    lastSentRef.current = 0
    setTrialSecondsWatched(0)

    const logProgress = (reachedLimit, newAttempt) => {
      if (!viewerEmail) return
      apiLogProgress({
        email: viewerEmail,
        tutorialId: tutorial.id,
        tutorialTitle: tutorial.title,
        seconds: Math.round(maxSecRef.current),
        reachedLimit: !!reachedLimit,
        newAttempt: !!newAttempt,
      }).catch(() => {})
    }

    const enforcePause = () => { player.pause().catch(() => {}) }

    const openGate = async () => {
      locked = true
      try { await player.pause() } catch { /* התעלמות משגיאות נגן */ }
      setGateOpen(true)
    }

    // צפייה מצטברת: סכימת "קפיצות קדימה קטנות" בין טיקים (ניגון אמיתי),
    // לא מיקום מוחלט בסרטון — כדי שחזרה אחורה וצפייה חוזרת תיספר כצפייה נוספת,
    // לא "בחינם" כי כבר עברנו שם קודם.
    const onTime = (d) => {
      if (locked) { enforcePause(); return } // גיבוי הגנתי — onPlay כבר תופס את רוב המקרים
      const delta = d.seconds - lastPlayerPos
      lastPlayerPos = d.seconds
      if (delta > 0 && delta < 2) maxSecRef.current += delta
      setTrialSecondsWatched(maxSecRef.current)

      if (!firedQuarter && maxSecRef.current >= PREVIEW_SECONDS * 0.25) {
        firedQuarter = true
        trackEvent('trial_25_percent', { email: viewerEmail, tutorialId: tutorial.id })
      }
      if (!firedHalf && maxSecRef.current >= PREVIEW_SECONDS * 0.5) {
        firedHalf = true
        trackEvent('trial_50_percent', { email: viewerEmail, tutorialId: tutorial.id })
      }
      // שליחת עדכון מעורבות כל ~20 שניות
      if (!locked && maxSecRef.current - lastSentRef.current >= 20) {
        lastSentRef.current = maxSecRef.current
        logProgress(false, false)
      }
      if (maxSecRef.current >= PREVIEW_SECONDS && !locked) {
        openGate()
        logProgress(true, false) // הגיעה לסוף הטעימה = ליד חמה
        trackEvent('trial_completed_5min', { email: viewerEmail, tutorialId: tutorial.id })
      }
    }
    // שמירת lastPlayerPos בסנכרון אחרי גרירה, כדי שהטיק הבא לא יספור קפיצה כאילו הייתה צפייה
    const onSeek = (d) => { lastPlayerPos = d.seconds }
    const onPlay = () => { if (locked) enforcePause() }

    const init = async () => {
      let startSeconds = 0
      let alreadyReached = false
      if (viewerEmail) {
        try {
          const progress = await apiGetTrialProgress({ email: viewerEmail, tutorialId: tutorial.id })
          startSeconds = Math.max(0, Number(progress?.maxSeconds) || 0)
          alreadyReached = progress?.reachedLimit === true
        } catch { /* אין התקדמות קודמת זמינה — מתחילים מ-0 */ }
      }
      if (cancelled) return

      maxSecRef.current = startSeconds
      lastSentRef.current = startSeconds
      setTrialSecondsWatched(startSeconds)

      if (alreadyReached) {
        locked = true
        setGateOpen(true)
        player.on('play', onPlay)
        return
      }

      // רישום כניסה חדשה להדרכה
      logProgress(false, true)
      trackEvent('trial_video_started', { email: viewerEmail, tutorialId: tutorial.id })

      player.on('timeupdate', onTime)
      player.on('seeking', onSeek)
      player.on('seeked', onSeek)
      player.on('play', onPlay)
    }
    init()

    return () => {
      cancelled = true
      player.off('timeupdate', onTime)
      player.off('seeking', onSeek)
      player.off('seeked', onSeek)
      player.off('play', onPlay)
      if (!locked) logProgress(false, false) // שמירת זמן הצפייה הסופי ביציאה (רק אם עוד לא ננעלה)
    }
  }, [hasAccess, tutorial.id, viewerEmail])

  // מעקב התקדמות לחברות/רוכשות עם גישה מלאה — טבלה נפרדת מהלידים, לא הייתה קיימת קודם.
  useEffect(() => {
    if (!hasAccess || !userEmail || !iframeRef.current) return
    const player = new Player(iframeRef.current)
    let maxSec = 0
    let lastSent = 0
    trackEvent('lesson_started', { email: userEmail, tutorialId: tutorial.id })

    const send = () => {
      apiLogMemberProgress(cred, { tutorialId: tutorial.id, seconds: Math.round(maxSec) }).catch(() => {})
    }
    const onTime = (d) => {
      if (d.seconds > maxSec) maxSec = d.seconds
      if (d.seconds - lastSent >= 20) {
        lastSent = d.seconds
        send()
      }
    }
    player.on('timeupdate', onTime)
    return () => {
      player.off('timeupdate', onTime)
      send()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccess, tutorial.id, userEmail])
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
  // "הדרכה הבאה" לפי סדר אמיתי במסלול, לא אריתמטיקת id+1 (id-ים לא רציפים)
  const nextAccessibleTutorial = getNextAccessibleTutorial(tutorialsData, tutorial, {
    hasFullAccess: isClubMember,
    accessibleTutorialIds,
  })

  useEffect(() => { notesRef.current = notes }, [notes])

  useEffect(() => {
    setNotes('')
    setIsCompleted(completedTutorials.includes(tutorial.id))
    setIsSaved(false)
    if (activeTab === 'resources' && !(tutorial.files && tutorial.files.length)) setActiveTab('notes')

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
      apiLogMemberProgress(cred, { tutorialId: tutorial.id, completed: next }).catch(() => {})
      if (next) trackEvent('lesson_completed', { email: userEmail, tutorialId: tutorial.id })
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

              {/* אינדיקטור טעימה רך — לא ספירה לחוצה מהשנייה הראשונה */}
              {!hasAccess && !gateOpen && (
                <div className="absolute top-3 left-3 z-20 bg-black/60 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {trialSecondsWatched >= PREVIEW_SECONDS - 60
                    ? 'נשארה עוד דקה בטעימה שלך'
                    : 'טעימת מועדון · 5 דקות'}
                </div>
              )}

              {!hasAccess && gateOpen && (
                // במובייל: מסך מלא וממורכז (כדי שהכפתור לא ייחתך); במחשב: בתוך הווידאו כמו קודם
                <div className="fixed inset-0 z-[60] lg:absolute lg:z-30 flex items-center justify-center text-center px-6 py-8 overflow-y-auto" dir="rtl" style={{ background: 'rgba(43,39,36,0.96)' }}>
                  <div className="max-w-lg w-full my-auto">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white mb-4 sm:mb-5 shadow-lg mx-auto">
                      <Crown size={28} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#FFFDF9] mb-3">רק התחלנו.</h2>
                    <p className="text-[#E9E0DB] text-base md:text-lg leading-[1.7] mb-2 max-w-md mx-auto">
                      מה שראית עכשיו הוא הצעד הראשון. בתוך המועדון מחכה לך הדרך המלאה — כדי שלא תישארי רק עם השראה,
                      אלא תוכלי להמשיך משיעור לשיעור ולבנות שינוי אמיתי.
                    </p>
                    <button
                      onClick={() => onShowTrackMap && onShowTrackMap()}
                      className="mt-5 inline-flex items-center justify-center gap-2 bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white font-bold text-base md:text-lg px-8 py-4 rounded-full shadow-[0_12px_28px_rgba(158,98,108,0.35)] hover:-translate-y-0.5 transition-all"
                    >
                      אני רוצה להמשיך במסע
                    </button>
                    <p className="text-[#B8ADA6] text-sm mt-3">כשתצטרפי נמשיך בדיוק מהמקום שבו עצרת.</p>
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
              <StepBadge tutorial={tutorial} totalSteps={totalSteps} size="lg" className="mb-6 text-center" />

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-b border-gray-200 pb-8 w-full max-w-lg mx-auto">
                <button
                  onClick={handleCompleteLesson}
                  className={`flex items-center justify-center gap-2 font-bold px-8 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto shadow-sm ${isCompleted ? 'bg-[#687B63] text-white hover:bg-opacity-80' : 'bg-[#E8EEE5] text-[#3E3935] hover:bg-[#3E3935] hover:text-white'}`}
                >
                  <CheckCircle size={22} />
                  {isCompleted ? 'הושלם' : 'סיימתי את ההדרכה'}
                </button>

                {hasNext && nextAccessibleTutorial && (
                  <button
                    onClick={onNext}
                    className="flex items-center justify-center gap-2 text-[#3E3935] font-bold bg-white border border-gray-200 hover:border-[#3E3935] hover:bg-gray-50 px-8 py-3.5 rounded-full transition-all duration-300 w-full sm:w-auto shadow-sm"
                  >
                    לצעד הבא
                    <ChevronLeft size={22} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex overflow-x-auto hide-scrollbar gap-8 border-b border-gray-200 mb-6">
              {[
                { id: 'about', label: 'מה תקבלי מההדרכה', Icon: BookOpen },
                { id: 'notes', label: 'המחברת האישית שלך', Icon: Edit },
                ...(tutorial.files && tutorial.files.length ? [{ id: 'resources', label: 'חומרים להורדה', Icon: Download }] : []),
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

              {activeTab === 'resources' && tutorial.files && tutorial.files.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-[#3E3935] mb-2">חומרים נלווים להדרכה</h3>
                  <p className="text-[#716861] mb-6 leading-[1.8]">כאן ריכזתי עבורך את כל מה שצריך להשלים את הלמידה.</p>
                  <div className="space-y-3">
                    {tutorial.files.map((file, i) => (
                      <a
                        key={i}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-[#C88F96]/30 transition-all cursor-pointer group"
                      >
                        <div className="w-12 h-12 bg-[#FAF7F2] rounded-full flex items-center justify-center text-[#3E3935] group-hover:bg-[#3E3935] group-hover:text-white transition-colors ml-4 shrink-0">
                          <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#3E3935] group-hover:text-[#C88F96] transition-colors truncate">{file.title || 'קובץ מצורף להורדה'}</h4>
                          <p className="text-sm text-gray-500 mt-0.5">לחצי כאן לפתיחה והורדה</p>
                        </div>
                        <Download size={20} className="text-gray-400 group-hover:text-[#C88F96] shrink-0" />
                      </a>
                    ))}
                  </div>
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
