/* eslint-disable react-hooks/exhaustive-deps */
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { account } from "../config/index";
import { UserAuthContext } from "../context/UserAuthContext";
import toast from "react-hot-toast";
import { UserAuthContextType } from "../types/types";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { user, setUser } = useContext(UserAuthContext) as UserAuthContextType;
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // État pour contrôler le menu déroulant

  // Timer pour l'inactivité
  let inactivityTimeout: NodeJS.Timeout;

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      toast.success("Déconnecté avec succès 🚀", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  // Fonction pour gérer l'inactivité
  const resetInactivityTimeout = () => {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      handleLogout();
      toast.success("Déconnecté pour cause d'inactivité 🕒", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }, 5 * 60 * 1000); // 5 minutes d'inactivité
  };

  // Gestion de l'inactivité (mouvement de la souris, clic, touche pressée)
  useEffect(() => {
    if (user) {
      // Événements pour réinitialiser le timer d'inactivité
      window.addEventListener("mousemove", resetInactivityTimeout);
      window.addEventListener("keydown", resetInactivityTimeout);

      resetInactivityTimeout(); // Initialiser le timer d'inactivité

      // Marquer l'utilisateur comme connecté dans le localStorage
      localStorage.setItem("isLoggedIn", "true");
    }

    return () => {
      clearTimeout(inactivityTimeout);
      window.removeEventListener("mousemove", resetInactivityTimeout);
      window.removeEventListener("keydown", resetInactivityTimeout);
    };
  }, [user]);

  // Gestion de la fermeture/rechargement de la fenêtre
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user) {
        localStorage.setItem("isLoggedIn", "true"); // Marquer comme connecté
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  // Vérifier si l'utilisateur était connecté au rechargement de la page
  useEffect(() => {
    const wasLoggedIn = localStorage.getItem("isLoggedIn");
    if (wasLoggedIn && !user) {
      // Si l'utilisateur était marqué comme connecté mais ne l'est pas
      handleLogout();
      localStorage.removeItem("isLoggedIn");
    }
  }, [handleLogout, user]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Inverser l'état pour ouvrir/fermer le menu
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="./src/assets/ab.png" alt="Logo" /> 
          <p>ProxyBioLine</p>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Accueil
          </Link>
          {user ? (
            <div className="user-profile">
              <div className="user-avatar" onClick={toggleDropdown}>
                <FaUserCircle size={40} color="#507c50" />
              </div>
              {isDropdownOpen && (
                <div className="user-dropdown">
                  <p><strong>Nom:</strong> {user?.name || user?.providerUid}</p>
                  <p><strong>Email:</strong> {user?.email || user?.providerUid}</p>
                  <button onClick={handleLogout} className="nav-button">
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="user-avatar">
                <FaUserCircle size={40} color="#507c50" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;