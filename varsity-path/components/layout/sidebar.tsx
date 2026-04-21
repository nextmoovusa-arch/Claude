"use client"

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
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: BarChart3, exact: true },
  { href: "/admin/athletes", label: "Athlètes", icon: Users },
  { href: "/admin/universities", label: "Universités", icon: Building2 },
  { href: "/admin/tasks", label: "Tâches", icon: ListTodo },
  { href: "/admin/calendar", label: "Calendrier", icon: Calendar },
  { href: "/admin/campaigns", label: "Campagnes", icon: Mail },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-line bg-paper">
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-line px-5">
        <Link href="/admin" className="flex items-center gap-2.5">
          <span className="font-anton text-navy text-lg tracking-widest">VARSITY</span>
          <span className="font-anton text-red-flag text-lg tracking-widest">PATH</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
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
  )
}
