export const SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbwcU0zaYy02fKkgbG7nuV-nxpy8PghAshJ__eFO6Zt_NNPSqoGn4Zr156jeD5XAobwK/exec'

export const themeConfig = {
  'personal-growth': {
    main: '#C88F96',
    darkText: '#9E626C',
    bgClass: 'bg-[#C88F96]/15',
    borderClass: 'border-r-4 border-r-[#C88F96]',
    gradient: 'from-[#C88F96]/30 to-transparent',
    ctaText: 'אני רוצה שינוי אמיתי',
  },
  health: {
    main: '#687B63',
    darkText: '#3E3935',
    bgClass: 'bg-[#687B63]/15',
    borderClass: 'border-r-4 border-r-[#687B63]',
    gradient: 'from-[#687B63]/30 to-transparent',
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
