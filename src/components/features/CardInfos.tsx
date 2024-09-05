import './CardInfos.css';

export default function CardInfos(): React.JSX.Element {
  return (
    <div className="card-infos">
      <h2>Carte participative</h2>
      <div>
        <p>Cette carte n’a pas la prétention d’être exhaustive, face à la multitude d’initiatives, parfois éphémères, qui fleurissent sur le territoire. Elle sera enrichie au fil du temps, grâce à vos contributions !</p><br />
        <p>Vous pouvez nous aider à la compléter en nous envoyant les informations sur les initiatives que vous connaissez, en remplissant le formulaire ci-dessous.</p>
        <p>Lorsque vous cliquez sur un magasin, vous pouvez nous signaler une erreur : une information manquante ou erronée, ou encore la fermeture définitive de la boutique.</p>
      </div>
    </div>
  )
}
