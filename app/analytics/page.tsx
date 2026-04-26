"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getOrCreateUser, getAnalytics } from "@/utils/user-tracking"
import type { UserData, AnalyticsData } from "@/utils/user-tracking"

export default function AnalyticsPage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    setUser(getOrCreateUser())
    setAnalytics(getAnalytics())
  }, [])

  if (!user || !analytics) return <div>Loading...</div>

  const completionRate = Math.round((user.completedDays.length / 44) * 100)
  const avgSessionTime = Math.round(user.totalTimeSpent / user.visitCount)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-blue-900 mb-6">Your Chess Journey</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200/60">
          <CardHeader>
            <CardTitle className="text-blue-900">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{completionRate}%</div>
            <div className="text-sm text-blue-700">{user.completedDays.length} of 44 days completed</div>
          </CardContent>
        </Card>

        <Card className="border-blue-200/60">
          <CardHeader>
            <CardTitle className="text-blue-900">Study Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{user.totalTimeSpent}m</div>
            <div className="text-sm text-blue-700">{avgSessionTime}m average per visit</div>
          </CardContent>
        </Card>

        <Card className="border-blue-200/60">
          <CardHeader>
            <CardTitle className="text-blue-900">Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{user.visitCount}</div>
            <div className="text-sm text-blue-700">Since {new Date(user.createdAt).toLocaleDateString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card className="border-blue-200/60">
          <CardHeader>
            <CardTitle className="text-blue-900">Quiz Scores</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(user.quizScores).length === 0 ? (
              <div className="text-blue-700">No quizzes completed yet</div>
            ) : (
              <div className="space-y-2">
                {Object.entries(user.quizScores).map(([quiz, score]) => (
                  <div key={quiz} className="flex justify-between">
                    <span className="text-blue-900">{quiz}</span>
                    <span className="text-blue-600 font-medium">{score}/6</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
