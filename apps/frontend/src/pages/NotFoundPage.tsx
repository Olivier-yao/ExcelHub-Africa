import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';

export function NotFoundPage() {
  return (
    <main className="not-found">
      <Logo />
      <h1>Cette page n’existe pas.</h1>
      <Link className="button" to="/">
        Retour à l’accueil
      </Link>
    </main>
  );
}
