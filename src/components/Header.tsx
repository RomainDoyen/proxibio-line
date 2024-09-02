import React from "react";
import { IoIosArrowDown } from "react-icons/io";
// import './Header.css'

export default function Header(): React.JSX.Element {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Bienvenue sur notre plateforme de producteurs locaux</h1>
        <h2>
          D'un simple clic, renseignez-vous sur l'actualité des productions de fruits et légumes 
          dans votre secteur géographique en consultant directement les producteurs près de chez vous.
        </h2>
        <button className="cta-button">Commencez maintenant&nbsp;<IoIosArrowDown size={'2em'}/></button>
      </div>
    </header>
  )
}