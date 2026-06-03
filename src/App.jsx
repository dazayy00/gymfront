import { useState } from "react";

import Login from "./pages/Login";
import Access from "./pages/Access";
import Admin from "./pages/Admin";
import UserProfile from "./pages/UserProfile";
import POS from "./pages/POS";
import Dashboard from "./pages/Dashboard";

function App() {
  const [logged, setLogged] = useState(
    !!localStorage.getItem("token")
  );

  const [view, setView] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogged(false);
  };

  if (!logged) {
    return (
      <Login
        onLogin={() => setLogged(true)}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111",
        color: "white",
      }}
    >
      <nav
        style={{
          padding: "10px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          borderBottom: "1px solid #333",
        }}
      >
        <button onClick={() => setView("dashboard")}>
          Dashboard
        </button>
        <button onClick={() => setView("access")}>
          Acceso
        </button>
        <button onClick={() => setView("admin")}>
          Admin
        </button>
        <button onClick={() => setView("user")}>
          Credencial
        </button>
        <button onClick={() => setView("pos")}>
          POS
        </button>
        <button
          onClick={handleLogout}
          style={{
            marginLeft: "auto",
            background: "#ef4444",
            color: "white",
          }}
        >
          Cerrar sesión
        </button>
      </nav>

      <main style={{ padding: "20px" }}>
        {view === "dashboard" && <Dashboard />}
        {view === "access" && <Access />}
        {view === "admin" && <Admin />}
        {view === "user" && <UserProfile />}
        {view === "pos" && <POS />}
      </main>
    </div>
  );
}

export default App;