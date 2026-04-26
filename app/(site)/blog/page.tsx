import BlogList from "@/components/blog-list"

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-2">Blog & Articles</h1>
      <p className="text-blue-700 mb-6">Tips, famous games, and chess news.</p>
      <BlogList />
    </div>
  )
}
