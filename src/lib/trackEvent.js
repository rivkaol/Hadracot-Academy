import { apiTrackEvent } from '../api'

// עטיפה דקה לאירועי Analytics — כל קריאה עוברת ל-action 'trackEvent' ב-api/hub.js,
// שמשתמש שוב ב-pushToSheet הקיים ושולח לגיליון Google. נכשלת בשקט תמיד —
// מדידה לעולם לא חוסמת שום פעולה של המשתמשת.
export function trackEvent(eventName, { email, tutorialId, meta } = {}) {
  apiTrackEvent({ eventName, email, tutorialId, meta }).catch(() => {})
}
