import { createContext, useEffect, useState } from "react";
import { account } from "../config/index";
import { User, UserAuthContextType, UserProviderProps } from "../types/types";

export const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true); 

  const fetchUserData = async () => {
    try {
      const response: User = await account.get(); 
      setUser(response); 
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserAuthContext.Provider>
  );
};