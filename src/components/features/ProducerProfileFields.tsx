import { useRef } from "react";
import {
  PRODUCER_SELLS_OPTIONS,
  PRODUCER_TAG_OPTIONS,
} from "../../constants/producerProfile";
import type { ProducerProfileFormState } from "../../utils/producerProfileFormState";
import Input from "../ui/Input";
import { fileToResizedDataUrl } from "../../utils/resizeImageFile";
import { errorMessage } from "../../utils/customToast";
import "./ProducerProfileFields.css";

type Props = {
  value: ProducerProfileFormState;
  onChange: (next: ProducerProfileFormState) => void;
};

export function ProducerProfileFields({ value, onChange }: Props): JSX.Element {
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<ProducerProfileFormState>) => {
    onChange({ ...value, ...patch });
  };

  const toggleId = (field: "tags" | "sellsCategories", id: string) => {
    const arr = value[field];
    const next = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
    set({ [field]: next });
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      set({ profileImageUrl: dataUrl });
    } catch {
      errorMessage("Image invalide ou trop lourde");
    }
  };

  return (
    <div className="producer-profile-fields">
      <h3 className="producer-profile-fields__title">Profil producteur</h3>
      <p className="producer-profile-fields__hint">
        Ces informations enrichissent ta fiche sur la carte (photo, activités, produits, contact).
      </p>

      <div className="form-group">
        <span className="producer-profile-fields__label">Photo de profil</span>
        <div className="producer-profile-photo">
          {value.profileImageUrl ? (
            <img
              src={value.profileImageUrl}
              alt=""
              className="producer-profile-photo__img"
            />
          ) : (
            <div className="producer-profile-photo__placeholder">Aperçu</div>
          )}
          <div className="producer-profile-photo__actions">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="producer-profile-photo__input"
              onChange={(e) => void onFile(e)}
            />
            <button
              type="button"
              className="producer-profile-photo__btn"
              onClick={() => fileRef.current?.click()}
            >
              Choisir une image
            </button>
            {value.profileImageUrl && (
              <button
                type="button"
                className="producer-profile-photo__btn producer-profile-photo__btn--ghost"
                onClick={() => set({ profileImageUrl: null })}
              >
                Retirer
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="producer-desc">Description</label>
        <textarea
          id="producer-desc"
          className="form-control producer-profile-fields__textarea"
          rows={4}
          maxLength={5000}
          placeholder="Présente ton exploitation, tes pratiques, tes horaires…"
          value={value.description}
          onChange={(e) => set({ description: e.target.value })}
        />
      </div>

      <fieldset className="producer-profile-fieldset">
        <legend>Type d&apos;activité</legend>
        <div className="producer-chip-grid">
          {PRODUCER_TAG_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`producer-chip${value.tags.includes(opt.id) ? " producer-chip--on" : ""}`}
              onClick={() => toggleId("tags", opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="producer-profile-fieldset">
        <legend>Ce que tu vends</legend>
        <div className="producer-chip-grid">
          {PRODUCER_SELLS_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`producer-chip${
                value.sellsCategories.includes(opt.id) ? " producer-chip--on" : ""
              }`}
              onClick={() => toggleId("sellsCategories", opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="producer-profile-fieldset">
        <legend>Contact &amp; réseaux</legend>
        <div className="producer-profile-contact-grid">
          <div className="form-group">
            <label htmlFor="producer-phone">Téléphone</label>
            <Input
              id="producer-phone"
              type="tel"
              placeholder="Ex. 0692…"
              value={value.phone}
              onChange={(e) => set({ phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="producer-email-pub">E-mail (affiché sur la fiche)</label>
            <Input
              id="producer-email-pub"
              type="email"
              placeholder="contact@…"
              value={value.contactEmail}
              onChange={(e) => set({ contactEmail: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="producer-web">Site web</label>
            <Input
              id="producer-web"
              type="url"
              placeholder="https://…"
              value={value.website}
              onChange={(e) => set({ website: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="producer-ig">Instagram</label>
            <Input
              id="producer-ig"
              type="text"
              placeholder="@page ou URL"
              value={value.instagram}
              onChange={(e) => set({ instagram: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="producer-fb">Facebook</label>
            <Input
              id="producer-fb"
              type="text"
              placeholder="Page ou URL"
              value={value.facebook}
              onChange={(e) => set({ facebook: e.target.value })}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
}
