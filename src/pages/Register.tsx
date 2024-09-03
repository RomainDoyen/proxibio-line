import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import { account } from "../config/index";
import { ID, Models } from "appwrite";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoadingStatus(true)
    e.preventDefault();
    try {
      // Call Appwrite function to handle user registration
      if (password !== confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas", {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
        setLoadingStatus(false)
        return;
      }
      if (
        username === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === ""
      ) {
        toast.error("Veuillez remplir tous les champs", {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
        setLoadingStatus(false);
        return;
      }

      if (password.length < 8) {
        toast.error("Le mot de passe doit contenir 8 caractères", {
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        })
        setLoadingStatus(false);
        return;
      }

      const promise = account.create(ID.unique(), email, password, username) as Promise<Models.User<Models.Preferences>>;

      promise.then(
        function (response: Models.User<Models.Preferences>) {
          console.log(response); // Success
          toast.success("Compte créé avec succès 🚀", {
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          });
          navigate("/login");
        },
        function (error) {
          console.log(error); // Failure
          alert(error);
        }
      );
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="registerPage">
      <h2>S'enregistrer</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur:</label>
          <input
            type="text"
            required
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            required
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            required
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
          <input
            type="password"
            required
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-control" 
          />
        </div>
        <button type="submit" className="btn btn-primary">{loadingStatus ? "Chargement..." : "S'enregistrer"}</button>

        <div className="reg">
          Vous avez un compte ? <Link to="/login">Connexion</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;