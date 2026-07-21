import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowIcon } from '../components/ArrowIcon';
import { Logo } from '../components/Logo';
import { SiteFooter } from '../components/SiteFooter';
import { formatFcfa } from '../data/offers';
import { useOffer } from '../hooks/useOffers';
import { NotFoundPage } from './NotFoundPage';

export function VariantDetailPage() {
  const { offerSlug, productSlug, variantSlug } = useParams();
  const { data: offer, isLoading } = useOffer(offerSlug);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!offer) {
    return isLoading ? null : <NotFoundPage />;
  }

  const product = offer.products.find((item) => item.slug === productSlug);
  const variant = product?.variants.find((item) => item.slug === variantSlug);
  if (!product || !variant) {
    return <NotFoundPage />;
  }

  return (
    <div className="site-shell">
      <header className="navbar">
        <Logo />
        <Link className="back-link" to={`/produits/${offer.slug}/${product.slug}`}>
          ← Retour à {product.name}
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
          <Link to={`/produits/${offer.slug}/${product.slug}`}>{product.name}</Link>
          <span>/</span>
          <b>{variant.name}</b>
        </div>

        <div className="detail-grid">
          <div className={`detail-preview product-preview ${variant.color}`}>
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
          <section className="detail-content" aria-labelledby="variant-title">
            <p className="kicker">
              {product.name} · {offer.category}
            </p>
            <h1 id="variant-title">{variant.name}</h1>
            <p className="detail-description">
              {variant.description ?? product.description}
            </p>
            <dl className="variant-meta">
              <div>
                <dt>Feuilles</dt>
                <dd>{variant.sheetCount}</dd>
              </div>
            </dl>
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

        <section className="page-section">
          <div className="section-heading">
            <div>
              <p className="kicker">Comment ça fonctionne</p>
              <h2>Tout ce qu’il faut pour bien démarrer.</h2>
            </div>
          </div>
          {variant.howToUse && (
            <p className="variant-how-to variant-how-to-large">
              <strong>Comment l’utiliser :</strong> {variant.howToUse}
            </p>
          )}
          <ul className="included-list">
            {product.features.map((feature) => (
              <li key={feature}>
                <span>✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <section className="page-section">
          <div className="section-heading">
            <div>
              <p className="kicker">Acheter en confiance</p>
              <h2>Un fichier vérifié, livré immédiatement.</h2>
            </div>
          </div>
          <div className="steps-grid">
            <article>
              <span>01</span>
              <h3>Payez en Mobile Money</h3>
              <p>Orange, MTN, Moov ou carte bancaire, en toute sécurité.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Téléchargez aussitôt</h3>
              <p>Votre fichier est disponible immédiatement après le paiement.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Utilisez-le tout de suite</h3>
              <p>Fichier prêt à l’emploi, sans installation ni configuration.</p>
            </article>
          </div>
          <div className="trust-strip">
            <p>
              <b>Fichier vérifié</b>
              <span>Testé avant publication, sans virus ni macro cachée</span>
            </p>
            <p>
              <b>Support inclus</b>
              <span>Une question ? Nous vous accompagnons dans la prise en main</span>
            </p>
            <p>
              <b>Accès immédiat</b>
              <span>Aucune attente, le fichier est à vous dès le paiement confirmé</span>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
