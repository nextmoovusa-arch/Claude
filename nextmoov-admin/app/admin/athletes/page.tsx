'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Athlete } from '@/lib/types'

const SPORTS = ['Soccer', 'Basketball', 'Tennis', 'Natation', 'Athlétisme', 'Autre']
const EMPTY: Omit<Athlete, 'id' | 'created_at'> = { name: '', sport: 'Soccer', position: '', school_origin: '', university_us: '', state_us: '', season: '', bio: '', photo_url: '', is_featured: false, instagram_url: '' }

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
    const { data } = await supabase.from('athletes').select('*').order('created_at', { ascending: false })
    setRows(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    if (modal === 'add') await supabase.from('athletes').insert(form)
    else if (editId) await supabase.from('athletes').update(form).eq('id', editId)
    setSaving(false); setModal(null); load()
  }

  async function remove(id: string) {
    if (!confirm('Supprimer cet athlète ?')) return
    await supabase.from('athletes').delete().eq('id', id); load()
  }

  const filtered = rows.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.sport.toLowerCase().includes(search.toLowerCase()) ||
    (r.university_us ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Athlètes</h1>
          <p className="text-sm text-slate-400 mt-0.5">{rows.length} entrée{rows.length !== 1 ? 's' : ''}</p>
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
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Nom</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Sport</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Université US</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Saison</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Featured</th>
              <th className="px-5 py-3"></th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={6} className="text-center py-12 text-slate-400">Aucun athlète</td></tr>}
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{row.name}</td>
                  <td className="px-5 py-3.5"><span className="bg-[#000769]/10 text-[#000769] text-xs px-2 py-0.5 rounded-full">{row.sport}</span></td>
                  <td className="px-5 py-3.5 text-slate-500">{row.university_us || '—'}</td>
                  <td className="px-5 py-3.5 text-slate-500">{row.season || '—'}</td>
                  <td className="px-5 py-3.5">{row.is_featured ? <span className="text-[#C0A060] text-xs font-semibold">★ Oui</span> : <span className="text-slate-300 text-xs">Non</span>}</td>
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
        <Modal title={modal === 'add' ? 'Ajouter un athlète' : "Modifier l'athlète"} onClose={() => setModal(null)} onSave={save} saving={saving}>
          <Field label="Nom complet *"><Input value={form.name} onChange={v => setForm({...form, name: v})} placeholder="Samuel König" /></Field>
          <Field label="Sport *"><Select value={form.sport} onChange={v => setForm({...form, sport: v})} options={SPORTS} /></Field>
          <Field label="Poste"><Input value={form.position ?? ''} onChange={v => setForm({...form, position: v})} placeholder="Attaquant" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="École d'origine"><Input value={form.school_origin ?? ''} onChange={v => setForm({...form, school_origin: v})} /></Field>
            <Field label="Saison"><Input value={form.season ?? ''} onChange={v => setForm({...form, season: v})} placeholder="2024-25" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Université US"><Input value={form.university_us ?? ''} onChange={v => setForm({...form, university_us: v})} /></Field>
            <Field label="État US"><Input value={form.state_us ?? ''} onChange={v => setForm({...form, state_us: v})} placeholder="Ohio" /></Field>
          </div>
          <Field label="Bio"><Textarea value={form.bio ?? ''} onChange={v => setForm({...form, bio: v})} /></Field>
          <Field label="Photo URL"><Input value={form.photo_url ?? ''} onChange={v => setForm({...form, photo_url: v})} placeholder="https://…" /></Field>
          <Field label="Instagram URL"><Input value={form.instagram_url ?? ''} onChange={v => setForm({...form, instagram_url: v})} placeholder="https://instagram.com/…" /></Field>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} className="w-4 h-4 accent-[#000769]" />
            Mettre en avant (featured)
          </label>
        </Modal>
      )}
    </>
  )
}

function Spinner() { return <div className="flex justify-center py-20"><div className="w-7 h-7 border-2 border-[#000769]/20 border-t-[#000769] rounded-full animate-spin" /></div> }
function Modal({ title, children, onClose, onSave, saving }: { title: string; children: React.ReactNode; onClose: () => void; onSave: () => void; saving: boolean }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-4 flex-1">{children}</div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600">Annuler</button>
          <button onClick={onSave} disabled={saving} className="bg-[#000769] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-lg">{saving ? 'Enregistrement…' : 'Enregistrer'}</button>
        </div>
      </div>
    </div>
  )
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>{children}</div> }
function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) { return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none" /> }
function Textarea({ value, onChange }: { value: string; onChange: (v: string) => void }) { return <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none resize-none" /> }
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) { return <select value={value} onChange={e => onChange(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none bg-white">{options.map(o => <option key={o} value={o}>{o}</option>)}</select> }
