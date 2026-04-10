'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ShowcaseEvent } from '@/lib/types'

const SPORTS_LIST = ['Soccer', 'Basketball', 'Tennis', 'Natation', 'Athlétisme', 'Autre']

const EMPTY: Omit<ShowcaseEvent, 'id' | 'created_at'> = {
  title: '',
  location: '',
  event_date: '',
  description: '',
  sports: [],
  capacity: null,
  registration_url: '',
  photo_url: '',
  is_published: false,
}

export default function ShowcasePage() {
  const supabase = createClient()
  const [rows, setRows] = useState<ShowcaseEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState<Omit<ShowcaseEvent, 'id' | 'created_at'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('showcase_events')
      .select('*')
      .order('event_date', { ascending: false })
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openAdd() { setForm(EMPTY); setEditId(null); setModal('add') }
  function openEdit(row: ShowcaseEvent) {
    const { id, created_at, ...rest } = row
    setForm(rest); setEditId(id); setModal('edit')
  }

  async function save() {
    setSaving(true)
    if (modal === 'add') {
      await supabase.from('showcase_events').insert(form)
    } else if (editId) {
      await supabase.from('showcase_events').update(form).eq('id', editId)
    }
    setSaving(false); setModal(null); load()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cet événement ?')) return
    await supabase.from('showcase_events').delete().eq('id', id)
    load()
  }

  function toggleSport(sport: string) {
    setForm((f) => ({
      ...f,
      sports: f.sports.includes(sport)
        ? f.sports.filter((s) => s !== sport)
        : [...f.sports, sport],
    }))
  }

  const filtered = rows.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <PageHeader title="Showcase Events" count={rows.length} onAdd={openAdd} search={search} onSearch={setSearch} />

      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <Th>Événement</Th>
                <Th>Date</Th>
                <Th>Lieu</Th>
                <Th>Sports</Th>
                <Th>Statut</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-slate-400">Aucun événement</td></tr>
              )}
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <Td>
                    <span className="font-medium text-slate-800">{row.title}</span>
                  </Td>
                  <Td className="text-slate-500">
                    {row.event_date ? new Date(row.event_date).toLocaleDateString('fr-FR') : '—'}
                  </Td>
                  <Td className="text-slate-500">{row.location}</Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {row.sports.map((s) => <Badge key={s}>{s}</Badge>)}
                    </div>
                  </Td>
                  <Td>
                    {row.is_published
                      ? <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Publié</span>
                      : <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Brouillon</span>}
                  </Td>
                  <Td><RowActions onEdit={() => openEdit(row)} onDelete={() => remove(row.id)} /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          title={modal === 'add' ? 'Ajouter un événement' : 'Modifier l\'événement'}
          onClose={() => setModal(null)}
          onSave={save}
          saving={saving}
        >
          <Field label="Titre *">
            <Input value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="NextMoov Showcase 2025" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date *">
              <input
                type="date"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#000769]/50 transition-colors"
              />
            </Field>
            <Field label="Capacité">
              <input
                type="number"
                value={form.capacity ?? ''}
                onChange={(e) => setForm({ ...form, capacity: e.target.value ? Number(e.target.value) : null })}
                placeholder="150"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-[#000769]/50 transition-colors"
              />
            </Field>
          </div>
          <Field label="Lieu *">
            <Input value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="Paris, France" />
          </Field>
          <Field label="Description">
            <Textarea value={form.description ?? ''} onChange={(v) => setForm({ ...form, description: v })} />
          </Field>
          <Field label="Sports concernés">
            <div className="flex flex-wrap gap-2 mt-1">
              {SPORTS_LIST.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSport(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    form.sports.includes(s)
                      ? 'bg-[#000769] text-white border-[#000769]'
                      : 'border-slate-200 text-slate-500 hover:border-[#000769]/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>
          <Field label="URL d'inscription">
            <Input value={form.registration_url ?? ''} onChange={(v) => setForm({ ...form, registration_url: v })} placeholder="https://…" />
          </Field>
          <Field label="Photo URL">
            <Input value={form.photo_url ?? ''} onChange={(v) => setForm({ ...form, photo_url: v })} placeholder="https://…" />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
              className="w-4 h-4 accent-[#000769]"
            />
            Publier l'événement
          </label>
        </Modal>
      )}
    </>
  )
}

// Primitives
function PageHeader({ title, count, onAdd, search, onSearch }: { title: string; count: number; onAdd: () => void; search: string; onSearch: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-400 mt-0.5">{count} entrée{count !== 1 ? 's' : ''}</p>
      </div>
      <div className="flex items-center gap-3">
        <input type="search" value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Rechercher…" className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#000769]/40 w-52" />
        <button onClick={onAdd} className="bg-[#000769] hover:bg-[#000560] text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <span className="text-lg leading-none">+</span> Ajouter
        </button>
      </div>
    </div>
  )
}
function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{children}</th>
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-3.5 ${className ?? ''}`}>{children}</td>
}
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block bg-[#000769]/10 text-[#000769] text-xs font-medium px-2 py-0.5 rounded-full">{children}</span>
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
