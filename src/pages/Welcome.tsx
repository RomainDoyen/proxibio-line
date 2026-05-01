import { Link } from "react-router-dom";
import { FaLeaf, FaMapMarkedAlt, FaHandshake } from "react-icons/fa";
import "./Welcome.css";

const Welcome: React.FC = () => {
  return (
    <div className="welcome">
      <section className="welcome-intro glass-panel" id="pourquoi">
        <h2 className="welcome-heading">ProxiBioLine, le lien direct avec les producteurs</h2>
        <p className="welcome-lead">
          La plateforme met en avant les producteurs en circuit court autour de toi : fruits,
          légumes et produits locaux, sans intermédiaire inutile. Crée un compte gratuit pour
          consulter la carte interactive et, si tu le souhaites, recenser un producteur près de chez
          toi.
        </p>
      </section>

      <section className="welcome-features" aria-label="Fonctionnalités">
        <article className="welcome-card glass-panel">
          <FaMapMarkedAlt className="welcome-card__icon" aria-hidden />
          <h3 className="welcome-card__title">Carte collaborative</h3>
          <p className="welcome-card__text">
            Visualise les producteurs référencés et géolocalisés sur une carte claire, pour repérer
            rapidement ceux qui te sont accessibles.
          </p>
        </article>
        <article className="welcome-card glass-panel">
          <FaLeaf className="welcome-card__icon" aria-hidden />
          <h3 className="welcome-card__title">Bio &amp; local</h3>
          <p className="welcome-card__text">
            Privilégie les circuits courts : moins de transport, plus de fraîcheur, et un lien
            direct avec celles et ceux qui produisent.
          </p>
        </article>
        <article className="welcome-card glass-panel">
          <FaHandshake className="welcome-card__icon" aria-hidden />
          <h3 className="welcome-card__title">Une communauté</h3>
          <p className="welcome-card__text">
            Les fiches sont enrichies par les utilisateurs et validées pour garder une carte utile
            et fiable pour tout le monde.
          </p>
        </article>
      </section>

      <section className="welcome-cta glass-panel" aria-labelledby="welcome-cta-title">
        <h2 id="welcome-cta-title" className="welcome-cta__title">
          Prêt à explorer les producteurs autour de toi ?
        </h2>
        <p className="welcome-cta__lead">
          Connecte-toi ou inscris-toi en quelques secondes pour accéder à la carte et contribuer.
        </p>
        <div className="welcome-cta__actions">
          <Link to="/register" className="welcome-cta__btn welcome-cta__btn--primary">
            Créer un compte
          </Link>
          <Link to="/login" className="welcome-cta__btn welcome-cta__btn--secondary">
            J&apos;ai déjà un compte
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
