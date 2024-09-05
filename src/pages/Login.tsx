import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import { account } from "../config/index";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "../context/UserAuthContext";
import toast from "react-hot-toast";
import { UserAuthContextType } from "../types/types";
import { Models } from "appwrite";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

const Login: React.FC = () => {
  const { setUser, user } = useContext(UserAuthContext) as UserAuthContextType;
  // console.log(user);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  useEffect(() => {
    if(user !== null){
       navigate("/");
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading(true);

    if (password === "" || email === "") {
      toast.error("Veuillez remplir le champ requis");
      setButtonLoading(false);
      return;
    }

    try {
      const session: Models.Session = await account.createEmailPasswordSession(email, password);

      // Extraire les données utilisateur pertinentes de la session
      const userFromSession = {
        // name: session.clientName || "Nom inconnu",
        email: session.providerUid || "Email inconnu",
        id: session.userId,
      };

      toast.success("Connexion réussie 🚀", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      // Mettre à jour l'utilisateur avec les informations extraites
      setUser(userFromSession);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Veuillez vérifier vos informations: email et mot de passe", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <h2>Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <Input 
            type='email'
            id="email" 
            placeholder="Email..." 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe:</label>
          <Input 
            type='password'
            id="password" 
            placeholder="Mot de passe..." 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button 
          type="submit"
          text={buttonLoading ? "Chargement..." : "Connexion"}
          className="btn btn-primary"
        />
        <div className="reg">
          Vous n'avez pas de compte ? <Link to="/register">S'enregistrer</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;