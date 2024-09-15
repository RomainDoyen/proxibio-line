import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import { account } from "../config/index";
import { ID, Models } from "appwrite";
import { useNavigate } from "react-router-dom";
import { errorMessage, successMessage } from "../utils/customToast";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { TailSpin } from 'react-loader-spinner';
import { validateUsername, validateEmail, validatePassword, validateConfirmPassword } from "../utils/CheckForm";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false);

  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingStatus(true);

    setUsernameError(validateUsername(username));
    setEmailError(validateEmail(email));
    setPasswordError(validatePassword(password));
    setConfirmPasswordError(validateConfirmPassword(confirmPassword, password));

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setLoadingStatus(false);
      return;
    }

    try {
      const promise = account.create(ID.unique(), email, password, username) as Promise<Models.User<Models.Preferences>>;
      promise.then(
        function (response: Models.User<Models.Preferences>) {
          console.log(response); // Success
          successMessage("Compte créé avec succès 🚀");
          navigate("/login");
        },
        function (error) {
          console.log(error); // Failure
          errorMessage("Erreur lors de la création du compte");
        }
      );
    } catch (err) {
      console.log((err as Error).message);
    }
  };

  return (
    <div className="registerPage">
      <h2>S'enregistrer</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nom d'utilisateur:</label>
          <Input 
            type='text'
            id="username" 
            placeholder="Nom d'utilisateur..." 
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameError(validateUsername(e.target.value));
            }}
          />
          {usernameError && <div className="error-message">{usernameError}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <Input 
            type='email'
            id="email" 
            placeholder="Email..." 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(validateEmail(e.target.value));
            }}
          />
          {emailError && <div className="error-message">{emailError}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe:</label>
          <Input 
            type='password'
            id="password" 
            placeholder="Mot de passe..." 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError(validatePassword(e.target.value));
            }}
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe:</label>
          <Input 
            type='password'
            id="confirmPassword" 
            placeholder="Confirmer le mot de passe..." 
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmPasswordError(validateConfirmPassword(e.target.value, password));
            }}
          />
          {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
        </div>
        <Button 
          type="submit"
          text={loadingStatus ? <Loader 
            text="Chargement..."
            loader={<TailSpin
              visible={true}
              height="20"
              width="20"
              color="#16283a"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              />}
          /> : "S'enregistrer"}
          className="btn btn-primary"
        />
        <div className="reg">
          Vous avez un compte ? <Link to="/login">Connexion</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;