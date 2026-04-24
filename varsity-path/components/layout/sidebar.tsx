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
  TrendingUp,
  UserSearch,
  ChevronDown,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { GlobalSearch } from "./global-search"

type NavChild = { href: string; label: string }

type NavItem =
  | { type: "link"; href: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean }
  | { type: "group"; label: string; icon: React.ComponentType<{ className?: string }>; children: NavChild[] }

const NAV: NavItem[] = [
  { type: "link",  href: "/admin",              label: "Analyse",        icon: BarChart3, exact: true },
  { type: "group", label: "Athlètes",           icon: Users,
    children: [
      { href: "/admin/athletes",  label: "Tous les athlètes" },
      { href: "/admin/prospects", label: "Prospects" },
    ],
  },
  { type: "link",  href: "/admin/universities", label: "Universités",    icon: Building2 },
  { type: "group", label: "Gestion",            icon: ListTodo,
    children: [
      { href: "/admin/tasks",    label: "Tâches" },
      { href: "/admin/calendar", label: "Calendrier" },
    ],
  },
  { type: "group", label: "Communication",      icon: Mail,
    children: [
      { href: "/admin/campaigns",  label: "Campagnes" },
      { href: "/admin/templates",  label: "Templates" },
    ],
  },
  { type: "link",  href: "/admin/reports",   label: "Rapports",    icon: TrendingUp },
  { type: "link",  href: "/admin/settings",  label: "Paramètres",  icon: Settings },
]

function isGroupActive(children: NavChild[], pathname: string) {
  return children.some((c) => pathname.startsWith(c.href))
}

export function Sidebar() {
  const pathname = usePathname()

  // Groups open by default if any child is active
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    NAV.forEach((item) => {
      if (item.type === "group") {
        init[item.label] = isGroupActive(item.children, pathname)
      }
    })
    return init
  })

  const toggle = (label: string) =>
    setOpen((prev) => ({ ...prev, [label]: !prev[label] }))

  return (
    <>
      <GlobalSearch />
      <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-white border-r border-line">

        {/* Logo */}
        <div className="flex h-14 items-center px-4 border-b border-line">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">NM</span>
            </div>
            <span className="font-semibold text-ink text-sm">NEXTMOOV</span>
          </Link>
        </div>

        {/* Search */}
        <div className="px-3 pt-3">
          <button
            onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }))}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-stone border border-line rounded-md bg-paper hover:bg-mist transition-colors"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 text-left">Rechercher...</span>
            <kbd className="text-[10px] border border-line rounded px-1 py-0.5 bg-white font-mono">⌘K</kbd>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {NAV.map((item) => {
            if (item.type === "link") {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "text-primary font-medium bg-primary-50"
                      : "text-graphite hover:bg-paper hover:text-ink"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-stone")} />
                  {item.label}
                </Link>
              )
            }

            // group
            const Icon = item.icon
            const groupActive = isGroupActive(item.children, pathname)
            const isOpen = open[item.label]
            return (
              <div key={item.label}>
                <button
                  onClick={() => toggle(item.label)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                    groupActive
                      ? "text-primary font-medium"
                      : "text-graphite hover:bg-paper hover:text-ink"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", groupActive ? "text-primary" : "text-stone")} />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown className={cn("h-3.5 w-3.5 text-stone transition-transform", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                  <div className="mt-0.5 ml-4 pl-3 border-l border-line space-y-0.5">
                    {item.children.map((child) => {
                      const childActive = pathname.startsWith(child.href)
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            "block px-2 py-1.5 rounded-md text-sm transition-colors",
                            childActive
                              ? "text-primary font-medium bg-primary-50"
                              : "text-stone hover:bg-paper hover:text-graphite"
                          )}
                        >
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-line px-4 py-3 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-ink truncate">Agent</p>
            <p className="text-[11px] text-stone truncate">NEXTMOOV USA</p>
          </div>
        </div>
      </aside>
    </>
  )
}
