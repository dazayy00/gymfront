import { useState } from "react";

const Login = ({ onLogin }) => {
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res  = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        onLogin();
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch {
      setError("No se pudo conectar al servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">🏋️</div>
          <div>
            <div className="login-title">GymPro</div>
            <div className="login-sub">Panel de administración</div>
          </div>
        </div>

        {/* Form card */}
        <div className="card card-p">
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>
            Iniciar sesión
          </h2>

          {error && (
            <div className="alert alert-error">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <input
                className="form-input"
                type="email"
                placeholder="admin@gym.com"
                value={form.email}
                autoComplete="email"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Contraseña</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={form.password}
                autoComplete="current-password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Entrar →"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 16, color: "var(--text-muted)", fontSize: 12 }}>
          GymPro © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Login;