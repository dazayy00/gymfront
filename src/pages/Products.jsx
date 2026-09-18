import { useEffect, useState } from "react";

const API = "http://localhost:3000/api";
const authH = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [alert,    setAlert]    = useState(null);

  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", barcode: "" });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/products`, { headers: authH() });
      const data = await res.json();
      setProducts(data);
    } catch {
      setAlert({ type: "error", msg: "Error al cargar productos" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    
    setSaving(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API}/products/${editingId}` : `${API}/products`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: authH(),
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock || 0),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: "success", msg: `Producto ${editingId ? "actualizado" : "creado"} exitosamente` });
        setForm({ name: "", description: "", price: "", stock: "", barcode: "" });
        setShowForm(false);
        setEditingId(null);
        fetchProducts();
      } else {
        setAlert({ type: "error", msg: data.message || "Error al guardar producto" });
      }
    } catch {
      setAlert({ type: "error", msg: "Error de conexión" });
    } finally {
      setSaving(false);
      setTimeout(() => setAlert(null), 4000);
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      stock: p.stock,
      barcode: p.barcode || "",
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      const res = await fetch(`${API}/products/${id}`, {
        method: "DELETE",
        headers: authH(),
      });
      if (res.ok) {
        setAlert({ type: "success", msg: "Producto eliminado" });
        fetchProducts();
      } else {
        setAlert({ type: "error", msg: "Error al eliminar" });
      }
    } catch {
      setAlert({ type: "error", msg: "Error de conexión" });
    } finally {
      setTimeout(() => setAlert(null), 4000);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Inventario</h1>
            <p className="page-subtitle">{products.length} productos registrados</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (showForm) {
                setShowForm(false);
                setEditingId(null);
                setForm({ name: "", description: "", price: "", stock: "", barcode: "" });
              } else {
                setShowForm(true);
              }
            }}
          >
            {showForm ? "✕ Cancelar" : "+ Nuevo producto"}
          </button>
        </div>
      </div>

      <div className="page-body">
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.type === "success" ? "✅" : "⚠️"} {alert.msg}
          </div>
        )}

        {showForm && (
          <div className="card card-p mb-6">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>
              {editingId ? "Editar producto" : "Nuevo producto"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio *</label>
                  <input
                    className="form-input"
                    type="number"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input
                    className="form-input"
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Código de barras</label>
                  <input
                    className="form-input"
                    value={form.barcode}
                    onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <input
                    className="form-input"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? "Guardando..." : "Guardar producto"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && !showForm ? (
          <div className="empty"><div className="empty-icon">⏳</div>Cargando productos…</div>
        ) : products.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📦</div>
            <strong>Sin productos en inventario</strong>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Código</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      {p.description && <div className="text-sm text-muted">{p.description}</div>}
                    </td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td className="text-muted">{p.barcode || "—"}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(p)}>
                          ✏️ Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                          🗑️
                        </button>
                      </div>
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

export default Products;
