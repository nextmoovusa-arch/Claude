'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Testimonial } from '@/lib/types'

const SPORTS = ['Soccer', 'Basketball', 'Tennis', 'Natation', 'Athlétisme', 'Autre']
const EMPTY: Omit<Testimonial, 'id' | 'created_at'> = { athlete_name: '', sport: 'Soccer', quote: '', rating: 5, photo_url: '', university_us: '', season: '', is_featured: false }

export default function TestimonialsPage() {
  const supabase = createClient()
  const [rows, setRows] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [form, setForm] = useState<Omit<Testimonial, 'id' | 'created_at'>>(EMPTY)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setRows(data ?? []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function save() {
    setSaving(true)
    if (modal === 'add') await supabase.from('testimonials').insert(form)
    else if (editId) await supabase.from('testimonials').update(form).eq('id', editId)
    setSaving(false); setModal(null); load()
  }
  async function remove(id: string) {
    if (!confirm('Supprimer ce témoignage ?')) return
    await supabase.from('testimonials').delete().eq('id', id); load()
  }

  const filtered = rows.filter(r => r.athlete_name.toLowerCase().includes(search.toLowerCase()) || r.sport.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Témoignages</h1>
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
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Athlète</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Sport</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Note</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase">Citation</th>
              <th className="px-5 py-3"></th>
            </tr></thead>
            <tbody>
              {filtered.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-slate-400">Aucun témoignage</td></tr>}
              {filtered.map(row => (
                <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50/60">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{row.athlete_name}</td>
                  <td className="px-5 py-3.5"><span className="bg-[#000769]/10 text-[#000769] text-xs px-2 py-0.5 rounded-full">{row.sport}</span></td>
                  <td className="px-5 py-3.5 text-[#C0A060]">{'★'.repeat(row.rating)}{'☆'.repeat(5 - row.rating)}</td>
                  <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">{row.quote}</td>
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
        <Modal title={modal === 'add' ? 'Ajouter un témoignage' : 'Modifier le témoignage'} onClose={() => setModal(null)} onSave={save} saving={saving}>
          <Field label="Nom de l'athlète *"><Input value={form.athlete_name} onChange={v => setForm({...form, athlete_name: v})} /></Field>
          <Field label="Sport *"><Select value={form.sport} onChange={v => setForm({...form, sport: v})} options={SPORTS} /></Field>
          <Field label="Citation *"><Textarea value={form.quote} onChange={v => setForm({...form, quote: v})} /></Field>
          <Field label="Note (1-5)">
            <input type="range" min={1} max={5} value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} className="w-full accent-[#C0A060]" />
            <p className="text-xs text-slate-400 mt-1">Note : {form.rating}/5</p>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Université US"><Input value={form.university_us ?? ''} onChange={v => setForm({...form, university_us: v})} /></Field>
            <Field label="Saison"><Input value={form.season ?? ''} onChange={v => setForm({...form, season: v})} placeholder="2024-25" /></Field>
          </div>
          <Field label="Photo URL"><Input value={form.photo_url ?? ''} onChange={v => setForm({...form, photo_url: v})} placeholder="https://…" /></Field>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} className="w-4 h-4 accent-[#000769]" />
            Mettre en avant
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
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) { return <select value={value} onChange={e => onChange(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none">{options.map(o => <option key={o} value={o}>{o}</option>)}</select> }
