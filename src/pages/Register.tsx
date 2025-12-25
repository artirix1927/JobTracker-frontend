import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("")
  const navigate = useNavigate(); // <-- hook to navigate
  
    const handleRegister= async () => {
      try {
        await register(name, email, password);
        navigate("/login")
      } catch (e) {
        alert("Invalid credentials");
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

        <button onClick={handleRegister}>Register</button>

        <p>Already have an account? <Link to="/login"><span style={{textDecoration:"underline"}}>Log-in</span></Link></p>

      </div>
    </div>
  );
}