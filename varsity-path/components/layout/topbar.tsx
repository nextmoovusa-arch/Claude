"use client"

import { UserButton } from "@clerk/nextjs"

interface TopbarProps {
  title: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-line bg-paper px-8">
      <div className="flex items-center gap-3">
        {subtitle && (
          <span className="font-mono text-xs uppercase tracking-widest text-stone">
            {subtitle} /
          </span>
        )}
        <span className="font-mono text-xs uppercase tracking-widest text-ink">{title}</span>
      </div>
      <UserButton
        afterSignOutUrl="/sign-in"
        appearance={{
          elements: {
            avatarBox: "h-7 w-7",
          },
        }}
      />
    </div>
  )
}
