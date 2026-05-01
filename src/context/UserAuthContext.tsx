import { createContext, useEffect, useState } from "react";
import { User, UserAuthContextType, UserProviderProps } from "../types/userTypes";
import { apiUrl } from "../utils/apiUrl";

export const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserData = async () => {
    try {
      const res = await fetch(apiUrl("/api/auth/me"), { credentials: "include" });
      if (res.status === 401) {
        setUser(null);
        return;
      }
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = (await res.json()) as User;
      setUser(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur :", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, setUser, isLoading, refreshUser: fetchUserData }}>
      {children}
    </UserAuthContext.Provider>
  );
};
