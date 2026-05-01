export type UserRole = 'USER' | 'PRODUCER' | 'ADMIN';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export type UserAuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
};

export type UserProviderProps = {
  children: React.ReactNode;
};

export type Session = {
  userId: string;
  providerUid: string;
  clientName: string;
};