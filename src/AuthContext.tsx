// src/context/AuthContext.tsx
import { createContext, useEffect, useState, type ReactNode } from "react";
import {jwtDecode} from "jwt-decode";

export interface TokenPayload {
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
  login: (token: string) => void;
  logout: () => void;
}

interface Props {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    const payload: TokenPayload = jwtDecode(token);
    setUser({ id: payload.id, email: payload.email, role: payload.role });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      login(token); // initialize user on app start
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
