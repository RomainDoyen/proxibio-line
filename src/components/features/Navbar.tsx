/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { successMessage } from "../../utils/customToast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { UserAuthContext } from "../../context/UserAuthContext";
import { UserAuthContextType } from "../../types/userTypes";
import Avatar from "../ui/Avatar";
import "./Navbar.css";
import Image from "../ui/Image";
import Button from "../ui/Button";
import { apiUrl } from "../../utils/apiUrl";
import brandLogo from "../../assets/ab.png";

const Navbar: React.FC = () => {
  const { user, setUser, isLoading } = useContext(UserAuthContext) as UserAuthContextType;
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  let inactivityTimeout: NodeJS.Timeout;

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await fetch(apiUrl("/api/auth/logout"), { method: "POST", credentials: "include" });
      setUser(null);
      localStorage.removeItem("isLoggedIn");
      successMessage("Déconnecté avec succès 🚀");
      navigate("/");
      closeMenu();
    } catch (error) {
      console.error(error);
    }
  };

  const resetInactivityTimeout = () => {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      void handleLogout();
      successMessage("Déconnecté pour cause d'inactivité 🕒");
    }, 5 * 60 * 1000);
  };

  useEffect(() => {
    if (user) {
      window.addEventListener("mousemove", resetInactivityTimeout);
      window.addEventListener("keydown", resetInactivityTimeout);
      resetInactivityTimeout();
      localStorage.setItem("isLoggedIn", "true");
    }

    return () => {
      clearTimeout(inactivityTimeout);
      window.removeEventListener("mousemove", resetInactivityTimeout);
      window.removeEventListener("keydown", resetInactivityTimeout);
    };
  }, [user]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user) {
        localStorage.setItem("isLoggedIn", "true");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  useEffect(() => {
    if (isLoading) return;
    const wasLoggedIn = localStorage.getItem("isLoggedIn");
    if (wasLoggedIn && !user) {
      void handleLogout();
      localStorage.removeItem("isLoggedIn");
    }
  }, [handleLogout, user, isLoading]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const homeHref = "/";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={homeHref} className="navbar-brand" onClick={closeMenu}>
          <Image src={brandLogo} alt="" className="navbar-brand-logo" />
          <span>ProxiBioLine</span>
        </Link>

        <button
          type="button"
          className="navbar-burger"
          aria-expanded={menuOpen}
          aria-controls="navbar-panel"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        <div
          id="navbar-panel"
          className={`navbar-panel ${menuOpen ? "navbar-panel--open" : ""}`}
        >
          <div className="navbar-links">
            {user ? (
              <>
                <Link to="/" className="nav-link" onClick={closeMenu}>
                  Accueil
                </Link>
                {user.role === "PRODUCER" && (
                  <Link
                    to="/espace-producteur"
                    className="nav-link"
                    onClick={closeMenu}
                  >
                    Espace producteur
                  </Link>
                )}
                {user.role === "ADMIN" && (
                  <Link to="/admin" className="nav-link" onClick={closeMenu}>
                    Administration
                  </Link>
                )}
                <div className="user-profile">
                  <Avatar toggleDropdown={toggleDropdown} />
                  {isDropdownOpen && (
                    <div className="user-dropdown">
                      <p>
                        <strong>Nom :</strong> {user.name}
                      </p>
                      <p>
                        <strong>Email :</strong> {user.email}
                      </p>
                      <Button
                        text="Se déconnecter"
                        onClick={() => {
                          void handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="nav-button"
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="nav-link nav-link--cta"
                  onClick={closeMenu}
                >
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
