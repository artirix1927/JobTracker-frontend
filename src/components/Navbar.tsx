import type { CSSProperties } from "react";

export default function Navbar({ isLoggedIn = false, username = "" }) {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>JobTracker</div>

      <div style={styles.links}>
        {!isLoggedIn ? (
          <>
            <a href="/login" style={styles.link}>Login</a>
            <a href="/register" style={{ ...styles.link, ...styles.register }}>Register</a>
          </>
        ) : (
          <div style={styles.profile}>
            <span>{username}</span>
            <button style={styles.logoutButton}>Logout</button>
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
  logoutButton: {
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};