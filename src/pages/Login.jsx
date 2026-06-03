import { useState } from "react";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "http://localhost:3000/api/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      onLogin();
    } else {
      alert("Login incorrecto");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Login Admin</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;