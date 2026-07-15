# ExcelHub Africa

Marketplace de solutions de gestion prêtes à l'emploi pour les PME africaines.

## Structure

```text
apps/
  frontend/  React + Vite + TypeScript
  backend/   Express + Prisma + PostgreSQL
```

## Prérequis

- Node.js 20+ et npm
- PostgreSQL 16+ pour les fonctionnalités nécessitant une base de données

## Installation

```bash
npm install
copy apps\\backend\\.env.example apps\\backend\\.env
copy apps\\frontend\\.env.example apps\\frontend\\.env
npm run db:generate
npm run dev
```

Le frontend démarre sur `http://localhost:5173` et l'API sur `http://localhost:4000`.

## Vérifications

```bash
npm run lint
npm run format:check
npm run build
```

## Base de données

Créez une base PostgreSQL, renseignez `DATABASE_URL` dans `apps/backend/.env`, puis exécutez une migration lorsque le premier modèle métier sera ajouté :

```bash
npm run prisma:migrate --workspace=@excelhub/backend -- --name init
```

Docker est volontairement hors du périmètre de cette V1 : la configuration locale PostgreSQL est suffisante pour initialiser le produit.

## Git

Utilisez `./git-project.ps1 status`, `./git-project.ps1 add .` et `./git-project.ps1 commit -m "feat: initialisation"` pour les commandes Git du projet. Les métadonnées sont stockées dans `.excelhub-git` afin de respecter les restrictions de l'environnement de développement.
