"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Mail, Search, Loader2
} from "lucide-react";

type AthleteOption = { id: string; firstName: string; lastName: string };
type UniversityOption = {
  id: string;
  name: string;
  city: string;
  state: string;
  division: string;
  coaches: { id: string; firstName: string; lastName: string; email: string }[];
};

const MOCK_ATHLETES: AthleteOption[] = [
  { id: "1", firstName: "Lucas", lastName: "Martins" },
  { id: "2", firstName: "Sofia", lastName: "Chen" },
  { id: "3", firstName: "Emma", lastName: "Bergström" },
];

const MOCK_UNIVERSITIES: UniversityOption[] = [
  {
    id: "1",
    name: "University of Virginia",
    city: "Charlottesville",
    state: "VA",
    division: "NCAA_D1",
    coaches: [
      { id: "c1", firstName: "Marcus", lastName: "Johnson", email: "mjohnson@virginia.edu" },
      { id: "c2", firstName: "David", lastName: "Miller", email: "dmiller@virginia.edu" },
    ],
  },
  {
    id: "2",
    name: "Duke University",
    city: "Durham",
    state: "NC",
    division: "NCAA_D1",
    coaches: [
      { id: "c3", firstName: "Rachel", lastName: "Williams", email: "rwilliams@duke.edu" },
    ],
  },
  {
    id: "3",
    name: "Grand Valley State University",
    city: "Allendale",
    state: "MI",
    division: "NCAA_D2",
    coaches: [
      { id: "c4", firstName: "James", lastName: "Brown", email: "jbrown@gvsu.edu" },
    ],
  },
  {
    id: "4",
    name: "Messiah University",
    city: "Mechanicsburg",
    state: "PA",
    division: "NCAA_D3",
    coaches: [
      { id: "c5", firstName: "Lisa", lastName: "Taylor", email: "ltaylor@messiah.edu" },
      { id: "c6", firstName: "Kevin", lastName: "Anderson", email: "kanderson@messiah.edu" },
    ],
  },
];

export default function NewCampaignPage() {
  const [athleteId, setAthleteId] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCoaches, setSelectedCoaches] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const athlete = useMemo(
    () => MOCK_ATHLETES.find((a) => a.id === athleteId),
    [athleteId]
  );

  const filteredUniversities = useMemo(() => {
    return MOCK_UNIVERSITIES.filter((u) => {
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.city.toLowerCase().includes(search.toLowerCase());
      const matchDiv = !selectedDivision || u.division === selectedDivision;
      const matchState = !selectedState || u.state === selectedState;
      return matchSearch && matchDiv && matchState;
    });
  }, [search, selectedDivision, selectedState]);

  const totalCoaches = useMemo(() => {
    return filteredUniversities.reduce((sum, u) => sum + u.coaches.length, 0);
  }, [filteredUniversities]);

  const handleToggleCoach = (coachId: string) => {
    setSelectedCoaches((prev) =>
      prev.includes(coachId) ? prev.filter((id) => id !== coachId) : [...prev, coachId]
    );
  };

  const handleSelectAllCoaches = () => {
    const allCoachIds = filteredUniversities.flatMap((u) =>
      u.coaches.map((c) => c.id)
    );
    if (selectedCoaches.length === allCoachIds.length) {
      setSelectedCoaches([]);
    } else {
      setSelectedCoaches(allCoachIds);
    }
  };

  const isFormValid = athleteId && subject && bodyHtml && selectedCoaches.length > 0;

  const handleSend = async () => {
    if (!isFormValid) return;
    setIsSending(true);
    setError("");
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ athleteId, subject, bodyHtml, coachIds: selectedCoaches }),
      });
      if (!res.ok) throw new Error(await res.text());
      const campaign = await res.json();
      // Then send immediately
      await fetch(`/api/campaigns/${campaign.id}/send`, { method: "POST" });
      router.push(`/admin/campaigns/${campaign.id}`);
    } catch (e) {
      setError("Erreur lors de l'envoi. Vérifiez la connexion à la base de données.");
      setIsSending(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/campaigns"
          className="inline-flex items-center gap-1.5 text-sm font-mono text-graphite hover:text-navy mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour aux campagnes
        </Link>
        <h1 className="text-3xl font-display uppercase tracking-wider text-navy">
          Nouvelle campagne
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Composition */}
        <div className="col-span-2 space-y-6">
          {/* Athlete selection */}
          <div className="bg-white border border-line rounded-lg p-5">
            <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-3 block">
              Athlète
            </Label>
            <select
              value={athleteId}
              onChange={(e) => setAthleteId(e.target.value)}
              className="w-full border border-line rounded px-3 py-2 text-sm font-mono bg-white text-ink focus:outline-none focus:border-navy"
            >
              <option value="">Sélectionnez un athlète</option>
              {MOCK_ATHLETES.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.firstName} {a.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Email composition */}
          <div className="bg-white border border-line rounded-lg p-5">
            <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-3 block">
              Sujet
            </Label>
            <Input
              placeholder="Ex: Student-athlete inquiry — midfielder from France"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mb-6"
            />

            <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-3 block">
              Corps de l'email
            </Label>
            <Textarea
              placeholder="Composez votre message. Vous pouvez utiliser {{athleteName}}, {{coachName}}, {{universityName}} comme variables..."
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              className="h-64 font-mono text-sm"
            />
            <p className="text-xs text-graphite font-mono mt-2">
              Variables disponibles: {`{{athleteName}}`}, {`{{coachName}}`}, {`{{universityName}}`}
            </p>
          </div>

          {/* Preview toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm font-mono text-navy hover:underline"
          >
            {showPreview ? "Masquer l'aperçu" : "Afficher l'aperçu"}
          </button>

          {showPreview && athlete && (
            <div className="bg-paper border border-line rounded-lg p-5">
              <h3 className="text-xs font-mono uppercase tracking-widest text-graphite mb-3">
                Aperçu du message
              </h3>
              <div className="bg-white border border-line rounded p-4">
                <div className="mb-3">
                  <p className="text-xs text-graphite font-mono">À: coach@email.com</p>
                  <p className="text-xs text-graphite font-mono">Sujet: {subject || "(vide)"}</p>
                </div>
                <div className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
                  {bodyHtml || "(vide)"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Coach selection */}
        <div className="col-span-1 space-y-4">
          {/* Filters */}
          <div className="bg-white border border-line rounded-lg p-5 space-y-4">
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Division
              </Label>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full border border-line rounded px-2 py-1.5 text-xs font-mono bg-white text-ink focus:outline-none focus:border-navy"
              >
                <option value="">Toutes</option>
                <option value="NCAA_D1">NCAA D1</option>
                <option value="NCAA_D2">NCAA D2</option>
                <option value="NCAA_D3">NCAA D3</option>
                <option value="NAIA">NAIA</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                État
              </Label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full border border-line rounded px-2 py-1.5 text-xs font-mono bg-white text-ink focus:outline-none focus:border-navy"
              >
                <option value="">Tous</option>
                <option value="VA">VA</option>
                <option value="NC">NC</option>
                <option value="PA">PA</option>
                <option value="MI">MI</option>
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-graphite" />
              <Input
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-7 text-xs"
              />
            </div>
          </div>

          {/* Coach list */}
          <div className="bg-white border border-line rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-graphite">
                Coachs ({selectedCoaches.length}/{totalCoaches})
              </span>
              <button
                onClick={handleSelectAllCoaches}
                className="text-xs text-navy hover:underline font-mono"
              >
                {selectedCoaches.length === totalCoaches && totalCoaches > 0
                  ? "Désélectionner"
                  : "Tous"}
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredUniversities.length === 0 ? (
                <p className="text-xs text-graphite font-mono">Aucune université</p>
              ) : (
                filteredUniversities.map((uni) => (
                  <div key={uni.id}>
                    <p className="text-xs font-semibold text-ink mb-1.5">{uni.name}</p>
                    <div className="space-y-1 ml-2 pb-2 border-b border-line last:border-0">
                      {uni.coaches.map((coach) => (
                        <label
                          key={coach.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-paper p-1.5 rounded text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCoaches.includes(coach.id)}
                            onChange={() => handleToggleCoach(coach.id)}
                            className="w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className="text-graphite font-mono truncate">
                            {coach.firstName} {coach.lastName}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Send button */}
          <Button
            variant={isFormValid ? "primary" : "outline"}
            size="lg"
            disabled={!isFormValid || isSending}
            onClick={handleSend}
            className="w-full"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Mail className="w-4 h-4 mr-2" />
            )}
            {isSending ? "Envoi en cours..." : "Envoyer la campagne"}
          </Button>

          {error && (
            <p className="text-xs text-red-flag font-mono text-center">{error}</p>
          )}

          {!isFormValid && !error && (
            <p className="text-xs text-graphite font-mono text-center">
              {!athleteId && "Sélectionnez un athlète"}
              {athleteId && !subject && "Ajoutez un sujet"}
              {athleteId && subject && !bodyHtml && "Composez le message"}
              {athleteId && subject && bodyHtml && !selectedCoaches.length && "Sélectionnez des coachs"}
            </p>
          )}
        </div>
      </div>

      {/* Info box */}
      <p className="mt-8 text-xs text-graphite font-mono text-center">
        ℹ️ Cette campagne créera un enregistrement et enverra les emails aux coachs sélectionnés. Les ouvertures et réponses seront trackées automatiquement.
      </p>
    </div>
  );
}
