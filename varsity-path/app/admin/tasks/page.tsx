"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CheckSquare, Square, Circle, ChevronDown, Plus,
  User, BookOpen, Trophy, DollarSign, MessageSquare, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "BLOCKED" | "CANCELLED";
type TaskCategory = "ACADEMIC" | "ADMINISTRATIVE" | "SPORTS" | "STRATEGY" | "COMMUNICATION" | "FINANCIAL";

interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  priority: 1 | 2 | 3;
  athleteName: string;
  athleteId: string;
  dueDate?: string;
  completedAt?: string;
}

const CATEGORY_CONFIG: Record<TaskCategory, { label: string; color: string; icon: React.ComponentType<{ className: string }> }> = {
  ACADEMIC: { label: "Académique", color: "text-blue-700 bg-blue-50", icon: BookOpen },
  ADMINISTRATIVE: { label: "Administratif", color: "text-purple-700 bg-purple-50", icon: FileText },
  SPORTS: { label: "Sportif", color: "text-green-700 bg-green-50", icon: Trophy },
  STRATEGY: { label: "Stratégie", color: "text-navy bg-blue-50", icon: ChevronDown },
  COMMUNICATION: { label: "Communication", color: "text-amber-700 bg-amber-50", icon: MessageSquare },
  FINANCIAL: { label: "Financier", color: "text-red-flag bg-red-50", icon: DollarSign },
};

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  TODO: { label: "À faire", color: "bg-stone text-ink" },
  IN_PROGRESS: { label: "En cours", color: "bg-amber-100 text-amber-900" },
  DONE: { label: "Terminée", color: "bg-green-100 text-green-900" },
  BLOCKED: { label: "Bloquée", color: "bg-red-100 text-red-900" },
  CANCELLED: { label: "Annulée", color: "bg-stone text-graphite" },
};

const PRIORITY_CONFIG: Record<number, { label: string; color: string }> = {
  1: { label: "Haute", color: "text-red-flag" },
  2: { label: "Normale", color: "text-graphite" },
  3: { label: "Basse", color: "text-stone" },
};

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Repasser le TOEFL",
    description: "Viser 100+ pour améliorer l'admissibilité aux D1",
    category: "ACADEMIC",
    status: "TODO",
    priority: 1,
    athleteName: "Lucas Martins",
    athleteId: "1",
    dueDate: "2026-06-15",
  },
  {
    id: "2",
    title: "Créer le profil NCAA Eligibility Center",
    description: "Compléter l'inscription sur eligibilitycenter.org et soumettre les relevés de notes",
    category: "ADMINISTRATIVE",
    status: "IN_PROGRESS",
    priority: 1,
    athleteName: "Lucas Martins",
    athleteId: "1",
    dueDate: "2026-05-01",
  },
  {
    id: "3",
    title: "Mettre à jour la vidéo highlight",
    description: "Inclure les 5 meilleurs buts et actions de la saison 2026",
    category: "SPORTS",
    status: "TODO",
    priority: 2,
    athleteName: "Lucas Martins",
    athleteId: "1",
    dueDate: "2026-05-10",
  },
  {
    id: "4",
    title: "Préparer le dossier identité",
    description: "Passeport, acte de naissance, photos d'identité",
    category: "ADMINISTRATIVE",
    status: "DONE",
    priority: 2,
    athleteName: "Sofia Chen",
    athleteId: "2",
    completedAt: "2026-03-10",
  },
  {
    id: "5",
    title: "Sélectionner les universités cibles",
    description: "Finaliser liste de 30-40 programmes D1/D2 en coordination avec la famille",
    category: "STRATEGY",
    status: "IN_PROGRESS",
    priority: 1,
    athleteName: "Sofia Chen",
    athleteId: "2",
    dueDate: "2026-04-30",
  },
  {
    id: "6",
    title: "Passer le SAT",
    description: "Inscription pour session de juin 2026",
    category: "ACADEMIC",
    status: "TODO",
    priority: 2,
    athleteName: "Sofia Chen",
    athleteId: "2",
    dueDate: "2026-06-01",
  },
];

function StatusIcon({ status }: { status: TaskStatus }) {
  if (status === "DONE") return <CheckSquare className="w-5 h-5 text-green-600" />;
  if (status === "CANCELLED") return <Square className="w-5 h-5 text-stone" />;
  return <Square className="w-5 h-5 text-graphite" />;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "">("");
  const [filterCategory, setFilterCategory] = useState<TaskCategory | "">("");
  const [filterAthlete, setFilterAthlete] = useState("");

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchStatus = !filterStatus || t.status === filterStatus;
      const matchCategory = !filterCategory || t.category === filterCategory;
      const matchAthlete = !filterAthlete || t.athleteName === filterAthlete;
      return matchStatus && matchCategory && matchAthlete;
    });
  }, [tasks, filterStatus, filterCategory, filterAthlete]);

  const athletes = useMemo(
    () => [...new Set(tasks.map((t) => t.athleteName))],
    [tasks]
  );

  const todoCount = tasks.filter((t) => t.status === "TODO").length;
  const inProgressCount = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const doneCount = tasks.filter((t) => t.status === "DONE").length;
  const blockedCount = tasks.filter((t) => t.status === "BLOCKED").length;

  const toggleDone = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === "DONE" ? "TODO" : "DONE", completedAt: t.status !== "DONE" ? new Date().toISOString() : undefined }
          : t
      )
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-wider text-navy mb-1">
            Tâches
          </h1>
          <p className="text-sm text-graphite font-mono">
            {filtered.length} tâches · suivi des actions en cours
          </p>
        </div>
        <Button variant="primary" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle tâche
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <button onClick={() => setFilterStatus("TODO")} className={`bg-white border rounded-lg p-4 text-left transition-colors ${filterStatus === "TODO" ? "border-navy" : "border-line"}`}>
          <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-2">À faire</p>
          <p className="text-2xl font-display text-navy">{todoCount}</p>
        </button>
        <button onClick={() => setFilterStatus("IN_PROGRESS")} className={`bg-white border rounded-lg p-4 text-left transition-colors ${filterStatus === "IN_PROGRESS" ? "border-navy" : "border-line"}`}>
          <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-2">En cours</p>
          <p className="text-2xl font-display text-amber-600">{inProgressCount}</p>
        </button>
        <button onClick={() => setFilterStatus("DONE")} className={`bg-white border rounded-lg p-4 text-left transition-colors ${filterStatus === "DONE" ? "border-navy" : "border-line"}`}>
          <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-2">Terminées</p>
          <p className="text-2xl font-display text-green-700">{doneCount}</p>
        </button>
        <button onClick={() => setFilterStatus("BLOCKED")} className={`bg-white border rounded-lg p-4 text-left transition-colors ${filterStatus === "BLOCKED" ? "border-navy" : "border-line"}`}>
          <p className="text-xs font-mono text-graphite uppercase tracking-widest mb-2">Bloquées</p>
          <p className="text-2xl font-display text-red-flag">{blockedCount}</p>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={filterAthlete}
          onChange={(e) => setFilterAthlete(e.target.value)}
          className="border border-line rounded px-3 py-2 text-sm font-mono bg-white text-ink focus:outline-none focus:border-navy"
        >
          <option value="">Tous les athlètes</option>
          {athletes.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as TaskCategory | "")}
          className="border border-line rounded px-3 py-2 text-sm font-mono bg-white text-ink focus:outline-none focus:border-navy"
        >
          <option value="">Toutes les catégories</option>
          {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
        {(filterStatus || filterCategory || filterAthlete) && (
          <button
            onClick={() => { setFilterStatus(""); setFilterCategory(""); setFilterAthlete(""); }}
            className="px-4 py-2 text-sm font-mono text-graphite hover:text-ink border border-line rounded"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filtered.map((task) => {
          const catCfg = CATEGORY_CONFIG[task.category];
          const statusCfg = STATUS_CONFIG[task.status];
          const priCfg = PRIORITY_CONFIG[task.priority];
          const CatIcon = catCfg.icon;
          const isOverdue = task.dueDate && task.status !== "DONE" && new Date(task.dueDate) < new Date();

          return (
            <div
              key={task.id}
              className={`flex items-start gap-4 p-4 bg-white border rounded-lg transition-colors hover:bg-paper ${
                task.status === "DONE" ? "opacity-60" : "border-line"
              } ${isOverdue ? "border-red-300" : ""}`}
            >
              <button
                onClick={() => toggleDone(task.id)}
                className="mt-0.5 flex-shrink-0"
              >
                <StatusIcon status={task.status} />
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold ${catCfg.color}`}
                  >
                    <CatIcon className="w-3 h-3" />
                    {catCfg.label}
                  </span>
                  <span className={`text-xs font-mono font-semibold ${priCfg.color}`}>
                    ● {priCfg.label}
                  </span>
                </div>
                <p className={`font-medium text-sm ${task.status === "DONE" ? "line-through text-graphite" : "text-ink"}`}>
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-graphite mt-0.5">{task.description}</p>
                )}
              </div>

              <div className="text-right flex-shrink-0 space-y-1">
                <div className="flex items-center gap-1.5 justify-end">
                  <User className="w-3 h-3 text-graphite" />
                  <span className="text-xs font-mono text-graphite">{task.athleteName}</span>
                </div>
                {task.dueDate && task.status !== "DONE" && (
                  <p className={`text-xs font-mono ${isOverdue ? "text-red-flag font-semibold" : "text-graphite"}`}>
                    {isOverdue ? "⚠ " : ""}
                    {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                  </p>
                )}
                {task.completedAt && (
                  <p className="text-xs font-mono text-green-700">
                    ✓ {new Date(task.completedAt).toLocaleDateString("fr-FR")}
                  </p>
                )}
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-graphite font-mono text-sm border border-line rounded-lg bg-white">
            Aucune tâche ne correspond à ces critères.
          </div>
        )}
      </div>
    </div>
  );
}
