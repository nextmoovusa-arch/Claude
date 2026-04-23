import Link from "next/link";
import {
  Users, Building2, Mail, TrendingUp,
  AlertCircle, Calendar, Activity,
  CheckCircle2, MessageSquare, Send, Star
} from "lucide-react";

const STATS = [
  { label: "Athlètes actifs",  value: "3",   sub: "2 en campagne",         icon: Users,       href: "/admin/athletes" },
  { label: "Universités",      value: "919", sub: "base complète",          icon: Building2,   href: "/admin/universities" },
  { label: "Emails envoyés",   value: "73",  sub: "ce mois-ci",             icon: Mail,        href: "/admin/campaigns" },
  { label: "Taux de réponse",  value: "7%",  sub: "5 réponses sur 73",      icon: TrendingUp,  href: "/admin/campaigns" },
];

const PIPELINE = [
  { label: "Prospect",        count: 1, color: "bg-stone",     width: "20%" },
  { label: "Signé",           count: 3, color: "bg-gold",      width: "40%" },
  { label: "En dossier",      count: 1, color: "bg-graphite",  width: "55%" },
  { label: "En campagne",     count: 2, color: "bg-navy",      width: "70%" },
  { label: "Offres reçues",   count: 1, color: "bg-red-flag",  width: "85%" },
  { label: "Engagé",          count: 0, color: "bg-green-700", width: "100%" },
];

const RECENT_ATHLETES = [
  { id: "1", name: "Lucas Martins",   status: "EN CAMPAGNE", color: "bg-navy text-paper",  steps: 5,  total: 10, nationality: "Français / Brésilien" },
  { id: "2", name: "Sofia Chen",      status: "EN DOSSIER",  color: "bg-ink text-paper",   steps: 2,  total: 10, nationality: "Chinoise" },
  { id: "3", name: "Emma Bergström",  status: "PROSPECT",    color: "bg-stone text-ink",   steps: 0,  total: 10, nationality: "Suédoise" },
];

const UPCOMING = [
  { date: "25 Avr", title: "Réunion famille Chen",          type: "Réunion",  dot: "bg-navy" },
  { date: "28 Avr", title: "Match Champions U19 — Martins", type: "Match",    dot: "bg-amber-600" },
  { date: "30 Avr", title: "Réunion équipe NEXTMOOV",       type: "Interne",  dot: "bg-graphite" },
  { date: "01 Mai", title: "Deadline NCAA — Martins",        type: "Deadline", dot: "bg-red-flag" },
  { date: "20 Mai", title: "Visite UVA — Martins",           type: "Visite",   dot: "bg-green-700" },
];

const TASKS_URGENT = [
  { id: "2", title: "Créer profil NCAA Eligibility",   athlete: "Lucas Martins",  dueDate: "01 Mai", overdue: false },
  { id: "5", title: "Sélectionner universités cibles", athlete: "Sofia Chen",     dueDate: "30 Avr", overdue: false },
  { id: "6", title: "Préparer dossier identité",       athlete: "Emma Bergström", dueDate: "20 Avr", overdue: true },
];

const ACTIVITY_FEED = [
  { id: "a1", Icon: MessageSquare, iconColor: "text-green-600", bg: "bg-green-50",  text: "Duke University a répondu à la campagne de Lucas Martins",      time: "il y a 2h" },
  { id: "a2", Icon: Send,          iconColor: "text-navy",      bg: "bg-navy/5",    text: "Campagne Follow-up D2 envoyée — 28 emails (Lucas Martins)",     time: "il y a 5h" },
  { id: "a3", Icon: Star,          iconColor: "text-gold",      bg: "bg-amber-50",  text: "Étape 5 complétée : Tests standardisés — Lucas Martins",        time: "hier" },
  { id: "a4", Icon: CheckCircle2,  iconColor: "text-green-600", bg: "bg-green-50",  text: "UVA a répondu à la campagne de Lucas Martins",                  time: "il y a 3j" },
  { id: "a5", Icon: Users,         iconColor: "text-navy",      bg: "bg-navy/5",    text: "Nouvel athlète créé : Emma Bergström",                          time: "il y a 4j" },
  { id: "a6", Icon: Mail,          iconColor: "text-navy",      bg: "bg-navy/5",    text: "Campagne initiale envoyée — 45 emails (Lucas Martins)",         time: "il y a 5j" },
];

const CAMPAIGN_STATS = [
  { name: "Lucas Martins · Contact initial", openRate: 40, replies: 4, isDraft: false, id: "1" },
  { name: "Lucas Martins · Follow-up D2",    openRate: 29, replies: 1, isDraft: false, id: "2" },
  { name: "Sofia Chen · Initial",            openRate: 0,  replies: 0, isDraft: true,  id: "3" },
];

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 border-b border-line pb-6 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-graphite mb-1">Tableau de bord</p>
          <h1 className="font-display text-3xl tracking-widest text-navy uppercase">Vue d&apos;ensemble</h1>
        </div>
        <p className="font-mono text-xs text-stone">
          {new Date("2026-04-23").toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-px border border-line bg-line mb-8 rounded-lg overflow-hidden">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="bg-paper px-6 py-5 hover:bg-cream transition-colors block">
              <div className="flex items-start justify-between mb-3">
                <p className="font-mono text-xs uppercase tracking-widest text-graphite">{stat.label}</p>
                <Icon className="h-4 w-4 text-graphite" />
              </div>
              <p className="font-mono text-3xl text-ink mb-1">{stat.value}</p>
              <p className="text-sm text-graphite">{stat.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* Pipeline funnel */}
      <div className="bg-white border border-line rounded-lg p-5 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-mono uppercase tracking-widest text-graphite">Pipeline athlètes</h2>
          <Link href="/admin/athletes" className="text-xs text-navy hover:underline font-mono">Voir tous →</Link>
        </div>
        <div className="space-y-2.5">
          {PIPELINE.map((stage) => (
            <div key={stage.label} className="flex items-center gap-3">
              <span className="text-xs font-mono text-graphite w-28 text-right flex-shrink-0">{stage.label}</span>
              <div className="flex-1 bg-stone/20 rounded h-5 overflow-hidden">
                <div
                  className={`${stage.color} h-full rounded flex items-center justify-end pr-2 transition-all`}
                  style={{ width: stage.width }}
                >
                  {stage.count > 0 && (
                    <span className="text-xs text-white font-mono font-bold">{stage.count}</span>
                  )}
                </div>
              </div>
              <span className="text-xs font-mono text-graphite w-4">{stage.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Col 1: Athletes + Campaigns */}
        <div className="space-y-4">
          <div className="bg-white border border-line rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <h2 className="text-sm font-mono uppercase tracking-widest text-graphite">Athlètes</h2>
              <Link href="/admin/athletes" className="text-xs text-navy hover:underline font-mono">Voir tous →</Link>
            </div>
            <div className="divide-y divide-line">
              {RECENT_ATHLETES.map((athlete) => (
                <Link
                  key={athlete.id}
                  href={`/admin/athletes/${athlete.id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-paper transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-medium text-ink text-sm">{athlete.name}</p>
                    <p className="text-xs font-mono text-graphite">{athlete.nationality}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 bg-stone/20 rounded-full h-1.5">
                        <div className="bg-navy h-1.5 rounded-full" style={{ width: `${(athlete.steps / athlete.total) * 100}%` }} />
                      </div>
                      <span className="text-xs font-mono text-stone">{athlete.steps}/{athlete.total}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-semibold flex-shrink-0 ${athlete.color}`}>
                    {athlete.status}
                  </span>
                </Link>
              ))}
              <Link href="/admin/athletes/new" className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-mono text-graphite hover:text-navy hover:bg-paper transition-colors">
                + Ajouter un athlète
              </Link>
            </div>
          </div>

          <div className="bg-white border border-line rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <h2 className="text-sm font-mono uppercase tracking-widest text-graphite">Campagnes</h2>
              <Link href="/admin/campaigns" className="text-xs text-navy hover:underline font-mono">Voir →</Link>
            </div>
            <div className="divide-y divide-line">
              {CAMPAIGN_STATS.map((c) => (
                <Link key={c.id} href={`/admin/campaigns/${c.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-paper transition-colors">
                  <p className="text-xs font-mono text-graphite truncate flex-1 mr-3">{c.name}</p>
                  {c.isDraft ? (
                    <span className="text-xs font-mono text-stone flex-shrink-0">Brouillon</span>
                  ) : (
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-mono font-semibold text-navy">{c.openRate}%</span>
                      <span className="text-xs font-mono text-graphite ml-1.5">{c.replies} rép.</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Col 2: Agenda + Tasks */}
        <div className="space-y-4">
          <div className="bg-white border border-line rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <h2 className="text-sm font-mono uppercase tracking-widest text-graphite flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Agenda
              </h2>
              <Link href="/admin/calendar" className="text-xs text-navy hover:underline font-mono">Voir tout →</Link>
            </div>
            <div className="divide-y divide-line">
              {UPCOMING.map((ev, i) => (
                <div key={i} className="flex gap-3 px-5 py-3 items-start">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${ev.dot}`} />
                  <div>
                    <p className="text-sm text-ink leading-tight">{ev.title}</p>
                    <p className="text-xs font-mono text-graphite mt-0.5">{ev.date} · {ev.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-line rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <h2 className="text-sm font-mono uppercase tracking-widest text-graphite flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-flag" /> Tâches urgentes
              </h2>
              <Link href="/admin/tasks" className="text-xs text-navy hover:underline font-mono">Voir →</Link>
            </div>
            <div className="divide-y divide-line">
              {TASKS_URGENT.map((task) => (
                <div key={task.id} className="px-5 py-3 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink font-medium leading-tight truncate">{task.title}</p>
                    <p className="text-xs font-mono text-graphite mt-0.5">{task.athlete}</p>
                  </div>
                  <p className={`text-xs font-mono font-semibold flex-shrink-0 ${task.overdue ? "text-red-flag" : "text-graphite"}`}>
                    {task.overdue && "⚠ "}{task.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: Activity feed */}
        <div>
          <div className="bg-white border border-line rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-line">
              <h2 className="text-sm font-mono uppercase tracking-widest text-graphite flex items-center gap-2">
                <Activity className="w-4 h-4" /> Activité récente
              </h2>
            </div>
            <div className="divide-y divide-line">
              {ACTIVITY_FEED.map(({ id, Icon, iconColor, bg, text, time }) => (
                <div key={id} className="flex gap-3 px-5 py-3.5 items-start">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-ink leading-snug">{text}</p>
                    <p className="text-xs font-mono text-stone mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DB setup banner */}
      <div className="mt-8 border border-gold bg-cream px-6 py-5 rounded-lg">
        <p className="font-mono text-xs uppercase tracking-widest text-gold mb-2">Configuration requise</p>
        <p className="text-sm text-graphite mb-3">Connectez votre base de données PostgreSQL pour afficher les vraies données.</p>
        <div className="font-mono text-sm text-graphite space-y-1">
          <p>1. Renseignez <span className="text-ink">DATABASE_URL</span> dans <span className="text-ink">.env</span></p>
          <p>2. Lancez <span className="text-ink">npx prisma migrate dev --name init</span></p>
          <p>3. Importez les coachs avec <span className="text-ink">npm run db:seed</span></p>
        </div>
      </div>
    </div>
  );
}
