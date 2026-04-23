"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Mail, CheckCircle2, Clock, AlertCircle,
  Eye, MessageSquare, Send, ChevronRight
} from "lucide-react";

type CampaignStatus = "DRAFT" | "SENT" | "IN_PROGRESS" | "COMPLETED";
type EmailStatus = "DRAFT" | "SENT" | "OPENED" | "REPLIED" | "BOUNCED";

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

const STATUS_CONFIG: Record<CampaignStatus, { label: string; color: string; icon: JSX.Element }> = {
  DRAFT: {
    label: "Brouillon",
    color: "bg-stone text-ink",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  SENT: {
    label: "Envoyée",
    color: "bg-blue-100 text-navy",
    icon: <Send className="w-4 h-4" />,
  },
  IN_PROGRESS: {
    label: "En cours",
    color: "bg-amber-100 text-amber-900",
    icon: <Clock className="w-4 h-4" />,
  },
  COMPLETED: {
    label: "Complète",
    color: "bg-green-100 text-green-900",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
};

// Mock campaigns
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    athleteName: "Lucas Martins",
    subject: "Student-athlete inquiry — midfielder from France",
    targetCount: 45,
    sentCount: 45,
    openedCount: 18,
    repliedCount: 4,
    status: "IN_PROGRESS",
    createdAt: "2026-03-15",
    sentAt: "2026-03-20",
  },
  {
    id: "2",
    athleteName: "Lucas Martins",
    subject: "Follow-up — NCAA D2 programs",
    targetCount: 32,
    sentCount: 28,
    openedCount: 8,
    repliedCount: 1,
    status: "SENT",
    createdAt: "2026-03-22",
    sentAt: "2026-03-25",
  },
  {
    id: "3",
    athleteName: "Sofia Chen",
    subject: "Forward from China — looking for D1/D2 opportunities",
    targetCount: 50,
    sentCount: 0,
    openedCount: 0,
    repliedCount: 0,
    status: "DRAFT",
    createdAt: "2026-03-28",
  },
];

function MetricBadge({
  icon: Icon,
  label,
  value,
  color = "text-graphite",
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className="font-mono text-graphite">{label}:</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-wider text-navy mb-1">
            Campagnes
          </h1>
          <p className="text-sm text-graphite font-mono">
            {campaigns.length} campagnes · suivi en temps réel des envois
          </p>
        </div>
        <Link href="/admin/campaigns/new">
          <Button variant="primary" size="lg">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle campagne
          </Button>
        </Link>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-2">
            Total envoyés
          </p>
          <p className="text-2xl font-display text-navy">
            {campaigns.reduce((sum, c) => sum + c.sentCount, 0)}
          </p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-2">
            Ouvertures
          </p>
          <p className="text-2xl font-display text-navy">
            {campaigns.reduce((sum, c) => sum + c.openedCount, 0)}
          </p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-2">
            Réponses
          </p>
          <p className="text-2xl font-display text-navy">
            {campaigns.reduce((sum, c) => sum + c.repliedCount, 0)}
          </p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-2">
            Taux d'ouverture
          </p>
          <p className="text-2xl font-display text-navy">
            {campaigns.length > 0
              ? Math.round(
                  (campaigns.reduce((sum, c) => sum + c.openedCount, 0) /
                    Math.max(campaigns.reduce((sum, c) => sum + c.sentCount, 0), 1)) *
                    100
                )
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="border border-line rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-paper">
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Athlète
              </th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Sujet
              </th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Statut
              </th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Métriques
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign, i) => {
              const cfg = STATUS_CONFIG[campaign.status];
              const openRate =
                campaign.sentCount > 0
                  ? Math.round((campaign.openedCount / campaign.sentCount) * 100)
                  : 0;

              return (
                <tr
                  key={campaign.id}
                  onClick={() => window.location.href = `/admin/campaigns/${campaign.id}`}
                  className={`border-b border-line last:border-0 hover:bg-paper transition-colors cursor-pointer ${
                    i % 2 === 0 ? "bg-white" : "bg-paper/40"
                  }`}
                >
                  <td className="px-5 py-4">
                    <span className="font-medium text-ink">{campaign.athleteName}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-graphite font-mono max-w-xs truncate block">
                      {campaign.subject}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono font-semibold ${cfg.color}`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-3">
                      <MetricBadge
                        icon={Send}
                        label="Envoyés"
                        value={campaign.sentCount}
                        color="text-navy"
                      />
                      <MetricBadge
                        icon={Eye}
                        label="Ouverts"
                        value={campaign.openedCount}
                        color="text-blue-600"
                      />
                      <MetricBadge
                        icon={MessageSquare}
                        label="Réponses"
                        value={campaign.repliedCount}
                        color="text-green-600"
                      />
                      <span className="text-xs font-mono text-graphite">
                        Taux: <span className="font-semibold text-ink">{openRate}%</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ChevronRight className="w-4 h-4 text-graphite ml-auto" />
                  </td>
                </tr>
              );
            })}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-graphite font-mono text-sm">
                  Aucune campagne créée. Commencez par{" "}
                  <Link href="/admin/campaigns/new" className="text-navy underline">
                    créer une campagne
                  </Link>
                  .
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Help */}
      <p className="mt-6 text-xs text-graphite font-mono text-center">
        📧 Les campagnes utilisent Gmail API v2 pour tracker : ouvertures, clics, réponses.
      </p>
    </div>
  );
}
