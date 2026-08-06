// חיבור האתר ל"שומר" בצד השרת (api/hub.js). האתר אף פעם לא נוגע ב-Supabase ישירות.
async function call(action, payload) {
  const res = await fetch('/api/hub', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...payload }),
  })
  if (!res.ok) {
    const err = new Error('api error')
    err.status = res.status
    throw err
  }
  return res.json()
}

// cred = { email, password }
export const apiLogin = (email, password) => call('login', { email, password })
export const apiLastWatched = (cred, tutorialId) => call('lastWatched', { ...cred, tutorialId })
export const apiSetCompleted = (cred, tutorialId, done) =>
  call('setCompleted', { ...cred, tutorialId, done })
export const apiGetNote = (cred, tutorialId) => call('getNote', { ...cred, tutorialId })
export const apiSaveNote = (cred, tutorialId, text) => call('saveNote', { ...cred, tutorialId, text })
export const apiListNotes = (cred) => call('listNotes', { ...cred })

// לידים ומעקב (פעולות ציבוריות, בלי סיסמה)
export const apiRegisterLead = (lead) => call('registerLead', lead) // { name, email, phone }
export const apiLogProgress = (p) => call('logProgress', p) // { email, tutorialId, tutorialTitle, seconds, reachedLimit, newAttempt }
export const apiAdminLeads = (adminKey) => call('adminLeads', { adminKey })
