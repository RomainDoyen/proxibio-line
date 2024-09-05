/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { successMessage } from "../../utils/customToast";
import { Link, useNavigate } from "react-router-dom";
import { account } from "../../config/index";
import { UserAuthContext } from "../../context/UserAuthContext";
import { UserAuthContextType } from "../../types/types";
import Avatar from "../ui/Avatar";
import "./Navbar.css";
import Image from "../ui/Image";
import Button from "../ui/Button";

const Navbar: React.FC = () => {
  const { user, setUser } = useContext(UserAuthContext) as UserAuthContextType;
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  let inactivityTimeout: NodeJS.Timeout;

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
      successMessage("Déconnecté avec succès 🚀");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const resetInactivityTimeout = () => {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      handleLogout();
      successMessage("Déconnecté pour cause d'inactivité 🕒");
    }, 5 * 60 * 1000); // 5 minutes d'inactivité
  };

  // Gestion de l'inactivité (mouvement de la souris, clic, touche pressée)
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

  // Gestion de la fermeture/rechargement de la fenêtre
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
          <Image src="./src/assets/ab.png" alt="Logo" />
          <p>ProxyBioLine</p>
        </div>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Accueil</Link>
          {user ? (
            <div className="user-profile">
              <Avatar toggleDropdown={toggleDropdown} />
              {isDropdownOpen && (
                <div className="user-dropdown">
                  <p><strong>Nom:</strong> {user?.name || user?.providerUid}</p>
                  <p><strong>Email:</strong> {user?.email || user?.providerUid}</p>
                  <Button 
                    text="Se déconnecter"
                    onClick={handleLogout}
                    className="nav-button"
                  />
                </div>
              )}
            </div>
          ) : (
            <Avatar toggleDropdown={toggleDropdown} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;