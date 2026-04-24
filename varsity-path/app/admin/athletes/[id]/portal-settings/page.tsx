"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft, Eye, EyeOff, MessageSquare, Settings2,
  CheckCircle2, Circle, Clock, Save, RotateCcw, Monitor,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface StepSetting {
  order: number
  title: string
  description: string
  visible: boolean
  customMessage: string
}

// ── Mock athlete ─────────────────────────────────────────────────────────────

const MOCK_ATHLETE = {
  id: "1",
  firstName: "Lucas",
  lastName: "Martins",
};

// ── 10 parcours steps (same as portal) ───────────────────────────────────────

const DEFAULT_STEPS: StepSetting[] = [
  { order: 1,  title: "Signature du contrat",               description: "Contrat d'accompagnement signé",                visible: true,  customMessage: "" },
  { order: 2,  title: "Dossier identité complet",           description: "Passeport, photos, documents d'état civil",     visible: true,  customMessage: "" },
  { order: 3,  title: "Profil sportif validé",              description: "Vidéo highlight + statistiques saison",         visible: true,  customMessage: "" },
  { order: 4,  title: "Bilan académique",                   description: "Notes, diplômes, système scolaire analysé",     visible: true,  customMessage: "" },
  { order: 5,  title: "Tests standardisés",                 description: "SAT/ACT + TOEFL/IELTS",                        visible: true,  customMessage: "" },
  { order: 6,  title: "Inscription NCAA Eligibility Center",description: "Profil créé et amateurisme validé",             visible: true,  customMessage: "" },
  { order: 7,  title: "Sélection des universités cibles",   description: "Liste de 20-40 universités validée",           visible: false, customMessage: "" },
  { order: 8,  title: "Campagne d'emails envoyée",          description: "Premier contact avec les coachs",               visible: false, customMessage: "" },
  { order: 9,  title: "Offres reçues & négociation",        description: "Au moins une offre officielle reçue",          visible: false, customMessage: "" },
  { order: 10, title: "NLI signé & inscription",            description: "National Letter of Intent signé",              visible: false, customMessage: "" },
];

// ── Mock statuses shown in preview ───────────────────────────────────────────

type StepStatus = "COMPLETED" | "IN_PROGRESS" | "PENDING";

const MOCK_STATUSES: Record<number, StepStatus> = {
  1: "COMPLETED",
  2: "COMPLETED",
  3: "COMPLETED",
  4: "COMPLETED",
  5: "COMPLETED",
  6: "IN_PROGRESS",
  7: "IN_PROGRESS",
  8: "PENDING",
  9: "PENDING",
  10: "PENDING",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function PortalSettingsPage({ params }: { params: { id: string } }) {
  const [steps, setSteps] = useState<StepSetting[]>(DEFAULT_STEPS);
  const [editingMsg, setEditingMsg] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const athlete = MOCK_ATHLETE;
  const visibleCount = steps.filter((s) => s.visible).length;

  function toggleVisible(order: number) {
    setSteps((prev) =>
      prev.map((s) => (s.order === order ? { ...s, visible: !s.visible } : s))
    );
    setSaved(false);
  }

  function updateMessage(order: number, msg: string) {
    setSteps((prev) =>
      prev.map((s) => (s.order === order ? { ...s, customMessage: msg } : s))
    );
    setSaved(false);
  }

  function handleShowAll() {
    setSteps((prev) => prev.map((s) => ({ ...s, visible: true })));
    setSaved(false);
  }

  function handleReset() {
    setSteps(DEFAULT_STEPS);
    setSaved(false);
  }

  function handleSave() {
    // Mock save — in production this would persist to DB
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function statusIcon(status: StepStatus) {
    if (status === "COMPLETED") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === "IN_PROGRESS") return <Clock className="w-4 h-4 text-navy" />;
    return <Circle className="w-4 h-4 text-stone" />;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/admin/athletes/${params.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite hover:text-navy mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour au dossier athlète
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings2 className="w-5 h-5 text-navy" />
              <h1 className="text-3xl font-display uppercase tracking-wider text-navy">
                Paramètres portail
              </h1>
            </div>
            <p className="text-sm font-mono text-graphite">
              {athlete.firstName} {athlete.lastName} ·{" "}
              <span className="text-navy font-semibold">{visibleCount}/10</span> étapes visibles
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`inline-flex items-center gap-2 px-4 py-2 border text-sm font-mono rounded transition-colors ${
                showPreview
                  ? "bg-navy text-paper border-navy"
                  : "border-line text-graphite hover:border-navy hover:text-navy"
              }`}
            >
              <Monitor className="w-4 h-4" />
              {showPreview ? "Masquer aperçu" : "Aperçu portail"}
            </button>
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-mono rounded transition-colors ${
                saved
                  ? "bg-green-600 text-white"
                  : "bg-navy text-paper hover:bg-navy/90"
              }`}
            >
              <Save className="w-4 h-4" />
              {saved ? "Sauvegardé ✓" : "Sauvegarder"}
            </button>
          </div>
        </div>
      </div>

      <div className={`gap-8 ${showPreview ? "grid grid-cols-2" : ""}`}>
        {/* ── Settings panel ──────────────────────────────────────────────── */}
        <div>
          {/* Quick actions */}
          <div className="flex gap-2 mb-5">
            <button
              onClick={handleShowAll}
              className="text-xs font-mono text-navy border border-navy/30 px-3 py-1.5 rounded hover:bg-navy/5 transition-colors"
            >
              Tout afficher
            </button>
            <button
              onClick={() =>
                setSteps((prev) => prev.map((s) => ({ ...s, visible: false })))
              }
              className="text-xs font-mono text-graphite border border-line px-3 py-1.5 rounded hover:border-graphite transition-colors"
            >
              Tout masquer
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-graphite border border-line px-3 py-1.5 rounded hover:border-graphite transition-colors ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              Réinitialiser
            </button>
          </div>

          {/* Step settings list */}
          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.order}
                className={`bg-white border rounded-lg overflow-hidden transition-all ${
                  step.visible ? "border-navy/30" : "border-line opacity-60"
                }`}
              >
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleVisible(step.order)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                      step.visible ? "bg-navy" : "bg-stone/40"
                    }`}
                    aria-label={step.visible ? "Masquer cette étape" : "Afficher cette étape"}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                        step.visible ? "translate-x-4.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>

                  {/* Step info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-graphite">Étape {step.order}</span>
                      {step.visible ? (
                        <span className="text-xs font-mono text-navy font-semibold">Visible</span>
                      ) : (
                        <span className="text-xs font-mono text-stone">Masquée</span>
                      )}
                    </div>
                    <p className={`font-medium text-sm ${step.visible ? "text-ink" : "text-graphite"}`}>
                      {step.title}
                    </p>
                    <p className="text-xs font-mono text-stone truncate">{step.description}</p>
                  </div>

                  {/* Visibility icon */}
                  <div className="flex-shrink-0">
                    {step.visible ? (
                      <Eye className="w-4 h-4 text-navy" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-stone" />
                    )}
                  </div>

                  {/* Message toggle */}
                  <button
                    onClick={() =>
                      setEditingMsg(editingMsg === step.order ? null : step.order)
                    }
                    className={`flex-shrink-0 p-1.5 rounded transition-colors ${
                      step.customMessage
                        ? "text-navy bg-navy/10"
                        : "text-graphite hover:text-navy hover:bg-paper"
                    }`}
                    title="Message personnalisé"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>

                {/* Custom message editor */}
                {editingMsg === step.order && (
                  <div className="border-t border-line px-5 py-3 bg-paper">
                    <label className="text-xs font-mono text-graphite block mb-1.5">
                      Message personnalisé pour cette étape (optionnel)
                    </label>
                    <textarea
                      value={step.customMessage}
                      onChange={(e) => updateMessage(step.order, e.target.value)}
                      rows={2}
                      placeholder="Ex : Nous attendons votre passeport — merci de l'envoyer à votre agent."
                      className="w-full border border-line rounded px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-navy bg-white"
                    />
                    <p className="text-xs font-mono text-stone mt-1">
                      Ce message sera affiché à l'athlète sur cette étape de son parcours.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Info notice */}
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <p className="text-xs font-mono text-amber-800">
              <strong>Mode aperçu :</strong> les modifications sont simulées — aucune donnée n'est
              persistée en base. Cliquez sur «Sauvegarder» pour enregistrer (mock).
            </p>
          </div>
        </div>

        {/* ── Preview panel ───────────────────────────────────────────────── */}
        {showPreview && (
          <div>
            <div className="sticky top-6">
              <p className="text-xs font-mono uppercase tracking-widest text-graphite mb-3">
                Aperçu — ce que verra l'athlète
              </p>
              <div className="bg-white border border-line rounded-lg overflow-hidden shadow-sm">
                {/* Mini header */}
                <div className="bg-navy px-4 py-3 flex items-center justify-between">
                  <span className="font-mono text-paper text-xs tracking-widest font-bold">
                    VARSITY<span className="text-red-flag ml-0.5">PATH</span>
                  </span>
                  <span className="text-xs font-mono text-paper/60">Espace athlète</span>
                </div>

                <div className="px-4 py-4">
                  <p className="text-xs font-mono text-graphite mb-1">Athlète</p>
                  <p className="font-display text-navy uppercase tracking-wider text-lg mb-3">
                    {athlete.firstName} {athlete.lastName}
                  </p>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-mono text-graphite">Progression</span>
                      <span className="text-xs font-mono text-navy font-bold">
                        {steps.filter((s) => s.visible && MOCK_STATUSES[s.order] === "COMPLETED").length}
                        /{visibleCount} étapes
                      </span>
                    </div>
                    <div className="w-full bg-stone/20 rounded-full h-2">
                      <div
                        className="bg-navy h-2 rounded-full transition-all"
                        style={{
                          width: visibleCount > 0
                            ? `${Math.round(
                                (steps.filter(
                                  (s) => s.visible && MOCK_STATUSES[s.order] === "COMPLETED"
                                ).length / visibleCount) * 100
                              )}%`
                            : "0%",
                        }}
                      />
                    </div>
                  </div>

                  {/* Steps preview */}
                  <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                    {steps.filter((s) => s.visible).length === 0 ? (
                      <p className="text-center py-8 text-xs font-mono text-stone">
                        Aucune étape visible — activez au moins une étape.
                      </p>
                    ) : (
                      steps
                        .filter((s) => s.visible)
                        .map((step) => {
                          const status = MOCK_STATUSES[step.order] ?? "PENDING";
                          return (
                            <div
                              key={step.order}
                              className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${
                                status === "COMPLETED"
                                  ? "bg-green-50 border-green-200"
                                  : status === "IN_PROGRESS"
                                  ? "bg-blue-50 border-navy/30"
                                  : "bg-white border-line opacity-60"
                              }`}
                            >
                              <div className="mt-0.5 flex-shrink-0">
                                {statusIcon(status)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-mono text-graphite">
                                  Étape {step.order}
                                </p>
                                <p className={`font-medium text-xs leading-snug ${
                                  status === "PENDING" ? "text-graphite" : "text-ink"
                                }`}>
                                  {step.title}
                                </p>
                                {step.customMessage && (
                                  <p className="text-xs font-mono text-navy mt-0.5 italic">
                                    {step.customMessage}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
