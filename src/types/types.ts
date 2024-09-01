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