"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus, Edit3, Copy, Trash2, ChevronRight, X, Save, Eye
} from "lucide-react";

interface Template {
  id: string;
  name: string;
  subject: string;
  bodyHtml: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
}

const MOCK_TEMPLATES: Template[] = [
  {
    id: "1",
    name: "Contact initial — Soccer masculin",
    subject: "Student-athlete inquiry — {{position}} from {{country}}",
    bodyHtml: `Dear Coach {{coachLastName}},

My name is {{athleteFirstName}} {{athleteLastName}}, a {{age}}-year-old {{position}} from {{country}}.

I am writing to express my strong interest in playing soccer for {{universityName}}. I have followed your program closely and believe it would be an excellent fit for both my athletic and academic goals.

Sporting profile:
- Current club: {{currentClub}}
- GPA (converted): {{gpa}}/4.0
- TOEFL: {{toefl}}
- Highlight video: {{highlightUrl}}

I would be honored to discuss the possibility of joining your program. Please do not hesitate to contact me for any additional information.

Best regards,
{{athleteFirstName}} {{athleteLastName}}
{{athleteEmail}}`,
    variables: ["coachLastName", "athleteFirstName", "athleteLastName", "age", "position", "country", "universityName", "currentClub", "gpa", "toefl", "highlightUrl", "athleteEmail"],
    isActive: true,
    createdAt: "2026-01-10",
  },
  {
    id: "2",
    name: "Relance — 7 jours sans réponse",
    subject: "Following up — {{athleteFirstName}} {{athleteLastName}} — {{position}}",
    bodyHtml: `Dear Coach {{coachLastName}},

I wanted to follow up on my previous email regarding {{athleteFirstName}} {{athleteLastName}}.

I remain very interested in your program at {{universityName}} and would love to schedule a brief call to discuss opportunities.

Highlight: {{highlightUrl}}

Thank you for your time.

Best regards,
{{athleteFirstName}} {{athleteLastName}}`,
    variables: ["coachLastName", "athleteFirstName", "athleteLastName", "position", "universityName", "highlightUrl"],
    isActive: true,
    createdAt: "2026-01-15",
  },
  {
    id: "3",
    name: "Contact initial — Soccer féminin",
    subject: "Female student-athlete inquiry — {{position}} from {{country}}",
    bodyHtml: `Dear Coach {{coachLastName}},

My name is {{athleteFirstName}} {{athleteLastName}}, a {{age}}-year-old {{position}} from {{country}}.

I am very interested in joining the women's soccer program at {{universityName}}...`,
    variables: ["coachLastName", "athleteFirstName", "athleteLastName", "age", "position", "country", "universityName"],
    isActive: false,
    createdAt: "2026-02-01",
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(MOCK_TEMPLATES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const [draftName, setDraftName] = useState("");
  const [draftSubject, setDraftSubject] = useState("");
  const [draftBody, setDraftBody] = useState("");

  const selected = templates.find((t) => t.id === selectedId);
  const previewed = templates.find((t) => t.id === previewId);

  const startCreate = () => {
    setIsCreating(true);
    setSelectedId(null);
    setDraftName("");
    setDraftSubject("");
    setDraftBody("");
  };

  const startEdit = (t: Template) => {
    setIsCreating(false);
    setSelectedId(t.id);
    setDraftName(t.name);
    setDraftSubject(t.subject);
    setDraftBody(t.bodyHtml);
  };

  const handleSave = () => {
    if (isCreating) {
      const newT: Template = {
        id: String(Date.now()),
        name: draftName,
        subject: draftSubject,
        bodyHtml: draftBody,
        variables: [],
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
            ? { ...t, name: draftName, subject: draftSubject, bodyHtml: draftBody }
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

  const isEditing = isCreating || selectedId !== null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display uppercase tracking-wider text-navy mb-1">
            Templates emails
          </h1>
          <p className="text-sm text-graphite font-mono">
            {templates.length} templates · utilisés dans les campagnes
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={startCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau template
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Template list */}
        <div className="col-span-1 space-y-2">
          {templates.map((t) => (
            <div
              key={t.id}
              className={`bg-white border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedId === t.id ? "border-navy" : "border-line hover:border-graphite"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <button
                  onClick={() => startEdit(t)}
                  className="flex-1 text-left min-w-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${t.isActive ? "bg-green-500" : "bg-stone"}`} />
                    <p className="font-medium text-ink text-sm truncate">{t.name}</p>
                  </div>
                  <p className="text-xs text-graphite font-mono truncate">{t.subject}</p>
                  <p className="text-xs text-stone font-mono mt-1">
                    {t.variables.length} variable{t.variables.length !== 1 ? "s" : ""}
                    · {new Date(t.createdAt + "T12:00").toLocaleDateString("fr-FR")}
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
        </div>

        {/* Editor / Preview */}
        <div className="col-span-2">
          {/* Preview panel */}
          {previewId && previewed && (
            <div className="bg-white border border-line rounded-lg p-6 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-mono uppercase tracking-widest text-graphite">
                  Aperçu — {previewed.name}
                </h3>
                <button onClick={() => setPreviewId(null)}>
                  <X className="w-4 h-4 text-graphite hover:text-ink" />
                </button>
              </div>
              <div className="bg-paper border border-line rounded p-4">
                <p className="text-xs font-mono text-graphite mb-1">Sujet:</p>
                <p className="text-sm font-medium text-ink mb-4">{previewed.subject}</p>
                <p className="text-xs font-mono text-graphite mb-1">Corps:</p>
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
                  <p className="text-xs font-mono text-graphite mb-2">Variables disponibles:</p>
                  <div className="flex flex-wrap gap-1.5 text-xs font-mono text-navy">
                    {["{{coachLastName}}", "{{athleteFirstName}}", "{{athleteLastName}}", "{{universityName}}", "{{position}}", "{{country}}", "{{age}}", "{{currentClub}}", "{{gpa}}", "{{toefl}}", "{{highlightUrl}}", "{{athleteEmail}}"].map((v) => (
                      <button
                        key={v}
                        onClick={() => setDraftBody((b) => b + v)}
                        className="px-2 py-0.5 bg-navy/10 rounded hover:bg-navy/20 transition-colors"
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={!draftName || !draftSubject || !draftBody}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                  <Button variant="outline" onClick={() => { setSelectedId(null); setIsCreating(false); }}>
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
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
