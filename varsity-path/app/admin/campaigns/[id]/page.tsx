"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, Mail, Eye, MessageSquare, Send, MoreVertical,
  CheckCircle2, Clock, AlertCircle, XCircle
} from "lucide-react";

type EmailStatus = "DRAFT" | "SENT" | "OPENED" | "REPLIED" | "BOUNCED";

interface CampaignContact {
  id: string;
  coachName: string;
  universityName: string;
  email: string;
  status: EmailStatus;
  sentAt?: string;
  openedAt?: string;
  repliedAt?: string;
  notes?: string;
}

const STATUS_CONFIG: Record<EmailStatus, { label: string; color: string; icon: JSX.Element }> = {
  DRAFT: {
    label: "Brouillon",
    color: "bg-stone text-ink",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  SENT: {
    label: "Envoyé",
    color: "bg-blue-100 text-navy",
    icon: <Send className="w-4 h-4" />,
  },
  OPENED: {
    label: "Ouvert",
    color: "bg-amber-100 text-amber-900",
    icon: <Eye className="w-4 h-4" />,
  },
  REPLIED: {
    label: "Répondu",
    color: "bg-green-100 text-green-900",
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  BOUNCED: {
    label: "Rejeté",
    color: "bg-red-100 text-red-900",
    icon: <XCircle className="w-4 h-4" />,
  },
};

// Mock campaign and contacts data
const MOCK_CAMPAIGN = {
  id: "1",
  athleteName: "Lucas Martins",
  athleteId: "1",
  subject: "Student-athlete inquiry — midfielder from France",
  bodyHtml: "Dear Coach,\n\nI am Lucas Martins, a 18-year-old midfielder from France. I am writing to express my interest in playing soccer for your university...",
  status: "IN_PROGRESS" as const,
  createdAt: "2026-03-15",
  sentAt: "2026-03-20",
  targetCount: 45,
  sentCount: 45,
  openedCount: 18,
  repliedCount: 4,
};

const MOCK_CONTACTS: CampaignContact[] = [
  {
    id: "c1",
    coachName: "Marcus Johnson",
    universityName: "University of Virginia",
    email: "mjohnson@virginia.edu",
    status: "REPLIED",
    sentAt: "2026-03-20",
    openedAt: "2026-03-20",
    repliedAt: "2026-03-22",
    notes: "Interested in highlights video",
  },
  {
    id: "c2",
    coachName: "David Miller",
    universityName: "University of Virginia",
    email: "dmiller@virginia.edu",
    status: "OPENED",
    sentAt: "2026-03-20",
    openedAt: "2026-03-21",
  },
  {
    id: "c3",
    coachName: "Rachel Williams",
    universityName: "Duke University",
    email: "rwilliams@duke.edu",
    status: "OPENED",
    sentAt: "2026-03-20",
    openedAt: "2026-03-22",
  },
  {
    id: "c4",
    coachName: "James Brown",
    universityName: "Grand Valley State University",
    email: "jbrown@gvsu.edu",
    status: "SENT",
    sentAt: "2026-03-20",
  },
  {
    id: "c5",
    coachName: "Lisa Taylor",
    universityName: "Messiah University",
    email: "ltaylor@messiah.edu",
    status: "BOUNCED",
    sentAt: "2026-03-20",
  },
];

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = MOCK_CAMPAIGN;
  const [contacts, setContacts] = useState<CampaignContact[]>(MOCK_CONTACTS);
  const [filterStatus, setFilterStatus] = useState<EmailStatus | "">("");
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const sent = contacts.filter((c) => c.status !== "DRAFT").length;
    const opened = contacts.filter((c) => ["OPENED", "REPLIED"].includes(c.status)).length;
    const replied = contacts.filter((c) => c.status === "REPLIED").length;
    const bounced = contacts.filter((c) => c.status === "BOUNCED").length;
    const openRate = sent > 0 ? Math.round((opened / sent) * 100) : 0;

    return { sent, opened, replied, bounced, openRate };
  }, [contacts]);

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchSearch =
        !search ||
        c.coachName.toLowerCase().includes(search.toLowerCase()) ||
        c.universityName.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !filterStatus || c.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [contacts, search, filterStatus]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/campaigns"
          className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite hover:text-navy mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux campagnes
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-display uppercase tracking-wider text-navy mb-2">
              {campaign.subject}
            </h1>
            <p className="text-sm text-graphite font-mono">
              Athlète: <span className="font-semibold text-ink">{campaign.athleteName}</span> · Créée le{" "}
              {new Date(campaign.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <Button variant="outline" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-2">Envoyés</p>
          <p className="text-2xl font-display text-navy">{stats.sent}</p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-2">Ouvertures</p>
          <p className="text-2xl font-display text-navy">{stats.opened}</p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-2">Réponses</p>
          <p className="text-2xl font-display text-navy">{stats.replied}</p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-2">Taux ouverture</p>
          <p className="text-2xl font-display text-navy">{stats.openRate}%</p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-2">Rejetés</p>
          <p className="text-2xl font-display text-navy">{stats.bounced}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Rechercher coach, université..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-line rounded px-3 py-2 text-sm font-mono bg-white text-ink focus:outline-none focus:border-navy"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as EmailStatus | "")}
          className="border border-line rounded px-3 py-2 text-sm font-mono bg-white text-ink focus:outline-none focus:border-navy"
        >
          <option value="">Tous les statuts</option>
          <option value="DRAFT">Brouillon</option>
          <option value="SENT">Envoyé</option>
          <option value="OPENED">Ouvert</option>
          <option value="REPLIED">Répondu</option>
          <option value="BOUNCED">Rejeté</option>
        </select>
        {(search || filterStatus) && (
          <button
            onClick={() => {
              setSearch("");
              setFilterStatus("");
            }}
            className="px-4 py-2 text-sm font-mono text-graphite hover:text-ink border border-line rounded"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Contacts Table */}
      <div className="border border-line rounded-lg overflow-hidden bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-paper">
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Coach
              </th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Université
              </th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Email
              </th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Statut
              </th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Dates
              </th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((contact, i) => {
              const cfg = STATUS_CONFIG[contact.status];
              return (
                <tr
                  key={contact.id}
                  className={`border-b border-line last:border-0 hover:bg-paper transition-colors ${
                    i % 2 === 0 ? "bg-white" : "bg-paper/40"
                  }`}
                >
                  <td className="px-5 py-4">
                    <span className="font-medium text-ink">{contact.coachName}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-graphite font-mono">{contact.universityName}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-navy font-mono underline cursor-pointer hover:text-navy-600">
                      {contact.email}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono font-semibold ${cfg.color}`}>
                      {cfg.icon}
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs font-mono text-graphite space-y-0.5">
                      {contact.sentAt && (
                        <div>
                          <span className="text-graphite">Envoyé:</span>{" "}
                          <span className="text-ink">
                            {new Date(contact.sentAt).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      )}
                      {contact.openedAt && (
                        <div>
                          <span className="text-graphite">Ouvert:</span>{" "}
                          <span className="text-ink">
                            {new Date(contact.openedAt).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      )}
                      {contact.repliedAt && (
                        <div>
                          <span className="text-graphite">Répondu:</span>{" "}
                          <span className="text-ink">
                            {new Date(contact.repliedAt).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-graphite">{contact.notes || "—"}</span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-graphite font-mono text-sm">
                  Aucun contact ne correspond à ces critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Email Preview */}
      <div className="mt-8 bg-white border border-line rounded-lg p-6">
        <h3 className="text-sm font-mono uppercase tracking-widest text-graphite mb-4">
          Aperçu du message envoyé
        </h3>
        <div className="bg-paper border border-line rounded p-4">
          <div className="mb-4 pb-4 border-b border-line">
            <p className="text-xs text-graphite font-mono mb-1">À: [coach@email.com]</p>
            <p className="text-xs text-graphite font-mono">Sujet: {campaign.subject}</p>
          </div>
          <div className="text-sm text-ink leading-relaxed whitespace-pre-wrap font-mono">
            {campaign.bodyHtml}
          </div>
        </div>
      </div>
    </div>
  );
}
