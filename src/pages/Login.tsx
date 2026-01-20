import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, verify2fa } from "../api/auth";
import { useToast } from "../ToastContext";
import { useAuth } from "../hooks";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { login: setUserInContext } = useAuth();

  const [require2FA, setRequire2FA] = useState(false);
  const [twoFACode, setTwoFACode] = useState("");
  

  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await login(email, password);

      // if backend responds with require2FA
      if (res.require2FA) {
        setRequire2FA(true);
        showToast("2FA is required. Enter the code from your Authenticator app.");
        return;
      }

      // normal login
      setUserInContext(res.accessToken);
      navigate("/");

    } catch (e) {
      showToast("Couldn't log in. Try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleVerify2FA = async () => {
    try {
      setLoading(true);
      const res = await verify2fa(email, parseInt(twoFACode)); // call your /verify-2fa API
      setUserInContext(res.accessToken);
      navigate("/");
    } catch (e) {
      showToast("Invalid 2FA code");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Career Hub</h1>

        {!require2FA && (
          <>
            <input 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <input type="password" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin} disabled={loading} className="disabled:opacity-50">
              {loading ? "Logging in…" : "Login"}
            </button>
          </>
        )}

        {require2FA && (
          <>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              value={twoFACode}
              onChange={(e) => setTwoFACode(e.target.value)}
            />
            <button onClick={handleVerify2FA} disabled={loading} className="disabled:opacity-50">
              {loading ? "Verifying…" : "Verify 2FA"}
            </button>
          </>
        )}

        <p>Don’t have an account? <Link to="/register"><span style={{textDecoration:"underline"}}>Register</span></Link></p>

      </div>
    </div>
  );
}