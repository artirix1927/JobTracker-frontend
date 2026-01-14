import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { useToast } from "../ToastContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  

  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      setLoading(true)
      await login(email, password);
      navigate("/")
    } catch (e) {
      showToast("Could'nt log in. Try again.")
    }
  };



  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Career Hub</h1>

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
          {loading ? "Logging in…" : "Login"}</button>

        <p>Don’t have an account? <Link to="/register"><span style={{textDecoration:"underline"}}>Register</span></Link></p>

      </div>
    </div>
  );
}