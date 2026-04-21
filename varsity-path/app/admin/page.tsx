import { Users, Building2, Mail, TrendingUp } from "lucide-react"

const stats = [
  { label: "Athlètes actifs", value: "—", icon: Users, note: "connectez la base de données" },
  { label: "Universités", value: "—", icon: Building2, note: "importez la base coachs" },
  { label: "Emails envoyés", value: "—", icon: Mail, note: "ce mois-ci" },
  { label: "Taux de réponse", value: "—", icon: TrendingUp, note: "campagnes actives" },
]

export default function AdminDashboard() {
  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="mb-8 border-b border-line pb-6">
        <p className="font-mono text-xs uppercase tracking-widest text-stone mb-1">
          Tableau de bord
        </p>
        <h1 className="font-anton text-3xl tracking-widest text-ink">
          VUE D&apos;ENSEMBLE
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-px border border-line bg-line mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-paper px-6 py-5">
              <div className="flex items-start justify-between mb-3">
                <p className="font-mono text-xs uppercase tracking-widest text-stone">
                  {stat.label}
                </p>
                <Icon className="h-4 w-4 text-stone" />
              </div>
              <p className="font-mono text-3xl text-ink mb-1">{stat.value}</p>
              <p className="font-garamond text-sm text-stone italic">{stat.note}</p>
            </div>
          )
        })}
      </div>

      {/* Setup banner */}
      <div className="border border-gold bg-cream px-6 py-5">
        <p className="font-mono text-xs uppercase tracking-widest text-gold mb-2">
          Configuration requise
        </p>
        <p className="font-garamond text-base text-graphite mb-3">
          Pour activer les données en temps réel, connectez votre base de données PostgreSQL
          et effectuez la migration Prisma initiale.
        </p>
        <div className="font-mono text-sm text-graphite space-y-1">
          <p>1. Renseignez <span className="text-ink">DATABASE_URL</span> dans votre fichier <span className="text-ink">.env</span></p>
          <p>2. Lancez <span className="text-ink">npx prisma migrate dev --name init</span></p>
          <p>3. Importez votre base coachs avec <span className="text-ink">npm run import-coaches</span></p>
        </div>
      </div>
    </div>
  )
}
