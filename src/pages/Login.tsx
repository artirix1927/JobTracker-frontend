import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      alert("Logged in");
    } catch (e) {
      alert("Invalid credentials");
      console.log(e)
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

        <button onClick={handleLogin}>Login</button>

        <p>Don’t have an account? <Link to="/register"><span style={{textDecoration:"underline"}}>Register</span></Link></p>
      </div>
    </div>
  );
}