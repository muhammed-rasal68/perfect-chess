'use client'

import Link from "next/link"
import { useMemo } from "react"
import { useParams } from "next/navigation"
import { COURSES } from "@/lib/courses"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MiniBoard } from "@/components/mini-board"
import { Quiz } from "@/components/quiz"
import { markLessonComplete } from "@/utils/progress"
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function LessonPage() {
  const params = useParams<{ course: string; lesson: string }>()
  const { course, lesson } = params

  const ctx = useMemo(() => {
    const c = COURSES.find(x => x.slug === course)
    if (!c) return null
    const i = c.lessons.findIndex(l => l.slug === lesson)
    const l = i >= 0 ? c.lessons[i] : null
    return { c, l, idx: i }
  }, [course, lesson])

  if (!ctx?.c || !ctx?.l || ctx.idx < 0) {
    return <div className="mx-auto max-w-7xl px-4 py-10">Lesson not found.</div>
  }

  const prev = ctx.idx > 0 ? ctx.c.lessons[ctx.idx - 1] : null
  const next = ctx.idx < ctx.c.lessons.length - 1 ? ctx.c.lessons[ctx.idx + 1] : null

  function handlePass() {
    markLessonComplete(ctx.c.slug, ctx.l.slug)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <div className="mb-4">
        <Link href={`/courses/${ctx.c.slug}`} className="text-blue-700 hover:text-blue-900">&larr; Back to {ctx.c.title}</Link>
      </div>
      <h1 className="text-2xl md:text-3xl font-semibold text-blue-900">{ctx.l.title}</h1>
      <p className="text-blue-700">{ctx.c.title} • {ctx.c.level}</p>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
        <div className="space-y-4">
          <Card className="border-blue-200/60">
            <CardHeader><CardTitle className="text-blue-900">Lesson</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {ctx.l.content.paragraphs.map((p, i) => (
                <p key={i} className="text-blue-800">{p}</p>
              ))}
              {ctx.l.content.diagrams.map((d, i) => (
                <div key={i} className="flex flex-col items-center">
                  <MiniBoard fen={d.fen} size={280} />
                  {d.caption && <div className="mt-2 text-sm text-blue-700">{d.caption}</div>}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-blue-200/60">
            <CardHeader><CardTitle className="text-blue-900">Practice Tactics</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="text-blue-800 text-sm">
                Apply the lesson concepts with quick tactics related to this topic. For a deeper trainer, visit the Puzzles page.
              </p>
              <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800 ring-1 ring-blue-200/70">
                Tip: Visualize lines before moving. Identify forcing moves first (checks, captures, threats).
              </div>
              <div className="mt-2">
                <Link href="/puzzles">
                  <Button className="bg-blue-600 hover:bg-blue-700">Go to Puzzles Trainer</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              {prev ? (
                <Link href={`/courses/${ctx.c.slug}/lessons/${prev.slug}`}>
                  <Button variant="outline" className="border-blue-300 text-blue-800 hover:bg-blue-50">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                </Link>
              ) : <span className="text-sm text-blue-600">Start of course</span>}
            </div>
            <div>
              {next ? (
                <Link href={`/courses/${ctx.c.slug}/lessons/${next.slug}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : <span className="text-sm text-blue-600">Last lesson</span>}
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <Card className="border-blue-200/60">
            <CardHeader><CardTitle className="text-blue-900">Quick Quiz</CardTitle></CardHeader>
            <CardContent>
              <Quiz
                questions={ctx.l.quiz.questions}
                storageKey={`quiz:${ctx.c.slug}:${ctx.l.slug}`}
                onPass={handlePass}
              />
              <div className="mt-2 text-xs text-blue-700">
                Pass the quiz to mark this lesson as complete.
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
