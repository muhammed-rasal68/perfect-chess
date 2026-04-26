"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Stats = { solved: number; failed: number }
type Profile = { name: string; rating: number }

const PROFILE_KEY = "chess-academy:profile"
const PUZZLE_KEY = "chess-academy:puzzles"

export default function ProfileCard() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState("")
  const [stats, setStats] = useState<Stats>({ solved: 0, failed: 0 })

  useEffect(() => {
    try {
      const p = localStorage.getItem(PROFILE_KEY)
      if (p) setProfile(JSON.parse(p))
      const s = localStorage.getItem(PUZZLE_KEY)
      if (s) setStats(JSON.parse(s))
    } catch {}
  }, [])

  function createOrUpdate() {
    const p: Profile = {
      name: name || "Player",
      rating: profile?.rating ?? 1200,
    }
    setProfile(p)
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)) } catch {}
  }

  function adjustRating(delta: number) {
    if (!profile) return
    const p = { ...profile, rating: Math.max(100, profile.rating + delta) }
    setProfile(p)
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)) } catch {}
  }

  const initials = (profile?.name || name || "P").slice(0, 2).toUpperCase()

  return (
    <Card className="border-blue-200/60">
      <CardHeader>
        <CardTitle className="text-blue-900">Player Profile</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-100 text-blue-800">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-blue-900 font-semibold">{profile?.name || "No profile yet"}</div>
            <div className="text-blue-700 text-sm">Rating: {profile?.rating ?? "—"}</div>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <Label htmlFor="name" className="text-blue-900">Name</Label>
          <Input id="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Your chess name" />
          <div className="flex gap-2">
            <Button onClick={createOrUpdate} className="bg-blue-600 hover:bg-blue-700">Save Profile</Button>
            {profile && (
              <>
                <Button variant="outline" onClick={()=>adjustRating(+10)} className="border-blue-300 text-blue-800 hover:bg-blue-50">+10 Rating</Button>
                <Button variant="outline" onClick={()=>adjustRating(-10)} className="border-blue-300 text-blue-800 hover:bg-blue-50">-10 Rating</Button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-md bg-blue-50 p-3 ring-1 ring-blue-200/70">
          <div className="text-blue-900 font-medium">Puzzle Performance</div>
          <div className="text-blue-800 text-sm mt-1">
            Solved: {stats.solved} · Failed/Shown: {stats.failed}
          </div>
        </div>
        <div className="mt-2 text-xs text-blue-700">
          Complete all lessons in a course and pass quizzes to earn badges on your profile.
        </div>
      </CardContent>
    </Card>
  )
}
