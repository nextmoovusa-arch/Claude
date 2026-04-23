"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User, Trophy, FileText, CheckCircle2, Circle, Clock, ChevronLeft,
  Target, GraduationCap, Globe, Edit3, Upload, Download, Trash2,
  FolderOpen, Building2, Plus, X, ExternalLink, AlertCircle
} from "lucide-react";
import Link from "next/link";

// ── Suivi du projet ────────────────────────────────────────────────────────
type TaskStatus = "Pas nécessaire" | "Pas commencé" | "En cours" | "Terminé";
type TaskEffort = "Faible" | "Moyenne" | "Élevé";
type TaskType =
  | "1. Création du dossier" | "2. Montage vidéo" | "3. Anglais"
  | "4. Démarchage" | "5.1 Inscription Universitaire" | "5.2 Eligibility center"
  | "6. VISA" | "7. Préparation au départ" | "8. Suivi athlète" | "Tests académiques";

interface Task {
  id: string;
  title: string;
  type: TaskType;
  status: TaskStatus;
  effort?: TaskEffort;
  dueDate?: string;
  notes?: string;
}

const TASK_TYPES: TaskType[] = [
  "1. Création du dossier", "2. Montage vidéo", "3. Anglais",
  "4. Démarchage", "5.1 Inscription Universitaire", "5.2 Eligibility center",
  "6. VISA", "7. Préparation au départ", "8. Suivi athlète", "Tests académiques",
];

const TASK_TYPE_COLORS: Record<TaskType, string> = {
  "1. Création du dossier":       "bg-green-100 text-green-800",
  "2. Montage vidéo":             "bg-yellow-100 text-yellow-800",
  "3. Anglais":                   "bg-red-100 text-red-700",
  "4. Démarchage":                "bg-pink-100 text-pink-800",
  "5.1 Inscription Universitaire":"bg-blue-100 text-blue-800",
  "5.2 Eligibility center":       "bg-stone/20 text-graphite",
  "6. VISA":                      "bg-graphite/10 text-graphite",
  "7. Préparation au départ":     "bg-amber-100 text-amber-800",
  "8. Suivi athlète":             "bg-purple-100 text-purple-800",
  "Tests académiques":            "bg-orange-100 text-orange-800",
};

const TASK_STATUS_CONFIG: Record<TaskStatus, { icon: React.ReactNode; color: string }> = {
  "Terminé":        { icon: <CheckCircle2 className="w-4 h-4 text-green-600" />, color: "text-green-700 bg-green-50" },
  "En cours":       { icon: <Clock className="w-4 h-4 text-blue-600" />,        color: "text-blue-700 bg-blue-50" },
  "Pas commencé":   { icon: <Circle className="w-4 h-4 text-stone" />,          color: "text-graphite bg-paper" },
  "Pas nécessaire": { icon: <Circle className="w-4 h-4 text-line" />,           color: "text-stone bg-paper line-through" },
};

const MOCK_TASKS: Task[] = [
  { id: "t1", title: "Création du dossier athlète", type: "1. Création du dossier", status: "Terminé", effort: "Moyenne" },
  { id: "t2", title: "Highlight vidéo 3 min", type: "2. Montage vidéo", status: "Terminé", effort: "Élevé" },
  { id: "t3", title: "Cours d'anglais — TOEFL prep", type: "3. Anglais", status: "En cours", effort: "Élevé", dueDate: "2026-06-01" },
  { id: "t4", title: "Campagne emails NCAA D1", type: "4. Démarchage", status: "En cours", effort: "Élevé" },
  { id: "t5", title: "Inscription NCAA Eligibility Center", type: "5.2 Eligibility center", status: "Pas commencé", effort: "Moyenne", dueDate: "2026-05-01" },
  { id: "t6", title: "SAT / ACT", type: "Tests académiques", status: "Terminé", effort: "Élevé" },
  { id: "t7", title: "TOEFL", type: "Tests académiques", status: "En cours", effort: "Élevé", dueDate: "2026-06-15" },
  { id: "t8", title: "Visa F-1", type: "6. VISA", status: "Pas commencé" },
  { id: "t9", title: "Inscription universitaire", type: "5.1 Inscription Universitaire", status: "Pas commencé" },
  { id: "t10", title: "Préparation au départ USA", type: "7. Préparation au départ", status: "Pas commencé" },
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
};

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between py-2.5 border-b border-line last:border-0">
      <span className="text-sm font-mono text-graphite">{label}</span>
      <span className="text-sm text-ink font-medium">{value}</span>
    </div>
  );
}

// ── Shortlist ──────────────────────────────────────────────────────────────
type ShortlistStatus = "PROSPECT" | "CONTACTED" | "RESPONDED" | "OFFER" | "COMMITTED" | "REJECTED";

interface ShortlistEntry {
  id: string;
  universityId: string;
  universityName: string;
  city: string;
  state: string;
  division: string;
  status: ShortlistStatus;
  scholarshipPct?: number;
  notes?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  addedAt: string;
}

const SHORTLIST_STATUS_CONFIG: Record<ShortlistStatus, { label: string; color: string }> = {
  PROSPECT:  { label: "Prospect",  color: "bg-stone text-ink" },
  CONTACTED: { label: "Contacté",  color: "bg-navy/10 text-navy" },
  RESPONDED: { label: "A répondu", color: "bg-amber-100 text-amber-800" },
  OFFER:     { label: "Offre",     color: "bg-green-100 text-green-800" },
  COMMITTED: { label: "Engagé",    color: "bg-green-700 text-white" },
  REJECTED:  { label: "Refusé",    color: "bg-red-100 text-red-700" },
};

const MOCK_SHORTLIST: ShortlistEntry[] = [
  { id: "s1", universityId: "1", universityName: "University of Virginia", city: "Charlottesville", state: "VA", division: "NCAA D1", status: "CONTACTED", priority: "HIGH", addedAt: "2026-03-01", notes: "Visite officielle prévue 20 mai" },
  { id: "s2", universityId: "2", universityName: "Duke University", city: "Durham", state: "NC", division: "NCAA D1", status: "RESPONDED", priority: "HIGH", addedAt: "2026-03-01", notes: "Intéressé, demande vidéo supplémentaire" },
  { id: "s3", universityId: "3", universityName: "Indiana University", city: "Bloomington", state: "IN", division: "NCAA D1", status: "PROSPECT", priority: "MEDIUM", addedAt: "2026-03-05" },
  { id: "s4", universityId: "10", universityName: "Creighton University", city: "Omaha", state: "NE", division: "NCAA D1", status: "CONTACTED", priority: "MEDIUM", addedAt: "2026-03-10" },
  { id: "s5", universityId: "5", universityName: "Grand Valley State University", city: "Allendale", state: "MI", division: "NCAA D2", status: "OFFER", scholarshipPct: 60, priority: "LOW", addedAt: "2026-03-15", notes: "60% scholarship offert" },
];

// ── Documents ───────────────────────────────────────────────────────────────
type DocCategory = "IDENTITE" | "ACADEMIQUE" | "SPORTIF" | "JURIDIQUE";

interface AthleteDoc {
  id: string;
  name: string;
  category: DocCategory;
  uploadedAt: string;
  sizeKb: number;
  mimeType: string;
}

const DOC_CATEGORY_LABELS: Record<DocCategory, string> = {
  IDENTITE: "Identité",
  ACADEMIQUE: "Académique",
  SPORTIF: "Sportif",
  JURIDIQUE: "Juridique",
};

const DOC_CATEGORY_COLORS: Record<DocCategory, string> = {
  IDENTITE: "bg-navy/10 text-navy",
  ACADEMIQUE: "bg-amber-100 text-amber-800",
  SPORTIF: "bg-green-100 text-green-800",
  JURIDIQUE: "bg-red-flag/10 text-red-flag",
};

const MOCK_DOCS: AthleteDoc[] = [
  { id: "d1", name: "Passeport_LucasMartins.pdf", category: "IDENTITE", uploadedAt: "2026-01-20", sizeKb: 842, mimeType: "application/pdf" },
  { id: "d2", name: "Relevés_notes_2025.pdf", category: "ACADEMIQUE", uploadedAt: "2026-02-01", sizeKb: 1240, mimeType: "application/pdf" },
  { id: "d3", name: "Highlight_2026.mp4", category: "SPORTIF", uploadedAt: "2026-02-10", sizeKb: 84200, mimeType: "video/mp4" },
  { id: "d4", name: "Contrat_accompagnement.pdf", category: "JURIDIQUE", uploadedAt: "2026-01-10", sizeKb: 320, mimeType: "application/pdf" },
  { id: "d5", name: "Bulletin_S1_2025.pdf", category: "ACADEMIQUE", uploadedAt: "2026-02-15", sizeKb: 560, mimeType: "application/pdf" },
];

type Tab = "taches" | "profil" | "academique" | "strategie" | "universites" | "documents";

const TAB_LABELS: Record<Tab, string> = {
  taches:     "Suivi du projet",
  profil:     "Profil sportif",
  academique: "Académique",
  strategie:  "Stratégie",
  universites:"Universités ciblées",
  documents:  "Documents",
};

export default function AthletePage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<Tab>("taches");
  const [athlete] = useState(MOCK_ATHLETE);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [taskFilter, setTaskFilter] = useState<string>("Tous");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({ type: "1. Création du dossier", status: "Pas commencé" });
  const [docs, setDocs] = useState<AthleteDoc[]>(MOCK_DOCS);
  const [docFilter, setDocFilter] = useState<DocCategory | "ALL">("ALL");
  const [shortlist, setShortlist] = useState<ShortlistEntry[]>(MOCK_SHORTLIST);
  const [shortlistFilter, setShortlistFilter] = useState<ShortlistStatus | "ALL">("ALL");
  const [showAddUni, setShowAddUni] = useState(false);
  const [newUniSearch, setNewUniSearch] = useState("");
  const [editingShortlistId, setEditingShortlistId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const completedTasks = tasks.filter((t) => t.status === "Terminé").length;
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
        <div className="flex gap-2">
          <a
            href={`/portal/${params.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              Portail athlète
            </Button>
          </a>
          <Link href={`/admin/athletes/${params.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit3 className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 bg-white border border-line rounded-lg p-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-graphite">Tâches terminées</span>
          <span className="text-sm font-semibold text-navy">{completedTasks} / {tasks.filter(t => t.status !== "Pas nécessaire").length}</span>
        </div>
        <div className="w-full bg-stone/20 rounded-full h-1.5">
          <div
            className="bg-navy h-1.5 rounded-full transition-all"
            style={{ width: `${tasks.filter(t => t.status !== "Pas nécessaire").length > 0 ? (completedTasks / tasks.filter(t => t.status !== "Pas nécessaire").length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-line overflow-x-auto">
        {(["taches", "profil", "academique", "strategie", "universites", "documents"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px whitespace-nowrap ${
              tab === t ? "border-navy text-navy font-semibold" : "border-transparent text-graphite hover:text-ink"
            }`}
          >
            {t === "universites" ? `Universités (${shortlist.length})` : t === "documents" ? `Documents (${docs.length})` : t === "taches" ? `Suivi du projet (${tasks.length})` : TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Tab: Suivi du projet */}
      {tab === "taches" && (
        <div>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setTaskFilter("Tous")}
                className={`px-3 py-1.5 text-xs rounded transition-colors ${taskFilter === "Tous" ? "bg-navy text-paper" : "bg-white border border-line text-graphite hover:border-navy"}`}
              >
                Toutes ({tasks.length})
              </button>
              {(["En cours", "Pas commencé", "Terminé", "Pas nécessaire"] as TaskStatus[]).map((s) => (
                <button key={s} onClick={() => setTaskFilter(s)}
                  className={`px-3 py-1.5 text-xs rounded transition-colors ${taskFilter === s ? "bg-navy text-paper" : "bg-white border border-line text-graphite hover:border-navy"}`}>
                  {s} ({tasks.filter(t => t.status === s).length})
                </button>
              ))}
            </div>
            <button onClick={() => setShowAddTask(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-paper text-sm rounded hover:bg-navy/90">
              <Plus className="w-4 h-4" /> Ajouter une tâche
            </button>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-4 gap-px border border-line bg-line rounded-lg overflow-hidden mb-4">
            {([["En cours", "text-blue-700"], ["Pas commencé", "text-graphite"], ["Terminé", "text-green-700"], ["Pas nécessaire", "text-stone"]] as [TaskStatus, string][]).map(([s, color]) => (
              <div key={s} className="bg-white px-4 py-3 text-center">
                <p className={`text-2xl font-bold ${color}`}>{tasks.filter(t => t.status === s).length}</p>
                <p className="text-xs text-graphite mt-0.5">{s}</p>
              </div>
            ))}
          </div>

          {/* Grouped by type */}
          <div className="space-y-1">
            {(taskFilter === "Tous" ? TASK_TYPES : TASK_TYPES).map((type) => {
              const typeTasks = tasks.filter(t => t.type === type && (
                taskFilter === "Tous" || (t.status as string) === taskFilter
              ));
              if (typeTasks.length === 0) return null;
              return (
                <div key={type}>
                  <p className="text-xs font-semibold text-graphite uppercase tracking-widest px-1 pt-3 pb-1">{type}</p>
                  {typeTasks.map(task => {
                    const cfg = TASK_STATUS_CONFIG[task.status];
                    return (
                      <div key={task.id} className="flex items-center gap-3 bg-white border border-line rounded px-4 py-3 mb-1 hover:bg-paper/60 transition-colors">
                        <button onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? {
                          ...t,
                          status: t.status === "Terminé" ? "En cours" : t.status === "En cours" ? "Pas commencé" : t.status === "Pas commencé" ? "Terminé" : "Pas commencé"
                        } : t))}>
                          {cfg.icon}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${task.status === "Pas nécessaire" ? "line-through text-stone" : "text-ink"}`}>{task.title}</p>
                          {task.notes && <p className="text-xs text-graphite mt-0.5 truncate">{task.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {task.dueDate && (
                            <span className={`text-xs font-mono ${new Date(task.dueDate) < new Date() && task.status !== "Terminé" ? "text-red-flag font-semibold" : "text-graphite"}`}>
                              {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                            </span>
                          )}
                          {task.effort && (
                            <span className={`text-xs px-2 py-0.5 rounded font-mono ${task.effort === "Élevé" ? "bg-red-50 text-red-700" : task.effort === "Moyenne" ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"}`}>
                              {task.effort}
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded ${TASK_TYPE_COLORS[task.type]}`}>{task.type}</span>
                          <button onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))} className="text-graphite hover:text-red-flag">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Ajouter tâche modal */}
          {showAddTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white border border-line rounded-lg w-full max-w-md p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-graphite">Nouvelle tâche</h2>
                  <button onClick={() => setShowAddTask(false)}><X className="w-4 h-4 text-graphite" /></button>
                </div>
                <div className="space-y-3">
                  <input placeholder="Nom de la tâche *" value={newTask.title ?? ""} onChange={e => setNewTask(p => ({...p, title: e.target.value}))}
                    className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy" />
                  <select value={newTask.type} onChange={e => setNewTask(p => ({...p, type: e.target.value as TaskType}))}
                    className="w-full border border-line rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-navy">
                    {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={newTask.status} onChange={e => setNewTask(p => ({...p, status: e.target.value as TaskStatus}))}
                    className="w-full border border-line rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-navy">
                    {(["Pas commencé", "En cours", "Terminé", "Pas nécessaire"] as TaskStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <select value={newTask.effort ?? ""} onChange={e => setNewTask(p => ({...p, effort: e.target.value as TaskEffort}))}
                    className="w-full border border-line rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-navy">
                    <option value="">Effort (optionnel)</option>
                    {(["Faible", "Moyenne", "Élevé"] as TaskEffort[]).map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  <input type="date" value={newTask.dueDate ?? ""} onChange={e => setNewTask(p => ({...p, dueDate: e.target.value}))}
                    className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy" />
                  <input placeholder="Notes" value={newTask.notes ?? ""} onChange={e => setNewTask(p => ({...p, notes: e.target.value}))}
                    className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy" />
                </div>
                <button
                  onClick={() => {
                    if (!newTask.title) return;
                    setTasks(prev => [...prev, { id: String(Date.now()), title: newTask.title!, type: newTask.type!, status: newTask.status!, effort: newTask.effort, dueDate: newTask.dueDate, notes: newTask.notes }]);
                    setNewTask({ type: "1. Création du dossier", status: "Pas commencé" });
                    setShowAddTask(false);
                  }}
                  className="w-full mt-4 py-2 bg-navy text-paper text-sm rounded hover:bg-navy/90"
                >
                  Ajouter
                </button>
              </div>
            </div>
          )}
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

      {/* Tab: Universités ciblées */}
      {tab === "universites" && (
        <div>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="flex gap-1.5 flex-wrap">
              {(["ALL", "PROSPECT", "CONTACTED", "RESPONDED", "OFFER", "COMMITTED", "REJECTED"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setShortlistFilter(s)}
                  className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                    shortlistFilter === s
                      ? "bg-navy text-paper"
                      : "bg-white border border-line text-graphite hover:border-graphite"
                  }`}
                >
                  {s === "ALL" ? `Toutes (${shortlist.length})` : SHORTLIST_STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {compareIds.length >= 2 && (
                <button
                  onClick={() => setShowCompare(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white text-sm font-mono rounded hover:bg-amber-700 transition-colors"
                >
                  Comparer ({compareIds.length})
                </button>
              )}
              <button
                onClick={() => setShowAddUni(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-paper text-sm font-mono rounded hover:bg-navy/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Ajouter université
              </button>
            </div>
          </div>

          {/* Summary counts */}
          <div className="grid grid-cols-5 gap-px border border-line bg-line mb-4">
            {(["CONTACTED", "RESPONDED", "OFFER", "COMMITTED", "REJECTED"] as ShortlistStatus[]).map((s) => {
              const count = shortlist.filter((e) => e.status === s).length;
              const cfg = SHORTLIST_STATUS_CONFIG[s];
              return (
                <div key={s} className="bg-white px-4 py-3 text-center">
                  <p className="text-2xl font-mono text-ink">{count}</p>
                  <p className="text-xs font-mono text-graphite mt-0.5">{cfg.label}</p>
                </div>
              );
            })}
          </div>

          {/* Shortlist table */}
          <div className="bg-white border border-line rounded-lg overflow-hidden">
            {shortlist.filter((e) => shortlistFilter === "ALL" || e.status === shortlistFilter).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-graphite">
                <Building2 className="w-10 h-10 mb-3 text-stone" />
                <p className="text-sm font-mono">Aucune université dans cette catégorie</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-line bg-paper">
                  <tr>
                    <th className="px-3 py-3 text-xs font-mono text-graphite text-center w-8" title="Sélectionner pour comparer">≡</th>
                    <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Université</th>
                    <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Division</th>
                    <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Statut</th>
                    <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Priorité</th>
                    <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Notes</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {shortlist
                    .filter((e) => shortlistFilter === "ALL" || e.status === shortlistFilter)
                    .map((entry) => {
                      const cfg = SHORTLIST_STATUS_CONFIG[entry.status];
                      const isEditing = editingShortlistId === entry.id;
                      return (
                        <tr key={entry.id} className="border-b border-line last:border-0 hover:bg-paper/50 transition-colors">
                          <td className="px-3 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={compareIds.includes(entry.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCompareIds((prev) => prev.length < 3 ? [...prev, entry.id] : prev);
                                } else {
                                  setCompareIds((prev) => prev.filter((id) => id !== entry.id));
                                }
                              }}
                              className="w-3.5 h-3.5 accent-navy"
                              title="Comparer"
                            />
                          </td>
                          <td className="px-5 py-3">
                            <p className="font-medium text-ink">{entry.universityName}</p>
                            <p className="text-xs font-mono text-graphite">{entry.city}, {entry.state}</p>
                          </td>
                          <td className="px-5 py-3">
                            <span className="text-xs font-mono bg-navy/10 text-navy px-2 py-0.5 rounded">
                              {entry.division}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            {isEditing ? (
                              <select
                                value={entry.status}
                                onChange={(e) => {
                                  setShortlist((prev) => prev.map((x) =>
                                    x.id === entry.id ? { ...x, status: e.target.value as ShortlistStatus } : x
                                  ));
                                }}
                                className="text-xs font-mono border border-line rounded px-2 py-1 bg-white"
                              >
                                {Object.entries(SHORTLIST_STATUS_CONFIG).map(([k, v]) => (
                                  <option key={k} value={k}>{v.label}</option>
                                ))}
                              </select>
                            ) : (
                              <span className={`px-2 py-0.5 rounded text-xs font-mono ${cfg.color}`}>
                                {cfg.label}
                                {entry.scholarshipPct && ` · ${entry.scholarshipPct}%`}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`text-xs font-mono ${
                              entry.priority === "HIGH" ? "text-red-flag font-semibold" :
                              entry.priority === "MEDIUM" ? "text-navy" : "text-graphite"
                            }`}>
                              {entry.priority === "HIGH" ? "Haute" : entry.priority === "MEDIUM" ? "Moyenne" : "Basse"}
                            </span>
                          </td>
                          <td className="px-5 py-3 max-w-xs">
                            {isEditing ? (
                              <input
                                value={entry.notes ?? ""}
                                onChange={(e) => setShortlist((prev) => prev.map((x) =>
                                  x.id === entry.id ? { ...x, notes: e.target.value } : x
                                ))}
                                className="w-full text-xs font-mono border border-line rounded px-2 py-1"
                                placeholder="Notes..."
                              />
                            ) : (
                              <p className="text-xs text-graphite truncate">{entry.notes ?? "—"}</p>
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1.5 justify-end">
                              {isEditing ? (
                                <button
                                  onClick={() => setEditingShortlistId(null)}
                                  className="p-1 text-green-600 hover:text-green-700"
                                  title="Confirmer"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => setEditingShortlistId(entry.id)}
                                  className="p-1 text-graphite hover:text-navy"
                                  title="Modifier statut"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              )}
                              <a
                                href={`/admin/universities/${entry.universityId}`}
                                className="p-1 text-graphite hover:text-navy"
                                title="Voir fiche université"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => setShortlist((prev) => prev.filter((x) => x.id !== entry.id))}
                                className="p-1 text-graphite hover:text-red-flag"
                                title="Retirer de la liste"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>

          <p className="text-xs font-mono text-stone mt-3">
            {shortlist.length} université{shortlist.length !== 1 ? "s" : ""} dans la liste de ciblage
            {compareIds.length > 0 && ` · ${compareIds.length} sélectionnée${compareIds.length > 1 ? "s" : ""} pour comparaison`}
          </p>

          {/* University comparison modal */}
          {showCompare && compareIds.length >= 2 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="bg-white border border-line rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl">
                <div className="flex items-center justify-between p-6 border-b border-line sticky top-0 bg-white z-10">
                  <h2 className="text-sm font-mono uppercase tracking-widest text-graphite">
                    Comparaison universités
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={() => { setCompareIds([]); setShowCompare(false); }} className="text-xs font-mono text-graphite hover:text-ink">
                      Effacer sélection
                    </button>
                    <button onClick={() => setShowCompare(false)}>
                      <X className="w-4 h-4 text-graphite hover:text-ink ml-4" />
                    </button>
                  </div>
                </div>

                {(() => {
                  const compared = shortlist.filter((e) => compareIds.includes(e.id));
                  const UNI_DATA: Record<string, { sat: string; acceptance: string; tuition: string; scholarships: string; rosterSize: string }> = {
                    "1":  { sat: "1480–1570", acceptance: "19%",  tuition: "$48k/an", scholarships: "11.5", rosterSize: "23 joueurs" },
                    "2":  { sat: "1500–1580", acceptance: "6%",   tuition: "$59k/an", scholarships: "9.9",  rosterSize: "27 joueurs" },
                    "3":  { sat: "1180–1400", acceptance: "82%",  tuition: "$37k/an", scholarships: "9.9",  rosterSize: "28 joueurs" },
                    "10": { sat: "1250–1430", acceptance: "67%",  tuition: "$42k/an", scholarships: "9.9",  rosterSize: "25 joueurs" },
                    "5":  { sat: "1080–1270", acceptance: "83%",  tuition: "$18k/an", scholarships: "9.0",  rosterSize: "31 joueurs" },
                  };

                  const rows = [
                    { label: "Division", key: "division" as const, fn: (e: typeof compared[0]) => e.division },
                    { label: "Localisation", key: "location" as const, fn: (e: typeof compared[0]) => `${e.city}, ${e.state}` },
                    { label: "Statut", key: "status" as const, fn: (e: typeof compared[0]) => SHORTLIST_STATUS_CONFIG[e.status].label },
                    { label: "SAT moyen", key: "sat" as const, fn: (e: typeof compared[0]) => UNI_DATA[e.universityId]?.sat ?? "—" },
                    { label: "Taux d'acceptation", key: "acceptance" as const, fn: (e: typeof compared[0]) => UNI_DATA[e.universityId]?.acceptance ?? "—" },
                    { label: "Frais (out-of-state)", key: "tuition" as const, fn: (e: typeof compared[0]) => UNI_DATA[e.universityId]?.tuition ?? "—" },
                    { label: "Bourses (équiv.)", key: "scholarships" as const, fn: (e: typeof compared[0]) => UNI_DATA[e.universityId]?.scholarships ?? "—" },
                    { label: "Effectif équipe", key: "roster" as const, fn: (e: typeof compared[0]) => UNI_DATA[e.universityId]?.rosterSize ?? "—" },
                    { label: "Notes agent", key: "notes" as const, fn: (e: typeof compared[0]) => e.notes ?? "—" },
                  ];

                  return (
                    <table className="w-full text-sm">
                      <thead className="border-b border-line bg-paper">
                        <tr>
                          <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite w-40">Critère</th>
                          {compared.map((e) => (
                            <th key={e.id} className="text-left px-5 py-3">
                              <p className="font-semibold text-ink">{e.universityName}</p>
                              <p className="text-xs font-mono text-graphite font-normal">{e.city}, {e.state}</p>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, ri) => (
                          <tr key={row.key} className={`border-b border-line last:border-0 ${ri % 2 === 0 ? "bg-white" : "bg-paper/50"}`}>
                            <td className="px-5 py-3 text-xs font-mono text-graphite uppercase tracking-widest">{row.label}</td>
                            {compared.map((e) => (
                              <td key={e.id} className="px-5 py-3 font-medium text-ink">{row.fn(e)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Add university modal */}
          {showAddUni && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white border border-line rounded-lg w-full max-w-lg mx-4 p-6 shadow-xl">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-mono uppercase tracking-widest text-graphite">
                    Ajouter une université
                  </h2>
                  <button onClick={() => { setShowAddUni(false); setNewUniSearch(""); }}>
                    <X className="w-4 h-4 text-graphite hover:text-ink" />
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Rechercher une université..."
                  value={newUniSearch}
                  onChange={(e) => setNewUniSearch(e.target.value)}
                  className="w-full border border-line rounded px-3 py-2 text-sm font-mono mb-3 focus:outline-none focus:ring-1 focus:ring-navy"
                  autoFocus
                />

                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {[
                    { id: "1", name: "University of Virginia", city: "Charlottesville", state: "VA", division: "NCAA D1" },
                    { id: "2", name: "Duke University", city: "Durham", state: "NC", division: "NCAA D1" },
                    { id: "3", name: "Indiana University", city: "Bloomington", state: "IN", division: "NCAA D1" },
                    { id: "4", name: "Wake Forest University", city: "Winston-Salem", state: "NC", division: "NCAA D1" },
                    { id: "5", name: "Grand Valley State University", city: "Allendale", state: "MI", division: "NCAA D2" },
                    { id: "6", name: "Adelphi University", city: "Garden City", state: "NY", division: "NCAA D2" },
                    { id: "7", name: "Messiah University", city: "Mechanicsburg", state: "PA", division: "NCAA D3" },
                    { id: "8", name: "George Fox University", city: "Newberg", state: "OR", division: "NAIA" },
                    { id: "9", name: "Hutchinson Community College", city: "Hutchinson", state: "KS", division: "NJCAA D1" },
                    { id: "10", name: "Creighton University", city: "Omaha", state: "NE", division: "NCAA D1" },
                  ]
                    .filter((u) =>
                      !shortlist.some((e) => e.universityId === u.id) &&
                      (newUniSearch === "" || u.name.toLowerCase().includes(newUniSearch.toLowerCase()) || u.state.toLowerCase().includes(newUniSearch.toLowerCase()))
                    )
                    .map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setShortlist((prev) => [
                            ...prev,
                            {
                              id: String(Date.now()),
                              universityId: u.id,
                              universityName: u.name,
                              city: u.city,
                              state: u.state,
                              division: u.division,
                              status: "PROSPECT",
                              priority: "MEDIUM",
                              addedAt: new Date().toISOString().split("T")[0],
                            },
                          ]);
                          setShowAddUni(false);
                          setNewUniSearch("");
                        }}
                        className="w-full text-left px-4 py-3 rounded hover:bg-paper transition-colors border border-transparent hover:border-line"
                      >
                        <p className="text-sm font-medium text-ink">{u.name}</p>
                        <p className="text-xs font-mono text-graphite">{u.city}, {u.state} · {u.division}</p>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Documents */}
      {tab === "documents" && (
        <div>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1.5">
              {(["ALL", "IDENTITE", "ACADEMIQUE", "SPORTIF", "JURIDIQUE"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDocFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                    docFilter === cat
                      ? "bg-navy text-paper"
                      : "bg-white border border-line text-graphite hover:border-graphite"
                  }`}
                >
                  {cat === "ALL" ? "Tous" : DOC_CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
            <label className="cursor-pointer">
              <input type="file" className="hidden" multiple onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                const newDocs: AthleteDoc[] = files.map((f) => ({
                  id: String(Date.now() + Math.random()),
                  name: f.name,
                  category: "IDENTITE",
                  uploadedAt: new Date().toISOString().split("T")[0],
                  sizeKb: Math.round(f.size / 1024),
                  mimeType: f.type,
                }));
                setDocs((prev) => [...newDocs, ...prev]);
                e.target.value = "";
              }} />
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-paper text-sm font-mono rounded hover:bg-navy/90 transition-colors">
                <Upload className="w-4 h-4" />
                Ajouter un document
              </span>
            </label>
          </div>

          {/* Doc list */}
          <div className="bg-white border border-line rounded-lg overflow-hidden">
            {docs.filter((d) => docFilter === "ALL" || d.category === docFilter).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-graphite">
                <FolderOpen className="w-10 h-10 mb-3 text-stone" />
                <p className="text-sm font-mono">Aucun document dans cette catégorie</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-line bg-paper">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Nom</th>
                    <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Catégorie</th>
                    <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Taille</th>
                    <th className="text-left px-5 py-3 text-xs font-mono uppercase tracking-widest text-graphite">Ajouté le</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {docs
                    .filter((d) => docFilter === "ALL" || d.category === docFilter)
                    .map((doc) => (
                      <tr key={doc.id} className="border-b border-line last:border-0 hover:bg-paper/50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-graphite flex-shrink-0" />
                            <span className="font-medium text-ink truncate max-w-xs">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-mono ${DOC_CATEGORY_COLORS[doc.category]}`}>
                            {DOC_CATEGORY_LABELS[doc.category]}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono text-graphite text-xs">
                          {doc.sizeKb >= 1024
                            ? `${(doc.sizeKb / 1024).toFixed(1)} MB`
                            : `${doc.sizeKb} KB`}
                        </td>
                        <td className="px-5 py-3 font-mono text-graphite text-xs">
                          {new Date(doc.uploadedAt + "T12:00").toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              title="Télécharger"
                              className="p-1 text-graphite hover:text-navy transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              title="Supprimer"
                              onClick={() => setDocs((prev) => prev.filter((d) => d.id !== doc.id))}
                              className="p-1 text-graphite hover:text-red-flag transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>

          <p className="text-xs font-mono text-stone mt-3">
            {docs.length} document{docs.length !== 1 ? "s" : ""} · Formats acceptés: PDF, JPG, PNG, MP4, DOCX
          </p>
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
