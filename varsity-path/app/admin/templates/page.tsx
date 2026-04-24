"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Copy, Trash2, X, Save, Eye } from "lucide-react";

type TemplateCategory = "Prémisses" | "Sportif" | "Factures" | "Académique" | "Facultatif";

const CATEGORY_COLORS: Record<TemplateCategory, string> = {
  "Prémisses":   "bg-navy/10 text-navy",
  "Sportif":     "bg-green-100 text-green-800",
  "Factures":    "bg-amber-100 text-amber-800",
  "Académique":  "bg-blue-100 text-blue-800",
  "Facultatif":  "bg-stone/20 text-graphite",
};

const CATEGORIES: TemplateCategory[] = ["Prémisses", "Sportif", "Factures", "Académique", "Facultatif"];

interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  subject: string;
  bodyHtml: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
}

const MOCK_TEMPLATES: Template[] = [
  // ── Prémisses ──────────────────────────────────────────────────────────────
  {
    id: "1",
    name: "Contact initial — Soccer masculin",
    category: "Prémisses",
    subject: "Student-athlete inquiry — {{position}} from {{country}}",
    bodyHtml: `Dear Coach {{coachLastName}},

My name is {{athleteFirstName}} {{athleteLastName}}, a {{age}}-year-old {{position}} from {{country}}.

I am writing to express my strong interest in playing soccer for {{universityName}}. I have followed your program closely and believe it would be an excellent fit for both my athletic and academic goals.

Athletic profile:
- Current club: {{currentClub}}
- GPA (converted 4.0): {{gpa}}
- TOEFL: {{toefl}}
- Highlight video: {{highlightUrl}}

I would be honored to discuss the possibility of joining your program. Please do not hesitate to reach out for any additional information.

Best regards,
{{athleteFirstName}} {{athleteLastName}}
{{athleteEmail}}`,
    variables: ["coachLastName","athleteFirstName","athleteLastName","age","position","country","universityName","currentClub","gpa","toefl","highlightUrl","athleteEmail"],
    isActive: true,
    createdAt: "2026-01-10",
  },
  {
    id: "2",
    name: "Contact initial — Soccer féminin",
    category: "Prémisses",
    subject: "Female student-athlete inquiry — {{position}} from {{country}}",
    bodyHtml: `Dear Coach {{coachLastName}},

My name is {{athleteFirstName}} {{athleteLastName}}, a {{age}}-year-old {{position}} from {{country}}.

I am very interested in joining the women's soccer program at {{universityName}}. I believe my background and athletic profile would be a strong match for your team.

Athletic profile:
- Current club: {{currentClub}}
- GPA (converted 4.0): {{gpa}}
- TOEFL: {{toefl}}
- Highlight video: {{highlightUrl}}

I look forward to hearing from you.

Best regards,
{{athleteFirstName}} {{athleteLastName}}
{{athleteEmail}}`,
    variables: ["coachLastName","athleteFirstName","athleteLastName","age","position","country","universityName","currentClub","gpa","toefl","highlightUrl","athleteEmail"],
    isActive: true,
    createdAt: "2026-01-12",
  },
  {
    id: "3",
    name: "Relance — 7 jours sans réponse",
    category: "Prémisses",
    subject: "Following up — {{athleteFirstName}} {{athleteLastName}} — {{position}}",
    bodyHtml: `Dear Coach {{coachLastName}},

I wanted to follow up on my previous email regarding {{athleteFirstName}} {{athleteLastName}}.

We remain very interested in your program at {{universityName}} and would love to schedule a brief call at your convenience.

Highlight video: {{highlightUrl}}

Thank you for your time, and we hope to hear from you soon.

Best regards,
{{athleteFirstName}} {{athleteLastName}}`,
    variables: ["coachLastName","athleteFirstName","athleteLastName","position","universityName","highlightUrl"],
    isActive: true,
    createdAt: "2026-01-15",
  },
  // ── Sportif ────────────────────────────────────────────────────────────────
  {
    id: "4",
    name: "Envoi vidéo highlight complémentaire",
    category: "Sportif",
    subject: "Additional highlight reel — {{athleteFirstName}} {{athleteLastName}}",
    bodyHtml: `Dear Coach {{coachLastName}},

Following our previous exchange, I am pleased to share an updated highlight video of {{athleteFirstName}} {{athleteLastName}}.

Updated highlight ({{currentSeason}}): {{highlightUrl}}

The video includes:
- Recent matches with {{currentClub}}
- Set pieces and technical sequences
- Physical and tactical attributes

Please do not hesitate to share this with your staff.

Best regards,
{{athleteFirstName}} {{athleteLastName}}`,
    variables: ["coachLastName","athleteFirstName","athleteLastName","currentClub","currentSeason","highlightUrl"],
    isActive: true,
    createdAt: "2026-02-01",
  },
  {
    id: "5",
    name: "Invitation visite campus / official visit",
    category: "Sportif",
    subject: "Official visit — {{athleteFirstName}} {{athleteLastName}} — {{visitDate}}",
    bodyHtml: `Dear Coach {{coachLastName}},

We are thrilled to confirm the official visit of {{athleteFirstName}} {{athleteLastName}} to {{universityName}} on {{visitDate}}.

Please let us know the schedule and any documents needed in advance. {{athleteFirstName}} is very excited about this opportunity and will come fully prepared.

Best regards,
{{athleteFirstName}} {{athleteLastName}}
{{athleteEmail}}`,
    variables: ["coachLastName","athleteFirstName","athleteLastName","universityName","visitDate","athleteEmail"],
    isActive: true,
    createdAt: "2026-02-10",
  },
  // ── Factures ───────────────────────────────────────────────────────────────
  {
    id: "6",
    name: "Rappel paiement mensualité",
    category: "Factures",
    subject: "[NEXTMOOV] Rappel — mensualité {{month}} {{year}}",
    bodyHtml: `Bonjour {{parentFirstName}},

Nous vous rappelons que la mensualité de {{month}} {{year}} d'un montant de {{amount}} € est due pour le suivi de {{athleteFirstName}} {{athleteLastName}}.

Merci de procéder au règlement dans les plus brefs délais via le lien suivant :
{{paymentLink}}

Pour toute question, n'hésitez pas à nous contacter.

Cordialement,
L'équipe NEXTMOOV USA`,
    variables: ["parentFirstName","month","year","amount","athleteFirstName","athleteLastName","paymentLink"],
    isActive: true,
    createdAt: "2026-01-20",
  },
  {
    id: "7",
    name: "Confirmation réception paiement",
    category: "Factures",
    subject: "[NEXTMOOV] Paiement reçu — {{month}} {{year}}",
    bodyHtml: `Bonjour {{parentFirstName}},

Nous accusons bonne réception de votre paiement de {{amount}} € pour le mois de {{month}} {{year}}.

Merci pour votre confiance.

Cordialement,
L'équipe NEXTMOOV USA`,
    variables: ["parentFirstName","month","year","amount"],
    isActive: true,
    createdAt: "2026-01-20",
  },
  // ── Académique ─────────────────────────────────────────────────────────────
  {
    id: "8",
    name: "Résultats TOEFL / SAT — Communication coach",
    category: "Académique",
    subject: "Academic update — {{athleteFirstName}} {{athleteLastName}} — TOEFL {{toefl}}",
    bodyHtml: `Dear Coach {{coachLastName}},

I wanted to share an academic update for {{athleteFirstName}} {{athleteLastName}}.

Latest test results:
- TOEFL: {{toefl}} / 120
- SAT: {{sat}} / 1600
- GPA (converted 4.0): {{gpa}}

{{athleteFirstName}} continues to work hard academically to meet {{universityName}}'s requirements.

Please let us know if you need official transcripts or additional documentation.

Best regards,
{{athleteFirstName}} {{athleteLastName}}`,
    variables: ["coachLastName","athleteFirstName","athleteLastName","toefl","sat","gpa","universityName"],
    isActive: true,
    createdAt: "2026-02-15",
  },
  {
    id: "9",
    name: "Inscription NCAA Eligibility Center",
    category: "Académique",
    subject: "NCAA Eligibility Center — {{athleteFirstName}} {{athleteLastName}} — ID {{eligibilityId}}",
    bodyHtml: `Dear Coach {{coachLastName}},

I am pleased to confirm that {{athleteFirstName}} {{athleteLastName}} has completed registration with the NCAA Eligibility Center.

NCAA Eligibility Center ID: {{eligibilityId}}

Please feel free to look up their profile at any time. We will keep you updated as the certification process progresses.

Best regards,
{{athleteFirstName}} {{athleteLastName}}`,
    variables: ["coachLastName","athleteFirstName","athleteLastName","eligibilityId"],
    isActive: true,
    createdAt: "2026-03-01",
  },
  // ── Facultatif ─────────────────────────────────────────────────────────────
  {
    id: "10",
    name: "Remerciements après visite campus",
    category: "Facultatif",
    subject: "Thank you — {{athleteFirstName}}'s official visit to {{universityName}}",
    bodyHtml: `Dear Coach {{coachLastName}},

{{athleteFirstName}} {{athleteLastName}} wanted to personally thank you and your staff for the wonderful visit to {{universityName}} on {{visitDate}}.

The campus, the program, and the team environment left a very strong impression. {{athleteFirstName}} is more motivated than ever and remains very interested in your program.

We look forward to staying in touch.

Best regards,
{{athleteFirstName}} {{athleteLastName}}`,
    variables: ["coachLastName","athleteFirstName","athleteLastName","universityName","visitDate"],
    isActive: true,
    createdAt: "2026-03-10",
  },
];

const ALL_VARIABLES = [
  "{{coachLastName}}", "{{athleteFirstName}}", "{{athleteLastName}}",
  "{{universityName}}", "{{position}}", "{{country}}", "{{age}}",
  "{{currentClub}}", "{{gpa}}", "{{toefl}}", "{{sat}}", "{{highlightUrl}}",
  "{{athleteEmail}}", "{{currentSeason}}", "{{visitDate}}", "{{eligibilityId}}",
  "{{parentFirstName}}", "{{month}}", "{{year}}", "{{amount}}", "{{paymentLink}}",
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | "Tous">("Tous");

  const [draftName, setDraftName] = useState("");
  const [draftCategory, setDraftCategory] = useState<TemplateCategory>("Prémisses");
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");

  const selected = templates.find((t) => t.id === selectedId);
  const previewed = templates.find((t) => t.id === previewId);

  const filtered = categoryFilter === "Tous"
    ? templates
    : templates.filter((t) => t.category === categoryFilter);

  const startCreate = () => {
    setIsCreating(true);
    setSelectedId(null);
    setPreviewId(null);
    setDraftName("");
    setDraftCategory("Prémisses");
    setDraftSubject("");
    setDraftBody("");
  };

  const startEdit = (t: Template) => {
    setIsCreating(false);
    setSelectedId(t.id);
    setPreviewId(null);
    setDraftName(t.name);
    setDraftCategory(t.category);
    setDraftSubject(t.subject);
    setDraftBody(t.bodyHtml);
  };

  const extractVars = (text: string) =>
    Array.from(new Set((text.match(/\{\{(\w+)\}\}/g) ?? []).map((v) => v.slice(2, -2))));

  const handleSave = () => {
    const variables = extractVars(draftSubject + " " + draftBody);
    if (isCreating) {
      const newT: Template = {
        id: String(Date.now()),
        name: draftName,
        category: draftCategory,
        subject: draftSubject,
        bodyHtml: draftBody,
        variables,
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setTemplates((prev) => [newT, ...prev]);
      setIsCreating(false);
      setSelectedId(newT.id);
    } else if (selectedId) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === selectedId
            ? { ...t, name: draftName, category: draftCategory, subject: draftSubject, bodyHtml: draftBody, variables }
            : t
        )
      );
    }
  };

  const handleDuplicate = (t: Template) => {
    const copy: Template = {
      ...t,
      id: String(Date.now()),
      name: `${t.name} (copie)`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTemplates((prev) => [copy, ...prev]);
  };

  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const toggleActive = (id: string) =>
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, isActive: !t.isActive } : t));

  const isEditing = isCreating || selectedId !== null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-6 border-b border-line pb-6">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-stone mb-1">Emails</p>
          <h1 className="text-3xl font-display uppercase tracking-wider text-navy">Templates</h1>
          <p className="text-sm text-graphite font-mono mt-1">
            {templates.length} templates · {CATEGORIES.length} catégories
          </p>
        </div>
        <button
          onClick={startCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-paper text-sm font-mono rounded hover:bg-navy/90"
        >
          <Plus className="w-4 h-4" />
          Nouveau template
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        <button
          onClick={() => setCategoryFilter("Tous")}
          className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${categoryFilter === "Tous" ? "bg-navy text-paper" : "bg-white border border-line text-graphite hover:border-graphite"}`}
        >
          Tous ({templates.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${categoryFilter === cat ? "bg-navy text-paper" : "bg-white border border-line text-graphite hover:border-graphite"}`}
          >
            {cat} ({templates.filter((t) => t.category === cat).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Template list */}
        <div className="col-span-1 space-y-2">
          {filtered.map((t) => (
            <div
              key={t.id}
              className={`bg-white border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedId === t.id ? "border-navy" : "border-line hover:border-graphite"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <button onClick={() => startEdit(t)} className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleActive(t.id); }}
                      title={t.isActive ? "Désactiver" : "Activer"}
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${t.isActive ? "bg-green-500" : "bg-stone"}`}
                    />
                    <p className="font-medium text-ink text-sm truncate">{t.name}</p>
                  </div>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-mono mb-1.5 ${CATEGORY_COLORS[t.category]}`}>
                    {t.category}
                  </span>
                  <p className="text-xs text-graphite font-mono truncate">{t.subject}</p>
                  <p className="text-xs text-stone font-mono mt-1">
                    {t.variables.length} variable{t.variables.length !== 1 ? "s" : ""}
                    {" · "}{new Date(t.createdAt + "T12:00").toLocaleDateString("fr-FR")}
                  </p>
                </button>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => setPreviewId(previewId === t.id ? null : t.id)}
                    className="p-1 text-graphite hover:text-navy"
                    title="Aperçu"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(t)}
                    className="p-1 text-graphite hover:text-navy"
                    title="Dupliquer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1 text-graphite hover:text-red-flag"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-10 text-center text-graphite font-mono text-xs border border-dashed border-line rounded-lg">
              Aucun template dans cette catégorie
            </div>
          )}
        </div>

        {/* Editor / Preview */}
        <div className="col-span-2 space-y-4">
          {/* Preview panel */}
          {previewId && previewed && (
            <div className="bg-white border border-line rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-mono uppercase tracking-widest text-graphite">
                    Aperçu
                  </h3>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-mono ${CATEGORY_COLORS[previewed.category]}`}>
                    {previewed.category}
                  </span>
                </div>
                <button onClick={() => setPreviewId(null)}>
                  <X className="w-4 h-4 text-graphite hover:text-ink" />
                </button>
              </div>
              <div className="bg-paper border border-line rounded p-4">
                <p className="text-xs font-mono text-graphite mb-1">Sujet :</p>
                <p className="text-sm font-medium text-ink mb-4">{previewed.subject}</p>
                <p className="text-xs font-mono text-graphite mb-1">Corps :</p>
                <pre className="text-sm text-ink leading-relaxed whitespace-pre-wrap font-sans">
                  {previewed.bodyHtml}
                </pre>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {previewed.variables.map((v) => (
                  <span key={v} className="px-2 py-0.5 bg-navy/10 text-navy text-xs font-mono rounded">
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Edit panel */}
          {isEditing && (
            <div className="bg-white border border-line rounded-lg p-6">
              <h3 className="text-sm font-mono uppercase tracking-widest text-graphite mb-6">
                {isCreating ? "Nouveau template" : `Modifier — ${selected?.name}`}
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                    Nom interne
                  </Label>
                  <Input
                    placeholder="Ex: Contact initial — Soccer masculin"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                    Catégorie
                  </Label>
                  <select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value as TemplateCategory)}
                    className="w-full border border-line rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-navy"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                    Sujet
                  </Label>
                  <Input
                    placeholder="Ex: Student-athlete inquiry — {{position}} from {{country}}"
                    value={draftSubject}
                    onChange={(e) => setDraftSubject(e.target.value)}
                  />
                </div>

                <div>
                  <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                    Corps
                  </Label>
                  <Textarea
                    placeholder="Corps de l'email..."
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    className="min-h-64 font-mono text-sm"
                  />
                </div>

                <div className="bg-paper border border-line rounded p-3">
                  <p className="text-xs font-mono text-graphite mb-2">Variables (cliquez pour insérer) :</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_VARIABLES.map((v) => (
                      <button
                        key={v}
                        onClick={() => setDraftBody((b) => b + v)}
                        className="px-2 py-0.5 bg-navy/10 text-navy text-xs font-mono rounded hover:bg-navy/20 transition-colors"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={!draftName || !draftSubject || !draftBody}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-paper text-sm font-mono rounded hover:bg-navy/90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </button>
                  <button
                    onClick={() => { setSelectedId(null); setIsCreating(false); }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-line text-graphite text-sm font-mono rounded hover:border-graphite"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isEditing && !previewId && (
            <div className="flex items-center justify-center h-64 bg-white border border-line rounded-lg text-graphite font-mono text-sm">
              Sélectionnez un template pour le modifier
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
