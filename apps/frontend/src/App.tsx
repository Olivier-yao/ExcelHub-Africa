import { Route, Routes } from 'react-router-dom';
import { CataloguePage } from './pages/CataloguePage';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OfferDetailPage } from './pages/OfferDetailPage';
import { ProductVariantsPage } from './pages/ProductVariantsPage';
import { RegisterPage } from './pages/RegisterPage';
import { VariantDetailPage } from './pages/VariantDetailPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalogue" element={<CataloguePage />} />
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/inscription" element={<RegisterPage />} />
      <Route path="/produits/:offerSlug" element={<OfferDetailPage />} />
      <Route path="/produits/:offerSlug/:productSlug" element={<ProductVariantsPage />} />
      <Route
        path="/produits/:offerSlug/:productSlug/:variantSlug"
        element={<VariantDetailPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
