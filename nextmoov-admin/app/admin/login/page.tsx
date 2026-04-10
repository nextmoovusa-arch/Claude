'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    router.push('/admin/athletes')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#00020e]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-block text-white font-black text-2xl tracking-widest uppercase"
            style={{ fontFamily: 'system-ui, sans-serif', letterSpacing: '4px' }}
          >
            NEXT<span style={{ color: '#B22234' }}>MOOV</span>
            <span style={{ color: '#C0A060', fontSize: '0.65em', display: 'block', letterSpacing: '6px', marginTop: '2px' }}>
              USA · ADMIN
            </span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#020b4a] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-white text-lg font-semibold mb-6 text-center">
            Connexion
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-white/50 uppercase tracking-widest mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C0A060]/60 transition-colors"
                placeholder="admin@nextmoov.com"
              />
            </div>

            <div>
              <label className="block text-xs text-white/50 uppercase tracking-widest mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C0A060]/60 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-[#B22234] text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B22234] hover:bg-[#9a1d2c] disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
