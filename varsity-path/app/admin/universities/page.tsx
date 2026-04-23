"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, MapPin, ChevronRight, SlidersHorizontal, X, ChevronLeft } from "lucide-react";

const DIVISIONS = ["NCAA_D1", "NCAA_D2", "NCAA_D3", "NAIA", "NJCAA_D1", "NJCAA_D2", "NJCAA_D3"] as const;
type Division = (typeof DIVISIONS)[number];

const DIVISION_LABELS: Record<Division, string> = {
  NCAA_D1: "NCAA D1", NCAA_D2: "NCAA D2", NCAA_D3: "NCAA D3",
  NAIA: "NAIA", NJCAA_D1: "NJCAA D1", NJCAA_D2: "NJCAA D2", NJCAA_D3: "NJCAA D3",
};

const DIVISION_COLORS: Record<Division, string> = {
  NCAA_D1: "bg-navy text-white", NCAA_D2: "bg-red-flag text-white",
  NCAA_D3: "bg-graphite text-white", NAIA: "bg-gold text-white",
  NJCAA_D1: "bg-ink text-white", NJCAA_D2: "bg-stone text-ink", NJCAA_D3: "bg-stone text-ink",
};

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

type University = {
  id: string; name: string; city: string; state: string; division: Division;
  satAvgLow?: number; satAvgHigh?: number; acceptanceRate?: number;
  tuitionOutOfState?: number; scholarshipsTotal?: number;
  _count: { coaches: number };
};

const LIMIT = 50;

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDivision, setSelectedDivision] = useState<Division | "">("");
  const [selectedState, setSelectedState] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedDivision) params.set("division", selectedDivision);
    if (selectedState) params.set("state", selectedState);

    try {
      const res = await fetch(`/api/universities?${params}`);
      const data = await res.json();
      setUniversities(data.universities ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setUniversities([]);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, selectedDivision, selectedState]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [debouncedSearch, selectedDivision, selectedState]);

  const totalPages = Math.ceil(total / LIMIT);
  const hasFilters = selectedDivision || selectedState || search;

  function resetFilters() {
    setSearch(""); setSelectedDivision(""); setSelectedState(""); setPage(1);
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display uppercase tracking-wider text-navy mb-1">Universités</h1>
        <p className="text-sm text-graphite font-mono">
          {loading ? "Chargement..." : `${total.toLocaleString("fr-FR")} universités dans la base`}
        </p>
      </div>

      {/* Division pills */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {DIVISIONS.map((div) => {
          const active = selectedDivision === div;
          return (
            <button
              key={div}
              onClick={() => setSelectedDivision(active ? "" : div)}
              className={`p-3 rounded border text-center transition-all ${
                active ? "border-navy bg-navy text-white" : "border-line bg-white hover:border-navy"
              }`}
            >
              <div className={`text-xs font-mono mb-1 ${active ? "text-white/70" : "text-graphite"}`}>
                {DIVISION_LABELS[div]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
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
          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={() => setShowAdvanced((p) => !p)}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-mono border rounded transition-colors ${
            showAdvanced ? "bg-navy text-paper border-navy" : "bg-white border-line text-graphite hover:border-navy"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" /> Filtres
        </button>
        {hasFilters && (
          <button onClick={resetFilters} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono border border-line text-graphite hover:text-ink rounded">
            <X className="w-4 h-4" /> Réinitialiser
          </button>
        )}
      </div>

      {/* Table */}
      <div className="border border-line rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-paper">
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Université</th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">État</th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Division</th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Coachs</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-graphite font-mono text-sm">
                  Chargement...
                </td>
              </tr>
            ) : universities.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-graphite font-mono text-sm">
                  Aucune université ne correspond à ces critères.
                </td>
              </tr>
            ) : universities.map((uni, i) => (
              <tr
                key={uni.id}
                className={`border-b border-line last:border-0 hover:bg-paper transition-colors cursor-pointer ${i % 2 === 0 ? "bg-white" : "bg-paper/40"}`}
              >
                <td className="px-5 py-3.5">
                  <Link href={`/admin/universities/${uni.id}`} className="block">
                    <p className="font-medium text-ink text-sm hover:text-navy">{uni.name}</p>
                    <p className="text-xs font-mono text-graphite flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{uni.city}
                    </p>
                  </Link>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-mono text-graphite">{uni.state}</span>
                </td>
                <td className="px-5 py-3.5">
                  {uni.division && (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium ${DIVISION_COLORS[uni.division]}`}>
                      {DIVISION_LABELS[uni.division]}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-mono text-graphite">{uni._count.coaches} coach{uni._count.coaches !== 1 ? "s" : ""}</span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <ChevronRight className="w-4 h-4 text-graphite ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs font-mono text-graphite">
            Page {page} sur {totalPages} · {total.toLocaleString("fr-FR")} résultats
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-mono border border-line rounded hover:border-navy disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Précédent
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-xs font-mono border border-line rounded hover:border-navy disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Suivant <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
