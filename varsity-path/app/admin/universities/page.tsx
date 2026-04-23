"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Users, ChevronRight, SlidersHorizontal, X } from "lucide-react";

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
  satAvgLow?: number;
  satAvgHigh?: number;
  acceptanceRate?: number;
  tuitionOutOfState?: number;
  scholarshipsTotal?: number;
  rosterSize?: number;
  _count: { coaches: number };
};

const MOCK_UNIVERSITIES: University[] = [
  { id: "1",  name: "University of Virginia",         city: "Charlottesville", state: "VA", division: "NCAA_D1", satAvgLow: 1480, satAvgHigh: 1570, acceptanceRate: 0.19, tuitionOutOfState: 48000, scholarshipsTotal: 11.5, rosterSize: 23, _count: { coaches: 3 } },
  { id: "2",  name: "Duke University",                city: "Durham",          state: "NC", division: "NCAA_D1", satAvgLow: 1500, satAvgHigh: 1580, acceptanceRate: 0.06, tuitionOutOfState: 59000, scholarshipsTotal: 9.9,  rosterSize: 27, _count: { coaches: 4 } },
  { id: "3",  name: "Indiana University",             city: "Bloomington",     state: "IN", division: "NCAA_D1", satAvgLow: 1180, satAvgHigh: 1400, acceptanceRate: 0.82, tuitionOutOfState: 37000, scholarshipsTotal: 9.9,  rosterSize: 28, _count: { coaches: 3 } },
  { id: "4",  name: "Wake Forest University",         city: "Winston-Salem",   state: "NC", division: "NCAA_D1", satAvgLow: 1370, satAvgHigh: 1520, acceptanceRate: 0.21, tuitionOutOfState: 58000, scholarshipsTotal: 9.9,  rosterSize: 28, _count: { coaches: 2 } },
  { id: "5",  name: "Grand Valley State University",  city: "Allendale",       state: "MI", division: "NCAA_D2", satAvgLow: 1080, satAvgHigh: 1270, acceptanceRate: 0.83, tuitionOutOfState: 18000, scholarshipsTotal: 9.0,  rosterSize: 31, _count: { coaches: 2 } },
  { id: "6",  name: "Adelphi University",             city: "Garden City",     state: "NY", division: "NCAA_D2", satAvgLow: 1080, satAvgHigh: 1280, acceptanceRate: 0.72, tuitionOutOfState: 40000, scholarshipsTotal: 9.0,  rosterSize: 26, _count: { coaches: 2 } },
  { id: "7",  name: "Messiah University",             city: "Mechanicsburg",   state: "PA", division: "NCAA_D3", satAvgLow: 1090, satAvgHigh: 1320, acceptanceRate: 0.80, tuitionOutOfState: 36000, scholarshipsTotal: 0,    rosterSize: 24, _count: { coaches: 3 } },
  { id: "8",  name: "George Fox University",          city: "Newberg",         state: "OR", division: "NAIA",    satAvgLow: 1040, satAvgHigh: 1240, acceptanceRate: 0.90, tuitionOutOfState: 35000, scholarshipsTotal: 12.0, rosterSize: 22, _count: { coaches: 2 } },
  { id: "9",  name: "Hutchinson Community College",   city: "Hutchinson",      state: "KS", division: "NJCAA_D1", satAvgLow: 900,  satAvgHigh: 1100, acceptanceRate: 1.00, tuitionOutOfState: 7000,  scholarshipsTotal: 8.0,  rosterSize: 30, _count: { coaches: 2 } },
  { id: "10", name: "Creighton University",           city: "Omaha",           state: "NE", division: "NCAA_D1", satAvgLow: 1250, satAvgHigh: 1430, acceptanceRate: 0.67, tuitionOutOfState: 42000, scholarshipsTotal: 9.9,  rosterSize: 25, _count: { coaches: 3 } },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

type SortKey = "name" | "sat" | "acceptanceRate" | "tuition" | "scholarships";

const SORT_LABELS: Record<SortKey, string> = {
  name: "Nom",
  sat: "SAT",
  acceptanceRate: "Sélectivité",
  tuition: "Frais",
  scholarships: "Bourses",
};

export default function UniversitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedDivisions, setSelectedDivisions] = useState<Division[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minSat, setMinSat] = useState("");
  const [maxTuition, setMaxTuition] = useState("");
  const [minScholarships, setMinScholarships] = useState("");

  const filtered = useMemo(() => {
    return MOCK_UNIVERSITIES.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedDivisions.length > 0 && !selectedDivisions.includes(u.division)) return false;
      if (selectedState && u.state !== selectedState) return false;
      if (minSat && u.satAvgLow && u.satAvgLow < parseInt(minSat)) return false;
      if (maxTuition && u.tuitionOutOfState && u.tuitionOutOfState > parseInt(maxTuition) * 1000) return false;
      if (minScholarships && (u.scholarshipsTotal ?? 0) < parseFloat(minScholarships)) return false;
      return true;
    }).sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;
      if (sortKey === "name") { valA = a.name; valB = b.name; }
      else if (sortKey === "sat") { valA = a.satAvgLow ?? 0; valB = b.satAvgLow ?? 0; }
      else if (sortKey === "acceptanceRate") { valA = a.acceptanceRate ?? 1; valB = b.acceptanceRate ?? 1; }
      else if (sortKey === "tuition") { valA = a.tuitionOutOfState ?? 0; valB = b.tuitionOutOfState ?? 0; }
      else if (sortKey === "scholarships") { valA = a.scholarshipsTotal ?? 0; valB = b.scholarshipsTotal ?? 0; }
      if (typeof valA === "string") return sortAsc ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
      return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [search, selectedDivisions, selectedState, sortKey, sortAsc, minSat, maxTuition, minScholarships]);

  function toggleDivision(div: Division) {
    setSelectedDivisions((prev) =>
      prev.includes(div) ? prev.filter((d) => d !== div) : [...prev, div]
    );
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((p) => !p);
    else { setSortKey(key); setSortAsc(true); }
  }

  const hasFilters = selectedDivisions.length > 0 || selectedState || search || minSat || maxTuition || minScholarships;

  function resetFilters() {
    setSelectedDivisions([]); setSelectedState(""); setSearch("");
    setMinSat(""); setMaxTuition(""); setMinScholarships("");
  }

  function SortHeader({ k, label }: { k: SortKey; label: string }) {
    const active = sortKey === k;
    return (
      <button
        onClick={() => toggleSort(k)}
        className={`text-xs font-mono uppercase tracking-widest flex items-center gap-1 ${active ? "text-navy font-bold" : "text-graphite hover:text-ink"}`}
      >
        {label}
        {active && <span className="text-navy">{sortAsc ? "↑" : "↓"}</span>}
      </button>
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
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} sur {MOCK_UNIVERSITIES.length} · base de données complète
        </p>
      </div>

      {/* Division pills */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {DIVISIONS.map((div) => {
          const count = MOCK_UNIVERSITIES.filter((u) => u.division === div).length;
          const active = selectedDivisions.includes(div);
          return (
            <button
              key={div}
              onClick={() => toggleDivision(div)}
              className={`p-3 rounded border text-center transition-all ${
                active ? "border-navy bg-navy text-white" : "border-line bg-white hover:border-navy"
              }`}
            >
              <div className={`text-xs font-mono mb-1 ${active ? "text-white/70" : "text-graphite"}`}>
                {DIVISION_LABELS[div]}
              </div>
              <div className="text-lg font-display">{count}</div>
            </button>
          );
        })}
      </div>

      {/* Filters row */}
      <div className="flex gap-3 mb-3">
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
        <button
          onClick={() => setShowAdvanced((p) => !p)}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-mono border rounded transition-colors ${
            showAdvanced ? "bg-navy text-paper border-navy" : "bg-white border-line text-graphite hover:border-navy hover:text-ink"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filtres avancés
        </button>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono border border-line text-graphite hover:text-ink rounded"
          >
            <X className="w-4 h-4" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="bg-paper border border-line rounded-lg p-4 mb-4 grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-graphite block mb-2">
              SAT min (bas de plage)
            </label>
            <Input
              type="number"
              placeholder="Ex: 1200"
              value={minSat}
              onChange={(e) => setMinSat(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-graphite block mb-2">
              Frais max (USD/an, ×1000)
            </label>
            <Input
              type="number"
              placeholder="Ex: 40 → $40k"
              value={maxTuition}
              onChange={(e) => setMaxTuition(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-mono uppercase tracking-widest text-graphite block mb-2">
              Bourses min (équivalents)
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="Ex: 9.9"
              value={minScholarships}
              onChange={(e) => setMinScholarships(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-line rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-paper">
              <th className="text-left px-5 py-3">
                <SortHeader k="name" label="Université" />
              </th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                État
              </th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Division
              </th>
              <th className="text-left px-5 py-3">
                <SortHeader k="sat" label="SAT" />
              </th>
              <th className="text-left px-5 py-3">
                <SortHeader k="acceptanceRate" label="Accep." />
              </th>
              <th className="text-left px-5 py-3">
                <SortHeader k="tuition" label="Frais" />
              </th>
              <th className="text-left px-5 py-3">
                <SortHeader k="scholarships" label="Bourses" />
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
                <td className="px-5 py-3.5">
                  <p className="font-medium text-ink text-sm">{uni.name}</p>
                  <p className="text-xs font-mono text-graphite flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />{uni.city}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-mono text-graphite">{uni.state}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium ${DIVISION_COLORS[uni.division]}`}>
                    {DIVISION_LABELS[uni.division]}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {uni.satAvgLow ? (
                    <span className="text-sm font-mono text-ink">{uni.satAvgLow}–{uni.satAvgHigh}</span>
                  ) : <span className="text-graphite text-sm">—</span>}
                </td>
                <td className="px-5 py-3.5">
                  {uni.acceptanceRate !== undefined ? (
                    <span className={`text-sm font-mono font-semibold ${uni.acceptanceRate <= 0.20 ? "text-red-flag" : uni.acceptanceRate <= 0.50 ? "text-amber-700" : "text-green-700"}`}>
                      {Math.round(uni.acceptanceRate * 100)}%
                    </span>
                  ) : <span className="text-graphite text-sm">—</span>}
                </td>
                <td className="px-5 py-3.5">
                  {uni.tuitionOutOfState ? (
                    <span className="text-sm font-mono text-ink">${(uni.tuitionOutOfState / 1000).toFixed(0)}k</span>
                  ) : <span className="text-graphite text-sm">—</span>}
                </td>
                <td className="px-5 py-3.5">
                  {uni.scholarshipsTotal !== undefined ? (
                    <span className={`text-sm font-mono font-semibold ${uni.scholarshipsTotal >= 9.9 ? "text-green-700" : uni.scholarshipsTotal > 0 ? "text-navy" : "text-graphite"}`}>
                      {uni.scholarshipsTotal > 0 ? `${uni.scholarshipsTotal}` : "Aucune"}
                    </span>
                  ) : <span className="text-graphite text-sm">—</span>}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <ChevronRight className="w-4 h-4 text-graphite ml-auto" />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-graphite font-mono text-sm">
                  Aucune université ne correspond à ces critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-graphite font-mono text-center">
        Données de démonstration · Connectez la base Neon et exécutez{" "}
        <code className="bg-stone px-1 rounded">npm run db:seed</code> pour afficher les{" "}
        900+ universités
      </p>
    </div>
  );
}
