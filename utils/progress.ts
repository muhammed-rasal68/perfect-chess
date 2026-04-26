const KEY = "chess-academy:progress"

export type ProgressStore = {
  // courseSlug -> set of completed lesson slugs
  [courseSlug: string]: string[]
}

export function getProgress(): ProgressStore {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function markLessonComplete(courseSlug: string, lessonSlug: string) {
  try {
    const data = getProgress()
    const arr = new Set(data[courseSlug] || [])
    arr.add(lessonSlug)
    data[courseSlug] = Array.from(arr)
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {}
}

export function isLessonComplete(courseSlug: string, lessonSlug: string) {
  const data = getProgress()
  return (data[courseSlug] || []).includes(lessonSlug)
}

export function courseCompletion(courseSlug: string, totalLessons: number) {
  const data = getProgress()
  const done = (data[courseSlug] || []).length
  return Math.min(100, Math.round((done / Math.max(totalLessons, 1)) * 100))
}
