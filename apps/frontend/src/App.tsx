import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { OfferDetailPage } from './pages/OfferDetailPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/produits/:slug" element={<OfferDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
