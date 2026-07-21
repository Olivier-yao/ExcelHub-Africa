import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowIcon } from '../components/ArrowIcon';
import { Logo } from '../components/Logo';
import { SiteFooter } from '../components/SiteFooter';
import { formatFcfa } from '../data/offers';
import { useOffer } from '../hooks/useOffers';
import { NotFoundPage } from './NotFoundPage';

export function OfferDetailPage() {
  const { slug } = useParams();
  const { data: offer, isLoading } = useOffer(slug);
  const [selectedSlug, setSelectedSlug] = useState<string>();
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setSelectedSlug(undefined);
    setAddedToCart(false);
  }, [slug]);

  if (!offer) {
    return isLoading ? null : <NotFoundPage />;
  }

  const selectedProduct =
    offer.products.find((product) => product.slug === selectedSlug) ?? offer.products[0];

  if (!selectedProduct) {
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
          <b>{offer.name}</b>
        </div>
        <div className="detail-grid">
          <div className={`detail-preview product-preview ${offer.color}`}>
            <span className="product-tag">{offer.tag}</span>
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
            <p className="kicker">{offer.category}</p>
            <h1 id="product-title">{selectedProduct.name}</h1>
            <p className="detail-description">{selectedProduct.description}</p>

            {offer.products.length > 1 && (
              <div
                className="offer-options"
                role="radiogroup"
                aria-label="Choisir un outil"
              >
                {offer.products.map((product) => (
                  <button
                    key={product.slug}
                    type="button"
                    role="radio"
                    aria-checked={product.slug === selectedProduct.slug}
                    className={
                      product.slug === selectedProduct.slug
                        ? 'offer-option active'
                        : 'offer-option'
                    }
                    onClick={() => {
                      setSelectedSlug(product.slug);
                      setAddedToCart(false);
                    }}
                  >
                    <span>{product.name}</span>
                    <small>{formatFcfa(product.priceFcfa)}</small>
                  </button>
                ))}
              </div>
            )}

            <p className="detail-price">{formatFcfa(selectedProduct.priceFcfa)}</p>
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
            {selectedProduct.features.map((feature) => (
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
