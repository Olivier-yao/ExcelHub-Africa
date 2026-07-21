import { Link, useParams } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { SiteFooter } from '../components/SiteFooter';
import { formatFcfa } from '../data/offers';
import { useOffer } from '../hooks/useOffers';
import { NotFoundPage } from './NotFoundPage';

export function OfferDetailPage() {
  const { offerSlug } = useParams();
  const { data: offer, isLoading } = useOffer(offerSlug);

  if (!offer) {
    return isLoading ? null : <NotFoundPage />;
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
          <section className="detail-content" aria-labelledby="offer-title">
            <p className="kicker">{offer.category}</p>
            <h1 id="offer-title">{offer.name}</h1>
            <p className="detail-description">{offer.description}</p>
            <p className="secure-note">
              ✓ Paiement sécurisé &nbsp; · &nbsp; Accès immédiat après paiement
            </p>
          </section>
        </div>
        <section className="page-section">
          <div className="section-heading">
            <div>
              <p className="kicker">Choisissez votre outil</p>
              <h2>Plusieurs fichiers Excel disponibles dans cette catégorie.</h2>
            </div>
          </div>
          <div className="product-grid">
            {offer.products.map((product) => (
              <Link
                key={product.slug}
                to={`/produits/${offer.slug}/${product.slug}`}
                className="product-card"
              >
                <div className={`product-preview ${offer.color}`}>
                  <span className="product-tag">{offer.tag}</span>
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
                  <p>{offer.category}</p>
                  <h3>{product.name}</h3>
                  <span>{product.description}</span>
                  <div className="product-bottom">
                    <strong>{formatFcfa(product.priceFcfa)}</strong>
                    <span aria-hidden="true">↗</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
