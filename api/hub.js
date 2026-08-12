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

// שולח אירוע בזמן אמת לגיליון גוגל (Apps Script Webhook), אם הוגדר URL ב-env.
// נכשל בשקט — לעולם לא חוסם את הרשמת האורחת או את הצפייה.
async function pushToSheet(payload) {
  const url = process.env.SHEETS_WEBHOOK_URL
  if (!url) return
  // הגנת timeout: אם הגיליון איטי/תקוע — לא חוסמים את השרת (הנתונים כבר נשמרו ב-Supabase לפני כן).
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 8000)
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: process.env.SHEETS_WEBHOOK_SECRET || '', ...payload }),
      signal: ctrl.signal,
    })
  } catch (e) {
    console.error('sheet webhook failed:', e)
  } finally {
    clearTimeout(timer)
  }
}

// טלפון ישראלי לצורך השוואה: משאיר ספרות בלבד, 972 → 0. הסיסמה של מנויה = הטלפון שלה.
function normPhone(raw = '') {
  let d = String(raw).replace(/\D/g, '')
  if (d.startsWith('972')) d = '0' + d.slice(3)
  return d
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

    // ---- פעולות ציבוריות (בלי סיסמה): לידים, מעקב מעורבות, דף אדמין ----

    // הרשמת ליד (שם+טלפון+מייל) לפני צפייה בטעימה
    if (action === 'registerLead') {
      if (!email) return res.status(400).json({ error: 'email' })
      const leadName = String(body.name || '').trim()
      const leadPhone = String(body.phone || '').trim()
      const phoneNorm = normPhone(leadPhone)
      const now = new Date().toISOString()

      // זיהוי מנויה שנרשמה בטעות כאורחת:
      // 1) לפי המייל (המפתח בטבלת המנויות)  2) ואם לא — לפי הטלפון (שהוא הסיסמה).
      let member = await getUser(email)
      if (!member && phoneNorm) {
        const { data: byPhone } = await supabase
          .from('hadracot_users')
          .select('*')
          .eq('password', phoneNorm)
          .limit(1)
        member = (byPhone && byPhone[0]) || null
      }
      if (member) {
        const storedPw = String(member.password || '')
        // הטלפון שהזינה תואם לסיסמה השמורה → מכניסים אותה ישר כמנויה (התחברות אוטומטית).
        if (phoneNorm && normPhone(storedPw) === phoneNorm) {
          return res.json({ member: publicUser(member), password: storedPw })
        }
        // המייל מוכר אבל הטלפון לא תואם → שולחים אותה למסך התחברות עם המייל מוכן מראש.
        return res.json({ knownMemberEmail: member.email })
      }

      // אורחת רגילה — שמירה כליד + זרימה לגיליון גוגל
      await supabase.from('hadracot_leads').upsert(
        { email, name: leadName, phone: leadPhone, updated_at: now },
        { onConflict: 'email' }
      )
      await pushToSheet({ type: 'lead', email, name: leadName, phone: leadPhone, when: now })
      return res.json({ ok: true })
    }

    // רישום מעורבות: כמה שניות צפתה, האם סיימה, כמה פעמים נכנסה
    if (action === 'logProgress') {
      if (!email) return res.json({ ok: false })
      const tid = Number(body.tutorialId)
      if (isNaN(tid)) return res.json({ ok: false })
      const secs = Math.max(0, Math.round(Number(body.seconds) || 0))
      const { data: existing } = await supabase
        .from('hadracot_lead_progress')
        .select('max_seconds,attempts,reached_limit')
        .eq('email', email)
        .eq('tutorial_id', tid)
        .maybeSingle()
      const prevAttempts = existing?.attempts || 0
      await supabase.from('hadracot_lead_progress').upsert(
        {
          email,
          tutorial_id: tid,
          tutorial_title: String(body.tutorialTitle || '').slice(0, 300),
          max_seconds: Math.max(secs, existing?.max_seconds || 0),
          attempts: existing ? (body.newAttempt ? prevAttempts + 1 : prevAttempts) : 1,
          reached_limit: body.reachedLimit === true || existing?.reached_limit || false,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email,tutorial_id' }
      )
      // "נראתה לאחרונה" (משפיע רק אם זו ליד; משתמשת רשומה — 0 שורות, לא מזיק)
      await supabase.from('hadracot_leads').update({ updated_at: new Date().toISOString() }).eq('email', email)

      // זרימה בזמן אמת לגיליון גוגל — רק ברגעים חשובים (לא בכל פינג של 20 שניות):
      // פתיחת סרטון חדש, או הרגע שבו הפכה ל"חמה" (סיימה את כל 5 הדקות).
      const isOpen = body.newAttempt === true
      const becameHot = body.reachedLimit === true && !existing?.reached_limit
      if (isOpen || becameHot) {
        const { data: leadRow } = await supabase
          .from('hadracot_leads')
          .select('name,phone')
          .eq('email', email)
          .maybeSingle()
        await pushToSheet({
          type: becameHot ? 'hot' : 'open',
          email,
          name: leadRow?.name || '',
          phone: leadRow?.phone || '',
          tutorialId: tid,
          tutorialTitle: String(body.tutorialTitle || '').slice(0, 300),
          minutes: Math.round((secs / 60) * 10) / 10,
          when: new Date().toISOString(),
        })
      }
      return res.json({ ok: true })
    }

    // דף אדמין: כל הלידים עם סיכום מעורבות. מוגן במפתח סודי (ADMIN_KEY ב-Vercel).
    if (action === 'adminLeads') {
      if (!process.env.ADMIN_KEY || String(body.adminKey || '') !== process.env.ADMIN_KEY) {
        return res.status(401).json({ error: 'admin' })
      }
      const { data: leads } = await supabase.from('hadracot_leads').select('*').order('updated_at', { ascending: false })
      const { data: progress } = await supabase.from('hadracot_lead_progress').select('*')
      const byEmail = {}
      for (const p of progress || []) {
        const a = byEmail[p.email] || (byEmail[p.email] = { tutorials: 0, totalSeconds: 0, reached: 0, items: [] })
        a.tutorials += 1
        a.totalSeconds += p.max_seconds || 0
        if (p.reached_limit) a.reached += 1
        a.items.push({
          tutorialId: p.tutorial_id,
          title: p.tutorial_title,
          maxSeconds: p.max_seconds,
          reachedLimit: p.reached_limit,
          attempts: p.attempts,
          openedAt: p.updated_at, // התאריך שבו פתחה את הסרטון לאחרונה
          firstOpenedAt: p.created_at || p.updated_at, // הפעם הראשונה שפתחה
        })
        if (!a.lastActivity || (p.updated_at && p.updated_at > a.lastActivity)) a.lastActivity = p.updated_at
      }
      const rows = (leads || []).map((l) => ({
        email: l.email,
        name: l.name,
        phone: l.phone,
        createdAt: l.created_at,
        lastSeen: l.updated_at,
        tutorials: 0,
        totalSeconds: 0,
        reached: 0,
        items: [],
        ...(byEmail[l.email] || {}),
      }))
      return res.json({ leads: rows })
    }

    // ---- מכאן ואילך: פעולות חברות המזוהות לפי מייל+סיסמה. סיסמה שגויה => 401 ----
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
