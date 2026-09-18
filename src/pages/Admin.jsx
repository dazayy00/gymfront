import { useEffect, useState } from "react";

const API = "http://localhost:3000/api";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const MEMBERSHIP_TYPES = [
  { value: "DAILY",   label: "Diaria  (1 día)"   },
  { value: "WEEKLY",  label: "Semanal (7 días)"   },
  { value: "MONTHLY", label: "Mensual (30 días)"  },
  { value: "YEARLY",  label: "Anual   (365 días)" },
];

const STATUS_BADGE = {
  ACTIVE:    <span className="badge badge-green">● Activo</span>,
  INACTIVE:  <span className="badge badge-red">● Inactivo</span>,
  EXPIRED:   <span className="badge badge-red">Expirada</span>,
  CANCELLED: <span className="badge badge-gray">Cancelada</span>,
};

const TYPE_BADGE = {
  DAILY:   <span className="badge badge-blue">Diaria</span>,
  WEEKLY:  <span className="badge badge-yellow">Semanal</span>,
  MONTHLY: <span className="badge badge-green">Mensual</span>,
  YEARLY:  <span className="badge badge-green">Anual</span>,
};

/* ── Helpers ── */
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });

const initials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

/* ═══════════════════════════════════════════════════════════ */
const Admin = () => {
  const [tab,      setTab]      = useState("users");     // "users" | "memberships"
  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [alert,    setAlert]    = useState(null);        // { type, msg }

  // Create user form
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [showForm, setShowForm] = useState(false);

  // Memberships tab state
  const [selectedUser,   setSelectedUser]   = useState(null);
  const [memberships,    setMemberships]    = useState([]);
  const [memLoading,     setMemLoading]     = useState(false);
  const [memType,        setMemType]        = useState("MONTHLY");
  const [memSaving,      setMemSaving]      = useState(false);

  /* ── Users ── */
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/users`, { headers: authHeaders() });
      const data = await res.json();
      setUsers(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API}/users`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: "success", msg: `Usuario "${form.name}" creado exitosamente` });
        setForm({ name: "", email: "", phone: "" });
        setShowForm(false);
        fetchUsers();
      } else {
        setAlert({ type: "error", msg: data.message || "Error al crear usuario" });
      }
    } catch {
      setAlert({ type: "error", msg: "No se pudo conectar al servidor" });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 4000);
    }
  };

  /* ── Memberships ── */
  const openMemberships = async (user) => {
    setSelectedUser(user);
    setTab("memberships");
    setMemLoading(true);
    try {
      const res  = await fetch(`${API}/memberships/${user.id}`, { headers: authHeaders() });
      const data = await res.json();
      setMemberships(data.data || []);
    } finally {
      setMemLoading(false);
    }
  };

  const handleAssignMembership = async () => {
    if (!selectedUser) return;
    setMemSaving(true);
    try {
      const res  = await fetch(`${API}/memberships`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ userId: selectedUser.id, type: memType }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: "success", msg: "Membresía asignada correctamente" });
        // refresh memberships
        const r2   = await fetch(`${API}/memberships/${selectedUser.id}`, { headers: authHeaders() });
        const d2   = await r2.json();
        setMemberships(d2.data || []);
      } else {
        setAlert({ type: "error", msg: data.message || "Error al asignar membresía" });
      }
    } catch {
      setAlert({ type: "error", msg: "Error de conexión" });
    } finally {
      setMemSaving(false);
      setTimeout(() => setAlert(null), 4000);
    }
  };

  /* ── Render ── */
  return (
    <>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">
              {tab === "users" ? "Usuarios" : `Membresías — ${selectedUser?.name}`}
            </h1>
            <p className="page-subtitle">
              {tab === "users"
                ? `${users.length} socios registrados`
                : "Gestiona las membresías del socio"}
            </p>
          </div>

          {tab === "users" && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm((v) => !v)}
            >
              {showForm ? "✕ Cancelar" : "+ Nuevo socio"}
            </button>
          )}

          {tab === "memberships" && (
            <button
              className="btn btn-ghost"
              onClick={() => { setTab("users"); setSelectedUser(null); }}
            >
              ← Volver
            </button>
          )}
        </div>
      </div>

      <div className="page-body">
        {/* Alert */}
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.type === "success" ? "✅" : "⚠️"} {alert.msg}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === "users" && (
          <>
            {/* Create form */}
            {showForm && (
              <div className="card card-p mb-6">
                <h3 style={{ fontWeight: 700, marginBottom: 16, color: "var(--text-primary)" }}>
                  Nuevo socio
                </h3>
                <form onSubmit={handleCreateUser}>
                  <div className="grid-3">
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Nombre *</label>
                      <input
                        className="form-input"
                        placeholder="Juan Pérez"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Email</label>
                      <input
                        className="form-input"
                        type="email"
                        placeholder="juan@email.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Teléfono</label>
                      <input
                        className="form-input"
                        placeholder="55 1234 5678"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Creando..." : "Crear socio"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Table */}
            {loading && !showForm ? (
              <div className="empty"><div className="empty-icon">⏳</div>Cargando usuarios…</div>
            ) : users.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">👥</div>
                <strong>Sin socios registrados</strong>
                <span>Crea el primer socio con el botón de arriba</span>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Socio</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Estado</th>
                      <th>Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="avatar">
                              {u.imageUrl
                                ? <img src={u.imageUrl} alt={u.name} />
                                : initials(u.name)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600 }}>{u.name}</div>
                              <div className="text-sm text-muted">#{u.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-muted">{u.email || "—"}</td>
                        <td className="text-muted">{u.phone || "—"}</td>
                        <td>{STATUS_BADGE[u.status]}</td>
                        <td className="text-muted">{fmtDate(u.createdAt)}</td>
                        <td>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => openMemberships(u)}
                          >
                            🏅 Membresías
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── MEMBERSHIPS TAB ── */}
        {tab === "memberships" && selectedUser && (
          <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
            {/* Assign form */}
            <div className="card card-p">
              <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Asignar membresía</h3>
              <p className="text-muted text-sm" style={{ marginBottom: 20 }}>
                Si el socio tiene una membresía activa, se extenderá automáticamente.
              </p>

              <div className="form-group">
                <label className="form-label">Tipo de membresía</label>
                <select
                  className="form-select"
                  value={memType}
                  onChange={(e) => setMemType(e.target.value)}
                >
                  {MEMBERSHIP_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-primary btn-full"
                onClick={handleAssignMembership}
                disabled={memSaving}
              >
                {memSaving ? "Guardando..." : "✅ Asignar membresía"}
              </button>
            </div>

            {/* History */}
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Historial</h3>

              {memLoading ? (
                <div className="empty"><div className="empty-icon">⏳</div>Cargando…</div>
              ) : memberships.length === 0 ? (
                <div className="empty">
                  <div className="empty-icon">📭</div>
                  Sin membresías registradas
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {memberships.map((m) => (
                    <div
                      key={m.id}
                      className="card"
                      style={{
                        padding: "14px 18px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderColor: m.status === "ACTIVE" ? "var(--border-accent)" : "var(--border)",
                      }}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-4" style={{ marginBottom: 6 }}>
                          {TYPE_BADGE[m.type]}
                          {STATUS_BADGE[m.status]}
                        </div>
                        <div className="text-sm text-muted">
                          {fmtDate(m.startDate)} → {fmtDate(m.endDate)}
                        </div>
                      </div>
                      {m.status === "ACTIVE" && (
                        <div style={{ fontSize: 22 }}>✅</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Admin;