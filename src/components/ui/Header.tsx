import React, { useContext } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import Button from "./Button";
import { UserAuthContext } from "../../context/UserAuthContext";
import { UserAuthContextType } from "../../types/userTypes";

export default function Header(): React.JSX.Element {
  const navigate = useNavigate();
  const { user } = useContext(UserAuthContext) as UserAuthContextType;

  const handleCta = (): void => {
    if (user) {
      document.getElementById("add-producer")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      navigate("/register");
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <p className="header-eyebrow">Circuit court & local</p>
        <h1 className="header-title">Bienvenue sur la plateforme des producteurs près de chez vous</h1>
        <p className="header-lead">
          D&apos;un simple clic, découvre les fruits et légumes disponibles autour de toi et contacte
          directement les producteurs de ton secteur.
        </p>
        <Button
          type="button"
          text={user ? "Ajouter un producteur" : "Commencer maintenant"}
          className="cta-button"
          icon={<IoIosArrowDown className="cta-button__icon" aria-hidden />}
          onClick={handleCta}
        />
      </div>
    </header>
  );
}
