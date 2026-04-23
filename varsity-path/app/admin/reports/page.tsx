"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Mail, Users, Building2, ChevronUp, ChevronDown, Minus } from "lucide-react";

// ── Mock data ──────────────────────────────────────────────────────────────────

const KPI = [
  { label: "Emails envoyés",      value: "247",   delta: "+34",  up: true,  sub: "30 derniers jours" },
  { label: "Taux d'ouverture",    value: "38%",   delta: "+6%",  up: true,  sub: "vs mois précédent" },
  { label: "Taux de réponse",     value: "7.3%",  delta: "+1.1%",up: true,  sub: "vs mois précédent" },
  { label: "Taux de bounce",      value: "2.1%",  delta: "-0.4%",up: true,  sub: "vs mois précédent" },
];

interface CampaignRow {
  id: string;
  name: string;
  athlete: string;
  sentAt: string;
  total: number;
  opened: number;
  replied: number;
  bounced: number;
  template: string;
}

const CAMPAIGNS: CampaignRow[] = [
  { id: "1", name: "Contact initial D1",      athlete: "Lucas Martins",   sentAt: "2026-04-10", total: 45, opened: 18, replied: 4,  bounced: 1, template: "Contact initial — Soccer masculin" },
  { id: "2", name: "Follow-up D2",            athlete: "Lucas Martins",   sentAt: "2026-04-17", total: 28, opened: 8,  replied: 1,  bounced: 0, template: "Relance — 7 jours" },
  { id: "3", name: "Contact initial D1/D2",   athlete: "Sofia Chen",      sentAt: "—",          total: 62, opened: 0,  replied: 0,  bounced: 0, template: "Contact initial — Soccer féminin" },
  { id: "4", name: "Premier contact EST",     athlete: "Emma Bergström",  sentAt: "—",          total: 30, opened: 0,  replied: 0,  bounced: 0, template: "Contact initial — Soccer féminin" },
];

const MONTHLY = [
  { month: "Nov",  sent: 0  },
  { month: "Déc",  sent: 0  },
  { month: "Jan",  sent: 45 },
  { month: "Fév",  sent: 89 },
  { month: "Mar",  sent: 72 },
  { month: "Avr",  sent: 41 },
];

const TEMPLATES_STATS = [
  { name: "Contact initial — Soccer masculin",  uses: 2, avgOpen: 43, avgReply: 9.5 },
  { name: "Relance — 7 jours sans réponse",     uses: 1, avgOpen: 29, avgReply: 3.6 },
  { name: "Contact initial — Soccer féminin",   uses: 2, avgOpen: 0,  avgReply: 0   },
];

const UNIV_RESPONSES = [
  { name: "Duke University",          division: "D1", response: "Intéressé",  athlete: "Lucas Martins" },
  { name: "University of Virginia",   division: "D1", response: "Intéressé",  athlete: "Lucas Martins" },
  { name: "Georgetown University",    division: "D1", response: "Intéressé",  athlete: "Lucas Martins" },
  { name: "Ohio State University",    division: "D1", response: "Plus tard",  athlete: "Lucas Martins" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const pct = (n: number, total: number) =>
  total === 0 ? "—" : `${Math.round((n / total) * 100)}%`;

const openColor = (rate: number) =>
  rate >= 40 ? "text-green-700" : rate >= 20 ? "text-navy" : rate === 0 ? "text-stone" : "text-graphite";

const replyColor = (rate: number) =>
  rate >= 10 ? "text-green-700" : rate >= 5 ? "text-navy" : rate === 0 ? "text-stone" : "text-graphite";

const maxSent = Math.max(...MONTHLY.map((m) => m.sent));

type SortKey = "name" | "sentAt" | "total" | "openRate" | "replyRate" | "bounced";
type SortDir = "asc" | "desc";

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReportsPage() {
  const [sort, setSort] = useState<SortKey>("sentAt");
  const [dir, setDir]   = useState<SortDir>("desc");
  const [period, setPeriod] = useState<"30d" | "90d" | "all">("30d");

  const toggleSort = (key: SortKey) => {
    if (sort === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSort(key); setDir("desc"); }
  };

  const sorted = [...CAMPAIGNS].sort((a, b) => {
    let av = 0, bv = 0;
    if (sort === "name")      { return dir === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name); }
    if (sort === "sentAt")    { const ad = a.sentAt === "—" ? "0" : a.sentAt; const bd = b.sentAt === "—" ? "0" : b.sentAt; return dir === "asc" ? ad.localeCompare(bd) : bd.localeCompare(ad); }
    if (sort === "total")     { av = a.total;   bv = b.total;   }
    if (sort === "openRate")  { av = a.total ? a.opened / a.total : 0;   bv = b.total ? b.opened / b.total : 0; }
    if (sort === "replyRate") { av = a.total ? a.replied / a.total : 0;  bv = b.total ? b.replied / b.total : 0; }
    if (sort === "bounced")   { av = a.bounced; bv = b.bounced; }
    return dir === "asc" ? av - bv : bv - av;
  });

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sort !== k) return <Minus className="w-3 h-3 text-stone/40" />;
    return dir === "asc" ? <ChevronUp className="w-3 h-3 text-navy" /> : <ChevronDown className="w-3 h-3 text-navy" />;
  };

  const SortTh = ({ k, label }: { k: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(k)}
      className="flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-graphite hover:text-navy whitespace-nowrap"
    >
      {label} <SortIcon k={k} />
    </button>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b border-line pb-6 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-graphite mb-1">Analytics</p>
          <h1 className="font-display text-3xl tracking-widest text-navy uppercase">Rapports</h1>
        </div>
        <div className="flex gap-1">
          {(["30d", "90d", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-widest border transition-colors ${
                period === p ? "border-navy bg-navy text-paper" : "border-line text-graphite hover:border-navy hover:text-navy"
              }`}
            >
              {p === "30d" ? "30 jours" : p === "90d" ? "90 jours" : "Tout"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-px border border-line bg-line rounded-lg overflow-hidden mb-8">
        {KPI.map((k) => (
          <div key={k.label} className="bg-paper px-6 py-5">
            <p className="font-mono text-xs uppercase tracking-widest text-graphite mb-3">{k.label}</p>
            <div className="flex items-end gap-2 mb-1">
              <p className="font-mono text-3xl text-ink">{k.value}</p>
              <span className={`text-xs font-mono font-semibold mb-1 ${k.up ? "text-green-700" : "text-red-flag"}`}>
                {k.delta}
              </span>
            </div>
            <p className="text-xs text-stone font-mono">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Monthly bar chart */}
        <div className="col-span-2 bg-white border border-line rounded-lg p-5">
          <h2 className="text-xs font-mono uppercase tracking-widest text-graphite mb-5">
            Volume mensuel d'envois
          </h2>
          <div className="flex items-end gap-3 h-40">
            {MONTHLY.map((m) => {
              const h = maxSent > 0 ? Math.round((m.sent / maxSent) * 100) : 0;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-mono text-graphite">{m.sent > 0 ? m.sent : ""}</span>
                  <div className="w-full flex items-end" style={{ height: "100px" }}>
                    <div
                      className={`w-full rounded-t transition-all ${m.sent > 0 ? "bg-navy" : "bg-stone/20"}`}
                      style={{ height: `${Math.max(h, m.sent > 0 ? 8 : 2)}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-stone">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Réponses universités */}
        <div className="bg-white border border-line rounded-lg p-5">
          <h2 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" /> Réponses positives
          </h2>
          <div className="space-y-2.5">
            {UNIV_RESPONSES.map((r, i) => (
              <div key={i} className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm text-ink leading-tight truncate">{r.name}</p>
                  <p className="text-xs font-mono text-graphite mt-0.5">{r.athlete} · {r.division}</p>
                </div>
                <span className={`text-xs font-mono flex-shrink-0 px-2 py-0.5 rounded ${
                  r.response === "Intéressé" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                }`}>
                  {r.response}
                </span>
              </div>
            ))}
          </div>
          <Link
            href="/admin/campaigns"
            className="mt-4 block text-xs font-mono text-navy hover:underline"
          >
            Voir les campagnes →
          </Link>
        </div>
      </div>

      {/* Campaigns table */}
      <div className="bg-white border border-line rounded-lg overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-line flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-graphite flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" /> Performance des campagnes
          </h2>
          <Link href="/admin/campaigns" className="text-xs font-mono text-navy hover:underline">
            Gérer →
          </Link>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-paper border-b border-line">
              <th className="px-4 py-3 text-left"><SortTh k="name" label="Campagne" /></th>
              <th className="px-4 py-3 text-left">
                <span className="font-mono text-xs uppercase tracking-widest text-graphite">Athlète</span>
              </th>
              <th className="px-4 py-3 text-left"><SortTh k="sentAt" label="Envoyée" /></th>
              <th className="px-4 py-3 text-right"><SortTh k="total" label="Total" /></th>
              <th className="px-4 py-3 text-right"><SortTh k="openRate" label="Ouv." /></th>
              <th className="px-4 py-3 text-right"><SortTh k="replyRate" label="Rép." /></th>
              <th className="px-4 py-3 text-right"><SortTh k="bounced" label="Bounce" /></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c, i) => {
              const openRate  = c.total ? Math.round((c.opened  / c.total) * 100) : 0;
              const replyRate = c.total ? Math.round((c.replied / c.total) * 100) : 0;
              const isDraft   = c.sentAt === "—";
              return (
                <tr
                  key={c.id}
                  className={`border-b border-line last:border-0 hover:bg-paper/60 transition-colors ${i % 2 === 0 ? "" : "bg-paper/30"}`}
                >
                  <td className="px-4 py-3">
                    <Link href={`/admin/campaigns/${c.id}`} className="text-sm text-ink hover:text-navy hover:underline font-medium">
                      {c.name}
                    </Link>
                    <p className="text-xs font-mono text-stone mt-0.5 truncate max-w-[220px]">{c.template}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-graphite font-mono">{c.athlete}</p>
                  </td>
                  <td className="px-4 py-3">
                    {isDraft ? (
                      <span className="text-xs font-mono text-stone px-2 py-0.5 border border-stone/30 rounded">Brouillon</span>
                    ) : (
                      <span className="text-xs font-mono text-graphite">
                        {new Date(c.sentAt + "T12:00").toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-mono text-ink">{c.total}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isDraft ? (
                      <span className="text-xs font-mono text-stone">—</span>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-stone/20 rounded-full h-1.5">
                          <div className="bg-navy h-1.5 rounded-full" style={{ width: `${openRate}%` }} />
                        </div>
                        <span className={`text-sm font-mono font-semibold w-10 text-right ${openColor(openRate)}`}>
                          {pct(c.opened, c.total)}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isDraft ? (
                      <span className="text-xs font-mono text-stone">—</span>
                    ) : (
                      <span className={`text-sm font-mono font-semibold ${replyColor(replyRate)}`}>
                        {pct(c.replied, c.total)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {isDraft ? (
                      <span className="text-xs font-mono text-stone">—</span>
                    ) : (
                      <span className={`text-sm font-mono ${c.bounced > 0 ? "text-red-flag font-semibold" : "text-stone"}`}>
                        {c.bounced > 0 ? c.bounced : "0"}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Template performance */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white border border-line rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-line">
            <h2 className="text-xs font-mono uppercase tracking-widest text-graphite flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Performance des templates
            </h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-paper border-b border-line">
                {["Template", "Utilisations", "Ouv. moy.", "Rép. moy."].map((h) => (
                  <th key={h} className={`px-4 py-3 text-xs font-mono uppercase tracking-widest text-graphite ${h !== "Template" ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEMPLATES_STATS.map((t, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <p className="text-sm text-ink truncate max-w-[200px]">{t.name}</p>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-mono text-graphite">{t.uses}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-mono font-semibold ${openColor(t.avgOpen)}`}>
                      {t.avgOpen > 0 ? `${t.avgOpen}%` : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-mono font-semibold ${replyColor(t.avgReply)}`}>
                      {t.avgReply > 0 ? `${t.avgReply}%` : "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Athlete summary */}
        <div className="bg-white border border-line rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-widest text-graphite flex items-center gap-2">
              <Users className="w-3.5 h-3.5" /> Résumé athlètes
            </h2>
            <Link href="/admin/athletes" className="text-xs font-mono text-navy hover:underline">
              Gérer →
            </Link>
          </div>
          <div className="divide-y divide-line">
            {[
              { name: "Lucas Martins",   emails: 73, replies: 5, offers: 2, status: "EN CAMPAGNE", color: "text-gold" },
              { name: "Sofia Chen",      emails: 0,  replies: 0, offers: 0, status: "EN DOSSIER",  color: "text-graphite" },
              { name: "Emma Bergström",  emails: 0,  replies: 0, offers: 0, status: "PROSPECT",    color: "text-stone" },
            ].map((a) => (
              <div key={a.name} className="px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-ink">{a.name}</p>
                  <span className={`text-xs font-mono font-semibold ${a.color}`}>{a.status}</span>
                </div>
                <div className="flex gap-4 text-xs font-mono text-graphite">
                  <span><span className="text-ink font-semibold">{a.emails}</span> emails</span>
                  <span><span className="text-ink font-semibold">{a.replies}</span> réponses</span>
                  <span><span className={`font-semibold ${a.offers > 0 ? "text-green-700" : "text-ink"}`}>{a.offers}</span> offre{a.offers !== 1 ? "s" : ""}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs font-mono text-stone text-right">
        — données de démonstration · connectez la base de données pour les vraies métriques
      </p>
    </div>
  );
}
