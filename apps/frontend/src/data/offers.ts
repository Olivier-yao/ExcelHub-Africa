export type ProductVariant = {
  id?: string;
  name: string;
  color: string;
  description?: string;
  sheetCount: number;
  howToUse?: string;
};

export type OfferProduct = {
  id?: string;
  slug: string;
  name: string;
  priceFcfa: number;
  description: string;
  features: string[];
  variants: ProductVariant[];
};

export type Offer = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  tag: string;
  color: string;
  description: string;
  products: OfferProduct[];
};

export const categories = ['Tous', 'Commerce', 'Finance', 'Pharmacie', 'Education'];

export function formatFcfa(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
}

export function priceRange(offer: Offer): string {
  const prices = offer.products.map((product) => product.priceFcfa);
  if (prices.length === 0) {
    return '';
  }
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatFcfa(min) : `${formatFcfa(min)} – ${formatFcfa(max)}`;
}

/**
 * Donnees de secours affichees si l'API est indisponible.
 * La source de verite est la base de donnees (tables Offer et Product).
 */
export const fallbackOffers: Offer[] = [
  {
    slug: 'commerce',
    name: 'Commerce',
    category: 'Commerce',
    tag: 'Populaire',
    color: 'emerald',
    description: 'Ventes, stock et dépenses au quotidien pour boutiques et restaurants.',
    products: [
      {
        slug: 'gestion-boutique-pro',
        name: 'Gestion Boutique Pro',
        priceFcfa: 5000,
        description: 'Ventes, stock, dépenses et tableau de bord dans un seul fichier.',
        features: [
          'Tableau de bord automatisé',
          'Suivi des ventes et dépenses',
          'Alertes de stock',
        ],
        variants: [
          {
            name: 'Vert Émeraude',
            color: 'emerald',
            description: 'Palette verte apaisante, idéale pour un tableau de bord clair.',
            sheetCount: 4,
            howToUse:
              "Ouvrez le fichier, renseignez vos ventes du jour dans l'onglet Ventes, le tableau de bord se met à jour automatiquement.",
          },
          {
            name: 'Bleu Océan',
            color: 'blue',
            description: 'Palette bleue sobre pour une présentation professionnelle.',
            sheetCount: 4,
            howToUse:
              'Même structure que la version verte, avec une palette bleue adaptée à une identité visuelle plus formelle.',
          },
        ],
      },
      {
        slug: 'suivi-restaurant',
        name: 'Suivi Restaurant',
        priceFcfa: 5000,
        description: 'Coûts, ventes et profits journaliers à portée de main.',
        features: ['Coût des matières', 'Ventes quotidiennes', 'Marge par période'],
        variants: [
          {
            name: 'Orange Chaleureux',
            color: 'orange',
            description: 'Palette orange conviviale, adaptée à la restauration.',
            sheetCount: 3,
            howToUse:
              'Renseignez vos achats et ventes du jour, la marge se calcule automatiquement en fin de journée.',
          },
          {
            name: 'Gris Minimaliste',
            color: 'slate',
            description: 'Présentation épurée, sans distraction visuelle.',
            sheetCount: 3,
            howToUse:
              'Même usage que la version orange, avec une présentation plus neutre.',
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
    description: 'Flux financiers, trésorerie et résultat net sous contrôle.',
    products: [
      {
        slug: 'caisse-mobile-money',
        name: 'Caisse Mobile Money',
        priceFcfa: 8500,
        description: 'Suivez vos flux Orange, MTN, Moov et vos commissions.',
        features: [
          'Multi-opérateurs Mobile Money',
          'Calcul automatique des commissions',
          'Suivi de trésorerie',
        ],
        variants: [
          {
            name: 'Ambre Classique',
            color: 'amber',
            description: 'Présentation ambrée, proche des codes Mobile Money.',
            sheetCount: 5,
            howToUse:
              'Un onglet par opérateur, saisissez chaque dépôt et retrait, les commissions se calculent seules.',
          },
          {
            name: 'Vert Nature',
            color: 'emerald',
            description: 'Variante verte pour une lecture plus reposante.',
            sheetCount: 5,
            howToUse: 'Même fonctionnement que la version ambrée, palette verte.',
          },
        ],
      },
      {
        slug: 'comptabilite-simplifiee',
        name: 'Comptabilité Simplifiée',
        priceFcfa: 15000,
        description: 'Recettes, dépenses, trésorerie et résultat net lisibles.',
        features: ['Journal des opérations', 'Résultat mensuel', 'Suivi de trésorerie'],
        variants: [
          {
            name: 'Violet Élégant',
            color: 'violet',
            description: 'Présentation soignée pour un rendu premium.',
            sheetCount: 6,
            howToUse:
              "Saisissez chaque opération dans le journal, le résultat mensuel se met à jour dans l'onglet Synthèse.",
          },
          {
            name: 'Bleu Corporate',
            color: 'blue',
            description: 'Palette bleue classique, adaptée aux rapports formels.',
            sheetCount: 6,
            howToUse: 'Même usage que la version violette, présentation plus sobre.',
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
    products: [
      {
        slug: 'suivi-stock-pharmacie',
        name: 'Suivi Stock Pharmacie',
        priceFcfa: 15000,
        description: 'Lots, dates d’expiration et alertes de stock faible.',
        features: [
          'Gestion des lots',
          'Alertes d’expiration',
          'Inventaire en temps réel',
        ],
        variants: [
          {
            name: 'Bleu Médical',
            color: 'blue',
            description: 'Palette bleue rassurante, codes visuels du secteur médical.',
            sheetCount: 4,
            howToUse:
              "Ajoutez chaque lot reçu avec sa date d'expiration, les alertes de stock faible apparaissent automatiquement.",
          },
          {
            name: 'Vert Pharmacie',
            color: 'emerald',
            description: 'Variante verte, alternative lisible et contrastée.',
            sheetCount: 4,
            howToUse: 'Même usage que la version bleue, palette verte.',
          },
        ],
      },
    ],
  },
  {
    slug: 'education',
    name: 'Éducation',
    category: 'Education',
    tag: 'Pro',
    color: 'rose',
    description: 'Élèves, paiements et suivi administratif centralisé.',
    products: [
      {
        slug: 'gestion-ecole',
        name: 'Gestion École',
        priceFcfa: 25000,
        description: 'Élèves, paiements, notes et suivi administratif.',
        features: ['Gestion des élèves', 'Suivi des paiements', 'Bulletins simplifiés'],
        variants: [
          {
            name: 'Rose Ludique',
            color: 'rose',
            description: 'Présentation chaleureuse, adaptée au primaire.',
            sheetCount: 5,
            howToUse:
              "Inscrivez chaque élève dans l'onglet Élèves, suivez ses paiements et ses notes dans les onglets dédiés.",
          },
          {
            name: 'Bleu Scolaire',
            color: 'blue',
            description: 'Présentation sobre, adaptée au secondaire.',
            sheetCount: 5,
            howToUse: 'Même usage que la version rose, présentation plus sobre.',
          },
        ],
      },
    ],
  },
];
