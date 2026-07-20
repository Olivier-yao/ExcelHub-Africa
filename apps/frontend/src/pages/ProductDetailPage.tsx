import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowIcon } from '../components/ArrowIcon';
import { Logo } from '../components/Logo';
import { SiteFooter } from '../components/SiteFooter';
import { formatFcfa } from '../data/products';
import { useProducts } from '../hooks/useProducts';
import { NotFoundPage } from './NotFoundPage';

export function ProductDetailPage() {
  const { slug } = useParams();
  const { data: products } = useProducts();
  const product = products.find((item) => item.slug === slug);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <div className="site-shell">
      <header className="navbar">
        <Logo />
        <Link className="back-link" to="/#catalogue">
          ← Retour au catalogue
        </Link>
      </header>
      <main className="product-page">
        <div className="product-breadcrumb">
          <Link to="/">Accueil</Link>
          <span>/</span>
          <Link to="/#catalogue">Catalogue</Link>
          <span>/</span>
          <b>{product.name}</b>
        </div>
        <div className="detail-grid">
          <div className={`detail-preview product-preview ${product.color}`}>
            <span className="product-tag">{product.tag}</span>
            <div className="detail-sheet">
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
            <span className="excel-badge">XLSX</span>
          </div>
          <section className="detail-content" aria-labelledby="product-title">
            <p className="kicker">{product.category}</p>
            <h1 id="product-title">{product.name}</h1>
            <p className="detail-description">
              {product.description} Gagnez du temps et prenez vos décisions avec des
              chiffres clairs.
            </p>
            <p className="detail-price">{formatFcfa(product.priceFcfa)}</p>
            <button
              className="button detail-button"
              type="button"
              onClick={() => setAddedToCart(true)}
            >
              {addedToCart ? 'Ajouté au panier ✓' : 'Ajouter au panier'} <ArrowIcon />
            </button>
            {addedToCart && (
              <p className="cart-feedback" role="status">
                Produit ajouté. Le paiement sécurisé sera connecté à la prochaine phase.
              </p>
            )}
            <p className="secure-note">
              ✓ Paiement sécurisé &nbsp; · &nbsp; Accès immédiat après paiement
            </p>
          </section>
        </div>
        <section className="included-section">
          <div>
            <p className="kicker">Dans votre outil</p>
            <h2>Tout ce qu’il faut pour démarrer.</h2>
          </div>
          <ul>
            {product.features.map((feature) => (
              <li key={feature}>
                <span>✓</span>
                {feature}
              </li>
            ))}
          </ul>
          <ul>
            <li>
              <span>✓</span>Fichier Excel prêt à utiliser
            </li>
            <li>
              <span>✓</span>Guide de prise en main
            </li>
            <li>
              <span>✓</span>Support de démarrage
            </li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
