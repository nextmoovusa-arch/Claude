'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { SocialPost } from '@/lib/types'

const PLATFORMS: SocialPost['platform'][] = ['instagram', 'tiktok', 'youtube', 'twitter']

const PLATFORM_COLORS: Record<SocialPost['platform'], string> = {
  instagram: 'bg-pink-50 text-pink-600',
  tiktok: 'bg-slate-100 text-slate-700',
  youtube: 'bg-red-50 text-red-600',
  twitter: 'bg-sky-50 text-sky-600',
}

const EMPTY: Omit<SocialPost, 'id' | 'created_at'> = {
  platform: 'instagram',
  post_url: '',
  caption: '',
  thumbnail_url: '',
  is_featured: false,
  published_at: '',
}

export default function SocialPage() {
  const supabase = createClient()
  const [rows, setRows] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState<Omit<SocialPost, 'id' | 'created_at'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<SocialPost['platform'] | 'all'>('all')

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('social_posts')
      .select('*')
      .order('created_at', { ascending: false })
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() { setForm(EMPTY); setEditId(null); setModal('add') }
  function openEdit(row: SocialPost) {
    const { id, created_at, ...rest } = row
    setForm(rest); setEditId(id); setModal('edit')
  }

  async function save() {
    setSaving(true)
    const payload = { ...form, published_at: form.published_at || null }
    if (modal === 'add') {
      await supabase.from('social_posts').insert(payload)
    } else if (editId) {
      await supabase.from('social_posts').update(payload).eq('id', editId)
    }
    setSaving(false); setModal(null); load()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer ce post ?')) return
    await supabase.from('social_posts').delete().eq('id', id)
    load()
  }

  const filtered = filter === 'all' ? rows : rows.filter((r) => r.platform === filter)

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Réseaux sociaux</h1>
          <p className="text-sm text-slate-400 mt-0.5">{rows.length} post{rows.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-medium">
            <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>Tous</FilterBtn>
            {PLATFORMS.map((p) => (
              <FilterBtn key={p} active={filter === p} onClick={() => setFilter(p)}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </FilterBtn>
            ))}
          </div>
          <button onClick={openAdd} className="bg-[#000769] hover:bg-[#000560] text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <span className="text-lg leading-none">+</span> Ajouter
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-400">Aucun post</div>
          )}
          {filtered.map((row) => (
            <div key={row.id} className="bg-white rounded-2xl shadow-sm overflow-hidden group">
              {/* Thumbnail */}
              <div className="aspect-square bg-slate-100 relative overflow-hidden">
                {row.thumbnail_url ? (
                  <img src={row.thumbnail_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-slate-200">
                    {row.platform === 'instagram' ? '📸' : row.platform === 'tiktok' ? '🎵' : row.platform === 'youtube' ? '▶' : '✕'}
                  </div>
                )}
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button onClick={() => openEdit(row)} className="bg-white/90 hover:bg-white text-slate-800 p-2 rounded-full transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                  <button onClick={() => remove(row.id)} className="bg-white/90 hover:bg-white text-[#B22234] p-2 rounded-full transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>
                  </button>
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PLATFORM_COLORS[row.platform]}`}>
                    {row.platform}
                  </span>
                  {row.is_featured && (
                    <span className="text-[#C0A060] text-xs font-semibold">★ Featured</span>
                  )}
                </div>
                {row.caption && (
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{row.caption}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={modal === 'add' ? 'Ajouter un post' : 'Modifier le post'}
          onClose={() => setModal(null)}
          onSave={save}
          saving={saving}
        >
          <Field label="Plateforme *">
            <div className="flex gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, platform: p })}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize ${
                    form.platform === p
                      ? 'bg-[#000769] text-white border-[#000769]'
                      : 'border-slate-200 text-slate-500 hover:border-[#000769]/40'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>
          <Field label="URL du post *">
            <Input value={form.post_url} onChange={(v) => setForm({ ...form, post_url: v })} placeholder="https://instagram.com/p/…" />
          </Field>
          <Field label="Caption / Description">
            <Textarea value={form.caption ?? ''} onChange={(v) => setForm({ ...form, caption: v })} />
          </Field>
          <Field label="URL miniature">
            <Input value={form.thumbnail_url ?? ''} onChange={(v) => setForm({ ...form, thumbnail_url: v })} placeholder="https://…" />
          </Field>
          <Field label="Date de publication">
            <input
              type="datetime-local"
              value={form.published_at ?? ''}
              onChange={(e) => setForm({ ...form, published_at: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#000769]/50 transition-colors"
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              className="w-4 h-4 accent-[#000769]"
            />
            Mettre en avant (featured)
          </label>
        </Modal>
      )}
    </>
  )
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 transition-colors ${active ? 'bg-[#000769] text-white' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
    >
      {children}
    </button>
  )
}

// Primitives
function Spinner() {
  return <div className="flex justify-center py-20"><div className="w-7 h-7 border-2 border-[#000769]/20 border-t-[#000769] rounded-full animate-spin" /></div>
}
function Modal({ title, children, onClose, onSave, saving }: { title: string; children: React.ReactNode; onClose: () => void; onSave: () => void; saving: boolean }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">{children}</div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors">Annuler</button>
          <button onClick={onSave} disabled={saving} className="bg-[#000769] hover:bg-[#000560] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  )
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
      {children}
    </div>
  )
}
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#000769]/50 transition-colors" />
}
function Textarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#000769]/50 transition-colors resize-none" />
}
