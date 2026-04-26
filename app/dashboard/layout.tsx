import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Perfect Chess - Dashboard",
  description: "44-Day Chess Training Plan Dashboard",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
