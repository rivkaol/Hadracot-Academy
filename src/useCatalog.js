import { useState, useCallback } from 'react'
import { SHEETS_URL, fallbackTutorialsData } from './constants'

function parseCatalog(rawCatalog) {
  const catalog = rawCatalog.map((item) => {
    const clean = {}
    for (let key in item) {
      if (key) clean[key.trim()] = item[key]
    }
    return clean
  })

  const categoriesMap = {
    'personal-growth': {
      id: 'personal-growth',
      title: 'תודעה ושינוי מבפנים',
      description: 'כאן תמצאי כלים שיעזרו לך ליצור שינוי אמיתי – מבפנים החוצה.',
      tutorials: [],
    },
    health: {
      id: 'health',
      title: 'גוף בריא ואורח חיים מאוזן',
      description: 'ידע פרקטי לאורח חיים בריא, מזין ומאוזן.',
      tutorials: [],
    },
  }

  catalog.forEach((tutorial) => {
    let finalVimeoId =
      tutorial.vimeoId || tutorial.vimeoid || tutorial['קישור להדרכה בוימאו'] || '76979871'
    if (typeof finalVimeoId === 'string' && finalVimeoId.includes('vimeo.com')) {
      finalVimeoId = finalVimeoId.split('/').pop().split('?')[0]
    }

    let rawCat = String(
      tutorial.categoryLabel ||
        tutorial.categorylabel ||
        tutorial.categoryId ||
        tutorial.categoryid ||
        ''
    )
      .trim()
      .toLowerCase()

    let catId = 'personal-growth'
    if (rawCat.includes('health') || rawCat.includes('בריאות')) catId = 'health'
    else if (rawCat.includes('personal') || rawCat.includes('תודעה') || rawCat.includes('נפש'))
      catId = 'personal-growth'
    else if (rawCat !== '') catId = rawCat

    const formatted = {
      ...tutorial,
      id: Number(tutorial.id || tutorial.Id || tutorial.ID || tutorial['מס הדרכה בינבוים']),
      categoryId: catId,
      title: tutorial.title ? String(tutorial.title) : tutorial['שם הדרכה'] || 'הדרכה ללא שם',
      description: tutorial.description || tutorial['תיאור קצר'] || '',
      vimeoId: finalVimeoId,
      vimeoHash: tutorial.vimeoHash || tutorial.vimeohash || null,
      imageUrl: tutorial.imageUrl || tutorial.imageurl || tutorial['לינק לתמונה'] || null,
      pdfUrl: tutorial.pdfUrl || tutorial.pdfurl || tutorial['שם הקובץ להורדה'] || null,
      pdfTitle: tutorial.pdfTitle || tutorial.pdftitle || 'קובץ מצורף',
      landingPageUrl:
        tutorial.landingPageUrl || tutorial.landingpageurl || tutorial['דף נחיתה רלוונטי'] || null,
      recommendedOrder:
        tutorial.recommendedOrder || tutorial.recommendedorder || tutorial['סדרת התחלה']
          ? Number(
              tutorial.recommendedOrder || tutorial.recommendedorder || tutorial['סדרת התחלה']
            )
          : null,
    }

    if (categoriesMap[catId]) {
      categoriesMap[catId].tutorials.push(formatted)
    } else {
      categoriesMap[catId] = {
        id: catId,
        title: tutorial.categoryTitle || tutorial.categorytitle || 'הדרכות נוספות',
        description: '',
        tutorials: [formatted],
      }
    }
  })

  return Object.values(categoriesMap).filter((cat) => cat.tutorials.length > 0)
}

export function useCatalog() {
  const [tutorialsData, setTutorialsData] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(true)

  const fetchCatalog = useCallback(async () => {
    const cached = localStorage.getItem('cached_catalog_v3')
    if (cached) {
      setTutorialsData(JSON.parse(cached))
      setCatalogLoading(false)
    }

    try {
      const response = await fetch(SHEETS_URL, { redirect: 'follow' })
      const raw = await response.json()

      if (!raw || raw.length === 0) {
        if (!cached) setTutorialsData(fallbackTutorialsData)
        setCatalogLoading(false)
        return
      }

      const finalData = parseCatalog(raw)
      localStorage.setItem('cached_catalog_v3', JSON.stringify(finalData))
      setTutorialsData(finalData)
    } catch (err) {
      console.log('שגיאה במשיכת קטלוג. משתמש במטמון.', err)
      if (!cached) setTutorialsData(fallbackTutorialsData)
    } finally {
      setCatalogLoading(false)
    }
  }, [])

  return { tutorialsData, setTutorialsData, catalogLoading, fetchCatalog }
}
