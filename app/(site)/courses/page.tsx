'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { COURSES } from "@/lib/courses"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { courseCompletion } from "@/utils/progress"

export default function CoursesPage() {
  const [percent, setPercent] = useState<Record<string, number>>({})

  useEffect(() => {
    const map: Record<string, number> = {}
    for (const c of COURSES) {
      map[c.slug] = courseCompletion(c.slug, c.lessons.length)
    }
    setPercent(map)
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-2">Course Catalog</h1>
      <p className="text-blue-700 mb-6">Structured classes with progress tracking and quizzes.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COURSES.map((c) => (
          <Link key={c.slug} href={`/courses/${c.slug}`} className="group">
            <Card className="h-full border-blue-200/60 transition hover:-translate-y-0.5 hover:shadow-sm">
              <CardHeader className="pb-2 space-y-1">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-900">{c.title}</CardTitle>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">{c.level}</Badge>
                </div>
                <p className="text-sm text-blue-700">{c.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mt-2">
                  <Progress value={percent[c.slug] ?? 0} className="h-2 bg-blue-100" />
                </div>
                <div className="mt-2 text-xs text-blue-700">
                  {percent[c.slug] ?? 0}% complete • {c.lessons.length} lessons
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
