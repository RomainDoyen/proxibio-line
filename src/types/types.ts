export type User = {
  name?: string;
  email: string;
  id?: string;
  providerUid?: string;
};

export type UserAuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

export type UserProviderProps = {
  children: React.ReactNode;
};

export type Session = {
  userId: string;
  providerUid: string;
  clientName: string;
};

export type IconOption = {
  iconUrl: string;
  className?: string;
  iconSize: [number, number];
};

export type ProducteurType = {
  id: number;
  name: string;
  nameEnterprise: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  positionProducteur: PositionProducteurType[];
}

export type PositionProducteurType = {
  id: number;
  producteurId: number;
  latitude: number;
  longitude: number;
  marker: string;
  producteur: ProducteurType;
}

export type GeocodeResult = {
  latitude: number;
  longitude: number;
}

export type SearchResult = {
  display_name: string;
  lat: string;
  lon: string;
}

export type SuggestionType = {
  display_name: string;
};

export type CardFormProps = {
  onProducteurAdded: () => void;
};

export type CardMapsProps = {
  refreshMap: boolean;
};

export type InputProps = {
  type: string;
  className?: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export type AvatarProps = {
  toggleDropdown: () => void;
};

export type ButtonProps = {
  type?: "button" | "submit" | "reset";
  text: string | JSX.Element;
  onClick?: () => void;
  className: string;
  icon?: JSX.Element;
}