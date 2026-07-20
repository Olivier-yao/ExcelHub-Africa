import { Link } from 'react-router-dom';
import { formatFcfa, type Product } from '../data/products';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <article className="product-card">
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
          <strong>{formatFcfa(product.priceFcfa)}</strong>
          <Link to={`/produits/${product.slug}`} aria-label={`Voir ${product.name}`}>
            ↗
          </Link>
        </div>
      </div>
    </article>
  );
}
