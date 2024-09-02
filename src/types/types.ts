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
  iconSize: [number, number];
};

export type ProducteurType = {
  id: number;
  name: string;
  nameEnteprise: string;
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