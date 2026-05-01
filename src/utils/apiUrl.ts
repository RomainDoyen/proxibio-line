/** Base API en prod (ex. Vercel) : définir VITE_API_URL=https://ton-api.example.com sans slash final. En dev, vide → requêtes relatives + proxy Vite. */
export function apiUrl(path: string): string {
  const raw = import.meta.env.VITE_API_URL?.trim() ?? "";
  const base = raw.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}
