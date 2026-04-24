"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Plus, Mail, CheckCircle2, Clock, AlertCircle,
  Eye, MessageSquare, Send, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

type CampaignStatus = "DRAFT" | "SENT" | "IN_PROGRESS" | "COMPLETED";

interface Campaign {
  id: string;
  athleteName: string;
  subject: string;
  targetCount: number;
  sentCount: number;
  openedCount: number;
  repliedCount: number;
  status: CampaignStatus;
  createdAt: string;
  sentAt?: string;
}

const STATUS_CONFIG: Record<CampaignStatus, { label: string; style: string }> = {
  DRAFT:       { label: "Brouillon",  style: "bg-gray-100 text-gray-600" },
  SENT:        { label: "Envoyée",    style: "bg-blue-50 text-blue-700" },
  IN_PROGRESS: { label: "En cours",   style: "bg-amber-50 text-amber-700" },
  COMPLETED:   { label: "Complète",   style: "bg-green-50 text-green-700" },
};

const STATUS_TABS: Array<{ value: CampaignStatus | ""; label: string }> = [
  { value: "",            label: "Toutes" },
  { value: "IN_PROGRESS",label: "En cours" },
  { value: "SENT",       label: "Envoyées" },
  { value: "DRAFT",      label: "Brouillons" },
  { value: "COMPLETED",  label: "Complètes" },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1", athleteName: "Lucas Martins",
    subject: "Student-athlete inquiry — midfielder from France",
    targetCount: 45, sentCount: 45, openedCount: 18, repliedCount: 4,
    status: "IN_PROGRESS", createdAt: "2026-03-15", sentAt: "2026-03-20",
  },
  {
    id: "2", athleteName: "Lucas Martins",
    subject: "Follow-up — NCAA D2 programs",
    targetCount: 32, sentCount: 28, openedCount: 8, repliedCount: 1,
    status: "SENT", createdAt: "2026-03-22", sentAt: "2026-03-25",
  },
  {
    id: "3", athleteName: "Sofia Chen",
    subject: "Forward from China — looking for D1/D2 opportunities",
    targetCount: 50, sentCount: 0, openedCount: 0, repliedCount: 0,
    status: "DRAFT", createdAt: "2026-03-28",
  },
];

export default function CampaignsPage() {
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState<CampaignStatus | "">("");

  const filtered = activeTab ? campaigns.filter((c) => c.status === activeTab) : campaigns;

  const totalSent    = campaigns.reduce((s, c) => s + c.sentCount, 0);
  const totalOpened  = campaigns.reduce((s, c) => s + c.openedCount, 0);
  const totalReplied = campaigns.reduce((s, c) => s + c.repliedCount, 0);
  const openRate     = totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <Mail className="w-5 h-5 text-stone" />
          <h1 className="text-xl font-semibold text-ink">Campagnes</h1>
        </div>
        <Link href="/admin/campaigns/new">
          <Button size="md">
            <Plus className="w-4 h-4" />
            Nouvelle campagne
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: "Emails envoyés",   value: totalSent,    icon: Send,         color: "text-blue-600",  bg: "bg-blue-50" },
          { label: "Ouvertures",       value: totalOpened,  icon: Eye,          color: "text-violet-600",bg: "bg-violet-50" },
          { label: "Réponses",         value: totalReplied, icon: MessageSquare,color: "text-green-600", bg: "bg-green-50" },
          { label: "Taux d'ouverture", value: `${openRate}%`, icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-line rounded-lg p-4">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-ink">{value}</p>
            <p className="text-xs text-stone mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-4">
        {STATUS_TABS.map((tab) => {
          const count = tab.value ? campaigns.filter((c) => c.status === tab.value).length : campaigns.length;
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
                activeTab === tab.value
                  ? "bg-primary text-white font-medium"
                  : "text-stone hover:bg-mist"
              )}
            >
              {tab.label}
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full font-medium",
                activeTab === tab.value ? "bg-white/20 text-white" : "bg-mist text-stone"
              )}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white border border-line rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-paper">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">Athlète</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">Sujet</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">Statut</th>
              <th className="text-left px-4 py-2.5 text-xs font-medium text-stone">Métriques</th>
              <th className="px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((c) => {
              const cfg = STATUS_CONFIG[c.status];
              const openRate = c.sentCount > 0 ? Math.round((c.openedCount / c.sentCount) * 100) : 0;
              return (
                <tr
                  key={c.id}
                  onClick={() => window.location.href = `/admin/campaigns/${c.id}`}
                  className="hover:bg-paper transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 font-medium text-sm text-ink">{c.athleteName}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-sm text-graphite truncate">{c.subject}</p>
                    <p className="text-xs text-stone mt-0.5">{c.createdAt}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.style}`}>
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4 text-xs text-stone">
                      <span><span className="font-semibold text-graphite">{c.sentCount}</span> envoyés</span>
                      <span><span className="font-semibold text-graphite">{c.openedCount}</span> ouverts</span>
                      <span><span className="font-semibold text-green-600">{c.repliedCount}</span> réponses</span>
                      {c.sentCount > 0 && (
                        <span className="font-semibold text-primary">{openRate}%</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ChevronRight className="w-4 h-4 text-stone ml-auto" />
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-stone">
                  Aucune campagne.{" "}
                  <Link href="/admin/campaigns/new" className="text-primary hover:underline">
                    Créer une campagne
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
