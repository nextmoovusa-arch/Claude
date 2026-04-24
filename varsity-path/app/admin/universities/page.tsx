"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, MapPin, ChevronRight, X, ChevronLeft, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const DIVISIONS = ["NCAA_D1", "NCAA_D2", "NCAA_D3", "NAIA", "NJCAA_D1", "NJCAA_D2", "NJCAA_D3"] as const;
type Division = (typeof DIVISIONS)[number];

const DIVISION_LABELS: Record<Division, string> = {
  NCAA_D1: "NCAA D1", NCAA_D2: "NCAA D2", NCAA_D3: "NCAA D3",
  NAIA: "NAIA", NJCAA_D1: "NJCAA D1", NJCAA_D2: "NJCAA D2", NJCAA_D3: "NJCAA D3",
};

const DIVISION_STYLE: Record<Division, string> = {
  NCAA_D1:  "bg-blue-50 text-blue-700",
  NCAA_D2:  "bg-red-50 text-red-600",
  NCAA_D3:  "bg-gray-100 text-gray-600",
  NAIA:     "bg-amber-50 text-amber-700",
  NJCAA_D1: "bg-gray-800 text-white",
  NJCAA_D2: "bg-gray-100 text-gray-600",
  NJCAA_D3: "bg-gray-100 text-gray-600",
};

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

type University = {
  id: string; name: string; city: string; state: string; division: Division;
  acceptanceRate?: number; tuitionOutOfState?: number;
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
  useEffect(() => { setPage(1); }, [debouncedSearch, selectedDivision, selectedState]);

  const totalPages = Math.ceil(total / LIMIT);
  const hasFilters = selectedDivision || selectedState || search;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Building2 className="w-5 h-5 text-stone" />
          <div>
            <h1 className="text-xl font-semibold text-ink">Universités</h1>
            <p className="text-xs text-stone mt-0.5">
              {loading ? "Chargement..." : `${total.toLocaleString("fr-FR")} universités dans la base`}
            </p>
          </div>
        </div>
      </div>

      {/* Division tabs */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        <button
          onClick={() => setSelectedDivision("")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm transition-colors",
            !selectedDivision ? "bg-primary text-white font-medium" : "text-stone hover:bg-mist"
          )}
        >
          Toutes
        </button>
        {DIVISIONS.map((div) => (
          <button
            key={div}
            onClick={() => setSelectedDivision(selectedDivision === div ? "" : div)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm transition-colors",
              selectedDivision === div ? "bg-primary text-white font-medium" : "text-stone hover:bg-mist"
            )}
          >
            {DIVISION_LABELS[div]}
          </button>
        ))}
      </div>

      {/* Search + state */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
          <Input
            placeholder="Rechercher une université ou ville..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="border border-line rounded-lg px-3 py-1.5 text-sm bg-white text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
        >
          <option value="">Tous les États</option>
          {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSearch(""); setSelectedDivision(""); setSelectedState(""); setPage(1); }}
            className="flex items-center gap-1.5 text-xs text-stone hover:text-graphite px-2"
          >
            <X className="w-3.5 h-3.5" /> Réinitialiser
          </button>
        )}
        <p className="text-xs text-stone self-center ml-auto">
          {total.toLocaleString("fr-FR")} résultats
        </p>
      </div>

      {/* Table */}
      <div className="bg-white border border-line rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-paper">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">Université</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">État</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">Division</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">Coachs</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-stone">Chargement...</td>
              </tr>
            ) : universities.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-stone">
                  Aucune université ne correspond à ces critères.
                </td>
              </tr>
            ) : universities.map((uni) => (
              <tr key={uni.id} className="hover:bg-paper transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <Link href={`/admin/universities/${uni.id}`} className="block">
                    <p className="text-sm font-medium text-ink hover:text-primary">{uni.name}</p>
                    <p className="text-xs text-stone flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{uni.city}
                    </p>
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-graphite">{uni.state}</span>
                </td>
                <td className="px-4 py-3">
                  {uni.division && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DIVISION_STYLE[uni.division]}`}>
                      {DIVISION_LABELS[uni.division]}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-graphite">{uni._count.coaches} coach{uni._count.coaches !== 1 ? "s" : ""}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <ChevronRight className="w-4 h-4 text-stone ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-stone">
            Page {page} sur {totalPages} · {total.toLocaleString("fr-FR")} résultats
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 text-xs border border-line rounded-lg hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Précédent
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 text-xs border border-line rounded-lg hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Suivant <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
