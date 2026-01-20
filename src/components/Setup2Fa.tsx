import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enable2FA, verify2FaSetup } from "../api/auth";
import { useToast } from "../ToastContext";

export default function Setup2FA() {
  const [qrUrl, setQrUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQr = async () => {
      try {
        setLoading(true);
        const res = await enable2FA();
        setQrUrl(res.qrUrl);
      } catch {
        showToast("Failed to generate QR code");
      } finally {
        setLoading(false);
      }
    };

    fetchQr();
  }, []);

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      await verify2FaSetup(parseInt(code));
      showToast("Two-factor authentication enabled");
      navigate("/");
    } catch {
      showToast("Invalid code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
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
      </div>
    </div>
  );
}
