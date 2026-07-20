import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products = [
  {
    slug: 'gestion-boutique-pro',
    name: 'Gestion Boutique Pro',
    category: 'Commerce',
    priceFcfa: 5000,
    tag: 'Populaire',
    color: 'emerald',
    description: 'Ventes, stock, depenses et tableau de bord dans un seul fichier.',
    features: [
      'Tableau de bord automatise',
      'Suivi des ventes et depenses',
      'Alertes de stock',
    ],
    published: true,
  },
  {
    slug: 'caisse-mobile-money',
    name: 'Caisse Mobile Money',
    category: 'Finance',
    priceFcfa: 8500,
    tag: 'Nouveau',
    color: 'amber',
    description: 'Suivez vos flux Orange, MTN, Moov et vos commissions.',
    features: [
      'Multi-operateurs Mobile Money',
      'Calcul automatique des commissions',
      'Suivi de tresorerie',
    ],
    published: true,
  },
  {
    slug: 'suivi-stock-pharmacie',
    name: 'Suivi Stock Pharmacie',
    category: 'Pharmacie',
    priceFcfa: 15000,
    tag: 'Pro',
    color: 'blue',
    description: 'Lots, dates d\u2019expiration et alertes de stock faible.',
    features: ['Gestion des lots', 'Alertes d\u2019expiration', 'Inventaire en temps reel'],
    published: true,
  },
  {
    slug: 'comptabilite-simplifiee',
    name: 'Comptabilite Simplifiee',
    category: 'Finance',
    priceFcfa: 15000,
    tag: 'Essentiel',
    color: 'violet',
    description: 'Recettes, depenses, tresorerie et resultat net lisibles.',
    features: ['Journal des operations', 'Resultat mensuel', 'Suivi de tresorerie'],
    published: true,
  },
  {
    slug: 'gestion-ecole',
    name: 'Gestion Ecole',
    category: 'Education',
    priceFcfa: 25000,
    tag: 'Pro',
    color: 'rose',
    description: 'Eleves, paiements, notes et suivi administratif.',
    features: ['Gestion des eleves', 'Suivi des paiements', 'Bulletins simplifies'],
    published: true,
  },
  {
    slug: 'suivi-restaurant',
    name: 'Suivi Restaurant',
    category: 'Commerce',
    priceFcfa: 5000,
    tag: 'Simple',
    color: 'orange',
    description: 'Couts, ventes et profits journaliers a portee de main.',
    features: ['Cout des matieres', 'Ventes quotidiennes', 'Marge par periode'],
    published: true,
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@excelhub.africa';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMoi!2026';
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: 'ADMIN' },
    create: {
      email: adminEmail,
      name: 'Administrateur',
      role: 'ADMIN',
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });

  console.info('Seed termine. Admin:', adminEmail);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
