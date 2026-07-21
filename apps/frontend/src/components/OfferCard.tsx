import { Link } from 'react-router-dom';
import { priceRange, type Offer } from '../data/offers';

type Props = {
  offer: Offer;
};

export function OfferCard({ offer }: Props) {
  return (
    <article className="product-card">
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
        <h3>{offer.name}</h3>
        <span>{offer.description}</span>
        <div className="product-bottom">
          <strong>{priceRange(offer)}</strong>
          <Link to={`/produits/${offer.slug}`} aria-label={`Voir ${offer.name}`}>
            ↗
          </Link>
        </div>
      </div>
    </article>
  );
}
