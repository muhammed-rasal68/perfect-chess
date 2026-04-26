"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Chess } from "chess.js"

type Opening = {
  key: string
  name: string
  moves: string[] // SAN sequence
  eco: string
}

const OPENINGS: Opening[] = [
  { key: "italian", name: "Italian Game", eco: "C50", moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5"] },
  { key: "qg", name: "Queen's Gambit", eco: "D06", moves: ["d4", "d5", "c4"] },
  { key: "sic", name: "Sicilian Defense", eco: "B20", moves: ["e4", "c5"] },
  { key: "fr", name: "French Defense", eco: "C00", moves: ["e4", "e6", "d4", "d5"] },
]

export default function OpeningsExplorer() {
  const [sel, setSel] = useState<Opening>(OPENINGS[0])
  const [idx, setIdx] = useState(0)
  const [game, setGame] = useState(new Chess())

  useEffect(() => {
    const g = new Chess()
    setGame(g)
    setIdx(0)
  }, [sel])

  function next() {
    const m = sel.moves[idx]
    if (!m) return
    try {
      game.move(m)
      setGame(new Chess(game.fen()))
      setIdx(idx + 1)
    } catch {}
  }

  function prev() {
    const g = new Chess()
    for (let i = 0; i < Math.max(0, idx - 1); i++) {
      g.move(sel.moves[i])
    }
    setGame(g)
    setIdx(Math.max(0, idx - 1))
  }

  function reset() {
    setGame(new Chess())
    setIdx(0)
  }

  return (
    <Card className="border-blue-200/60">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <CardTitle className="text-blue-900">Openings Explorer</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-800">Opening</span>
          <Select onValueChange={(v:any)=>setSel(OPENINGS.find(o=>o.key===v) || OPENINGS[0])} value={sel.key}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select opening" />
            </SelectTrigger>
            <SelectContent>
              {OPENINGS.map(o => (
                <SelectItem key={o.key} value={o.key}>{o.name} ({o.eco})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800 ring-1 ring-blue-200/70">
          FEN: {game.fen()}
        </div>
        <div className="mt-3 text-sm text-blue-700">
          Line: {sel.moves.slice(0, idx).join(" ")}
          {idx < sel.moves.length ? <span className="opacity-60"> {" " + sel.moves.slice(idx).join(" ")}</span> : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button onClick={prev} variant="outline" className="border-blue-300 text-blue-800 hover:bg-blue-50">Prev</Button>
          <Button onClick={next} className="bg-blue-600 hover:bg-blue-700">Next Move</Button>
          <Button onClick={reset} variant="ghost" className="text-blue-700 hover:bg-blue-50">Reset</Button>
        </div>
      </CardContent>
    </Card>
  )
}
