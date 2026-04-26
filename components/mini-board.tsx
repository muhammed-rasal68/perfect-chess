'use client'

import React from "react"

const WHITE = {
  k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙",
}
const BLACK = {
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
}

function parseFEN(fen: string) {
  const board: ({ p: string; c: 'w'|'b' } | null)[][] = []
  const ranks = fen.split(" ")[0].split("/")
  for (let r = 0; r < 8; r++) {
    const row: ({ p: string; c: 'w'|'b' } | null)[] = []
    for (const ch of ranks[r]) {
      if (/\d/.test(ch)) {
        const n = parseInt(ch, 10)
        for (let i = 0; i < n; i++) row.push(null)
      } else {
        const c = ch === ch.toLowerCase() ? 'b' : 'w'
        row.push({ p: ch.toLowerCase(), c })
      }
    }
    board.push(row)
  }
  return board
}

export function MiniBoard({ fen, size = 240, className }: { fen: string; size?: number; className?: string }) {
  const sq = size / 8
  const board = parseFEN(fen === "start" ? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w - - 0 1" : fen)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label="Chess diagram"
      role="img"
    >
      {[...Array(8)].map((_, r) =>
        [...Array(8)].map((__, c) => {
          const light = (r + c) % 2 === 0
          return (
            <rect
              key={`${r}-${c}`}
              x={c * sq}
              y={r * sq}
              width={sq}
              height={sq}
              fill={light ? "#f0f6ff" : "#8cb4ff"}
            />
          )
        })
      )}
      {board.map((row, r) =>
        row.map((cell, c) => {
          if (!cell) return null
          const isWhite = cell.c === "w"
          const y = r * sq + sq * 0.68
          const x = c * sq + sq * 0.18
          const char = (isWhite ? WHITE : BLACK)[cell.p as keyof typeof WHITE]
          return (
            <text
              key={`p-${r}-${c}`}
              x={x}
              y={y}
              fontSize={sq * 0.8}
              fill={isWhite ? "#ffffff" : "#1f2937"}
              stroke={isWhite ? "#1f2937" : "transparent"}
              strokeWidth={isWhite ? 1 : 0}
            >
              {char}
            </text>
          )
        })
      )}
      {/* Border */}
      <rect x={0} y={0} width={size} height={size} fill="none" stroke="#93c5fd" strokeWidth={2} />
    </svg>
  )
}
