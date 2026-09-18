import { useState, useCallback } from "react";
import QRScanner from "../components/QRScanner";

const MEMBERSHIP_LABELS = {
  DAILY:   "Diaria",
  WEEKLY:  "Semanal",
  MONTHLY: "Mensual",
  YEARLY:  "Anual",
};

const Access = ({ onBack }) => {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = useCallback(async (token) => {
    if (loading) return;
    setLoading(true);

    try {
      const res  = await fetch("http://localhost:3000/api/access/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      setResult(data);

      // Sonido
      try {
        const audio = new Audio(data.success ? "/success.mp3" : "/error.mp3");
        audio.play().catch(() => {});
      } catch {}

      setTimeout(() => {
        setResult(null);
        setLoading(false);
      }, 3500);
    } catch {
      setResult({ success: false, message: "Error de conexión" });
      setTimeout(() => { setResult(null); setLoading(false); }, 3000);
    }
  }, [loading]);

  const bg = result
    ? result.success ? "#052e16" : "#1c0a0a"
    : "var(--bg-base)";

  const borderColor = result
    ? result.success ? "#22c55e" : "#ef4444"
    : "transparent";

  return (
    <div
      className="access-page"
      style={{
        background: bg,
        backgroundImage: result
          ? result.success
            ? "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(34,197,94,0.18) 0%, transparent 70%)"
            : "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(239,68,68,0.18) 0%, transparent 70%)"
          : "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(34,197,94,0.06) 0%, transparent 70%)",
      }}
    >
      {/* Back button */}
      <button
        className="btn btn-ghost btn-sm"
        onClick={onBack}
        style={{ position: "fixed", top: 20, left: 20 }}
      >
        ← Dashboard
      </button>

      {/* Scanner mode */}
      {!result && (
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🚪</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.8 }}>Control de Acceso</h1>
            <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: 14 }}>
              Escanea el código QR del socio
            </p>
          </div>

          <div
            style={{
              background: "var(--bg-card)",
              border: `2px solid var(--border-accent)`,
              borderRadius: "var(--radius-xl)",
              padding: 24,
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <QRScanner onScan={handleScan} />
          </div>
        </div>
      )}

      {/* Result mode */}
      {result && (
        <div className="access-result" style={{ width: "100%", maxWidth: 420 }}>
          <div className="access-icon">
            {result.success ? "✅" : "❌"}
          </div>

          {result.user && (
            <div className="access-name">{result.user.name}</div>
          )}

          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: result.success ? "var(--accent)" : "var(--error)",
              marginTop: result.user ? 8 : 0,
            }}
          >
            {result.message}
          </div>

          {result.success && result.user?.membershipType && (
            <div
              style={{
                marginTop: 16,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "var(--accent-muted)",
                border: "1px solid var(--border-accent)",
                borderRadius: 99,
                padding: "6px 14px",
                fontSize: 13,
                color: "var(--accent)",
                fontWeight: 600,
              }}
            >
              🏅 Membresía {MEMBERSHIP_LABELS[result.user.membershipType]}
            </div>
          )}

          {/* Progress bar auto-close */}
          <div
            style={{
              marginTop: 32,
              height: 4,
              borderRadius: 99,
              background: "rgba(255,255,255,0.1)",
              overflow: "hidden",
              width: 200,
            }}
          >
            <div
              style={{
                height: "100%",
                background: result.success ? "var(--accent)" : "var(--error)",
                borderRadius: 99,
                animation: "shrink 3.5s linear forwards",
              }}
            />
          </div>
          <style>{`@keyframes shrink { from { width: 100% } to { width: 0% } }`}</style>
        </div>
      )}
    </div>
  );
};

export default Access;