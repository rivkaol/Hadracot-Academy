export const SHEETS_URL =
  'https://script.google.com/macros/s/AKfycbwcU0zaYy02fKkgbG7nuV-nxpy8PghAshJ__eFO6Zt_NNPSqoGn4Zr156jeD5XAobwK/exec'

export const themeConfig = {
  'personal-growth': {
    main: '#C5A18E',
    darkText: '#8E6D5B',
    bgClass: 'bg-[#C5A18E]/15',
    borderClass: 'border-r-4 border-r-[#C5A18E]',
    gradient: 'from-[#C5A18E]/30 to-transparent',
    ctaText: 'אני רוצה שינוי אמיתי',
  },
  health: {
    main: '#94A388',
    darkText: '#1B4D3E',
    bgClass: 'bg-[#94A388]/15',
    borderClass: 'border-r-4 border-r-[#94A388]',
    gradient: 'from-[#94A388]/30 to-transparent',
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
