"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Database, Mail, Key, Shield } from "lucide-react";

type ConnectionStatus = "idle" | "testing" | "ok" | "error";

function StatusDot({ status }: { status: "connected" | "disconnected" | "pending" }) {
  if (status === "connected") return <span className="w-2 h-2 rounded-full bg-green-500" />;
  if (status === "pending") return <span className="w-2 h-2 rounded-full bg-amber-500" />;
  return <span className="w-2 h-2 rounded-full bg-stone" />;
}

export default function SettingsPage() {
  const [dbStatus, setDbStatus] = useState<ConnectionStatus>("idle");
  const [gmailStatus, setGmailStatus] = useState<ConnectionStatus>("idle");
  const [clerkStatus, setClerkStatus] = useState<ConnectionStatus>("idle");
  const [agencyName, setAgencyName] = useState("NEXTMOOV USA");
  const [primarySport, setPrimarySport] = useState("Men's Soccer");
  const [savedMessage, setSavedMessage] = useState("");

  const testDb = async () => {
    setDbStatus("testing");
    await new Promise((r) => setTimeout(r, 1500));
    setDbStatus("error");
  };

  const handleSave = () => {
    setSavedMessage("Paramètres enregistrés");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display uppercase tracking-wider text-navy mb-1">
          Paramètres
        </h1>
        <p className="text-sm text-graphite font-mono">
          Configuration de la plateforme
        </p>
      </div>

      {savedMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-700" />
          <p className="text-sm text-green-900 font-mono">{savedMessage}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Agence */}
        <div className="bg-white border border-line rounded-lg p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-graphite mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4" /> Agence
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Nom de l'agence
              </Label>
              <Input
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Sport principal
              </Label>
              <Input
                value={primarySport}
                onChange={(e) => setPrimarySport(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Base de données */}
        <div className="bg-white border border-line rounded-lg p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-graphite mb-6 flex items-center gap-2">
            <Database className="w-4 h-4" /> Base de données PostgreSQL (Neon)
          </h2>

          <div className="flex items-center gap-3 mb-4">
            <StatusDot status={dbStatus === "ok" ? "connected" : "disconnected"} />
            <span className="text-sm font-mono text-graphite">
              {dbStatus === "idle" && "Non testée"}
              {dbStatus === "testing" && "Test en cours..."}
              {dbStatus === "ok" && "Connectée"}
              {dbStatus === "error" && "DATABASE_URL manquant dans .env"}
            </span>
          </div>

          <div className="mb-4">
            <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
              DATABASE_URL
            </Label>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="postgresql://user:password@host/dbname"
                className="flex-1 font-mono"
                readOnly
              />
              <Button variant="outline" size="sm" onClick={testDb}>
                {dbStatus === "testing" ? "Test..." : "Tester"}
              </Button>
            </div>
            <p className="text-xs text-graphite font-mono mt-2">
              Modifiez <code className="bg-stone px-1 rounded">.env</code> à la racine du projet.
            </p>
          </div>

          <div className="bg-paper border border-line rounded p-4 space-y-2">
            <p className="text-xs font-mono font-semibold text-graphite uppercase tracking-widest">
              Étapes de configuration
            </p>
            <div className="space-y-1.5 text-xs font-mono text-graphite">
              <p>1. Créez une base sur <span className="text-navy">neon.tech</span> (région Frankfurt)</p>
              <p>2. Copiez l'URL de connexion dans <code className="bg-stone px-1 rounded">.env</code></p>
              <p>3. Lancez <code className="bg-stone px-1 rounded">npx prisma migrate dev --name init</code></p>
              <p>4. Importez les coachs avec <code className="bg-stone px-1 rounded">npm run db:seed</code></p>
            </div>
          </div>
        </div>

        {/* Gmail */}
        <div className="bg-white border border-line rounded-lg p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-graphite mb-6 flex items-center gap-2">
            <Mail className="w-4 h-4" /> Gmail API (Tracking emails)
          </h2>

          <div className="flex items-center gap-3 mb-4">
            <StatusDot status="disconnected" />
            <span className="text-sm font-mono text-graphite">Non configurée</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Client ID
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="font-mono"
                readOnly
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Client Secret
              </Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="font-mono"
                readOnly
              />
            </div>
          </div>

          <div className="bg-paper border border-line rounded p-4 space-y-1.5 text-xs font-mono text-graphite">
            <p className="font-semibold uppercase tracking-widest mb-2">Fonctionnalités requises</p>
            <p>✓ Envoi d'emails depuis l'agence</p>
            <p>✓ Tracking des ouvertures (Gmail API v2)</p>
            <p>✓ Détection des réponses automatiques</p>
            <p>✓ Relance automatique après 7 jours sans réponse</p>
          </div>
        </div>

        {/* Clerk */}
        <div className="bg-white border border-line rounded-lg p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-graphite mb-6 flex items-center gap-2">
            <Key className="w-4 h-4" /> Authentification (Clerk)
          </h2>

          <div className="flex items-center gap-3 mb-4">
            <StatusDot status="pending" />
            <span className="text-sm font-mono text-graphite">Désactivée en développement</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Publishable Key
              </Label>
              <Input
                type="password"
                placeholder="pk_live_••••••••"
                className="font-mono"
                readOnly
              />
            </div>
            <div>
              <Label className="text-xs font-mono uppercase tracking-widest text-graphite mb-2 block">
                Secret Key
              </Label>
              <Input
                type="password"
                placeholder="sk_live_••••••••"
                className="font-mono"
                readOnly
              />
            </div>
          </div>
          <p className="text-xs text-graphite font-mono mt-2">
            Ajoutez les clés dans <code className="bg-stone px-1 rounded">.env.local</code> — l'authentification s'activera automatiquement.
          </p>
        </div>

        <Button variant="primary" size="lg" onClick={handleSave}>
          Enregistrer les paramètres
        </Button>
      </div>
    </div>
  );
}
