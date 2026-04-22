"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User, BookOpen, Trophy, FileText, Calendar,
  CheckCircle2, Circle, Clock, ChevronLeft,
  Target, GraduationCap, Globe, Edit3
} from "lucide-react";
import Link from "next/link";

type StepStatus = "COMPLETED" | "IN_PROGRESS" | "PENDING" | "SKIPPED";

const JOURNEY_STEPS = [
  { order: 1, title: "Signature du contrat", description: "Contrat d'accompagnement signé par la famille" },
  { order: 2, title: "Dossier identité complet", description: "Passeport, photos, documents d'état civil" },
  { order: 3, title: "Profil sportif validé", description: "Vidéo highlight + statistiques saison" },
  { order: 4, title: "Bilan académique", description: "Notes, diplômes, système scolaire analysé" },
  { order: 5, title: "Tests standardisés", description: "SAT/ACT planifié ou passé, TOEFL/IELTS si nécessaire" },
  { order: 6, title: "Inscription NCAA Eligibility Center", description: "Profil créé et amateurisme validé" },
  { order: 7, title: "Sélection des universités cibles", description: "Liste de 20-40 universités validée" },
  { order: 8, title: "Campagne d'emails envoyée", description: "Premier contact avec les coachs ciblés" },
  { order: 9, title: "Offres reçues & négociation", description: "Au moins une offre officielle reçue" },
  { order: 10, title: "NLI signé & inscription", description: "National Letter of Intent signé, visa en cours" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PROSPECT:        { label: "Prospect",        color: "bg-stone text-ink" },
  SIGNED:          { label: "Signé",           color: "bg-gold text-white" },
  IN_FILE:         { label: "En dossier",      color: "bg-ink text-white" },
  IN_CAMPAIGN:     { label: "En campagne",     color: "bg-navy text-white" },
  OFFERS_RECEIVED: { label: "Offres reçues",  color: "bg-red-flag text-white" },
  COMMITTED:       { label: "Engagé",          color: "bg-green-700 text-white" },
  NLI_SIGNED:      { label: "NLI signé",       color: "bg-green-900 text-white" },
  ARRIVED_US:      { label: "Arrivé USA",      color: "bg-navy text-white" },
  ABANDONED:       { label: "Abandonné",       color: "bg-graphite text-white" },
};

// Mock athlete data
const MOCK_ATHLETE = {
  id: "1",
  firstName: "Lucas",
  lastName: "Martins",
  status: "IN_CAMPAIGN",
  nationality: "Français / Brésilien",
  dateOfBirth: "2005-03-14",
  currentClub: "Paris FC U19",
  primaryPosition: "Milieu offensif",
  dominantFoot: "Droit",
  heightCm: 178,
  weightKg: 72,
  gpaConverted: 3.4,
  satScore: 1180,
  toeflScore: 98,
  targetDivisions: ["NCAA_D1", "NCAA_D2"],
  preferredRegions: ["Southeast", "Mid-Atlantic"],
  familyBudgetUsd: 25000,
  minScholarshipPct: 50,
  targetMajor: "Business Administration",
  agentNotes: "Excellent profil. Physique et technique. TOEFL à repasser en juin pour viser 100+.",
  highlightUrl: "https://youtube.com/watch?v=example",
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

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "COMPLETED") return <CheckCircle2 className="w-5 h-5 text-green-600" />;
  if (status === "IN_PROGRESS") return <Clock className="w-5 h-5 text-navy" />;
  if (status === "SKIPPED") return <Circle className="w-5 h-5 text-stone" />;
  return <Circle className="w-5 h-5 text-line" />;
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2.5 border-b border-line last:border-0">
      <span className="text-sm font-mono text-graphite">{label}</span>
      <span className="text-sm text-ink font-medium">{value}</span>
    </div>
  );
}

type Tab = "parcours" | "profil" | "academique" | "strategie";

export default function AthletePage() {
  const [tab, setTab] = useState<Tab>("parcours");
  const athlete = MOCK_ATHLETE;

  const completedSteps = athlete.steps.filter((s) => s.status === "COMPLETED").length;
  const statusCfg = STATUS_CONFIG[athlete.status] ?? STATUS_CONFIG["PROSPECT"];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Back + Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Link
            href="/admin/athletes"
            className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite hover:text-navy mb-3"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour aux athlètes
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-display uppercase tracking-wider text-navy">
              {athlete.firstName} {athlete.lastName}
            </h1>
            <span className={`px-3 py-1 rounded text-xs font-mono font-semibold ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
          </div>
          <p className="text-sm font-mono text-graphite mt-1">
            {athlete.nationality} · {athlete.currentClub} · né le{" "}
            {new Date(athlete.dateOfBirth).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Edit3 className="w-4 h-4 mr-2" />
          Modifier
        </Button>
      </div>

      {/* Progress bar */}
      <div className="mb-8 bg-white border border-line rounded-lg p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-mono text-graphite">Progression du parcours</span>
          <span className="text-sm font-mono font-semibold text-navy">
            {completedSteps} / {athlete.steps.length} étapes
          </span>
        </div>
        <div className="w-full bg-stone rounded-full h-2">
          <div
            className="bg-navy h-2 rounded-full transition-all"
            style={{ width: `${(completedSteps / athlete.steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-line">
        {(["parcours", "profil", "academique", "strategie"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-mono capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-navy text-navy font-semibold"
                : "border-transparent text-graphite hover:text-ink"
            }`}
          >
            {t}
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
                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                  status === "COMPLETED"
                    ? "bg-green-50 border-green-200"
                    : status === "IN_PROGRESS"
                    ? "bg-blue-50 border-navy/30"
                    : "bg-white border-line"
                }`}
              >
                <div className="mt-0.5">
                  <StepIcon status={status} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-graphite">Étape {step.order}</span>
                    {status === "IN_PROGRESS" && (
                      <span className="text-xs font-mono font-semibold text-navy bg-navy/10 px-2 py-0.5 rounded">
                        En cours
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-ink mt-0.5">{step.title}</p>
                  <p className="text-sm text-graphite mt-0.5">{step.description}</p>
                </div>
                {stepData?.completedDate && (
                  <span className="text-xs font-mono text-graphite whitespace-nowrap">
                    {new Date(stepData.completedDate).toLocaleDateString("fr-FR")}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Tab: Profil */}
      {tab === "profil" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Profil Sportif
            </h3>
            <InfoRow label="Poste principal" value={athlete.primaryPosition} />
            <InfoRow label="Pied fort" value={athlete.dominantFoot} />
            <InfoRow label="Taille" value={athlete.heightCm ? `${athlete.heightCm} cm` : null} />
            <InfoRow label="Poids" value={athlete.weightKg ? `${athlete.weightKg} kg` : null} />
            <InfoRow label="Club actuel" value={athlete.currentClub} />
            {athlete.highlightUrl && (
              <div className="flex justify-between py-2.5 border-b border-line">
                <span className="text-sm font-mono text-graphite">Highlight</span>
                <a
                  href={athlete.highlightUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-navy underline font-mono"
                >
                  Voir la vidéo →
                </a>
              </div>
            )}
          </div>

          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Identité
            </h3>
            <InfoRow label="Nationalité" value={athlete.nationality} />
            <InfoRow label="Date de naissance" value={new Date(athlete.dateOfBirth).toLocaleDateString("fr-FR")} />
          </div>
        </div>
      )}

      {/* Tab: Académique */}
      {tab === "academique" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Résultats Académiques
            </h3>
            <InfoRow label="GPA (converti 4.0)" value={athlete.gpaConverted?.toFixed(2)} />
            <InfoRow label="SAT" value={athlete.satScore} />
            <InfoRow label="ACT" value={null} />
            <InfoRow label="TOEFL" value={athlete.toeflScore} />
            <InfoRow label="IELTS" value={null} />
          </div>

          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4" /> NCAA Eligibility
            </h3>
            <InfoRow label="ID Eligibility Center" value={null} />
            <InfoRow label="Statut" value="Non commencé" />
            <InfoRow label="Amateurisme validé" value="Non" />
          </div>
        </div>
      )}

      {/* Tab: Stratégie */}
      {tab === "strategie" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" /> Objectifs
            </h3>
            <div className="py-2.5 border-b border-line">
              <span className="text-sm font-mono text-graphite block mb-2">Divisions cibles</span>
              <div className="flex gap-2 flex-wrap">
                {athlete.targetDivisions.map((d) => (
                  <span key={d} className="px-2 py-1 bg-navy/10 text-navy text-xs font-mono rounded">
                    {d.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
            <div className="py-2.5 border-b border-line">
              <span className="text-sm font-mono text-graphite block mb-2">Régions préférées</span>
              <div className="flex gap-2 flex-wrap">
                {athlete.preferredRegions.map((r) => (
                  <span key={r} className="px-2 py-1 bg-stone text-ink text-xs font-mono rounded">
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <InfoRow label="Budget famille (USD/an)" value={athlete.familyBudgetUsd?.toLocaleString("fr-FR")} />
            <InfoRow label="Bourse min." value={athlete.minScholarshipPct ? `${athlete.minScholarshipPct}%` : null} />
            <InfoRow label="Filière cible" value={athlete.targetMajor} />
          </div>

          <div className="bg-white border border-line rounded-lg p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Notes Agent
            </h3>
            <p className="text-sm text-ink leading-relaxed">{athlete.agentNotes}</p>
          </div>
        </div>
      )}
    </div>
  );
}
