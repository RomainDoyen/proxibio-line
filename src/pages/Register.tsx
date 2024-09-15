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
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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

  const [usernameValid, setUsernameValid] = useState<boolean>(false);
  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingStatus(true);

    const usernameValidation = validateUsername(username);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(confirmPassword, password);

    setUsernameError(usernameValidation.error);
    setUsernameValid(usernameValidation.isValid);
    
    setEmailError(emailValidation.error);
    setEmailValid(emailValidation.isValid);
    
    setPasswordError(passwordValidation.error);
    setPasswordValid(passwordValidation.isValid);
    
    setConfirmPasswordError(confirmPasswordValidation.error);
    setConfirmPasswordValid(confirmPasswordValidation.isValid);

    if (!usernameValidation.isValid || !emailValidation.isValid || !passwordValidation.isValid || !confirmPasswordValidation.isValid) {
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
              const validation = validateUsername(e.target.value);
              setUsernameError(validation.error);
              setUsernameValid(validation.isValid);
            }}
          />
          {usernameError && <div className="error-message">{usernameError}</div>}
          {username && (usernameValid ? <FaCheckCircle className="valid-icon" /> : <FaTimesCircle className="invalid-icon" />)}
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
              const validation = validateEmail(e.target.value);
              setEmailError(validation.error);
              setEmailValid(validation.isValid);
            }}
          />
          {emailError && <div className="error-message">{emailError}</div>}
          {email && (emailValid ? <FaCheckCircle className="valid-icon" /> : <FaTimesCircle className="invalid-icon" />)}
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
              const validation = validatePassword(e.target.value);
              setPasswordError(validation.error);
              setPasswordValid(validation.isValid);
            }}
          />
          {passwordError && <div className="error-message">{passwordError}</div>}
          {password && (passwordValid ? <FaCheckCircle className="valid-icon" /> : <FaTimesCircle className="invalid-icon" />)}
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
              const validation = validateConfirmPassword(e.target.value, password);
              setConfirmPasswordError(validation.error);
              setConfirmPasswordValid(validation.isValid);
            }}
          />
          {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
          {confirmPassword && (confirmPasswordValid ? <FaCheckCircle className="valid-icon" /> : <FaTimesCircle className="invalid-icon" />)}
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
