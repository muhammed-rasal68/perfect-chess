import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const POSTS = [
  { slug: "legendary-game-immortal", title: "The Immortal Game: A Lesson in Sacrifices", excerpt: "Explore Anderssen vs. Kieseritzky and learn from its brilliant tactical themes.", date: "2024-02-10" },
  { slug: "improve-calculation", title: "5 Habits to Improve Your Calculation", excerpt: "Practical tips to visualize deeper and avoid blunders.", date: "2024-06-02" },
  { slug: "news-candidates", title: "Candidates Highlights", excerpt: "Key moments and novelties that shaped the tournament.", date: "2024-08-01" },
]

export default function BlogList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {POSTS.map((p) => (
        <Card key={p.slug} className="border-blue-200/60 transition hover:-translate-y-0.5 hover:shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-blue-900">{p.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-blue-800">
            <div className="text-xs text-blue-600">{p.date}</div>
            <p className="mt-2">{p.excerpt}</p>
            <Link href="#" className="mt-3 inline-block text-blue-700 hover:text-blue-900">Read more →</Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
