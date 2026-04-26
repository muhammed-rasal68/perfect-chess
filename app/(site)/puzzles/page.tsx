import PuzzleTrainer from "@/components/puzzle-trainer"

export default function PuzzlesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-2">Puzzles & Tactics Trainer</h1>
      <p className="text-blue-700 mb-6">Solve daily puzzles to sharpen your tactical vision.</p>
      <PuzzleTrainer />
    </div>
  )
}
