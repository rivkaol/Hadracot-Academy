export const SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbwcU0zaYy02fKkgbG7nuV-nxpy8PghAshJ__eFO6Zt_NNPSqoGn4Zr156jeD5XAobwK/exec'

// תמונת רבקה — אותה תמונה בדיוק המשמשת ב-public/join.html (Hero + "מי אני"),
// כדי שהאורחת תפגוש את אותו האדם משני הדפים.
export const RIVKA_PHOTO_URL =
  'https://res.cloudinary.com/dyqe95map/image/upload/v1778355572/profile.jpg_zror0m.jpg'

export const themeConfig = {
  'personal-growth': {
    main: '#A0627A',
    darkText: '#7E3F55',
    bgClass: 'bg-[#A0627A]/15',
    borderClass: 'border-r-4 border-r-[#A0627A]',
    gradient: 'from-[#A0627A]/30 to-transparent',
    ctaText: 'אני רוצה שינוי אמיתי',
  },
  health: {
    main: '#1F4A3A',
    darkText: '#2B2724',
    bgClass: 'bg-[#1F4A3A]/15',
    borderClass: 'border-r-4 border-r-[#1F4A3A]',
    gradient: 'from-[#1F4A3A]/30 to-transparent',
    ctaText: 'אני בוחרת בבריאות',
  },
}

export const fallbackTutorialsData = [
  {
    id: 'personal-growth',
    title: 'תודעה ושינוי מבפנים',
    description: 'כאן תמצאי כלים שיעזרו לך ליצור שינוי אמיתי – מבפנים החוצה.',
    tutorials: [],
  },
  {
    id: 'health',
    title: 'גוף בריא ואורח חיים מאוזן',
    description: 'ידע פרקטי לאורח חיים בריא, מזין ומאוזן.',
    tutorials: [],
  },
]
