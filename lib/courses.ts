export type Lesson = {
  slug: string
  title: string
  content: {
    paragraphs: string[]
    diagrams: { fen: string; caption?: string }[]
  }
  quiz: {
    questions: {
      id: string
      prompt: string
      choices: { id: string; text: string }[]
      answerId: string
      explanation?: string
    }[]
  }
}

export type Course = {
  slug: string
  title: string
  level: "Beginner" | "Intermediate" | "Advanced"
  description: string
  playlistId?: string
  lessons: Lesson[]
}

export const COURSES: Course[] = [
  {
    slug: "beginner",
    title: "Beginner Fundamentals",
    level: "Beginner",
    description: "Learn the rules, basic mates, and essential tactics to start playing confidently.",
    playlistId: "PLx0sYbCqOb8QCLZC2t6JH6k6j8W", // example placeholder; replace with your own
    lessons: [
      {
        slug: "rules-and-movement",
        title: "Rules and Piece Movement",
        content: {
          paragraphs: [
            "Chess is played on an 8x8 board. Each piece has unique movement patterns.",
            "Focus on controlling the center and developing pieces toward active squares."
          ],
          diagrams: [
            { fen: "start", caption: "The starting position." }
          ]
        },
        quiz: {
          questions: [
            {
              id: "q1",
              prompt: "Which piece moves in an L-shape?",
              choices: [
                { id: "a", text: "Bishop" },
                { id: "b", text: "Knight" },
                { id: "c", text: "Rook" },
              ],
              answerId: "b",
              explanation: "Knights move in an L-shape and can jump over pieces."
            }
          ]
        }
      },
      {
        slug: "basic-checkmates",
        title: "Basic Checkmates",
        content: {
          paragraphs: [
            "Learn the two-rook mate and queen mate techniques.",
            "Use your king to help restrict the opponent's king."
          ],
          diagrams: [
            { fen: "6k1/8/8/8/8/8/8/6KQ w - - 0 1", caption: "KQ vs K: Box the king and deliver mate." }
          ]
        },
        quiz: {
          questions: [
            {
              id: "q2",
              prompt: "In KQ vs K, what's a key technique?",
              choices: [
                { id: "a", text: "Keep checking randomly" },
                { id: "b", text: "Create a mating net and reduce space (box method)" },
                { id: "c", text: "Trade queens" },
              ],
              answerId: "b",
              explanation: "Shrinking the 'box' drives the king to the edge."
            }
          ]
        }
      },
    ]
  },
  {
    slug: "intermediate",
    title: "Intermediate Strategy and Tactics",
    level: "Intermediate",
    description: "Develop tactical awareness and strategic planning.",
    playlistId: "PLyTjQvQOGo3IntExample", // replace with your own
    lessons: [
      {
        slug: "pins-and-forks",
        title: "Pins and Forks",
        content: {
          paragraphs: [
            "Pins restrict piece mobility; forks attack two or more targets.",
            "Combine threats to gain material."
          ],
          diagrams: [
            { fen: "rnbqkb1r/pppp1ppp/5n2/4p3/3PP3/2N5/PPP2PPP/R1BQKBNR w KQkq - 2 4", caption: "Theme: central tension and piece activity." }
          ]
        },
        quiz: {
          questions: [
            {
              id: "q3",
              prompt: "A fork is best described as:",
              choices: [
                { id: "a", text: "A discovered attack" },
                { id: "b", text: "A double attack by one piece" },
                { id: "c", text: "An exchange sacrifice" },
              ],
              answerId: "b",
            }
          ]
        }
      }
    ]
  },
  {
    slug: "advanced",
    title: "Advanced Concepts",
    level: "Advanced",
    description: "Master planning, pawn structures, and endgame technique.",
    playlistId: "PLadvExampleAdvanced", // replace with your own
    lessons: [
      {
        slug: "pawn-structures",
        title: "Pawn Structures and Plans",
        content: {
          paragraphs: [
            "Identify pawn majorities and weaknesses.",
            "Choose plans that improve piece activity around the structure."
          ],
          diagrams: [
            { fen: "r3k2r/pp3ppp/2n5/2pp4/8/2P2N2/PP1P1PPP/R1B1K2R w KQkq - 0 1", caption: "Flexible center: coordinate improvements before breaks." }
          ]
        },
        quiz: {
          questions: [
            {
              id: "q4",
              prompt: "Which is often a reliable plan in static structures?",
              choices: [
                { id: "a", text: "Random pawn moves" },
                { id: "b", text: "Improving worst-placed piece" },
                { id: "c", text: "Premature attacks" },
              ],
              answerId: "b",
            }
          ]
        }
      }
    ]
  }
]
