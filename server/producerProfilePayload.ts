/** Doit rester aligné avec src/constants/producerProfile.ts (ids seulement) */
const TAG_IDS = new Set([
  'apiculture',
  'maraichage',
  'elevage',
  'viticulture',
  'arboriculture',
  'cereales',
  'transformation',
  'horticulture',
  'aquaculture',
  'autre_activite',
]);

const SELLS_IDS = new Set([
  'fruits',
  'legumes',
  'oeufs',
  'volailles',
  'porc',
  'bovin',
  'caprin',
  'poisson',
  'miel',
  'vin',
  'fromage',
  'plantes',
  'fleur',
  'autre_produit',
]);

const MAX_IMAGE_LEN = 600_000;
const MAX_DESC = 5_000;
const MAX_ARR_ITEMS = 24;
const MAX_ITEM_LEN = 64;
const MAX_SHORT = 500;
const MAX_PHONE = 40;
const MAX_EMAIL = 320;

export type SanitizedProducerProfile = {
  profileImageUrl: string | null;
  description: string | null;
  tags: string[];
  sellsCategories: string[];
  phone: string | null;
  contactEmail: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
};

function sanitizeIdArray(raw: unknown, allowed: Set<string>): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const x of raw) {
    if (typeof x !== 'string') continue;
    const id = x.trim().slice(0, MAX_ITEM_LEN);
    if (!id || !allowed.has(id)) continue;
    out.push(id);
  }
  return [...new Set(out)].slice(0, MAX_ARR_ITEMS);
}

function strOrNull(raw: unknown, max: number): string | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw !== 'string') return null;
  const t = raw.trim();
  if (!t) return null;
  return t.slice(0, max);
}

function sanitizeImageUrl(raw: unknown): string | null {
  const s = strOrNull(raw, MAX_IMAGE_LEN);
  if (!s) return null;
  if (s.startsWith('data:image/jpeg') || s.startsWith('data:image/png') || s.startsWith('data:image/webp')) {
    return s;
  }
  if (s.startsWith('https://') || s.startsWith('http://')) {
    return s;
  }
  return null;
}

function looseEmail(raw: unknown): string | null {
  const s = strOrNull(raw, MAX_EMAIL);
  if (!s) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return null;
  return s;
}

export function sanitizeProducerProfileBody(body: Record<string, unknown>): SanitizedProducerProfile {
  return {
    profileImageUrl: sanitizeImageUrl(body.profileImageUrl),
    description: strOrNull(body.description, MAX_DESC),
    tags: sanitizeIdArray(body.tags, TAG_IDS),
    sellsCategories: sanitizeIdArray(body.sellsCategories, SELLS_IDS),
    phone: strOrNull(body.phone, MAX_PHONE),
    contactEmail: looseEmail(body.contactEmail),
    website: strOrNull(body.website, MAX_SHORT),
    instagram: strOrNull(body.instagram, MAX_SHORT),
    facebook: strOrNull(body.facebook, MAX_SHORT),
  };
}
