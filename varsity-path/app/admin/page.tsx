import Link from "next/link";
import {
  Users, Building2, Mail, TrendingUp, CheckCircle2,
  Clock, AlertCircle, ChevronRight, Calendar
} from "lucide-react";

const STATS = [
  { label: "Athlètes actifs", value: "3", sub: "2 en campagne", icon: Users, href: "/admin/athletes" },
  { label: "Universités", value: "919", sub: "base complète disponible", icon: Building2, href: "/admin/universities" },
  { label: "Emails envoyés", value: "73", sub: "ce mois-ci", icon: Mail, href: "/admin/campaigns" },
  { label: "Taux de réponse", value: "7%", sub: "5 réponses sur 73", icon: TrendingUp, href: "/admin/campaigns" },
];

const RECENT_ATHLETES = [
  { id: "1", name: "Lucas Martins", status: "EN CAMPAGNE", color: "bg-navy text-paper", steps: "5/10", nationality: "Français / Brésilien" },
  { id: "2", name: "Sofia Chen", status: "EN DOSSIER", color: "bg-ink text-paper", steps: "2/10", nationality: "Chinoise" },
];

const UPCOMING = [
  { date: "25 Avr", title: "Réunion famille Chen", type: "Réunion" },
  { date: "28 Avr", title: "Match Champions U19 — Martins", type: "Match" },
  { date: "30 Avr", title: "Réunion équipe NEXTMOOV", type: "Interne" },
  { date: "01 Mai", title: "Deadline NCAA Eligibility — Martins", type: "Deadline" },
];

const TASKS_URGENT = [
  { id: "2", title: "Créer profil NCAA Eligibility", athlete: "Lucas Martins", dueDate: "01 Mai", priority: "Haute" },
  { id: "5", title: "Sélectionner universités cibles", athlete: "Sofia Chen", dueDate: "30 Avr", priority: "Haute" },
];

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b border-line pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-graphite mb-1">
          Tableau de bord
        </p>
        <h1 className="font-display text-3xl tracking-widest text-navy uppercase">
          Vue d&apos;ensemble
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-px border border-line bg-line mb-8">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="bg-paper px-6 py-5 hover:bg-cream transition-colors block">
              <div className="flex items-start justify-between mb-3">
                <p className="font-mono text-xs uppercase tracking-widest text-graphite">
                  {stat.label}
                </p>
                <Icon className="h-4 w-4 text-graphite" />
              </div>
              <p className="font-mono text-3xl text-ink mb-1">{stat.value}</p>
              <p className="text-sm text-graphite">{stat.sub}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Athletes */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white border border-line rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <h2 className="text-sm font-mono uppercase tracking-widest text-graphite">
                Athlètes
              </h2>
              <Link href="/admin/athletes" className="text-xs text-navy hover:underline font-mono">
                Voir tous →
              </Link>
            </div>
            <div className="divide-y divide-line">
              {RECENT_ATHLETES.map((athlete) => (
                <Link
                  key={athlete.id}
                  href={`/admin/athletes/${athlete.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-paper transition-colors"
                >
                  <div>
                    <p className="font-medium text-ink text-sm">{athlete.name}</p>
                    <p className="text-xs font-mono text-graphite mt-0.5">{athlete.nationality}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${athlete.color}`}>
                      {athlete.status}
                    </span>
                    <p className="text-xs font-mono text-graphite mt-1">Étapes {athlete.steps}</p>
                  </div>
                </Link>
              ))}
              <Link
                href="/admin/athletes/new"
                className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-mono text-graphite hover:text-navy hover:bg-paper transition-colors"
              >
                + Ajouter un athlète
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white border border-line rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <h2 className="text-sm font-mono uppercase tracking-widest text-graphite flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Agenda
              </h2>
              <Link href="/admin/calendar" className="text-xs text-navy hover:underline font-mono">
                Voir tout →
              </Link>
            </div>
            <div className="divide-y divide-line">
              {UPCOMING.map((ev, i) => (
                <div key={i} className="flex gap-4 px-5 py-3.5">
                  <div className="text-center w-12 flex-shrink-0">
                    <p className="text-xs font-mono font-semibold text-navy">{ev.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-ink font-medium leading-tight">{ev.title}</p>
                    <p className="text-xs font-mono text-graphite">{ev.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Urgent Tasks */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white border border-line rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <h2 className="text-sm font-mono uppercase tracking-widest text-graphite flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-flag" /> Tâches urgentes
              </h2>
              <Link href="/admin/tasks" className="text-xs text-navy hover:underline font-mono">
                Voir toutes →
              </Link>
            </div>
            <div className="divide-y divide-line">
              {TASKS_URGENT.map((task) => (
                <div key={task.id} className="px-5 py-3.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-ink font-medium leading-tight">{task.title}</p>
                      <p className="text-xs font-mono text-graphite mt-0.5">{task.athlete}</p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="text-xs font-mono text-red-flag font-semibold">{task.dueDate}</p>
                      <p className="text-xs font-mono text-graphite">{task.priority}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign quick stats */}
          <div className="bg-white border border-line rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <h2 className="text-sm font-mono uppercase tracking-widest text-graphite">
                Campagnes actives
              </h2>
              <Link href="/admin/campaigns" className="text-xs text-navy hover:underline font-mono">
                Voir →
              </Link>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-mono text-graphite">Lucas Martins · Initial</span>
                <span className="font-mono text-ink font-semibold">40% ouv.</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-mono text-graphite">Lucas Martins · Follow-up</span>
                <span className="font-mono text-ink font-semibold">29% ouv.</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-mono text-graphite">Sofia Chen · Initial</span>
                <span className="text-stone font-mono text-xs">Brouillon</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DB setup banner — shown only if DB not connected */}
      <div className="mt-8 border border-gold bg-cream px-6 py-5 rounded-lg">
        <p className="font-mono text-xs uppercase tracking-widest text-gold mb-2">
          Configuration requise
        </p>
        <p className="text-sm text-graphite mb-3">
          Connectez votre base de données PostgreSQL pour afficher les vraies données.
        </p>
        <div className="font-mono text-sm text-graphite space-y-1">
          <p>1. Renseignez <span className="text-ink">DATABASE_URL</span> dans <span className="text-ink">.env</span></p>
          <p>2. Lancez <span className="text-ink">npx prisma migrate dev --name init</span></p>
          <p>3. Importez les coachs avec <span className="text-ink">npm run db:seed</span></p>
        </div>
      </div>
    </div>
  );
}
