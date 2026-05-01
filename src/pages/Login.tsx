import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserAuthContext } from "../context/UserAuthContext";
import { errorMessage, successMessage } from "../utils/customToast";
import { UserAuthContextType } from "../types/userTypes";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Loader from "../components/ui/Loader";
import { TailSpin } from 'react-loader-spinner';
import { validateEmail, validatePassword } from "../utils/CheckForm";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { postLoginPath } from "../utils/postLoginPath";
import { apiUrl } from "../utils/apiUrl";

const Login: React.FC = () => {
  const { setUser, user } = useContext(UserAuthContext) as UserAuthContextType;
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const [emailValid, setEmailValid] = useState<boolean>(false);
  const [passwordValid, setPasswordValid] = useState<boolean>(false);

  useEffect(() => {
    if (user !== null) {
      navigate(postLoginPath(user.role), { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setButtonLoading(true);

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation.error);
    setEmailValid(emailValidation.isValid);

    setPasswordError(passwordValidation.error);
    setPasswordValid(passwordValidation.isValid);

    if (!emailValidation.isValid || !passwordValidation.isValid) {
      setButtonLoading(false);
      return;
    }

    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        errorMessage("E-mail ou mot de passe incorrect");
        return;
      }

      const userData = await res.json();
      successMessage("Connexion réussie 🚀");
      setUser(userData);
      navigate(postLoginPath(userData.role), { replace: true });
    } catch (error) {
      console.log(error);
      errorMessage("Erreur lors de la connexion");
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h2>Connexion</h2>
        <p className="auth-subtitle">
          Accède à la carte des producteurs et contribue aux circuits courts près de chez toi.
        </p>
        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <Input 
            type='email'
            id="email" 
            placeholder="Email..." 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              const validation = validateEmail(e.target.value);
              setEmailError(validation.error);
              setEmailValid(validation.isValid);
            }}
          />
          {emailError && <div className="error-message">{emailError}</div>}
          {emailValid && (emailValid ? <FaCheckCircle className="valid-icon" /> : <FaTimesCircle className="invalid-icon" />)}
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
          {passwordValid && (passwordValid ? <FaCheckCircle className="valid-icon" /> : <FaTimesCircle className="invalid-icon" />)}        
        </div>
        <Button 
          type="submit"
          text={buttonLoading ? <Loader 
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
          /> : "Connexion"}
          className="btn btn-primary"
        />
        <div className="reg">
          Vous n&apos;avez pas de compte ? <Link to="/register">S&apos;inscrire</Link>
        </div>
      </form>
      </div>
    </div>
  );
};

export default Login;
