import { useState, useEffect, useMemo } from 'react'
import { apiLogin, apiLastWatched, apiRegisterLead, apiMarkOnboardingSeen } from './api'
import { useCatalog } from './useCatalog'
import { useViewerState } from './hooks/useViewerState'
import { trackEvent } from './lib/trackEvent'
import { findTutorialById, getTrackTutorials } from './lib/catalogHelpers'
import { getNextInShelf } from './lib/series'

import SkeletonGallery from './components/SkeletonGallery'
import ClubLibrary from './components/ClubLibrary'
import LoginScreen from './components/LoginScreen'
import LeadCaptureScreen from './components/LeadCaptureScreen'
import AdminPage from './components/AdminPage'
import ProfilePage from './components/ProfilePage'
import TutorialsHub from './components/TutorialsHub'
import TutorialPage from './components/TutorialPage'
import MemberDashboard from './components/MemberDashboard'
import LandingHome from './components/LandingHome'
import OnboardingOverlay from './components/OnboardingOverlay'
import TrialWelcomeScreen from './components/TrialWelcomeScreen'
import TrialTrackMapScreen from './components/TrialTrackMapScreen'
import ClubGateway from './components/ClubGateway'
import { pricingConfig } from './pricing'

import { ChevronRight, LogOut, User, Library, Search, Crown, Lightbulb, MessageCircle, Home, Users } from 'lucide-react'

// "חדש במועדון" הוסר מהניווט העליון — אין עדיין destination אמיתי (לא היעד
// לחיצה, לא מפגש קיים). האזור בתוך ה-Dashboard נשאר conditional על nextLiveSession.
const MEMBER_NAV_ITEMS = [
  { label: 'דף הבית', key: 'home', Icon: Home },
  { label: 'כל ההדרכות', key: 'library', Icon: Search },
  { label: 'החשבון שלי', key: 'profile', Icon: User },
]
// כפתורי התפריט העליון לחברה: כפתורים ממשיים עם אייקון ורקע — לא טקסט חופשי שלא נקלט כלחיץ
const NAV_PILL = 'flex items-center gap-2 text-lg font-bold px-5 py-2.5 rounded-full border transition-colors'
const NAV_PILL_IDLE = 'bg-[#FFFFFF] text-[#2B2724] border-[#ECE6E1] hover:bg-[#F4E9ED] hover:border-[#C99AAB]'
const NAV_PILL_ACTIVE = 'bg-[#6A3447] text-white border-[#6A3447]'

// פס עליון סטיקי מעל הכול, למי שעדיין לא חברה — לעולם לא חבוי בתפריט.
function VisitorTopBar({ onLogin }) {
  return (
    <div className="bg-[#6A3447] text-white text-center py-2.5 px-4 text-sm font-medium sticky top-0 z-[60]">
      כבר חברת מועדון?{' '}
      <button onClick={onLogin} className="underline font-bold hover:text-[#E9D3DB] transition-colors">
        התחברי כאן
      </button>
    </div>
  )
}

function Header({
  showBack = false,
  activeView,
  viewerState,
  hasFullAccess,
  isAuthenticated,
  isVip,
  userName,
  onBack,
  onLogout,
  onGoHome,
  onGoLogin,
  onGoProfile,
  onGoLibrary,
}) {
  // רק member/vip מקבלות מסגרת "מועדון" מלאה (מסלול, קהילה). רוכשת בודדת
  // אינה חברת מועדון — לא מציגים לה את השפה/הניווט הזה (ראו App.jsx viewerState==='purchaser').
  const isMember = hasFullAccess
  const isPurchaser = viewerState === 'purchaser'
  // לחברה: התפריט תופס את כל הצד, והשורה החיוורת באמצע יורדת (הלוגו לא קיים בשרת ממילא)
  const wideNav = isMember && !showBack
  return (
    <header className="bg-white md:sticky md:top-0 z-50 border-b border-[#F4E9ED] shadow-[0_4px_20px_rgba(106,52,71,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        <div className={`${wideNav ? 'flex-1' : 'w-1/3'} flex items-center gap-3`}>
          {showBack ? (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 md:gap-2 text-[#2B2724] font-bold bg-[#EEF3EF] hover:bg-[#6A3447] hover:text-white px-4 md:px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm border border-[#6A3447]/10"
            >
              <ChevronRight size={24} />
              <span className="text-base md:text-lg">חזרה</span>
            </button>
          ) : isMember ? (
            <nav className="hidden lg:flex items-center gap-3">
              <button onClick={onGoHome} aria-label="דף הבית" className="shrink-0 ml-2">
                <img src="/img/club/logo.png" alt="" className="h-11 w-auto" />
              </button>
              {MEMBER_NAV_ITEMS.map(({ label, key, Icon }) => (
                <button
                  key={key}
                  onClick={key === 'library' ? onGoLibrary : key === 'profile' ? onGoProfile : onGoHome}
                  aria-current={activeView === key ? 'page' : undefined}
                  className={`${NAV_PILL} ${activeView === key ? NAV_PILL_ACTIVE : NAV_PILL_IDLE}`}
                >
                  <Icon size={22} />
                  {label}
                </button>
              ))}
              <a
                href={`${pricingConfig.whatsappBaseUrl}?text=${encodeURIComponent('היי רבקה, אשמח להצטרף לקבוצת המועדון')}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${NAV_PILL} ${NAV_PILL_IDLE}`}
              >
                <Users size={22} />
                הקהילה
              </a>
            </nav>
          ) : isPurchaser ? (
            <nav className="hidden lg:flex items-center gap-5">
              <button
                onClick={onGoLibrary}
                className="text-base font-bold text-[#5E5954] hover:text-[#2B2724] transition-colors"
              >
                ההדרכות שלי
              </button>
              <button
                onClick={onGoProfile}
                className="text-base font-bold text-[#5E5954] hover:text-[#2B2724] transition-colors"
              >
                החשבון שלי
              </button>
            </nav>
          ) : isAuthenticated ? (
            <button
              onClick={onLogout}
              className="text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
              title="התנתקות"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">יציאה</span>
            </button>
          ) : null}
        </div>

        <div className={`${wideNav ? 'w-1/3 flex lg:hidden' : 'w-1/3 flex'} justify-center`}>
          <div className="cursor-pointer flex flex-col items-center" onClick={onGoHome}>
            <img
              src="/img/club/logo.png"
              alt="רבקה הולצברג, בריאות שבאה מהלב"
              className="h-10 md:h-12 w-auto object-contain"
            />
            <p className="text-[15px] text-[#7E3F55] font-medium hidden md:block mt-0.5">
              המרחב שלך לצמיחה, רוגע ובריאות אמיתית
            </p>
          </div>
        </div>

        <div className="w-1/3 flex justify-end items-center gap-3">
          <div className="text-left mr-3 hidden md:block">
            {isAuthenticated ? (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-[#2B2724] truncate max-w-[160px]" title={userName}>
                    שלום {userName}
                  </p>
                  {isVip && (
                    <span className="bg-gradient-to-r from-[#A0627A] to-[#7E3F55] text-white text-[15px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Crown size={12} /> VIP
                    </span>
                  )}
                </div>
                <a
                  href={`${pricingConfig.whatsappBaseUrl}?text=${encodeURIComponent('היי רבקה, יש לי רעיון להדרכה חדשה:')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#7E3F55] font-bold hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Lightbulb size={14} /> יש לי רעיון להדרכה
                </a>
              </div>
            ) : (
              <button
                onClick={onGoLogin}
                className="text-[15px] font-bold text-[#7E3F55] hover:underline mt-2"
              >
                התחברי למרחב
              </button>
            )}
          </div>
          <div
            className="relative h-11 w-11 rounded-full bg-[#F4E9ED] flex items-center justify-center text-[#2B2724] cursor-pointer hover:bg-[#6A3447] hover:text-white transition-colors"
            onClick={() => (!isAuthenticated ? onGoLogin() : onGoProfile())}
          >
            <User size={18} />
            {isAuthenticated && isVip && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-[#A0627A] to-[#7E3F55] w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-white md:hidden">
                <Crown size={10} className="text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function BottomNav({ activeView, isAuthenticated, isKeyboardOpen, onGoHome, onGoLibrary, onGoProfile, onGoLogin }) {
  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex ${isKeyboardOpen ? 'hidden' : ''}`}
      style={{ minHeight: '72px', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <button
        onClick={onGoHome}
        className={`flex flex-col items-center justify-center w-full h-full pt-2 pb-1 ${activeView === 'home' ? 'text-[#7E3F55] shadow-[inset_0_3px_0_#7E3F55]' : 'text-[#6B625C] hover:text-[#7E3F55]'}`}
      >
        <Library size={26} />
        <span className="text-[16px] mt-1 font-bold">בית</span>
      </button>
      <button
        onClick={onGoLibrary}
        className={`flex flex-col items-center justify-center w-full h-full pt-2 pb-1 ${activeView === 'library' ? 'text-[#7E3F55] shadow-[inset_0_3px_0_#7E3F55]' : 'text-[#6B625C] hover:text-[#7E3F55]'}`}
      >
        <Search size={26} />
        <span className="text-[16px] mt-1 font-bold">כל ההדרכות</span>
      </button>
      <button
        onClick={() => (!isAuthenticated ? onGoLogin() : onGoProfile())}
        className={`flex flex-col items-center justify-center w-full h-full pt-2 pb-1 ${activeView === 'profile' ? 'text-[#7E3F55] shadow-[inset_0_3px_0_#7E3F55]' : 'text-[#6B625C] hover:text-[#7E3F55]'}`}
      >
        <User size={26} />
        <span className="text-[16px] mt-1 font-bold">האזור שלי</span>
      </button>
      <a
        href={`${pricingConfig.whatsappBaseUrl}?text=${encodeURIComponent('היי רבקה, אני צריכה עזרה באתר המועדון')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center w-full h-full pt-2 pb-1 text-[#6B625C] hover:text-[#7E3F55]"
      >
        <MessageCircle size={26} />
        <span className="text-[16px] mt-1 font-bold">עזרה</span>
      </a>
    </nav>
  )
}

export default function App() {
  const [view, setView] = useState('home')
  const [selectedTutorial, setSelectedTutorial] = useState(null)
  const [nextTutorial, setNextTutorial] = useState(null)
  // האם מבקרת לא-מזוהה כבר בחרה "אני עדיין לא חברה" בשער הכניסה — אם לא,
  // מוצג ClubGateway ולא ה-Landing השיווקי. נשאר true לאורך הביקור, לא נשאל שוב בכל ניווט.
  // השער שולח מבקרות ל-/join, ולכן נשאר false; ה-Showroom שבתוך האפליקציה נשאר רק לטעימה (viewerState==='trial').
  const [hasChosenExplore] = useState(false)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [accessibleTutorialIds, setAccessibleTutorialIds] = useState([])
  const [completedTutorials, setCompletedTutorials] = useState([])
  // נשמר כ-id בלבד (כך מגיע מהשרת) — האובייקט המלא נגזר למטה מ-tutorialsData,
  // כדי שלא יהיה חלון זמן שבו lastWatchedTutorial הוא מספר ולא אובייקט הדרכה.
  const [lastWatchedId, setLastWatchedId] = useState(null)
  const [isClubMember, setIsClubMember] = useState(false)
  const [isVip, setIsVip] = useState(false)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true) // true עד שנטען משתמש אמיתי — לא להבזיק onboarding בטעינה

  const [authLoading, setAuthLoading] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [pendingTutorial, setPendingTutorial] = useState(null)
  const [prefillEmail, setPrefillEmail] = useState('') // מייל מוכן מראש בהתחברות (מנויה שזוהתה)
  const [searchQuery, setSearchQuery] = useState('')
  // "כל ההדרכות" לחברה: הנושא הפתוח (null / 'mind' / 'body'), ומאיפה נכנסה להדרכה,
  // כדי ש"חזרה" מדף הדרכה תחזיר לאותה רשימה ולא תמיד לבית.
  const [libraryTopic, setLibraryTopic] = useState(null)
  const [returnView, setReturnView] = useState('home')
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

  const [lead, setLead] = useState(null) // ליד אנונימית שנרשמה לטעימה
  const [leadLoading, setLeadLoading] = useState(false)
  const [adminKey, setAdminKey] = useState('')

  const { tutorialsData, catalogLoading, fetchCatalog } = useCatalog()

  // נגזר תמיד מ-tutorialsData העדכני — לעולם לא "תקוע" כמספר גולמי.
  const lastWatchedTutorial = useMemo(
    () => (lastWatchedId ? findTutorialById(tutorialsData, lastWatchedId) : null),
    [tutorialsData, lastWatchedId]
  )

  const { state: viewerState, hasFullAccess } = useViewerState({
    isAuthenticated,
    isClubMember,
    isVip,
    accessibleTutorialIds,
    lead,
  })

  const dismissOnboarding = () => {
    setHasSeenOnboarding(true)
    if (userEmail) apiMarkOnboardingSeen({ email: userEmail, password: userPassword }).catch(() => {})
  }

  useEffect(() => {
    const onFocusIn = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') setIsKeyboardOpen(true)
    }
    const onFocusOut = () => setIsKeyboardOpen(false)
    window.addEventListener('focusin', onFocusIn)
    window.addEventListener('focusout', onFocusOut)
    return () => {
      window.removeEventListener('focusin', onFocusIn)
      window.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  const applyUser = (user, password) => {
    setUserEmail(user.email)
    setUserPassword(password)
    setUserName(user.name)
    setAccessibleTutorialIds(user.purchasedProductIds || [])
    setCompletedTutorials(user.completed || [])
    setIsClubMember(user.isClubMember === true)
    setIsVip(user.isVip === true)
    setHasSeenOnboarding(user.hasSeenOnboarding === true)
    setLastWatchedId(user.lastWatched || null)
    setIsAuthenticated(true)
    localStorage.setItem(
      'cached_user_data',
      JSON.stringify({
        email: user.email,
        password,
        name: user.name,
        ids: user.purchasedProductIds || [],
        completed: user.completed || [],
        isClubMember: user.isClubMember === true,
        isVip: user.isVip === true,
        hasSeenOnboarding: user.hasSeenOnboarding === true,
        lastWatched: user.lastWatched || null,
      })
    )
  }

  const clearUser = () => {
    setIsAuthenticated(false)
    setUserEmail('')
    setUserPassword('')
    setUserName('')
    setIsClubMember(false)
    setIsVip(false)
    setHasSeenOnboarding(true)
    setAccessibleTutorialIds([])
    setCompletedTutorials([])
    setLastWatchedId(null)
    localStorage.removeItem('cached_user_data')
  }

  useEffect(() => {
    // כניסת אדמין: ?admin=המפתח-הסודי
    const params = new URLSearchParams(window.location.search)
    const ak = params.get('admin')
    if (ak) {
      setAdminKey(ak)
      setView('admin')
    }

    // ליד ששמורה מקומית (כדי לא לבקש הרשמה שוב בכל כניסה)
    const cachedLead = localStorage.getItem('cached_lead')
    if (cachedLead) {
      try { setLead(JSON.parse(cachedLead)) } catch { /* התעלמות */ }
    }

    fetchCatalog()

    // כניסה ישירה לחברות — כדי שקישורים באתר הראשי/במיילים/בוואטסאפ יוכלו לעקוף
    // לגמרי את השער ואת דף ההיכרות עם המועדון. תמיכה גם ב-?login=1 וגם בנתיב
    // /login עצמו: ה-query param הוא המנגנון האמין (לא תלוי ב-rewrite של השרת —
    // ל-/ יש תמיד תשובה תקינה), הנתיב נשאר כגיבוי למקרה שה-rewrite הכללי יעבוד.
    const isLoginPath =
      window.location.pathname.replace(/\/+$/, '') === '/login' || params.get('login') === '1'

    const cached = localStorage.getItem('cached_user_data')
    if (cached) {
      try {
        const data = JSON.parse(cached)
        setUserEmail(data.email)
        setUserPassword(data.password || '')
        setUserName(data.name)
        setAccessibleTutorialIds(data.ids || [])
        setCompletedTutorials(data.completed || [])
        setIsClubMember(data.isClubMember || false)
        setIsVip(data.isVip || false)
        setHasSeenOnboarding(data.hasSeenOnboarding || false)
        setLastWatchedId(data.lastWatched || null)
        setIsAuthenticated(true)

        // רענון שקט ברקע — מושך נתונים עדכניים ומאמת שהסיסמה עדיין תקפה
        if (data.email && data.password) {
          apiLogin(data.email, data.password)
            .then(({ user }) => applyUser(user, data.password))
            .catch((e) => { if (e.status === 401) clearUser() })
        }
      } catch (e) {
        console.error('שגיאה בקריאת מטמון משתמש', e)
      }
    } else if (isLoginPath) {
      // אין חברה מזוהה במכשיר הזה — /login פותח ישר את מסך ההתחברות, בלי שער/Landing.
      // אם כן קיימת חברה מזוהה, לא דורסים את זה — Dashboard תמיד קודם ל-Login.
      setView('login')
    }
    setAuthLoading(false)
  }, [])

  const proceedToTutorial = (tutorial) => {
    setSelectedTutorial(tutorial)
    // "החלק הבא" לפי הסדרה/המדף (src/lib/series.js), לא לפי סדר השורות בגיליון
    setNextTutorial(getNextInShelf(tutorialsData, tutorial.id))
    setView('tutorial')
    window.scrollTo(0, 0)
  }

  const handleLoginSubmit = async (email, password) => {
    setAuthLoading(true)
    setLoginError('')
    try {
      const pw = password.trim()
      const { user } = await apiLogin(email, pw)
      applyUser(user, pw)

      const current = pendingTutorial
      setPendingTutorial(null)
      if (current) {
        // חברה/VIP עם גישה → צפייה מלאה; אחרת → נכנסת לעמוד ההדרכה במצב טעימה (5 דק')
        if (user.isClubMember || user.isVip || (user.purchasedProductIds || []).includes(current.id)) {
          apiLastWatched({ email: user.email, password: pw }, current.id).catch(console.error)
        }
        setTimeout(() => proceedToTutorial(current), 0)
      } else {
        setView('home')
      }
      setAuthLoading(false)
    } catch (error) {
      if (error.status === 401) {
        setLoginError('המייל או הסיסמה אינם נכונים.')
      } else {
        setLoginError('חלה שגיאה בהתחברות. ודאי שיש חיבור לאינטרנט ונסי שוב.')
      }
      setAuthLoading(false)
    }
  }

  const handleLogout = () => {
    clearUser()
    setView('home')
  }

  const handleSelectTutorial = (tutorial) => {
    if (view === 'home' || view === 'library') setReturnView(view)
    const hasAccess = hasFullAccess || accessibleTutorialIds.includes(tutorial.id)

    // חברה/VIP עם גישה → צפייה מלאה
    if (hasAccess) {
      if (userEmail) {
        apiLastWatched({ email: userEmail, password: userPassword }, tutorial.id).catch(console.error)
        setLastWatchedId(tutorial.id)
      }
      proceedToTutorial(tutorial)
      return
    }

    // אנונימית שעדיין לא נרשמה → חובת הרשמה לפני הטעימה
    if (!isAuthenticated && !lead) {
      setPendingTutorial(tutorial)
      setView('register')
      return
    }

    // רשומה (חברה בלי גישה / ליד שכבר נרשמה) → טעימה של 5 דק'
    proceedToTutorial(tutorial)
  }

  const handleRegisterLead = async ({ name, email, phone }) => {
    setLeadLoading(true)
    const newLead = { name, email, phone }
    try {
      const res = await apiRegisterLead(newLead)

      // מנויה שנרשמה בטעות כאורחת + הטלפון תואם לסיסמה → התחברות אוטומטית, ישר לאתר
      if (res && res.member) {
        applyUser(res.member, res.password || '')
        setLeadLoading(false)
        const current = pendingTutorial
        setPendingTutorial(null)
        if (current && (res.member.isClubMember || res.member.isVip || (res.member.purchasedProductIds || []).includes(current.id))) {
          apiLastWatched({ email: res.member.email, password: res.password }, current.id).catch(console.error)
        }
        if (current) proceedToTutorial(current)
        else setView('home')
        return
      }

      // המייל מוכר כמנויה אך הטלפון לא תאם → למסך התחברות עם המייל מוכן מראש
      if (res && res.knownMemberEmail) {
        setLeadLoading(false)
        setPrefillEmail(res.knownMemberEmail)
        setView('login')
        return
      }
    } catch (e) {
      // גם אם השמירה בשרת נכשלה — לא חוסמים את הצפייה
      console.error('שמירת ליד נכשלה', e)
    }

    // אורחת רגילה → מסך "ברוכה הבאה" עם הדרכה אחת בלבד, לא ישר לתוך הווידאו
    // ולא בחזרה לדף המכירה. pendingTutorial נשאר עד שתלחץ "מתחילה לצפות".
    setLead(newLead)
    localStorage.setItem('cached_lead', JSON.stringify(newLead))
    setLeadLoading(false)
    trackEvent('trial_registered', { email: newLead.email, tutorialId: pendingTutorial?.id })
    if (pendingTutorial) setView('trialWelcome')
    else setView('home')
  }

  const handleStartTrialWatch = () => {
    const current = pendingTutorial
    setPendingTutorial(null)
    if (current) proceedToTutorial(current)
  }

  // "לראות את כל הדרך" ממסך ברוכה הבאה — לפני שראתה בפועל את הטעימה.
  // לא מנקה pendingTutorial/selectedTutorial: אם תחזרי לבית, "להמשיך לצפות
  // בטעימה שלך" עדיין יעבוד; ראו fallback ל-watchedTutorialId למטה.
  const handleShowTrackMapPreview = () => {
    trackEvent('trial_map_preview_click', { email: lead?.email, tutorialId: pendingTutorial?.id })
    setView('trialTrackMap')
  }

  const handleBackToHome = () => {
    setView('home')
    setSelectedTutorial(null)
    setPendingTutorial(null)
    setPrefillEmail('')
    window.scrollTo(0, 0)
  }

  // "חזרה" אחת לכל המסכים: מדף הדרכה חוזרים לרשימה שממנה נכנסו,
  // ומנושא פתוח ב"כל ההדרכות" חוזרים לבחירת הנושאים.
  const handleBack = () => {
    if (view === 'tutorial' && returnView === 'library') {
      setView('library')
      setSelectedTutorial(null)
      window.scrollTo(0, 0)
      return
    }
    if (view === 'library' && libraryTopic && !searchQuery) {
      setLibraryTopic(null)
      window.scrollTo(0, 0)
      return
    }
    handleBackToHome()
  }

  const handleNextTutorial = () => {
    if (nextTutorial) handleSelectTutorial(nextTutorial.tutorial)
  }

  if (view === 'admin') return <AdminPage adminKey={adminKey} />

  if ((authLoading || catalogLoading) && view !== 'login' && view !== 'register') return <SkeletonGallery />

  if (view === 'register') {
    return (
      <div dir="rtl" className="min-h-screen font-sans bg-[#FFFFFF] flex flex-col">
        <LeadCaptureScreen
          onRegister={handleRegisterLead}
          onCancel={handleBackToHome}
          onLoginRequest={() => setView('login')}
          isLoading={leadLoading}
          tutorialTitle={pendingTutorial?.title}
        />
      </div>
    )
  }

  if (view === 'login') {
    return (
      <div dir="rtl" className="min-h-screen font-sans bg-[#FFFFFF] flex flex-col">
        <LoginScreen
          onLogin={handleLoginSubmit}
          onCancel={handleBackToHome}
          isLoading={authLoading}
          error={loginError}
          pendingTutorial={pendingTutorial}
          clearError={() => setLoginError('')}
          prefillEmail={prefillEmail}
          knownMember={!!prefillEmail}
        />
      </div>
    )
  }

  const showOnboarding = hasFullAccess && !hasSeenOnboarding && !authLoading
  // לא-חברה (visitor/trial) לא מקבלת גישה לספרייה/ניווט תחתון בכלל — המסלול שלה
  // הוא Gateway → Landing → Trial → Track Map → הצטרפות, בלי קיצור דרך למחסן ההדרכות.
  const showBottomNav = viewerState === 'member' || viewerState === 'vip' || viewerState === 'purchaser'
  const goLogin = () => setView('login')
  const goProfile = () => setView('profile')
  const goLibrary = () => {
    setView('library')
    setLibraryTopic(null)
    setSearchQuery('')
    window.scrollTo(0, 0)
  }
  const selectLibraryTopic = (topic) => {
    setLibraryTopic(topic)
    window.scrollTo(0, 0)
  }
  const headerProps = {
    activeView: view,
    viewerState,
    hasFullAccess,
    isAuthenticated,
    isVip,
    userName,
    onBack: handleBack,
    onLogout: handleLogout,
    onGoHome: handleBackToHome,
    onGoLogin: goLogin,
    onGoProfile: goProfile,
    onGoLibrary: goLibrary,
  }
  const bottomNavProps = {
    isAuthenticated,
    isKeyboardOpen,
    onGoHome: handleBackToHome,
    onGoLibrary: goLibrary,
    onGoProfile: goProfile,
    onGoLogin: goLogin,
  }

  if (view === 'trialWelcome' && pendingTutorial) {
    return (
      <div dir="rtl" className="min-h-screen font-sans bg-[#FFFFFF] flex flex-col">
        <TrialWelcomeScreen
          tutorial={pendingTutorial}
          tutorialsData={tutorialsData}
          onStart={handleStartTrialWatch}
          onShowTrackMap={handleShowTrackMapPreview}
          totalSteps={getTrackTutorials(tutorialsData).length}
        />
      </div>
    )
  }

  if (view === 'trialTrackMap') {
    return (
      <div dir="rtl" className="min-h-screen font-sans bg-[#FFFFFF] text-[#2B2724] flex flex-col">
        <Header showBack {...headerProps} />
        <TrialTrackMapScreen
          tutorialsData={tutorialsData}
          watchedTutorialId={selectedTutorial?.id || pendingTutorial?.id}
          onJoin={() => trackEvent('checkout_click', { email: lead?.email })}
        />
      </div>
    )
  }

  if (view === 'profile') {
    return (
      <div dir="rtl" className="min-h-screen font-sans bg-[#FFFFFF] text-[#2B2724] flex flex-col">
        {(viewerState === 'visitor' || viewerState === 'trial') && <VisitorTopBar onLogin={goLogin} />}
        <Header showBack {...headerProps} />
        <ProfilePage
          userEmail={userEmail}
          userPassword={userPassword}
          userName={userName}
          completedTutorials={completedTutorials}
          isVip={isVip}
          viewerState={viewerState}
          tutorialsData={tutorialsData}
          onSelectTutorial={proceedToTutorial}
          onLogout={handleLogout}
        />
        {showBottomNav && <BottomNav activeView="profile" {...bottomNavProps} />}
        {showOnboarding && <OnboardingOverlay onDismiss={dismissOnboarding} />}
      </div>
    )
  }

  if (view === 'library') {
    return (
      <div dir="rtl" className="min-h-screen font-sans bg-[#FFFFFF] text-[#2B2724] flex flex-col">
        {(viewerState === 'visitor' || viewerState === 'trial') && <VisitorTopBar onLogin={goLogin} />}
        <Header showBack {...headerProps} />
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 sticky top-0 md:top-20 z-40 shadow-sm">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <div className="flex items-center bg-[#FFFFFF] rounded-full px-4 py-2.5 border border-gray-200 focus-within:border-[#A0627A] focus-within:bg-white focus-within:shadow-md transition-all">
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש הדרכה לפי מילה"
                aria-label="חיפוש הדרכה"
                className="bg-transparent border-none outline-none mr-3 w-full text-[17px] text-[#2B2724] placeholder-[#6B625C]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-500 hover:text-gray-600">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
        {hasFullAccess ? (
          <ClubLibrary
            tutorialsData={tutorialsData}
            topic={libraryTopic}
            onSelectTopic={selectLibraryTopic}
            searchQuery={searchQuery}
            completedTutorials={completedTutorials}
            currentTutorialId={lastWatchedTutorial?.id}
            onSelectTutorial={handleSelectTutorial}
          />
        ) : (
        <TutorialsHub
          tutorialsData={tutorialsData}
          onSelectTutorial={handleSelectTutorial}
          accessibleTutorialIds={accessibleTutorialIds}
          isAuthenticated={isAuthenticated}
          searchQuery={searchQuery}
          completedTutorials={completedTutorials}
          lastWatchedTutorial={lastWatchedTutorial}
          isClubMember={hasFullAccess}
        />
        )}
        {showBottomNav && <BottomNav activeView="library" {...bottomNavProps} />}
      </div>
    )
  }

  return (
    <div dir="rtl" className="flex-1 font-sans bg-[#FFFFFF] text-[#2B2724] flex flex-col">
      {(viewerState === 'trial' || (viewerState === 'visitor' && hasChosenExplore)) && view !== 'tutorial' && (
        <VisitorTopBar onLogin={goLogin} />
      )}
      <Header showBack={view === 'tutorial'} {...headerProps} />

      {view === 'home' && viewerState === 'visitor' && !hasChosenExplore && (
        <ClubGateway
          onGoLogin={goLogin}
          // "אני עדיין לא חברה" → דף ההצטרפות /join (החלטה של רבקה, 23.11.2026: דף מכירה אחד למועדון).
          // src=club-app כדי לראות במדידה של /join כמה מגיעות מהשער.
          onExploreClub={() => window.location.assign('/join?src=club-app')}
        />
      )}

      {view === 'home' && (
        (viewerState === 'trial') || (viewerState === 'visitor' && hasChosenExplore)
      ) && (
        <LandingHome
          tutorialsData={tutorialsData}
          isReturningTrial={viewerState === 'trial'}
          onStartTrial={(tutorial) => handleSelectTutorial(tutorial)}
          onLogin={goLogin}
        />
      )}

      {view === 'home' && viewerState === 'inactive' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#F4E9ED]">
          <img src="/img/club/rivka.jpg" alt="רבקה הולצברג" width="880" height="1100" className="w-24 h-24 rounded-full object-cover object-[center_20%] ring-4 ring-white mb-5" />
          <h2 className="text-[28px] font-bold text-[#1F4A3A] mb-3">המנוי שלך אינו פעיל כרגע</h2>
          <p className="text-[#5E5954] text-[18px] mb-6 max-w-md">אפשר לחדש את החברות במועדון ולחזור לגישה מלאה לכל ההדרכות.</p>
          <a
            href={pricingConfig.membershipCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#7E3F55] text-white px-7 py-3 rounded-full font-bold shadow-[0_4px_0_rgba(0,0,0,0.18)]"
          >
            לחידוש החברות
          </a>
        </div>
      )}

      {view === 'home' && (viewerState === 'member' || viewerState === 'vip') && (
        <MemberDashboard
          tutorialsData={tutorialsData}
          userName={userName}
          completedTutorials={completedTutorials}
          lastWatchedTutorial={lastWatchedTutorial}
          accessibleTutorialIds={accessibleTutorialIds}
          onSelectTutorial={handleSelectTutorial}
          onGoLibrary={goLibrary}
        />
      )}

      {/* רוכשת בודדת: אינה חברת מועדון — האזור הקיים של ההדרכות שרכשה, לא Dashboard/מסלול/קהילה */}
      {view === 'home' && viewerState === 'purchaser' && (
        <TutorialsHub
          tutorialsData={tutorialsData}
          onSelectTutorial={handleSelectTutorial}
          accessibleTutorialIds={accessibleTutorialIds}
          isAuthenticated={isAuthenticated}
          searchQuery=""
          completedTutorials={completedTutorials}
          lastWatchedTutorial={lastWatchedTutorial}
          isClubMember={false}
        />
      )}

      {view === 'tutorial' && selectedTutorial && (
        <TutorialPage
          tutorial={selectedTutorial}
          tutorialsData={tutorialsData}
          onBack={handleBack}
          onNext={handleNextTutorial}
          nextInfo={nextTutorial}
          onSelectTutorial={handleSelectTutorial}
          accessibleTutorialIds={accessibleTutorialIds}
          userEmail={userEmail}
          userPassword={userPassword}
          completedTutorials={completedTutorials}
          setCompletedTutorials={setCompletedTutorials}
          isClubMember={hasFullAccess}
          leadEmail={lead?.email || ''}
          onLoginRequest={() => { setPendingTutorial(selectedTutorial); setView('login') }}
          onShowTrackMap={() => setView('trialTrackMap')}
        />
      )}

      {showBottomNav && <BottomNav activeView={view} {...bottomNavProps} />}
      {showOnboarding && view !== 'tutorial' && <OnboardingOverlay onDismiss={dismissOnboarding} />}
    </div>
  )
}
