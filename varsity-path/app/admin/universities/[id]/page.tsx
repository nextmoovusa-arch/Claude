"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft, MapPin, Trophy, DollarSign, Users, Mail,
  ExternalLink, Edit3, Plus, X, Send, Copy, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Coach = {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  title?: string;
  isHeadCoach: boolean;
  linkedinUrl?: string;
  twitterUrl?: string;
};

// Mock university data
const MOCK_UNIVERSITY = {
  id: "1",
  name: "University of Virginia",
  slug: "university-of-virginia",
  city: "Charlottesville",
  state: "VA",
  division: "NCAA_D1",
  region: "Southeast",
  country: "USA",
  latitude: 38.0336,
  longitude: -78.5022,
  satAvgLow: 1480,
  satAvgHigh: 1570,
  actAvgLow: 33,
  actAvgHigh: 35,
  acceptanceRate: 0.19,
  tuitionInState: 18000,
  tuitionOutOfState: 48000,
  roomAndBoard: 14000,
  rosterSize: 23,
  scholarshipsTotal: 11.5,
  websiteUrl: "https://www.virginia.edu",
  athleticsUrl: "https://virginiaathletics.com",
  agentNotes: "Excellent D1 program. Strong academics and athletic tradition.",
};

const MOCK_COACHES: Coach[] = [
  {
    id: "c1",
    firstName: "Marcus",
    lastName: "Johnson",
    email: "mjohnson@virginia.edu",
    phone: "(434) 123-4567",
    title: "Head Coach",
    isHeadCoach: true,
    linkedinUrl: "https://linkedin.com/in/marcus-johnson",
    twitterUrl: "https://twitter.com/marcusjohnson",
  },
  {
    id: "c2",
    firstName: "David",
    lastName: "Miller",
    email: "dmiller@virginia.edu",
    phone: "(434) 123-4568",
    title: "Assistant Coach",
    isHeadCoach: false,
    linkedinUrl: "https://linkedin.com/in/david-miller",
  },
  {
    id: "c3",
    firstName: "Jennifer",
    lastName: "Williams",
    email: "jwilliams@virginia.edu",
    title: "Recruiting Coordinator",
    isHeadCoach: false,
  },
];

const TEMPLATES = [
  { id: "1", name: "Contact initial — Soccer masculin",  subject: "Student-athlete inquiry — {{position}} from {{country}}" },
  { id: "2", name: "Relance — 7 jours sans réponse",    subject: "Following up — {{athleteFirstName}} {{athleteLastName}} — {{position}}" },
  { id: "3", name: "Contact initial — Soccer féminin",  subject: "Female student-athlete inquiry — {{position}} from {{country}}" },
];

const COMPOSE_DEFAULTS = {
  athleteFirstName: "Lucas",
  athleteLastName:  "Martins",
  position:         "midfielder",
  country:          "France",
  age:              "18",
  currentClub:      "Paris FC U19",
  gpa:              "3.4",
  toefl:            "98",
  highlightUrl:     "https://youtube.com/watch?v=example",
  athleteEmail:     "lucas.martins@example.com",
};

const DIVISION_LABELS: Record<string, string> = {
  NCAA_D1: "NCAA Division 1",
  NCAA_D2: "NCAA Division 2",
  NCAA_D3: "NCAA Division 3",
  NAIA: "NAIA",
  NJCAA_D1: "NJCAA Division 1",
  NJCAA_D2: "NJCAA Division 2",
  NJCAA_D3: "NJCAA Division 3",
};

export default function UniversityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const university = MOCK_UNIVERSITY;
  const [coaches, setCoaches] = useState<Coach[]>(MOCK_COACHES);
  const [composeCoach, setComposeCoach] = useState<Coach | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [composeSent, setComposeSent] = useState(false);
  const [composeCopied, setComposeCopied] = useState(false);

  function openCompose(coach: Coach) {
    const tpl = TEMPLATES.find((t) => t.id === selectedTemplate) ?? TEMPLATES[0];
    const vars: Record<string, string> = {
      ...COMPOSE_DEFAULTS,
      coachLastName: coach.lastName,
      universityName: university.name,
    };
    function fill(s: string) {
      return s.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
    }
    setComposeCoach(coach);
    setSelectedTemplate(tpl.id);
    setComposeSubject(fill(tpl.subject));
    setComposeBody(fill(`Dear Coach ${coach.lastName},\n\nMy name is ${vars.athleteFirstName} ${vars.athleteLastName}, a ${vars.age}-year-old ${vars.position} from ${vars.country}.\n\nI am writing to express my strong interest in playing soccer for ${university.name}. I have followed your program closely and believe it would be an excellent fit for both my athletic and academic goals.\n\nSporting profile:\n- Current club: ${vars.currentClub}\n- GPA (converted): ${vars.gpa}/4.0\n- TOEFL: ${vars.toefl}\n- Highlight video: ${vars.highlightUrl}\n\nI would be honored to discuss the possibility of joining your program.\n\nBest regards,\n${vars.athleteFirstName} ${vars.athleteLastName}\n${vars.athleteEmail}`));
    setComposeSent(false);
    setComposeCopied(false);
  }

  const headCoach = useMemo(
    () => coaches.find((c) => c.isHeadCoach),
    [coaches]
  );

  const assistantCoaches = useMemo(
    () => coaches.filter((c) => !c.isHeadCoach),
    [coaches]
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/universities"
          className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite hover:text-navy mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux universités
        </Link>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-display uppercase tracking-wider text-navy mb-2">
              {university.name}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite">
                <MapPin className="w-4 h-4" />
                {university.city}, {university.state}
              </span>
              <Badge variant="default">{DIVISION_LABELS[university.division]}</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Edit3 className="w-4 h-4 mr-2" />
            Modifier
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-2">
            SAT (Plage)
          </p>
          <p className="text-lg font-display text-navy">
            {university.satAvgLow}–{university.satAvgHigh}
          </p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-2">
            Taux d'acceptation
          </p>
          <p className="text-lg font-display text-navy">
            {Math.round(university.acceptanceRate * 100)}%
          </p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-2">
            Effectif équipe
          </p>
          <p className="text-lg font-display text-navy">{university.rosterSize}</p>
        </div>
        <div className="bg-white border border-line rounded-lg p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-2">
            Bourses totales
          </p>
          <p className="text-lg font-display text-navy">{university.scholarshipsTotal}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Info panels */}
        <div className="col-span-2 space-y-6">
          {/* Académique */}
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Critères d'admission
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between py-2 border-b border-line">
                <span className="font-mono text-graphite">SAT moyen (min-max)</span>
                <span className="text-ink font-medium">
                  {university.satAvgLow}–{university.satAvgHigh}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-line">
                <span className="font-mono text-graphite">ACT moyen (min-max)</span>
                <span className="text-ink font-medium">
                  {university.actAvgLow}–{university.actAvgHigh}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-mono text-graphite">Taux d'acceptation</span>
                <span className="text-ink font-medium">
                  {Math.round(university.acceptanceRate * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Financier */}
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Coûts
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between py-2 border-b border-line">
                <span className="font-mono text-graphite">Frais in-state/an</span>
                <span className="text-ink font-medium">
                  ${(university.tuitionInState / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-line">
                <span className="font-mono text-graphite">Frais out-of-state/an</span>
                <span className="text-ink font-medium">
                  ${(university.tuitionOutOfState / 1000).toFixed(0)}k
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="font-mono text-graphite">Logement & repas/an</span>
                <span className="text-ink font-medium">
                  ${(university.roomAndBoard / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-3">
              Notes Agent
            </h3>
            <p className="text-sm text-ink leading-relaxed">
              {university.agentNotes}
            </p>
          </div>

          {/* Links */}
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-3">
              Ressources
            </h3>
            <div className="space-y-2">
              {university.websiteUrl && (
                <a
                  href={university.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-navy underline hover:text-navy-600 font-mono"
                >
                  → Site universitaire
                </a>
              )}
              {university.athleticsUrl && (
                <a
                  href={university.athleticsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-navy underline hover:text-navy-600 font-mono"
                >
                  → Site athletics
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right: Coaches + Athletes targeting */}
        <div className="col-span-1 space-y-6">
          {/* Athletes targeting this university */}
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Athlètes ciblant cette université
            </h3>
            <div className="space-y-3">
              {[
                { id: "1", name: "Lucas Martins", status: "CONTACTED", statusLabel: "Contacté", color: "bg-navy/10 text-navy" },
              ].map((a) => (
                <Link
                  key={a.id}
                  href={`/admin/athletes/${a.id}`}
                  className="flex items-center justify-between py-2 border-b border-line last:border-0 hover:text-navy transition-colors"
                >
                  <p className="text-sm font-medium text-ink hover:text-navy">{a.name}</p>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono ${a.color}`}>
                    {a.statusLabel}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white border border-line rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-mono uppercase tracking-widest text-graphite flex items-center gap-2">
                <Users className="w-4 h-4" /> Coachs ({coaches.length})
              </h3>
              <button className="text-navy hover:text-navy-600">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Head Coach */}
              {headCoach && (
                <div className="pb-4 border-b border-line">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-navy text-paper text-xs font-mono font-semibold rounded">
                      Head Coach
                    </span>
                    <button
                      onClick={() => openCompose(headCoach)}
                      className="inline-flex items-center gap-1 text-xs font-mono text-navy hover:underline"
                    >
                      <Mail className="w-3 h-3" />
                      Composer
                    </button>
                  </div>
                  <p className="font-medium text-ink text-sm">
                    {headCoach.firstName} {headCoach.lastName}
                  </p>
                  {headCoach.title && (
                    <p className="text-xs text-graphite font-mono mt-1">
                      {headCoach.title}
                    </p>
                  )}
                  {headCoach.email && (
                    <a
                      href={`mailto:${headCoach.email}`}
                      className="flex items-center gap-1 text-xs text-navy font-mono mt-2 hover:underline"
                    >
                      <Mail className="w-3 h-3" />
                      {headCoach.email}
                    </a>
                  )}
                  {headCoach.linkedinUrl && (
                    <a
                      href={headCoach.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-navy font-mono mt-1 hover:underline"
                    >
                      <ExternalLink className="w-3 h-3" />
                      LinkedIn
                    </a>
                  )}
                </div>
              )}

              {/* Assistant Coaches */}
              <div className="space-y-3">
                {assistantCoaches.map((coach) => (
                  <div key={coach.id} className="pb-3 border-b border-line last:border-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-ink text-sm">
                        {coach.firstName} {coach.lastName}
                      </p>
                      <button
                        onClick={() => openCompose(coach)}
                        className="inline-flex items-center gap-1 text-xs font-mono text-navy hover:underline flex-shrink-0"
                      >
                        <Mail className="w-3 h-3" />
                        Composer
                      </button>
                    </div>
                    {coach.title && (
                      <p className="text-xs text-graphite font-mono mt-0.5">
                        {coach.title}
                      </p>
                    )}
                    {coach.email && (
                      <a
                        href={`mailto:${coach.email}`}
                        className="flex items-center gap-1 text-xs text-navy font-mono mt-1.5 hover:underline"
                      >
                        <Mail className="w-3 h-3" />
                        {coach.email}
                      </a>
                    )}
                    {coach.linkedinUrl && (
                      <a
                        href={coach.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-navy font-mono hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        LinkedIn
                      </a>
                    )}
                    {coach.twitterUrl && (
                      <a
                        href={coach.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-navy font-mono hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Twitter
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coach compose modal */}
      {composeCoach && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-line rounded-lg w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-line flex-shrink-0">
              <div>
                <h2 className="text-sm font-mono uppercase tracking-widest text-graphite">Composer un email</h2>
                <p className="text-xs font-mono text-stone mt-0.5">
                  À : {composeCoach.firstName} {composeCoach.lastName} — {composeCoach.email ?? "email non renseigné"}
                </p>
              </div>
              <button onClick={() => setComposeCoach(null)}>
                <X className="w-4 h-4 text-graphite hover:text-ink" />
              </button>
            </div>

            {composeSent ? (
              <div className="p-10 text-center flex-1">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <p className="font-medium text-ink mb-1">Email préparé !</p>
                <p className="text-sm font-mono text-graphite mb-5">
                  Copiez le contenu et envoyez via votre client email, ou connectez Gmail API dans les paramètres.
                </p>
                <button onClick={() => setComposeCoach(null)} className="px-4 py-2 bg-navy text-paper text-sm font-mono rounded">Fermer</button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {/* Template selector */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-graphite block mb-2">Template</label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => {
                      setSelectedTemplate(e.target.value);
                      const tpl = TEMPLATES.find((t) => t.id === e.target.value);
                      if (tpl && composeCoach) openCompose(composeCoach);
                    }}
                    className="w-full border border-line rounded px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:ring-1 focus:ring-navy"
                  >
                    {TEMPLATES.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-graphite block mb-2">Sujet</label>
                  <input
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="w-full border border-line rounded px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                </div>

                {/* Body */}
                <div>
                  <label className="text-xs font-mono uppercase tracking-widest text-graphite block mb-2">Corps</label>
                  <textarea
                    value={composeBody}
                    onChange={(e) => setComposeBody(e.target.value)}
                    rows={12}
                    className="w-full border border-line rounded px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:ring-1 focus:ring-navy resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => {
                      const text = `To: ${composeCoach.email}\nSubject: ${composeSubject}\n\n${composeBody}`;
                      navigator.clipboard.writeText(text).catch(() => {});
                      setComposeCopied(true);
                      setTimeout(() => setComposeCopied(false), 2000);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 border border-line rounded text-sm font-mono text-graphite hover:text-ink transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    {composeCopied ? "Copié !" : "Copier tout"}
                  </button>
                  <button
                    onClick={() => setComposeSent(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-navy text-paper rounded text-sm font-mono hover:bg-navy/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Marquer comme envoyé
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
