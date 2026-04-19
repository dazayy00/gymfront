import { useState } from "react";
import QRScanner from "../components/QRScanner";

const Access = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleScan = async (token) => {
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/api/access/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            });

            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            setResult({
                success: false,
                message: "error de conexion",
            });
        }
        setLoading(false);
    };

    return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Control de Acceso</h1>

      {!result && !loading && <QRScanner onScan={handleScan} />}

      {loading && <h2>Validando...</h2>}

      {result && (
        <div>
          <h2
            style={{
              color: result.success ? "green" : "red",
            }}
          >
            {result.message}
          </h2>

          {result.user && (
            <p>Bienvenido: {result.user.name}</p>
          )}

          <button onClick={() => setResult(null)}>
            Escanear otro
          </button>
        </div>
      )}
    </div>
  );
};

export default Access;