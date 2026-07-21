import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { SiteFooter } from '../components/SiteFooter';
import { formatFcfa } from '../data/offers';
import { useOffer } from '../hooks/useOffers';
import { NotFoundPage } from './NotFoundPage';

export function ProductVariantsPage() {
  const { offerSlug, productSlug } = useParams();
  const { data: offer, isLoading } = useOffer(offerSlug);
  const [addedVariantId, setAddedVariantId] = useState<string>();

  if (!offer) {
    return isLoading ? null : <NotFoundPage />;
  }

  const product = offer.products.find((item) => item.slug === productSlug);
  if (!product) {
    return <NotFoundPage />;
  }

  return (
    <div className="site-shell">
      <header className="navbar">
        <Logo />
        <Link className="back-link" to={`/produits/${offer.slug}`}>
          ← Retour à {offer.name}
        </Link>
      </header>
      <main className="product-page">
        <div className="product-breadcrumb">
          <Link to="/">Accueil</Link>
          <span>/</span>
          <Link to="/#catalogue">Catalogue</Link>
          <span>/</span>
          <Link to={`/produits/${offer.slug}`}>{offer.name}</Link>
          <span>/</span>
          <b>{product.name}</b>
        </div>

        <section aria-labelledby="tool-title">
          <p className="kicker">{offer.category}</p>
          <h1 id="tool-title">{product.name}</h1>
          <p className="detail-description">{product.description}</p>
          <p className="detail-price">{formatFcfa(product.priceFcfa)}</p>
        </section>

        <section className="page-section">
          <div className="section-heading">
            <div>
              <p className="kicker">Choisissez votre présentation</p>
              <h2>Plusieurs fichiers disponibles pour cet outil.</h2>
            </div>
          </div>
          <div className="variant-grid">
            {product.variants.map((variant) => (
              <article key={variant.id ?? variant.name} className="variant-card">
                <Link
                  className="variant-card-link"
                  to={`/produits/${offer.slug}/${product.slug}/${variant.slug}`}
                >
                  <div className={`product-preview ${variant.color}`}>
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
                    <span className="excel-badge">XLSX</span>
                  </div>
                  <div className="variant-card-content">
                    <h3>{variant.name}</h3>
                    {variant.description && <p>{variant.description}</p>}
                    <dl className="variant-meta">
                      <div>
                        <dt>Feuilles</dt>
                        <dd>{variant.sheetCount}</dd>
                      </div>
                    </dl>
                  </div>
                </Link>
                <div className="variant-card-actions">
                  {variant.howToUse && (
                    <p className="variant-how-to">
                      <strong>Comment l’utiliser :</strong> {variant.howToUse}
                    </p>
                  )}
                  <button
                    className="button button-small"
                    type="button"
                    onClick={() => setAddedVariantId(variant.id)}
                  >
                    {addedVariantId === variant.id
                      ? 'Ajouté au panier ✓'
                      : 'Ajouter au panier'}
                  </button>
                </div>
              </article>
            ))}
          </div>
          {addedVariantId && (
            <p className="cart-feedback" role="status">
              Produit ajouté. Le paiement sécurisé sera connecté à la prochaine phase.
            </p>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
