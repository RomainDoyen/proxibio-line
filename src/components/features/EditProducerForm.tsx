import { useRef, useState } from "react";
import { geocodeAddress, searchAddress } from "../../api/address";
import { errorMessage } from "../../utils/customToast";
import type { ProducteurType } from "../../types/productTypes";
import type { SearchResult } from "../../types/mapTypes";
import Input from "../ui/Input";
import { validateNameEnterprise, validateNameProducteur, validateAddress } from "../../utils/CheckForm";
import { ProducerProfileFields } from "./ProducerProfileFields";
import {
  profileStateFromProducteur,
  type ProducerProfileFormState,
} from "../../utils/producerProfileFormState";
import "./EditProducerForm.css";

export type EditProducerFormProps = {
  producteur: ProducteurType;
  title?: string;
  onCancel: () => void;
  onSaved: () => void;
};

export function EditProducerForm({
  producteur,
  title = "Modifier la fiche",
  onCancel,
  onSaved,
}: EditProducerFormProps): JSX.Element {
  const pos = producteur.positionProducteur[0];
  const [name, setName] = useState(producteur.name);
  const [nameEnterprise, setNameEnterprise] = useState(producteur.nameEnterprise);
  const [address, setAddress] = useState(producteur.address);
  const [marker, setMarker] = useState(pos?.marker ?? "ab");
  const [profile, setProfile] = useState<ProducerProfileFormState>(() =>
    profileStateFromProducteur(producteur)
  );
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const v = e.target.value;
    setAddress(v);
    if (timer.current) clearTimeout(timer.current);
    if (v.trim().length <= 2) {
      setSuggestions([]);
      return;
    }
    timer.current = setTimeout(() => {
      void searchAddress(v).then(setSuggestions).catch(() => setSuggestions([]));
    }, 350);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const vName = validateNameProducteur(name);
    const vEnt = validateNameEnterprise(nameEnterprise);
    const vAddr = validateAddress(address);
    if (!vName.isValid || !vEnt.isValid || !vAddr.isValid) {
      errorMessage("Vérifie les champs obligatoires");
      return;
    }
    setSubmitting(true);
    try {
      const { latitude, longitude } = await geocodeAddress(address);
      const res = await fetch(`/api/producteurs/${producteur.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          nameEnterprise,
          address,
          latitude,
          longitude,
          marker,
          profileImageUrl: profile.profileImageUrl,
          description: profile.description.trim() || null,
          tags: profile.tags,
          sellsCategories: profile.sellsCategories,
          phone: profile.phone.trim() || null,
          contactEmail: profile.contactEmail.trim() || null,
          website: profile.website.trim() || null,
          instagram: profile.instagram.trim() || null,
          facebook: profile.facebook.trim() || null,
        }),
      });
      if (res.status === 409) {
        errorMessage("Cette adresse est déjà utilisée par une autre fiche");
        return;
      }
      if (!res.ok) {
        errorMessage("Mise à jour impossible");
        return;
      }
      onSaved();
    } catch {
      errorMessage("Erreur lors de la mise à jour");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="edit-producer-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-producer-title"
    >
      <div className="edit-producer-sheet glass-panel">
        <h2 id="edit-producer-title">{title}</h2>
        <form className="edit-producer-form" onSubmit={(e) => void handleSubmit(e)}>
          <div className="form-group">
            <label htmlFor="edit-pe-name">Nom du producteur</label>
            <Input
              id="edit-pe-name"
              type="text"
              placeholder="Nom…"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group edit-producer-form-group--addr">
            <label htmlFor="edit-pe-address">Adresse</label>
            <Input
              id="edit-pe-address"
              type="text"
              placeholder="Adresse complète…"
              value={address}
              onChange={handleAddressChange}
            />
            {suggestions.length > 0 && (
              <ul className="edit-producer-suggestions">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setAddress(s.display_name);
                      setSuggestions([]);
                    }}
                  >
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="edit-pe-enterprise">Nom de l’entreprise</label>
            <Input
              id="edit-pe-enterprise"
              type="text"
              placeholder="Entreprise…"
              value={nameEnterprise}
              onChange={(e) => setNameEnterprise(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="edit-pe-marker">Type d’agriculture</label>
            <select
              id="edit-pe-marker"
              className="edit-producer-select"
              value={marker}
              onChange={(e) => setMarker(e.target.value)}
            >
              <option value="ab">Agriculture biologique</option>
              <option value="venteDirect">Vente directe</option>
            </select>
          </div>
          <ProducerProfileFields value={profile} onChange={setProfile} />
          <div className="edit-producer-actions">
            <button type="button" className="edit-producer-btn-secondary" onClick={onCancel}>
              Annuler
            </button>
            <button type="submit" className="edit-producer-btn-primary" disabled={submitting}>
              {submitting ? "Enregistrement…" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
