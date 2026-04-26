"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const STORAGE_KEY = "chess-academy:playlist-id"

// Optional curated single-video fallbacks if playlist not set
const FALLBACK_VIDEOS = [
  { id: "OCSbzArwB10", title: "Chess Openings: Principles and Ideas" },
  { id: "SMTz9nI2J_M", title: "Basic Checkmates You Must Know" },
  { id: "U4vE4ZgZ6b4", title: "Top 10 Tactical Patterns" },
]

export default function YouTubePlaylist() {
  const [playlistId, setPlaylistId] = useState("")
  const [value, setValue] = useState("")

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setPlaylistId(saved)
        setValue(saved)
      }
    } catch {}
  }, [])

  function save() {
    setPlaylistId(value.trim())
    try { localStorage.setItem(STORAGE_KEY, value.trim()) } catch {}
  }

  function clearId() {
    setPlaylistId("")
    setValue("")
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  return (
    <Card className="border-blue-200/60">
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-blue-900">YouTube Playlist</CardTitle>
        <div className="flex gap-2 items-center">
          <Label htmlFor="yt-list" className="text-blue-900">Playlist ID</Label>
          <Input
            id="yt-list"
            placeholder="e.g. PLxxxxxxxxxxxxxxxx"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-[240px]"
          />
          <Button onClick={save} className="bg-blue-600 hover:bg-blue-700">Load</Button>
          <Button variant="outline" onClick={clearId} className="border-blue-300 text-blue-800 hover:bg-blue-50">Clear</Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {playlistId ? (
          <div className="space-y-4">
            <div className="relative w-full overflow-hidden rounded-lg ring-1 ring-blue-200/70 shadow-sm aspect-video bg-blue-50">
              <iframe
                title="Chess Playlist"
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlistId)}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <p className="text-sm text-blue-700">
              Tip: Paste the ID from a YouTube playlist URL. For example, in https://www.youtube.com/playlist?list=PL123..., use "PL123...".
            </p>
          </div>
        ) : (
          <div>
            <div className="text-blue-900 font-medium">Featured Videos</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FALLBACK_VIDEOS.map(v => (
                <div key={v.id} className="group overflow-hidden rounded-lg ring-1 ring-blue-200/70 bg-white transition hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="relative aspect-video bg-blue-50">
                    <iframe
                      title={v.title}
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube.com/embed/${v.id}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-3 text-sm text-blue-900">{v.title}</div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-sm text-blue-700">
              Enter a playlist ID above to load a dedicated scrollable playlist player.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
