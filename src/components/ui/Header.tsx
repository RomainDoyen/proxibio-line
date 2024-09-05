import React from "react";
import { IoIosArrowDown } from "react-icons/io";
import './Header.css'
import Button from "./Button";

export default function Header(): React.JSX.Element {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Bienvenue sur notre plateforme de producteurs locaux</h1>
        <h2>
          D'un simple clic, renseignez-vous sur l'actualité des productions de fruits et légumes 
          dans votre secteur géographique en consultant directement les producteurs près de chez vous.
        </h2>
        <Button 
          type="button"
          text="Commencez maintenant"
          className="cta-button"
          icon={<IoIosArrowDown size={'2em'}/>}
        />
      </div>
    </header>
  )
}