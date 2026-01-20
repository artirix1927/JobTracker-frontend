import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { logout } from "../api/auth";



export default function LogoutButton() {
  const { logout: clearAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    clearAuth();
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} 
            style={{
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                cursor: "pointer",
            }}
    >
      Logout
    </button>
  );
}