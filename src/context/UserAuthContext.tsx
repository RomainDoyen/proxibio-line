import { createContext, useEffect, useState } from "react";
import { account } from "../config/index";
import { User, UserAuthContextType, UserProviderProps } from "../types/types";

export const UserAuthContext = createContext<UserAuthContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response: User = await account.get(); 
        setUser(response); 
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserAuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserAuthContext.Provider>
  );
};