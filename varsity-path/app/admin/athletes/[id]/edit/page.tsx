"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Save, X } from "lucide-react";

// Mock athlete data
const MOCK_ATHLETE = {
  id: "1",
  firstName: "Lucas",
  lastName: "Martins",
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
  targetMajor: "Business Administration",
  agentNotes: "Excellent profil. Physique et technique. TOEFL à repasser en juin pour viser 100+.",
  highlightUrl: "https://youtube.com/watch?v=example",
  familyBudgetUsd: 25000,
  minScholarshipPct: 50,
};

export default function EditAthletePage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState(MOCK_ATHLETE);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Cm") || name.includes("Kg") || name.includes("Score") || name.includes("Pct") || name.includes("Usd")
        ? value === ""
          ? ""
          : parseInt(value)
        : name.includes("gpaConverted")
        ? value === ""
          ? ""
          : parseFloat(value)
        : value,
    }));
    setSaveMessage("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      const res = await fetch(`/api/athletes/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setSaveMessage("Changements enregistrés avec succès");
    } catch {
      setSaveMessage("Erreur — vérifiez la connexion à la base de données.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 4000);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/admin/athletes/${params.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite hover:text-navy mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour au profil
        </Link>
        <h1 className="text-3xl font-display uppercase tracking-wider text-navy">
          Modifier {formData.firstName} {formData.lastName}
        </h1>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-6 p-4 border rounded-lg ${saveMessage.startsWith("Erreur") ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <p className={`text-sm font-mono ${saveMessage.startsWith("Erreur") ? "text-red-900" : "text-green-900"}`}>{saveMessage}</p>
        </div>
      )}

      {/* Form */}
      <div className="space-y-6">
        {/* Identité */}
        <div className="bg-white border border-line rounded-lg p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-graphite mb-6">
            Identité
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Prénom
              </Label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Nom
              </Label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Nationalité
              </Label>
              <Input
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Date de naissance
              </Label>
              <Input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Profil Sportif */}
        <div className="bg-white border border-line rounded-lg p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-graphite mb-6">
            Profil Sportif
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Club actuel
              </Label>
              <Input
                name="currentClub"
                value={formData.currentClub}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Poste principal
              </Label>
              <Input
                name="primaryPosition"
                value={formData.primaryPosition}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Pied fort
              </Label>
              <Input
                name="dominantFoot"
                value={formData.dominantFoot}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Taille (cm)
              </Label>
              <Input
                type="number"
                name="heightCm"
                value={formData.heightCm}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Poids (kg)
              </Label>
              <Input
                type="number"
                name="weightKg"
                value={formData.weightKg}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Lien highlight
              </Label>
              <Input
                name="highlightUrl"
                type="url"
                placeholder="https://..."
                value={formData.highlightUrl}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Académique */}
        <div className="bg-white border border-line rounded-lg p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-graphite mb-6">
            Académique
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                GPA (converti 4.0)
              </Label>
              <Input
                type="number"
                step="0.1"
                name="gpaConverted"
                value={formData.gpaConverted}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                SAT
              </Label>
              <Input
                type="number"
                name="satScore"
                value={formData.satScore}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                TOEFL
              </Label>
              <Input
                type="number"
                name="toeflScore"
                value={formData.toeflScore}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Filière cible
              </Label>
              <Input
                name="targetMajor"
                value={formData.targetMajor}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Stratégie */}
        <div className="bg-white border border-line rounded-lg p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-graphite mb-6">
            Stratégie
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Budget famille (USD/an)
              </Label>
              <Input
                type="number"
                name="familyBudgetUsd"
                value={formData.familyBudgetUsd}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Bourse min. (%)
              </Label>
              <Input
                type="number"
                name="minScholarshipPct"
                value={formData.minScholarshipPct}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white border border-line rounded-lg p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-graphite mb-6">
            Notes Agent
          </h2>
          <Textarea
            name="agentNotes"
            value={formData.agentNotes}
            onChange={handleInputChange}
            placeholder="Notes internes sur l'athlète..."
            className="min-h-24"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
          <Link href={`/admin/athletes/${params.id}`} className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
