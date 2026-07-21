export type OfferProduct = {
  id?: string;
  slug: string;
  name: string;
  priceFcfa: number;
  description: string;
  features: string[];
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
      },
      {
        slug: 'suivi-restaurant',
        name: 'Suivi Restaurant',
        priceFcfa: 5000,
        description: 'Coûts, ventes et profits journaliers à portée de main.',
        features: ['Coût des matières', 'Ventes quotidiennes', 'Marge par période'],
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
      },
      {
        slug: 'comptabilite-simplifiee',
        name: 'Comptabilité Simplifiée',
        priceFcfa: 15000,
        description: 'Recettes, dépenses, trésorerie et résultat net lisibles.',
        features: ['Journal des opérations', 'Résultat mensuel', 'Suivi de trésorerie'],
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
      },
    ],
  },
];
