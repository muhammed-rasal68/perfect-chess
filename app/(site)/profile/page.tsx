'use client'

import { useEffect, useState } from "react"
import ProfileCard from "@/components/profile-card"
import { COURSES } from "@/lib/courses"
import { courseCompletion } from "@/utils/progress"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const [badges, setBadges] = useState<string[]>([])

  useEffect(() => {
    const b: string[] = []
    for (const c of COURSES) {
      const pct = courseCompletion(c.slug, c.lessons.length)
      if (pct === 100) b.push(`${c.level} Course Completed`)
    }
    setBadges(b)
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-2">Your Profile</h1>
      <p className="text-blue-700 mb-6">Create an account locally to track progress, rating, and earn badges.</p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileCard />
        </div>
        <aside>
          <div className="rounded-lg border border-blue-200/60 p-4 bg-white">
            <div className="text-blue-900 font-semibold mb-2">Badges</div>
            {badges.length === 0 ? (
              <div className="text-sm text-blue-700">No badges yet. Complete courses to earn badges.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {badges.map((b, i) => (
                  <Badge key={i} variant="secondary" className="bg-blue-100 text-blue-800">{b}</Badge>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
