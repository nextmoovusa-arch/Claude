"use client";

import { useState, useRef } from "react";
import {
  CheckCircle2, Circle, Clock, MapPin, FileText,
  Building2, Upload, Download, Trophy, X, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

type StepStatus = "COMPLETED" | "IN_PROGRESS" | "PENDING";
type Tab = "parcours" | "universites" | "agenda" | "documents";

const JOURNEY_STEPS = [
  { order: 1,  title: "Signature du contrat",                description: "Contrat d'accompagnement signé" },
  { order: 2,  title: "Dossier identité complet",            description: "Passeport, photos, documents d'état civil" },
  { order: 3,  title: "Profil sportif validé",               description: "Vidéo highlight + statistiques saison" },
  { order: 4,  title: "Bilan académique",                    description: "Notes, diplômes, système scolaire analysé" },
  { order: 5,  title: "Tests standardisés",                  description: "SAT/ACT + TOEFL/IELTS" },
  { order: 6,  title: "Inscription NCAA Eligibility Center", description: "Profil créé et amateurisme validé" },
  { order: 7,  title: "Sélection des universités cibles",    description: "Liste de 20-40 universités validée" },
  { order: 8,  title: "Campagne d'emails envoyée",           description: "Premier contact avec les coachs" },
  { order: 9,  title: "Offres reçues & négociation",         description: "Au moins une offre officielle reçue" },
  { order: 10, title: "NLI signé & inscription",             description: "National Letter of Intent signé" },
];

const MOCK_ATHLETE = {
  firstName: "Lucas", lastName: "Martins",
  nationality: "Français / Brésilien", currentClub: "Paris FC U19",
  primaryPosition: "Milieu offensif", gpaConverted: 3.4, toeflScore: 98,
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
  { id: "s1", name: "University of Virginia", city: "Charlottesville", state: "VA", division: "NCAA D1", status: "CONTACTED",  style: "bg-blue-50 text-blue-700",    label: "Contacté" },
  { id: "s2", name: "Duke University",        city: "Durham",          state: "NC", division: "NCAA D1", status: "RESPONDED",  style: "bg-amber-50 text-amber-700",  label: "A répondu" },
  { id: "s3", name: "Indiana University",     city: "Bloomington",     state: "IN", division: "NCAA D1", status: "PROSPECT",   style: "bg-gray-100 text-gray-600",   label: "En attente" },
  { id: "s4", name: "Creighton University",   city: "Omaha",           state: "NE", division: "NCAA D1", status: "CONTACTED",  style: "bg-blue-50 text-blue-700",    label: "Contacté" },
  { id: "s5", name: "Grand Valley State",     city: "Allendale",       state: "MI", division: "NCAA D2", status: "OFFER",      style: "bg-green-50 text-green-700",  label: "Offre reçue ✓" },
];

const MOCK_EVENTS = [
  { date: "2026-04-28", title: "Match Champions U19", type: "Match",    location: "Stade de France" },
  { date: "2026-05-01", title: "Deadline NCAA Eligibility", type: "Deadline", location: null },
  { date: "2026-05-20", title: "Visite campus UVA", type: "Visite",   location: "Charlottesville, VA" },
  { date: "2026-06-15", title: "TOEFL", type: "Examen",   location: "Centre agréé Paris" },
];

interface Doc {
  id: string; name: string; category: string; uploadedAt: string; size?: string;
}

const INITIAL_DOCS: Doc[] = [
  { id: "d1", name: "Passeport_LucasMartins.pdf", category: "Identité",   uploadedAt: "2026-01-20", size: "1.2 MB" },
  { id: "d2", name: "Relevés_notes_2025.pdf",     category: "Académique", uploadedAt: "2026-02-01", size: "0.8 MB" },
  { id: "d3", name: "Highlight_2026.mp4",          category: "Sportif",    uploadedAt: "2026-02-10", size: "45 MB" },
  { id: "d4", name: "Contrat_accompagnement.pdf",  category: "Juridique",  uploadedAt: "2026-01-10", size: "0.3 MB" },
];

const DOC_CATEGORIES = ["Identité", "Académique", "Sportif", "Juridique", "Financier", "Autre"];

function StepIcon({ status }: { status: StepStatus }) {
  if (status === "COMPLETED") return <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />;
  if (status === "IN_PROGRESS") return <Clock className="w-5 h-5 text-primary shrink-0" />;
  return <Circle className="w-5 h-5 text-mist shrink-0" />;
}

export default function AthletePortalPage() {
  const [tab, setTab] = useState<Tab>("parcours");
  const [docs, setDocs] = useState<Doc[]>(INITIAL_DOCS);
  const [uploadCategory, setUploadCategory] = useState("Identité");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const athlete = MOCK_ATHLETE;

  const completedSteps = athlete.steps.filter((s) => s.status === "COMPLETED").length;
  const progressPct    = Math.round((completedSteps / athlete.steps.length) * 100);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newDocs: Doc[] = Array.from(files).map((f) => ({
      id: String(Date.now() + Math.random()),
      name: f.name,
      category: uploadCategory,
      uploadedAt: new Date().toISOString().slice(0, 10),
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
    }));
    setDocs((prev) => [...prev, ...newDocs]);
  };

  const TAB_LABELS: Record<Tab, string> = {
    parcours: "Mon parcours",
    universites: "Universités",
    agenda: "Agenda",
    documents: "Documents",
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <header className="bg-white border-b border-line sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">NM</span>
            </div>
            <span className="font-semibold text-sm text-ink">NEXTMOOV</span>
            <span className="text-stone text-sm">/ Espace athlète</span>
          </div>
          <span className="text-xs text-stone">
            {athlete.firstName} {athlete.lastName}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Profile header */}
        <div className="bg-white border border-line rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-ink">{athlete.firstName} {athlete.lastName}</h1>
              <p className="text-sm text-stone mt-0.5">{athlete.nationality} · {athlete.currentClub} · {athlete.primaryPosition}</p>
            </div>
            <span className="text-xs text-stone">Suivi par {athlete.agentName}</span>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-stone mb-1.5">
              <span>Progression globale</span>
              <span className="font-semibold text-primary">{progressPct}% · {completedSteps}/{athlete.steps.length} étapes</span>
            </div>
            <div className="w-full bg-mist rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: "GPA / 4.0", value: athlete.gpaConverted.toFixed(1) },
              { label: "TOEFL",     value: athlete.toeflScore },
              { label: "Réponses",  value: MOCK_UNIVERSITIES.filter((u) => u.status === "RESPONDED" || u.status === "OFFER").length },
            ].map(({ label, value }) => (
              <div key={label} className="bg-paper rounded-lg p-3 text-center border border-line">
                <p className="text-lg font-bold text-ink">{value}</p>
                <p className="text-xs text-stone mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-line mb-6">
          {(["parcours", "universites", "agenda", "documents"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2.5 text-sm border-b-2 -mb-px transition-colors",
                tab === t
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-stone hover:text-graphite"
              )}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Parcours */}
        {tab === "parcours" && (
          <div className="space-y-2">
            {JOURNEY_STEPS.map((step) => {
              const data = athlete.steps.find((s) => s.order === step.order);
              const status: StepStatus = data?.status ?? "PENDING";
              return (
                <div key={step.order} className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border transition-all",
                  status === "COMPLETED"  ? "bg-green-50 border-green-200" :
                  status === "IN_PROGRESS"? "bg-primary-50 border-primary/30" :
                  "bg-white border-line opacity-50"
                )}>
                  <StepIcon status={status} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-stone">Étape {step.order}</span>
                      {status === "IN_PROGRESS" && (
                        <span className="text-xs font-medium text-primary bg-primary-100 px-1.5 py-0.5 rounded-full">En cours</span>
                      )}
                    </div>
                    <p className={cn("text-sm font-medium", status === "PENDING" ? "text-stone" : "text-ink")}>{step.title}</p>
                    {status !== "PENDING" && <p className="text-xs text-stone mt-0.5">{step.description}</p>}
                  </div>
                  {data?.completedDate && (
                    <span className="text-xs text-stone shrink-0">
                      {new Date(data.completedDate + "T12:00").toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Universités */}
        {tab === "universites" && (
          <div>
            <p className="text-sm text-stone mb-4">{MOCK_UNIVERSITIES.length} universités dans votre liste de ciblage</p>
            <div className="space-y-2">
              {MOCK_UNIVERSITIES.map((uni) => (
                <div key={uni.id} className="bg-white border border-line rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-stone mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-ink">{uni.name}</p>
                      <p className="text-xs text-stone mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {uni.city}, {uni.state} · {uni.division}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${uni.style}`}>{uni.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agenda */}
        {tab === "agenda" && (
          <div className="space-y-3">
            {MOCK_EVENTS.map((ev, i) => (
              <div key={i} className="bg-white border border-line rounded-xl p-4 flex gap-4 items-start">
                <div className="text-center w-12 shrink-0">
                  <p className="text-xs text-stone capitalize">
                    {new Date(ev.date + "T12:00").toLocaleDateString("fr-FR", { month: "short" })}
                  </p>
                  <p className="text-2xl font-bold text-ink leading-none">
                    {new Date(ev.date + "T12:00").getDate()}
                  </p>
                </div>
                <div className="border-l border-line pl-4 flex-1">
                  <span className="text-xs text-stone">{ev.type}</span>
                  <p className="text-sm font-medium text-ink mt-0.5">{ev.title}</p>
                  {ev.location && (
                    <p className="text-xs text-stone mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {ev.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documents */}
        {tab === "documents" && (
          <div>
            {/* Upload area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-5",
                dragging ? "border-primary bg-primary-50" : "border-line hover:border-primary hover:bg-paper"
              )}
            >
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              <Upload className="w-8 h-8 text-stone mx-auto mb-2" />
              <p className="text-sm font-medium text-graphite">Déposer des fichiers ici</p>
              <p className="text-xs text-stone mt-1">ou cliquer pour sélectionner · PDF, JPG, MP4, etc.</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="text-xs text-stone">Catégorie :</span>
                <select
                  value={uploadCategory}
                  onChange={(e) => { e.stopPropagation(); setUploadCategory(e.target.value); }}
                  onClick={(e) => e.stopPropagation()}
                  className="border border-line rounded-lg px-2 py-1 text-xs bg-white text-ink focus:outline-none focus:border-primary"
                >
                  {DOC_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Document list */}
            <div className="space-y-2">
              {docs.map((doc) => (
                <div key={doc.id} className="bg-white border border-line rounded-xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{doc.name}</p>
                      <p className="text-xs text-stone mt-0.5">
                        {doc.category} · {new Date(doc.uploadedAt + "T12:00").toLocaleDateString("fr-FR")}
                        {doc.size && ` · ${doc.size}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-stone hover:text-primary transition-colors rounded-lg hover:bg-primary-50" title="Télécharger">
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDocs((prev) => prev.filter((d) => d.id !== doc.id))}
                      className="p-1.5 text-stone hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      title="Supprimer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {docs.length === 0 && (
                <p className="text-center text-sm text-stone py-8">Aucun document uploadé.</p>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-line mt-16 py-6">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs text-stone">NEXTMOOV USA · Varsity Path · Espace confidentiel</p>
        </div>
      </footer>
    </div>
  );
}
