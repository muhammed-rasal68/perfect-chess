"use client"
import { useState } from "react"
// This is a React component with JSX

import { useEffect, useMemo, useRef } from "react"
import { WatermarkFixedBR } from "@/components/watermark-fixed"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight, Flame, Star, Lock, CheckCircle2 } from "lucide-react"
import { ChessPiecesQuiz } from "@/components/chess-pieces-quiz"
import { getCompletedDays, markDayComplete, isDayComplete, getHighestUnlockedDay } from "@/utils/video-progress"

// Your playlist ID from the URL
const PLAYLIST_ID = "PLH7E_qFiE1up4jSRWyUyI2OY7uSQ8Sc_t"
const TOTAL_DAYS = 44

type DayMeta = { title: string; hint: string }

const META_TEMPLATES: DayMeta[] = [
  { title: "Opening Principles", hint: "Develop quickly, control the center, castle early." },
  { title: "Tactics Essentials", hint: "Pins, forks, skewers, and basic combinations." },
  { title: "Checkmate Patterns", hint: "Back‑rank mates, smothered mate, ladder mates." },
  { title: "Strategy Basics", hint: "Plans, activity, weak squares, prophylaxis." },
  { title: "Endgame Basics", hint: "Opposition, promotion, king activity." },
  { title: "Calculation Drills", hint: "Forcing moves first: checks, captures, threats." },
]

function getDayMeta(n: number): DayMeta {
  if (n === 1) return { title: "Getting Started", hint: "Board setup, movement, and core rules." }
  if (n === 5) return { title: "Piece Knowledge Test", hint: "Test your knowledge of chess piece names." }
  if (n % 7 === 0) return { title: "Review Day", hint: "Recap your week: quick tests + light practice." }
  const idx = (n - 2) % META_TEMPLATES.length
  return META_TEMPLATES[idx]
}

export default function Dashboard() {
  const days = useMemo(() => Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1), [])
  const [day, setDay] = useState(1)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [completedDays, setCompletedDays] = useState<number[]>([])
  const [highestUnlocked, setHighestUnlocked] = useState(1)
  const [showConfirm, setShowConfirm] = useState(false)

  // Load progress on mount
  useEffect(() => {
    const completed = getCompletedDays()
    setCompletedDays(completed)
    setHighestUnlocked(getHighestUnlockedDay())

    // Check if day 5 quiz is completed
    if (day === 5) {
      try {
        const quizDone = localStorage.getItem("chess-day5-quiz-completed") === "true"
        setQuizCompleted(quizDone)
      } catch {
        setQuizCompleted(false)
      }
    }
  }, [day])

  // Listen for quiz completion
  useEffect(() => {
    const handleQuizComplete = () => {
      setQuizCompleted(true)
      // Mark day 5 as complete when quiz is finished
      const completed = markDayComplete(5)
      setCompletedDays(completed)
      setHighestUnlocked(getHighestUnlockedDay())
    }

    window.addEventListener("chess-quiz-completed", handleQuizComplete)
    return () => window.removeEventListener("chess-quiz-completed", handleQuizComplete)
  }, [])

  // Handle marking day as complete
  const handleMarkComplete = () => {
    const completed = markDayComplete(day)
    setCompletedDays(completed)
    setHighestUnlocked(getHighestUnlockedDay())
    setShowConfirm(false)
  }

  // Chip strip scroll helpers
  const chipRefs = useRef<Record<number, HTMLButtonElement | null>>({})
  const trackRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const el = chipRefs.current[day]
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
  }, [day])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        const newDay = Math.max(1, day - 1)
        if (newDay <= highestUnlocked) setDay(newDay)
      }
      if (e.key === "ArrowRight") {
        const newDay = Math.min(days.length, day + 1)
        if (newDay <= highestUnlocked) setDay(newDay)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [days.length, day, highestUnlocked])

  function scrollTrack(direction: "left" | "right") {
    const el = trackRef.current
    if (!el) return
    const delta = el.clientWidth * 0.85
    el.scrollBy({ left: direction === "left" ? -delta : delta, behavior: "smooth" })
  }

  const iframeSrc = useMemo(() => {
    const index = day
    return `https://www.youtube.com/embed?listType=playlist&list=${encodeURIComponent(PLAYLIST_ID)}&index=${index}&rel=0&modestbranding=1`
  }, [day])

  const showQuizFirst = day === 5 && !quizCompleted
  const showVideo = day !== 5 || quizCompleted
  const isDayUnlocked = day <= highestUnlocked
  const isDayCompleted = isDayComplete(day)

  return (
    <main className="relative min-h-screen bg-white text-blue-900">
      <WatermarkFixedBR />

      {/* Top logo centered */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-blue-100">
        <div className="mx-auto max-w-5xl px-4 py-5 flex items-center justify-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PERFECT%20LOGO-xfE2QnYhfG2WbI427UVMA4vSfQcDmR.png"
            alt="Perfect Public School logo"
            width={56}
            height={56}
            className="h-14 w-14 object-contain"
          />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-blue-900">44‑Day Chess Training Plan</h1>
          <p className="mt-2 text-blue-700">Complete each lesson to unlock the next one.</p>
        </div>

        {/* Progress overview */}
        <div className="mx-auto mt-6 max-w-3xl">
          <div className="flex items-center justify-between text-sm text-blue-700">
            <span>
              Day {day} of {TOTAL_DAYS} • {completedDays.length} completed
            </span>
            <span>{Math.round((completedDays.length / TOTAL_DAYS) * 100)}%</span>
          </div>
          <Progress value={Math.round((completedDays.length / TOTAL_DAYS) * 100)} className="mt-2 h-2 bg-blue-100" />
        </div>

        {/* Day selector with titles + hints */}
        <div className="mt-6 mx-auto max-w-5xl">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-blue-200 text-blue-800 hover:bg-blue-50 bg-transparent"
              onClick={() => {
                const newDay = Math.max(1, day - 1)
                if (newDay <= highestUnlocked) setDay(newDay)
              }}
              disabled={day <= 1}
              aria-label="Previous Day"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev
            </Button>

            <TooltipProvider delayDuration={150}>
              <div
                ref={trackRef}
                className="relative w-full overflow-x-auto rounded-xl ring-1 ring-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/60"
                aria-label="Choose a day"
              >
                <div className="flex items-stretch gap-3 px-3 py-3 min-w-max snap-x snap-mandatory">
                  {days.map((d) => {
                    const m = getDayMeta(d)
                    const isActive = d === day
                    const isUnlocked = d <= highestUnlocked
                    const isCompleted = isDayComplete(d)
                    const Icon = d % 7 === 0 ? Flame : d % 10 === 0 ? Star : null

                    const chip = (
                      <button
                        key={d}
                        ref={(el) => (chipRefs.current[d] = el)}
                        onClick={() => isUnlocked && setDay(d)}
                        title={isUnlocked ? `Go to Day ${d}` : "Complete previous lessons to unlock"}
                        aria-current={isActive ? "true" : undefined}
                        disabled={!isUnlocked}
                        className={[
                          "group relative snap-start inline-flex items-center gap-3 rounded-2xl px-4 py-3 transition text-left",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70",
                          !isUnlocked && "opacity-50 cursor-not-allowed",
                          isActive && isUnlocked
                            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg ring-1 ring-white/30"
                            : isUnlocked
                              ? "bg-white text-blue-900 ring-1 ring-blue-200 hover:ring-blue-300 hover:bg-blue-50"
                              : "bg-gray-100 text-gray-500 ring-1 ring-gray-200",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition shrink-0 relative",
                            isActive && isUnlocked
                              ? "bg-white/20 text-white ring-1 ring-white/30"
                              : isUnlocked
                                ? "bg-blue-100 text-blue-900"
                                : "bg-gray-200 text-gray-500",
                          ].join(" ")}
                          aria-hidden="true"
                        >
                          {!isUnlocked ? <Lock className="h-4 w-4" /> : String(d).padStart(2, "0")}
                          {isCompleted && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white" />
                          )}
                        </span>

                        <div className="flex flex-col items-start">
                          <span className={isActive ? "font-semibold" : "font-medium"}>
                            Day {d}: {m.title}
                          </span>
                          <span
                            className={
                              isActive && isUnlocked
                                ? "text-xs text-white/90"
                                : isUnlocked
                                  ? "text-xs text-blue-700/90 line-clamp-1"
                                  : "text-xs text-gray-500/90 line-clamp-1"
                            }
                          >
                            {!isUnlocked ? "🔒 Locked" : isCompleted ? "✅ Complete" : m.hint}
                          </span>
                        </div>

                        {Icon && isUnlocked && (
                          <span className="ml-1">
                            <Icon className={isActive ? "h-4 w-4 text-white/90" : "h-4 w-4 text-blue-600"} />
                          </span>
                        )}

                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
                          >
                            <span className="absolute -inset-x-10 -top-1 h-1/2 rotate-6 bg-white/20 blur-xl" />
                          </span>
                        )}
                      </button>
                    )

                    return (
                      <Tooltip key={`tip-${d}`}>
                        <TooltipTrigger asChild>{chip}</TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <div className="font-semibold text-blue-900">
                            Day {d}: {m.title}
                          </div>
                          <div className="text-sm text-blue-700 mt-1">
                            {!isUnlocked ? "Complete previous lessons to unlock" : m.hint}
                          </div>
                          {isCompleted && <div className="text-xs text-green-600 mt-1">✅ Completed</div>}
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              </div>
            </TooltipProvider>

            <Button
              variant="outline"
              className="border-blue-200 text-blue-800 hover:bg-blue-50 bg-transparent"
              onClick={() => {
                const newDay = Math.min(days.length, day + 1)
                if (newDay <= highestUnlocked) setDay(newDay)
              }}
              disabled={day >= Math.min(days.length, highestUnlocked)}
              aria-label="Next Day"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="mt-2 flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-800 hover:bg-blue-50"
              onClick={() => scrollTrack("left")}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Scroll
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-800 hover:bg-blue-50"
              onClick={() => scrollTrack("right")}
            >
              Scroll <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Locked message */}
        {!isDayUnlocked && (
          <div className="mt-8 mx-auto max-w-2xl">
            <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <div className="text-lg font-medium text-gray-900 mb-2">This lesson is locked</div>
              <div className="text-sm text-gray-600">Complete Day {highestUnlocked - 1} to unlock this lesson.</div>
            </div>
          </div>
        )}

        {/* Show quiz first on day 5 if not completed */}
        {isDayUnlocked && showQuizFirst && (
          <div className="mt-8 mx-auto max-w-2xl">
            <div className="mb-4 text-center">
              <div className="text-lg font-medium text-blue-900 mb-2">Complete the quiz to unlock today's video!</div>
              <div className="text-sm text-blue-700">
                Test your knowledge of chess piece names before watching the lesson.
              </div>
            </div>
            <ChessPiecesQuiz />
          </div>
        )}

        {/* Show video player */}
        {isDayUnlocked && showVideo && (
          <div className="mt-8">
            {day === 5 && quizCompleted && (
              <div className="mb-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-800 rounded-lg border border-green-200">
                  <span className="text-green-600">✓</span>
                  Quiz completed! Now enjoy today's video lesson.
                </div>
              </div>
            )}

            <div
              id="playlist"
              className="relative w-full overflow-hidden rounded-xl ring-1 ring-blue-200/70 shadow-sm bg-blue-50"
              style={{ aspectRatio: "16 / 9" }}
            >
              <iframe
                key={`video-${day}`}
                title={`Training — Day ${day}`}
                className="absolute inset-0 h-full w-full"
                src={iframeSrc}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* Mark as Complete Button */}
            {!isDayCompleted && (
              <div className="mt-4 text-center">
                {!showConfirm ? (
                  <Button
                    onClick={() => setShowConfirm(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Complete
                  </Button>
                ) : (
                  <div className="inline-flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-blue-900">Did you finish watching this lesson?</span>
                    <Button
                      onClick={handleMarkComplete}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 text-sm"
                    >
                      Yes, Complete It
                    </Button>
                    <Button
                      onClick={() => setShowConfirm(false)}
                      variant="outline"
                      className="border-blue-300 text-blue-800 hover:bg-blue-50 px-4 py-1 text-sm"
                    >
                      Not Yet
                    </Button>
                  </div>
                )}
              </div>
            )}

            {isDayCompleted && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-800 rounded-lg border border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  Lesson completed! Next lesson is now unlocked.
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
