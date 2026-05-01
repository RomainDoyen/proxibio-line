import { useCallback, useEffect, useState } from "react";
import { errorMessage, successMessage } from "../utils/customToast";
import type { UserRole } from "../types/userTypes";
import type { ContributionStatus, ProducteurType } from "../types/productTypes";
import { EditProducerForm } from "../components/features/EditProducerForm";
import "./Admin.css";

type AdminUserRow = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
};

type AdminProducteurRow = ProducteurType & {
  createdBy?: { email: string; name: string } | null;
  owner?: { email: string; name: string } | null;
};

type StatsPayload = {
  userCount: number;
  producerCount: number;
  pendingCount: number;
  byRole: Record<string, number>;
  usersLast30Days: { date: string; count: number }[];
  producersLast30Days: { date: string; count: number }[];
};

type DupRow = {
  id: number;
  name: string;
  nameEnterprise: string;
  address: string;
  status: ContributionStatus;
};

type DupGroup = { addressKey: string; rows: DupRow[] };

const ROLES: UserRole[] = ["USER", "PRODUCER", "ADMIN"];
const STATUSES: ContributionStatus[] = ["APPROVED", "PENDING", "REJECTED"];

function downloadCsv(path: string, filename: string) {
  void (async () => {
    try {
      const res = await fetch(path, { credentials: "include" });
      if (!res.ok) {
        errorMessage("Export impossible");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      successMessage("Export téléchargé");
    } catch {
      errorMessage("Export impossible");
    }
  })();
}

function AdminBarChart({
  title,
  series,
}: {
  title: string;
  series: { date: string; count: number }[];
}): JSX.Element {
  const max = Math.max(1, ...series.map((d) => d.count));
  return (
    <div className="admin-chart">
      <p className="admin-chart-title">{title}</p>
      <div className="admin-chart-scroll">
        <div className="admin-chart-bars">
          {series.map((d) => (
            <div key={d.date} className="admin-chart-cell" title={`${d.date} : ${d.count}`}>
              <div
                className="admin-chart-bar"
                style={{ height: `${(d.count / max) * 100}%` }}
              />
              <span className="admin-chart-tick">{d.date.slice(8)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Admin(): JSX.Element {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [producteurs, setProducteurs] = useState<AdminProducteurRow[]>([]);
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [dupGroups, setDupGroups] = useState<DupGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AdminProducteurRow | null>(null);
  const [mergePick, setMergePick] = useState<Record<string, { keep: number; remove: number }>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, pRes, sRes, dRes] = await Promise.all([
        fetch("/api/admin/users", { credentials: "include" }),
        fetch("/api/admin/producteurs", { credentials: "include" }),
        fetch("/api/admin/stats", { credentials: "include" }),
        fetch("/api/admin/duplicates", { credentials: "include" }),
      ]);
      if (!uRes.ok || !pRes.ok || !sRes.ok || !dRes.ok) {
        throw new Error("chargement");
      }
      const u = (await uRes.json()) as AdminUserRow[];
      const p = (await pRes.json()) as AdminProducteurRow[];
      const s = (await sRes.json()) as StatsPayload;
      const d = (await dRes.json()) as { groups: DupGroup[] };
      setUsers(u);
      setProducteurs(p);
      setStats(s);
      setDupGroups(d.groups);
      const init: Record<string, { keep: number; remove: number }> = {};
      for (const g of d.groups) {
        if (g.rows.length >= 2) {
          init[g.addressKey] = { keep: g.rows[0].id, remove: g.rows[1].id };
        }
      }
      setMergePick(init);
    } catch {
      errorMessage("Impossible de charger l’administration");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const changeRole = async (userId: string, role: UserRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        errorMessage(
          typeof err.error === "string" ? err.error : "Mise à jour du rôle impossible"
        );
        return;
      }
      await res.json();
      void load();
      successMessage("Rôle mis à jour");
    } catch {
      errorMessage("Erreur réseau");
    }
  };

  const resetPassword = async (userId: string, email: string) => {
    const pwd = window.prompt(
      `Nouveau mot de passe pour ${email} (minimum 8 caractères). L’utilisateur pourra se connecter avec ce mot de passe.`
    );
    if (pwd === null) return;
    if (pwd.length < 8) {
      errorMessage("Le mot de passe doit faire au moins 8 caractères");
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${userId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: pwd }),
      });
      if (!res.ok) {
        errorMessage("Réinitialisation impossible");
        return;
      }
      successMessage("Mot de passe mis à jour");
    } catch {
      errorMessage("Erreur réseau");
    }
  };

  const changeProducteurStatus = async (id: number, status: ContributionStatus) => {
    try {
      const res = await fetch(`/api/admin/producteurs/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        errorMessage("Mise à jour du statut impossible");
        return;
      }
      await res.json();
      void load();
      successMessage("Statut mis à jour");
    } catch {
      errorMessage("Erreur réseau");
    }
  };

  const removeProducteur = async (id: number) => {
    if (!window.confirm("Supprimer ce producteur de la carte ?")) return;
    try {
      const res = await fetch(`/api/producteurs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        errorMessage("Suppression impossible");
        return;
      }
      setProducteurs((prev) => prev.filter((p) => p.id !== id));
      void load();
      successMessage("Producteur supprimé");
    } catch {
      errorMessage("Erreur réseau");
    }
  };

  const mergeGroup = async (addressKey: string) => {
    const pick = mergePick[addressKey];
    if (!pick || pick.keep === pick.remove) {
      errorMessage("Choisis deux fiches différentes");
      return;
    }
    if (!window.confirm(`Fusionner la fiche #${pick.remove} dans #${pick.keep} ? La fiche #${pick.remove} sera supprimée.`)) {
      return;
    }
    try {
      const res = await fetch("/api/admin/producteurs/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ keepId: pick.keep, removeId: pick.remove }),
      });
      if (!res.ok) {
        errorMessage("Fusion impossible");
        return;
      }
      void load();
      successMessage("Fiches fusionnées");
    } catch {
      errorMessage("Erreur réseau");
    }
  };

  if (loading || !stats) {
    return (
      <div className="admin-page">
        <p className="admin-loading">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1 className="admin-title">Administration</h1>
        <p className="admin-lead">
          Tableau de bord, modération des contributions (visiteurs : en attente jusqu’à validation),
          fusion des doublons, export CSV. <strong>Invitation e-mail</strong> : non prévue sans
          configuration SMTP ; utilise la réinitialisation de mot de passe pour donner accès à un
          compte.
        </p>
        <div className="admin-toolbar">
          <button
            type="button"
            className="admin-btn-export"
            onClick={() => downloadCsv("/api/admin/export/producteurs.csv", "producteurs.csv")}
          >
            Export fiches (CSV)
          </button>
          <button
            type="button"
            className="admin-btn-export"
            onClick={() => downloadCsv("/api/admin/export/users.csv", "utilisateurs.csv")}
          >
            Export utilisateurs (CSV)
          </button>
        </div>
      </header>

      <section className="admin-section glass-panel admin-panel admin-dashboard">
        <h2>Tableau de bord</h2>
        <div className="admin-kpis">
          <div className="admin-kpi">
            <span className="admin-kpi-value">{stats.userCount}</span>
            <span className="admin-kpi-label">Utilisateurs</span>
          </div>
          <div className="admin-kpi">
            <span className="admin-kpi-value">{stats.producerCount}</span>
            <span className="admin-kpi-label">Fiches producteurs</span>
          </div>
          <div className="admin-kpi admin-kpi--alert">
            <span className="admin-kpi-value">{stats.pendingCount}</span>
            <span className="admin-kpi-label">En attente modération</span>
          </div>
          <div className="admin-kpi admin-kpi--wide">
            <span className="admin-kpi-label">Par rôle</span>
            <span className="admin-kpi-roles">
              USER {stats.byRole.USER ?? 0} · PRODUCER {stats.byRole.PRODUCER ?? 0} · ADMIN{" "}
              {stats.byRole.ADMIN ?? 0}
            </span>
          </div>
        </div>
        <div className="admin-charts">
          <AdminBarChart title="Nouveaux utilisateurs (30 j.)" series={stats.usersLast30Days} />
          <AdminBarChart title="Nouvelles fiches (30 j.)" series={stats.producersLast30Days} />
        </div>
      </section>

      {dupGroups.length > 0 && (
        <section className="admin-section glass-panel admin-panel">
          <h2>Doublons potentiels (même adresse normalisée)</h2>
          <p className="admin-dup-hint">
            Choisis la fiche à <strong>conserver</strong> et celle à <strong>supprimer</strong> en
            fusionnant les données de position si besoin.
          </p>
          {dupGroups.map((g) => (
            <div key={g.addressKey} className="admin-dup-card">
              <p className="admin-dup-key">{g.addressKey}</p>
              <ul className="admin-dup-list">
                {g.rows.map((r) => (
                  <li key={r.id}>
                    #{r.id} — {r.name} / {r.nameEnterprise} — {r.status}
                  </li>
                ))}
              </ul>
              <div className="admin-dup-actions">
                <label>
                  Conserver ID
                  <select
                    className="admin-select"
                    value={mergePick[g.addressKey]?.keep ?? g.rows[0]?.id}
                    onChange={(e) =>
                      setMergePick((prev) => ({
                        ...prev,
                        [g.addressKey]: {
                          keep: Number(e.target.value),
                          remove: prev[g.addressKey]?.remove ?? g.rows[1]!.id,
                        },
                      }))
                    }
                  >
                    {g.rows.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.id} — {r.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Supprimer ID
                  <select
                    className="admin-select"
                    value={mergePick[g.addressKey]?.remove ?? g.rows[1]?.id}
                    onChange={(e) =>
                      setMergePick((prev) => ({
                        ...prev,
                        [g.addressKey]: {
                          keep: prev[g.addressKey]?.keep ?? g.rows[0]!.id,
                          remove: Number(e.target.value),
                        },
                      }))
                    }
                  >
                    {g.rows.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.id} — {r.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="admin-btn-merge"
                  onClick={() => void mergeGroup(g.addressKey)}
                >
                  Fusionner
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      <section className="admin-section glass-panel admin-panel">
        <h2>Utilisateurs</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Inscription</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.name}</td>
                  <td>
                    <select
                      className="admin-select"
                      value={u.role}
                      onChange={(e) => void changeRole(u.id, e.target.value as UserRole)}
                      aria-label={`Rôle pour ${u.email}`}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td>
                    <button
                      type="button"
                      className="admin-btn-soft"
                      onClick={() => void resetPassword(u.id, u.email)}
                    >
                      Nouveau mot de passe
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section glass-panel admin-panel">
        <h2>Producteurs ({producteurs.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Entreprise</th>
                <th>Statut</th>
                <th>Propriétaire</th>
                <th>Ajouté par</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {producteurs.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.nameEnterprise}</td>
                  <td>
                    <select
                      className="admin-select admin-select--status"
                      value={p.status ?? "APPROVED"}
                      onChange={(e) =>
                        void changeProducteurStatus(p.id, e.target.value as ContributionStatus)
                      }
                      aria-label={`Statut fiche ${p.id}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{p.owner?.email ?? "—"}</td>
                  <td>{p.createdBy?.email ?? "—"}</td>
                  <td className="admin-actions-cell">
                    <button
                      type="button"
                      className="admin-btn-soft"
                      onClick={() => setEditing(p)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="admin-btn-danger"
                      onClick={() => void removeProducteur(p.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {editing && (
        <EditProducerForm
          producteur={editing}
          title="Modifier la fiche (admin)"
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
