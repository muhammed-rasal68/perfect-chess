const PROGRESS_KEY = "chess-academy:video-progress"

export function getCompletedDays(): number[] {
  try {
    const data = localStorage.getItem(PROGRESS_KEY)
    if (!data) return []
    const parsed = JSON.parse(data)
    // Ensure we always return an array
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function markDayComplete(day: number): number[] {
  try {
    const completed = getCompletedDays()
    if (!completed.includes(day)) {
      completed.push(day)
      completed.sort((a, b) => a - b)
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed))
    }
    return completed
  } catch {
    return getCompletedDays()
  }
}

export function isDayComplete(day: number): boolean {
  const completed = getCompletedDays()
  return completed.includes(day)
}

export function getHighestUnlockedDay(): number {
  const completed = getCompletedDays()

  // Day 1 is always unlocked
  let highest = 1

  // Check each day sequentially
  for (let day = 1; day <= 44; day++) {
    if (completed.includes(day)) {
      highest = day + 1 // Next day becomes unlocked
    } else {
      break // Stop at first incomplete day
    }
  }

  return Math.min(44, highest)
}
