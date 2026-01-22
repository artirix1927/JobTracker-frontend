import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import type { TokenPayload } from "../AuthContext";

export function ProtectedRoute({ allowedRoles }: { allowedRoles: string[] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {

    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const payload = jwtDecode<TokenPayload>(token);
        if (payload.exp * 1000 < Date.now()) {
          logout();
          navigate("/login", { replace: true });
        }
      } catch {
        logout();
        navigate("/login", { replace: true });
      }
    }

    if (!allowedRoles.includes(user.role)) {
      navigate("/", { replace: true });
    }
  }, [user, logout, navigate, allowedRoles]);

  if (!user) return null;

  return <Outlet />;
}