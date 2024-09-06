export type IconOption = {
  iconUrl: string;
  className?: string;
  iconSize: [number, number];
};

export type GeocodeResult = {
  latitude: number;
  longitude: number;
};

export type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export type SuggestionType = {
  display_name: string;
};