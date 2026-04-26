import OpeningsExplorer from "@/components/openings-explorer"

export default function OpeningsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-2">Openings Explorer</h1>
      <p className="text-blue-700 mb-6">Step through popular openings and learn typical plans.</p>
      <OpeningsExplorer />
    </div>
  )
}
