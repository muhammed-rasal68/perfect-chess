'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, GraduationCap, Puzzle, BookOpenText, Crown, User, Newspaper, Sword, Layers } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const NAV = [
  { href: "/", label: "Home", icon: Sword },
  { href: "/courses", label: "Courses", icon: Layers },
  { href: "/puzzles", label: "Puzzles", icon: Puzzle },
  { href: "/openings", label: "Openings", icon: BookOpenText },
  { href: "/endgames", label: "Endgames", icon: Crown },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/blog", label: "Blog", icon: Newspaper },
]

export function SiteNav() {
  const pathname = usePathname()
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
      <Link href="/" className="flex items-center gap-3">
        {/* MUST use the provided Source URL for the logo */}
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PERFECT%20LOGO-xfE2QnYhfG2WbI427UVMA4vSfQcDmR.png"
          alt="Perfect Public School logo"
          width={36}
          height={36}
          className="h-9 w-9 object-contain rounded-sm ring-1 ring-white/20 bg-white/5"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-semibold tracking-tight">Chess Academy</span>
          <span className="text-xs text-blue-100">Learn. Practice. Improve.</span>
        </div>
      </Link>

      <nav className="hidden md:flex items-center gap-1">
        {NAV.map((n) => {
          const Icon = n.icon
          const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href))
          return (
            <Link key={n.href} href={n.href} className="group">
              <Button
                variant="ghost"
                className={cn(
                  "text-white hover:bg-white/10 hover:text-white transition",
                  active && "bg-white/15"
                )}
              >
                <Icon className={cn("mr-2 h-4 w-4", active ? "opacity-100" : "opacity-90 group-hover:opacity-100")} />
                {n.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 p-0">
            <div className="bg-blue-700 text-white px-4 py-3">
              <div className="flex items-center gap-2">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PERFECT%20LOGO-xfE2QnYhfG2WbI427UVMA4vSfQcDmR.png"
                  alt="Perfect Public School logo"
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain rounded bg-white/10"
                />
                <span className="font-semibold">Chess Academy</span>
              </div>
            </div>
            <div className="p-2">
              {NAV.map((n) => {
                const Icon = n.icon
                const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href))
                return (
                  <Link key={n.href} href={n.href} className="block">
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-blue-800 hover:text-blue-900 hover:bg-blue-50",
                        active && "bg-blue-100"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {n.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
