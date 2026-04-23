"use client";

import { useState } from "react";
import { Database, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function SeedPage() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<{ universities: number; coaches: number } | null>(null);

  async function runSeed() {
    setRunning(true);
    setDone(false);
    setError("");
    setLogs([]);
    setResult(null);

    try {
      let url = "/api/admin/seed?secret=varsity-seed-2026&file=0";
      while (url) {
        const res = await fetch(url);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Erreur ${res.status}: ${text}`);
        }
        const data = await res.json();

        if (data.done) {
          setResult({ universities: data.universities, coaches: data.coaches });
          setDone(true);
          break;
        }

        setLogs((prev) => [
          ...prev,
          `Fichier ${data.fileIndex + 1}/${data.totalFiles} — ${data.file} (${data.unis} unis, ${data.coaches} coachs)`,
        ]);

        url = data.nextUrl;
        await new Promise((r) => setTimeout(r, 200));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-graphite mb-1">Administration</p>
        <h1 className="font-display text-3xl tracking-widest text-navy uppercase">Import base de données</h1>
      </div>

      <div className="bg-white border border-line rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
            <Database className="w-5 h-5 text-navy" />
          </div>
          <div>
            <p className="font-medium text-ink mb-1">Importer les universités et coachs</p>
            <p className="text-sm text-graphite">
              Charge 920 universités et 1 274 coachs depuis les fichiers JSON de seed.
              L&apos;opération prend environ 2–3 minutes.
            </p>
          </div>
        </div>

        <button
          onClick={runSeed}
          disabled={running || done}
          className="w-full py-3 px-4 bg-navy text-paper font-mono text-sm rounded hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {running ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Import en cours...</>
          ) : done ? (
            <><CheckCircle2 className="w-4 h-4" /> Import terminé</>
          ) : (
            "Lancer l'import"
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex gap-3">
          <AlertCircle className="w-4 h-4 text-red-flag flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-flag font-mono">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-4">
          <p className="font-mono text-sm font-semibold text-green-700 mb-2">✅ Import terminé avec succès</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded p-3 text-center">
              <p className="font-mono text-2xl text-ink">{result.universities.toLocaleString("fr-FR")}</p>
              <p className="text-xs font-mono text-graphite uppercase tracking-widest mt-1">Universités</p>
            </div>
            <div className="bg-white rounded p-3 text-center">
              <p className="font-mono text-2xl text-ink">{result.coaches.toLocaleString("fr-FR")}</p>
              <p className="text-xs font-mono text-graphite uppercase tracking-widest mt-1">Coachs</p>
            </div>
          </div>
        </div>
      )}

      {logs.length > 0 && (
        <div className="bg-paper border border-line rounded-lg p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-graphite mb-3">Progression</p>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {logs.map((log, i) => (
              <p key={i} className="font-mono text-xs text-graphite">{log}</p>
            ))}
            {running && (
              <p className="font-mono text-xs text-navy animate-pulse">Traitement en cours...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
