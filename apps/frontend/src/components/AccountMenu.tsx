import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AccountMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Link className="link-button" to="/connexion">
        Se connecter
      </Link>
    );
  }

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate('/');
  }

  return (
    <div className="account-menu" ref={menuRef}>
      <button
        className="link-button"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {user.name.split(' ')[0]} ▾
      </button>
      {open && (
        <div className="account-dropdown" role="menu">
          <p className="account-email">{user.email}</p>
          <button className="account-dropdown-item" type="button" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}
