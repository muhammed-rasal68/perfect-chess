"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

type QuizQuestion = {
  id: string
  piece: string
  symbol: string
  choices: string[]
  correct: string
}

const PIECE_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    piece: "King",
    symbol: "♔",
    choices: ["King", "Queen", "Bishop", "Knight"],
    correct: "King",
  },
  {
    id: "q2",
    piece: "Queen",
    symbol: "♕",
    choices: ["King", "Queen", "Rook", "Bishop"],
    correct: "Queen",
  },
  {
    id: "q3",
    piece: "Rook",
    symbol: "♖",
    choices: ["Castle", "Rook", "Tower", "Bishop"],
    correct: "Rook",
  },
  {
    id: "q4",
    piece: "Bishop",
    symbol: "♗",
    choices: ["Bishop", "Knight", "Pawn", "Minister"],
    correct: "Bishop",
  },
  {
    id: "q5",
    piece: "Knight",
    symbol: "♘",
    choices: ["Horse", "Knight", "Cavalry", "Jumper"],
    correct: "Knight",
  },
  {
    id: "q6",
    piece: "Pawn",
    symbol: "♙",
    choices: ["Soldier", "Pawn", "Foot", "Worker"],
    correct: "Pawn",
  },
]

export function ChessPiecesQuiz() {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const question = PIECE_QUESTIONS[currentQ]
  const isCorrect = selected === question.correct
  const isLastQuestion = currentQ === PIECE_QUESTIONS.length - 1

  function handleSubmit() {
    if (!selected) return
    setShowResult(true)
    if (isCorrect) {
      setScore((s) => s + 1)
    }
  }

  function handleNext() {
    if (isLastQuestion) {
      setCompleted(true)
      const finalScore = score + (isCorrect ? 1 : 0)

      // Save completion to localStorage
      try {
        localStorage.setItem("chess-day5-quiz-completed", "true")
        localStorage.setItem("chess-day5-quiz-score", finalScore.toString())
      } catch {}

      // Dispatch custom event to notify parent component
      window.dispatchEvent(new CustomEvent("chess-quiz-completed"))
    } else {
      setCurrentQ((q) => q + 1)
      setSelected(null)
      setShowResult(false)
    }
  }

  function resetQuiz() {
    setCurrentQ(0)
    setSelected(null)
    setShowResult(false)
    setScore(0)
    setCompleted(false)
  }

  if (completed) {
    const percentage = Math.round((score / PIECE_QUESTIONS.length) * 100)
    const passed = percentage >= 70

    return (
      <Card className="border-blue-200/60 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
        {/* Success header with 3D chess pieces */}
        <div className="relative h-32 bg-gradient-to-r from-green-500 to-blue-500 overflow-hidden">
          <img
            src="/images/chess-quiz-banner.png"
            alt="3D chess pieces - King, Queen, Rook, Bishop, Knight, Pawn"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/85 to-blue-500/85" />
          <div className="relative h-full flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-3xl font-bold mb-2">🏆</div>
              <div className="text-xl font-semibold">Quiz Complete!</div>
              <div className="text-sm opacity-90">Great job learning the pieces!</div>
            </div>
          </div>
        </div>

        <CardContent className="text-center space-y-4 p-6">
          <div className="flex items-center justify-center gap-2">
            {passed ? (
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            ) : (
              <XCircle className="h-6 w-6 text-orange-600" />
            )}
            <div className="text-2xl font-bold text-blue-900">
              {score}/{PIECE_QUESTIONS.length}
            </div>
          </div>
          <div className="text-blue-700">You scored {percentage}%</div>
          <div className={`text-sm ${passed ? "text-green-700" : "text-orange-700"}`}>
            {passed
              ? "🎉 Excellent! You know your chess pieces well! The video will appear below."
              : "Good try! You can watch the video now, or retake the quiz to improve your score."}
          </div>
          <Button
            onClick={resetQuiz}
            variant="outline"
            className="border-blue-300 text-blue-800 hover:bg-blue-50 bg-transparent"
          >
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200/60 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      {/* Quiz header with 3D chess pieces banner */}
      <div className="relative h-24 bg-gradient-to-r from-blue-600 to-blue-500 overflow-hidden">
        <img
          src="/images/chess-quiz-banner.png"
          alt="3D chess pieces for learning - King, Queen, Rook, Bishop, Knight, Pawn"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-500/80" />
        <div className="relative h-full flex items-center justify-between px-6">
          <div className="text-white">
            <div className="text-lg font-semibold">♟️ Chess Pieces Quiz</div>
            <div className="text-sm opacity-90">Learn to identify each piece</div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {currentQ + 1} / {PIECE_QUESTIONS.length}
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-6 p-6">
        <div className="text-center">
          <div className="text-7xl mb-4" role="img" aria-label={`Chess piece: ${question.piece}`}>
            {question.symbol}
          </div>
          <div className="text-lg font-medium text-blue-900">What is the name of this chess piece?</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {question.choices.map((choice) => {
            const isSelected = selected === choice
            const showCorrect = showResult && choice === question.correct
            const showWrong = showResult && isSelected && choice !== question.correct

            return (
              <Button
                key={choice}
                variant={isSelected ? "default" : "outline"}
                className={`
                  h-12 text-base transition-all
                  ${showCorrect ? "bg-green-600 hover:bg-green-700 text-white border-green-600" : ""}
                  ${showWrong ? "bg-red-600 hover:bg-red-700 text-white border-red-600" : ""}
                  ${!showResult && isSelected ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}
                  ${!showResult && !isSelected ? "border-blue-300 text-blue-800 hover:bg-blue-50" : ""}
                `}
                onClick={() => !showResult && setSelected(choice)}
                disabled={showResult}
              >
                {choice}
                {showCorrect && <CheckCircle2 className="ml-2 h-4 w-4" />}
                {showWrong && <XCircle className="ml-2 h-4 w-4" />}
              </Button>
            )
          })}
        </div>

        <div className="flex justify-center">
          {!showResult ? (
            <Button onClick={handleSubmit} disabled={!selected} className="bg-blue-600 hover:bg-blue-700 px-8">
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 px-8">
              {isLastQuestion ? "Finish Quiz" : "Next Question"}
            </Button>
          )}
        </div>

        {showResult && (
          <div className={`text-center text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>
            {isCorrect ? "✅ Correct! Well done!" : `❌ Incorrect. The correct answer is ${question.correct}.`}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
