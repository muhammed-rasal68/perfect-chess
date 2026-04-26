"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Undo2, RotateCcw } from 'lucide-react'
import { Chess } from "chess.js"
import type { Square } from "chess.js"
import { chooseBestMoveGreedy } from "@/utils/chess-ai"

type BoardInstance = any

declare global {
  interface Window {
    $: any
    jQuery: any
    Chessboard: any
  }
}

function loadStylesheet(href: string, key: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`link[data-key="${key}"]`)) return resolve()
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    link.setAttribute("data-key", key)
    link.onload = () => resolve()
    link.onerror = (e) => reject(e)
    document.head.appendChild(link)
  })
}

function loadScript(src: string, key: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[data-key="${key}"]`)) return resolve()
    const script = document.createElement("script")
    script.src = src
    script.async = true
    script.defer = true
    script.setAttribute("data-key", key)
    script.onload = () => resolve()
    script.onerror = (e) => reject(e)
    document.body.appendChild(script)
  })
}

async function ensureChessboardResources() {
  // Load jQuery (required by chessboard.js v1.x)
  if (!window.jQuery) {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js", "jquery-3.7.1")
    // Ensure globals
    // @ts-ignore
    window.$ = window.jQuery
  }
  // Load chessboard.js CSS and JS
  await loadStylesheet("https://cdnjs.cloudflare.com/ajax/libs/chessboard.js/1.0.0/chessboard-1.0.0.min.css", "chessboard-css-1.0.0")
  if (!window.Chessboard) {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/chessboard.js/1.0.0/chessboard-1.0.0.min.js", "chessboard-js-1.0.0")
  }
}

export default function InteractiveBoard() {
  const boardRef = useRef<HTMLDivElement | null>(null)
  const chessRef = useRef(new Chess())
  const boardApiRef = useRef<BoardInstance | null>(null)
  const [vsAI, setVsAI] = useState(true)
  const [orientation, setOrientation] = useState<"white" | "black">("white")
  const [status, setStatus] = useState("White to move")
  const [difficulty, setDifficulty] = useState<"easy"|"normal"|"hard">("normal")
  const [ready, setReady] = useState(false)

  const pieceTheme = useMemo(() => {
    // Use hosted wikipedia set to avoid bundling assets
    return "https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png"
  }, [])

  const updateStatus = useCallback(() => {
    const game = chessRef.current
    let s = ""
    if (game.isCheckmate()) {
      s = `Checkmate! ${game.turn() === "w" ? "Black" : "White"} wins`
    } else if (game.isDraw()) {
      s = "Draw"
    } else {
      s = `${game.turn() === "w" ? "White" : "Black"} to move${game.inCheck() ? " — Check!" : ""}`
    }
    setStatus(s)
  }, [])

  const syncBoardPosition = useCallback(() => {
    const fen = chessRef.current.fen()
    boardApiRef.current?.position(fen, false)
    updateStatus()
  }, [updateStatus])

  const onPlayerMove = useCallback(async () => {
    updateStatus()
    if (!vsAI) return
    const game = chessRef.current
    if (game.game_over()) return

    // AI move (simple greedy with difficulty)
    const aiMove = chooseBestMoveGreedy(game, difficulty)
    if (aiMove) {
      game.move(aiMove)
      syncBoardPosition()
    }
  }, [vsAI, syncBoardPosition, updateStatus, difficulty])

  // Initialize chessboard.js via CDN resources
  useEffect(() => {
    let mounted = true
    async function init() {
      try {
        await ensureChessboardResources()
        if (!mounted) return

        const cfg = {
          position: "start",
          draggable: true,
          orientation,
          pieceTheme,
          onDrop: (source: Square, target: Square) => {
            const game = chessRef.current
            const move = game.move({ from: source, to: target, promotion: "q" })
            if (move == null) return "snapback"
          },
          onSnapEnd: () => {
            onPlayerMove()
          },
        }
        if (boardRef.current) {
          // @ts-ignore
          boardApiRef.current = window.Chessboard(boardRef.current, cfg)
          setReady(true)
        }
      } catch (e) {
        console.error("Failed to init chessboard.js", e)
      }
    }
    init()
    return () => {
      mounted = false
      // chessboard.js doesn't expose a dispose; GC will handle it
    }
  }, [onPlayerMove, orientation, pieceTheme])

  const reset = useCallback(() => {
    chessRef.current.reset()
    boardApiRef.current?.start()
    updateStatus()
  }, [updateStatus])

  const undo = useCallback(() => {
    const game = chessRef.current
    game.undo()
    if (vsAI) game.undo() // undo both sides in vsAI mode
    syncBoardPosition()
  }, [vsAI, syncBoardPosition])

  const flip = useCallback(() => {
    const next = orientation === "white" ? "black" : "white"
    setOrientation(next)
    boardApiRef.current?.orientation(next, true)
  }, [orientation])

  useEffect(() => {
    updateStatus()
  }, [updateStatus])

  return (
    <Card className="border-blue-200/60">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-blue-900">Interactive Chess Board</CardTitle>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={vsAI} onCheckedChange={setVsAI} id="vs-ai" />
            <Label htmlFor="vs-ai" className="text-blue-900">Play vs AI</Label>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-blue-900">Difficulty</Label>
            <Select value={difficulty} onValueChange={(v:any)=>setDifficulty(v)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-6 p-6">
        <div className="mx-auto">
          <div
            ref={boardRef}
            className={cn(
              "rounded-md ring-1 ring-blue-200/70 shadow-sm overflow-hidden",
              ready ? "opacity-100" : "opacity-0"
            )}
            style={{ width: 448, maxWidth: "90vw" }}
            aria-label="Interactive chessboard"
          />
          {!ready && (
            <div className="mt-3 text-center text-sm text-blue-600">Loading board...</div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-md bg-blue-50 p-3 text-blue-800 ring-1 ring-blue-200/70">
            <span className="font-medium">Status: </span>{status}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={reset} className="bg-blue-600 hover:bg-blue-700">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <Button onClick={undo} variant="outline" className="border-blue-300 text-blue-800 hover:bg-blue-50">
              <Undo2 className="mr-2 h-4 w-4" /> Undo
            </Button>
            <Button onClick={flip} variant="outline" className="border-blue-300 text-blue-800 hover:bg-blue-50">
              Flip Board
            </Button>
          </div>
          <div className="text-sm text-blue-700">
            Tip: Drag and drop pieces to move. In AI mode, the computer replies automatically.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
