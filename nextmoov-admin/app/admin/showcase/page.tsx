'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ShowcaseEvent } from '@/lib/types'

const SPORTS_LIST = ['Soccer', 'Basketball', 'Tennis', 'Natation', 'Athlétisme', 'Autre']
const EMPTY: Omit<ShowcaseEvent, 'id' | 'created_at'> = { title: '', location: '', event_date: '', description: '', sports: [], capacity: null, registration_url: '', photo_url: '', is_published: false }

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
    const { data } = await supabase.from('showcase_events').select('*').order('event_date', { ascending: false })
    setRows(data ?? []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    if (modal === 'add') await supabase.from('showcase_events').insert(form)
    else if (editId) await supabase.from('showcase_events').update(form).eq('id', editId)
    setSaving(false); setModal(null); load()
  }
  async function remove(id: string) {
    if (!confirm('Supprimer cet événement ?')) return
    await supabase.from('showcase_events').delete().eq('id', id); load()
  }
  function toggleSport(sport: string) {
    setForm(f => ({ ...f, sports: f.sports.includes(sport) ? f.sports.filter(s => s !== sport) : [...f.sports, sport] }))
  }

  const filtered = rows.filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.location.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Showcase Events</h1>
          <p className="text-sm text-slate-400 mt-0.5">{rows.length} événement{rows.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher…" className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none w-52" />
          <button onClick={() => { setForm(EMPTY); setEditId(null); setModal('add') }} className="bg-[#000769] text-white text-sm font-semibold px-4 py-2 rounded-lg">+ Ajouter</button>
        </div>
      </div>
      {loading ? <Spinner /> : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-100 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Événement</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Date</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Lieu</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Statut</th>
              <th className="px-5 py-3"></th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-slate-400">Aucun événement</td></tr>}
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{row.title}</td>
                  <td className="px-5 py-3.5 text-slate-500">{row.event_date ? new Date(row.event_date).toLocaleDateString('fr-FR') : '—'}</td>
                  <td className="px-5 py-3.5 text-slate-500">{row.location}</td>
                  <td className="px-5 py-3.5">{row.is_published ? <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Publié</span> : <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Brouillon</span>}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { const {id, created_at, ...rest} = row; setForm(rest); setEditId(id); setModal('edit') }} className="text-slate-400 hover:text-[#000769] text-xs">Modifier</button>
                      <button onClick={() => remove(row.id)} className="text-slate-400 hover:text-[#B22234] text-xs">Suppr.</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <Modal title={modal === 'add' ? 'Ajouter un événement' : "Modifier l'événement"} onClose={() => setModal(null)} onSave={save} saving={saving}>
          <Field label="Titre *"><Input value={form.title} onChange={v => setForm({...form, title: v})} placeholder="NextMoov Showcase 2025" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date *"><input type="date" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></Field>
            <Field label="Capacité"><input type="number" value={form.capacity ?? ''} onChange={e => setForm({...form, capacity: e.target.value ? Number(e.target.value) : null})} placeholder="150" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /></Field>
          </div>
          <Field label="Lieu *"><Input value={form.location} onChange={v => setForm({...form, location: v})} placeholder="Paris, France" /></Field>
          <Field label="Description"><Textarea value={form.description ?? ''} onChange={v => setForm({...form, description: v})} /></Field>
          <Field label="Sports concernés">
            <div className="flex flex-wrap gap-2 mt-1">
              {SPORTS_LIST.map(s => (
                <button key={s} type="button" onClick={() => toggleSport(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${ form.sports.includes(s) ? 'bg-[#000769] text-white border-[#000769]' : 'border-slate-200 text-slate-500' }`}>{s}</button>
              ))}
            </div>
          </Field>
          <Field label="URL d'inscription"><Input value={form.registration_url ?? ''} onChange={v => setForm({...form, registration_url: v})} placeholder="https://…" /></Field>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={e => setForm({...form, is_published: e.target.checked})} className="w-4 h-4 accent-[#000769]" />
            Publier l'événement
          </label>
        </Modal>
      )}
    </>
  )
}

function Spinner() { return <div className="flex justify-center py-20"><div className="w-7 h-7 border-2 border-[#000769]/20 border-t-[#000769] rounded-full animate-spin" /></div> }
function Modal({ title, children, onClose, onSave, saving }: { title: string; children: React.ReactNode; onClose: () => void; onSave: () => void; saving: boolean }) {
  return <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"><div className="flex items-center justify-between px-6 py-4 border-b border-slate-100"><h2 className="font-bold text-slate-800">{title}</h2><button onClick={onClose} className="text-slate-400">✕</button></div><div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">{children}</div><div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100"><button onClick={onClose} className="px-4 py-2 text-sm text-slate-600">Annuler</button><button onClick={onSave} disabled={saving} className="bg-[#000769] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg">{saving ? 'Enregistrement…' : 'Enregistrer'}</button></div></div></div>
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>{children}</div> }
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) { return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none" /> }
function Textarea({ value, onChange }: { value: string; onChange: (v: string) => void }) { return <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" /> }
