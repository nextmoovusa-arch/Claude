"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AthleteStatus, Division } from "@/types"

const DIVISIONS: { value: Division; label: string }[] = [
  { value: "NCAA_D1", label: "NCAA Division I" },
  { value: "NCAA_D2", label: "NCAA Division II" },
  { value: "NCAA_D3", label: "NCAA Division III" },
  { value: "NAIA", label: "NAIA" },
  { value: "NJCAA_D1", label: "NJCAA D1 (JUCO)" },
  { value: "NJCAA_D2", label: "NJCAA D2 (JUCO)" },
  { value: "NJCAA_D3", label: "NJCAA D3 (JUCO)" },
  { value: "PREP_SCHOOL", label: "Prep School" },
]

type FormField = {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  nationality: string
  currentClub: string
  primaryPosition: string
  secondaryPosition: string
  dominantFoot: string
  heightCm: string
  weightKg: string
  targetDivisions: Division[]
  preferredRegions: string
  familyBudgetUsd: string
  minScholarshipPct: string
  targetMajor: string
  agentNotes: string
  status: AthleteStatus
}

const INITIAL: FormField = {
  firstName: "",
  lastName: "",
  email: "",
  dateOfBirth: "",
  nationality: "Française",
  currentClub: "",
  primaryPosition: "",
  secondaryPosition: "",
  dominantFoot: "",
  heightCm: "",
  weightKg: "",
  targetDivisions: [],
  preferredRegions: "",
  familyBudgetUsd: "",
  minScholarshipPct: "",
  targetMajor: "",
  agentNotes: "",
  status: "PROSPECT",
}

function FormSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border border-line">
      <div className="border-b border-line bg-cream px-5 py-3">
        <h2 className="font-mono text-xs uppercase tracking-widest text-graphite">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-5 p-5">{children}</div>
    </div>
  )
}

function Field({
  label,
  children,
  full,
}: {
  label: string
  children: React.ReactNode
  full?: boolean
}) {
  return (
    <div className={full ? "col-span-2" : ""}>
      <Label className="mb-1.5 block">{label}</Label>
      {children}
    </div>
  )
}

export default function NewAthletePage() {
  const router = useRouter()
  const [form, setForm] = useState<FormField>(INITIAL)
  const [saving, setSaving] = useState(false)

  function set(key: keyof FormField, value: string | Division[] | AthleteStatus) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleDivision(div: Division) {
    setForm((prev) => ({
      ...prev,
      targetDivisions: prev.targetDivisions.includes(div)
        ? prev.targetDivisions.filter((d) => d !== div)
        : [...prev.targetDivisions, div],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/athletes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Échec de la création")
      const data = await res.json()
      router.push(`/admin/athletes/${data.id}`)
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between border-b border-line pb-6">
        <div>
          <Link
            href="/admin/athletes"
            className="mb-2 flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-stone hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Athlètes
          </Link>
          <h1 className="font-anton text-3xl tracking-widest text-ink">NOUVEL ATHLÈTE</h1>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleSubmit}
          disabled={saving || !form.firstName || !form.lastName}
        >
          <Save className="h-4 w-4" />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Identité */}
        <FormSection title="Identité">
          <Field label="Prénom">
            <Input
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              placeholder="Lucas"
              required
            />
          </Field>
          <Field label="Nom">
            <Input
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              placeholder="Moreau"
              required
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="lucas@exemple.com"
            />
          </Field>
          <Field label="Date de naissance">
            <Input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => set("dateOfBirth", e.target.value)}
            />
          </Field>
          <Field label="Nationalité">
            <Input
              value={form.nationality}
              onChange={(e) => set("nationality", e.target.value)}
              placeholder="Française"
            />
          </Field>
          <Field label="Statut">
            <Select
              value={form.status}
              onValueChange={(v) => set("status", v as AthleteStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PROSPECT">Prospect</SelectItem>
                <SelectItem value="SIGNED">Signé</SelectItem>
                <SelectItem value="IN_FILE">En dossier</SelectItem>
                <SelectItem value="IN_CAMPAIGN">En campagne</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </FormSection>

        {/* Profil sportif */}
        <FormSection title="Profil sportif">
          <Field label="Club actuel">
            <Input
              value={form.currentClub}
              onChange={(e) => set("currentClub", e.target.value)}
              placeholder="FC Nantes U19"
            />
          </Field>
          <Field label="Poste principal">
            <Input
              value={form.primaryPosition}
              onChange={(e) => set("primaryPosition", e.target.value)}
              placeholder="Milieu offensif"
            />
          </Field>
          <Field label="Poste secondaire">
            <Input
              value={form.secondaryPosition}
              onChange={(e) => set("secondaryPosition", e.target.value)}
              placeholder="Ailier droit"
            />
          </Field>
          <Field label="Pied fort">
            <Select
              value={form.dominantFoot}
              onValueChange={(v) => set("dominantFoot", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Droit">Droit</SelectItem>
                <SelectItem value="Gauche">Gauche</SelectItem>
                <SelectItem value="Les deux">Les deux</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Taille (cm)">
            <Input
              type="number"
              value={form.heightCm}
              onChange={(e) => set("heightCm", e.target.value)}
              placeholder="180"
            />
          </Field>
          <Field label="Poids (kg)">
            <Input
              type="number"
              value={form.weightKg}
              onChange={(e) => set("weightKg", e.target.value)}
              placeholder="75"
            />
          </Field>
        </FormSection>

        {/* Stratégie */}
        <FormSection title="Stratégie de placement">
          <Field label="Divisions ciblées" full>
            <div className="flex flex-wrap gap-2 mt-1">
              {DIVISIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleDivision(value)}
                  className={`font-mono text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                    form.targetDivisions.includes(value)
                      ? "bg-navy text-paper border-navy"
                      : "border-line text-stone hover:border-graphite hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Régions préférées">
            <Input
              value={form.preferredRegions}
              onChange={(e) => set("preferredRegions", e.target.value)}
              placeholder="Sud-Est, Côte Est..."
            />
          </Field>
          <Field label="Budget famille (USD/an)">
            <Input
              type="number"
              value={form.familyBudgetUsd}
              onChange={(e) => set("familyBudgetUsd", e.target.value)}
              placeholder="30000"
            />
          </Field>
          <Field label="Scholarship minimum (%)">
            <Input
              type="number"
              value={form.minScholarshipPct}
              onChange={(e) => set("minScholarshipPct", e.target.value)}
              placeholder="50"
            />
          </Field>
          <Field label="Filière visée">
            <Input
              value={form.targetMajor}
              onChange={(e) => set("targetMajor", e.target.value)}
              placeholder="Business, Computer Science..."
            />
          </Field>
          <Field label="Notes agent" full>
            <Textarea
              value={form.agentNotes}
              onChange={(e) => set("agentNotes", e.target.value)}
              placeholder="Observations, points d'attention, contexte famille..."
              rows={4}
            />
          </Field>
        </FormSection>
      </form>
    </div>
  )
}
