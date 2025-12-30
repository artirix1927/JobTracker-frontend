import type { CSSProperties } from "react";
import Clock from "../components/Clock";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ margin: 0, padding: 0, position: "relative" }}>
      {/* <Navbar /> */}

      {/* Blurred image */}
      <div style={styles.imageWrapper}>
        <div style={styles.imageSection}></div>
      </div>

      {/* Content on top */}
      {/* <div style={styles.content}>
        
      </div> */}
      <div style={{textAlign:"center", margin: "40px auto", fontSize:"2rem",  fontWeight:"bold"}}>
        <label>💼 CAREER HUB 💼</label>
        
        <div style={{ display: "flex", flexDirection: "row", gap: "16px", justifyContent: "center", marginTop: "40px" }}>
            <Link to="/jobs"><button style={styles.button}>LOOK FOR OPPORTUNITIES</button></Link>
            <Link to="/login"><button style={{ ...styles.button, backgroundColor: "#2563eb", color: "#ffffff" }}>REVIEW APPLICATIONS</button></Link>
        </div>
        <Clock></Clock>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: "33vh",
    overflow: "hidden",
  },
  imageSection: {
    backgroundImage: 'url("/src/assets/modern-minimalist-office-black-white.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    height: "100%",
    filter: "blur(4px)",
    transform: "scale(1.1)", // slightly scale so edges are not visible
  },
  content: {
    position: "relative",
    padding: "32px",
    textAlign: "center",
    marginTop: "-40vh", // pull content up over the image if needed
    color: "#111827",
  },

   button: {
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: 500,
    borderRadius: "8px",
    border: "1px solid #2563eb",
    backgroundColor: "#ffffff",
    color: "#2563eb",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
};