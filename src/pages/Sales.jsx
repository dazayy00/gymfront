import { useEffect, useState } from "react";

const API = "http://localhost:3000/api";
const authH = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/sales`, { headers: authH() });
      const data = await res.json();
      setSales(data);
    } catch {
      setError("Error al cargar ventas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSales(); }, []);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Historial de Ventas</h1>
        <p className="page-subtitle">Registro de transacciones de punto de venta</p>
      </div>

      <div className="page-body">
        {error && <div className="alert alert-error">⚠️ {error}</div>}

        {loading ? (
          <div className="empty"><div className="empty-icon">⏳</div>Cargando historial…</div>
        ) : sales.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🧾</div>
            <strong>Sin ventas registradas</strong>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID Venta</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Detalle</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((s) => (
                  <tr key={s.id}>
                    <td><strong>#{s.id}</strong></td>
                    <td className="text-muted">{fmtDate(s.createdAt)}</td>
                    <td>{s.user ? s.user.name : "Venta General"}</td>
                    <td>
                      <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12 }}>
                        {s.details.map(d => (
                          <li key={d.id}>
                            {d.quantity}x {d.product ? d.product.name : "Producto"} 
                            <span className="text-muted"> (${d.price.toFixed(2)})</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td style={{ fontWeight: 800, color: "var(--accent)" }}>
                      ${s.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Sales;
