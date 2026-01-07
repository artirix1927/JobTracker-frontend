import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";


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




export function ProtectedRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const userRole = getUserRole(); // string | null

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}