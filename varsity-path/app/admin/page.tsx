import Link from "next/link";
import {
  Users, Building2, Mail, TrendingUp,
  AlertCircle, Calendar, Activity,
  CheckCircle2, MessageSquare, Send, Star,
  ChevronRight,
} from "lucide-react";

const STATS = [
  { label: "Athlètes actifs",  value: "3",   sub: "2 en campagne",    icon: Users,      href: "/admin/athletes",    color: "text-blue-600",   bg: "bg-blue-50" },
  { label: "Universités",      value: "919", sub: "base complète",    icon: Building2,  href: "/admin/universities",color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Emails envoyés",   value: "73",  sub: "ce mois-ci",       icon: Mail,       href: "/admin/campaigns",   color: "text-green-600",  bg: "bg-green-50" },
  { label: "Taux de réponse",  value: "7%",  sub: "5 sur 73 emails",  icon: TrendingUp, href: "/admin/campaigns",   color: "text-amber-600",  bg: "bg-amber-50" },
];

const PIPELINE = [
  { label: "Prospect",      count: 1, color: "bg-gray-400",    width: "20%" },
  { label: "Signé",         count: 3, color: "bg-amber-400",   width: "40%" },
  { label: "En dossier",    count: 1, color: "bg-gray-600",    width: "55%" },
  { label: "En campagne",   count: 2, color: "bg-blue-500",    width: "70%" },
  { label: "Offres reçues", count: 1, color: "bg-violet-500",  width: "85%" },
  { label: "Engagé",        count: 0, color: "bg-green-500",   width: "100%" },
];

const RECENT_ATHLETES = [
  { id: "1", name: "Lucas Martins",   status: "En campagne",  statusColor: "bg-blue-50 text-blue-700",    steps: 5,  total: 10, nationality: "Français / Brésilien" },
  { id: "2", name: "Sofia Chen",      status: "En dossier",   statusColor: "bg-gray-100 text-gray-600",   steps: 2,  total: 10, nationality: "Chinoise" },
  { id: "3", name: "Emma Bergström",  status: "Prospect",     statusColor: "bg-amber-50 text-amber-700",  steps: 0,  total: 10, nationality: "Suédoise" },
];

const UPCOMING = [
  { date: "25 Avr", title: "Réunion famille Chen",          type: "Réunion",  dotColor: "bg-blue-500" },
  { date: "28 Avr", title: "Match Champions U19 — Martins", type: "Match",    dotColor: "bg-amber-500" },
  { date: "30 Avr", title: "Réunion équipe NEXTMOOV",       type: "Interne",  dotColor: "bg-gray-400" },
  { date: "01 Mai", title: "Deadline NCAA — Martins",        type: "Deadline", dotColor: "bg-red-500" },
  { date: "20 Mai", title: "Visite UVA — Martins",           type: "Visite",   dotColor: "bg-green-500" },
];

const TASKS_URGENT = [
  { id: "2", title: "Créer profil NCAA Eligibility",   athlete: "Lucas Martins",  dueDate: "01 Mai", overdue: false },
  { id: "5", title: "Sélectionner universités cibles", athlete: "Sofia Chen",     dueDate: "30 Avr", overdue: false },
  { id: "6", title: "Préparer dossier identité",       athlete: "Emma Bergström", dueDate: "20 Avr", overdue: true },
];

const ACTIVITY_FEED = [
  { id: "a1", Icon: MessageSquare, iconColor: "text-green-600",  bg: "bg-green-50",   text: "Duke University a répondu à la campagne de Lucas Martins",   time: "il y a 2h" },
  { id: "a2", Icon: Send,          iconColor: "text-blue-600",   bg: "bg-blue-50",    text: "Campagne Follow-up D2 envoyée — 28 emails (Lucas Martins)",  time: "il y a 5h" },
  { id: "a3", Icon: Star,          iconColor: "text-amber-500",  bg: "bg-amber-50",   text: "Étape 5 complétée : Tests standardisés — Lucas Martins",     time: "hier" },
  { id: "a4", Icon: CheckCircle2,  iconColor: "text-green-600",  bg: "bg-green-50",   text: "UVA a répondu à la campagne de Lucas Martins",               time: "il y a 3j" },
  { id: "a5", Icon: Users,         iconColor: "text-blue-600",   bg: "bg-blue-50",    text: "Nouvel athlète créé : Emma Bergström",                       time: "il y a 4j" },
  { id: "a6", Icon: Mail,          iconColor: "text-blue-600",   bg: "bg-blue-50",    text: "Campagne initiale envoyée — 45 emails (Lucas Martins)",      time: "il y a 5j" },
];

const CAMPAIGN_STATS = [
  { name: "Lucas Martins · Contact initial", openRate: 40, replies: 4, isDraft: false, id: "1" },
  { name: "Lucas Martins · Follow-up D2",    openRate: 29, replies: 1, isDraft: false, id: "2" },
  { name: "Sofia Chen · Initial",            openRate: 0,  replies: 0, isDraft: true,  id: "3" },
];

function SectionCard({ title, href, linkLabel, children }: { title: React.ReactNode; href: string; linkLabel?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-line rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
        {linkLabel && (
          <Link href={href} className="flex items-center gap-0.5 text-xs text-primary hover:underline">
            {linkLabel} <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <p className="text-xs text-stone mb-0.5">
          {new Date("2026-04-23").toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
        <h1 className="text-xl font-semibold text-ink">Bonjour 👋</h1>
        <p className="text-sm text-stone">Bienvenue sur votre tableau de bord NEXTMOOV USA</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="bg-white border border-line rounded-lg p-4 hover:shadow-card transition-shadow block">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-ink mb-0.5">{stat.value}</p>
              <p className="text-xs text-stone">{stat.label}</p>
              <p className="text-xs text-stone mt-0.5">{stat.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* Pipeline */}
      <div className="bg-white border border-line rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-ink">Pipeline athlètes</h2>
          <Link href="/admin/athletes" className="flex items-center gap-0.5 text-xs text-primary hover:underline">
            Voir tous <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {PIPELINE.map((stage) => (
            <div key={stage.label} className="flex items-center gap-3">
              <span className="text-xs text-stone w-28 text-right shrink-0">{stage.label}</span>
              <div className="flex-1 bg-mist rounded-full h-2 overflow-hidden">
                <div
                  className={`${stage.color} h-full rounded-full transition-all`}
                  style={{ width: stage.width }}
                />
              </div>
              <span className="text-xs text-stone w-4 shrink-0">{stage.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3-col grid */}
      <div className="grid grid-cols-3 gap-4">

        {/* Col 1 */}
        <div className="space-y-4">
          <SectionCard title="Athlètes" href="/admin/athletes" linkLabel="Voir tous">
            <div className="divide-y divide-line">
              {RECENT_ATHLETES.map((athlete) => (
                <Link
                  key={athlete.id}
                  href={`/admin/athletes/${athlete.id}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-paper transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm font-medium text-ink truncate">{athlete.name}</p>
                    <p className="text-xs text-stone">{athlete.nationality}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 bg-mist rounded-full h-1">
                        <div className="bg-primary h-1 rounded-full" style={{ width: `${(athlete.steps / athlete.total) * 100}%` }} />
                      </div>
                      <span className="text-xs text-stone shrink-0">{athlete.steps}/{athlete.total}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${athlete.statusColor}`}>
                    {athlete.status}
                  </span>
                </Link>
              ))}
              <Link href="/admin/athletes/new" className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs text-stone hover:text-primary hover:bg-paper transition-colors">
                + Ajouter un athlète
              </Link>
            </div>
          </SectionCard>

          <SectionCard title="Campagnes" href="/admin/campaigns" linkLabel="Voir">
            <div className="divide-y divide-line">
              {CAMPAIGN_STATS.map((c) => (
                <Link key={c.id} href={`/admin/campaigns/${c.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-paper transition-colors">
                  <p className="text-xs text-graphite truncate flex-1 mr-2">{c.name}</p>
                  {c.isDraft ? (
                    <span className="text-xs text-stone shrink-0">Brouillon</span>
                  ) : (
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-primary">{c.openRate}%</span>
                      <span className="text-xs text-stone ml-1.5">{c.replies} rép.</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Col 2 */}
        <div className="space-y-4">
          <SectionCard title={<span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-stone" /> Agenda</span>} href="/admin/calendar" linkLabel="Voir tout">
            <div className="divide-y divide-line">
              {UPCOMING.map((ev, i) => (
                <div key={i} className="flex gap-3 px-4 py-2.5 items-start">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${ev.dotColor}`} />
                  <div>
                    <p className="text-sm text-ink leading-tight">{ev.title}</p>
                    <p className="text-xs text-stone mt-0.5">{ev.date} · {ev.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title={<span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-red-500" /> Tâches urgentes</span>} href="/admin/tasks" linkLabel="Voir">
            <div className="divide-y divide-line">
              {TASKS_URGENT.map((task) => (
                <div key={task.id} className="px-4 py-3 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink font-medium leading-tight truncate">{task.title}</p>
                    <p className="text-xs text-stone mt-0.5">{task.athlete}</p>
                  </div>
                  <p className={`text-xs font-medium shrink-0 ${task.overdue ? "text-red-500" : "text-stone"}`}>
                    {task.overdue && "⚠ "}{task.dueDate}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Col 3 */}
        <div>
          <SectionCard title={<span className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-stone" /> Activité récente</span>} href="#">
            <div className="divide-y divide-line">
              {ACTIVITY_FEED.map(({ id, Icon, iconColor, bg, text, time }) => (
                <div key={id} className="flex gap-3 px-4 py-3 items-start">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-graphite leading-snug">{text}</p>
                    <p className="text-xs text-stone mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

    </div>
  );
}
