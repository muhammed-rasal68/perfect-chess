"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Chess } from "chess.js"

type EG = { key: string; title: string; fen: string; hint: string }

const ENDGAMES: EG[] = [
  { key: "kqk", title: "KQ vs K", fen: "6k1/8/8/8/8/8/8/6KQ w - - 0 1", hint: "Use the 'box' method to push the king to the edge." },
  { key: "krk", title: "KR vs K", fen: "6k1/8/8/8/8/8/8/6KR w - - 0 1", hint: "Cut off files and ranks; avoid stalemate." },
  { key: "kpk", title: "KP vs K", fen: "6k1/8/8/8/4P3/8/8/6K1 w - - 0 1", hint: "Opposition and critical squares matter." },
]

export default function EndgamePractice() {
  const [sel, setSel] = useState<EG>(ENDGAMES[0])
  const [game, setGame] = useState(new Chess(sel.fen))

  useEffect(() => {
    setGame(new Chess(sel.fen))
  }, [sel])

  function reset() {
    setGame(new Chess(sel.fen))
  }

  return (
    <Card className="border-blue-200/60">
      <CardHeader>
        <CardTitle className="text-blue-900">Endgame Practice</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {ENDGAMES.map(e => (
            <Button
              key={e.key}
              onClick={() => setSel(e)}
              variant={sel.key === e.key ? "default" : "outline"}
              className={sel.key === e.key ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-800 hover:bg-blue-50"}
            >
              {e.title}
            </Button>
          ))}
        </div>
        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800 ring-1 ring-blue-200/70">
          FEN: {game.fen()}
        </div>
        <div className="mt-3 text-blue-800">
          Hint: {sel.hint}
        </div>
        <div className="mt-4">
          <Button onClick={reset} variant="ghost" className="text-blue-700 hover:bg-blue-50">Reset Position</Button>
        </div>
      </CardContent>
    </Card>
  )
}
