import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("")

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // <-- hook to navigate
  
    const handleRegister= async () => {
      try {
        setLoading(true)
        await register(name, email, password);
        navigate("/login")
      } catch (e) {
        setError("Invalid credentials")
      }
    };
  


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create account</h1>

        <input 
          placeholder="Full Name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
         />

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

        <button onClick={handleRegister} disabled={loading} className="disabled:opacity-50">
          {loading ? "Setting up an account..." : "Register"}</button>

        <p>Already have an account? <Link to="/login"><span style={{textDecoration:"underline"}}>Log-in</span></Link></p>
          
        {error && <div className="text-red-500 mt-2">{error}</div>}

      </div>
    </div>
  );
}