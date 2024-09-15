import { useState } from 'react';
import { errorMessage, successMessage } from '../../utils/customToast';
import { geocodeAddress, searchAddress } from '../../api/address';
import { supabase } from "../../config/index";
import { CardFormProps } from '../../types/uiTypes';
import { SuggestionType } from '../../types/mapTypes';
import { abIcon, venteDirectIcon } from '../../utils/customMarker';
import Input from '../ui/Input';
import Button from '../ui/Button';
import './CardForm.css';
import { validateNameProducteur, validateNameEnterprise, validateAddress } from "../../utils/CheckForm";

export default function CardForm({ onProducteurAdded }: CardFormProps): JSX.Element {

  const [name, setName] = useState<string>('');
  const [nameEnterprise, setNameEnterprise] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [typeAgriculture, setTypeAgriculture] = useState<string>('ab'); // Valeur par défaut
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);

  const [nameError, setNameError] = useState<string>("");
  const [nameEnterpriseError, setNameEnterpriseError] = useState<string>("");
  const [addressError, setAddressError] = useState<string>("");
  
  const handleAddressChange = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const address = e.target.value;
    setSelectedAddress(address);

    setNameError(validateNameProducteur(name));
    setNameEnterpriseError(validateNameEnterprise(nameEnterprise));
    setAddressError(validateAddress(selectedAddress));

    if (nameError || nameEnterpriseError || addressError) {
      return;
    }

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
    setSuggestions([]); 
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
        errorMessage("Cette adresse existe déjà dans la base de données.");
        return;
      }

      const { data, error } = await supabase
        .from('Producteur')
        .insert([{ name, nameEnterprise, address: selectedAddress, updatedAt }])
        .select();

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        const producteurId: number = data[0].id;

        const { error: positionError } = await supabase
          .from('positionProducteur')
          .insert([{ producteurId, latitude, longitude, marker: typeAgriculture }]);

        if (positionError) {
          throw positionError;
        }

        onProducteurAdded();

        successMessage("Producteur ajouté avec succès 🚀");

        setName('');
        setNameEnterprise('');
        setSelectedAddress('');
        setTypeAgriculture('ab');
        setSuggestions([]);
      } else {
        throw new Error("Aucune donnée n'a été renvoyée par l'insertion du Producteur");
      }

    } catch (error) {
      console.error("Erreur lors de l'ajout du producteur :", (error as Error).message);
      errorMessage("Erreur lors de l'ajout du producteur");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nom du producteur</label>
        <Input 
          type='text'
          id="name" 
          placeholder="Nom du producteur..." 
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(validateNameProducteur(name));
          }}
        />
        {nameError && <div className="error-message">{nameError}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="address">L'adresse du producteur</label>
        <Input 
          type='text'
          id="address" 
          placeholder="L'adresse du producteur..." 
          value={selectedAddress}
          onChange={handleAddressChange}
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index} 
                onClick={() => {
                  handleAddressSelect(suggestion.display_name);
                  setAddressError(validateAddress(selectedAddress));
                }}>
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
        {addressError && <div className="error-message">{addressError}</div>}
      </div>
      <div className="form-group">
        <label htmlFor="name-enterprise">Nom de l'entreprise</label>
        <Input 
          type='text'
          id="name-enterprise" 
          placeholder="Nom de l'entreprise..." 
          value={nameEnterprise}
          onChange={(e) => {
            setNameEnterprise(e.target.value);
            setNameEnterpriseError(validateNameEnterprise(nameEnterprise));
          }}
        />
        {nameEnterpriseError && <div className="error-message">{nameEnterpriseError}</div>}
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
      <Button
        type="submit"
        text="Envoyer" 
        className='btn btn-primary'
      />
    </form>
  );
}
