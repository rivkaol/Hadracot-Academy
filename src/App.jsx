import { useState, useEffect, useMemo } from 'react'
import { apiLogin, apiLastWatched, apiRegisterLead, apiMarkOnboardingSeen } from './api'
import { useCatalog } from './useCatalog'
import { useViewerState } from './hooks/useViewerState'
import { trackEvent } from './lib/trackEvent'
import { findTutorialById, getTrackTutorials } from './lib/catalogHelpers'

import SkeletonGallery from './components/SkeletonGallery'
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

import { ChevronRight, LogOut, User, Library, Search, Crown, Lightbulb } from 'lucide-react'

// "חדש במועדון" הוסר מהניווט העליון — אין עדיין destination אמיתי (לא היעד
// לחיצה, לא מפגש קיים). האזור בתוך ה-Dashboard נשאר conditional על nextLiveSession.
const MEMBER_NAV_ITEMS = [
  { label: 'המסלול שלי', key: 'home' },
  { label: 'כל ההדרכות', key: 'library' },
  { label: 'החשבון שלי', key: 'profile' },
]

// פס עליון סטיקי מעל הכול, למי שעדיין לא חברה — לעולם לא חבוי בתפריט.
function VisitorTopBar({ onLogin }) {
  return (
    <div className="bg-[#3E3935] text-white text-center py-2.5 px-4 text-sm font-medium sticky top-0 z-[60]">
      כבר חברת מועדון?{' '}
      <button onClick={onLogin} className="underline font-bold hover:text-[#C88F96] transition-colors">
        התחברי כאן
      </button>
    </div>
  )
}

function Header({
  showBack = false,
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
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        <div className="w-1/3 flex items-center gap-3">
          {showBack ? (
            <button
              onClick={onBack}
              className="hidden lg:flex items-center gap-1.5 md:gap-2 text-[#3E3935] font-bold bg-[#E8EEE5] hover:bg-[#3E3935] hover:text-[#C88F96] px-3 md:px-5 py-2 rounded-full transition-all duration-300 shadow-sm border border-[#3E3935]/10"
            >
              <ChevronRight size={24} />
              <span className="hidden md:inline text-base">חזרה</span>
            </button>
          ) : isMember ? (
            <nav className="hidden lg:flex items-center gap-5">
              {MEMBER_NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={item.key === 'library' ? onGoLibrary : item.key === 'profile' ? onGoProfile : onGoHome}
                  className="text-sm font-bold text-[#716861] hover:text-[#3E3935] transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <a
                href={`${pricingConfig.whatsappBaseUrl}?text=${encodeURIComponent('היי רבקה, אשמח להצטרף לקבוצת המועדון')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-[#716861] hover:text-[#3E3935] transition-colors"
              >
                הקהילה
              </a>
            </nav>
          ) : isPurchaser ? (
            <nav className="hidden lg:flex items-center gap-5">
              <button
                onClick={onGoLibrary}
                className="text-sm font-bold text-[#716861] hover:text-[#3E3935] transition-colors"
              >
                ההדרכות שלי
              </button>
              <button
                onClick={onGoProfile}
                className="text-sm font-bold text-[#716861] hover:text-[#3E3935] transition-colors"
              >
                החשבון שלי
              </button>
            </nav>
          ) : isAuthenticated ? (
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
              title="התנתקות"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">יציאה</span>
            </button>
          ) : null}
        </div>

        <div className="w-1/3 flex justify-center">
          <div className="cursor-pointer flex flex-col items-center" onClick={onGoHome}>
            <img
              src="/logo.jpg.png"
              alt="לוגו המרחב של רבקה"
              className="h-8 md:h-10 w-auto mb-1 object-contain"
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <p className="text-xs text-[#C88F96] font-medium hidden md:block mt-0.5">
              המרחב שלך לצמיחה, רוגע ובריאות אמיתית
            </p>
          </div>
        </div>

        <div className="w-1/3 flex justify-end items-center gap-3">
          <div className="text-left mr-3 hidden md:block">
            {isAuthenticated ? (
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-[#3E3935] truncate max-w-[120px]" title={userName}>
                    שלום {userName}
                  </p>
                  {isVip && (
                    <span className="bg-gradient-to-r from-[#C88F96] to-[#9E626C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Crown size={12} /> VIP
                    </span>
                  )}
                </div>
                <a
                  href={`${pricingConfig.whatsappBaseUrl}?text=${encodeURIComponent('היי רבקה, יש לי רעיון להדרכה חדשה:')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#C88F96] font-bold hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Lightbulb size={10} /> יש לי רעיון להדרכה
                </a>
              </div>
            ) : (
              <button
                onClick={onGoLogin}
                className="text-sm font-bold text-[#C88F96] hover:underline mt-2"
              >
                התחברי למרחב
              </button>
            )}
          </div>
          <div
            className="relative h-10 w-10 rounded-full bg-[#E8EEE5] flex items-center justify-center text-[#3E3935] cursor-pointer hover:bg-[#3E3935] hover:text-[#C88F96] transition-colors"
            onClick={() => (!isAuthenticated ? onGoLogin() : onGoProfile())}
          >
            <User size={18} />
            {isAuthenticated && isVip && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-[#C88F96] to-[#9E626C] w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-white md:hidden">
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
        className={`flex flex-col items-center justify-center w-full h-full pt-2 pb-1 ${activeView === 'home' ? 'text-[#3E3935]' : 'text-gray-400 hover:text-[#3E3935]'}`}
      >
        <Library size={22} />
        <span className="text-[11px] mt-1 font-medium">בית</span>
      </button>
      <button
        onClick={onGoLibrary}
        className={`flex flex-col items-center justify-center w-full h-full pt-2 pb-1 ${activeView === 'library' ? 'text-[#3E3935]' : 'text-gray-400 hover:text-[#3E3935]'}`}
      >
        <Search size={22} />
        <span className="text-[11px] mt-1 font-medium">כל ההדרכות</span>
      </button>
      <button
        onClick={() => (!isAuthenticated ? onGoLogin() : onGoProfile())}
        className={`flex flex-col items-center justify-center w-full h-full pt-2 pb-1 ${activeView === 'profile' ? 'text-[#3E3935]' : 'text-gray-400 hover:text-[#3E3935]'}`}
      >
        <User size={22} />
        <span className="text-[11px] mt-1 font-medium">האזור שלי</span>
      </button>
    </nav>
  )
}

export default function App() {
  const [view, setView] = useState('home')
  const [selectedTutorial, setSelectedTutorial] = useState(null)
  const [selectedCategoryName, setSelectedCategoryName] = useState('')
  const [nextTutorial, setNextTutorial] = useState(null)
  // האם מבקרת לא-מזוהה כבר בחרה "אני עדיין לא חברה" בשער הכניסה — אם לא,
  // מוצג ClubGateway ולא ה-Landing השיווקי. נשאר true לאורך הביקור, לא נשאל שוב בכל ניווט.
  const [hasChosenExplore, setHasChosenExplore] = useState(false)

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
    const category = tutorialsData.find((cat) => cat.tutorials.some((t) => t.id === tutorial.id))
    setSelectedTutorial(tutorial)
    setSelectedCategoryName(category ? category.title : '')
    if (category) {
      const idx = category.tutorials.findIndex((t) => t.id === tutorial.id)
      setNextTutorial(
        idx !== -1 && idx < category.tutorials.length - 1 ? category.tutorials[idx + 1] : null
      )
    }
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

  const handleNextTutorial = () => {
    if (nextTutorial) handleSelectTutorial(nextTutorial)
  }

  if (view === 'admin') return <AdminPage adminKey={adminKey} />

  if ((authLoading || catalogLoading) && view !== 'login' && view !== 'register') return <SkeletonGallery />

  if (view === 'register') {
    return (
      <div dir="rtl" className="min-h-screen font-sans bg-[#FAF7F2] flex flex-col">
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
      <div dir="rtl" className="min-h-screen font-sans bg-[#FAF7F2] flex flex-col">
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
  const goLibrary = () => setView('library')
  const headerProps = {
    viewerState,
    hasFullAccess,
    isAuthenticated,
    isVip,
    userName,
    onBack: handleBackToHome,
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
      <div dir="rtl" className="min-h-screen font-sans bg-[#FAF7F2] flex flex-col">
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
      <div dir="rtl" className="min-h-screen font-sans bg-[#FAF7F2] text-[#3E3935] flex flex-col">
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
      <div dir="rtl" className="min-h-screen font-sans bg-[#FAF7F2] text-[#3E3935] flex flex-col">
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
      <div dir="rtl" className="min-h-screen font-sans bg-[#FAF7F2] text-[#3E3935] flex flex-col">
        {(viewerState === 'visitor' || viewerState === 'trial') && <VisitorTopBar onLogin={goLogin} />}
        <Header showBack {...headerProps} />
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-3 sticky top-20 z-40 shadow-sm">
          <div className="max-w-xl mx-auto px-4 sm:px-6">
            <div className="flex items-center bg-[#FAF7F2] rounded-full px-4 py-2.5 border border-gray-200 focus-within:border-[#C88F96] focus-within:bg-white focus-within:shadow-md transition-all">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חפשי הדרכה או נושא שמעניין אותך..."
                className="bg-transparent border-none outline-none mr-3 w-full text-sm text-[#3E3935] placeholder-gray-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
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
        {showBottomNav && <BottomNav activeView="library" {...bottomNavProps} />}
      </div>
    )
  }

  return (
    <div dir="rtl" className="flex-1 font-sans bg-[#FAF7F2] text-[#3E3935] flex flex-col">
      {(viewerState === 'trial' || (viewerState === 'visitor' && hasChosenExplore)) && view !== 'tutorial' && (
        <VisitorTopBar onLogin={goLogin} />
      )}
      <Header showBack={view === 'tutorial'} {...headerProps} />

      {view === 'home' && viewerState === 'visitor' && !hasChosenExplore && (
        <ClubGateway onGoLogin={goLogin} onExploreClub={() => setHasChosenExplore(true)} />
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
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-[#3E3935] mb-3">המנוי שלך אינו פעיל כרגע</h2>
          <p className="text-[#716861] mb-6 max-w-md">אפשר לחדש את החברות במועדון ולחזור לגישה מלאה לכל ההדרכות.</p>
          <a
            href={pricingConfig.membershipCheckoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white px-7 py-3 rounded-full font-bold shadow-[0_12px_28px_rgba(158,98,108,0.25)]"
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
          categoryName={selectedCategoryName}
          onBack={handleBackToHome}
          onNext={handleNextTutorial}
          hasNext={!!nextTutorial}
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
