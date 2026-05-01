import { GeocodeResult, SearchResult } from "../types/mapTypes";

async function fetchPlaces(address: string, limit: number): Promise<SearchResult[]> {
  const res = await fetch(
    `/api/places/search?q=${encodeURIComponent(address)}&limit=${limit}`
  );
  if (!res.ok) {
    throw new Error(`Geocoding HTTP ${res.status}`);
  }
  return res.json() as Promise<SearchResult[]>;
}

export const geocodeAddress = async (address: string): Promise<GeocodeResult> => {
  const data = await fetchPlaces(address, 1);
  if (data.length > 0) {
    const { lat, lon } = data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  }
  throw new Error("No results found");
};

export const searchAddress = async (address: string): Promise<SearchResult[]> => {
  return fetchPlaces(address, 5);
};
