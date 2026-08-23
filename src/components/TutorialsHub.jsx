import { useState, useMemo } from 'react'
import { Lock, PlayCircle, CheckCircle, ChevronLeft, Search, Lightbulb, Clock } from 'lucide-react'
import { themeConfig } from '../constants'
import { getTrackTutorials } from '../lib/catalogHelpers'
import StepBadge from './StepBadge'
import { pricingConfig } from '../pricing'

// "כל ההדרכות" — הארכיון המלא. לא דף הבית. המסלול המומלץ ו"המשך צפייה" חיים
// ב-MemberDashboard/LandingHome; כאן זו רשימה אחת, לבדיקה חוזרת, בלי כפילויות.
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

  const totalSteps = useMemo(() => getTrackTutorials(tutorialsData).length, [tutorialsData])

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

  return (
    <div className="flex-1">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-[100px] md:py-12">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#3E3935] mb-1.5">כל ההדרכות</h2>
          <p className="text-[#716861]">רוצה לחזור להדרכה מסוימת? כאן תמצאי את הכול במקום אחד.</p>
        </div>

        <div className="flex overflow-x-auto hide-scrollbar border-b border-gray-200 mb-10 pb-1">
          <div className="flex gap-6 min-w-max px-2">
            {['all', ...tutorialsData.map((c) => c.id)].map((tabId) => {
              const label = tabId === 'all' ? 'הכול' : tutorialsData.find((c) => c.id === tabId)?.title
              return (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`pb-3 text-sm md:text-base font-medium transition-all relative ${activeTab === tabId ? 'text-[#3E3935]' : 'text-gray-500 hover:text-[#3E3935]'}`}
                >
                  {label}
                  {activeTab === tabId && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3E3935] rounded-t-full"></span>}
                </button>
              )
            })}
          </div>
        </div>

        {visibleData.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-[#3E3935] mb-4">לא מצאנו הדרכות שמתאימות לחיפוש שלך.</p>
            <a
              href={`${pricingConfig.whatsappBaseUrl}?text=${encodeURIComponent('היי רבקה, חיפשתי הדרכה על "' + searchQuery + '" ואשמח אם תוכלי להכין כזו!')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#C88F96] font-bold bg-[#C88F96]/10 hover:bg-[#C88F96]/20 px-5 py-2.5 rounded-xl transition-colors shadow-sm"
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
                      <h3 className="text-2xl md:text-3xl font-bold text-[#3E3935] leading-tight tracking-tight">{category.title}</h3>
                      <p className="text-[#716861] text-sm md:text-base mt-1.5 max-w-lg leading-[1.8]">{category.description}</p>
                      <div className="h-1 w-16 bg-gradient-to-l from-[#C88F96] to-transparent mt-3 rounded-full"></div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {category.tutorials.map((tutorial) => {
                    const isLocked = isAuthenticated && !isClubMember && !accessibleTutorialIds.includes(tutorial.id)
                    const isCompleted = isAuthenticated && completedTutorials.includes(tutorial.id)
                    const isContinuing = isAuthenticated && !isCompleted && lastWatchedTutorial?.id === tutorial.id
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
                                <Lock size={28} className="text-[#C88F96]" />
                              </div>
                            </div>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300">
                                <PlayCircle size={32} className="text-[#3E3935]" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <StepBadge tutorial={tutorial} totalSteps={totalSteps} size="sm" className={isLocked ? 'opacity-50' : ''} />
                            {tutorial.duration && (
                              <p className="text-xs text-gray-400 font-medium mt-1.5 flex items-center gap-1">
                                <Clock size={12} /> {tutorial.duration}
                              </p>
                            )}
                          </div>
                          <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
                            <div>
                              {isCompleted && !isLocked && (
                                <div className="flex items-center gap-1 text-[#687B63] text-xs font-bold">
                                  <CheckCircle size={14} /> הושלם
                                </div>
                              )}
                              {isContinuing && (
                                <div className="flex items-center gap-1 text-[#9E626C] text-xs font-bold">
                                  <PlayCircle size={14} /> המשך צפייה
                                </div>
                              )}
                              {!isCompleted && !isContinuing && !isLocked && isAuthenticated && (
                                <div className="text-gray-400 text-xs font-medium">לא התחלת</div>
                              )}
                            </div>
                            {isLocked ? (
                              <span className="text-[#C88F96] text-sm font-bold flex items-center gap-1.5">
                                <Lock size={16} /> הדרכה נעולה
                              </span>
                            ) : (
                              <button className="text-[#716861] text-sm font-bold flex items-center gap-2 group-hover:text-[#3E3935] transition-all duration-300">
                                {cardTheme.ctaText}
                                <ChevronLeft size={16} className="transform translate-x-1 group-hover:translate-x-0 transition-transform duration-300 text-[#C88F96]" />
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
