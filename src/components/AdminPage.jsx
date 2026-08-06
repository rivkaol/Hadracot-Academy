import { useState, useEffect, useMemo, Fragment } from 'react'
import { apiAdminLeads } from '../api'
import { Loader, Flame, PlayCircle, Clock, MessageCircle, Users } from 'lucide-react'

const waLink = (phone) => {
  let d = String(phone || '').replace(/\D/g, '')
  if (!d) return null
  if (d.startsWith('0')) d = '972' + d.slice(1)
  return `https://wa.me/${d}`
}

const fmtMin = (secs) => {
  const m = Math.floor((secs || 0) / 60)
  const s = Math.round((secs || 0) % 60)
  return m > 0 ? `${m} דק׳ ${s}ש׳` : `${s} שניות`
}

const fmtDate = (iso) => {
  if (!iso) return '—'
  try { return new Date(iso).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' }) } catch { return '—' }
}

export default function AdminPage({ adminKey }) {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    apiAdminLeads(adminKey)
      .then(({ leads }) => setLeads(leads || []))
      .catch((e) => setError(e.status === 401 ? 'מפתח כניסה שגוי.' : 'שגיאה בטעינת הנתונים.'))
      .finally(() => setLoading(false))
  }, [adminKey])

  const sorted = useMemo(
    () => [...leads].sort((a, b) => (b.totalSeconds || 0) - (a.totalSeconds || 0) || (b.tutorials || 0) - (a.tutorials || 0)),
    [leads]
  )

  const stats = useMemo(() => ({
    total: leads.length,
    engaged: leads.filter((l) => (l.tutorials || 0) > 0).length,
    hot: leads.filter((l) => (l.reached || 0) > 0).length,
  }), [leads])

  if (loading) return <Center><Loader size={36} className="animate-spin text-[#9E626C]" /></Center>
  if (error) return <Center><p className="text-lg font-bold text-[#3E3935]">{error}</p></Center>

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAF7F2] text-[#3E3935] font-sans">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">לידים ומעקב מעורבות</h1>
        <p className="text-[#716861] mb-6">מדורג לפי כמה כל אחת באמת צפתה. הכי מעורבות למעלה.</p>

        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          <StatCard icon={Users} label="סה״כ נרשמות" value={stats.total} />
          <StatCard icon={PlayCircle} label="צפו בפועל" value={stats.engaged} />
          <StatCard icon={Flame} label="סיימו טעימה מלאה" value={stats.hot} accent />
        </div>

        {sorted.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm text-[#716861]">
            עדיין אין לידים. ברגע שמישהי תירשם לצפייה — היא תופיע כאן.
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_16px_48px_rgba(62,57,53,0.08)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FAF7F2] text-[#716861] text-right">
                    <th className="p-4 font-bold">שם</th>
                    <th className="p-4 font-bold">מעורבות</th>
                    <th className="p-4 font-bold whitespace-nowrap"><Clock size={14} className="inline ml-1" />זמן צפייה</th>
                    <th className="p-4 font-bold whitespace-nowrap">הדרכות</th>
                    <th className="p-4 font-bold whitespace-nowrap">נרשמה</th>
                    <th className="p-4 font-bold">קשר</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((l) => {
                    const wa = waLink(l.phone)
                    const isHot = (l.reached || 0) > 0
                    const isOpen = expanded === l.email
                    return (
                      <Fragment key={l.email}>
                        <tr className="border-t border-gray-100 hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="p-4">
                            <div className="font-bold flex items-center gap-1.5">
                              {isHot && <Flame size={15} className="text-[#9E626C] fill-[#C88F96]" />}
                              {l.name || '—'}
                            </div>
                            <div className="text-xs text-[#716861]" dir="ltr">{l.email}</div>
                          </td>
                          <td className="p-4">
                            {(l.tutorials || 0) === 0 ? (
                              <span className="text-gray-400">נרשמה, לא צפתה</span>
                            ) : (
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${isHot ? 'bg-[#F2DFE1] text-[#9E626C]' : 'bg-[#E8EEE5] text-[#687B63]'}`}>
                                {isHot ? `סיימה ${l.reached} טעימות` : 'התחילה לצפות'}
                              </span>
                            )}
                          </td>
                          <td className="p-4 font-bold whitespace-nowrap">{fmtMin(l.totalSeconds)}</td>
                          <td className="p-4">
                            {(l.items || []).length > 0 ? (
                              <button onClick={() => setExpanded(isOpen ? null : l.email)} className="text-[#9E626C] font-bold underline underline-offset-2">
                                {l.tutorials} {isOpen ? '▲' : '▾'}
                              </button>
                            ) : <span className="text-gray-400">0</span>}
                          </td>
                          <td className="p-4 whitespace-nowrap text-[#716861]">{fmtDate(l.createdAt)}</td>
                          <td className="p-4">
                            {wa ? (
                              <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 bg-[#687B63] hover:bg-[#586b53] text-white px-3 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-colors">
                                <MessageCircle size={14} /> וואטסאפ
                              </a>
                            ) : <span className="text-gray-400 text-xs" dir="ltr">{l.phone || '—'}</span>}
                          </td>
                        </tr>
                        {isOpen && (
                          <tr className="bg-[#FAF7F2]/60">
                            <td colSpan={6} className="px-4 pb-4">
                              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                                {l.items.map((it) => (
                                  <div key={it.tutorialId} className="bg-white rounded-xl border border-gray-100 p-3">
                                    <div className="font-bold text-[13px] mb-1 truncate">{it.title || `הדרכה ${it.tutorialId}`}</div>
                                    <div className="text-xs text-[#716861] flex items-center gap-2">
                                      <span>{fmtMin(it.maxSeconds)}</span>
                                      {it.reachedLimit && <span className="text-[#9E626C] font-bold">· סיימה טעימה</span>}
                                      {it.attempts > 1 && <span>· {it.attempts} כניסות</span>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className={`rounded-2xl p-4 md:p-5 border shadow-sm ${accent ? 'bg-gradient-to-br from-[#C88F96] to-[#9E626C] text-white border-transparent' : 'bg-white border-gray-100 text-[#3E3935]'}`}>
      <Icon size={20} className={accent ? 'text-white/90' : 'text-[#9E626C]'} />
      <div className="text-2xl md:text-3xl font-bold mt-2">{value}</div>
      <div className={`text-xs md:text-sm ${accent ? 'text-white/90' : 'text-[#716861]'}`}>{label}</div>
    </div>
  )
}

function Center({ children }) {
  return <div dir="rtl" className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 text-center">{children}</div>
}
