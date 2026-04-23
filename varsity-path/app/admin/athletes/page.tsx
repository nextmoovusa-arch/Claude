"use client";

import { useState, useMemo } from "react";
import { Search, Plus, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ATHLETE_STATUS_LABELS } from "@/lib/constants";
import { AthleteStatus, Division } from "@/types";

const MOCK_ATHLETES = [
  {
    id: "1",
    firstName: "Lucas",
    lastName: "Martins",
    status: "IN_CAMPAIGN" as AthleteStatus,
    currentClub: "Paris FC U19",
    primaryPosition: "Milieu offensif",
    nationality: "Français / Brésilien",
    gpaConverted: 3.4,
    toeflScore: 98,
    targetDivisions: ["NCAA_D1", "NCAA_D2"] as Division[],
    createdAt: new Date("2026-01-15"),
    stepsCompleted: 5,
    stepsTotal: 10,
    shortlistCount: 5,
  },
  {
    id: "2",
    firstName: "Sofia",
    lastName: "Chen",
    status: "IN_FILE" as AthleteStatus,
    currentClub: "Shanghai FC Academy",
    primaryPosition: "Avant-centre",
    nationality: "Chinoise",
    gpaConverted: 3.7,
    toeflScore: 102,
    targetDivisions: ["NCAA_D1"] as Division[],
    createdAt: new Date("2026-02-03"),
    stepsCompleted: 2,
    stepsTotal: 10,
    shortlistCount: 0,
  },
  {
    id: "3",
    firstName: "Emma",
    lastName: "Bergström",
    status: "PROSPECT" as AthleteStatus,
    currentClub: "Hammarby IF U21",
    primaryPosition: "Défenseure centrale",
    nationality: "Suédoise",
    gpaConverted: 3.1,
    toeflScore: 95,
    targetDivisions: ["NCAA_D2", "NAIA"] as Division[],
    createdAt: new Date("2026-03-20"),
    stepsCompleted: 0,
    stepsTotal: 10,
    shortlistCount: 0,
  },
];

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
};

const DIVISION_SHORT: Partial<Record<Division, string>> = {
  NCAA_D1: "D1",
  NCAA_D2: "D2",
  NCAA_D3: "D3",
  NAIA: "NAIA",
  NJCAA_D1: "JUCO D1",
  NJCAA_D2: "JUCO D2",
  NJCAA_D3: "JUCO D3",
  PREP_SCHOOL: "Prep",
};

const QUICK_STATUS_FILTERS: AthleteStatus[] = [
  "IN_CAMPAIGN", "OFFERS_RECEIVED", "COMMITTED",
];

export default function AthletesPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<AthleteStatus | "">("");

  const filtered = useMemo(() => {
    return MOCK_ATHLETES.filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        a.firstName.toLowerCase().includes(q) ||
        a.lastName.toLowerCase().includes(q) ||
        (a.currentClub ?? "").toLowerCase().includes(q) ||
        (a.primaryPosition ?? "").toLowerCase().includes(q);
      const matchStatus = !activeStatus || a.status === activeStatus;
      return matchSearch && matchStatus;
    });
  }, [search, activeStatus]);

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between border-b border-line pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-stone mb-1">
            Gestion
          </p>
          <h1 className="font-display text-3xl tracking-widest text-navy uppercase">
            Athlètes
          </h1>
        </div>
        <Link href="/admin/athletes/new">
          <Button variant="primary" size="md">
            <Plus className="h-4 w-4" />
            Nouvel athlète
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone" />
          <Input
            placeholder="Rechercher un athlète, club, poste..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1">
          {QUICK_STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(activeStatus === s ? "" : s)}
              className={`font-mono text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                activeStatus === s
                  ? "border-navy bg-navy text-paper"
                  : "border-line text-graphite hover:border-navy hover:text-navy"
              }`}
            >
              {ATHLETE_STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {(search || activeStatus) && (
          <button
            onClick={() => { setSearch(""); setActiveStatus(""); }}
            className="flex items-center gap-1 text-xs font-mono text-graphite hover:text-ink"
          >
            <X className="w-3.5 h-3.5" /> Réinitialiser
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-line rounded-lg overflow-hidden bg-white">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1.2fr_1fr_100px] border-b border-line bg-paper">
          {["Athlète", "Club · Poste", "Parcours", "Académique", "Divisions", "Statut"].map((h) => (
            <div key={h} className="px-4 py-3">
              <span className="font-mono text-xs uppercase tracking-widest text-graphite">{h}</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((athlete, i) => {
          const pct = Math.round((athlete.stepsCompleted / athlete.stepsTotal) * 100);
          return (
            <Link
              key={athlete.id}
              href={`/admin/athletes/${athlete.id}`}
              className={`grid grid-cols-[2fr_1.5fr_1fr_1.2fr_1fr_100px] items-center hover:bg-paper transition-colors ${
                i < filtered.length - 1 ? "border-b border-line" : ""
              } ${i % 2 === 0 ? "bg-white" : "bg-paper/40"}`}
            >
              <div className="px-4 py-4">
                <p className="font-medium text-ink text-sm">{athlete.firstName} {athlete.lastName}</p>
                <p className="font-mono text-xs text-graphite mt-0.5">{athlete.nationality}</p>
              </div>
              <div className="px-4 py-4">
                <p className="text-sm text-ink">{athlete.currentClub}</p>
                <p className="text-xs font-mono text-graphite mt-0.5">{athlete.primaryPosition}</p>
              </div>
              <div className="px-4 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-mono font-bold ${pct === 100 ? "text-green-700" : pct >= 50 ? "text-navy" : "text-graphite"}`}>
                    {pct}%
                  </span>
                  <span className="text-xs font-mono text-stone">{athlete.stepsCompleted}/{athlete.stepsTotal}</span>
                </div>
                <div className="w-full bg-stone/20 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${pct === 100 ? "bg-green-600" : "bg-navy"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {athlete.shortlistCount > 0 && (
                  <p className="text-xs font-mono text-graphite mt-1">{athlete.shortlistCount} univ. ciblées</p>
                )}
              </div>
              <div className="px-4 py-4">
                <p className="text-sm font-mono text-ink">GPA {athlete.gpaConverted?.toFixed(1) ?? "—"}</p>
                <p className="text-xs font-mono text-graphite mt-0.5">TOEFL {athlete.toeflScore ?? "—"}</p>
              </div>
              <div className="px-4 py-4 flex flex-wrap gap-1">
                {athlete.targetDivisions.map((d) => (
                  <Badge key={d} variant="default" className="text-xs">{DIVISION_SHORT[d] ?? d}</Badge>
                ))}
              </div>
              <div className="px-4 py-4">
                <Badge variant={STATUS_BADGE_VARIANT[athlete.status]}>
                  {ATHLETE_STATUS_LABELS[athlete.status]}
                </Badge>
              </div>
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-graphite font-mono text-sm">
            Aucun athlète ne correspond à ces critères.
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="font-mono text-xs text-graphite uppercase tracking-widest">
          {filtered.length} athlète{filtered.length !== 1 ? "s" : ""}
          {filtered.length !== MOCK_ATHLETES.length && ` · ${MOCK_ATHLETES.length} au total`}
          <span className="text-gold ml-2">— données de démonstration</span>
        </p>
      </div>
    </div>
  );
}
