// זיהוי מצב הצופה: visitor | trial | purchaser | inactive | member | vip.
// זה המקור היחיד לקביעת "מה היא רואה" — כל השאר (App.jsx, Dashboard, Landing)
// מתייחסים ל-state הזה, לא בודקים isClubMember/lead ישירות בפיזור על פני הקוד.
export function useViewerState({ isAuthenticated, isClubMember, isVip, accessibleTutorialIds, lead }) {
  const hasFullAccess = isClubMember || isVip

  let state
  if (isAuthenticated && hasFullAccess) {
    state = isVip ? 'vip' : 'member'
  } else if (isAuthenticated && (accessibleTutorialIds || []).length > 0) {
    state = 'purchaser'
  } else if (isAuthenticated) {
    state = 'inactive'
  } else if (lead) {
    state = 'trial'
  } else {
    state = 'visitor'
  }

  return { state, hasFullAccess }
}
