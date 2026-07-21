import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const offers = [
  {
    slug: 'commerce',
    name: 'Commerce',
    category: 'Commerce',
    tag: 'Populaire',
    color: 'emerald',
    description: 'Ventes, stock et depenses au quotidien pour boutiques et restaurants.',
    published: true,
    products: [
      {
        slug: 'gestion-boutique-pro',
        name: 'Gestion Boutique Pro',
        priceFcfa: 5000,
        description: 'Ventes, stock, depenses et tableau de bord dans un seul fichier.',
        features: [
          'Tableau de bord automatise',
          'Suivi des ventes et depenses',
          'Alertes de stock',
        ],
        published: true,
        variants: [
          {
            name: 'Vert Emeraude',
            color: 'emerald',
            description: 'Palette verte apaisante, ideale pour un tableau de bord clair.',
            published: true,
          },
          {
            name: 'Bleu Ocean',
            color: 'blue',
            description: 'Palette bleue sobre pour une presentation professionnelle.',
            published: true,
          },
        ],
      },
      {
        slug: 'suivi-restaurant',
        name: 'Suivi Restaurant',
        priceFcfa: 5000,
        description: 'Couts, ventes et profits journaliers a portee de main.',
        features: ['Cout des matieres', 'Ventes quotidiennes', 'Marge par periode'],
        published: true,
        variants: [
          {
            name: 'Orange Chaleureux',
            color: 'orange',
            description: 'Palette orange conviviale, adaptee a la restauration.',
            published: true,
          },
          {
            name: 'Gris Minimaliste',
            color: 'slate',
            description: 'Presentation epuree, sans distraction visuelle.',
            published: true,
          },
        ],
      },
    ],
  },
  {
    slug: 'finance',
    name: 'Finance',
    category: 'Finance',
    tag: 'Nouveau',
    color: 'amber',
    description: 'Flux financiers, tresorerie et resultat net sous controle.',
    published: true,
    products: [
      {
        slug: 'caisse-mobile-money',
        name: 'Caisse Mobile Money',
        priceFcfa: 8500,
        description: 'Suivez vos flux Orange, MTN, Moov et vos commissions.',
        features: [
          'Multi-operateurs Mobile Money',
          'Calcul automatique des commissions',
          'Suivi de tresorerie',
        ],
        published: true,
        variants: [
          {
            name: 'Ambre Classique',
            color: 'amber',
            description: 'Presentation ambree, proche des codes Mobile Money.',
            published: true,
          },
          {
            name: 'Vert Nature',
            color: 'emerald',
            description: 'Variante verte pour une lecture plus reposante.',
            published: true,
          },
        ],
      },
      {
        slug: 'comptabilite-simplifiee',
        name: 'Comptabilite Simplifiee',
        priceFcfa: 15000,
        description: 'Recettes, depenses, tresorerie et resultat net lisibles.',
        features: ['Journal des operations', 'Resultat mensuel', 'Suivi de tresorerie'],
        published: true,
        variants: [
          {
            name: 'Violet Elegant',
            color: 'violet',
            description: 'Presentation soignee pour un rendu premium.',
            published: true,
          },
          {
            name: 'Bleu Corporate',
            color: 'blue',
            description: 'Palette bleue classique, adaptee aux rapports formels.',
            published: true,
          },
        ],
      },
    ],
  },
  {
    slug: 'pharmacie',
    name: 'Pharmacie',
    category: 'Pharmacie',
    tag: 'Pro',
    color: 'blue',
    description: 'Lots, dates d’expiration et alertes de stock faible.',
    published: true,
    products: [
      {
        slug: 'suivi-stock-pharmacie',
        name: 'Suivi Stock Pharmacie',
        priceFcfa: 15000,
        description: 'Lots, dates d’expiration et alertes de stock faible.',
        features: [
          'Gestion des lots',
          'Alertes d’expiration',
          'Inventaire en temps reel',
        ],
        published: true,
        variants: [
          {
            name: 'Bleu Medical',
            color: 'blue',
            description: 'Palette bleue rassurante, codes visuels du secteur medical.',
            published: true,
          },
          {
            name: 'Vert Pharmacie',
            color: 'emerald',
            description: 'Variante verte, alternative lisible et contrastee.',
            published: true,
          },
        ],
      },
    ],
  },
  {
    slug: 'education',
    name: 'Education',
    category: 'Education',
    tag: 'Pro',
    color: 'rose',
    description: 'Eleves, paiements et suivi administratif centralise.',
    published: true,
    products: [
      {
        slug: 'gestion-ecole',
        name: 'Gestion Ecole',
        priceFcfa: 25000,
        description: 'Eleves, paiements, notes et suivi administratif.',
        features: ['Gestion des eleves', 'Suivi des paiements', 'Bulletins simplifies'],
        published: true,
        variants: [
          {
            name: 'Rose Ludique',
            color: 'rose',
            description: 'Presentation chaleureuse, adaptee au primaire.',
            published: true,
          },
          {
            name: 'Bleu Scolaire',
            color: 'blue',
            description: 'Presentation sobre, adaptee au secondaire.',
            published: true,
          },
        ],
      },
    ],
  },
];

async function main() {
  for (const { products, ...offer } of offers) {
    const savedOffer = await prisma.offer.upsert({
      where: { slug: offer.slug },
      update: offer,
      create: offer,
    });

    for (const { variants, ...product } of products) {
      const savedProduct = await prisma.product.upsert({
        where: { slug: product.slug },
        update: { ...product, offerId: savedOffer.id },
        create: { ...product, offerId: savedOffer.id },
      });

      await prisma.productVariant.deleteMany({ where: { productId: savedProduct.id } });
      await prisma.productVariant.createMany({
        data: variants.map((variant) => ({ ...variant, productId: savedProduct.id })),
      });
    }
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
