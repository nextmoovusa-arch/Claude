"use client";

import { useState, useMemo } from "react";
import { Search, Plus, X, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ATHLETE_STATUS_LABELS } from "@/lib/constants";
import { AthleteStatus, Division } from "@/types";
import { cn } from "@/lib/utils";

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

const DIVISION_SHORT: Partial<Record<Division, string>> = {
  NCAA_D1: "D1", NCAA_D2: "D2", NCAA_D3: "D3",
  NAIA: "NAIA", NJCAA_D1: "JUCO D1", NJCAA_D2: "JUCO D2", NJCAA_D3: "JUCO D3", PREP_SCHOOL: "Prep",
};

const STATUS_STYLE: Record<AthleteStatus, string> = {
  PROSPECT:        "bg-gray-100 text-gray-600",
  SIGNED:          "bg-blue-50 text-blue-700",
  IN_FILE:         "bg-gray-100 text-gray-600",
  IN_CAMPAIGN:     "bg-amber-50 text-amber-700",
  OFFERS_RECEIVED: "bg-green-50 text-green-700",
  COMMITTED:       "bg-blue-50 text-blue-700",
  NLI_SIGNED:      "bg-blue-50 text-blue-700",
  ARRIVED_US:      "bg-green-50 text-green-700",
  ABANDONED:       "bg-red-50 text-red-600",
};

const STATUS_TABS: Array<{ value: AthleteStatus | ""; label: string }> = [
  { value: "",               label: "Tous" },
  { value: "PROSPECT",      label: "Prospect" },
  { value: "SIGNED",        label: "Signé" },
  { value: "IN_FILE",       label: "En dossier" },
  { value: "IN_CAMPAIGN",   label: "En campagne" },
  { value: "OFFERS_RECEIVED", label: "Offres reçues" },
  { value: "COMMITTED",     label: "Engagé" },
];

function countByStatus(status: AthleteStatus | "") {
  if (!status) return MOCK_ATHLETES.length;
  return MOCK_ATHLETES.filter((a) => a.status === status).length;
}

export default function AthletesPage() {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<AthleteStatus | "">("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_ATHLETES.filter((a) => {
      const matchSearch =
        !search ||
        a.firstName.toLowerCase().includes(q) ||
        a.lastName.toLowerCase().includes(q) ||
        (a.currentClub ?? "").toLowerCase().includes(q) ||
        (a.primaryPosition ?? "").toLowerCase().includes(q);
      return matchSearch && (!activeStatus || a.status === activeStatus);
    });
  }, [search, activeStatus]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Users className="w-5 h-5 text-stone" />
          <h1 className="text-xl font-semibold text-ink">Athlètes</h1>
        </div>
        <Link href="/admin/athletes/new">
          <Button size="md">
            <Plus className="h-4 w-4" />
            Nouvel athlète
          </Button>
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto">
        {STATUS_TABS.map((tab) => {
          const count = countByStatus(tab.value);
          const active = activeStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap",
                active
                  ? "bg-primary text-white font-medium"
                  : "text-stone hover:bg-mist hover:text-graphite"
              )}
            >
              {tab.label}
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full font-medium",
                active ? "bg-white/20 text-white" : "bg-mist text-stone"
              )}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Search + reset */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone" />
          <Input
            placeholder="Rechercher un athlète, club, poste..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="flex items-center gap-1 text-xs text-stone hover:text-graphite"
          >
            <X className="w-3.5 h-3.5" /> Effacer
          </button>
        )}
        <p className="text-xs text-stone ml-auto">
          {filtered.length} athlète{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-line rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-paper">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">Athlète</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">Club · Poste</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">Parcours</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">Académique</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">Divisions cibles</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((athlete) => {
              const pct = Math.round((athlete.stepsCompleted / athlete.stepsTotal) * 100);
              return (
                <tr key={athlete.id} className="hover:bg-paper transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <Link href={`/admin/athletes/${athlete.id}`} className="block">
                      <p className="text-sm font-medium text-ink">{athlete.firstName} {athlete.lastName}</p>
                      <p className="text-xs text-stone mt-0.5">{athlete.nationality}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-graphite">{athlete.currentClub}</p>
                    <p className="text-xs text-stone mt-0.5">{athlete.primaryPosition}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-xs font-semibold ${pct === 100 ? "text-green-600" : pct >= 50 ? "text-primary" : "text-stone"}`}>
                        {pct}%
                      </span>
                      <span className="text-xs text-stone">{athlete.stepsCompleted}/{athlete.stepsTotal}</span>
                    </div>
                    <div className="w-32 bg-mist rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${pct === 100 ? "bg-green-500" : "bg-primary"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-graphite">GPA {athlete.gpaConverted?.toFixed(1) ?? "—"}</p>
                    <p className="text-xs text-stone mt-0.5">TOEFL {athlete.toeflScore ?? "—"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {athlete.targetDivisions.map((d) => (
                        <span key={d} className="text-xs px-1.5 py-0.5 bg-primary-50 text-primary-700 rounded-full font-medium">
                          {DIVISION_SHORT[d] ?? d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[athlete.status]}`}>
                      {ATHLETE_STATUS_LABELS[athlete.status]}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-stone">
                  Aucun athlète ne correspond à ces critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
