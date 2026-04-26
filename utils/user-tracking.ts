const USER_KEY = "chess-academy:user"
const ANALYTICS_KEY = "chess-academy:analytics"

export type UserData = {
  id: string
  name?: string
  createdAt: string
  lastVisit: string
  visitCount: number
  totalTimeSpent: number // in minutes
  currentDay: number
  completedDays: number[]
  quizScores: Record<string, number>
}

export type AnalyticsData = {
  dailyVisits: Record<string, number>
  popularDays: Record<number, number>
  averageSessionTime: number
  totalUsers: number
}

function generateUserId(): string {
  return "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
}

export function getOrCreateUser(): UserData {
  try {
    const existing = localStorage.getItem(USER_KEY)
    if (existing) {
      const user = JSON.parse(existing)
      // Update last visit
      user.lastVisit = new Date().toISOString()
      user.visitCount += 1
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      return user
    }
  } catch {}

  // Create new user
  const newUser: UserData = {
    id: generateUserId(),
    createdAt: new Date().toISOString(),
    lastVisit: new Date().toISOString(),
    visitCount: 1,
    totalTimeSpent: 0,
    currentDay: 1,
    completedDays: [],
    quizScores: {},
  }

  try {
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
  } catch {}

  return newUser
}

export function updateUser(updates: Partial<UserData>) {
  try {
    const user = getOrCreateUser()
    const updated = { ...user, ...updates }
    localStorage.setItem(USER_KEY, JSON.stringify(updated))
    return updated
  } catch {
    return getOrCreateUser()
  }
}

export function trackDayVisit(day: number) {
  const user = updateUser({ currentDay: day })

  // Track analytics
  try {
    const today = new Date().toDateString()
    const analytics = getAnalytics()
    analytics.dailyVisits[today] = (analytics.dailyVisits[today] || 0) + 1
    analytics.popularDays[day] = (analytics.popularDays[day] || 0) + 1
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics))
  } catch {}

  return user
}

export function markDayCompleted(day: number) {
  const user = getOrCreateUser()
  if (!user.completedDays.includes(day)) {
    user.completedDays.push(day)
    return updateUser(user)
  }
  return user
}

export function trackQuizScore(quizId: string, score: number) {
  return updateUser({
    quizScores: {
      ...getOrCreateUser().quizScores,
      [quizId]: score,
    },
  })
}

export function getAnalytics(): AnalyticsData {
  try {
    const data = localStorage.getItem(ANALYTICS_KEY)
    if (data) return JSON.parse(data)
  } catch {}

  return {
    dailyVisits: {},
    popularDays: {},
    averageSessionTime: 0,
    totalUsers: 1,
  }
}

// Track time spent on page
let sessionStart = Date.now()
export function trackSessionTime() {
  const timeSpent = Math.round((Date.now() - sessionStart) / 60000) // minutes
  if (timeSpent > 0) {
    const user = getOrCreateUser()
    updateUser({ totalTimeSpent: user.totalTimeSpent + timeSpent })
  }
  sessionStart = Date.now()
}

// Track when user leaves
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", trackSessionTime)
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      trackSessionTime()
    } else {
      sessionStart = Date.now()
    }
  })
}
