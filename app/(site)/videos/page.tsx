import YouTubePlaylist from "@/components/youtube-playlist"

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-blue-900 mb-2">Video Lessons</h1>
      <p className="text-blue-700 mb-6">Watch curated chess lessons. Load your own YouTube playlist for continuous learning.</p>
      <YouTubePlaylist />
    </div>
  )
}
