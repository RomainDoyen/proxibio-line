import { abIcon, venteDirectIcon } from '../utils/customMarker';
import { supabase } from "../config/index";
import { useState } from 'react';
import { geocodeAddress, searchAddress } from '../utils/function';
import { SuggestionType, CardFormProps } from '../types/types';
import './CardForm.css';
import toast from "react-hot-toast";

export default function CardForm({ onProducteurAdded }: CardFormProps): JSX.Element {
  // État pour les champs du formulaire
  const [name, setName] = useState<string>('');
  const [nameEnterprise, setNameEnterprise] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [typeAgriculture, setTypeAgriculture] = useState<string>('ab'); // Valeur par défaut
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);

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

    const updatedAt = new Date().toISOString();

    try {
      // Géocodage de l'adresse
      const { latitude, longitude }: { latitude: number; longitude: number } = await geocodeAddress(selectedAddress);

      // Vérification si l'adresse existe déjà
      const { data: existingProducteurs, error: checkError } = await supabase
        .from('Producteur')
        .select('id')
        .eq('address', selectedAddress);

      if (checkError) {
        throw checkError;
      }

      if (existingProducteurs && existingProducteurs.length > 0) {
        toast.error("Cette adresse existe déjà dans la base de données.", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });
        return;
      }

      // Insertion dans la table Producteur
      const { data, error } = await supabase
        .from('Producteur')
        .insert([{ name, nameEnterprise, address: selectedAddress, updatedAt }])
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
        toast.success("Producteur ajouté avec succès 🚀", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        // Réinitialiser les champs du formulaire après l'ajout réussi
        setName('');
        setNameEnterprise('');
        setSelectedAddress('');
        setTypeAgriculture('ab'); // Remettre la valeur par défaut
        setSuggestions([]);
      } else {
        throw new Error("Aucune donnée n'a été renvoyée par l'insertion du Producteur");
      }

    } catch (error) {
      console.error("Erreur lors de l'ajout du producteur :", (error as Error).message);
      toast.error("Erreur lors de l'ajout du producteur", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <form action="" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nom du producteur</label>
        <input 
          type="text" 
          className="form-control" 
          id="name" 
          placeholder="Nom du producteur..." 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="address">L'adresse du producteur</label>
        <input 
          type="text" 
          className="form-control" 
          id="address" 
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
        <input 
          type="text" 
          className="form-control" 
          id="name-enterprise" 
          placeholder="Nom de l'entreprise..." 
          value={nameEnterprise}
          onChange={(e) => setNameEnterprise(e.target.value)}
          required 
        />
      </div>
      <div className="form-group">
        <label htmlFor="type-agriculture">Sélectionner le type d'agriculture</label>
        <select 
          className="form-control" 
          id="type-agriculture" 
          value={typeAgriculture}
          onChange={(e) => setTypeAgriculture(e.target.value)}
          required
        >
          {abIcon && <option value="ab">Agriculture biologique</option>}
          {venteDirectIcon && <option value="venteDirect">Vente directe</option>}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Envoyer</button>
    </form>
  );
}
