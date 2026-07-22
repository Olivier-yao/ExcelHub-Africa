import { useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { OfferCard } from '../components/OfferCard';
import { SiteFooter } from '../components/SiteFooter';
import { categories } from '../data/offers';
import { useOffers } from '../hooks/useOffers';

export function CataloguePage() {
  const { data: offers } = useOffers();
  const [activeCategory, setActiveCategory] = useState('Tous');
  const displayedOffers = useMemo(
    () =>
      activeCategory === 'Tous'
        ? offers
        : offers.filter((offer) => offer.category === activeCategory),
    [activeCategory, offers],
  );

  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <section className="catalogue-hero" aria-labelledby="catalogue-title">
          <p className="kicker">Nos solutions</p>
          <h1 id="catalogue-title">Un outil pour chaque ambition.</h1>
          <p className="catalogue-lead">
            Des fichiers Excel professionnels pour chaque métier : boutique, finance,
            pharmacie, éducation. Choisissez une catégorie, comparez les prix et trouvez
            l’outil qui correspond à votre activité.
          </p>
        </section>

        <section className="catalogue section" aria-label="Catalogue des offres">
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
            {displayedOffers.map((offer) => (
              <OfferCard key={offer.slug} offer={offer} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
