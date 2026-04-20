import { useState } from "react";
import Access from "./pages/Access";
import Admin from "./pages/Admin";
import UserProfile from "./pages/UserProfile";
import POS from "./pages/POS";

function App() {
  const [view, setView] = useState("access");

  return (
    <div>
      <nav style={{ padding: "10px" }}>
        <button onClick={() => setView("access")}>Acceso</button>
        <button onClick={() => setView("admin")}>Admin</button>
        <button onClick={() => setView("user")}>Credencial</button>
        <button onClick={() => setView("pos")}>POS</button>
      </nav>

      {view === "access" && <Access />}
      {view === "admin" && <Admin />}
      {view === "user" && <UserProfile />}
      {view === "pos" && <POS />}
    </div>
  );
}

export default App;