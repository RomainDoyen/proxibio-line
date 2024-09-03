import { abIcon, venteDirectIcon } from '../utils/customMarker';
import { supabase } from "../config/index";
import { useState } from 'react';
import { geocodeAddress, searchAddress } from '../utils/function';
import { SuggestionType, CardFormProps } from '../types/types';
import './CardForm.css';

export default function CardForm({ onProducteurAdded }: CardFormProps): JSX.Element {

  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const address = e.target.value;
    setSelectedAddress(address);

    if (address.length > 2) {
      try {
        const results = await searchAddress(address);
        setSuggestions(results);
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions:', (error as Error).message);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleAddressSelect = (address: string): void => {
    setSelectedAddress(address);
    setSuggestions([]); // Efface les suggestions après la sélection
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const formElements = e.currentTarget.elements as typeof e.currentTarget.elements & {
      name: HTMLInputElement;
      adresse: HTMLInputElement;
      ['name-enterprise']: HTMLInputElement;
      ['type-agriculture']: HTMLSelectElement;
    };
  
    const name = formElements.name.value;
    const nameEnterprise = formElements['name-enterprise'].value;
    const address = formElements.adresse.value;
    const typeAgriculture = formElements['type-agriculture'].value;

    const updatedAt = new Date().toISOString();
  
    try {
      // Géocodage de l'adresse
      const { latitude, longitude }: { latitude: number; longitude: number } = await geocodeAddress(address);

      // Vérification si l'adresse existe déjà
      const { data: existingProducteurs, error: checkError } = await supabase
        .from('Producteur')
        .select('id')
        .eq('adress', address);
      
      if (checkError) {
        throw checkError;
      }

      if (existingProducteurs && existingProducteurs.length > 0) {
        alert("Cette adresse existe déjà dans la base de données.");
        return;
      }

      // Insertion dans la table Producteur
      const { data, error } = await supabase
        .from('Producteur')
        .insert([{ name, nameEnteprise: nameEnterprise, adress: address, updatedAt }])
        .select();
  
      if (error) {
        throw error;
      }
  
      if (data && data.length > 0) {
        const producteurId: number = data[0].id;
  
        // Insertion dans la table positionProducteur
        const { error: positionError } = await supabase
          .from('positionProducteur')
          .insert([{ producteurId, latitude, longitude, marker: typeAgriculture }]);
  
        if (positionError) {
          throw positionError;
        }

        // Appeler la fonction pour notifier que le producteur a été ajouté
        onProducteurAdded();

        // Réinitialiser le formulaire après l'ajout réussi
        e.currentTarget.reset();
        setSelectedAddress(""); // Réinitialiser l'état de l'adresse sélectionnée
        setSuggestions([]); // Réinitialiser les suggestions
      } else {
        throw new Error("Aucune donnée n'a été renvoyée par l'insertion du Producteur");
      }
  
    } catch (error) {
      console.error("Erreur lors de l'ajout du producteur :", (error as Error).message);
    }
  };

  return (
    <form action="" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nom du producteur</label>
        <input type="text" className="form-control" id="name" placeholder="Nom du producteur..." required />
      </div>
      <div className="form-group">
        <label htmlFor="adresse">L'adresse du producteur</label>
        <input 
          type="text" 
          className="form-control" 
          id="adresse" 
          placeholder="L'adresse du producteur..." 
          value={selectedAddress} 
          onChange={handleAddressChange}
          required
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index} 
                onClick={() => handleAddressSelect(suggestion.display_name)}>
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="name-enterprise">Nom de l'entreprise</label>
        <input type="text" className="form-control" id="name-enterprise" placeholder="Nom de l'entreprise..." required />
      </div>
      <div className="form-group">
        <label htmlFor="type-agriculture">Sélectionner le type d'agriculture</label>
        <select className="form-control" id="type-agriculture" required>
          {abIcon && <option value="ab">Agriculture biologique</option>}
          {venteDirectIcon && <option value="venteDirect">Vente directe</option>}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Envoyer</button>
    </form>
  );
}


// import { abIcon, venteDirectIcon } from '../utils/customMarker';
// import { supabase } from "../config/index";
// import { useState } from 'react';
// import { geocodeAddress, searchAddress } from '../utils/function';
// // import './CardForm.css';

// type CardFormProps = {
//   onProducteurAdded: () => void;
// };

// type Suggestion = {
//   display_name: string;
// };

// export default function CardForm({ onProducteurAdded }: CardFormProps): JSX.Element {

//   const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
//   const [selectedAddress, setSelectedAddress] = useState<string>('');

//   const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
//     const address = e.target.value;
//     setSelectedAddress(address);

//     if (address.length > 2) { // Commence à rechercher après que 3 caractères aient été saisis
//       try {
//         const results = await searchAddress(address);
//         setSuggestions(results);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des suggestions:', error.message);
//         setSuggestions([]);
//       }
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleAddressSelect = (address: string) => {
//     setSelectedAddress(address);
//     setSuggestions([]); // Efface les suggestions après la sélection
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
  
//     const form = e.target as HTMLFormElement;
//     const name = e.target.name.value;
//     const nameEnterprise = e.target['name-enterprise'].value;
//     const address = e.target.adresse.value;
//     const typeAgriculture = e.target['type-agriculture'].value;

//     const updatedAt = new Date().toISOString();
  
//     try {
//       // Géocodage de l'adresse
//       const { latitude, longitude }: { latitude: number; longitude: number } = await geocodeAddress(address);

//       // Vérification si l'adresse existe déjà
//       const { data: existingProducteurs, error: checkError } = await supabase
//         .from('Producteur')
//         .select('id')
//         .eq('adress', address);
      
//       if (checkError) {
//         throw checkError;
//       }

//       if (existingProducteurs && existingProducteurs.length > 0) {
//         alert("Cette adresse existe déjà dans la base de données.");
//         return;
//       }

//       // Insertion dans la table Producteur
//       const { data, error } = await supabase
//         .from('Producteur')
//         .insert([{ name, nameEnteprise: nameEnterprise, adress: address, updatedAt }])
//         .select();
  
//       if (error) {
//         throw error;
//       }
  
//       // Vérifiez que data contient des résultats
//       if (data && data.length > 0) {
//         const producteurId = data[0].id;
  
//         // Insertion dans la table positionProducteur
//         const { error: positionError } = await supabase
//           .from('positionProducteur')
//           .insert([{ producteurId, latitude, longitude, marker: typeAgriculture }]);
  
//         if (positionError) {
//           throw positionError;
//         }

//         // Appeler la fonction pour notifier que le producteur a été ajouté
//         onProducteurAdded();

//         // Réinitialiser le formulaire après l'ajout réussi
//         // e.target.reset();
//         form.reset();
//         setSelectedAddress(""); // Réinitialiser l'état de l'adresse sélectionnée
//         setSuggestions([]); // Réinitialiser les suggestions
  
//         // console.log("Producteur ajouté avec succès", data);
//       } else {
//         throw new Error("Aucune donnée n'a été renvoyée par l'insertion du Producteur");
//       }
  
//     } catch (error) {
//       console.error("Erreur lors de l'ajout du producteur :", error.message);
//     }
//   };

//   return (
//     <form action="" onSubmit={handleSubmit}>
//       <div className="form-group">
//         <label htmlFor="name">Nom du producteur</label>
//         <input type="text" className="form-control" id="name" placeholder="Nom du producteur..." />
//       </div>
//       <div className="form-group">
//         <label htmlFor="adresse">L'adresse du producteur</label>
//         <input 
//           type="text" 
//           className="form-control" 
//           id="adresse" 
//           placeholder="L'adresse du producteur..." 
//           value={selectedAddress} 
//           onChange={handleAddressChange}
//         />
//         {suggestions.length > 0 && (
//           <ul className="suggestions-list">
//             {suggestions.map((suggestion, index) => (
//               <li 
//                 key={index} 
//                 onClick={() => handleAddressSelect(suggestion.display_name)}>
//                 {suggestion.display_name}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//       <div className="form-group">
//         <label htmlFor="name-enterprise">Nom de l'entreprise</label>
//         <input type="text" className="form-control" id="name-enterprise" placeholder="Nom de l'entreprise..." />
//       </div>
//       <div className="form-group">
//         <label htmlFor="type-agriculture">Sélectionner le type d'agriculture</label>
//         <select className="form-control" id="type-agriculture">
//           {abIcon && <option value="ab">Agriculture biologique</option>}
//           {venteDirectIcon && <option value="venteDirect">Vente directe</option>}
//         </select>
//       </div>
//       <button type="submit" className="btn btn-primary">Envoyer</button>
//     </form>
//   );
// }
