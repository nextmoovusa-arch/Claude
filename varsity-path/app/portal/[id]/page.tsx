"use client";

import { useState } from "react";
import {
  CheckCircle2, Circle, Clock, MapPin, Star,
  FileText, Building2, Calendar, ChevronRight,
  Download, Trophy, GraduationCap
} from "lucide-react";

type StepStatus = "COMPLETED" | "IN_PROGRESS" | "PENDING" | "SKIPPED";

const JOURNEY_STEPS = [
  { order: 1, title: "Signature du contrat", description: "Contrat d'accompagnement signé" },
  { order: 2, title: "Dossier identité complet", description: "Passeport, photos, documents d'état civil" },
  { order: 3, title: "Profil sportif validé", description: "Vidéo highlight + statistiques saison" },
  { order: 4, title: "Bilan académique", description: "Notes, diplômes, système scolaire analysé" },
  { order: 5, title: "Tests standardisés", description: "SAT/ACT + TOEFL/IELTS" },
  { order: 6, title: "Inscription NCAA Eligibility Center", description: "Profil créé et amateurisme validé" },
  { order: 7, title: "Sélection des universités cibles", description: "Liste de 20-40 universités validée" },
  { order: 8, title: "Campagne d'emails envoyée", description: "Premier contact avec les coachs" },
  { order: 9, title: "Offres reçues & négociation", description: "Au moins une offre officielle reçue" },
  { order: 10, title: "NLI signé & inscription", description: "National Letter of Intent signé" },
];

const MOCK_ATHLETE = {
  firstName: "Lucas",
  lastName: "Martins",
  nationality: "Français / Brésilien",
  currentClub: "Paris FC U19",
  primaryPosition: "Milieu offensif",
  gpaConverted: 3.4,
  toeflScore: 98,
  agentName: "NEXTMOOV USA",
  steps: [
    { order: 1, status: "COMPLETED" as StepStatus, completedDate: "2026-01-10" },
    { order: 2, status: "COMPLETED" as StepStatus, completedDate: "2026-01-20" },
    { order: 3, status: "COMPLETED" as StepStatus, completedDate: "2026-02-01" },
    { order: 4, status: "COMPLETED" as StepStatus, completedDate: "2026-02-15" },
    { order: 5, status: "COMPLETED" as StepStatus, completedDate: "2026-03-01" },
    { order: 6, status: "IN_PROGRESS" as StepStatus },
    { order: 7, status: "IN_PROGRESS" as StepStatus },
    { order: 8, status: "PENDING" as StepStatus },
    { order: 9, status: "PENDING" as StepStatus },
    { order: 10, status: "PENDING" as StepStatus },
  ],
};

const MOCK_UNIVERSITIES = [
  { id: "s1", name: "University of Virginia", city: "Charlottesville", state: "VA", division: "NCAA D1", status: "CONTACTED", statusLabel: "Contacté", color: "bg-navy/10 text-navy" },
  { id: "s2", name: "Duke University", city: "Durham", state: "NC", division: "NCAA D1", status: "RESPONDED", statusLabel: "A répondu", color: "bg-amber-100 text-amber-800" },
  { id: "s3", name: "Indiana University", city: "Bloomington", state: "IN", division: "NCAA D1", status: "PROSPECT", statusLabel: "En attente", color: "bg-stone text-ink" },
  { id: "s4", name: "Creighton University", city: "Omaha", state: "NE", division: "NCAA D1", status: "CONTACTED", statusLabel: "Contacté", color: "bg-navy/10 text-navy" },
  { id: "s5", name: "Grand Valley State University", city: "Allendale", state: "MI", division: "NCAA D2", status: "OFFER", statusLabel: "Offre reçue ✓", color: "bg-green-100 text-green-800" },
];

const MOCK_EVENTS = [
  { date: "2026-04-28", title: "Match Champions U19", type: "Match", location: "Stade de France" },
  { date: "2026-05-01", title: "Deadline NCAA Eligibility", type: "Deadline", location: null },
  { date: "2026-05-20", title: "Visite campus UVA", type: "Visite", location: "Charlottesville, VA" },
  { date: "2026-06-15", title: "TOEFL", type: "Examen", location: "Centre agréé Paris" },
];

const MOCK_DOCS = [
  { id: "d1", name: "Passeport_LucasMartins.pdf", category: "Identité", uploadedAt: "2026-01-20" },
  { id: "d2", name: "Relevés_notes_2025.pdf", category: "Académique", uploadedAt: "2026-02-01" },
  { id: "d3", name: "Highlight_2026.mp4", category: "Sportif", uploadedAt: "2026-02-10" },
  { id: "d4", name: "Contrat_accompagnement.pdf", category: "Juridique", uploadedAt: "2026-01-10" },
];

type Tab = "parcours" | "universites" | "agenda" | "documents";

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "COMPLETED") return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  if (status === "IN_PROGRESS") return <Clock className="w-5 h-5 text-navy" />;
  return <Circle className="w-5 h-5 text-stone" />;
}

export default function AthletePortalPage() {
  const [tab, setTab] = useState<Tab>("parcours");
  const athlete = MOCK_ATHLETE;

  const completedSteps = athlete.steps.filter((s) => s.status === "COMPLETED").length;
  const progressPct = Math.round((completedSteps / athlete.steps.length) * 100);

  const TAB_LABELS: Record<Tab, string> = {
    parcours: "Mon Parcours",
    universites: "Universités",
    agenda: "Agenda",
    documents: "Documents",
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <header className="bg-white border-b border-line">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-anton text-navy text-lg tracking-widest">VARSITY</span>
            <span className="font-anton text-red-flag text-lg tracking-widest">PATH</span>
            <span className="text-stone font-mono text-sm ml-2">by NEXTMOOV USA</span>
          </div>
          <p className="text-xs font-mono text-graphite uppercase tracking-widest">
            Espace athlète
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Athlete header */}
        <div className="bg-white border border-line rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-1">Athlète</p>
              <h1 className="text-3xl font-display uppercase tracking-wider text-navy mb-1">
                {athlete.firstName} {athlete.lastName}
              </h1>
              <p className="text-sm font-mono text-graphite">
                {athlete.nationality} · {athlete.currentClub} · {athlete.primaryPosition}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-1">Accompagnement</p>
              <p className="text-sm font-medium text-ink">{athlete.agentName}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-mono text-graphite">Progression globale</span>
              <span className="text-sm font-mono font-bold text-navy">{progressPct}% · {completedSteps}/{athlete.steps.length} étapes</span>
            </div>
            <div className="w-full bg-stone/30 rounded-full h-3">
              <div
                className="bg-navy h-3 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-5">
            <div className="bg-paper rounded-lg p-3 text-center border border-line">
              <p className="text-xl font-mono font-bold text-navy">{athlete.gpaConverted.toFixed(1)}</p>
              <p className="text-xs font-mono text-graphite mt-0.5">GPA / 4.0</p>
            </div>
            <div className="bg-paper rounded-lg p-3 text-center border border-line">
              <p className="text-xl font-mono font-bold text-navy">{athlete.toeflScore}</p>
              <p className="text-xs font-mono text-graphite mt-0.5">TOEFL</p>
            </div>
            <div className="bg-paper rounded-lg p-3 text-center border border-line">
              <p className="text-xl font-mono font-bold text-green-700">
                {MOCK_UNIVERSITIES.filter((u) => u.status === "RESPONDED" || u.status === "OFFER").length}
              </p>
              <p className="text-xs font-mono text-graphite mt-0.5">Réponses coachs</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-line">
          {(["parcours", "universites", "agenda", "documents"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-sm font-mono transition-colors border-b-2 -mb-px whitespace-nowrap ${
                tab === t
                  ? "border-navy text-navy font-semibold"
                  : "border-transparent text-graphite hover:text-ink"
              }`}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Tab: Parcours */}
        {tab === "parcours" && (
          <div className="space-y-2">
            {JOURNEY_STEPS.map((step) => {
              const stepData = athlete.steps.find((s) => s.order === step.order);
              const status: StepStatus = stepData?.status ?? "PENDING";
              return (
                <div
                  key={step.order}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    status === "COMPLETED"
                      ? "bg-green-50 border-green-200"
                      : status === "IN_PROGRESS"
                      ? "bg-blue-50 border-navy/30"
                      : "bg-white border-line opacity-60"
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <StepIcon status={status} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono text-graphite">Étape {step.order}</span>
                      {status === "IN_PROGRESS" && (
                        <span className="text-xs font-mono font-semibold text-navy bg-navy/10 px-2 py-0.5 rounded">
                          En cours
                        </span>
                      )}
                    </div>
                    <p className={`font-medium ${status === "PENDING" ? "text-graphite" : "text-ink"}`}>
                      {step.title}
                    </p>
                    {status !== "PENDING" && (
                      <p className="text-sm text-graphite mt-0.5">{step.description}</p>
                    )}
                  </div>
                  {stepData?.completedDate && (
                    <span className="text-xs font-mono text-graphite whitespace-nowrap flex-shrink-0">
                      {new Date(stepData.completedDate + "T12:00").toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab: Universités */}
        {tab === "universites" && (
          <div className="space-y-3">
            <p className="text-sm font-mono text-graphite mb-4">
              {MOCK_UNIVERSITIES.length} universités dans votre liste de ciblage
            </p>
            {MOCK_UNIVERSITIES.map((uni) => (
              <div
                key={uni.id}
                className="bg-white border border-line rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-graphite mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-ink">{uni.name}</p>
                    <p className="text-xs font-mono text-graphite mt-0.5">
                      {uni.city}, {uni.state} · {uni.division}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded text-xs font-mono font-semibold flex-shrink-0 ${uni.color}`}>
                  {uni.statusLabel}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Agenda */}
        {tab === "agenda" && (
          <div className="space-y-3">
            {MOCK_EVENTS.map((ev, i) => (
              <div key={i} className="bg-white border border-line rounded-lg p-4 flex gap-5 items-start">
                <div className="text-center min-w-14 flex-shrink-0">
                  <p className="text-xs font-mono text-graphite uppercase">
                    {new Date(ev.date + "T12:00").toLocaleDateString("fr-FR", { month: "short" })}
                  </p>
                  <p className="text-2xl font-mono font-bold text-navy leading-none">
                    {new Date(ev.date + "T12:00").getDate()}
                  </p>
                  <p className="text-xs font-mono text-graphite">
                    {new Date(ev.date + "T12:00").getFullYear()}
                  </p>
                </div>
                <div className="border-l border-line pl-5 flex-1">
                  <span className="text-xs font-mono text-graphite uppercase tracking-widest">{ev.type}</span>
                  <p className="font-medium text-ink mt-0.5">{ev.title}</p>
                  {ev.location && (
                    <p className="text-xs font-mono text-graphite mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {ev.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Documents */}
        {tab === "documents" && (
          <div className="space-y-2">
            {MOCK_DOCS.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-line rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-graphite flex-shrink-0" />
                  <div>
                    <p className="font-medium text-ink text-sm">{doc.name}</p>
                    <p className="text-xs font-mono text-graphite mt-0.5">
                      {doc.category} · Ajouté le {new Date(doc.uploadedAt + "T12:00").toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-graphite hover:text-navy transition-colors" title="Télécharger">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
            <p className="text-xs font-mono text-stone mt-3 text-center">
              Pour ajouter des documents, contactez votre agent NEXTMOOV USA.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-line mt-16 py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-stone">
            NEXTMOOV USA · Varsity Path · Espace confidentiel
          </p>
        </div>
      </footer>
    </div>
  );
}
