import { useState, useMemo } from 'react'
import { Clock, Sparkles, Star, Lock, PlayCircle, CheckCircle, ChevronLeft, Search, Lightbulb, MoreHorizontal } from 'lucide-react'
import { themeConfig } from '../constants'

export default function TutorialsHub({
  tutorialsData,
  onSelectTutorial,
  accessibleTutorialIds,
  isAuthenticated,
  searchQuery,
  completedTutorials,
  lastWatchedTutorial,
  isClubMember,
}) {
  const [activeTab, setActiveTab] = useState('all')

  const visibleData = useMemo(() => {
    return tutorialsData
      .map((category) => {
        if (activeTab !== 'all' && activeTab !== category.id) return null
        const query = (searchQuery || '').toLowerCase()
        const filtered = category.tutorials.filter((t) => {
          const title = (t?.title || '').toLowerCase()
          const desc = (t?.description || '').toLowerCase()
          return title.includes(query) || desc.includes(query)
        })
        return filtered.length === 0 ? null : { ...category, tutorials: filtered }
      })
      .filter(Boolean)
  }, [tutorialsData, activeTab, searchQuery])

  const recommendedTutorials = useMemo(() => {
    const found = []
    tutorialsData.forEach((cat) => {
      cat.tutorials.forEach((tut) => {
        if (tut.recommendedOrder) found.push(tut)
      })
    })
    return found.sort((a, b) => a.recommendedOrder - b.recommendedOrder)
  }, [tutorialsData])

  let heroTutorial = null
  let isHeroContinue = false
  if (lastWatchedTutorial && (isClubMember || accessibleTutorialIds.includes(lastWatchedTutorial.id))) {
    heroTutorial = lastWatchedTutorial
    isHeroContinue = true
  } else {
    heroTutorial = tutorialsData[0]?.tutorials[0]
  }

  return (
    <div className="flex-1">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-[100px] md:py-12">

        {heroTutorial && !searchQuery && (
          <section className="mb-10">
            <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-100 shadow-[0_20px_50px_rgba(148,163,136,0.1)] flex flex-col md:flex-row items-center gap-8 relative overflow-hidden transition-all hover:shadow-[0_20px_50px_rgba(148,163,136,0.15)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37] opacity-5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>

              <div
                onClick={() => onSelectTutorial(heroTutorial)}
                className="w-full md:w-1/3 aspect-video bg-[#1B4D3E]/5 rounded-2xl relative overflow-hidden flex items-center justify-center shrink-0 group cursor-pointer"
              >
                {heroTutorial.imageUrl ? (
                  <img src={heroTutorial.imageUrl} alt={heroTutorial.title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#1B4D3E]/10 to-transparent"></div>
                )}
                <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center text-[#1B4D3E] shadow-lg group-hover:scale-105 transition-transform duration-300 z-10">
                  <PlayCircle size={32} className="text-[#1B4D3E]" />
                </div>
              </div>

              <div className="flex-1 z-10">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#D4AF37]/10 text-[#B8962D] px-3 py-1 rounded-full mb-3">
                  {isHeroContinue ? <Clock size={14} /> : <Sparkles size={14} />}
                  {isHeroContinue ? 'המשך מאיפה שעצרת' : 'אם את חדשה – התחילי כאן'}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1B4D3E] mb-3">{heroTutorial.title}</h2>
                <p className="text-[#2F4858] mb-6 max-w-xl leading-relaxed">
                  {heroTutorial.description || (isHeroContinue ? 'המשיכי את הלמידה מהנקודה האחרונה.' : 'הדרכה מרתקת שתעשה לך סדר ותיתן לך כלים לשינוי.')}
                </p>
                <button
                  onClick={() => onSelectTutorial(heroTutorial)}
                  className="bg-[#1B4D3E] hover:bg-[#153D31] text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                >
                  {isHeroContinue ? 'המשך צפייה' : 'אני רוצה להתחיל'}
                  <ChevronLeft size={18} />
                </button>
              </div>
            </div>
          </section>
        )}

        {!searchQuery && activeTab === 'all' && recommendedTutorials.length > 0 && (
          <section className="mb-12 bg-white p-6 md:p-10 rounded-[2.5rem] border border-gray-100 relative overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.03)]">
            <div className="absolute top-0 right-0 w-1.5 bg-gradient-to-b from-[#D4AF37] to-[#B8962D] h-full"></div>

            <div className="mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1.5 rounded-full mb-4">
                <Star size={14} className="fill-[#D4AF37]" /> התחילי מכאן
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#1B4D3E] mb-3">התשתית לשינוי אמיתי</h3>
              <p className="text-gray-600 max-w-3xl leading-[1.8] text-[15px] md:text-base">
                כדי שתוכלי להתקדם בקצב שלנו ולקבל את הרקע הנדרש להדרכות הבאות,
                <strong className="text-[#1B4D3E] font-medium block mt-1">אני ממליצה לך בחום להתחיל מההדרכות האלו לפי הסדר.</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {recommendedTutorials.map((tutorial, index) => {
                const isLocked = isAuthenticated && !isClubMember && !accessibleTutorialIds.includes(tutorial.id)
                const isCompleted = isAuthenticated && completedTutorials.includes(tutorial.id)
                return (
                  <div
                    key={`rec-${tutorial.id}`}
                    onClick={() => onSelectTutorial(tutorial)}
                    className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer overflow-hidden border border-gray-100 hover:border-[#D4AF37]/40 relative hover:-translate-y-1"
                  >
                    <div className="absolute top-3 right-3 z-30 w-8 h-8 bg-white/95 backdrop-blur-sm text-[#B8962D] rounded-full flex items-center justify-center font-bold text-sm shadow-sm border border-[#D4AF37]/30">
                      {index + 1}
                    </div>
                    <div className="aspect-[4/3] relative flex items-center justify-center overflow-hidden bg-gray-50">
                      {tutorial.imageUrl ? (
                        <img src={tutorial.imageUrl} alt={tutorial.title} className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${isLocked ? 'grayscale blur-[2px] opacity-70' : 'opacity-95 group-hover:opacity-100 group-hover:scale-105'}`} />
                      ) : (
                        <div className={`absolute inset-0 bg-gradient-to-tr from-gray-100 to-gray-50 transition-all duration-500 ${isLocked ? 'grayscale opacity-70' : ''}`}></div>
                      )}
                      {isLocked ? (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center shadow-md">
                            <Lock size={20} className="text-[#D4AF37]" />
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5">
                          <div className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                            <PlayCircle size={28} className="text-[#D4AF37]" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                      <h4 className={`text-[14px] font-bold leading-snug transition-colors duration-300 ${isLocked ? 'text-gray-400' : 'text-[#1B4D3E] group-hover:text-[#D4AF37]'}`}>
                        {tutorial.title}
                      </h4>
                      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between h-6">
                        {isCompleted && !isLocked ? (
                          <span className="flex items-center gap-1 text-[#94A388] text-[11px] font-bold"><CheckCircle size={14} /> הושלם</span>
                        ) : isLocked ? (
                          <span className="text-[#D4AF37] text-[11px] font-bold flex items-center gap-1"><Lock size={12} /> הדרכה נעולה</span>
                        ) : (
                          <span className="text-gray-500 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 group-hover:text-[#D4AF37]">
                            צפי עכשיו <ChevronLeft size={12} />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              <div className="group bg-[#F7F9FA] rounded-2xl shadow-sm flex flex-col cursor-default overflow-hidden border border-dashed border-gray-200 relative">
                <div className="absolute top-3 right-3 z-30 w-8 h-8 bg-white text-gray-400 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border border-gray-100">
                  <MoreHorizontal size={16} />
                </div>
                <div className="aspect-[4/3] relative flex items-center justify-center overflow-hidden bg-gray-50/50">
                  <div className="w-14 h-14 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                    <Lock size={24} className="text-[#D4AF37]/50" />
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-center items-center text-center bg-transparent">
                  <h4 className="text-[14px] font-bold text-[#1B4D3E]/70 mb-1.5">ההדרכה הבאה...</h4>
                  <p className="text-gray-500 text-[11px] font-medium leading-snug">יש למה לחכות! הדרכה חדשה תעלה ממש בקרוב.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 mb-10 pb-1">
          <div className="flex gap-6 min-w-max px-2">
            {['all', ...tutorialsData.map((c) => c.id)].map((tabId) => {
              const label = tabId === 'all' ? 'כל ההדרכות' : tutorialsData.find((c) => c.id === tabId)?.title
              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`pb-3 text-sm md:text-base font-medium transition-all relative ${activeTab === tabId ? 'text-[#1B4D3E]' : 'text-gray-500 hover:text-[#1B4D3E]'}`}
                >
                  {label}
                  {activeTab === tabId && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B4D3E] rounded-t-full"></span>}
                </button>
              )
            })}
          </div>
        </div>

        {visibleData.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-[#1B4D3E] mb-4">לא מצאנו הדרכות שמתאימות לחיפוש שלך.</p>
            <a
              href={`https://wa.me/504207702?text=${encodeURIComponent('היי רבקה, חיפשתי הדרכה על "' + searchQuery + '" ואשמח אם תוכלי להכין כזו!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#D4AF37] font-bold bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 px-5 py-2.5 rounded-xl transition-colors shadow-sm"
            >
              <Lightbulb size={18} />
              לא מצאת? כתבי לי כאן
            </a>
          </div>
        )}

        <div className="space-y-16">
          {visibleData.map((category) => {
            const theme = themeConfig[category.id] || themeConfig['personal-growth']
            return (
              <section key={category.id}>
                {activeTab === 'all' && !searchQuery && (
                  <div className="flex items-start gap-4 mb-8 relative">
                    <div className="flex flex-col">
                      <h3 className="text-2xl md:text-3xl font-bold text-[#1B4D3E] leading-tight tracking-tight">{category.title}</h3>
                      <p className="text-[#2F4858] text-sm md:text-base mt-1.5 max-w-lg leading-[1.8]">{category.description}</p>
                      <div className="h-1 w-16 bg-gradient-to-l from-[#D4AF37] to-transparent mt-3 rounded-full"></div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {category.tutorials.map((tutorial) => {
                    const isLocked = isAuthenticated && !isClubMember && !accessibleTutorialIds.includes(tutorial.id)
                    const isCompleted = isAuthenticated && completedTutorials.includes(tutorial.id)
                    const cardTheme = themeConfig[tutorial.categoryId] || theme

                    return (
                      <div
                        key={tutorial.id}
                        onClick={() => onSelectTutorial(tutorial)}
                        className={`group bg-white rounded-2xl shadow-[0_20px_50px_rgba(148,163,136,0.1)] transition-all duration-500 flex flex-col cursor-pointer overflow-hidden ${cardTheme.borderClass} hover:shadow-[0_20px_50px_rgba(148,163,136,0.2)] hover:-translate-y-1 relative`}
                      >
                        <div className="aspect-[16/9] relative flex items-center justify-center overflow-hidden bg-gray-50">
                          {tutorial.imageUrl ? (
                            <img
                              src={tutorial.imageUrl}
                              alt={tutorial.title}
                              className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${isLocked ? 'grayscale blur-[3px] opacity-60' : 'opacity-90 group-hover:opacity-100 group-hover:scale-105'}`}
                            />
                          ) : (
                            <div className={`absolute inset-0 bg-gradient-to-tr ${cardTheme.gradient} transition-all duration-500 ${isLocked ? 'grayscale opacity-40' : 'opacity-80 group-hover:opacity-100'}`}></div>
                          )}
                          {isLocked && tutorial.imageUrl && <div className="absolute inset-0 bg-black/10"></div>}
                          {isLocked ? (
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(212,175,55,0.3)]">
                                <Lock size={28} className="text-[#D4AF37]" />
                              </div>
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                                <PlayCircle size={32} className="text-[#1B4D3E]" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            {tutorial.badge && (
                              <span className={`inline-block text-[11px] font-bold px-3 py-1 rounded-md mb-4 ${cardTheme.bgClass}`} style={{ color: cardTheme.darkText }}>
                                {tutorial.badge}
                              </span>
                            )}
                            <h4 className={`text-xl font-bold leading-[1.4] transition-colors duration-300 ${isLocked ? 'text-[#2F4858]/60' : 'text-[#1B4D3E] group-hover:text-[#D4AF37]'}`}>
                              {tutorial.title}
                            </h4>
                          </div>
                          <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
                            <div>
                              {isCompleted && !isLocked && (
                                <div className="flex items-center gap-1 text-[#94A388] text-xs font-bold">
                                  <CheckCircle size={14} /> הושלם
                                </div>
                              )}
                            </div>
                            {isLocked ? (
                              <span className="text-[#D4AF37] text-sm font-bold flex items-center gap-1.5">
                                <Lock size={16} /> הדרכה נעולה
                              </span>
                            ) : (
                              <button className="text-[#2F4858] text-sm font-bold flex items-center gap-2 group-hover:text-[#1B4D3E] transition-all duration-300">
                                {cardTheme.ctaText}
                                <ChevronLeft size={16} className="transform translate-x-1 group-hover:translate-x-0 transition-transform duration-300 text-[#D4AF37]" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      </main>
    </div>
  )
}
