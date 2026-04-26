"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Chess } from "chess.js"
import { cn } from "@/lib/utils"

const diagrams = [
  { fen: "start", title: "Starting Position" },
  { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3", title: "Italian Game structure" },
  { fen: "rnbqkbnr/pp1ppppp/8/2p5/3P4/8/PPP1PPPP/RNBQKBNR b KQkq - 0 2", title: "Queen's Gambit" },
]

function Diagram({ fen }: { fen: string }) {
  // Very simple textual diagram placeholder for lightweight rendering in lessons
  // Users can open Play page for full interactive board
  return (
    <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-800 ring-1 ring-blue-200/70">
      FEN: {fen}
    </div>
  )
}

export default function Lessons() {
  const [game] = useState(new Chess())
  return (
    <Tabs defaultValue="beginner" className="w-full">
      <TabsList className="bg-blue-50 text-blue-800">
        <TabsTrigger value="beginner">Beginner</TabsTrigger>
        <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="beginner" className="mt-4 space-y-4">
        <Card className="border-blue-200/60">
          <CardHeader>
            <CardTitle className="text-blue-900">Basics: Rules & Movement</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ul className="list-disc pl-5 space-y-1">
              <li>Understand how each piece moves and captures.</li>
              <li>Learn check, checkmate, stalemate, and basic draws.</li>
              <li>Practice simple mates (e.g., two rooks mate, queen mate).</li>
            </ul>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {diagrams.map((d, idx) => (
                <div key={idx} className={cn("rounded-lg p-3 ring-1 ring-blue-200/60 bg-white")}>
                  <div className="font-medium text-blue-900">{d.title}</div>
                  <div className="mt-2"><Diagram fen={d.fen} /></div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <a href="/play"><Button className="bg-blue-600 hover:bg-blue-700">Practice on Board</Button></a>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="intermediate" className="mt-4 space-y-4">
        <Card className="border-blue-200/60">
          <CardHeader><CardTitle className="text-blue-900">Tactics & Strategy</CardTitle></CardHeader>
          <CardContent className="text-blue-800">
            Topics: pins, forks, skewers, discovered attacks, basic plans in open and closed positions.
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="advanced" className="mt-4 space-y-4">
        <Card className="border-blue-200/60">
          <CardHeader><CardTitle className="text-blue-900">Advanced Concepts</CardTitle></CardHeader>
          <CardContent className="text-blue-800">
            Pawn structures, prophylaxis, exchange sacrifices, endgame technique and zugzwang.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
