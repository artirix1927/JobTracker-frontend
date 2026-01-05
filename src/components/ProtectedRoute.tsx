import { jwtDecode } from "jwt-decode";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";


type TokenPayload = {
  sub: string;
  email: string;
  role: string;
  exp: number;
};

export const getUserRole = (): string | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const payload: TokenPayload = jwtDecode<TokenPayload>(token);;
    return payload.role;
  } catch (e) {
    return null;
  }
};


type ProtectedRouteProps = {
  allowedRoles: string[];
  children: JSX.Element;
};

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const role = getUserRole();

  if (!role || !allowedRoles.includes(role)) {
    // Redirect if not logged in or role not allowed
    return <Navigate to="/login" replace />;
  }

  return children;
};