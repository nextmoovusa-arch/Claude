import { Search, Plus, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ATHLETE_STATUS_LABELS } from "@/lib/constants"
import { AthleteStatus, Division } from "@/types"

// Données de démonstration — remplacées par les vraies données après migration
const MOCK_ATHLETES = [
  {
    id: "1",
    firstName: "Lucas",
    lastName: "Moreau",
    status: "IN_CAMPAIGN" as AthleteStatus,
    currentClub: "FC Nantes U19",
    primaryPosition: "Milieu offensif",
    gpaConverted: 3.4,
    targetDivisions: ["NCAA_D1", "NCAA_D2"] as Division[],
    createdAt: new Date("2026-01-15"),
  },
  {
    id: "2",
    firstName: "Théo",
    lastName: "Bernard",
    status: "IN_FILE" as AthleteStatus,
    currentClub: "OGC Nice Academy",
    primaryPosition: "Défenseur central",
    gpaConverted: 3.7,
    targetDivisions: ["NCAA_D1"] as Division[],
    createdAt: new Date("2026-02-03"),
  },
  {
    id: "3",
    firstName: "Antoine",
    lastName: "Dupont",
    status: "OFFERS_RECEIVED" as AthleteStatus,
    currentClub: "Stade Rennais U21",
    primaryPosition: "Attaquant",
    gpaConverted: 3.1,
    targetDivisions: ["NCAA_D2", "NAIA"] as Division[],
    createdAt: new Date("2025-11-20"),
  },
]

const STATUS_BADGE_VARIANT: Record<AthleteStatus, "default" | "navy" | "red" | "gold"> = {
  PROSPECT: "default",
  SIGNED: "navy",
  IN_FILE: "default",
  IN_CAMPAIGN: "gold",
  OFFERS_RECEIVED: "red",
  COMMITTED: "navy",
  NLI_SIGNED: "navy",
  ARRIVED_US: "navy",
  ABANDONED: "default",
}

const DIVISION_SHORT: Partial<Record<Division, string>> = {
  NCAA_D1: "D1",
  NCAA_D2: "D2",
  NCAA_D3: "D3",
  NAIA: "NAIA",
  NJCAA_D1: "JUCO D1",
  NJCAA_D2: "JUCO D2",
  NJCAA_D3: "JUCO D3",
  PREP_SCHOOL: "Prep",
}

export default function AthletesPage() {
  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between border-b border-line pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-stone mb-1">
            Gestion
          </p>
          <h1 className="font-anton text-3xl tracking-widest text-ink">ATHLÈTES</h1>
        </div>
        <Button variant="primary" size="md">
          <Plus className="h-4 w-4" />
          Nouvel athlète
        </Button>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone" />
          <Input
            placeholder="Rechercher un athlète..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="md">
          <SlidersHorizontal className="h-4 w-4" />
          Filtres
        </Button>

        {/* Filtres rapides par statut */}
        <div className="flex items-center gap-1 ml-2">
          {(["IN_CAMPAIGN", "OFFERS_RECEIVED", "COMMITTED"] as AthleteStatus[]).map((s) => (
            <button
              key={s}
              className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-line text-stone hover:border-navy hover:text-navy transition-colors"
            >
              {ATHLETE_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="border border-line">
        {/* En-tête */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_100px] border-b border-line bg-cream">
          {["Athlète", "Club actuel", "Poste", "GPA", "Divisions cibles", "Statut"].map((h) => (
            <div key={h} className="px-4 py-2.5">
              <span className="font-mono text-xs uppercase tracking-widest text-stone">{h}</span>
            </div>
          ))}
        </div>

        {/* Lignes */}
        {MOCK_ATHLETES.map((athlete, i) => (
          <Link
            key={athlete.id}
            href={`/admin/athletes/${athlete.id}`}
            className={`grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_100px] items-center hover:bg-cream transition-colors ${i < MOCK_ATHLETES.length - 1 ? "border-b border-line" : ""}`}
          >
            <div className="px-4 py-3.5">
              <p className="font-playfair text-sm font-semibold text-ink">
                {athlete.firstName} {athlete.lastName}
              </p>
              <p className="font-mono text-xs text-stone mt-0.5">
                Ajouté le {athlete.createdAt.toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className="px-4 py-3.5">
              <p className="font-garamond text-sm text-graphite">{athlete.currentClub}</p>
            </div>
            <div className="px-4 py-3.5">
              <p className="font-garamond text-sm text-graphite">{athlete.primaryPosition}</p>
            </div>
            <div className="px-4 py-3.5">
              <span className="font-mono text-sm text-ink">
                {athlete.gpaConverted?.toFixed(1) ?? "—"}
              </span>
            </div>
            <div className="px-4 py-3.5 flex flex-wrap gap-1">
              {athlete.targetDivisions.map((d) => (
                <Badge key={d} variant="default" className="text-xs">
                  {DIVISION_SHORT[d] ?? d}
                </Badge>
              ))}
            </div>
            <div className="px-4 py-3.5">
              <Badge variant={STATUS_BADGE_VARIANT[athlete.status]}>
                {ATHLETE_STATUS_LABELS[athlete.status]}
              </Badge>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="font-mono text-xs text-stone uppercase tracking-widest">
          {MOCK_ATHLETES.length} athlète{MOCK_ATHLETES.length > 1 ? "s" : ""}
          <span className="text-gold ml-2">— données de démonstration</span>
        </p>
      </div>
    </div>
  )
}
