import { useContext, useRef, useState } from 'react';
import { errorMessage, successMessage } from '../../utils/customToast';
import { geocodeAddress, searchAddress } from '../../api/address';
import { CardFormProps } from '../../types/uiTypes';
import { SuggestionType } from '../../types/mapTypes';
import Input from '../ui/Input';
import Button from '../ui/Button';
import './CardForm.css';
import { validateNameProducteur, validateNameEnterprise, validateAddress } from "../../utils/CheckForm";
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { UserAuthContext } from '../../context/UserAuthContext';
import { UserAuthContextType } from '../../types/userTypes';
import { ProducerProfileFields } from './ProducerProfileFields';
import {
  emptyProducerProfileFormState,
  type ProducerProfileFormState,
} from '../../utils/producerProfileFormState';
import { apiUrl } from '../../utils/apiUrl';

export default function CardForm({ onProducteurAdded }: CardFormProps): JSX.Element {
  const { user } = useContext(UserAuthContext) as UserAuthContextType;
  const isProducer = user?.role === 'PRODUCER';

  const [name, setName] = useState<string>('');
  const [nameEnterprise, setNameEnterprise] = useState<string>('');
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [typeAgriculture, setTypeAgriculture] = useState<string>('ab');
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [profileExtra, setProfileExtra] = useState<ProducerProfileFormState>(() =>
    emptyProducerProfileFormState()
  );

  const [nameError, setNameError] = useState<string>("");
  const [nameEnterpriseError, setNameEnterpriseError] = useState<string>("");
  const [addressError, setAddressError] = useState<string>("");

  const [userProducteurValid, setUserProducteurValid] = useState<boolean>(false);
  const [userEnterpriseValid, setUserEnterpriseValid] = useState<boolean>(false);
  const [userAddressValid, setUserAddressValid] = useState<boolean>(false);

  const addressSearchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const address = e.target.value;
    setSelectedAddress(address);

    const userAddressValidation = validateAddress(address);
    setAddressError(userAddressValidation.error);
    setUserAddressValid(userAddressValidation.isValid);

    if (addressSearchTimer.current) {
      clearTimeout(addressSearchTimer.current);
    }

    if (address.trim().length <= 2) {
      setSuggestions([]);
      return;
    }

    addressSearchTimer.current = setTimeout(() => {
      void (async () => {
        try {
          const results = await searchAddress(address);
          setSuggestions(results);
        } catch (error) {
          console.error('Erreur lors de la récupération des suggestions:', (error as Error).message);
          setSuggestions([]);
        }
      })();
    }, 350);
  };

  const handleAddressSelect = (address: string): void => {
    setSelectedAddress(address);
    setSuggestions([]); 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      const { latitude, longitude }: { latitude: number; longitude: number } = await geocodeAddress(selectedAddress);

      const basePayload = {
        name,
        nameEnterprise,
        address: selectedAddress,
        latitude,
        longitude,
        marker: typeAgriculture,
      };
      const producerPayload = isProducer
        ? {
            ...basePayload,
            profileImageUrl: profileExtra.profileImageUrl,
            description: profileExtra.description.trim() || null,
            tags: profileExtra.tags,
            sellsCategories: profileExtra.sellsCategories,
            phone: profileExtra.phone.trim() || null,
            contactEmail: profileExtra.contactEmail.trim() || null,
            website: profileExtra.website.trim() || null,
            instagram: profileExtra.instagram.trim() || null,
            facebook: profileExtra.facebook.trim() || null,
          }
        : basePayload;

      const res = await fetch(apiUrl('/api/producteurs'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(producerPayload),
      });

      if (res.status === 409) {
        errorMessage("Cette adresse existe déjà dans la base de données.");
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const created = (await res.json()) as { status?: string };
      onProducteurAdded();

      if (created.status === "PENDING") {
        successMessage(
          "Fiche envoyée — elle apparaîtra sur la carte après validation par un modérateur."
        );
      } else {
        successMessage("Producteur ajouté avec succès 🚀");
      }

      setName('');
      setNameEnterprise('');
      setSelectedAddress('');
      setTypeAgriculture('ab');
      setSuggestions([]);
      setProfileExtra(emptyProducerProfileFormState());
    } catch (error) {
      console.error("Erreur lors de l'ajout du producteur :", (error as Error).message);
      errorMessage("Erreur lors de l'ajout du producteur");
    }
  };

  return (
    <form className="producer-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Nom du producteur</label>
        <Input 
          type='text'
          id="name" 
          placeholder="Nom du producteur..." 
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            const validation = validateNameProducteur(e.target.value);
            setNameError(validation.error);
            setUserProducteurValid(validation.isValid);
          }}
        />
        {nameError && <div className="error-message">{nameError}</div>}
        {name && (userProducteurValid ? <FaCheckCircle className="valid-icon" /> : <FaTimesCircle className="invalid-icon" />)}
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
                  const picked = suggestion.display_name;
                  handleAddressSelect(picked);
                  const validation = validateAddress(picked);
                  setAddressError(validation.error);
                  setUserAddressValid(validation.isValid);
                }}
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
        {addressError && <div className="error-message">{addressError}</div>}
        {selectedAddress && (userAddressValid ? <FaCheckCircle className="valid-icon" /> : <FaTimesCircle className="invalid-icon" />)}
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
            const validation = validateNameEnterprise(e.target.value);
            setNameEnterpriseError(validation.error);
            setUserEnterpriseValid(validation.isValid);
          }}
        />
        {nameEnterpriseError && <div className="error-message">{nameEnterpriseError}</div>}
        {nameEnterprise && (userEnterpriseValid ? <FaCheckCircle className="valid-icon" /> : <FaTimesCircle className="invalid-icon" />)}
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
          <option value="ab">Agriculture biologique</option>
          <option value="venteDirect">Vente directe</option>
        </select>
      </div>
      {isProducer && (
        <ProducerProfileFields value={profileExtra} onChange={setProfileExtra} />
      )}
      <Button
        type="submit"
        text="Envoyer" 
        className='btn btn-primary'
      />
    </form>
  );
}
