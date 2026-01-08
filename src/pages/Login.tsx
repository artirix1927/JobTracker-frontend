import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      setLoading(true)
      await login(email, password);
      navigate("/")
    } catch (e) {
      setError("Invalid credentials")
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

        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
}