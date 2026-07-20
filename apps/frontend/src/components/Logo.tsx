import { Link } from 'react-router-dom';

export function Logo() {
  return (
    <Link to="/" className="brand" aria-label="ExcelHub Africa, accueil">
      <span className="brand-mark">X</span>
      <span>
        ExcelHub <b>Africa</b>
      </span>
    </Link>
  );
}
