import { Link } from "react-router-dom";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { account } from "../config/index";
import { UserAuthContext } from "../context/UserAuthContext";
import toast from "react-hot-toast";
import { UserAuthContextType } from "../types/types";

const Navbar = () => {
  const { user, setUser } = useContext(UserAuthContext) as UserAuthContextType;
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

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
            <button onClick={handleLogout} className="nav-button">
              Se déconnecter
            </button>
          ) : (
            <button onClick={handleLogin} className="nav-button">
              Se connecter
            </button>
          )}
          {/* <div className="user-info">
            <h2>Utilisateur actuellement connecté</h2>
            <div className="user-details">
              <p>Nom: {user.name || user?.providerUid}</p>
              <p>Email: {user.email || user?.providerUid}</p>
            </div>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;