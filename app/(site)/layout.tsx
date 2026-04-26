import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { SiteNav } from "@/components/site-nav"
import { Watermark } from "@/components/watermark"

export const metadata = {
  title: "Perfect Chess - Learn Chess Online",
  description:
    "Master chess with Perfect Chess Academy. Free 44-day training plan, interactive lessons, puzzles, and practice tools for all skill levels.",
  keywords: "chess, learn chess, chess lessons, chess training, chess puzzles, chess academy, chess for beginners",
  author: "Muhammed Rasal",
  robots: "index, follow",
  openGraph: {
    title: "Perfect Chess - Learn Chess Online",
    description:
      "Master chess with Perfect Chess Academy. Free 44-day training plan, interactive lessons, puzzles, and practice tools.",
    type: "website",
    url: "https://your-domain.com",
    images: [
      {
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PERFECT%20LOGO-xfE2QnYhfG2WbI427UVMA4vSfQcDmR.png",
        width: 1200,
        height: 630,
        alt: "Perfect Chess Academy Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfect Chess - Learn Chess Online",
    description:
      "Master chess with Perfect Chess Academy. Free 44-day training plan, interactive lessons, puzzles, and practice tools.",
    images: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PERFECT%20LOGO-xfE2QnYhfG2WbI427UVMA4vSfQcDmR.png",
    ],
  },
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh antialiased">
        <header className={cn("fixed inset-x-0 top-0 z-50 border-b border-blue-200/40", "bg-blue-700 text-white")}>
          <SiteNav />
        </header>

        {/* Transparent "Rasal" watermark across all pages */}
        <Watermark />

        <main className="relative z-20 pt-[72px] bg-white text-blue-900">{children}</main>

        <footer className="relative z-20 border-t bg-blue-50">
          <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-blue-700 flex flex-col md:flex-row items-center justify-between gap-2">
            <p>© {new Date().getFullYear()} Perfect Chess. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="/blog" className="hover:underline">
                Articles
              </a>
              <a href="/profile" className="hover:underline">
                Account
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
