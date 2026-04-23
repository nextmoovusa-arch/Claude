"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft, MapPin, Trophy, DollarSign, Users, Mail,
  ExternalLink, X, Send, Copy, CheckCircle2, Loader2
} from "lucide-react";

type Coach = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  title?: string | null;
  isHeadCoach: boolean;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
};

type University = {
  id: string;
  name: string;
  slug: string;
  city?: string | null;
  state?: string | null;
  division?: string | null;
  satAvgLow?: number | null;
  satAvgHigh?: number | null;
  actAvgLow?: number | null;
  actAvgHigh?: number | null;
  acceptanceRate?: number | null;
  tuitionInState?: number | null;
  tuitionOutOfState?: number | null;
  roomAndBoard?: number | null;
  rosterSize?: number | null;
  scholarshipsTotal?: number | null;
  websiteUrl?: string | null;
  athleticsUrl?: string | null;
  agentNotes?: string | null;
  coaches: Coach[];
};

const DIVISION_LABELS: Record<string, string> = {
  NCAA_D1: "NCAA Division 1", NCAA_D2: "NCAA Division 2", NCAA_D3: "NCAA Division 3",
  NAIA: "NAIA", NJCAA_D1: "NJCAA Division 1", NJCAA_D2: "NJCAA Division 2", NJCAA_D3: "NJCAA Division 3",
};

const TEMPLATES = [
  { id: "1", name: "Contact initial — Soccer masculin", subject: "Student-athlete inquiry — {{position}} from {{country}}" },
  { id: "2", name: "Relance — 7 jours sans réponse",   subject: "Following up — {{athleteFirstName}} {{athleteLastName}} — {{position}}" },
  { id: "3", name: "Contact initial — Soccer féminin",  subject: "Female student-athlete inquiry — {{position}} from {{country}}" },
];

const COMPOSE_DEFAULTS = {
  athleteFirstName: "Lucas", athleteLastName: "Martins",
  position: "midfielder", country: "France", age: "18",
  currentClub: "Paris FC U19", gpa: "3.4", toefl: "98",
  highlightUrl: "https://youtube.com/watch?v=example",
  athleteEmail: "lucas.martins@example.com",
};

export default function UniversityDetailPage({ params }: { params: { id: string } }) {
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [composeCoach, setComposeCoach] = useState<Coach | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeSent, setComposeSent] = useState(false);
  const [composeCopied, setComposeCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/universities/${params.id}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => { if (data) setUniversity(data); })
      .finally(() => setLoading(false));
  }, [params.id]);

  function openCompose(coach: Coach) {
    if (!university) return;
    const tpl = TEMPLATES.find((t) => t.id === selectedTemplate) ?? TEMPLATES[0];
    const vars: Record<string, string> = { ...COMPOSE_DEFAULTS, coachLastName: coach.lastName, universityName: university.name };
    const fill = (s: string) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
    setComposeCoach(coach);
    setComposeSubject(fill(tpl.subject));
    setComposeBody(fill(
      `Dear Coach ${coach.lastName},\n\nMy name is ${vars.athleteFirstName} ${vars.athleteLastName}, a ${vars.age}-year-old ${vars.position} from ${vars.country}.\n\nI am writing to express my strong interest in playing soccer for ${university.name}. I have followed your program closely and believe it would be an excellent fit for both my athletic and academic goals.\n\nSporting profile:\n- Current club: ${vars.currentClub}\n- GPA (converted): ${vars.gpa}/4.0\n- TOEFL: ${vars.toefl}\n- Highlight video: ${vars.highlightUrl}\n\nI would be honored to discuss the possibility of joining your program.\n\nBest regards,\n${vars.athleteFirstName} ${vars.athleteLastName}\n${vars.athleteEmail}`
    ));
    setComposeSent(false);
    setComposeCopied(false);
  }

  const coaches = university?.coaches ?? [];
  const headCoach = useMemo(() => coaches.find((c) => c.isHeadCoach), [coaches]);
  const assistantCoaches = useMemo(() => coaches.filter((c) => !c.isHeadCoach), [coaches]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <Loader2 className="w-6 h-6 animate-spin text-graphite" />
      </div>
    );
  }

  if (notFound || !university) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <Link href="/admin/universities" className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite hover:text-navy mb-6">
          <ChevronLeft className="w-4 h-4" /> Retour aux universités
        </Link>
        <p className="text-graphite font-mono">Université introuvable.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/universities" className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite hover:text-navy mb-3">
          <ChevronLeft className="w-4 h-4" /> Retour aux universités
        </Link>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-display uppercase tracking-wider text-navy mb-2">{university.name}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              {(university.city || university.state) && (
                <span className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite">
                  <MapPin className="w-4 h-4" />{university.city}{university.city && university.state ? ", " : ""}{university.state}
                </span>
              )}
              {university.division && (
                <span className="px-2 py-0.5 bg-navy text-paper text-xs font-mono rounded">
                  {DIVISION_LABELS[university.division] ?? university.division}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {(university.satAvgLow || university.acceptanceRate || university.rosterSize || university.scholarshipsTotal) && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {university.satAvgLow && university.satAvgHigh && (
            <div className="bg-white border border-line rounded-lg p-4">
              <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-2">SAT (Plage)</p>
              <p className="text-lg font-display text-navy">{university.satAvgLow}–{university.satAvgHigh}</p>
            </div>
          )}
          {university.acceptanceRate && (
            <div className="bg-white border border-line rounded-lg p-4">
              <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-2">Taux d&apos;acceptation</p>
              <p className="text-lg font-display text-navy">{Math.round(university.acceptanceRate * 100)}%</p>
            </div>
          )}
          {university.rosterSize && (
            <div className="bg-white border border-line rounded-lg p-4">
              <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-2">Effectif équipe</p>
              <p className="text-lg font-display text-navy">{university.rosterSize}</p>
            </div>
          )}
          {university.scholarshipsTotal && (
            <div className="bg-white border border-line rounded-lg p-4">
              <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-2">Bourses totales</p>
              <p className="text-lg font-display text-navy">{university.scholarshipsTotal}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Info */}
        <div className="col-span-2 space-y-6">
          {(university.satAvgLow || university.actAvgLow || university.acceptanceRate) && (
            <div className="bg-white border border-line rounded-lg p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Critères d&apos;admission
              </h3>
              <div className="space-y-0 text-sm">
                {university.satAvgLow && university.satAvgHigh && (
                  <div className="flex justify-between py-2 border-b border-line">
                    <span className="font-mono text-graphite">SAT moyen</span>
                    <span className="text-ink font-medium">{university.satAvgLow}–{university.satAvgHigh}</span>
                  </div>
                )}
                {university.actAvgLow && university.actAvgHigh && (
                  <div className="flex justify-between py-2 border-b border-line">
                    <span className="font-mono text-graphite">ACT moyen</span>
                    <span className="text-ink font-medium">{university.actAvgLow}–{university.actAvgHigh}</span>
                  </div>
                )}
                {university.acceptanceRate && (
                  <div className="flex justify-between py-2">
                    <span className="font-mono text-graphite">Taux d&apos;acceptation</span>
                    <span className="text-ink font-medium">{Math.round(university.acceptanceRate * 100)}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {(university.tuitionInState || university.tuitionOutOfState || university.roomAndBoard) && (
            <div className="bg-white border border-line rounded-lg p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Coûts
              </h3>
              <div className="space-y-0 text-sm">
                {university.tuitionInState && (
                  <div className="flex justify-between py-2 border-b border-line">
                    <span className="font-mono text-graphite">Frais in-state/an</span>
                    <span className="text-ink font-medium">${(university.tuitionInState / 1000).toFixed(0)}k</span>
                  </div>
                )}
                {university.tuitionOutOfState && (
                  <div className="flex justify-between py-2 border-b border-line">
                    <span className="font-mono text-graphite">Frais out-of-state/an</span>
                    <span className="text-ink font-medium">${(university.tuitionOutOfState / 1000).toFixed(0)}k</span>
                  </div>
                )}
                {university.roomAndBoard && (
                  <div className="flex justify-between py-2">
                    <span className="font-mono text-graphite">Logement & repas/an</span>
                    <span className="text-ink font-medium">${(university.roomAndBoard / 1000).toFixed(0)}k</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {university.agentNotes && (
            <div className="bg-white border border-line rounded-lg p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-3">Notes Agent</h3>
              <p className="text-sm text-ink leading-relaxed">{university.agentNotes}</p>
            </div>
          )}

          {(university.websiteUrl || university.athleticsUrl) && (
            <div className="bg-white border border-line rounded-lg p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-3">Ressources</h3>
              <div className="space-y-2">
                {university.websiteUrl && (
                  <a href={university.websiteUrl} target="_blank" rel="noopener noreferrer" className="block text-sm text-navy underline hover:opacity-75 font-mono">
                    → Site universitaire
                  </a>
                )}
                {university.athleticsUrl && (
                  <a href={university.athleticsUrl} target="_blank" rel="noopener noreferrer" className="block text-sm text-navy underline hover:opacity-75 font-mono">
                    → Site athletics
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Coaches */}
        <div className="col-span-1">
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Coachs ({coaches.length})
            </h3>

            {coaches.length === 0 && (
              <p className="text-sm text-graphite font-mono">Aucun coach renseigné.</p>
            )}

            <div className="space-y-4">
              {headCoach && (
                <div className="pb-4 border-b border-line">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-navy text-paper text-xs font-mono font-semibold rounded">Head Coach</span>
                    {headCoach.email && (
                      <button onClick={() => openCompose(headCoach)} className="inline-flex items-center gap-1 text-xs font-mono text-navy hover:underline">
                        <Mail className="w-3 h-3" /> Composer
                      </button>
                    )}
                  </div>
                  <p className="font-medium text-ink text-sm">{headCoach.firstName} {headCoach.lastName}</p>
                  {headCoach.title && <p className="text-xs text-graphite font-mono mt-1">{headCoach.title}</p>}
                  {headCoach.email && (
                    <a href={`mailto:${headCoach.email}`} className="flex items-center gap-1 text-xs text-navy font-mono mt-2 hover:underline">
                      <Mail className="w-3 h-3" />{headCoach.email}
                    </a>
                  )}
                  {headCoach.linkedinUrl && (
                    <a href={headCoach.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-navy font-mono mt-1 hover:underline">
                      <ExternalLink className="w-3 h-3" /> LinkedIn
                    </a>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {assistantCoaches.map((coach) => (
                  <div key={coach.id} className="pb-3 border-b border-line last:border-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-ink text-sm">{coach.firstName} {coach.lastName}</p>
                      {coach.email && (
                        <button onClick={() => openCompose(coach)} className="inline-flex items-center gap-1 text-xs font-mono text-navy hover:underline flex-shrink-0">
                          <Mail className="w-3 h-3" /> Composer
                        </button>
                      )}
                    </div>
                    {coach.title && <p className="text-xs text-graphite font-mono mt-0.5">{coach.title}</p>}
                    {coach.email && (
                      <a href={`mailto:${coach.email}`} className="flex items-center gap-1 text-xs text-navy font-mono mt-1.5 hover:underline">
                        <Mail className="w-3 h-3" />{coach.email}
                      </a>
                    )}
                    {coach.linkedinUrl && (
                      <a href={coach.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-navy font-mono hover:underline">
                        <ExternalLink className="w-3 h-3" /> LinkedIn
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compose modal */}
      {composeCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-line rounded-lg w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-line flex-shrink-0">
              <div>
                <h2 className="text-sm font-mono uppercase tracking-widest text-graphite">Composer un email</h2>
                <p className="text-xs font-mono text-stone mt-0.5">
                  À : {composeCoach.firstName} {composeCoach.lastName} — {composeCoach.email ?? "email non renseigné"}
                </p>
              </div>
              <button onClick={() => setComposeCoach(null)}><X className="w-4 h-4 text-graphite hover:text-ink" /></button>
            </div>

            {composeSent ? (
              <div className="p-10 text-center flex-1">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <p className="font-medium text-ink mb-1">Email préparé !</p>
                <p className="text-sm font-mono text-graphite mb-5">Copiez le contenu et envoyez via votre client email.</p>
                <button onClick={() => setComposeCoach(null)} className="px-4 py-2 bg-navy text-paper text-sm font-mono rounded">Fermer</button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-graphite block mb-2">Template</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => { setSelectedTemplate(e.target.value); openCompose(composeCoach); }}
                    className="w-full border border-line rounded px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:ring-1 focus:ring-navy"
                  >
                    {TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-graphite block mb-2">Sujet</label>
                  <input value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} className="w-full border border-line rounded px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:ring-1 focus:ring-navy" />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-graphite block mb-2">Corps</label>
                  <textarea value={composeBody} onChange={(e) => setComposeBody(e.target.value)} rows={12} className="w-full border border-line rounded px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:ring-1 focus:ring-navy resize-none" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => { navigator.clipboard.writeText(`To: ${composeCoach.email}\nSubject: ${composeSubject}\n\n${composeBody}`).catch(() => {}); setComposeCopied(true); setTimeout(() => setComposeCopied(false), 2000); }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-line rounded text-sm font-mono text-graphite hover:text-ink"
                  >
                    <Copy className="w-4 h-4" />{composeCopied ? "Copié !" : "Copier tout"}
                  </button>
                  <button onClick={() => setComposeSent(true)} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-navy text-paper rounded text-sm font-mono hover:bg-navy/90">
                    <Send className="w-4 h-4" /> Marquer comme envoyé
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
