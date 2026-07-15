import { useMemo, useState } from 'react';
import { Link, Route, Routes, useParams } from 'react-router-dom';

type Product = {
  category: string;
  color: string;
  description: string;
  name: string;
  price: string;
  slug: string;
  tag: string;
  features: string[];
};

const products: Product[] = [
  {
    slug: 'gestion-boutique-pro',
    name: 'Gestion Boutique Pro',
    category: 'Commerce',
    price: '5 000 FCFA',
    tag: 'Populaire',
    color: 'emerald',
    description: 'Ventes, stock, dépenses et tableau de bord dans un seul fichier.',
    features: ['Tableau de bord automatisé', 'Suivi des ventes et dépenses', 'Alertes de stock'],
  },
  {
    slug: 'caisse-mobile-money',
    name: 'Caisse Mobile Money',
    category: 'Finance',
    price: '8 500 FCFA',
    tag: 'Nouveau',
    color: 'amber',
    description: 'Suivez vos flux Orange, MTN, Moov et vos commissions.',
    features: ['Multi-opérateurs Mobile Money', 'Calcul automatique des commissions', 'Suivi de trésorerie'],
  },
  {
    slug: 'suivi-stock-pharmacie',
    name: 'Suivi Stock Pharmacie',
    category: 'Pharmacie',
    price: '15 000 FCFA',
    tag: 'Pro',
    color: 'blue',
    description: 'Lots, dates d’expiration et alertes de stock faible.',
    features: ['Gestion des lots', 'Alertes d’expiration', 'Inventaire en temps réel'],
  },
  {
    slug: 'comptabilite-simplifiee',
    name: 'Comptabilité Simplifiée',
    category: 'Finance',
    price: '15 000 FCFA',
    tag: 'Essentiel',
    color: 'violet',
    description: 'Recettes, dépenses, trésorerie et résultat net lisibles.',
    features: ['Journal des opérations', 'Résultat mensuel', 'Suivi de trésorerie'],
  },
  {
    slug: 'gestion-ecole',
    name: 'Gestion École',
    category: 'Éducation',
    price: '25 000 FCFA',
    tag: 'Pro',
    color: 'rose',
    description: 'Élèves, paiements, notes et suivi administratif.',
    features: ['Gestion des élèves', 'Suivi des paiements', 'Bulletins simplifiés'],
  },
  {
    slug: 'suivi-restaurant',
    name: 'Suivi Restaurant',
    category: 'Commerce',
    price: '5 000 FCFA',
    tag: 'Simple',
    color: 'orange',
    description: 'Coûts, ventes et profits journaliers à portée de main.',
    features: ['Coût des matières', 'Ventes quotidiennes', 'Marge par période'],
  },
];

const categories = ['Tous', 'Commerce', 'Finance', 'Pharmacie', 'Éducation'];

function ArrowIcon() {
  return <span aria-hidden="true">→</span>;
}

function Logo() {
  return (
    <Link to="/" className="brand" aria-label="ExcelHub Africa, accueil">
      <span className="brand-mark">X</span>
      <span>
        ExcelHub <b>Africa</b>
      </span>
    </Link>
  );
}

function HomePage() {
  const [activeCategory, setActiveCategory] = useState('Tous');
  const displayedProducts = useMemo(
    () =>
      activeCategory === 'Tous'
        ? products
        : products.filter((product) => product.category === activeCategory),
    [activeCategory],
  );

  return (
    <div className="site-shell">
      <header className="navbar">
        <Logo />
        <nav aria-label="Navigation principale">
          <a href="#catalogue">Catalogue</a>
          <a href="#comment-ca-marche">Comment ça marche</a>
          <a href="#pourquoi">Pourquoi nous</a>
        </nav>
        <div className="nav-actions">
          <button className="link-button" type="button">
            Se connecter
          </button>
          <a className="button button-small" href="#catalogue">
            Explorer
          </a>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="kicker">
              <span className="status-dot" /> Conçu pour les PME africaines
            </p>
            <h1 id="hero-title">
              Pilotez votre activité. <em>Simplement.</em>
            </h1>
            <p className="hero-lead">
              Des outils Excel professionnels, prêts à l’emploi et adaptés à la réalité de
              votre business.
            </p>
            <div className="hero-actions">
              <a className="button" href="#catalogue">
                Explorer le catalogue <ArrowIcon />
              </a>
              <button className="watch-link" type="button">
                <span className="play">▶</span> Voir comment ça marche
              </button>
            </div>
            <div className="hero-proof">
              <div className="avatars" aria-hidden="true">
                <span>AK</span>
                <span>SM</span>
                <span>CN</span>
              </div>
              <p>
                <strong>+1 200 entrepreneurs</strong>
                <br />
                organisent déjà leur activité.
              </p>
            </div>
          </div>

          <div className="hero-visual" aria-label="Aperçu d’un tableau de bord ExcelHub">
            <div className="glow glow-one" />
            <div className="glow glow-two" />
            <div className="dashboard-card">
              <div className="dashboard-head">
                <span>
                  <i /> Résumé de l’activité
                </span>
                <b>•••</b>
              </div>
              <div className="metrics">
                <div>
                  <small>Ventes du mois</small>
                  <strong>
                    2 450 000 <small>FCFA</small>
                  </strong>
                  <em>↗ +18,4%</em>
                </div>
                <div className="metric-ring">
                  72<small>%</small>
                </div>
              </div>
              <div className="chart">
                <div className="chart-label">
                  <span>Revenus</span>
                  <b>Cette semaine⌄</b>
                </div>
                <svg viewBox="0 0 360 104" role="img" aria-label="Graphique des revenus">
                  <path
                    d="M0 95 C25 88 28 70 48 75 S70 60 86 65 S115 50 132 58 S157 32 178 45 S212 22 235 34 S260 14 278 22 S310 5 360 10 V104 H0Z"
                    fill="url(#fill)"
                  />
                  <path
                    d="M0 95 C25 88 28 70 48 75 S70 60 86 65 S115 50 132 58 S157 32 178 45 S212 22 235 34 S260 14 278 22 S310 5 360 10"
                    fill="none"
                    stroke="#1fbf75"
                    strokeWidth="3"
                  />
                  <defs>
                    <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                      <stop stopColor="#1fbf75" stopOpacity=".26" />
                      <stop offset="1" stopColor="#1fbf75" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="dashboard-footer">
                <span>Dernières ventes</span>
                <span className="mini-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </div>
            <div className="floating-card">
              <span className="check">✓</span>
              <div>
                <small>Objectif mensuel</small>
                <strong>72% atteint</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Avantages ExcelHub Africa">
          <p>
            <b>Adapté localement</b>
            <span>FCFA, Mobile Money, réalités terrain</span>
          </p>
          <p>
            <b>Prêt à l’emploi</b>
            <span>Téléchargez, ouvrez, commencez</span>
          </p>
          <p>
            <b>Support humain</b>
            <span>Nous restons à vos côtés</span>
          </p>
        </section>

        <section
          className="catalogue section"
          id="catalogue"
          aria-labelledby="catalogue-title"
        >
          <div className="section-heading">
            <div>
              <p className="kicker">Nos solutions</p>
              <h2 id="catalogue-title">Un outil pour chaque ambition.</h2>
            </div>
            <a href="#catalogue" className="text-link">
              Voir tout le catalogue <ArrowIcon />
            </a>
          </div>
          <div
            className="category-tabs"
            role="tablist"
            aria-label="Filtrer les solutions"
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeCategory === category}
                className={activeCategory === category ? 'active' : ''}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {displayedProducts.map((product) => (
              <article className="product-card" key={product.name}>
                <div className={`product-preview ${product.color}`}>
                  <span className="product-tag">{product.tag}</span>
                  <div className="sheet">
                    <div className="sheet-top">
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="sheet-columns">
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="sheet-chart">
                      <i />
                      <i />
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                </div>
                <div className="product-content">
                  <p>{product.category}</p>
                  <h3>{product.name}</h3>
                  <span>{product.description}</span>
                  <div className="product-bottom">
                    <strong>{product.price}</strong>
                    <Link to={`/produits/${product.slug}`} aria-label={`Voir ${product.name}`}>
                      ↗
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className="steps section"
          id="comment-ca-marche"
          aria-labelledby="steps-title"
        >
          <div className="section-heading">
            <div>
              <p className="kicker">Simple par nature</p>
              <h2 id="steps-title">De l’achat à la maîtrise, en quelques minutes.</h2>
            </div>
          </div>
          <div className="steps-grid">
            <article>
              <span>01</span>
              <h3>Choisissez</h3>
              <p>Trouvez l’outil conçu pour votre métier.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Téléchargez</h3>
              <p>Paiement sécurisé, accès immédiat à votre fichier.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Pilotez</h3>
              <p>Une gestion claire, dès la première utilisation.</p>
            </article>
          </div>
        </section>

        <section className="cta-section" id="pourquoi">
          <p className="kicker">Votre business mérite mieux</p>
          <h2>
            Moins de chaos.
            <br />
            <em>Plus de contrôle.</em>
          </h2>
          <a className="button button-light" href="#catalogue">
            Trouver mon outil <ArrowIcon />
          </a>
        </section>
      </main>
      <footer>
        <Logo />
        <p>© 2026 ExcelHub Africa. Vos outils de gestion prêts à l’emploi.</p>
      </footer>
    </div>
  );
}

function ProductDetailPage() {
  const { slug } = useParams();
  const product = products.find((item) => item.slug === slug);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <div className="site-shell">
      <header className="navbar">
        <Logo />
        <Link className="back-link" to="/#catalogue">← Retour au catalogue</Link>
      </header>
      <main className="product-page">
        <div className="product-breadcrumb"><Link to="/">Accueil</Link><span>/</span><Link to="/#catalogue">Catalogue</Link><span>/</span><b>{product.name}</b></div>
        <div className="detail-grid">
          <div className={`detail-preview product-preview ${product.color}`}>
            <span className="product-tag">{product.tag}</span>
            <div className="detail-sheet"><div className="sheet-top"><i /><i /><i /></div><div className="sheet-columns"><span /><span /><span /><span /></div><div className="sheet-chart"><i /><i /><i /><i /><i /></div></div>
            <span className="excel-badge">XLSX</span>
          </div>
          <section className="detail-content" aria-labelledby="product-title">
            <p className="kicker">{product.category}</p>
            <h1 id="product-title">{product.name}</h1>
            <p className="detail-description">{product.description} Gagnez du temps et prenez vos décisions avec des chiffres clairs.</p>
            <p className="detail-price">{product.price}</p>
            <button className="button detail-button" type="button" onClick={() => setAddedToCart(true)}>{addedToCart ? 'Ajouté au panier ✓' : 'Ajouter au panier'} <ArrowIcon /></button>
            {addedToCart && <p className="cart-feedback" role="status">Produit ajouté. Le paiement sécurisé sera connecté à la prochaine phase.</p>}
            <p className="secure-note">✓ Paiement sécurisé &nbsp; · &nbsp; Accès immédiat après paiement</p>
          </section>
        </div>
        <section className="included-section">
          <div><p className="kicker">Dans votre outil</p><h2>Tout ce qu’il faut pour démarrer.</h2></div>
          <ul>{product.features.map((feature) => <li key={feature}><span>✓</span>{feature}</li>)}</ul>
          <ul><li><span>✓</span>Fichier Excel prêt à utiliser</li><li><span>✓</span>Guide de prise en main</li><li><span>✓</span>Support de démarrage</li></ul>
        </section>
      </main>
      <footer><Logo /><p>© 2026 ExcelHub Africa. Vos outils de gestion prêts à l’emploi.</p></footer>
    </div>
  );
}

function NotFoundPage() {
  return (
    <main className="not-found">
      <Logo />
      <h1>Cette page n’existe pas.</h1>
      <Link className="button" to="/">
        Retour à l’accueil
      </Link>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/produits/:slug" element={<ProductDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
