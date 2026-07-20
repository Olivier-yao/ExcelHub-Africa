# ExcelHub Africa

Marketplace de solutions de gestion Excel prêtes à l'emploi pour les PME africaines.

## Structure

```text
apps/
  frontend/  React 19 + Vite + TypeScript + React Query
    src/
      components/  Composants reutilisables (Logo, ProductCard, ...)
      data/        Types produits + donnees de secours
      hooks/       useProducts (React Query)
      pages/       HomePage, ProductDetailPage, NotFoundPage
      services/    Client axios
  backend/   Express 5 + Prisma + PostgreSQL + Zod + JWT
    prisma/  schema.prisma + seed.ts
    src/
      config/      Validation des variables d'environnement (Zod)
      lib/         Client Prisma
      middleware/  requireAuth, requireAdmin (JWT)
      routes/      auth, products (public), admin/products (CRUD + upload .xlsx)
      utils/       Helpers de reponse HTTP
```

## Prérequis

- Node.js 20+ et npm
- PostgreSQL 16+

## Installation

```bash
npm install
copy apps\\backend\\.env.example apps\\backend\\.env
copy apps\\frontend\\.env.example apps\\frontend\\.env
npm run db:generate
npm run prisma:migrate --workspace=@excelhub/backend -- --name init
npm run db:seed --workspace=@excelhub/backend
npm run dev
```

Le frontend démarre sur `http://localhost:5173` et l'API sur `http://localhost:4000`.

Le seed crée les 6 produits du catalogue et un compte administrateur
(`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` dans `apps/backend/.env` —
changez ce mot de passe immédiatement).

## API v1

| Méthode | Route                                 | Accès  | Description                                        |
| ------- | ------------------------------------- | ------ | -------------------------------------------------- |
| GET     | `/health`                             | Public | État du service                                    |
| POST    | `/api/v1/auth/register`               | Public | Création de compte client                          |
| POST    | `/api/v1/auth/login`                  | Public | Connexion (access + refresh tokens)                |
| POST    | `/api/v1/auth/refresh`                | Public | Renouvellement des tokens                          |
| GET     | `/api/v1/products`                    | Public | Produits publiés                                   |
| GET     | `/api/v1/products/:slug`              | Public | Détail d'un produit publié                         |
| GET     | `/api/v1/admin/products`              | Admin  | Tous les produits (y compris brouillons)           |
| POST    | `/api/v1/admin/products`              | Admin  | Créer un produit (multipart, champ `file` = .xlsx) |
| PUT     | `/api/v1/admin/products/:id`          | Admin  | Modifier un produit / remplacer le fichier         |
| DELETE  | `/api/v1/admin/products/:id`          | Admin  | Supprimer un produit                               |
| GET     | `/api/v1/admin/products/:id/download` | Admin  | Télécharger le fichier pour vérification           |

Les routes admin exigent l'en-tête `Authorization: Bearer <accessToken>` d'un
compte dont le rôle est `ADMIN`.

## Vérifications

```bash
npm run lint
npm run format:check
npm run build
```

## Fichiers Excel

Les fichiers uploadés par l'admin sont stockés dans `apps/backend/uploads/`
(hors Git). Ils ne sont jamais servis publiquement : le téléchargement client
passera par des jetons d'achat à usage limité (phase paiement).

Docker est volontairement hors du périmètre de cette V1.
