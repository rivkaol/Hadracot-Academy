// מקור אמת יחיד למחירים וקישורי תשלום — כל מקום שמציג מחיר/קישור הצטרפות
// (LandingHome, TrialTrackMapScreen, מסך "מנוי לא פעיל") שואב מכאן בלבד.
// שינוי מחיר בעתיד = עריכה במקום הזה בלבד, לא חיפוש בקוד.
export const pricingConfig = {
  membershipPrice: 69,
  membershipPriceLabel: '69 ₪ לחודש',
  // מ-public/join.html ו-public/join-lesson.html הקיימים (אותו ProductGuid בשניהם).
  membershipCheckoutUrl:
    'https://private.invoice4u.co.il/newsite/he/clearing/public/i4u-clearing?ProductGuid=550b937f-ac6b-4fc0-bb03-99139eb0193f',

  // TODO(רבקה): להשלים מחיר וקישור תשלום VIP אמיתיים לפני השקה.
  vipPrice: null,
  vipPriceLabel: null,
  vipCheckoutUrl: null,

  whatsappNumber: '972504207702',
  whatsappBaseUrl: 'https://wa.me/504207702',

  // מפגש חי קרוב — מתעדכן ידנית, לא מערכת אירועים מלאה. null = אין מפגש קרוב, האזור לא מוצג.
  // דוגמה: { date: '2026-09-01T19:00:00+03:00', title: 'מפגש זום חי', joinUrl: 'https://...' }
  nextLiveSession: null,
}
