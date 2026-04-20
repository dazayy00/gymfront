import { useEffect, useState } from "react";

const POS = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const addToCart = (product) => {
    const existing = cart.find((p) => p.id === product.id);

    if (existing) {
      setCart(
        cart.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const getTotal = () => {
    return cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = async () => {
    if (!userId) {
      alert("Ingresa el ID del usuario");
      return;
    }

    if (cart.length === 0) {
      alert("Carrito vacío");
      return;
    }

    setLoading(true);

    try {
      await fetch("http://localhost:3000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: Number(userId),
          items: cart.map((c) => ({
            productId: c.id,
            quantity: c.quantity,
          })),
        }),
      });

      alert("Venta realizada ✅");
      setCart([]);
    } catch (error) {
      console.error(error);
      alert("Error en la venta ❌");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🧾 Punto de Venta</h1>

      <input
        placeholder="ID Usuario"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{ marginBottom: "20px" }}
      />

      <div style={{ display: "flex", gap: "40px" }}>
        <div>
          <h2>Productos</h2>

          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              style={{
                display: "block",
                margin: "5px",
                padding: "10px",
              }}
            >
              {p.name} - ${p.price}
            </button>
          ))}
        </div>

        <div>
          <h2>Carrito</h2>

          {cart.length === 0 && <p>Vacío</p>}

          {cart.map((c) => (
            <div key={c.id}>
              {c.name} x {c.quantity}
            </div>
          ))}

          <h3>Total: ${getTotal()}</h3>

          <button onClick={handleCheckout} disabled={loading}>
            {loading ? "Procesando..." : "Finalizar compra"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;