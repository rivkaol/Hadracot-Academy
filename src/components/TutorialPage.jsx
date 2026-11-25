import { useState, useEffect, useRef } from 'react'
import { Sparkles, CheckCircle, ChevronLeft, BookOpen, Edit, Download, Loader, FileText, Crown } from 'lucide-react'
import confetti from 'canvas-confetti'
import Player from '@vimeo/player'
import { apiGetNote, apiSaveNote, apiSetCompleted, apiLogProgress, apiLogMemberProgress, apiGetTrialProgress } from '../api'
import { getTrackTutorials } from '../lib/catalogHelpers'
import { findShelfOf } from '../lib/series'
import SeriesShelf from './SeriesShelf'
import { trackEvent } from '../lib/trackEvent'
import StepBadge from './StepBadge'

const PREVIEW_SECONDS = 300 // חמש דקות טעימה חינם
const IMAGE_FILE_RE = /\.(jpe?g|png|gif|webp|avif|svg)(\?|#|$)/i

// עבור תמונות מ-Cloudinary: מוסיפים fl_attachment כדי שהדפדפן יוריד את הקובץ בפועל
// (Content-Disposition: attachment) במקום רק לפתוח אותו בטאב — כפתור "שמירה" אחד וברור,
// בלי להסתמך על "לחיצה ימנית ← שמירת תמונה" שקשה למי שפחות בטוחה טכנולוגית.
function toImageDownloadUrl(url) {
  const m = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.*)$/)
  return m ? `${m[1]}fl_attachment/${m[2]}` : url
}

// כרטיס אחיד לכל חלק בדף ההדרכה (על ההדרכה, חומרים, מחברת)
const SECTION_CARD = 'bg-white rounded-[1.5rem] p-5 md:p-8 border border-gray-100 border-t-4 border-t-[#E9D3DB] shadow-[0_10px_30px_rgba(106,52,71,0.06)]'

export default function TutorialPage({
  tutorial,
  tutorialsData,
  onNext,
  nextInfo, // { tutorial, isNewSeries, shelf } מ-getNextInShelf, או null
  onSelectTutorial,
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

  // שער הטעימה: למי שאינה מנויה — עצירה פיזית ברגע שמיקום הנגן מגיע ל-5 דקות.
  // בכוונה *לא* "זמן צפייה נטו מצטבר" (היה כך בעבר, ורבקה ביקשה לפשט: "ממש
  // מיד, לא במצטבר") — פשוט בודקים כל שנייה מה המיקום הנוכחי בפועל בנגן
  // (player.getCurrentTime, בקריאה אקטיבית — לא מסתמכים על תדירות אירועי
  // timeupdate שהתבררה כלא סדירה, למשל כשהטאב לא בפוקוס/ברקע), וברגע שהוא
  // מגיע ל-PREVIEW_SECONDS השער נפתח. "כבר הגעת לגבול" נשמר בשרת (reachedLimit)
  // כדי שרענון/כניסה חוזרת לא ייתנו עוד 5 דקות מאפס.
  useEffect(() => {
    if (hasAccess || !iframeRef.current) return
    const player = new Player(iframeRef.current)
    let cancelled = false
    let locked = false
    let firedQuarter = false
    let firedHalf = false
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

    const checkPosition = async () => {
      if (locked || cancelled) return
      let seconds
      try { seconds = await player.getCurrentTime() } catch { return }
      if (cancelled || locked) return
      maxSecRef.current = Math.max(maxSecRef.current, seconds)
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
      if (maxSecRef.current - lastSentRef.current >= 20) {
        lastSentRef.current = maxSecRef.current
        logProgress(false, false)
      }
      if (maxSecRef.current >= PREVIEW_SECONDS) {
        openGate()
        logProgress(true, false) // הגיעה לסוף הטעימה = ליד חמה
        trackEvent('trial_completed_5min', { email: viewerEmail, tutorialId: tutorial.id })
      }
    }
    const intervalId = setInterval(checkPosition, 1000)

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
      // הגנת קצה: אם השרת כבר מכיל 300+ שניות אבל reached_limit לא נשמר כ-true
      // מסיבה כלשהי — עדיין לא נותנים צפייה נוספת.
      if (startSeconds >= PREVIEW_SECONDS) alreadyReached = true
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

      player.on('play', onPlay)
    }
    init()

    return () => {
      cancelled = true
      clearInterval(intervalId)
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
  const [notes, setNotes] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [isSavingAuto, setIsSavingAuto] = useState(false)
  const [isCompleted, setIsCompleted] = useState(completedTutorials.includes(tutorial.id))
  const notesRef = useRef(notes)

  // הסדרה/המדף שההדרכה שייכת אליו — לרשימת "כל החלקים" ולכפתור "לחלק הבא"
  const shelfInfo = findShelfOf(tutorialsData, tutorial.id)
  const canWatch = (t) => isClubMember || accessibleTutorialIds.includes(t.id)
  const nextTutorial = nextInfo && canWatch(nextInfo.tutorial) ? nextInfo.tutorial : null

  useEffect(() => { notesRef.current = notes }, [notes])

  useEffect(() => {
    setNotes('')
    setIsCompleted(completedTutorials.includes(tutorial.id))
    setIsSaved(false)

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
        .then(() => {
          setIsSavingAuto(false)
          setIsSaved(true)
        })
        .catch(() => setIsSavingAuto(false))
    }, 1500)
    return () => clearTimeout(timer)
  }, [notes, userEmail, tutorial.id])

  const handleCompleteLesson = async () => {
    const next = !isCompleted
    setIsCompleted(next)
    const newArr = next
      ? [...completedTutorials, tutorial.id]
      : completedTutorials.filter((id) => id !== tutorial.id)
    setCompletedTutorials(newArr)

    if (next) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#2B2724', '#A0627A', '#1F4A3A', '#A0627A'], disableForReducedMotion: true })
    }

    if (userEmail) {
      apiSetCompleted(cred, tutorial.id, next).catch(console.error)
      apiLogMemberProgress(cred, { tutorialId: tutorial.id, completed: next }).catch(() => {})
      if (next) trackEvent('lesson_completed', { email: userEmail, tutorialId: tutorial.id })
    }
  }

  const vimeoSrc = `https://player.vimeo.com/video/${tutorial.vimeoId?.toString().trim() || '76979871'}?${tutorial.vimeoHash ? `h=${tutorial.vimeoHash.toString().trim()}&` : ''}color=7E3F55&title=0&byline=0&portrait=0&badge=0&dnt=1&playsinline=1`

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
                <div className="fixed inset-0 z-[60] lg:absolute lg:z-30 flex items-center justify-center text-center px-6 py-8 overflow-y-auto" dir="rtl" style={{ background: 'rgba(106,52,71,0.97)' }}>
                  <div className="max-w-lg w-full my-auto">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#F8F3EC] text-[#6A3447] mb-4 sm:mb-5 shadow-lg mx-auto">
                      <Crown size={28} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#FFFFFF] mb-3">רק התחלנו.</h2>
                    <p className="text-[#F4E9ED] text-base md:text-lg leading-[1.7] mb-2 max-w-md mx-auto">
                      מה שראית עכשיו הוא הצעד הראשון. בתוך המועדון מחכה לך הדרך המלאה — כדי שלא תישארי רק עם השראה,
                      אלא תוכלי להמשיך משיעור לשיעור ולבנות שינוי אמיתי.
                    </p>
                    <button
                      onClick={() => onShowTrackMap && onShowTrackMap()}
                      className="mt-5 inline-flex items-center justify-center gap-2 bg-[#F8F3EC] text-[#6A3447] font-bold text-base md:text-lg px-8 py-4 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all"
                    >
                      אני רוצה להמשיך במסע
                    </button>
                    <p className="text-[#E9D3DB] text-sm mt-3">כשתצטרפי, המסלול המלא ייפתח לך ותוכלי להמשיך מכאן.</p>
                    <div className="mt-5">
                      <button
                        onClick={() => onLoginRequest && onLoginRequest()}
                        className="text-[#F4E9ED] text-sm font-medium hover:text-white underline underline-offset-4 transition-colors"
                      >
                        כבר חברה במועדון? התחברי כאן
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8 text-center flex flex-col items-center">
              <StepBadge tutorial={tutorial} totalSteps={totalSteps} size="lg" className="mb-6 text-center" />

              <div className="flex flex-col items-center justify-center gap-4 border-b border-gray-200 pb-8 w-full max-w-lg mx-auto">
                <button
                  onClick={handleCompleteLesson}
                  className={`flex items-center justify-center gap-2 text-lg font-bold px-8 py-4 rounded-full transition-all duration-300 w-full shadow-sm ${isCompleted ? 'bg-[#1F4A3A] text-white hover:bg-opacity-90' : 'bg-[#F4E9ED] text-[#6A3447] border border-[#E9D3DB] hover:bg-[#6A3447] hover:text-white'}`}
                >
                  <CheckCircle size={24} />
                  {isCompleted ? 'סימנתי שצפיתי ✓' : 'סיימתי לצפות בחלק הזה'}
                </button>

                {nextTutorial && (
                  <button
                    onClick={onNext}
                    className="flex items-center justify-between gap-3 text-right bg-[#6A3447] text-white px-6 py-5 rounded-[1.25rem] w-full shadow-[0_16px_32px_rgba(106,52,71,0.25)] hover:-translate-y-0.5 transition-all"
                  >
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-base font-medium text-[#E9D3DB]"><span aria-hidden="true" className="w-6 h-px bg-[#D9BD86]" />
                        {nextInfo.isNewSeries ? `לסדרה הבאה: סדרה ${nextInfo.shelf.number}` : 'לחלק הבא'}
                      </span>
                      <span className="block text-lg font-bold leading-snug">{nextTutorial.title}</span>
                    </span>
                    <ChevronLeft size={28} className="shrink-0" />
                  </button>
                )}
              </div>
            </div>

            {/* במקום לשוניות: חלקים אחד מתחת לשני, כדי שבנייד שום דבר לא יוסתר בצד.
                "על ההדרכה" מופיע רק כשיש תיאור בגיליון (בעבר היה כאן טקסט כללי זהה לכל הדרכה). */}
            <div className="flex flex-col gap-6 mb-12">
              {tutorial.description && (
                <section className={SECTION_CARD}>
                  <h3 className="text-[22px] font-bold text-[#1F4A3A] mb-3 flex items-center gap-2">
                    <BookOpen size={22} className="text-[#7E3F55]" aria-hidden="true" /> על ההדרכה
                  </h3>
                  <p className="text-[#2B2724] text-[17px] leading-[1.8] whitespace-pre-line">{tutorial.description}</p>
                </section>
              )}

              {tutorial.files && tutorial.files.length > 0 && (
                <section className={SECTION_CARD}>
                  <h3 className="text-[22px] font-bold text-[#1F4A3A] mb-2 flex items-center gap-2"><Download size={22} className="text-[#7E3F55]" aria-hidden="true" /> חומרים להורדה</h3>
                  <p className="text-[#6B625C] mb-6 leading-[1.8]">כאן ריכזתי עבורך את כל מה שצריך להשלים את הלמידה.</p>
                  <div className="space-y-3">
                    {tutorial.files.map((file, i) =>
                      IMAGE_FILE_RE.test(file.url) ? (
                        <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`תמונה: ${file.title || 'תמונה נלווית להדרכה'} — לחצי לפתיחה בגודל מלא`}
                            className="block"
                          >
                            <img
                              src={file.url}
                              alt={file.title || 'תמונה נלווית להדרכה'}
                              loading="lazy"
                              className="w-full max-h-[480px] object-contain bg-[#FFFFFF]"
                            />
                          </a>
                          <div className="flex items-center justify-between gap-3 p-3 border-t border-gray-100">
                            <span className="text-sm font-bold text-[#2B2724] truncate">
                              {file.title || 'תמונה נלווית להדרכה'}
                            </span>
                            <a
                              href={toImageDownloadUrl(file.url)}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-sm font-bold text-[#7E3F55] hover:text-white hover:bg-[#7E3F55] border border-[#A0627A]/40 px-3 py-1.5 rounded-full transition-colors shrink-0"
                            >
                              <Download size={16} /> שמירת התמונה
                            </a>
                          </div>
                        </div>
                      ) : (
                        <a
                          key={i}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-[#A0627A]/30 transition-all cursor-pointer group"
                        >
                          <div className="w-12 h-12 bg-[#FFFFFF] rounded-full flex items-center justify-center text-[#2B2724] group-hover:bg-[#6A3447] group-hover:text-white transition-colors ml-4 shrink-0">
                            <FileText size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-[#2B2724] group-hover:text-[#7E3F55] transition-colors truncate">{file.title || 'קובץ מצורף להורדה'}</h4>
                            <p className="text-sm text-gray-500 mt-0.5">לחצי כאן לפתיחה והורדה</p>
                          </div>
                          <Download size={20} className="text-gray-500 group-hover:text-[#A0627A] shrink-0" />
                        </a>
                      )
                    )}
                  </div>
                </section>
              )}
              {userEmail && (
                <section className={SECTION_CARD}>
                  <div className="mb-5">
                    <h3 className="text-[22px] font-bold text-[#1F4A3A] flex items-center gap-2"><Edit size={22} className="text-[#7E3F55]" aria-hidden="true" /> המחברת האישית שלך</h3>
                    <p className="text-[#4A433E] text-[17px] mt-1 max-w-xl leading-[1.8]">זה המקום שלך לעצור רגע ולכתוב תובנות מההדרכה.</p>
                  </div>
                  <div className="relative">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="התחילי לכתוב כאן..."
                      aria-label="המחברת האישית שלך"
                      className="w-full min-h-[220px] p-5 bg-[#FFFFFF] border border-gray-300 rounded-2xl focus:border-[#A0627A] focus:ring-1 focus:ring-[#A0627A] outline-none resize-y text-[#2B2724] text-[17px] leading-[1.8] transition-all placeholder:text-gray-500"
                    />
                  </div>
                  <p role="status" className="mt-3 text-[16px] font-medium flex items-center gap-1.5 min-h-[28px]">
                    {isSavingAuto ? (
                      <span className="text-[#6B625C] flex items-center gap-1.5"><Loader size={18} className="animate-spin" aria-hidden="true" /> שומרת...</span>
                    ) : isSaved ? (
                      <span className="text-[#173A2D] flex items-center gap-1.5"><CheckCircle size={18} aria-hidden="true" /> נשמר</span>
                    ) : (
                      <span className="text-[#6B625C]">כל מה שתכתבי נשמר לבד. אין צורך ללחוץ על שום כפתור.</span>
                    )}
                  </p>
                </section>
              )}

            </div>
          </div>

          {/* כל החלקים בסדרה — במחשב בצד, בנייד מתחת לתוכן (לא מוסתר) */}
          {shelfInfo && onSelectTutorial && (
            <aside className="w-full lg:w-[380px] shrink-0">
              <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto rounded-[1.5rem]">
                <p className="flex items-center gap-2 text-lg font-bold text-[#1F4A3A] mb-3">
                  <Sparkles size={20} className="text-[#A0627A]" />
                  {shelfInfo.isSeries ? 'כל החלקים בסדרה' : 'עוד הדרכות במדף הזה'}
                </p>
                <SeriesShelf
                  shelf={shelfInfo.shelf}
                  tone={shelfInfo.shelf.id === 'health' ? 'health' : 'series'}
                  completedTutorials={completedTutorials}
                  currentTutorialId={tutorial.id}
                  canWatch={canWatch}
                  onSelectTutorial={onSelectTutorial}
                  layout="list"
                />
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  )
}
