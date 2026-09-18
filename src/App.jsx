import { useState } from "react";
import Login     from "./pages/Login";
import Access    from "./pages/Access";
import Admin     from "./pages/Admin";
import UserProfile from "./pages/UserProfile";
import POS       from "./pages/POS";
import Dashboard from "./pages/Dashboard";
import Products  from "./pages/Products";
import Sales     from "./pages/Sales";
import "./index.css";

const NAV = [
  { id: "dashboard", label: "Dashboard",     icon: "📊" },
  { id: "access",    label: "Control Acceso", icon: "🚪" },
  { id: "admin",     label: "Usuarios",       icon: "👥" },
  { id: "products",  label: "Inventario",     icon: "📦" },
  { id: "pos",       label: "Punto de Venta", icon: "🛒" },
  { id: "sales",     label: "Ventas",         icon: "🧾" },
  { id: "user",      label: "Credencial",     icon: "🪪" },
];

function App() {
  const [logged, setLogged] = useState(!!localStorage.getItem("token"));
  const [view,   setView]   = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogged(false);
  };

  if (!logged) {
    return <Login onLogin={() => setLogged(true)} />;
  }

  /* La vista de Acceso QR ocupa toda la pantalla sin sidebar */
  if (view === "access") {
    return (
      <Access onBack={() => setView("dashboard")} />
    );
  }

  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🏋️</div>
          <div>
            <div className="sidebar-brand-name">GymPro</div>
            <div className="sidebar-brand-sub">Panel de control</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-label">Navegación</span>

          {NAV.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${view === item.id ? "active" : ""}`}
              onClick={() => setView(item.id)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn btn-danger btn-full btn-sm" onClick={handleLogout}>
            🔒 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="main-content">
        {view === "dashboard" && <Dashboard />}
        {view === "admin"     && <Admin />}
        {view === "products"  && <Products />}
        {view === "user"      && <UserProfile />}
        {view === "pos"       && <POS />}
        {view === "sales"     && <Sales />}
      </main>
    </div>
  );
}

export default App;