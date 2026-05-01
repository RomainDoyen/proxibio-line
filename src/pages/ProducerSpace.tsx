import { useCallback, useEffect, useState } from "react";
import { errorMessage, successMessage } from "../utils/customToast";
import type { ProducteurType } from "../types/productTypes";
import Button from "../components/ui/Button";
import "./ProducerSpace.css";
import { EditProducerForm } from "../components/features/EditProducerForm";
import { apiUrl } from "../utils/apiUrl";

export default function ProducerSpace(): JSX.Element {
  const [items, setItems] = useState<ProducteurType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProducteurType | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/producteurs/mine"), { credentials: "include" });
      if (!res.ok) {
        throw new Error("load");
      }
      const data = (await res.json()) as ProducteurType[];
      setItems(data);
    } catch {
      errorMessage("Impossible de charger tes fiches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const removeProducteur = async (p: ProducteurType) => {
    if (
      !window.confirm(
        `Supprimer la fiche « ${p.nameEnterprise} » ? Elle disparaîtra de la carte. Cette action est définitive.`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(apiUrl(`/api/producteurs/${p.id}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (res.status === 403) {
        errorMessage("Tu n’as pas le droit de supprimer cette fiche");
        return;
      }
      if (res.status === 404) {
        errorMessage("Fiche introuvable");
        void load();
        return;
      }
      if (!res.ok) {
        errorMessage("Suppression impossible");
        return;
      }
      if (editing?.id === p.id) {
        setEditing(null);
      }
      successMessage("Fiche supprimée");
      void load();
    } catch {
      errorMessage("Erreur réseau");
    }
  };

  if (loading) {
    return (
      <div className="producer-space">
        <p className="producer-space-loading">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="producer-space">
      <header className="producer-space-header">
        <h1 className="producer-space-title">Espace producteur</h1>
        <p className="producer-space-lead">
          Retrouve ici les points de vente rattachés à ton compte : modification ou suppression. Les
          contributions « carte ouverte » (sans compte producteur) restent gérées depuis la carte
          principale.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="glass-panel producer-space-empty">
          <p>
            Aucune fiche ne t’est encore attribuée. Ajoute un producteur depuis l’accueil : en tant
            que <strong>producteur</strong>, chaque nouvel envoi sera lié à ton compte.
          </p>
        </div>
      ) : (
        <ul className="producer-space-list">
          {items.map((p) => (
            <li key={p.id} className="glass-panel producer-space-card">
              <div className="producer-space-card-main">
                <h2>{p.name}</h2>
                <p className="producer-space-enterprise">{p.nameEnterprise}</p>
                <p className="producer-space-address">{p.address}</p>
              </div>
              <div className="producer-space-card-actions">
                <Button
                  type="button"
                  text="Modifier"
                  className="producer-space-edit-btn"
                  onClick={() => setEditing(p)}
                />
                <Button
                  type="button"
                  text="Supprimer"
                  className="producer-space-delete-btn"
                  onClick={() => void removeProducteur(p)}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {editing && (
        <EditProducerForm
          producteur={editing}
          onCancel={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            void load();
            successMessage("Fiche mise à jour");
          }}
        />
      )}
    </div>
  );
}
