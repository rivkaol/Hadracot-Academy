// "השומר" — פונקציית שרת אחת שמדברת עם טבלת hadracot_users ב-Supabase.
// המפתח הסודי (service_role) נשאר כאן בצד השרת ולעולם לא נחשף לאתר הציבורי.
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE,
  { auth: { persistSession: false } }
)

// ג'ימייל מתעלם מנקודות ומ-+alias — מנרמלים זהה לייבוא כדי שאף אחת לא תינעל בחוץ.
function normEmail(e = '') {
  e = String(e).trim().toLowerCase()
  const at = e.indexOf('@')
  if (at === -1) return e
  let local = e.slice(0, at)
  let domain = e.slice(at + 1)
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    local = local.split('+')[0].replace(/\./g, '')
    domain = 'gmail.com'
  }
  return local + '@' + domain
}

const csvToIds = (s) =>
  String(s || '')
    .split(',')
    .map((x) => String(x).trim())
    .filter((x) => x !== '')
    .map(Number)
    .filter((n) => !isNaN(n))

const idsToCsv = (arr) =>
  Array.from(new Set(arr.map(Number).filter((n) => !isNaN(n)))).join(',')

async function getUser(email) {
  const { data, error } = await supabase
    .from('hadracot_users')
    .select('*')
    .eq('email', email)
    .maybeSingle()
  if (error) throw error
  return data
}

function publicUser(u) {
  return {
    email: u.email,
    name: u.name || String(u.email || '').split('@')[0],
    isClubMember: u.is_club_member === true,
    purchasedProductIds: csvToIds(u.purchased_products),
    completed: csvToIds(u.completed),
    lastWatched: u.last_watched || null,
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' })
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
    const action = body.action
    const email = normEmail(body.email)
    const password = String(body.password || '').trim()

    // כל פעולה מזוהה לפי מייל+סיסמה. סיסמה שגויה => 401.
    const user = email ? await getUser(email) : null
    const authed = user && String(user.password || '') === password && password !== ''
    if (!authed) return res.status(401).json({ error: 'auth' })

    if (action === 'login') {
      return res.json({ user: publicUser(user) })
    }

    if (action === 'lastWatched') {
      await supabase
        .from('hadracot_users')
        .update({ last_watched: Number(body.tutorialId) })
        .eq('email', email)
      return res.json({ ok: true })
    }

    if (action === 'setCompleted') {
      const ids = csvToIds(user.completed)
      const tid = Number(body.tutorialId)
      const next = body.done ? [...ids, tid] : ids.filter((i) => i !== tid)
      await supabase
        .from('hadracot_users')
        .update({ completed: idsToCsv(next) })
        .eq('email', email)
      return res.json({ ok: true, completed: Array.from(new Set(next)) })
    }

    if (action === 'getNote') {
      const { data } = await supabase
        .from('hadracot_notes')
        .select('text')
        .eq('email', email)
        .eq('tutorial_id', Number(body.tutorialId))
        .maybeSingle()
      return res.json({ text: data?.text || '' })
    }

    if (action === 'saveNote') {
      await supabase.from('hadracot_notes').upsert(
        {
          email,
          tutorial_id: Number(body.tutorialId),
          text: String(body.text || ''),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email,tutorial_id' }
      )
      return res.json({ ok: true })
    }

    if (action === 'listNotes') {
      const { data } = await supabase
        .from('hadracot_notes')
        .select('tutorial_id,text')
        .eq('email', email)
      const notes = (data || [])
        .filter((n) => n.text && String(n.text).trim())
        .map((n) => ({ tutorialId: Number(n.tutorial_id), text: n.text }))
      return res.json({ notes })
    }

    return res.status(400).json({ error: 'unknown action' })
  } catch (e) {
    console.error('hub error:', e)
    return res.status(500).json({ error: 'server' })
  }
}
