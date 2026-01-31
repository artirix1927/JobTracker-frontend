import { useNavigate } from "react-router-dom";
import { authApi } from "../api/axios";
import { useEffect, useState } from "react";

export const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    const validateToken = async () => {
        if (!token) {
        navigate("/login");
        return;
        }

        try {
            await authApi.get("/auth/reset-password/validate", {
                params: { token },
            });
        } catch (err) {
            console.log(err);
            setIsTokenExpired(true);
        } finally {
            setLoading(false);
        }
    };

    validateToken();
    }, [token, navigate]);

  const submit = async () => {
    try {
      await authApi.post("/auth/reset-password", {
        token,
        newPassword,
      });
      navigate("/login");
    } catch (e) {
      console.error("Password reset failed", e);
    }
  };

  if (loading) return <p>Validating reset link…</p>;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Career Hub</h1>
        {!isTokenExpired ? (
            <>
                <input
                placeholder="New Password"
                value={newPassword}
                type="password"
                onChange={(e) => setNewPassword(e.target.value)}
                />

                <button onClick={submit}>
                Reset Password
                </button>
            </>
        ) : <h1>Invalid or expired reset link</h1>}

        
      </div>
    </div>
  );
};
