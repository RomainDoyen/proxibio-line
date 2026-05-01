import { Link } from "react-router-dom";
import "./NotFound.css";

export default function NotFound(): JSX.Element {
  return (
    <div className="not-found">
      <div className="glass-panel not-found__card">
        <p className="not-found__code">404</p>
        <h1 className="not-found__title">Page introuvable</h1>
        <p className="not-found__lead">
          L’adresse que tu as saisie n’existe pas ou a été déplacée.
        </p>
        <Link to="/" className="not-found__cta">
          Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}
