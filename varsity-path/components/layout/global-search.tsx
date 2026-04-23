"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Building2, Mail, ListTodo, X, ChevronRight } from "lucide-react";

type ResultType = "athlete" | "university" | "campaign" | "task";

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle: string;
  href: string;
}

const ICON_MAP: Record<ResultType, React.ElementType> = {
  athlete: User,
  university: Building2,
  campaign: Mail,
  task: ListTodo,
};

const TYPE_LABELS: Record<ResultType, string> = {
  athlete: "Athlète",
  university: "Université",
  campaign: "Campagne",
  task: "Tâche",
};

const TYPE_COLORS: Record<ResultType, string> = {
  athlete: "bg-navy/10 text-navy",
  university: "bg-amber-100 text-amber-800",
  campaign: "bg-green-100 text-green-800",
  task: "bg-red-flag/10 text-red-flag",
};

const ALL_ITEMS: SearchResult[] = [
  { id: "a1", type: "athlete",    title: "Lucas Martins",                    subtitle: "Paris FC U19 · Milieu offensif · EN CAMPAGNE",             href: "/admin/athletes/1" },
  { id: "a2", type: "athlete",    title: "Sofia Chen",                       subtitle: "Shanghai United · Avant-centre · EN DOSSIER",              href: "/admin/athletes/2" },
  { id: "a3", type: "athlete",    title: "Emma Bergström",                   subtitle: "Göteborg FC · Défenseure · PROSPECT",                      href: "/admin/athletes/3" },
  { id: "u1", type: "university", title: "University of Virginia",           subtitle: "Charlottesville, VA · NCAA D1",                            href: "/admin/universities/1" },
  { id: "u2", type: "university", title: "Duke University",                  subtitle: "Durham, NC · NCAA D1",                                     href: "/admin/universities/2" },
  { id: "u3", type: "university", title: "Indiana University",               subtitle: "Bloomington, IN · NCAA D1",                                href: "/admin/universities/3" },
  { id: "u4", type: "university", title: "Wake Forest University",           subtitle: "Winston-Salem, NC · NCAA D1",                              href: "/admin/universities/4" },
  { id: "u5", type: "university", title: "Grand Valley State University",    subtitle: "Allendale, MI · NCAA D2",                                  href: "/admin/universities/5" },
  { id: "u6", type: "university", title: "Creighton University",             subtitle: "Omaha, NE · NCAA D1",                                      href: "/admin/universities/10" },
  { id: "c1", type: "campaign",   title: "Lucas Martins — Contact initial",  subtitle: "45 envoyés · 4 réponses · 40% ouverture",                  href: "/admin/campaigns/1" },
  { id: "c2", type: "campaign",   title: "Lucas Martins — Follow-up D2",     subtitle: "28 envoyés · 1 réponse · 29% ouverture",                   href: "/admin/campaigns/2" },
  { id: "c3", type: "campaign",   title: "Sofia Chen — Contact initial",     subtitle: "Brouillon · 0 envoyé",                                    href: "/admin/campaigns/3" },
  { id: "t1", type: "task",       title: "Repasser le TOEFL",                subtitle: "Lucas Martins · Échéance 15 juin · Haute priorité",        href: "/admin/tasks" },
  { id: "t2", type: "task",       title: "Créer le profil NCAA Eligibility", subtitle: "Lucas Martins · Échéance 1er mai · Haute priorité",        href: "/admin/tasks" },
  { id: "t3", type: "task",       title: "Sélectionner universités cibles",  subtitle: "Sofia Chen · Échéance 30 avril · Haute priorité",         href: "/admin/tasks" },
];

const QUICK_LINKS = [
  { label: "Tous les athlètes",  href: "/admin/athletes",     icon: User },
  { label: "Universités",        href: "/admin/universities", icon: Building2 },
  { label: "Campagnes",          href: "/admin/campaigns",    icon: Mail },
  { label: "Tâches",             href: "/admin/tasks",        icon: ListTodo },
];

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((p) => !p);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ALL_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        TYPE_LABELS[item.type].toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const items = query ? results : [];

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    const list = query ? items : QUICK_LINKS;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, list.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter") {
      e.preventDefault();
      if (query && items[activeIndex]) navigate(items[activeIndex].href);
      else if (!query && QUICK_LINKS[activeIndex]) navigate(QUICK_LINKS[activeIndex].href);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="bg-white border border-line rounded-xl w-full max-w-xl mx-4 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line">
          <Search className="w-5 h-5 text-graphite flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Rechercher un athlète, université, campagne..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm font-mono text-ink bg-transparent outline-none placeholder:text-stone"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-graphite hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="px-2 py-0.5 text-xs font-mono text-stone border border-line rounded">Esc</kbd>
        </div>

        {/* Results */}
        <div className="py-2 max-h-96 overflow-y-auto">
          {query && items.length === 0 && (
            <p className="px-4 py-8 text-center text-sm font-mono text-graphite">
              Aucun résultat pour &ldquo;{query}&rdquo;
            </p>
          )}

          {query && items.length > 0 && (
            <>
              <p className="px-4 pb-2 text-xs font-mono uppercase tracking-widest text-stone">
                {items.length} résultat{items.length > 1 ? "s" : ""}
              </p>
              {items.map((item, i) => {
                const Icon = ICON_MAP[item.type];
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeIndex === i ? "bg-navy/5" : "hover:bg-paper"}`}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <Icon className="w-4 h-4 text-graphite flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{item.title}</p>
                      <p className="text-xs font-mono text-graphite truncate mt-0.5">{item.subtitle}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-mono flex-shrink-0 ${TYPE_COLORS[item.type]}`}>
                      {TYPE_LABELS[item.type]}
                    </span>
                  </button>
                );
              })}
            </>
          )}

          {!query && (
            <>
              <p className="px-4 pb-2 text-xs font-mono uppercase tracking-widest text-stone">Accès rapide</p>
              {QUICK_LINKS.map((link, i) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.href}
                    onClick={() => navigate(link.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeIndex === i ? "bg-navy/5" : "hover:bg-paper"}`}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <Icon className="w-4 h-4 text-graphite flex-shrink-0" />
                    <span className="text-sm text-ink font-medium flex-1">{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-stone" />
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 border-t border-line bg-paper flex items-center gap-4 text-xs font-mono text-stone">
          <span><kbd className="px-1.5 py-0.5 border border-line rounded bg-white">↑↓</kbd> naviguer</span>
          <span><kbd className="px-1.5 py-0.5 border border-line rounded bg-white">↵</kbd> ouvrir</span>
          <span><kbd className="px-1.5 py-0.5 border border-line rounded bg-white">Esc</kbd> fermer</span>
        </div>
      </div>
    </div>
  );
}
