'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Sidebar from '@/components/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setAuthed(true)
        if (pathname === '/admin/login') {
          router.replace('/admin/athletes')
        }
      } else {
        setAuthed(false)
        if (pathname !== '/admin/login') {
          router.replace('/admin/login')
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [pathname])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (authed === null || authed === false) {
    return (
      <div className="min-h-screen bg-[#00020e] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
