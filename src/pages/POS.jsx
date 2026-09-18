import { useEffect, useState } from "react";

const API = "http://localhost:3000/api";
const authH = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart,     setCart]     = useState([]);
  const [userId,   setUserId]   = useState("");
  const [loading,  setLoading]  = useState(false);
  const [alert,    setAlert]    = useState(null);
  const [search,   setSearch]   = useState("");

  useEffect(() => {
    fetch(`${API}/products`, { headers: authH() })
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: p.quantity + delta } : p))
        .filter((p) => p.quantity > 0)
    );
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setAlert({ type: "error", msg: "El carrito está vacío" });
      return;
    }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/sales`, {
        method: "POST",
        headers: authH(),
        body: JSON.stringify({
          userId: userId ? Number(userId) : undefined,
          items: cart.map((c) => ({ productId: c.id, quantity: c.quantity })),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAlert({ type: "success", msg: `Venta registrada — Total: $${total.toFixed(2)}` });
        setCart([]);
        setUserId("");
      } else {
        setAlert({ type: "error", msg: data.message || "Error en la venta" });
      }
    } catch {
      setAlert({ type: "error", msg: "Error de conexión" });
    } finally {
      setLoading(false);
      setTimeout(() => setAlert(null), 4000);
    }
  };

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Punto de Venta</h1>
        <p className="page-subtitle">{products.length} productos disponibles</p>
      </div>

      <div className="page-body">
        {alert && (
          <div className={`alert alert-${alert.type}`} style={{ marginBottom: 16 }}>
            {alert.type === "success" ? "✅" : "⚠️"} {alert.msg}
          </div>
        )}

        <div className="pos-layout">
          {/* ── Left: products ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, overflow: "hidden" }}>
            <input
              className="form-input"
              placeholder="🔍 Buscar producto…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {filtered.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📦</div>
                Sin productos{search ? ` para "${search}"` : ""}
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map((p) => (
                  <div
                    key={p.id}
                    className="product-tile"
                    onClick={() => addToCart(p)}
                    title={p.description || p.name}
                  >
                    <div style={{ fontSize: 28 }}>🛒</div>
                    <div className="product-tile-name">{p.name}</div>
                    <div className="product-tile-price">${p.price.toFixed(2)}</div>
                    {p.stock > 0 && (
                      <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                        Stock: {p.stock}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right: cart ── */}
          <div className="cart-panel">
            <div className="cart-header">🧾 Carrito ({cart.length})</div>

            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="empty" style={{ padding: "32px 16px" }}>
                  <div className="empty-icon">🛒</div>
                  Selecciona productos
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-name">{item.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "2px 8px" }}
                        onClick={() => changeQty(item.id, -1)}
                      >−</button>
                      <span className="cart-item-qty">{item.quantity}</span>
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ padding: "2px 8px" }}
                        onClick={() => changeQty(item.id, 1)}
                      >+</button>
                    </div>
                    <div className="cart-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-footer">
              <input
                className="form-input"
                placeholder="ID de socio (opcional)"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                type="number"
              />

              <div className="cart-total">
                <span className="cart-total-label">Total</span>
                <span className="cart-total-value">${total.toFixed(2)}</span>
              </div>

              <button
                className="btn btn-primary btn-full btn-lg"
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
              >
                {loading ? "Procesando…" : "Finalizar venta →"}
              </button>

              {cart.length > 0 && (
                <button
                  className="btn btn-ghost btn-full btn-sm"
                  onClick={() => setCart([])}
                >
                  Vaciar carrito
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default POS;