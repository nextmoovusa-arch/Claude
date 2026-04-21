# Varsity Path — NEXTMOOV USA

Plateforme interne de placement universitaire sportif aux États-Unis.

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Renseigner DATABASE_URL et les clés d'authentification

# 3. Générer le client Prisma et migrer la base
npm run db:migrate -- --name init

# 4. Lancer l'application en local
npm run dev
```

Application disponible sur [http://localhost:3000/admin](http://localhost:3000/admin).

## Import de la base coachs

```bash
npm run import-coaches -- chemin/vers/votre-fichier.xlsx
```

Le script attend les colonnes suivantes (noms insensibles à la casse) :
`university`, `city`, `state`, `division`, `coach_first_name`, `coach_last_name`, `coach_email`, `coach_title`, `is_head_coach`

Un rapport détaillé est affiché en fin d'import.

## Structure du projet

```
varsity-path/
├── app/
│   ├── admin/          # Interface agent
│   │   ├── athletes/   # Gestion athlètes
│   │   ├── universities/
│   │   ├── campaigns/
│   │   └── ...
│   └── globals.css
├── components/
│   ├── ui/             # Composants de base (Button, Badge, Input...)
│   └── layout/         # Sidebar, Header
├── lib/                # Utilitaires et constantes
├── prisma/
│   └── schema.prisma   # Schéma de données complet
├── scripts/
│   └── import-coaches.ts
└── types/
```

## Stack technique

- **Framework** — Next.js 14 App Router + TypeScript strict
- **Styling** — Tailwind CSS + composants Radix UI
- **Base de données** — PostgreSQL (Neon) via Prisma
- **Auth** — Clerk
- **Stockage** — Cloudflare R2
- **Email** — API Gmail OAuth2 (Phase II)
- **Déploiement** — Vercel (`app.nextmoov.com`)

## Phases de développement

| Phase | Contenu | Statut |
|-------|---------|--------|
| I | Socle, schéma, import coachs, interface admin | En cours |
| II | Moteur d'emails Gmail | À venir |
| III | Portail famille et athlète | À venir |
| IV | Base universités enrichie | À venir |
| V | Éligibilité NCAA | À venir |
| VI | Matching intelligent | À venir |
