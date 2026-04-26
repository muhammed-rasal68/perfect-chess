"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { WatermarkFixedBR } from "@/components/watermark-fixed"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

type DayPlan = {
  day: number
  title: string
  description: string
  playlistIndex?: number
}

const LS_SOURCE = "chess-academy:yt-source" // playlist ID (PL...), single video ID, or a search phrase
const LS_VIDEOS = "chess-academy:yt-videos" // newline/comma separated list of video IDs or URLs

function extractVideoId(s: string): string | null {
  const trimmed = s.trim()
  if (!trimmed) return null
  try {
    if (trimmed.startsWith("http")) {
      const u = new URL(trimmed)
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.replace("/", "")
        return id || null
      }
      if (u.searchParams.get("v")) {
        return u.searchParams.get("v")
      }
      const parts = u.pathname.split("/")
      const idx = parts.indexOf("embed")
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1]
    }
  } catch {}
  return trimmed
}

function parseVideoIds(input: string): string[] {
  const parts = input
    .split(/[\n,;]/g)
    .map((s) => extractVideoId(s) || "")
    .filter(Boolean)
  const seen = new Set<string>()
  const out: string[] = []
  for (const id of parts) {
    if (!seen.has(id)) {
      seen.add(id)
      out.push(id)
    }
  }
  return out.slice(0, 44)
}

export default function Home() {
  // Build 44-day plan (first few named; rest auto-filled)
  const PRESET: Record<number, Partial<DayPlan>> = {
    1: { title: "Day 1 — Getting Started", description: "Board setup, movement, basic rules.", playlistIndex: 1 },
    2: {
      title: "Day 2 — Opening Principles",
      description: "Develop pieces, control center, king safety.",
      playlistIndex: 2,
    },
    3: { title: "Day 3 — Tactics Essentials", description: "Pins, forks, skewers, and patterns.", playlistIndex: 3 },
    4: { title: "Day 4 — Checkmates", description: "Mate patterns and mating nets.", playlistIndex: 4 },
    5: { title: "Day 5 — Strategy Basics", description: "Plans, piece activity, and prophylaxis.", playlistIndex: 5 },
  }

  const days = useMemo<DayPlan[]>(
    () =>
      Array.from({ length: 44 }, (_, i) => {
        const n = i + 1
        const p = PRESET[n] || {}
        return {
          day: n,
          title: p.title ?? `Day ${n} — Study Session ${n}`,
          description: p.description ?? "Continued practice and review to build skill.",
          playlistIndex: typeof p.playlistIndex === "number" ? p.playlistIndex : n,
        }
      }),
    [],
  )

  const [selectedDay, setSelectedDay] = useState<DayPlan>(days[0])

  // Inputs
  const [srcValue, setSrcValue] = useState<string>("") // playlist ID, single video ID, or a search phrase
  const [videosValue, setVideosValue] = useState<string>("") // per-day video list

  // Committed sources
  const [source, setSource] = useState<string>("")
  const [videoIds, setVideoIds] = useState<string[]>([])

  // Initialize from query/localStorage; default to your provided playlist title as a search
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const fromList = params.get("list") // playlist ID
    const fromVideo = params.get("v") // single video ID
    const savedSource = localStorage.getItem(LS_SOURCE) || ""
    const savedVideos = localStorage.getItem(LS_VIDEOS) || ""
    const defaultQuery = "30-day Chess Training Plan - YouTube" // your provided playlist name
    const initialSrc = fromList || fromVideo || savedSource || defaultQuery
    const initialVideos = savedVideos

    setSrcValue(initialSrc)
    setVideosValue(initialVideos)
    setSource(initialSrc)
    setVideoIds(parseVideoIds(initialVideos))
  }, [])

  function savePlaylistOrVideo() {
    const val = srcValue.trim()
    setSource(val)
    try {
      localStorage.setItem(LS_SOURCE, val)
    } catch {}
    requestAnimationFrame(() =>
      document.getElementById("playlist")?.scrollIntoView({ behavior: "smooth", block: "start" }),
    )
  }

  function saveVideosList() {
    const list = parseVideoIds(videosValue)
    setVideoIds(list)
    try {
      localStorage.setItem(LS_VIDEOS, videosValue)
    } catch {}
    requestAnimationFrame(() =>
      document.getElementById("playlist")?.scrollIntoView({ behavior: "smooth", block: "start" }),
    )
  }

  function useDemo() {
    const demo = "OCSbzArwB10" // public chess video
    setSrcValue(demo)
    setSource(demo)
    setVideosValue("")
    setVideoIds([])
    try {
      localStorage.setItem(LS_SOURCE, demo)
    } catch {}
    try {
      localStorage.removeItem(LS_VIDEOS)
    } catch {}
    requestAnimationFrame(() =>
      document.getElementById("playlist")?.scrollIntoView({ behavior: "smooth", block: "start" }),
    )
  }

  const isPlaylistId = useMemo(() => /^PL[A-Za-z0-9_-]+/.test(source), [source])
  const isSearchPhrase = useMemo(() => !isPlaylistId && !!source && /\s/.test(source), [isPlaylistId, source])

  // Decide which URL to embed for the current day:
  // - If per-day video IDs provided, Day N -> that video.
  // - Else if playlist ID provided (PL...), embed playlist with index (0-based).
  // - Else if a phrase is provided, embed a "search playlist" and jump by index.
  // - Else single video ID or demo.
  const iframeSrc = useMemo(() => {
    const zeroBased = Math.max(0, (selectedDay.playlistIndex ?? 1) - 1)
    if (videoIds.length > 0) {
      const id = videoIds[selectedDay.day - 1] || videoIds[0]
      return `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0`
    }
    if (isPlaylistId) {
      const base = `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(source)}`
      return `${base}&index=${zeroBased}`
    }
    if (isSearchPhrase) {
      const base = `https://www.youtube.com/embed/videoseries?listType=search&list=${encodeURIComponent(source)}`
      return `${base}&index=${zeroBased}`
    }
    const id = source || "OCSbzArwB10"
    return `https://www.youtube.com/embed/${encodeURIComponent(id)}?rel=0`
  }, [videoIds, selectedDay, isPlaylistId, isSearchPhrase, source])

  function goToVideo() {
    document.getElementById("playlist")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function selectDayByNumber(n: number) {
    const d = days.find((x) => x.day === n) ?? days[0]
    setSelectedDay(d)
    goToVideo()
  }

  return (
    <main className="relative min-h-screen bg-white text-blue-900">
      {/* Faint watermark fixed to bottom-right */}
      <WatermarkFixedBR />

      {/* SEO Content for Search Engines */}
      <div className="sr-only">
        <h1>Perfect Chess Academy - Learn Chess Online</h1>
        <p>
          Master chess with our comprehensive 44-day training program. Learn chess fundamentals, tactics, strategy,
          openings, and endgames. Perfect for beginners and intermediate players.
        </p>
        <p>
          Features: Interactive chess board, daily lessons, puzzle trainer, opening explorer, endgame practice, progress
          tracking, and video tutorials.
        </p>
        <p>
          Created by Muhammed Rasal, a 7th-grade student at Perfect Public School. Completely free chess education for
          everyone.
        </p>
      </div>

      {/* Centered, larger logo header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-transparent">
        <div className="mx-auto max-w-5xl px-4 py-10 flex items-center justify-center">
          {/* Use the provided Source URL exactly */}
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PERFECT%20LOGO-xfE2QnYhfG2WbI427UVMA4vSfQcDmR.png"
            alt="Perfect Public School logo - Perfect Chess Academy"
            width={192}
            height={192}
            className="h-40 w-40 md:h-56 md:w-56 object-contain"
          />
        </div>
      </header>

      {/* Attractive hero with paragraph and CTA */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-blue-100/70 p-8 md:p-10 shadow-sm">
            {/* Decorative glow accents */}
            <span
              className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-blue-300/30 blur-3xl"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute -bottom-10 -right-8 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl"
              aria-hidden="true"
            />

            {/* Title */}
            <h1 className="text-center text-2xl md:text-3xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-blue-600">
              Welcome to Perfect Chess Academy
            </h1>

            {/* Paragraph */}
            <p className="mt-4 text-center text-blue-800 text-base md:text-lg leading-relaxed">
              Hey! I'm <strong className="font-semibold">Muhammed Rasal</strong>, a 7th‑grade student at{" "}
              <strong className="font-semibold">Perfect Public School</strong>. I am the founder of this website, and
              I'm happy to say it's completely free for anyone to use. I've always enjoyed chess, and combining it with
              coding helped me create something useful for others. I hope it inspires you to enjoy chess as much as I
              do.
            </p>

            {/* Divider */}
            <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />

            {/* CTA */}
            <div className="mt-6 flex justify-center">
              <Link href="/dashboard" className="inline-flex">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-base rounded-xl shadow-sm hover:shadow transition">
                  Start Your Chess Journey
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Additional SEO Content */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">Learn Chess the Right Way</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-blue-900 mb-2">44-Day Training Plan</h3>
              <p className="text-blue-700">Structured daily lessons to take you from beginner to intermediate level</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Interactive Practice</h3>
              <p className="text-blue-700">Play against AI, solve puzzles, and practice with real chess positions</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Completely Free</h3>
              <p className="text-blue-700">No subscriptions, no hidden fees. Quality chess education for everyone</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
