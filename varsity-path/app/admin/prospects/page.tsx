"use client";

import { useState } from "react";
import { Plus, X, ChevronRight, Phone, Mail, AtSign, MoreHorizontal } from "lucide-react";

type PipelineStage =
  | "Attente premier appel"
  | "Premier appel fait"
  | "Attente second appel"
  | "Second appel fait";

const STAGES: PipelineStage[] = [
  "Attente premier appel",
  "Premier appel fait",
  "Attente second appel",
  "Second appel fait",
];

const STAGE_COLORS: Record<PipelineStage, string> = {
  "Attente premier appel": "border-t-stone",
  "Premier appel fait":    "border-t-gold",
  "Attente second appel":  "border-t-navy",
  "Second appel fait":     "border-t-green-600",
};

const STAGE_DOT: Record<PipelineStage, string> = {
  "Attente premier appel": "bg-stone",
  "Premier appel fait":    "bg-gold",
  "Attente second appel":  "bg-navy",
  "Second appel fait":     "bg-green-600",
};

type Sport = "Football" | "Basketball" | "Tennis" | "Natation" | "Athlétisme" | "Volleyball" | "Baseball" | "Autre";

const SPORT_COLORS: Record<Sport, string> = {
  Football:    "bg-green-100 text-green-800",
  Basketball:  "bg-orange-100 text-orange-800",
  Tennis:      "bg-yellow-100 text-yellow-800",
  Natation:    "bg-blue-100 text-blue-800",
  Athlétisme:  "bg-purple-100 text-purple-800",
  Volleyball:  "bg-pink-100 text-pink-800",
  Baseball:    "bg-red-100 text-red-700",
  Autre:       "bg-stone/20 text-graphite",
};

interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  stage: PipelineStage;
  sport: Sport;
  nationality: string;
  age?: number;
  phone?: string;
  email?: string;
  instagram?: string;
  notes?: string;
  contactedAt: string;
}

const MOCK_PROSPECTS: Prospect[] = [
  {
    id: "p1",
    firstName: "Théo",
    lastName: "Dupont",
    stage: "Attente premier appel",
    sport: "Football",
    nationality: "Française",
    age: 17,
    phone: "+33 6 11 22 33 44",
    email: "theo.dupont@gmail.com",
    instagram: "@theo.dupont",
    notes: "Recommandé par Paris FC. Milieu défensif, très bon niveau national.",
    contactedAt: "2026-04-10",
  },
  {
    id: "p2",
    firstName: "Camille",
    lastName: "Laurent",
    stage: "Attente premier appel",
    sport: "Tennis",
    nationality: "Française",
    age: 16,
    email: "camille.l@gmail.com",
    contactedAt: "2026-04-15",
  },
  {
    id: "p3",
    firstName: "Rayan",
    lastName: "Ouali",
    stage: "Premier appel fait",
    sport: "Football",
    nationality: "Franco-Algérienne",
    age: 18,
    phone: "+33 6 55 66 77 88",
    email: "rayan.ouali@gmail.com",
    notes: "Très motivé. Veut NCAA D1 ou D2. Bon niveau académique.",
    contactedAt: "2026-03-28",
  },
  {
    id: "p4",
    firstName: "Jade",
    lastName: "Moreau",
    stage: "Premier appel fait",
    sport: "Volleyball",
    nationality: "Française",
    age: 17,
    instagram: "@jade.moreau.vb",
    notes: "Libero, niveau national. Parents très impliqués.",
    contactedAt: "2026-04-01",
  },
  {
    id: "p5",
    firstName: "Alex",
    lastName: "Nakamura",
    stage: "Attente second appel",
    sport: "Natation",
    nationality: "Franco-Japonaise",
    age: 17,
    email: "alex.naka@gmail.com",
    phone: "+33 6 88 99 00 11",
    notes: "100m papillon en 54s. Potentiel énorme pour NCAA D1.",
    contactedAt: "2026-03-15",
  },
  {
    id: "p6",
    firstName: "Kévin",
    lastName: "Sow",
    stage: "Second appel fait",
    sport: "Football",
    nationality: "Franco-Sénégalaise",
    age: 18,
    email: "kevin.sow@gmail.com",
    instagram: "@ksow10",
    notes: "Prêt à signer. Dossier à préparer rapidement.",
    contactedAt: "2026-03-01",
  },
];

const SPORTS: Sport[] = ["Football", "Basketball", "Tennis", "Natation", "Athlétisme", "Volleyball", "Baseball", "Autre"];

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>(MOCK_PROSPECTS);
  const [showAdd, setShowAdd] = useState(false);
  const [newProspect, setNewProspect] = useState<Partial<Prospect>>({
    stage: "Attente premier appel",
    sport: "Football",
    contactedAt: new Date().toISOString().split("T")[0],
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function moveStage(id: string, direction: 1 | -1) {
    setProspects((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const idx = STAGES.indexOf(p.stage);
        const next = STAGES[idx + direction];
        return next ? { ...p, stage: next } : p;
      })
    );
  }

  function removeProspect(id: string) {
    setProspects((prev) => prev.filter((p) => p.id !== id));
  }

  function convertToAthlete(id: string) {
    removeProspect(id);
  }

  return (
    <div className="px-8 py-8 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between border-b border-line pb-6 flex-shrink-0">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-stone mb-1">Pipeline</p>
          <h1 className="font-display text-3xl tracking-widest text-navy uppercase">Prospects</h1>
          <p className="text-sm font-mono text-graphite mt-1">
            {prospects.length} prospect{prospects.length !== 1 ? "s" : ""} en cours de qualification
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-paper text-sm font-mono rounded hover:bg-navy/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau prospect
        </button>
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto flex-1 pb-4">
        {STAGES.map((stage) => {
          const stagePros = prospects.filter((p) => p.stage === stage);
          return (
            <div key={stage} className="flex-shrink-0 w-72 flex flex-col">
              {/* Column header */}
              <div className={`bg-white border border-line border-t-4 ${STAGE_COLORS[stage]} rounded-t-lg px-4 py-3 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${STAGE_DOT[stage]}`} />
                  <span className="text-xs font-mono font-semibold text-ink uppercase tracking-wider">{stage}</span>
                </div>
                <span className="text-xs font-mono bg-paper text-graphite px-1.5 py-0.5 rounded">
                  {stagePros.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-2 pt-2">
                {stagePros.map((p) => {
                  const isExpanded = expandedId === p.id;
                  const stageIdx = STAGES.indexOf(p.stage);
                  return (
                    <div
                      key={p.id}
                      className="bg-white border border-line rounded-lg overflow-hidden hover:border-graphite transition-colors"
                    >
                      <div className="px-4 pt-3 pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-ink truncate">
                              {p.firstName} {p.lastName}
                            </p>
                            <p className="text-xs font-mono text-graphite">{p.nationality}{p.age ? ` · ${p.age} ans` : ""}</p>
                          </div>
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : p.id)}
                            className="text-graphite hover:text-ink flex-shrink-0 mt-0.5"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 mt-2">
                          <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${SPORT_COLORS[p.sport]}`}>
                            {p.sport}
                          </span>
                          <span className="text-xs font-mono text-stone">
                            {new Date(p.contactedAt + "T12:00").toLocaleDateString("fr-FR")}
                          </span>
                        </div>

                        {p.notes && !isExpanded && (
                          <p className="text-xs text-graphite mt-2 line-clamp-2 leading-relaxed">{p.notes}</p>
                        )}
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="px-4 pb-3 border-t border-line bg-paper/50">
                          {p.notes && (
                            <p className="text-xs text-graphite mt-2 leading-relaxed">{p.notes}</p>
                          )}
                          <div className="mt-2 space-y-1">
                            {p.phone && (
                              <a href={`tel:${p.phone}`} className="flex items-center gap-1.5 text-xs font-mono text-graphite hover:text-navy">
                                <Phone className="w-3 h-3" />
                                {p.phone}
                              </a>
                            )}
                            {p.email && (
                              <a href={`mailto:${p.email}`} className="flex items-center gap-1.5 text-xs font-mono text-graphite hover:text-navy">
                                <Mail className="w-3 h-3" />
                                {p.email}
                              </a>
                            )}
                            {p.instagram && (
                              <span className="flex items-center gap-1.5 text-xs font-mono text-graphite">
                                <AtSign className="w-3 h-3" />
                                {p.instagram}
                              </span>
                            )}
                          </div>
                          <div className="mt-3 flex gap-1.5 flex-wrap">
                            {stageIdx < STAGES.length - 1 && (
                              <button
                                onClick={() => moveStage(p.id, 1)}
                                className="flex items-center gap-1 px-2 py-1 bg-navy text-paper text-xs font-mono rounded hover:bg-navy/90"
                              >
                                Avancer <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                            {stageIdx === STAGES.length - 1 && (
                              <button
                                onClick={() => convertToAthlete(p.id)}
                                className="px-2 py-1 bg-green-700 text-white text-xs font-mono rounded hover:bg-green-800"
                              >
                                → Convertir en athlète
                              </button>
                            )}
                            {stageIdx > 0 && (
                              <button
                                onClick={() => moveStage(p.id, -1)}
                                className="px-2 py-1 bg-paper border border-line text-graphite text-xs font-mono rounded hover:border-graphite"
                              >
                                Reculer
                              </button>
                            )}
                            <button
                              onClick={() => removeProspect(p.id)}
                              className="px-2 py-1 bg-paper border border-line text-red-flag text-xs font-mono rounded hover:bg-red-flag/5"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {stagePros.length === 0 && (
                  <div className="border-2 border-dashed border-line rounded-lg py-8 text-center">
                    <p className="text-xs font-mono text-stone">Aucun prospect</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add prospect modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-line rounded-lg w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-graphite">Nouveau prospect</h2>
              <button onClick={() => { setShowAdd(false); setNewProspect({ stage: "Attente premier appel", sport: "Football", contactedAt: new Date().toISOString().split("T")[0] }); }}>
                <X className="w-4 h-4 text-graphite" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Prénom *"
                  value={newProspect.firstName ?? ""}
                  onChange={(e) => setNewProspect((p) => ({ ...p, firstName: e.target.value }))}
                  className="border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy"
                />
                <input
                  placeholder="Nom *"
                  value={newProspect.lastName ?? ""}
                  onChange={(e) => setNewProspect((p) => ({ ...p, lastName: e.target.value }))}
                  className="border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newProspect.sport}
                  onChange={(e) => setNewProspect((p) => ({ ...p, sport: e.target.value as Sport }))}
                  className="border border-line rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-navy"
                >
                  {SPORTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <select
                  value={newProspect.stage}
                  onChange={(e) => setNewProspect((p) => ({ ...p, stage: e.target.value as PipelineStage }))}
                  className="border border-line rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-navy"
                >
                  {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <input
                placeholder="Nationalité"
                value={newProspect.nationality ?? ""}
                onChange={(e) => setNewProspect((p) => ({ ...p, nationality: e.target.value }))}
                className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy"
              />
              <input
                type="number"
                placeholder="Âge"
                value={newProspect.age ?? ""}
                onChange={(e) => setNewProspect((p) => ({ ...p, age: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy"
              />
              <input
                placeholder="Téléphone"
                value={newProspect.phone ?? ""}
                onChange={(e) => setNewProspect((p) => ({ ...p, phone: e.target.value }))}
                className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy"
              />
              <input
                placeholder="Email"
                value={newProspect.email ?? ""}
                onChange={(e) => setNewProspect((p) => ({ ...p, email: e.target.value }))}
                className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy"
              />
              <input
                placeholder="Instagram (@handle)"
                value={newProspect.instagram ?? ""}
                onChange={(e) => setNewProspect((p) => ({ ...p, instagram: e.target.value }))}
                className="w-full border border-line rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-navy"
              />
              <textarea
                placeholder="Notes"
                value={newProspect.notes ?? ""}
                onChange={(e) => setNewProspect((p) => ({ ...p, notes: e.target.value }))}
                rows={2}
                className="w-full border border-line rounded px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>
            <button
              onClick={() => {
                if (!newProspect.firstName || !newProspect.lastName) return;
                setProspects((prev) => [
                  ...prev,
                  {
                    id: String(Date.now()),
                    firstName: newProspect.firstName!,
                    lastName: newProspect.lastName!,
                    stage: newProspect.stage ?? "Attente premier appel",
                    sport: newProspect.sport ?? "Football",
                    nationality: newProspect.nationality ?? "",
                    age: newProspect.age,
                    phone: newProspect.phone,
                    email: newProspect.email,
                    instagram: newProspect.instagram,
                    notes: newProspect.notes,
                    contactedAt: newProspect.contactedAt ?? new Date().toISOString().split("T")[0],
                  },
                ]);
                setNewProspect({ stage: "Attente premier appel", sport: "Football", contactedAt: new Date().toISOString().split("T")[0] });
                setShowAdd(false);
              }}
              className="w-full mt-4 py-2 bg-navy text-paper text-sm rounded hover:bg-navy/90"
            >
              Ajouter au pipeline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
