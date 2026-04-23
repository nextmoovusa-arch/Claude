"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft, Mail, Eye, MessageSquare, Send, RefreshCw,
  CheckCircle2, Clock, AlertCircle, XCircle, Edit3, Save, X,
  Copy, ExternalLink
} from "lucide-react";

type EmailStatus = "DRAFT" | "SENT" | "OPENED" | "REPLIED" | "BOUNCED";

interface CampaignContact {
  id: string;
  coachName: string;
  universityName: string;
  universityId: string;
  email: string;
  status: EmailStatus;
  sentAt?: string;
  openedAt?: string;
  repliedAt?: string;
  notes?: string;
  replyContent?: string;
}

const STATUS_CONFIG: Record<EmailStatus, { label: string; color: string; icon: React.ReactNode }> = {
  DRAFT:   { label: "Brouillon", color: "bg-stone text-ink",           icon: <AlertCircle className="w-3.5 h-3.5" /> },
  SENT:    { label: "Envoyé",    color: "bg-blue-100 text-navy",        icon: <Send className="w-3.5 h-3.5" /> },
  OPENED:  { label: "Ouvert",    color: "bg-amber-100 text-amber-900",  icon: <Eye className="w-3.5 h-3.5" /> },
  REPLIED: { label: "Répondu",   color: "bg-green-100 text-green-900",  icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  BOUNCED: { label: "Rejeté",    color: "bg-red-100 text-red-900",      icon: <XCircle className="w-3.5 h-3.5" /> },
};

const MOCK_CAMPAIGN = {
  id: "1",
  athleteName: "Lucas Martins",
  athleteId: "1",
  subject: "Student-athlete inquiry — midfielder from France",
  bodyHtml: `Dear Coach {{coachLastName}},

My name is Lucas Martins, a 18-year-old midfielder from France / Brazil.

I am writing to express my strong interest in playing soccer for {{universityName}}. I have followed your program closely and believe it would be an excellent fit for both my athletic and academic goals.

Sporting profile:
- Current club: Paris FC U19
- GPA (converted): 3.4/4.0
- TOEFL: 98
- Highlight video: https://youtube.com/watch?v=example

I would be honored to discuss the possibility of joining your program.

Best regards,
Lucas Martins`,
  status: "IN_PROGRESS" as const,
  createdAt: "2026-03-15",
  sentAt: "2026-03-20",
};

const MOCK_CONTACTS: CampaignContact[] = [
  { id: "c1", coachName: "Marcus Johnson",  universityName: "University of Virginia",        universityId: "1", email: "mjohnson@virginia.edu", status: "REPLIED",  sentAt: "2026-03-20", openedAt: "2026-03-20", repliedAt: "2026-03-22", notes: "Intéressé, demande vidéo supplémentaire", replyContent: "Dear Lucas, thank you for reaching out. We would love to see more footage..." },
  { id: "c2", coachName: "David Miller",    universityName: "University of Virginia",        universityId: "1", email: "dmiller@virginia.edu",  status: "OPENED",   sentAt: "2026-03-20", openedAt: "2026-03-21" },
  { id: "c3", coachName: "Rachel Williams", universityName: "Duke University",               universityId: "2", email: "rwilliams@duke.edu",    status: "REPLIED",  sentAt: "2026-03-20", openedAt: "2026-03-22", repliedAt: "2026-03-24", notes: "Souhaite planifier un appel vidéo", replyContent: "Hi Lucas, we are very interested in your profile. Can we schedule a Zoom call?" },
  { id: "c4", coachName: "James Brown",     universityName: "Grand Valley State University", universityId: "5", email: "jbrown@gvsu.edu",       status: "OPENED",   sentAt: "2026-03-20", openedAt: "2026-03-23" },
  { id: "c5", coachName: "Lisa Taylor",     universityName: "Messiah University",            universityId: "7", email: "ltaylor@messiah.edu",   status: "BOUNCED",  sentAt: "2026-03-20" },
  { id: "c6", coachName: "Kevin Park",      universityName: "Indiana University",            universityId: "3", email: "kpark@indiana.edu",     status: "SENT",     sentAt: "2026-03-20" },
  { id: "c7", coachName: "Amy Chen",        universityName: "Creighton University",          universityId: "10",email: "achen@creighton.edu",   status: "SENT",     sentAt: "2026-03-20" },
];

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  const campaign = MOCK_CAMPAIGN;
  const [contacts, setContacts] = useState<CampaignContact[]>(MOCK_CONTACTS);
  const [filterStatus, setFilterStatus] = useState<EmailStatus | "">("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftNotes, setDraftNotes] = useState("");
  const [draftStatus, setDraftStatus] = useState<EmailStatus>("SENT");
  const [expandedReply, setExpandedReply] = useState<string | null>(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [copied, setCopied] = useState(false);

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

  function startEdit(contact: CampaignContact) {
    setEditingId(contact.id);
    setDraftNotes(contact.notes ?? "");
    setDraftStatus(contact.status);
  }

  function saveEdit(id: string) {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              notes: draftNotes,
              status: draftStatus,
              repliedAt: draftStatus === "REPLIED" && !c.repliedAt ? new Date().toISOString().split("T")[0] : c.repliedAt,
              openedAt: (draftStatus === "OPENED" || draftStatus === "REPLIED") && !c.openedAt ? new Date().toISOString().split("T")[0] : c.openedAt,
            }
          : c
      )
    );
    setEditingId(null);
  }

  function copyEmail(email: string) {
    navigator.clipboard.writeText(email).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

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
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-display uppercase tracking-wider text-navy mb-2 truncate">
              {campaign.subject}
            </h1>
            <p className="text-sm text-graphite font-mono">
              Athlète:{" "}
              <Link href={`/admin/athletes/${campaign.athleteId}`} className="font-semibold text-navy hover:underline">
                {campaign.athleteName}
              </Link>{" "}
              · Envoyée le {new Date(campaign.sentAt).toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={() => setShowEmailPreview((p) => !p)}>
              <Eye className="w-4 h-4 mr-2" />
              {showEmailPreview ? "Masquer" : "Voir"} l'email
            </Button>
            <Button variant="primary" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Relance auto
            </Button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-5 gap-px border border-line bg-line rounded-lg overflow-hidden mb-8">
        {[
          { label: "Envoyés",        value: stats.sent,     color: "text-ink" },
          { label: "Ouvertures",     value: stats.opened,   color: "text-amber-700" },
          { label: "Réponses",       value: stats.replied,  color: "text-green-700" },
          { label: "Taux ouverture", value: `${stats.openRate}%`, color: "text-navy" },
          { label: "Rejetés",        value: stats.bounced,  color: "text-red-flag" },
        ].map((s) => (
          <div key={s.label} className="bg-white px-6 py-4">
            <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-3xl font-display ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Email preview panel */}
      {showEmailPreview && (
        <div className="bg-white border border-line rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono uppercase tracking-widest text-graphite">Email envoyé</h3>
            <button onClick={() => setShowEmailPreview(false)}>
              <X className="w-4 h-4 text-graphite hover:text-ink" />
            </button>
          </div>
          <div className="bg-paper border border-line rounded p-4">
            <p className="text-xs font-mono text-graphite mb-1">Sujet :</p>
            <p className="text-sm font-medium text-ink mb-4">{campaign.subject}</p>
            <pre className="text-sm text-ink leading-relaxed whitespace-pre-wrap font-sans">
              {campaign.bodyHtml}
            </pre>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Rechercher coach, université ou email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-line rounded px-3 py-2 text-sm font-mono bg-white text-ink focus:outline-none focus:border-navy"
        />
        <div className="flex gap-1.5">
          {(["", "SENT", "OPENED", "REPLIED", "BOUNCED"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s as EmailStatus | "")}
              className={`px-3 py-2 text-xs font-mono rounded border transition-colors ${
                filterStatus === s
                  ? "bg-navy text-paper border-navy"
                  : "bg-white border-line text-graphite hover:border-graphite"
              }`}
            >
              {s === "" ? `Tous (${contacts.length})` : STATUS_CONFIG[s as EmailStatus].label}
            </button>
          ))}
        </div>
        {(search || filterStatus) && (
          <button
            onClick={() => { setSearch(""); setFilterStatus(""); }}
            className="px-3 py-2 text-sm font-mono text-graphite hover:text-ink border border-line rounded"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Contacts table */}
      <div className="border border-line rounded-lg overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-paper">
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Coach</th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Université</th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Email</th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Statut</th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Dates</th>
              <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Notes</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((contact, i) => {
              const cfg = STATUS_CONFIG[contact.status];
              const isEditing = editingId === contact.id;
              return (
                <>
                  <tr
                    key={contact.id}
                    className={`border-b border-line last:border-0 transition-colors ${
                      isEditing ? "bg-navy/5" : i % 2 === 0 ? "bg-white hover:bg-paper" : "bg-paper/40 hover:bg-paper"
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-ink">{contact.coachName}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/universities/${contact.universityId}`}
                        className="text-sm text-graphite font-mono hover:text-navy hover:underline"
                      >
                        {contact.universityName}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <a href={`mailto:${contact.email}`} className="text-sm text-navy font-mono hover:underline">
                          {contact.email}
                        </a>
                        <button
                          onClick={() => copyEmail(contact.email)}
                          className="text-graphite hover:text-navy transition-colors"
                          title="Copier l'email"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {isEditing ? (
                        <select
                          value={draftStatus}
                          onChange={(e) => setDraftStatus(e.target.value as EmailStatus)}
                          className="text-xs font-mono border border-line rounded px-2 py-1 bg-white"
                        >
                          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-semibold ${cfg.color}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-xs font-mono text-graphite space-y-0.5">
                        {contact.sentAt && <div><span className="text-graphite">Envoyé:</span> <span className="text-ink">{new Date(contact.sentAt).toLocaleDateString("fr-FR")}</span></div>}
                        {contact.openedAt && <div><span className="text-graphite">Ouvert:</span> <span className="text-ink">{new Date(contact.openedAt).toLocaleDateString("fr-FR")}</span></div>}
                        {contact.repliedAt && <div><span className="text-green-700 font-semibold">Répondu:</span> <span className="text-green-700 font-semibold">{new Date(contact.repliedAt).toLocaleDateString("fr-FR")}</span></div>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 max-w-xs">
                      {isEditing ? (
                        <input
                          value={draftNotes}
                          onChange={(e) => setDraftNotes(e.target.value)}
                          className="w-full text-xs font-mono border border-line rounded px-2 py-1"
                          placeholder="Notes sur cette réponse..."
                          autoFocus
                        />
                      ) : (
                        <p className="text-xs text-graphite truncate">{contact.notes || "—"}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 justify-end">
                        {isEditing ? (
                          <>
                            <button onClick={() => saveEdit(contact.id)} className="p-1 text-green-600 hover:text-green-700" title="Sauvegarder">
                              <Save className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="p-1 text-graphite hover:text-ink" title="Annuler">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            {contact.replyContent && (
                              <button
                                onClick={() => setExpandedReply(expandedReply === contact.id ? null : contact.id)}
                                className="p-1 text-graphite hover:text-green-700"
                                title="Voir la réponse"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => startEdit(contact)} className="p-1 text-graphite hover:text-navy" title="Modifier statut / notes">
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <a href={`/admin/universities/${contact.universityId}`} className="p-1 text-graphite hover:text-navy" title="Voir université">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {/* Reply expansion row */}
                  {expandedReply === contact.id && contact.replyContent && (
                    <tr key={`${contact.id}-reply`} className="border-b border-line bg-green-50">
                      <td colSpan={7} className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-mono text-green-800 font-semibold mb-1">
                              Réponse de {contact.coachName} · {contact.repliedAt && new Date(contact.repliedAt).toLocaleDateString("fr-FR")}
                            </p>
                            <p className="text-sm text-green-900 leading-relaxed">{contact.replyContent}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-graphite font-mono text-sm">
                  Aucun contact ne correspond à ces critères.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {copied && (
        <div className="fixed bottom-6 right-6 bg-ink text-paper text-xs font-mono px-4 py-2 rounded shadow-lg">
          Email copié !
        </div>
      )}
    </div>
  );
}
