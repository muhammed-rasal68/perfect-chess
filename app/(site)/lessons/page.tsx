import Link from "next/link"

export default function LegacyLessonsRedirect() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-blue-900">Lessons moved to Courses</h1>
      <p className="text-blue-700 mt-2">Browse the Course Catalog to access structured lessons and quizzes.</p>
      <div className="mt-4">
        <Link href="/courses" className="text-blue-700 hover:text-blue-900 underline">Go to Courses →</Link>
      </div>
    </div>
  )
}
