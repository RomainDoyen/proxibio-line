/** Options affichées dans les formulaires producteur (id stocké en base) */

export const PRODUCER_TAG_OPTIONS = [
  { id: "apiculture", label: "Apiculture" },
  { id: "maraichage", label: "Maraîchage" },
  { id: "elevage", label: "Élevage" },
  { id: "viticulture", label: "Viticulture" },
  { id: "arboriculture", label: "Arboriculture" },
  { id: "cereales", label: "Céréales / meunerie" },
  { id: "transformation", label: "Transformation" },
  { id: "horticulture", label: "Horticulture / fleurs" },
  { id: "aquaculture", label: "Aquaculture" },
  { id: "autre_activite", label: "Autre activité agricole" },
] as const;

export const PRODUCER_SELLS_OPTIONS = [
  { id: "fruits", label: "Fruits" },
  { id: "legumes", label: "Légumes" },
  { id: "oeufs", label: "Œufs" },
  { id: "volailles", label: "Volailles" },
  { id: "porc", label: "Porc / charcuterie" },
  { id: "bovin", label: "Bœuf / veau" },
  { id: "caprin", label: "Chèvre / mouton" },
  { id: "poisson", label: "Poisson" },
  { id: "miel", label: "Miel & dérivés" },
  { id: "vin", label: "Vin / jus" },
  { id: "fromage", label: "Fromages / lait" },
  { id: "plantes", label: "Plantes / aromates" },
  { id: "fleur", label: "Fleurs coupées" },
  { id: "autre_produit", label: "Autres produits" },
] as const;

export const PRODUCER_TAG_ID_SET = new Set<string>(
  PRODUCER_TAG_OPTIONS.map((o) => o.id)
);
export const PRODUCER_SELLS_ID_SET = new Set<string>(
  PRODUCER_SELLS_OPTIONS.map((o) => o.id)
);

export function labelForTagId(id: string): string {
  const o = PRODUCER_TAG_OPTIONS.find((x) => x.id === id);
  return o?.label ?? id;
}

export function labelForSellsId(id: string): string {
  const o = PRODUCER_SELLS_OPTIONS.find((x) => x.id === id);
  return o?.label ?? id;
}
