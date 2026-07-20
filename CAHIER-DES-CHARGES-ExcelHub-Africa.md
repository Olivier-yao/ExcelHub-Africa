# Cahier des charges — ExcelHub Africa

**Version** : 1.0 · **Date** : 20 juillet 2026 · **Statut** : Document de référence pour le développement avec Claude Code

---

## 1. Présentation du projet

### 1.1 Vision

ExcelHub Africa est une marketplace en ligne qui vend des fichiers Excel de gestion professionnels, prêts à l'emploi, conçus pour les réalités des PME africaines : prix en FCFA, intégration Mobile Money (Orange Money, MTN MoMo, Moov Money, Wave), catégories métiers locales (boutique, pharmacie, école, restaurant, finance).

### 1.2 Objectifs business

- Permettre à un entrepreneur d'acheter un outil de gestion en moins de 5 minutes, payé en Mobile Money, et de le télécharger immédiatement.
- Permettre à l'administrateur d'ajouter, modifier et publier de nouveaux fichiers Excel **sans toucher au code** (voir section 6 — Back-office).
- Construire un catalogue évolutif : 6 produits au lancement, extensible sans limite.

### 1.3 Cibles

| Persona                     | Description                                          | Besoin principal                             |
| --------------------------- | ---------------------------------------------------- | -------------------------------------------- |
| Gérant de boutique          | Commerce de détail, peu à l'aise avec l'informatique | Outil simple, en français, prêt à l'emploi   |
| Agent Mobile Money          | Gère des flux multi-opérateurs et commissions        | Suivi de caisse fiable                       |
| Pharmacien                  | Stock avec lots et dates d'expiration                | Alertes automatiques                         |
| Directeur d'école           | Élèves, paiements, notes                             | Suivi administratif centralisé               |
| Restaurateur                | Coûts matières et ventes journalières                | Marge visible                                |
| **Administrateur (Fabien)** | Crée les fichiers Excel et gère la plateforme        | Publier un nouveau produit en quelques clics |

### 1.4 Périmètre

**Inclus (V1 → V3)** : catalogue public, fiches produits, comptes clients, panier, paiement Mobile Money, livraison sécurisée des fichiers, back-office admin complet, e-mails transactionnels.

**Exclus (pour l'instant)** : application mobile native, abonnements récurrents, marketplace multi-vendeurs, Docker, internationalisation (le site est 100 % en français).

---

## 2. État actuel du code (base de départ)

Le dépôt contient déjà :

- **Monorepo npm workspaces** : `apps/frontend` + `apps/backend`.
- **Frontend** : React 19, Vite 7, TypeScript, React Router 7, React Query, axios. Pages : accueil (hero, catalogue filtrable, étapes, CTA), fiche produit, 404. Structure en `pages/`, `components/`, `hooks/`, `data/`, `services/`. Le hook `useProducts` consomme `GET /api/v1/products` avec repli sur des données locales si l'API est indisponible.
- **Backend** : Express 5, Prisma 6, PostgreSQL, Zod, JWT (jsonwebtoken), bcryptjs, multer. Modèles Prisma : `User`, `Product`, `Order`, `OrderItem`, `DownloadToken`. Routes : auth (register/login/refresh), produits publics, CRUD admin produits avec upload `.xlsx`/`.xlsm` sur disque. Seed : 6 produits + 1 compte admin.
- **Qualité** : ESLint 9 flat config, Prettier, EditorConfig, format de réponse API normalisé `{ success, data, message, errors }`.

**Ce qui reste à construire** : migration initiale de la base, interface d'authentification côté frontend, panier, paiement, livraison des fichiers, interface du back-office admin, e-mails, tests, CI/CD, déploiement.

---

## 3. Architecture technique

### 3.1 Stack

| Couche       | Technologie                                                                           | Justification                                                                                            |
| ------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Frontend     | React 19 + Vite 7 + TypeScript                                                        | Déjà en place, moderne                                                                                   |
| Style        | CSS custom (`styles/index.css`)                                                       | **Décision** : retirer Tailwind (installé mais inutilisé) OU migrer entièrement ; ne pas garder les deux |
| État serveur | TanStack React Query 5                                                                | Cache, invalidation, retry                                                                               |
| Formulaires  | react-hook-form + @hookform/resolvers + Zod                                           | Déjà installés, à brancher                                                                               |
| Backend      | Express 5 + TypeScript (ESM)                                                          | Déjà en place                                                                                            |
| ORM / BDD    | Prisma 6 + PostgreSQL 16                                                              | Déjà en place                                                                                            |
| Auth         | JWT access (15 min) + refresh (7 j), bcrypt                                           | Déjà en place côté API                                                                                   |
| Upload       | multer (disque local en dev) → stockage objet en prod                                 | Voir 3.3                                                                                                 |
| Paiement     | Agrégateur Mobile Money : **CinetPay** (recommandé pour la Côte d'Ivoire) ou Paystack | Couvre Orange, MTN, Moov, Wave + cartes                                                                  |
| E-mails      | Resend ou Brevo (ex-Sendinblue)                                                       | Simple, offre gratuite suffisante                                                                        |
| Tests        | Vitest + Supertest (API) + Testing Library (front)                                    | À installer                                                                                              |
| CI           | GitHub Actions                                                                        | Lint + tests + build sur chaque PR                                                                       |

### 3.2 Arborescence cible

```text
apps/
  frontend/src/
    components/        # UI réutilisable (Logo, ProductCard, Button, Input, ...)
    pages/             # Une page = un fichier (HomePage, LoginPage, AdminProductsPage, ...)
    hooks/             # useProducts, useAuth, useCart, ...
    context/           # AuthContext, CartContext
    services/          # api.ts (axios + intercepteurs JWT)
    data/              # Types partagés + données de secours
    styles/
  backend/src/
    config/            # env.ts (validation Zod)
    lib/               # prisma.ts, payment.ts, mailer.ts, storage.ts
    middleware/        # auth.ts, errors.ts
    routes/            # *.routes.ts par domaine
    utils/             # http.ts, tokens.ts
  backend/prisma/      # schema.prisma, migrations/, seed.ts
```

### 3.3 Stockage des fichiers Excel

- **Développement** : disque local `apps/backend/uploads/` (déjà en place, hors Git).
- **Production** : stockage objet compatible S3 — **Cloudflare R2** recommandé (pas de frais de sortie) ou Backblaze B2. Le module `lib/storage.ts` doit exposer une interface unique (`saveFile`, `getSignedUrl`, `deleteFile`) avec deux implémentations (locale / S3) choisies par variable d'environnement `STORAGE_DRIVER=local|s3`.
- **Règle absolue** : les fichiers ne sont **jamais** servis en statique. Tout téléchargement client passe par un `DownloadToken` (voir 5.6).

---

## 4. Modèle de données

Modèles existants dans `schema.prisma` (à faire évoluer si besoin) :

| Modèle          | Champs clés                                                                                                                      | Rôle                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `User`          | email unique, passwordHash, name, role (`ADMIN`/`CUSTOMER`)                                                                      | Comptes             |
| `Product`       | slug unique, name, category, priceFcfa (Int), tag, color, description, features (String[]), fileName, filePath, published (Bool) | Catalogue           |
| `Order`         | userId, status (`PENDING`/`PAID`/`CANCELLED`), totalFcfa, paymentRef                                                             | Commandes           |
| `OrderItem`     | orderId, productId, priceFcfa (prix figé à l'achat)                                                                              | Lignes de commande  |
| `DownloadToken` | token (uuid), orderItemId, expiresAt, usedAt                                                                                     | Livraison sécurisée |

Évolutions prévues en phase paiement : ajouter `PaymentEvent` (journal des webhooks reçus, idempotence) et un champ `downloadCount` sur `OrderItem` (limite de téléchargements, ex. 5).

---

## 5. Fonctionnalités détaillées

### F1 — Catalogue public _(fait, à raffiner)_

- Liste des produits publiés, filtrable par catégorie.
- Les catégories doivent devenir dynamiques (dérivées des produits retournés par l'API, plus la valeur « Tous ») au lieu d'une liste codée en dur.
- États de chargement et d'erreur visibles (skeleton ou spinner).

### F2 — Fiche produit _(fait, à raffiner)_

- URL `/produits/:slug`, données via API, 404 si slug inconnu ou non publié.
- Ajouter des captures d'écran réelles du fichier Excel (champ `images` à prévoir sur `Product` en V2 ; l'admin uploadera 1 à 3 images PNG/JPG par produit).

### F3 — Authentification côté frontend

- Pages `/connexion` et `/inscription` avec react-hook-form + Zod (schémas identiques à ceux de l'API).
- `AuthContext` : stocke l'utilisateur ; l'access token vit en mémoire, le refresh token en cookie httpOnly (à ajouter côté API : `POST /auth/refresh` lit le cookie) — **ne pas stocker les tokens en localStorage**.
- Intercepteur axios : ajoute `Authorization: Bearer`, tente un refresh automatique sur 401 puis rejoue la requête une fois.
- Bouton « Se connecter » de la navbar → menu compte (Mes achats, Déconnexion, + lien Admin si rôle ADMIN).

**Critères d'acceptation** : un utilisateur peut créer un compte, se connecter, rester connecté après rafraîchissement de la page, se déconnecter.

### F4 — Panier et commande

- `CartContext` persisté (le panier peut vivre en mémoire + sessionStorage côté site public).
- Ajout depuis la fiche produit, badge quantité dans la navbar, page `/panier` (liste, suppression, total FCFA).
- `POST /api/v1/orders` (authentifié) : crée une `Order` PENDING avec ses `OrderItem` aux prix actuels. Un produit numérique ne peut être présent qu'une fois par commande.
- Si l'utilisateur n'est pas connecté au moment de payer → redirection connexion puis retour au panier.

### F5 — Paiement Mobile Money

- Intégration **CinetPay** (ou Paystack) via `lib/payment.ts` :
  1. `POST /api/v1/orders/:id/pay` → crée une transaction chez l'agrégateur, renvoie l'URL de paiement, le client est redirigé.
  2. Webhook `POST /api/v1/payments/webhook` : vérifie la signature, journalise l'événement (`PaymentEvent`, idempotent), passe la commande en `PAID`, génère les `DownloadToken`, envoie l'e-mail de livraison.
  3. Page de retour `/commande/:id/confirmation` : interroge le statut réel côté API (ne jamais faire confiance aux seuls paramètres d'URL de retour).
- Clés API en variables d'environnement (`CINETPAY_API_KEY`, `CINETPAY_SITE_ID`, `CINETPAY_SECRET`). Mode sandbox en développement.

**Critères d'acceptation** : un paiement sandbox complet passe la commande en PAID et déclenche l'e-mail avec liens de téléchargement ; un webhook rejoué ne crée pas de doublons.

### F6 — Livraison sécurisée des fichiers

- À la confirmation du paiement : un `DownloadToken` par article, validité 72 h, maximum 5 téléchargements.
- `GET /api/v1/downloads/:token` : vérifie validité/expiration/quota, incrémente le compteur, streame le fichier avec son nom original.
- Page « Mes achats » (`/mes-achats`) : liste des commandes payées avec boutons de téléchargement ; possibilité de régénérer un lien expiré (nouvelle validité 72 h, réservé au propriétaire de la commande).

### F7 — E-mails transactionnels

- `lib/mailer.ts` (Resend ou Brevo). Gabarits : bienvenue, confirmation de commande + liens de téléchargement, lien régénéré. Expéditeur : `contact@` du futur domaine. Tous les e-mails en français.

### F8 — Pages annexes

- Mentions légales, CGV (obligatoires pour vendre), page contact (formulaire → e-mail admin), FAQ courte. Contenu fourni par l'administrateur ; prévoir des pages statiques simples.

---

## 6. Back-office administrateur — réponse au besoin « ajouter de nouvelles fiches Excel »

### 6.1 Solution retenue : back-office intégré au site (recommandé)

**Pas besoin d'une application séparée connectée à ExcelHub.** La meilleure solution est une section `/admin` protégée, intégrée au site web lui-même :

- **Un seul système** : même base de données, même authentification, même déploiement. Aucune synchronisation entre deux applications, aucun risque d'incohérence.
- **Accessible partout** : depuis n'importe quel navigateur (PC, téléphone), sans installer quoi que ce soit.
- **Workflow de publication** : tu prépares ton fichier `.xlsx` dans Excel comme d'habitude → tu ouvres `/admin` → « Nouveau produit » → tu remplis le formulaire → tu glisses le fichier → « Enregistrer en brouillon » ou « Publier ». Le produit apparaît immédiatement dans le catalogue public.

Une application desktop séparée (ton idée initiale) est possible techniquement — elle consommerait la même API admin — mais elle ajouterait un deuxième code à maintenir, des mises à jour à distribuer, et ne serait utilisable que sur la machine où elle est installée, pour un gain nul. À écarter. De même, un CMS headless externe (Strapi, Directus) ferait doublon avec l'API déjà construite.

L'API admin est **déjà développée** (CRUD produits + upload sécurisé `.xlsx`/`.xlsm`, 25 Mo max, rôle ADMIN requis). Il reste à construire l'interface.

### 6.2 Écrans du back-office

| Écran                      | Route                                            | Contenu                                                                                                               |
| -------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Connexion admin            | `/connexion` (commune)                           | Redirection vers `/admin` si rôle ADMIN                                                                               |
| Tableau de bord            | `/admin`                                         | Chiffre d'affaires du mois (FCFA), nombre de ventes, derniers achats, produits les plus vendus                        |
| Liste produits             | `/admin/produits`                                | Tableau : nom, catégorie, prix, statut Publié/Brouillon (toggle), fichier présent oui/non, actions Modifier/Supprimer |
| Nouveau / Modifier produit | `/admin/produits/nouveau`, `/admin/produits/:id` | Formulaire complet (voir 6.3)                                                                                         |
| Commandes                  | `/admin/commandes`                               | Liste filtrable par statut, détail d'une commande, régénération manuelle d'un lien de téléchargement                  |
| Clients                    | `/admin/clients`                                 | Liste, recherche par e-mail, historique d'achats                                                                      |

### 6.3 Formulaire produit (cœur du besoin)

Champs : nom, slug (auto-généré depuis le nom, modifiable), catégorie (liste + « nouvelle catégorie »), prix FCFA, badge/tag, couleur de la vignette (sélecteur parmi les couleurs existantes), description courte, fonctionnalités (une par ligne), **zone de glisser-déposer pour le fichier Excel** (validation `.xlsx`/`.xlsm`, taille max 25 Mo, affichage du nom + taille + bouton de vérification qui télécharge le fichier), interrupteur Publié/Brouillon.

Règles : impossible de publier un produit sans fichier attaché ; le remplacement d'un fichier supprime l'ancien du stockage ; toute erreur de validation s'affiche champ par champ en français.

**Critères d'acceptation** : l'administrateur peut créer un produit complet avec fichier en moins de 2 minutes, le voir en brouillon, le publier, constater son apparition dans le catalogue public, puis remplacer le fichier sans changer l'URL du produit.

### 6.4 Sécurité du back-office

- Toutes les routes `/admin/*` (front et API) exigent le rôle ADMIN ; un client connecté qui tente d'y accéder reçoit un 403 / une redirection.
- Mot de passe admin fort obligatoire, changé après le premier seed.
- Journal minimal des actions admin (création/modification/suppression de produit) en base — utile en cas d'erreur.

---

## 7. Exigences non fonctionnelles

- **Sécurité** : helmet, rate limiting (express-rate-limit) sur `/auth/*` et `/payments/*`, CORS restreint à `CLIENT_URL`, validation Zod sur toutes les entrées, aucun secret dans le code, refresh token en cookie httpOnly `Secure` `SameSite=Lax`.
- **Performance** : catalogue < 1 s sur connexion 3G (beaucoup d'utilisateurs cibles sont sur mobile) ; images compressées ; pas de librairie UI lourde.
- **Compatibilité** : mobile d'abord (la majorité du trafic ivoirien est mobile), Chrome/Android en priorité.
- **Qualité** : `npm run lint`, `format:check` et `build` doivent passer sans erreur à chaque étape ; tests API sur auth, produits, commandes, webhooks, téléchargements.
- **Langue** : interface, messages d'erreur et e-mails 100 % en français.

---

## 8. Déploiement (proposition)

| Composant  | Service                        | Remarque                 |
| ---------- | ------------------------------ | ------------------------ |
| Frontend   | Vercel ou Netlify              | Build Vite statique      |
| API        | Railway ou Render              | Node 20, variables d'env |
| PostgreSQL | Neon ou Railway                | Sauvegardes automatiques |
| Fichiers   | Cloudflare R2                  | via `STORAGE_DRIVER=s3`  |
| Domaine    | ex. `excelhub.africa` ou `.ci` | HTTPS partout            |

CI GitHub Actions : sur chaque push/PR → install, lint, format:check, tests, build. Déploiement automatique de `main` après succès.

---

## 9. Roadmap de développement (ordre des tâches pour Claude Code)

Chaque phase doit se terminer par : lint + build verts, tests de la phase verts, et un commit dédié.

**Phase 0 — Mise en route (déjà livrée en grande partie)**
Vérifier l'installation, exécuter la migration initiale (`prisma migrate dev --name init`) et le seed, confirmer que le catalogue s'affiche depuis l'API. Trancher la question Tailwind (retirer la dépendance si le CSS custom est conservé).

**Phase 1 — Auth frontend**
AuthContext, pages connexion/inscription, intercepteur axios avec refresh automatique, menu compte. Passer le refresh token en cookie httpOnly côté API.

**Phase 2 — Back-office admin (priorité de l'administrateur)**
Layout `/admin` protégé, liste produits, formulaire création/édition avec upload drag-and-drop, toggle publication, suppression avec confirmation. C'est la phase qui répond au besoin « ajouter de nouvelles fiches Excel ».

**Phase 3 — Panier et commandes**
CartContext, page panier, création de commande côté API, page récapitulatif.

**Phase 4 — Paiement CinetPay (sandbox puis production)**
lib/payment.ts, initiation, webhook idempotent, page de confirmation, génération des DownloadToken.

**Phase 5 — Livraison et espace client**
Route de téléchargement sécurisée, page « Mes achats », régénération de liens, e-mails transactionnels.

**Phase 6 — Back-office étendu**
Tableau de bord chiffré, commandes, clients, journal d'actions.

**Phase 7 — Durcissement et mise en production**
helmet + rate limiting, tests complets, CI GitHub Actions, stockage R2, pages légales, déploiement, changement des secrets, tests de bout en bout en conditions réelles avec un vrai paiement Mobile Money de faible montant.

---

## 10. Conventions de travail avec Claude Code

À placer dans un fichier `CLAUDE.md` à la racine du dépôt :

```markdown
# ExcelHub Africa — Instructions projet

## Contexte

Marketplace de fichiers Excel de gestion pour PME africaines (FCFA, Mobile Money).
Monorepo npm workspaces : apps/frontend (React 19 + Vite) et apps/backend
(Express 5 + Prisma + PostgreSQL). Tout le produit est en français.

## Commandes

- npm run dev # front (5173) + API (4000)
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
```

Conseil d'usage : lancer Claude Code phase par phase (« Implémente la Phase 2 du cahier des charges »), relire le diff, tester manuellement, committer, puis passer à la phase suivante. Éviter de demander plusieurs phases d'un coup.

---

## 11. Critères de réussite du projet

1. Un client peut découvrir, payer en Mobile Money et télécharger un outil en moins de 5 minutes, depuis un téléphone.
2. L'administrateur peut publier un nouveau fichier Excel en moins de 2 minutes sans aucune intervention technique.
3. Aucun fichier payant n'est accessible sans achat valide.
4. La plateforme tient une coupure de l'API de paiement sans corrompre les commandes (webhooks idempotents, statuts fiables).
5. Lint, tests et build passent en continu sur `main`.
