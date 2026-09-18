import { useEffect, useState } from "react";

const STATS = [
  { key: "incomeToday",     label: "Ingresos hoy",   icon: "💰", prefix: "$", accent: true },
  { key: "incomeMonth",     label: "Ingresos mes",   icon: "📈", prefix: "$" },
  { key: "totalSales",      label: "Ventas totales", icon: "🧾", prefix: ""  },
  { key: "activeUsersToday",label: "Accesos hoy",    icon: "🚪", prefix: ""  },
  { key: "visitorsToday",   label: "Visitantes hoy", icon: "👤", prefix: ""  },
];

const Dashboard = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const load = async () => {
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch("http://localhost:3000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setData(json);
    } catch {
      setError("No se pudo cargar el dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Resumen de actividad — {new Date().toLocaleDateString("es-MX", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      <div className="page-body">
        {loading && (
          <div className="empty">
            <div className="empty-icon">⏳</div>
            Cargando estadísticas…
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}

        {data && (
          <>
            <div className="stats-grid">
              {STATS.map(({ key, label, icon, prefix, accent }) => (
                <div className="stat-card" key={key}>
                  <div className="stat-icon">{icon}</div>
                  <div className="stat-label">{label}</div>
                  <div className={`stat-value ${accent ? "accent" : ""}`}>
                    {prefix}{typeof data[key] === "number"
                      ? data[key].toLocaleString("es-MX", { minimumFractionDigits: prefix === "$" ? 2 : 0 })
                      : "—"}
                  </div>
                </div>
              ))}
            </div>

            {/* Activity hint */}
            <div className="card card-p" style={{ maxWidth: 480, color: "var(--text-muted)", fontSize: 13 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>💡</span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Acceso rápido</span>
              </div>
              <p>Usa <strong style={{ color: "var(--accent)" }}>Control Acceso</strong> para escanear QRs en la entrada.</p>
              <p style={{ marginTop: 6 }}>Registra ventas en <strong style={{ color: "var(--accent)" }}>Punto de Venta</strong> y administra usuarios en <strong style={{ color: "var(--accent)" }}>Usuarios</strong>.</p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;