"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft, MapPin, Trophy, DollarSign, Users, Mail,
  ExternalLink, X, Send, Copy, CheckCircle2, Loader2,
  GraduationCap, Globe, Building2, BookOpen,
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
  region?: string | null;
  division?: string | null;
  conference?: string | null;
  enrollment?: number | null;
  type?: string | null;
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
  NCAA_D1: "NCAA D1", NCAA_D2: "NCAA D2", NCAA_D3: "NCAA D3",
  NAIA: "NAIA", NJCAA_D1: "NJCAA D1", NJCAA_D2: "NJCAA D2", NJCAA_D3: "NJCAA D3",
};

const DIVISION_COLORS: Record<string, string> = {
  NCAA_D1: "bg-navy text-paper",
  NCAA_D2: "bg-navy/80 text-paper",
  NCAA_D3: "bg-navy/60 text-paper",
  NAIA: "bg-gold text-white",
  NJCAA_D1: "bg-green-700 text-white",
  NJCAA_D2: "bg-green-600 text-white",
  NJCAA_D3: "bg-green-500 text-white",
};

const TEMPLATES = [
  { id: "1", name: "Contact initial — Soccer masculin", subject: "Student-athlete inquiry — {{position}} from {{country}}" },
  { id: "2", name: "Relance — 7 jours sans réponse", subject: "Following up — {{athleteFirstName}} {{athleteLastName}} — {{position}}" },
  { id: "3", name: "Contact initial — Soccer féminin", subject: "Female student-athlete inquiry — {{position}} from {{country}}" },
];

const COMPOSE_DEFAULTS = {
  athleteFirstName: "Lucas", athleteLastName: "Martins",
  position: "midfielder", country: "France", age: "18",
  currentClub: "Paris FC U19", gpa: "3.4", toefl: "98",
  highlightUrl: "https://youtube.com/watch?v=example",
  athleteEmail: "lucas.martins@example.com",
};

function extractDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function UniversityLogo({ name, websiteUrl }: { name: string; websiteUrl?: string | null }) {
  const [imgError, setImgError] = useState(false);
  const domain = extractDomain(websiteUrl);
  const initials = name
    .split(" ")
    .filter((w) => !["of", "the", "at", "and", "&", "University", "College"].includes(w))
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  if (domain && !imgError) {
    return (
      <div className="w-20 h-20 rounded-lg border border-line bg-white flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
        <img
          src={`https://logo.clearbit.com/${domain}`}
          alt={`Logo ${name}`}
          className="w-16 h-16 object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className="w-20 h-20 rounded-lg border border-line bg-navy/10 flex items-center justify-center flex-shrink-0 shadow-sm">
      <span className="text-2xl font-display font-bold text-navy">{initials || "U"}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex justify-between py-2.5 border-b border-line last:border-0">
      <span className="text-sm font-mono text-graphite">{label}</span>
      <span className="text-sm text-ink font-medium">{value}</span>
    </div>
  );
}

function usd(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

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
    const greeting = coach.lastName ? `Dear Coach ${coach.lastName},` : `Dear Coach,`;
    setComposeBody(
      `${greeting}\n\nMy name is ${vars.athleteFirstName} ${vars.athleteLastName}, a ${vars.age}-year-old ${vars.position} from ${vars.country}.\n\nI am writing to express my strong interest in playing soccer for ${university.name}. I have followed your program closely and believe it would be an excellent fit for both my athletic and academic goals.\n\nSporting profile:\n- Current club: ${vars.currentClub}\n- GPA (converted): ${vars.gpa}/4.0\n- TOEFL: ${vars.toefl}\n- Highlight video: ${vars.highlightUrl}\n\nI would be honored to discuss the possibility of joining your program.\n\nBest regards,\n${vars.athleteFirstName} ${vars.athleteLastName}\n${vars.athleteEmail}`
    );
    setComposeSent(false);
    setComposeCopied(false);
  }

  const coaches = university?.coaches ?? [];
  const headCoach = useMemo(() => coaches.find((c) => c.isHeadCoach), [coaches]);
  const assistantCoaches = useMemo(() => coaches.filter((c) => !c.isHeadCoach), [coaches]);

  function coachName(coach: Coach) {
    const full = `${coach.firstName ?? ""} ${coach.lastName ?? ""}`.trim();
    return full || null;
  }

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

  const totalCostOutOfState =
    university.tuitionOutOfState && university.roomAndBoard
      ? university.tuitionOutOfState + university.roomAndBoard
      : null;

  const divLabel = university.division ? (DIVISION_LABELS[university.division] ?? university.division) : null;
  const divColor = university.division ? (DIVISION_COLORS[university.division] ?? "bg-stone text-ink") : "bg-stone text-ink";

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Back */}
      <Link href="/admin/universities" className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite hover:text-navy mb-5">
        <ChevronLeft className="w-4 h-4" /> Retour aux universités
      </Link>

      {/* Header card */}
      <div className="bg-white border border-line rounded-lg p-6 mb-6">
        <div className="flex items-start gap-5">
          <UniversityLogo name={university.name} websiteUrl={university.websiteUrl} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-display uppercase tracking-wider text-navy leading-tight mb-2">
                  {university.name}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  {(university.city || university.state) && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite">
                      <MapPin className="w-3.5 h-3.5" />
                      {[university.city, university.state].filter(Boolean).join(", ")}
                    </span>
                  )}
                  {university.region && (
                    <span className="text-sm font-mono text-stone">· {university.region}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {divLabel && (
                    <span className={`px-2.5 py-0.5 text-xs font-mono font-semibold rounded ${divColor}`}>
                      {divLabel}
                    </span>
                  )}
                  {university.conference && (
                    <span className="px-2.5 py-0.5 text-xs font-mono bg-paper border border-line text-graphite rounded">
                      {university.conference}
                    </span>
                  )}
                  {university.type && (
                    <span className="text-xs font-mono text-stone">{university.type}</span>
                  )}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-2 flex-shrink-0">
                {university.websiteUrl && (
                  <a
                    href={university.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper border border-line text-graphite text-xs font-mono rounded hover:border-graphite transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" /> Site
                  </a>
                )}
                {university.athleticsUrl && (
                  <a
                    href={university.athleticsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-navy text-paper text-xs font-mono rounded hover:bg-navy/90 transition-colors"
                  >
                    <Trophy className="w-3.5 h-3.5" /> Athletics
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key stats bar */}
        <div className="mt-5 pt-5 border-t border-line grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-stone mb-1">Effectif</p>
            <p className="text-lg font-semibold text-ink">
              {university.enrollment ? university.enrollment.toLocaleString("en-US") : "—"}
            </p>
            <p className="text-xs font-mono text-graphite">étudiants</p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-stone mb-1">Taux d&apos;admission</p>
            <p className="text-lg font-semibold text-ink">
              {university.acceptanceRate ? `${Math.round(university.acceptanceRate * 100)}%` : "—"}
            </p>
            <p className="text-xs font-mono text-graphite">acceptation</p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-stone mb-1">Coût annuel</p>
            <p className="text-lg font-semibold text-ink">
              {university.tuitionOutOfState ? usd(university.tuitionOutOfState) : "—"}
            </p>
            <p className="text-xs font-mono text-graphite">out-of-state</p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-stone mb-1">Bourses</p>
            <p className="text-lg font-semibold text-ink">
              {university.scholarshipsTotal ?? "—"}
            </p>
            <p className="text-xs font-mono text-graphite">équivalents soccer</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: info cards */}
        <div className="col-span-2 space-y-4">

          {/* Académique */}
          {(university.satAvgLow || university.actAvgLow || university.acceptanceRate) && (
            <div className="bg-white border border-line rounded-lg p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Admission académique
              </h3>
              <InfoRow label="SAT moyen" value={university.satAvgLow && university.satAvgHigh ? `${university.satAvgLow}–${university.satAvgHigh}` : null} />
              <InfoRow label="ACT moyen" value={university.actAvgLow && university.actAvgHigh ? `${university.actAvgLow}–${university.actAvgHigh}` : null} />
              <InfoRow label="Taux d'acceptation" value={university.acceptanceRate ? `${Math.round(university.acceptanceRate * 100)}%` : null} />
            </div>
          )}

          {/* Finances */}
          {(university.tuitionInState || university.tuitionOutOfState || university.roomAndBoard) && (
            <div className="bg-white border border-line rounded-lg p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Coûts (USD/an)
              </h3>
              <InfoRow label="Frais scolarité (in-state)" value={university.tuitionInState ? usd(university.tuitionInState) : null} />
              <InfoRow label="Frais scolarité (out-of-state)" value={university.tuitionOutOfState ? usd(university.tuitionOutOfState) : null} />
              <InfoRow label="Logement & repas" value={university.roomAndBoard ? usd(university.roomAndBoard) : null} />
              {totalCostOutOfState && (
                <div className="flex justify-between pt-2.5 mt-1">
                  <span className="text-sm font-semibold text-graphite">Total estimé (out-of-state)</span>
                  <span className="text-sm font-bold text-navy">{usd(totalCostOutOfState)}</span>
                </div>
              )}
            </div>
          )}

          {/* Programme sportif */}
          {(university.rosterSize || university.scholarshipsTotal || university.conference) && (
            <div className="bg-white border border-line rounded-lg p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4" /> Programme sportif
              </h3>
              <InfoRow label="Division" value={divLabel} />
              <InfoRow label="Conférence" value={university.conference} />
              <InfoRow label="Effectif équipe (roster)" value={university.rosterSize} />
              <InfoRow label="Bourses athlétiques (équiv.)" value={university.scholarshipsTotal} />
            </div>
          )}

          {/* Établissement */}
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Établissement
            </h3>
            <InfoRow label="Type" value={university.type} />
            <InfoRow label="Étudiants inscrits" value={university.enrollment ? university.enrollment.toLocaleString("en-US") : null} />
            <InfoRow label="Ville" value={university.city} />
            <InfoRow label="État" value={university.state} />
            <InfoRow label="Région" value={university.region} />
          </div>

          {/* Notes agent */}
          {university.agentNotes && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-amber-700 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Notes Agent
              </h3>
              <p className="text-sm text-ink leading-relaxed">{university.agentNotes}</p>
            </div>
          )}
        </div>

        {/* Right: Coaches */}
        <div className="col-span-1">
          <div className="bg-white border border-line rounded-lg p-5 sticky top-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Coachs ({coaches.length})
            </h3>

            {coaches.length === 0 && (
              <p className="text-sm text-graphite font-mono">Aucun coach renseigné.</p>
            )}

            <div className="space-y-4">
              {headCoach && (
                <div className="pb-4 border-b border-line">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-navy text-paper text-xs font-mono font-semibold rounded">
                      Head Coach
                    </span>
                    {headCoach.email && (
                      <button
                        onClick={() => openCompose(headCoach)}
                        className="inline-flex items-center gap-1 text-xs font-mono text-navy hover:underline"
                      >
                        <Mail className="w-3 h-3" /> Composer
                      </button>
                    )}
                  </div>
                  {coachName(headCoach)
                    ? <p className="font-semibold text-ink text-sm mt-1">{coachName(headCoach)}</p>
                    : <p className="text-xs font-mono text-graphite italic mt-1">Nom non renseigné</p>
                  }
                  {headCoach.title && <p className="text-xs text-graphite font-mono mt-0.5">{headCoach.title}</p>}
                  {headCoach.email && (
                    <a href={`mailto:${headCoach.email}`} className="flex items-center gap-1.5 text-xs text-navy font-mono mt-2 hover:underline break-all">
                      <Mail className="w-3 h-3 flex-shrink-0" />{headCoach.email}
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
                      <div className="min-w-0">
                        {coachName(coach)
                          ? <p className="font-medium text-ink text-sm">{coachName(coach)}</p>
                          : <p className="text-xs font-mono text-graphite italic">Nom non renseigné</p>
                        }
                        {coach.title && <p className="text-xs text-graphite font-mono mt-0.5">{coach.title}</p>}
                      </div>
                      {coach.email && (
                        <button
                          onClick={() => openCompose(coach)}
                          className="inline-flex items-center gap-1 text-xs font-mono text-navy hover:underline flex-shrink-0"
                        >
                          <Mail className="w-3 h-3" /> Composer
                        </button>
                      )}
                    </div>
                    {coach.email && (
                      <a href={`mailto:${coach.email}`} className="flex items-center gap-1.5 text-xs text-navy font-mono mt-1.5 hover:underline break-all">
                        <Mail className="w-3 h-3 flex-shrink-0" />{coach.email}
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
                  À : {coachName(composeCoach) ?? "Coach"} — {composeCoach.email ?? "email non renseigné"}
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
                    onClick={() => {
                      navigator.clipboard.writeText(`To: ${composeCoach.email}\nSubject: ${composeSubject}\n\n${composeBody}`).catch(() => {});
                      setComposeCopied(true);
                      setTimeout(() => setComposeCopied(false), 2000);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-line rounded text-sm font-mono text-graphite hover:text-ink"
                  >
                    <Copy className="w-4 h-4" />{composeCopied ? "Copié !" : "Copier tout"}
                  </button>
                  <button
                    onClick={() => setComposeSent(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-navy text-paper rounded text-sm font-mono hover:bg-navy/90"
                  >
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
