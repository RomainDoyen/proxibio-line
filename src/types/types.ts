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