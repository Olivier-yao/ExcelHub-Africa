import { Link } from 'react-router-dom';
import { AccountMenu } from './AccountMenu';
import { Logo } from './Logo';

export function Navbar() {
  return (
    <header className="navbar">
      <Logo />
      <nav aria-label="Navigation principale">
        <Link to="/catalogue">Catalogue</Link>
        <Link to="/#comment-ca-marche">Comment ça marche</Link>
        <Link to="/#pourquoi">Pourquoi nous</Link>
      </nav>
      <div className="nav-actions">
        <AccountMenu />
        <Link className="button button-small" to="/catalogue">
          Explorer
        </Link>
      </div>
    </header>
  );
}
