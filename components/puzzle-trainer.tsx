"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Chess } from "chess.js"
import InteractiveBoard from "./interactive-board"

type Puzzle = {
  id: string
  fen: string
  toMove: "w"|"b"
  solution: string[] // SAN sequence
  difficulty: "easy"|"medium"|"hard"
  title: string
}

const PUZZLES: Puzzle[] = [
  {
    id: "p1",
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3",
    toMove: "w",
    solution: ["Bxf7+", "Kxf7", "Nxe5+"],
    difficulty: "easy",
    title: "Tactical Shot in the Italian",
  },
  {
    id: "p2",
    fen: "rnbqkb1r/pppp1ppp/5n2/4p3/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4",
    toMove: "w",
    solution: ["dxe5", "Ng8", "Nf3"],
    difficulty: "medium",
    title: "Punish e5 with d4",
  },
  {
    id: "p3",
    fen: "r3k2r/pp3ppp/2n5/2pp4/8/2P2N2/PP1P1PPP/R1B1K2R w KQkq - 0 1",
    toMove: "w",
    solution: ["O-O", "Be2", "d4"],
    difficulty: "hard",
    title: "Castle then strike center",
  },
]

function getDailyPuzzle(): Puzzle {
  const idx = new Date().getDate() % PUZZLES.length
  return PUZZLES[idx]
}

export default function PuzzleTrainer() {
  const [puzzle, setPuzzle] = useState<Puzzle>(() => getDailyPuzzle())
  const [game, setGame] = useState(() => new Chess(puzzle.fen))
  const [progress, setProgress] = useState(0) // index into solution
  const [message, setMessage] = useState<string>("Your move")
  const [solved, setSolved] = useState(false)

  useEffect(() => {
    setGame(new Chess(puzzle.fen))
    setProgress(0)
    setMessage("Your move")
    setSolved(false)
  }, [puzzle])

  // Capture board moves by hijacking window events from InteractiveBoard? Instead, provide a light inline board or instructions to use Play page.
  // For MVP, we simulate the puzzle stepper via "Make Next Move" buttons.
  const nextSAN = puzzle.solution[progress]
  const canMove = !solved && !!nextSAN

  function makeCorrectMove() {
    if (!canMove) return
    try {
      game.move(nextSAN)
      setGame(new Chess(game.fen()))
      if (progress + 1 >= puzzle.solution.length) {
        setSolved(true)
        setMessage("Solved! Great job")
        persistResult(true)
      } else {
        setProgress((p) => p + 1)
        setMessage("Good! Continue…")
      }
    } catch {
      setMessage("That sequence doesn't apply from this position.")
    }
  }

  function showSolution() {
    let g = new Chess(puzzle.fen)
    for (const san of puzzle.solution) g.move(san)
    setGame(g)
    setSolved(true)
    setMessage("Solution shown")
    persistResult(false)
  }

  function persistResult(success: boolean) {
    try {
      const key = "chess-academy:puzzles"
      const raw = localStorage.getItem(key)
      const data = raw ? JSON.parse(raw) : { solved: 0, failed: 0 }
      if (success) data.solved += 1
      else data.failed += 1
      localStorage.setItem(key, JSON.stringify(data))
    } catch {}
  }

  return (
    <Card className="border-blue-200/60">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <CardTitle className="text-blue-900">Daily Puzzle</CardTitle>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">{puzzle.difficulty.toUpperCase()}</Badge>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-blue-900 font-medium">{puzzle.title}</div>
        <div className="mt-1 text-sm text-blue-700">Side to move: {puzzle.toMove === "w" ? "White" : "Black"}</div>
        <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800 ring-1 ring-blue-200/70">
          FEN: {game.fen()}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={makeCorrectMove} disabled={!canMove} className="bg-blue-600 hover:bg-blue-700">
            Make next best move
          </Button>
          <Button variant="outline" onClick={showSolution} className="border-blue-300 text-blue-800 hover:bg-blue-50">
            Show full solution
          </Button>
        </div>
        <div className="mt-3 text-blue-800">{message}</div>
      </CardContent>
    </Card>
  )
}
