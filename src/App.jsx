import { useState, useEffect } from 'react'
import { apiLogin, apiLastWatched } from './api'
import { useCatalog } from './useCatalog'

import SkeletonGallery from './components/SkeletonGallery'
import LoginScreen from './components/LoginScreen'
import ProfilePage from './components/ProfilePage'
import TutorialsHub from './components/TutorialsHub'
import TutorialPage from './components/TutorialPage'

import { ChevronRight, LogOut, User, Library, Search, Crown, Lightbulb } from 'lucide-react'

export default function App() {
  const [view, setView] = useState('home')
  const [selectedTutorial, setSelectedTutorial] = useState(null)
  const [selectedCategoryName, setSelectedCategoryName] = useState('')
  const [nextTutorial, setNextTutorial] = useState(null)

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [userName, setUserName] = useState('')
  const [accessibleTutorialIds, setAccessibleTutorialIds] = useState([])
  const [completedTutorials, setCompletedTutorials] = useState([])
  const [lastWatchedTutorial, setLastWatchedTutorial] = useState(null)
  const [isClubMember, setIsClubMember] = useState(false)

  const [authLoading, setAuthLoading] = useState(true)
  const [loginError, setLoginError] = useState('')
  const [pendingTutorial, setPendingTutorial] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

  const { tutorialsData, catalogLoading, fetchCatalog } = useCatalog()

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
    if (user.lastWatched) setLastWatchedTutorial(user.lastWatched)
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
    setAccessibleTutorialIds([])
    setCompletedTutorials([])
    setLastWatchedTutorial(null)
    localStorage.removeItem('cached_user_data')
  }

  useEffect(() => {
    fetchCatalog()

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
        if (data.lastWatched) setLastWatchedTutorial(data.lastWatched)
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
    }
    setAuthLoading(false)
  }, [])

  useEffect(() => {
    if (
      isAuthenticated &&
      tutorialsData.length > 0 &&
      lastWatchedTutorial &&
      typeof lastWatchedTutorial === 'number'
    ) {
      let found = null
      tutorialsData.forEach((cat) => {
        const t = cat.tutorials.find((tut) => tut.id === lastWatchedTutorial)
        if (t) found = t
      })
      if (found) setLastWatchedTutorial(found)
    }
  }, [tutorialsData, isAuthenticated])

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
        // חברה עם גישה → צפייה מלאה; אחרת → נכנסת לעמוד ההדרכה במצב טעימה (5 דק')
        if (user.isClubMember || (user.purchasedProductIds || []).includes(current.id)) {
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
    // כולן נכנסות לעמוד ההדרכה. מי שיש לה גישה רואה הכל;
    // מי שלא — רואה 5 דק' טעימה ואז שער הצטרפות (הלוגיקה ב-TutorialPage).
    const hasAccess = isClubMember || accessibleTutorialIds.includes(tutorial.id)
    if (hasAccess && userEmail) {
      apiLastWatched({ email: userEmail, password: userPassword }, tutorial.id).catch(console.error)
      setLastWatchedTutorial(tutorial)
    }
    proceedToTutorial(tutorial)
  }

  const handleBackToHome = () => {
    setView('home')
    setSelectedTutorial(null)
    setPendingTutorial(null)
    window.scrollTo(0, 0)
  }

  const handleNextTutorial = () => {
    if (nextTutorial) handleSelectTutorial(nextTutorial)
  }

  if ((authLoading || catalogLoading) && view !== 'login') return <SkeletonGallery />

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
        />
      </div>
    )
  }

  const Header = ({ showBack = false }) => (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative">
        <div className="w-1/3 flex items-center gap-3">
          {showBack ? (
            <button
              onClick={handleBackToHome}
              className="hidden lg:flex items-center gap-1.5 md:gap-2 text-[#3E3935] font-bold bg-[#E8EEE5] hover:bg-[#3E3935] hover:text-[#C88F96] px-3 md:px-5 py-2 rounded-full transition-all duration-300 shadow-sm border border-[#3E3935]/10"
            >
              <ChevronRight size={24} />
              <span className="hidden md:inline text-base">חזרה לכל ההדרכות</span>
            </button>
          ) : isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium"
              title="התנתקות"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">יציאה</span>
            </button>
          ) : null}
        </div>

        <div className="w-1/3 flex justify-center">
          <div className="cursor-pointer flex flex-col items-center" onClick={handleBackToHome}>
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
                  {isClubMember && (
                    <span className="bg-gradient-to-r from-[#C88F96] to-[#9E626C] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                      <Crown size={12} /> VIP
                    </span>
                  )}
                </div>
                <a
                  href="https://wa.me/504207702?text=היי רבקה, יש לי רעיון להדרכה חדשה:"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#C88F96] font-bold hover:underline flex items-center gap-1 mt-0.5"
                >
                  <Lightbulb size={10} /> יש לי רעיון להדרכה
                </a>
              </div>
            ) : (
              <button
                onClick={() => setView('login')}
                className="text-sm font-bold text-[#C88F96] hover:underline mt-2"
              >
                התחברי למרחב
              </button>
            )}
          </div>
          <div
            className="relative h-10 w-10 rounded-full bg-[#E8EEE5] flex items-center justify-center text-[#3E3935] cursor-pointer hover:bg-[#3E3935] hover:text-[#C88F96] transition-colors"
            onClick={() => (!isAuthenticated ? setView('login') : setView('profile'))}
          >
            <User size={18} />
            {isAuthenticated && isClubMember && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-[#C88F96] to-[#9E626C] w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-white md:hidden">
                <Crown size={10} className="text-white" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )

  const BottomNav = ({ activeView }) => (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 justify-around items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex ${isKeyboardOpen ? 'hidden' : ''}`}
      style={{ minHeight: '72px', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <button
        onClick={handleBackToHome}
        className={`flex flex-col items-center justify-center w-full h-full pt-2 pb-1 ${activeView === 'home' ? 'text-[#3E3935]' : 'text-gray-400 hover:text-[#3E3935]'}`}
      >
        <Library size={22} />
        <span className="text-[11px] mt-1 font-medium">ספרייה</span>
      </button>
      <button
        onClick={() => {
          window.scrollTo(0, 0)
          handleBackToHome()
          setTimeout(() => document.querySelector('input[type="text"]')?.focus(), 100)
        }}
        className="flex flex-col items-center justify-center w-full h-full pt-2 pb-1 text-gray-400 hover:text-[#3E3935]"
      >
        <Search size={22} />
        <span className="text-[11px] mt-1 font-medium">חיפוש</span>
      </button>
      <button
        onClick={() => (!isAuthenticated ? setView('login') : setView('profile'))}
        className={`flex flex-col items-center justify-center w-full h-full pt-2 pb-1 ${activeView === 'profile' ? 'text-[#3E3935]' : 'text-gray-400 hover:text-[#3E3935]'}`}
      >
        <User size={22} />
        <span className="text-[11px] mt-1 font-medium">האזור שלי</span>
      </button>
    </nav>
  )

  if (view === 'profile') {
    return (
      <div dir="rtl" className="min-h-screen font-sans bg-[#FAF7F2] text-[#3E3935] flex flex-col">
        <Header showBack />
        <ProfilePage
          userEmail={userEmail}
          userPassword={userPassword}
          userName={userName}
          completedTutorials={completedTutorials}
          isClubMember={isClubMember}
          tutorialsData={tutorialsData}
          onSelectTutorial={proceedToTutorial}
        />
        <BottomNav activeView="profile" />
      </div>
    )
  }

  return (
    <div dir="rtl" className="flex-1 font-sans bg-[#FAF7F2] text-[#3E3935] flex flex-col">
      <Header showBack={view === 'tutorial'} />

      {view === 'home' && (
        <>
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
            isClubMember={isClubMember}
          />
        </>
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
          isClubMember={isClubMember}
          onLoginRequest={() => { setPendingTutorial(selectedTutorial); setView('login') }}
        />
      )}

      <BottomNav activeView={view} />
    </div>
  )
}
