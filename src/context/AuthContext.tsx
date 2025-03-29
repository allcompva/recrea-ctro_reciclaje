import React, { createContext, useState, useContext, ReactNode } from "react";

type User = {
    Id: number;
    nombre: string;
    georeferencia: string;
    direccion: string;
    cel: string;
    mail: string;
    contrato: string;
    pass: string;
    cuit_responsable: string;
    data: string;
    qr_image: any;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
