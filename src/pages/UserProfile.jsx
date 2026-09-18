import { useState } from "react";

const API = "http://localhost:3000/api";
const authH = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const MEM_LABEL = { DAILY: "Diaria", WEEKLY: "Semanal", MONTHLY: "Mensual", YEARLY: "Anual" };

const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

const UserProfile = () => {
  const [userId,   setUserId]   = useState("");
  const [userData, setUserData] = useState(null);
  const [qrImage,  setQrImage]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const [memData,     setMemData]     = useState(null);  // active membership

  const loadUser = async () => {
    if (!userId.trim()) return;
    setError("");
    setLoading(true);
    try {
      // Get user list and find by id (simple approach)
      const res  = await fetch(`${API}/users`, { headers: authH() });
      const data = await res.json();
      const user = (data.data || []).find((u) => u.id === Number(userId));

      if (!user) {
        setError("Usuario no encontrado");
        setUserData(null);
        return;
      }

      setUserData(user);

      // Fetch memberships
      const mRes  = await fetch(`${API}/memberships/${user.id}`, { headers: authH() });
      const mData = await mRes.json();
      const active = (mData.data || []).find(
        (m) => m.status === "ACTIVE" && new Date(m.endDate) > new Date()
      );
      setMemData(active || null);

      // QR desde backend (evita instalar paquete extra en frontend)
      setQrImage(`${API}/users/${user.id}/qr`);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Credencial Digital</h1>
        <p className="page-subtitle">Genera la credencial QR de un socio</p>
      </div>

      <div className="page-body">
        {/* Search */}
        <div className="card card-p mb-6" style={{ maxWidth: 480 }}>
          <div className="form-group" style={{ marginBottom: 12 }}>
            <label className="form-label">ID del socio</label>
            <input
              className="form-input"
              type="number"
              placeholder="Ej: 1, 2, 3…"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadUser()}
            />
          </div>
          <button
            className="btn btn-primary btn-full"
            onClick={loadUser}
            disabled={loading || !userId.trim()}
          >
            {loading ? "Buscando..." : "🔍 Generar credencial"}
          </button>

          {error && (
            <div className="alert alert-error" style={{ marginTop: 12, marginBottom: 0 }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Credential */}
        {userData && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="credential-card">
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 20,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.06em" }}>
                  GYMPEG PRO
                </div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>#{userData.id}</div>
              </div>

              {/* Avatar */}
              <div className="credential-avatar">
                {userData.imageUrl
                  ? <img src={userData.imageUrl} alt={userData.name} />
                  : initials(userData.name)}
              </div>

              <div className="credential-name">{userData.name}</div>

              <div style={{ marginBottom: 16, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                {memData ? (
                  <>
                    <span className="badge badge-green">● Activo</span>
                    <span className="badge badge-blue">
                      {MEM_LABEL[memData.type]}
                    </span>
                  </>
                ) : (
                  <span className="badge badge-red">Sin membresía</span>
                )}
              </div>

              {/* QR */}
              {qrImage ? (
                <div className="credential-qr">
                  <img src={qrImage} alt="QR Code" />
                </div>
              ) : (
                <div style={{
                  width: 160, height: 160, margin: "0 auto 16px",
                  background: "var(--bg-hover)", borderRadius: "var(--radius-md)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-muted)", fontSize: 13,
                }}>
                  Sin QR
                </div>
              )}

              {memData && (
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  Vence: {fmtDate(memData.endDate)}
                </div>
              )}

              {userData.phone && (
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                  📞 {userData.phone}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfile;