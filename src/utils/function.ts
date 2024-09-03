import { divIcon, point, Point, DivIcon } from "leaflet";
import { IconOption, GeocodeResult, SearchResult } from "../types/types";

// export const createClusterCustomIcon = function (cluster: IconOption): DivIcon {
//   return new divIcon({
//     html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
//     className: "custom-marker-cluster",
//     iconSize: point(33, 33, true) as Point
//   });
// };

export const createClusterCustomIcon = function (cluster: IconOption): DivIcon {
  return divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true) as Point  // Assurez-vous que 'point' renvoie un Point
  });
};

export const geocodeAddress = async (address: string): Promise<GeocodeResult> => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  try {
    const response: Response = await fetch(url);
    const data: Array<{ lat: string, lon: string }> = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Error during geocoding:', error);
    throw error;
  }
};

// Recherche de l'adresse avec leaftlet
export const searchAddress = async (address: string): Promise<SearchResult[]> => {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=5`;
  try {
    const response: Response = await fetch(url);
    const data: SearchResult[] = await response.json();
    return data; // Renvoie la liste des résultats
  } catch (error) {
    console.error('Error during geocoding:', error);
    throw error;
  }
};