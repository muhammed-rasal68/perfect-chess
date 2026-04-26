"use client"

import { useEffect, useRef, useState } from "react"
import { updateWatchTime, markVideoWatched } from "@/utils/video-progress"

interface VideoPlayerProps {
  day: number
  playlistId: string
  onVideoComplete?: () => void
}

export function VideoPlayer({ day, playlistId, onVideoComplete }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [watchTime, setWatchTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isTracking, setIsTracking] = useState(false)

  const iframeSrc = `https://www.youtube.com/embed?listType=playlist&list=${encodeURIComponent(playlistId)}&index=${day}&rel=0&modestbranding=1&enablejsapi=1`

  // Track video progress with intervals
  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      // Simulate video progress tracking
      // In a real implementation, you'd use YouTube API
      setWatchTime((prev) => {
        const newTime = prev + 1
        if (duration > 0) {
          updateWatchTime(day, newTime, duration)

          // Mark as complete when 80% watched
          if (newTime / duration >= 0.8) {
            markVideoWatched(day, newTime, duration)
            onVideoComplete?.()
            setIsTracking(false)
          }
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isTracking, day, duration, onVideoComplete])

  // Start tracking when iframe loads
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => {
      setIsTracking(true)
      setDuration(300) // Assume 5 minutes average video length
      setWatchTime(0)
    }

    iframe.addEventListener("load", handleLoad)
    return () => iframe.removeEventListener("load", handleLoad)
  }, [])

  return (
    <div className="relative">
      <iframe
        ref={iframeRef}
        key={`video-${day}`}
        title={`Training — Day ${day}`}
        className="absolute inset-0 h-full w-full"
        src={iframeSrc}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />

      {/* Progress indicator */}
      {isTracking && duration > 0 && (
        <div className="absolute bottom-2 left-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Progress: {Math.round((watchTime / duration) * 100)}%{watchTime / duration >= 0.8 && " ✓ Complete!"}
        </div>
      )}
    </div>
  )
}
