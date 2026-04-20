import { useState } from "react";
import QRScanner from "../components/QRScanner";

const Access = () => {
  const [result, setResult] = useState(null);

  const handleScan = async (token) => {
    const res = await fetch("http://localhost:3000/api/access/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    setResult(data);

    // sonido
    const audio = new Audio(
      data.success ? "/success.mp3" : "/error.mp3"
    );
    audio.play();

    setTimeout(() => {
      setResult(null);
    }, 3000);
  };

  return (
    <div
      style={{
        height: "100vh",
        background: result
          ? result.success
            ? "#22c55e"
            : "#ef4444"
          : "#111",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {!result && <QRScanner onScan={handleScan} />}

      {result && (
        <>
          <h1 style={{ fontSize: "3rem" }}>
            {result.message}
          </h1>

          {result.user && <h2>{result.user.name}</h2>}
        </>
      )}
    </div>
  );
};

export default Access;