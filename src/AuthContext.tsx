// src/context/AuthContext.tsx
import { createContext, useEffect, useState, type ReactNode } from "react";
import {jwtDecode} from "jwt-decode";

interface TokenPayload {
  id: number;
  email: string;
  role: string;
  exp: number; // optional, token expiry
}

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload: TokenPayload = jwtDecode(token);
        console.log(payload)
        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role,
        });
      } catch (e) {
        console.error("Invalid token", e);
        setUser(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    window.location.reload(); // optional
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
