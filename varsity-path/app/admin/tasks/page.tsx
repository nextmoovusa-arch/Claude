"use client";

import { useState, useMemo } from "react";
import {
  CheckSquare, Square, Plus, X, User, BookOpen,
  Trophy, DollarSign, MessageSquare, FileText, Target, ListTodo
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED" | "CANCELLED";
type TaskCategory = "ACADEMIC" | "ADMINISTRATIVE" | "SPORTS" | "STRATEGY" | "COMMUNICATION" | "FINANCIAL";

interface Task {
  id: string; title: string; description?: string;
  category: TaskCategory; status: TaskStatus;
  priority: 1 | 2 | 3; athleteName: string; athleteId: string;
  dueDate?: string; completedAt?: string;
}

const CATEGORY_CONFIG: Record<TaskCategory, { label: string; style: string; icon: React.ElementType }> = {
  ACADEMIC:       { label: "Académique",    style: "bg-blue-50 text-blue-700",   icon: BookOpen },
  ADMINISTRATIVE: { label: "Administratif", style: "bg-purple-50 text-purple-700",icon: FileText },
  SPORTS:         { label: "Sportif",       style: "bg-green-50 text-green-700", icon: Trophy },
  STRATEGY:       { label: "Stratégie",     style: "bg-primary-50 text-primary", icon: Target },
  COMMUNICATION:  { label: "Communication", style: "bg-amber-50 text-amber-700", icon: MessageSquare },
  FINANCIAL:      { label: "Financier",     style: "bg-red-50 text-red-600",     icon: DollarSign },
};

const STATUS_TABS: Array<{ value: TaskStatus | ""; label: string }> = [
  { value: "",           label: "Toutes" },
  { value: "TODO",       label: "À faire" },
  { value: "IN_PROGRESS",label: "En cours" },
  { value: "DONE",       label: "Terminées" },
  { value: "BLOCKED",    label: "Bloquées" },
];

const MOCK_TASKS: Task[] = [
  { id: "1", title: "Repasser le TOEFL", description: "Viser 100+ pour améliorer l'admissibilité aux D1", category: "ACADEMIC", status: "TODO", priority: 1, athleteName: "Lucas Martins", athleteId: "1", dueDate: "2026-06-15" },
  { id: "2", title: "Créer le profil NCAA Eligibility Center", description: "Compléter l'inscription sur eligibilitycenter.org et soumettre les relevés de notes", category: "ADMINISTRATIVE", status: "IN_PROGRESS", priority: 1, athleteName: "Lucas Martins", athleteId: "1", dueDate: "2026-05-01" },
  { id: "3", title: "Mettre à jour la vidéo highlight", description: "Inclure les 5 meilleurs buts et actions de la saison 2026", category: "SPORTS", status: "TODO", priority: 2, athleteName: "Lucas Martins", athleteId: "1", dueDate: "2026-05-10" },
  { id: "4", title: "Préparer le dossier identité", description: "Passeport, acte de naissance, photos d'identité", category: "ADMINISTRATIVE", status: "DONE", priority: 2, athleteName: "Sofia Chen", athleteId: "2", completedAt: "2026-03-10" },
  { id: "5", title: "Sélectionner les universités cibles", description: "Finaliser liste de 30-40 programmes D1/D2 en coordination avec la famille", category: "STRATEGY", status: "IN_PROGRESS", priority: 1, athleteName: "Sofia Chen", athleteId: "2", dueDate: "2026-04-30" },
  { id: "6", title: "Passer le SAT", description: "Inscription pour session de juin 2026", category: "ACADEMIC", status: "TODO", priority: 2, athleteName: "Sofia Chen", athleteId: "2", dueDate: "2026-06-01" },
];

const ATHLETES_LIST = [
  { id: "1", name: "Lucas Martins" },
  { id: "2", name: "Sofia Chen" },
  { id: "3", name: "Emma Bergström" },
];

const selectCls = "border border-line rounded-lg px-3 py-1.5 text-sm bg-white text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activeTab, setActiveTab]     = useState<TaskStatus | "">("");
  const [filterAthlete, setFilterAthlete] = useState("");
  const [filterCategory, setFilterCategory] = useState<TaskCategory | "">("");
  const [showModal, setShowModal]     = useState(false);

  const [newTitle, setNewTitle]       = useState("");
  const [newDesc, setNewDesc]         = useState("");
  const [newCategory, setNewCategory] = useState<TaskCategory>("ACADEMIC");
  const [newPriority, setNewPriority] = useState<1 | 2 | 3>(2);
  const [newAthleteId, setNewAthleteId] = useState("1");
  const [newDueDate, setNewDueDate]   = useState("");

  const filtered = useMemo(() => tasks.filter((t) => {
    const matchTab      = !activeTab || t.status === activeTab;
    const matchAthlete  = !filterAthlete || t.athleteName === filterAthlete;
    const matchCategory = !filterCategory || t.category === filterCategory;
    return matchTab && matchAthlete && matchCategory;
  }), [tasks, activeTab, filterAthlete, filterCategory]);

  const countForTab = (s: TaskStatus | "") => s ? tasks.filter((t) => t.status === s).length : tasks.length;

  const toggleDone = (id: string) =>
    setTasks((prev) => prev.map((t) =>
      t.id !== id ? t :
      t.status === "DONE"
        ? { ...t, status: "TODO", completedAt: undefined }
        : { ...t, status: "DONE", completedAt: new Date().toISOString() }
    ));

  const handleCreate = () => {
    if (!newTitle) return;
    const athlete = ATHLETES_LIST.find((a) => a.id === newAthleteId);
    setTasks((prev) => [{ id: String(Date.now()), title: newTitle, description: newDesc || undefined, category: newCategory, status: "TODO", priority: newPriority, athleteName: athlete?.name ?? "", athleteId: newAthleteId, dueDate: newDueDate || undefined }, ...prev]);
    setShowModal(false);
    setNewTitle(""); setNewDesc(""); setNewDueDate("");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <ListTodo className="w-5 h-5 text-stone" />
          <h1 className="text-xl font-semibold text-ink">Tâches</h1>
        </div>
        <Button size="md" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Nouvelle tâche
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 mb-4">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
              activeTab === tab.value ? "bg-primary text-white font-medium" : "text-stone hover:bg-mist"
            )}
          >
            {tab.label}
            <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium", activeTab === tab.value ? "bg-white/20 text-white" : "bg-mist text-stone")}>
              {countForTab(tab.value)}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <select value={filterAthlete} onChange={(e) => setFilterAthlete(e.target.value)} className={selectCls}>
          <option value="">Tous les athlètes</option>
          {Array.from(new Set(tasks.map((t) => t.athleteName))).map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as TaskCategory | "")} className={selectCls}>
          <option value="">Toutes les catégories</option>
          {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        {(filterAthlete || filterCategory) && (
          <button onClick={() => { setFilterAthlete(""); setFilterCategory(""); }} className="flex items-center gap-1.5 text-xs text-stone hover:text-graphite px-2">
            <X className="w-3.5 h-3.5" /> Réinitialiser
          </button>
        )}
        <p className="text-xs text-stone self-center ml-auto">{filtered.length} tâche{filtered.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Task list */}
      <div className="space-y-2">
        {filtered.map((task) => {
          const catCfg = CATEGORY_CONFIG[task.category];
          const CatIcon = catCfg.icon;
          const isOverdue = task.dueDate && task.status !== "DONE" && new Date(task.dueDate) < new Date();
          const priorityColor = task.priority === 1 ? "text-red-500" : task.priority === 2 ? "text-amber-500" : "text-stone";

          return (
            <div key={task.id} className={cn(
              "flex items-start gap-3 p-3.5 bg-white border rounded-lg transition-colors hover:bg-paper",
              task.status === "DONE" ? "opacity-60" : "border-line",
              isOverdue && "border-red-200"
            )}>
              <button onClick={() => toggleDone(task.id)} className="mt-0.5 shrink-0">
                {task.status === "DONE"
                  ? <CheckSquare className="w-4.5 h-4.5 text-green-500" />
                  : <Square className="w-4.5 h-4.5 text-stone hover:text-graphite" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${catCfg.style}`}>
                    <CatIcon className="w-3 h-3" /> {catCfg.label}
                  </span>
                  <span className={`text-xs font-semibold ${priorityColor}`}>●</span>
                </div>
                <p className={cn("text-sm font-medium", task.status === "DONE" ? "line-through text-stone" : "text-ink")}>
                  {task.title}
                </p>
                {task.description && <p className="text-xs text-stone mt-0.5 truncate">{task.description}</p>}
              </div>

              <div className="text-right shrink-0 space-y-1">
                <div className="flex items-center gap-1 justify-end">
                  <User className="w-3 h-3 text-stone" />
                  <span className="text-xs text-stone">{task.athleteName}</span>
                </div>
                {task.dueDate && task.status !== "DONE" && (
                  <p className={`text-xs font-medium ${isOverdue ? "text-red-500" : "text-stone"}`}>
                    {isOverdue && "⚠ "}{new Date(task.dueDate).toLocaleDateString("fr-FR")}
                  </p>
                )}
                {task.completedAt && (
                  <p className="text-xs text-green-600">✓ {new Date(task.completedAt).toLocaleDateString("fr-FR")}</p>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-stone bg-white border border-line rounded-lg">
            Aucune tâche.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-line w-full max-w-md shadow-pop">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <h2 className="text-base font-semibold text-ink">Nouvelle tâche</h2>
              <button onClick={() => setShowModal(false)} className="text-stone hover:text-graphite">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <Label className="text-xs font-medium text-stone mb-1.5 block">Titre *</Label>
                <Input placeholder="Ex: Renouveler le passeport" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} autoFocus />
              </div>
              <div>
                <Label className="text-xs font-medium text-stone mb-1.5 block">Description</Label>
                <Textarea placeholder="Détails optionnels..." value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="min-h-16 text-sm rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-stone mb-1.5 block">Athlète</Label>
                  <select value={newAthleteId} onChange={(e) => setNewAthleteId(e.target.value)} className={selectCls + " w-full"}>
                    {ATHLETES_LIST.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-stone mb-1.5 block">Catégorie</Label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as TaskCategory)} className={selectCls + " w-full"}>
                    {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-stone mb-1.5 block">Priorité</Label>
                  <select value={newPriority} onChange={(e) => setNewPriority(Number(e.target.value) as 1|2|3)} className={selectCls + " w-full"}>
                    <option value={1}>Haute</option>
                    <option value={2}>Normale</option>
                    <option value={3}>Basse</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-medium text-stone mb-1.5 block">Échéance</Label>
                  <Input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <Button onClick={handleCreate} disabled={!newTitle} className="flex-1">
                <Plus className="w-4 h-4" /> Créer la tâche
              </Button>
              <Button variant="outline" onClick={() => setShowModal(false)}>Annuler</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
