// contexts/UserContext.tsx
import { createContext, useContext } from "react";

type User = { name: string; image: string; role: string } | null;

interface UserContextType {
  user: User;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) => {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
