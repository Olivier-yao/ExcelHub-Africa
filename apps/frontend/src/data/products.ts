export type Product = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  priceFcfa: number;
  tag: string;
  color: string;
  description: string;
  features: string[];
};

export const categories = ['Tous', 'Commerce', 'Finance', 'Pharmacie', 'Éducation'];

export function formatFcfa(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} FCFA`;
}

/**
 * Donnees de secours affichees si l'API est indisponible.
 * La source de verite est la base de donnees (table Product).
 */
export const fallbackProducts: Product[] = [
  {
    slug: 'gestion-boutique-pro',
    name: 'Gestion Boutique Pro',
    category: 'Commerce',
    priceFcfa: 5000,
    tag: 'Populaire',
    color: 'emerald',
    description: 'Ventes, stock, dépenses et tableau de bord dans un seul fichier.',
    features: [
      'Tableau de bord automatisé',
      'Suivi des ventes et dépenses',
      'Alertes de stock',
    ],
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
      'Multi-opérateurs Mobile Money',
      'Calcul automatique des commissions',
      'Suivi de trésorerie',
    ],
  },
  {
    slug: 'suivi-stock-pharmacie',
    name: 'Suivi Stock Pharmacie',
    category: 'Pharmacie',
    priceFcfa: 15000,
    tag: 'Pro',
    color: 'blue',
    description: 'Lots, dates d’expiration et alertes de stock faible.',
    features: ['Gestion des lots', 'Alertes d’expiration', 'Inventaire en temps réel'],
  },
  {
    slug: 'comptabilite-simplifiee',
    name: 'Comptabilité Simplifiée',
    category: 'Finance',
    priceFcfa: 15000,
    tag: 'Essentiel',
    color: 'violet',
    description: 'Recettes, dépenses, trésorerie et résultat net lisibles.',
    features: ['Journal des opérations', 'Résultat mensuel', 'Suivi de trésorerie'],
  },
  {
    slug: 'gestion-ecole',
    name: 'Gestion École',
    category: 'Éducation',
    priceFcfa: 25000,
    tag: 'Pro',
    color: 'rose',
    description: 'Élèves, paiements, notes et suivi administratif.',
    features: ['Gestion des élèves', 'Suivi des paiements', 'Bulletins simplifiés'],
  },
  {
    slug: 'suivi-restaurant',
    name: 'Suivi Restaurant',
    category: 'Commerce',
    priceFcfa: 5000,
    tag: 'Simple',
    color: 'orange',
    description: 'Coûts, ventes et profits journaliers à portée de main.',
    features: ['Coût des matières', 'Ventes quotidiennes', 'Marge par période'],
  },
];
