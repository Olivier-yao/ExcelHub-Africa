import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OfferDetailPage } from './pages/OfferDetailPage';
import { ProductVariantsPage } from './pages/ProductVariantsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/produits/:offerSlug" element={<OfferDetailPage />} />
      <Route path="/produits/:offerSlug/:productSlug" element={<ProductVariantsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
