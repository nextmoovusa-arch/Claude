import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
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
  const hasClerkKeys = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY

  return (
    <>
      {hasClerkKeys ? (
        <ClerkProvider>
          <html lang="fr">
            <body>{children}</body>
          </html>
        </ClerkProvider>
      ) : (
        <html lang="fr">
          <body>{children}</body>
        </html>
      )}
    </>
  )
}
