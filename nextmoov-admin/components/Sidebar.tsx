'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const nav = [
  { label: 'Athlètes', href: '/admin/athletes' },
  { label: 'Témoignages', href: '/admin/testimonials' },
  { label: 'Showcase Events', href: '/admin/showcase' },
  { label: 'Réseaux sociaux', href: '/admin/social' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside className="w-60 min-h-screen bg-[#00020e] flex flex-col border-r border-white/5 shrink-0">
      <div className="px-6 py-6 border-b border-white/5">
        <div className="text-white font-black text-base uppercase" style={{ letterSpacing: '3px' }}>
          NEXT<span style={{ color: '#B22234' }}>MOOV</span>
        </div>
        <div className="text-[10px] mt-0.5" style={{ color: '#C0A060', letterSpacing: '4px' }}>USA · ADMIN</div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active ? 'bg-[#000769] text-white font-medium' : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="px-3 py-4 border-t border-white/5">
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-colors">
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
