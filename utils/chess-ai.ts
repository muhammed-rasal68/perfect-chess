import { Chess, type Move } from "chess.js"

// Simple material scores
const pieceValues: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
}

function evaluateBoard(chess: Chess) {
  const board = chess.board()
  let score = 0
  for (const row of board) {
    for (const cell of row) {
      if (!cell) continue
      const val = pieceValues[cell.type]
      score += cell.color === "w" ? val : -val
    }
  }
  return score
}

function pickMoveGreedy(chess: Chess, perspective: "w" | "b") {
  const moves = chess.moves({ verbose: true }) as Move[]
  if (moves.length === 0) return null
  let bestMove: Move | null = null
  let bestScore = perspective === "w" ? -Infinity : Infinity
  for (const mv of moves) {
    chess.move(mv)
    const score = evaluateBoard(chess)
    chess.undo()
    if (perspective === "w") {
      if (score > bestScore) { bestScore = score; bestMove = mv }
    } else {
      if (score < bestScore) { bestScore = score; bestMove = mv }
    }
  }
  return bestMove || moves[Math.floor(Math.random() * moves.length)]
}

export function chooseBestMoveGreedy(game: Chess, difficulty: "easy"|"normal"|"hard" = "normal") {
  // difficulty affects randomness and a shallow 2-ply lookahead on "hard"
  const turn = game.turn()
  if (difficulty === "easy") {
    if (Math.random() < 0.5) {
      // 50% random legal move
      const ms = game.moves({ verbose: true }) as Move[]
      return ms[Math.floor(Math.random() * ms.length)]
    }
    return pickMoveGreedy(game, turn)
  }
  if (difficulty === "hard") {
    // Very light 2-ply search (greedy reply)
    const moves = game.moves({ verbose: true }) as Move[]
    let best: Move | null = null
    let bestEval = turn === "w" ? -Infinity : Infinity
    for (const mv of moves) {
      game.move(mv)
      const reply = pickMoveGreedy(game, game.turn())
      if (reply) game.move(reply)
      const score = evaluateBoard(game)
      if (reply) game.undo()
      game.undo()
      if (turn === "w") {
        if (score > bestEval) { bestEval = score; best = mv }
      } else {
        if (score < bestEval) { bestEval = score; best = mv }
      }
    }
    return best || pickMoveGreedy(game, turn)
  }
  // normal
  if (Math.random() < 0.15) {
    const ms = game.moves({ verbose: true }) as Move[]
    return ms[Math.floor(Math.random() * ms.length)]
  }
  return pickMoveGreedy(game, turn)
}
