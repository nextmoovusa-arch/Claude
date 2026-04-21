import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Varsity Path — NEXTMOOV USA",
  description: "Plateforme de placement universitaire sportif aux États-Unis",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
