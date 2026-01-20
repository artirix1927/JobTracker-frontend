import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks";
import LogoutButton from "./LogoutButton";

export default function Navbar({
}) {
  const { user } = useAuth();

  const isLoggedIn = !!user;

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}><Link to="/">JobTracker</Link></div>

      <div style={styles.links}>
        {!isLoggedIn ? (
          <>
            <Link to="/my-jobs" style={styles.link}>Employers/Post Job</Link>
            {/* <a href="/register" style={{ ...styles.link, ...styles.register }}>Register</a> */}
          </>
        ) : (
          <div style={styles.profile}>
      
            <Link to="/enable-2fa" style={styles.link}>
              Enable 2FA
            </Link>

            <LogoutButton />
          </div>
        )}
      </div>
    </nav>
  );
}

const styles: Record<string, CSSProperties> = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    backgroundColor: "#ffffff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  logo: {
    fontWeight: "bold",
    fontSize: "20px",
    color: "#2563eb",
  },
  links: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "#111827",
    fontWeight: 500,
  },
  register: {
    color: "#2563eb",
    fontWeight: "bold",
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
};