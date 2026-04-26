import InteractiveBoard from "@/components/interactive-board"

export default function PlayPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-blue-900">Play & Practice</h1>
        <p className="text-blue-700 mt-1">Play against the AI or practice on your own board.</p>
      </div>
      <InteractiveBoard />
    </div>
  )
}
