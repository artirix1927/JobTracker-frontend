import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enable2FA, verify2FaSetup } from "../api/auth";
import { isAxiosError } from "axios";

export default function Setup2FA() {
  const [qrUrl, setQrUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchQr = async () => {
      try {
        setLoading(true);
        setInfoMessage(null);

        const res = await enable2FA();
        setQrUrl(res.qrUrl);
      } catch (err) {
        if (isAxiosError(err)) {
          const message = err.response?.data?.error;

          if (message === "2FA is already enabled") {
            setInfoMessage("Two-factor authentication is already enabled.");
            return;
          }

          setInfoMessage(message ?? "Failed to generate QR code");
        } else {
          setInfoMessage("Unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQr();
  }, []);

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      setInfoMessage(null);

      await verify2FaSetup(parseInt(code));
      navigate("/");
    } catch (err) {
      if (isAxiosError(err)) {
        setInfoMessage(
          err.response?.data?.error ?? "Invalid code. Try again."
        );
      } else {
        setInfoMessage("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {infoMessage && (
          <div
            style={{
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "6px",
              marginBottom: "12px",
              fontSize: "14px",
              color: "#333",
              textAlign: "center",
            }}
          >
            {infoMessage}
          </div>
        )}
        {!infoMessage && (<>
          <h1>Career Hub</h1>
          <h3>Set up Two-Factor Authentication</h3>
          {qrUrl && (
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <img
                src={qrUrl}
                alt="Scan QR code"
                style={{ width: 180, height: 180 }}
              />
            </div>
          )}

          <p style={{ fontSize: "14px", color: "#666", marginBottom: "12px" }}>
            Scan the QR code using Google Authenticator, then enter the 6-digit
            code below to enable 2FA.
          </p>

          <input
            type="text"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />

          <button
            onClick={handleVerifyCode}
            disabled={loading || code.length !== 6}
            className="disabled:opacity-50"
          >
            {loading ? "Verifying…" : "Enable 2FA"}
          </button>
        </>)}
        
      </div>
    </div>
  );
}
