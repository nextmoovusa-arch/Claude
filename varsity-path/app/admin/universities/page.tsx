"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users, ChevronRight } from "lucide-react";

const DIVISIONS = ["NCAA_D1", "NCAA_D2", "NCAA_D3", "NAIA", "NJCAA_D1", "NJCAA_D2", "NJCAA_D3"] as const;
type Division = (typeof DIVISIONS)[number];

const DIVISION_LABELS: Record<Division, string> = {
  NCAA_D1: "NCAA D1",
  NCAA_D2: "NCAA D2",
  NCAA_D3: "NCAA D3",
  NAIA: "NAIA",
  NJCAA_D1: "NJCAA D1",
  NJCAA_D2: "NJCAA D2",
  NJCAA_D3: "NJCAA D3",
};

const DIVISION_COLORS: Record<Division, string> = {
  NCAA_D1: "bg-navy text-white",
  NCAA_D2: "bg-red-flag text-white",
  NCAA_D3: "bg-graphite text-white",
  NAIA: "bg-gold text-white",
  NJCAA_D1: "bg-ink text-white",
  NJCAA_D2: "bg-stone text-ink",
  NJCAA_D3: "bg-stone text-ink",
};

type University = {
  id: string;
  name: string;
  city: string;
  state: string;
  division: Division;
  _count: { coaches: number };
};

// Mock data while DB not connected
const MOCK_UNIVERSITIES: University[] = [
  { id: "1", name: "University of Virginia", city: "Charlottesville", state: "VA", division: "NCAA_D1", _count: { coaches: 3 } },
  { id: "2", name: "Duke University", city: "Durham", state: "NC", division: "NCAA_D1", _count: { coaches: 4 } },
  { id: "3", name: "Indiana University", city: "Bloomington", state: "IN", division: "NCAA_D1", _count: { coaches: 3 } },
  { id: "4", name: "Wake Forest University", city: "Winston-Salem", state: "NC", division: "NCAA_D1", _count: { coaches: 2 } },
  { id: "5", name: "Grand Valley State University", city: "Allendale", state: "MI", division: "NCAA_D2", _count: { coaches: 2 } },
  { id: "6", name: "Adelphi University", city: "Garden City", state: "NY", division: "NCAA_D2", _count: { coaches: 2 } },
  { id: "7", name: "Messiah University", city: "Mechanicsburg", state: "PA", division: "NCAA_D3", _count: { coaches: 3 } },
  { id: "8", name: "George Fox University", city: "Newberg", state: "OR", division: "NAIA", _count: { coaches: 2 } },
  { id: "9", name: "Hutchinson Community College", city: "Hutchinson", state: "KS", division: "NJCAA_D1", _count: { coaches: 2 } },
  { id: "10", name: "Creighton University", city: "Omaha", state: "NE", division: "NCAA_D1", _count: { coaches: 3 } },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

export default function UniversitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedDivisions, setSelectedDivisions] = useState<Division[]>([]);
  const [selectedState, setSelectedState] = useState("");

  const filtered = useMemo(() => {
    return MOCK_UNIVERSITIES.filter((u) => {
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.city.toLowerCase().includes(search.toLowerCase());
      const matchDiv =
        selectedDivisions.length === 0 || selectedDivisions.includes(u.division);
      const matchState = !selectedState || u.state === selectedState;
      return matchSearch && matchDiv && matchState;
    });
  }, [search, selectedDivisions, selectedState]);

  function toggleDivision(div: Division) {
    setSelectedDivisions((prev) =>
      prev.includes(div) ? prev.filter((d) => d !== div) : [...prev, div]
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display uppercase tracking-wider text-navy mb-1">
          Universités
        </h1>
        <p className="text-sm text-graphite font-mono">
          {filtered.length} résultats · base de données complète
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-7 gap-2 mb-8">
        {DIVISIONS.map((div) => {
          const count = MOCK_UNIVERSITIES.filter((u) => u.division === div).length;
          const active = selectedDivisions.includes(div);
          return (
            <button
              key={div}
              onClick={() => toggleDivision(div)}
              className={`p-3 rounded border text-center transition-all ${
                active
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-white hover:border-navy"
              }`}
            >
              <div className="text-xs font-mono text-current opacity-60 mb-1">
                {DIVISION_LABELS[div]}
              </div>
              <div className="text-lg font-display text-current">{count}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-graphite" />
          <Input
            placeholder="Rechercher une université ou ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="border border-line rounded px-3 py-2 text-sm font-mono bg-white text-ink focus:outline-none focus:border-navy"
        >
          <option value="">Tous les États</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {(selectedDivisions.length > 0 || selectedState || search) && (
          <button
            onClick={() => { setSelectedDivisions([]); setSelectedState(""); setSearch(""); }}
            className="px-4 py-2 text-sm font-mono text-graphite hover:text-ink border border-line rounded"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-line rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-paper">
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Université
              </th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Localisation
              </th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Division
              </th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Coachs
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((uni, i) => (
              <tr
                key={uni.id}
                onClick={() => window.location.href = `/admin/universities/${uni.id}`}
                className={`border-b border-line last:border-0 hover:bg-paper transition-colors cursor-pointer ${
                  i % 2 === 0 ? "bg-white" : "bg-paper/40"
                }`}
              >
                <td className="px-5 py-4">
                  <span className="font-medium text-ink">{uni.name}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-1.5 text-sm text-graphite font-mono">
                    <MapPin className="w-3.5 h-3.5" />
                    {uni.city}, {uni.state}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-mono font-medium ${
                      DIVISION_COLORS[uni.division]
                    }`}
                  >
                    {DIVISION_LABELS[uni.division]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-1.5 text-sm text-graphite font-mono">
                    <Users className="w-3.5 h-3.5" />
                    {uni._count.coaches} coach{uni._count.coaches > 1 ? "s" : ""}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <ChevronRight className="w-4 h-4 text-graphite ml-auto" />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-graphite font-mono text-sm">
                  Aucune université ne correspond à ces critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DB notice */}
      <p className="mt-4 text-xs text-graphite font-mono text-center">
        Données de démonstration · Connectez la base Neon et exécutez{" "}
        <code className="bg-stone px-1 rounded">npm run db:seed</code> pour afficher les{" "}
        900+ universités
      </p>
    </div>
  );
}
