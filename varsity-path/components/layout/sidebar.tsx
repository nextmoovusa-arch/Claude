"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  Building2,
  ListTodo,
  Mail,
  BarChart3,
  Calendar,
  Settings,
  FileText,
  Search,
  TrendingUp,
  UserSearch,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GlobalSearch } from "./global-search"

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: BarChart3, exact: true },
  { href: "/admin/athletes", label: "Athlètes", icon: Users },
  { href: "/admin/prospects", label: "Prospects", icon: UserSearch },
  { href: "/admin/universities", label: "Universités", icon: Building2 },
  { href: "/admin/tasks", label: "Tâches", icon: ListTodo },
  { href: "/admin/calendar", label: "Calendrier", icon: Calendar },
  { href: "/admin/campaigns", label: "Campagnes", icon: Mail },
  { href: "/admin/templates", label: "Templates", icon: FileText },
  { href: "/admin/reports", label: "Rapports", icon: TrendingUp },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <GlobalSearch />
      <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-line bg-paper">
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-line px-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="font-anton text-navy text-lg tracking-widest">VARSITY</span>
            <span className="font-anton text-red-flag text-lg tracking-widest">PATH</span>
          </Link>
        </div>

        {/* Search trigger */}
        <div className="px-3 pt-3">
          <button
            onClick={() => {
              // Dispatch a synthetic Ctrl+K to open GlobalSearch
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
              )
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-mono text-stone border border-line rounded bg-white hover:border-graphite hover:text-graphite transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1 text-left text-xs">Rechercher...</span>
            <kbd className="text-xs border border-line rounded px-1.5 py-0.5 bg-paper">⌘K</kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) && item.href !== "/admin"
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-mono uppercase tracking-wider transition-colors",
                  isActive
                    ? "bg-navy text-paper"
                    : "text-graphite hover:bg-cream hover:text-ink"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-line px-5 py-4">
          <p className="font-mono text-xs uppercase tracking-widest text-stone">
            NEXTMOOV USA
          </p>
        </div>
      </aside>
    </>
  )
}
