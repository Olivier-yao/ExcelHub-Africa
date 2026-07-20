# ExcelHub Africa — Instructions projet

## Contexte
Marketplace de fichiers Excel de gestion pour PME africaines (FCFA, Mobile Money).
Monorepo npm workspaces : apps/frontend (React 19 + Vite) et apps/backend
(Express 5 + Prisma + PostgreSQL). Tout le produit est en français.

## Commandes
- npm run dev            # front (5173) + API (4000)
- npm run lint / npm run format:check / npm run build
- npm run prisma:migrate --workspace=@excelhub/backend -- --name <nom>
- npm run db:seed --workspace=@excelhub/backend

## Règles
- TypeScript strict, ESM, imports relatifs avec extension .js côté backend.
- Toute entrée API est validée avec Zod ; réponses au format
  { success, data, message, errors }.
- Jamais de secret en dur ; toute nouvelle variable d'env est ajoutée au
  schéma Zod de src/config/env.ts ET aux .env.example.
- Les fichiers Excel ne sont jamais servis en statique : uploads/ est privé,
  le téléchargement client passe par DownloadToken.
- Textes UI, messages d'erreur et e-mails en français.
- Prix stockés en Int (FCFA) ; affichage via formatFcfa().
- Après chaque tâche : lint + build verts avant de conclure.

## Référence
Le cahier des charges complet est dans CAHIER-DES-CHARGES-ExcelHub-Africa.md ;
suivre l'ordre des phases de la section 9.
