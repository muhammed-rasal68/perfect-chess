import EndgamePractice from "@/components/endgame-practice"

export default function EndgamesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-2">Endgame Practice</h1>
      <p className="text-blue-700 mb-6">Study core endgames to build strong fundamentals.</p>
      <EndgamePractice />
    </div>
  )
}
