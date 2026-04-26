'use client'

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from 'lucide-react'

export type QuizQuestion = {
  id: string
  prompt: string
  choices: { id: string; text: string }[]
  answerId: string
  explanation?: string
}

export function Quiz({
  questions,
  onPass,
  storageKey,
}: {
  questions: QuizQuestion[]
  onPass?: () => void
  storageKey: string
}) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[idx]

  useEffect(() => {
    setSelected(null)
    setCorrect(null)
  }, [idx])

  function submit() {
    if (!selected) return
    const isRight = selected === q.answerId
    setCorrect(isRight)
    if (isRight) setScore(s => s + 1)
  }

  function next() {
    if (idx + 1 < questions.length) {
      setIdx(i => i + 1)
    } else {
      setDone(true)
      // persist result
      try {
        const raw = localStorage.getItem(storageKey)
        const prev = raw ? JSON.parse(raw) : { attempts: 0, passes: 0 }
        prev.attempts += 1
        if (score + (correct ? 1 : 0) === questions.length) prev.passes += 1
        localStorage.setItem(storageKey, JSON.stringify(prev))
      } catch {}
      if (score + (correct ? 1 : 0) === questions.length) {
        onPass?.()
      }
    }
  }

  if (done) {
    const passed = score === questions.length
    return (
      <Card className="border-blue-200/60">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-900">
            {passed ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
            <div className="font-medium">
              {passed ? "Perfect! You passed the quiz." : `You scored ${score}/${questions.length}. Try again to pass.`}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200/60">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-blue-900 font-medium">Quiz</div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Question {idx + 1} / {questions.length}
          </Badge>
        </div>
        <div className="mt-3 text-blue-900 font-semibold">{q.prompt}</div>
        <div className="mt-3 grid gap-2">
          {q.choices.map((c) => {
            const isSel = selected === c.id
            const showState = correct !== null && isSel
            const success = showState && correct
            const danger = showState && !correct
            return (
              <Button
                key={c.id}
                variant={isSel ? "default" : "outline"}
                className={
                  isSel
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "justify-start border-blue-300 text-blue-800 hover:bg-blue-50"
                }
                onClick={() => setSelected(c.id)}
              >
                <span className="text-left">{c.text}</span>
              </Button>
            )
          })}
        </div>
        <div className="mt-4 flex items-center gap-2">
          {correct === null ? (
            <Button onClick={submit} disabled={!selected} className="bg-blue-600 hover:bg-blue-700">Submit</Button>
          ) : (
            <Button onClick={next} className="bg-blue-600 hover:bg-blue-700">Next</Button>
          )}
          {correct !== null && (
            <span className={`text-sm ${correct ? "text-green-700" : "text-red-700"}`}>
              {correct ? "Correct!" : q.explanation || "Not quite. Review and try again."}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
