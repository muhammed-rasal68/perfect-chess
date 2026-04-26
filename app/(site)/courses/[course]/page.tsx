'use client'

import { useMemo } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { COURSES } from "@/lib/courses"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { courseCompletion, isLessonComplete } from "@/utils/progress"
import { CheckCircle2 } from 'lucide-react'

export default function CourseOverviewPage() {
  const params = useParams<{ course: string }>()
  const course = useMemo(() => COURSES.find(c => c.slug === params.course), [params.course])

  if (!course) {
    return <div className="mx-auto max-w-7xl px-4 py-10">Course not found.</div>
  }

  const percent = courseCompletion(course.slug, course.lessons.length)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-blue-900">{course.title}</h1>
          <p className="text-blue-700">Level: <Badge variant="secondary" className="bg-blue-100 text-blue-800">{course.level}</Badge></p>
        </div>
        <div className="text-blue-800">{percent}% complete</div>
      </div>

      {course.playlistId && (
        <div className="mt-6">
          <Card className="border-blue-200/60">
            <CardHeader><CardTitle className="text-blue-900">Video Lessons</CardTitle></CardHeader>
            <CardContent>
              {/* Inline aspect-ratio so the iframe is always visible */}
              <div
                className="relative w-full overflow-hidden rounded-lg ring-1 ring-blue-200/70 shadow-sm bg-blue-50"
                style={{ aspectRatio: "16 / 9" }}
              >
                <iframe
                  title={`${course.title} Playlist`}
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(course.playlistId)}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-6">
        <Card className="border-blue-200/60">
          <CardHeader><CardTitle className="text-blue-900">Lessons</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {course.lessons.map((l, i) => {
              const done = isLessonComplete(course.slug, l.slug)
              return (
                <Link key={l.slug} href={`/courses/${course.slug}/lessons/${l.slug}`} className="group">
                  <div className="rounded-lg border border-blue-200/60 p-3 bg-white transition hover:-translate-y-0.5 hover:shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="text-blue-900 font-medium">{i + 1}. {l.title}</div>
                      {done && <CheckCircle2 className="h-4 w-4 text-green-600" aria-label="Completed" />}
                    </div>
                    <div className="mt-1 text-sm text-blue-700 line-clamp-2">
                      {l.content.paragraphs[0]}
                    </div>
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
