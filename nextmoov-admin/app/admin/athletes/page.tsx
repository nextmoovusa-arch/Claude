'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Athlete } from '@/lib/types'

const SPORTS = ['Soccer', 'Basketball', 'Tennis', 'Natation', 'Athlétisme', 'Autre']

const EMPTY: Omit<Athlete, 'id' | 'created_at'> = {
  name: '',
  sport: 'Soccer',
  position: '',
  school_origin: '',
  university_us: '',
  state_us: '',
  season: '',
  bio: '',
  photo_url: '',
  is_featured: false,
  instagram_url: '',
}

export default function AthletesPage() {
  const supabase = createClient()
  const [rows, setRows] = useState<Athlete[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState<Omit<Athlete, 'id' | 'created_at'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('athletes')
      .select('*')
      .order('created_at', { ascending: false })
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setForm(EMPTY)
    setEditId(null)
    setModal('add')
  }

  function openEdit(row: Athlete) {
    const { id, created_at, ...rest } = row
    setForm(rest)
    setEditId(id)
    setModal('edit')
  }

  async function save() {
    setSaving(true)
    if (modal === 'add') {
      await supabase.from('athletes').insert(form)
    } else if (editId) {
      await supabase.from('athletes').update(form).eq('id', editId)
    }
    setSaving(false)
    setModal(null)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cet athlète ?')) return
    await supabase.from('athletes').delete().eq('id', id)
    load()
  }

  const filtered = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.sport.toLowerCase().includes(search.toLowerCase()) ||
      (r.university_us ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <PageHeader
        title="Athlètes"
        count={rows.length}
        onAdd={openAdd}
        search={search}
        onSearch={setSearch}
      />

      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <Th>Nom</Th>
                <Th>Sport</Th>
                <Th>Université US</Th>
                <Th>Saison</Th>
                <Th>Featured</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    Aucun athlète trouvé
                  </td>
                </tr>
              )}
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar src={row.photo_url} name={row.name} />
                      <span className="font-medium text-slate-800">{row.name}</span>
                    </div>
                  </Td>
                  <Td><Badge>{row.sport}</Badge></Td>
                  <Td className="text-slate-500">{row.university_us || '—'}</Td>
                  <Td className="text-slate-500">{row.season || '—'}</Td>
                  <Td>
                    {row.is_featured ? (
                      <span className="text-[#C0A060] font-semibold text-xs">★ Oui</span>
                    ) : (
                      <span className="text-slate-300 text-xs">Non</span>
                    )}
                  </Td>
                  <Td>
                    <RowActions onEdit={() => openEdit(row)} onDelete={() => remove(row.id)} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          title={modal === 'add' ? 'Ajouter un athlète' : 'Modifier l\'athlète'}
          onClose={() => setModal(null)}
          onSave={save}
          saving={saving}
        >
          <Field label="Nom complet *">
            <Input value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Samuel König" />
          </Field>
          <Field label="Sport *">
            <Select value={form.sport} onChange={(v) => setForm({ ...form, sport: v })} options={SPORTS} />
          </Field>
          <Field label="Poste / Position">
            <Input value={form.position ?? ''} onChange={(v) => setForm({ ...form, position: v })} placeholder="Attaquant" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="École d'origine">
              <Input value={form.school_origin ?? ''} onChange={(v) => setForm({ ...form, school_origin: v })} placeholder="Angers SCO" />
            </Field>
            <Field label="Saison">
              <Input value={form.season ?? ''} onChange={(v) => setForm({ ...form, season: v })} placeholder="2024-25" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Université US">
              <Input value={form.university_us ?? ''} onChange={(v) => setForm({ ...form, university_us: v })} placeholder="NEO CC" />
            </Field>
            <Field label="État US">
              <Input value={form.state_us ?? ''} onChange={(v) => setForm({ ...form, state_us: v })} placeholder="Ohio" />
            </Field>
          </div>
          <Field label="Bio">
            <Textarea value={form.bio ?? ''} onChange={(v) => setForm({ ...form, bio: v })} />
          </Field>
          <Field label="Photo URL">
            <Input value={form.photo_url ?? ''} onChange={(v) => setForm({ ...form, photo_url: v })} placeholder="https://…" />
          </Field>
          <Field label="Instagram URL">
            <Input value={form.instagram_url ?? ''} onChange={(v) => setForm({ ...form, instagram_url: v })} placeholder="https://instagram.com/…" />
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

// ─── Shared UI primitives ─────────────────────────────────────────────────────

function PageHeader({
  title,
  count,
  onAdd,
  search,
  onSearch,
}: {
  title: string
  count: number
  onAdd: () => void
  search: string
  onSearch: (v: string) => void
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-400 mt-0.5">{count} entrée{count !== 1 ? 's' : ''}</p>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Rechercher…"
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#000769]/40 w-52"
        />
        <button
          onClick={onAdd}
          className="bg-[#000769] hover:bg-[#000560] text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <span className="text-lg leading-none">+</span> Ajouter
        </button>
      </div>
    </div>
  )
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
      {children}
    </th>
  )
}

function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3.5 ${className ?? ''}`}>{children}</td>
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-[#000769]/10 text-[#000769] text-xs font-medium px-2 py-0.5 rounded-full">
      {children}
    </span>
  )
}

function Avatar({ src, name }: { src?: string | null; name: string }) {
  return src ? (
    <img src={src} alt={name} className="w-8 h-8 rounded-full object-cover shrink-0" />
  ) : (
    <div className="w-8 h-8 rounded-full bg-[#000769]/10 flex items-center justify-center text-[#000769] text-xs font-bold shrink-0">
      {name.charAt(0).toUpperCase()}
    </div>
  )
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-2 justify-end">
      <button onClick={onEdit} className="text-slate-400 hover:text-[#000769] transition-colors">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
      </button>
      <button onClick={onDelete} className="text-slate-400 hover:text-[#B22234] transition-colors">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /></svg>
      </button>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="w-7 h-7 border-2 border-[#000769]/20 border-t-[#000769] rounded-full animate-spin" />
    </div>
  )
}

function Modal({
  title,
  children,
  onClose,
  onSave,
  saving,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
  onSave: () => void
  saving: boolean
}) {
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
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors">
            Annuler
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="bg-[#000769] hover:bg-[#000560] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors"
          >
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
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#000769]/50 transition-colors"
    />
  )
}

function Textarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#000769]/50 transition-colors resize-none"
    />
  )
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#000769]/50 transition-colors bg-white"
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  )
}
