import { useEffect, useState } from "react";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:3000/api/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({ name: "", email: "", phone: "" });
    fetchUsers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel Admin</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <input
          placeholder="Teléfono"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <button type="submit">Crear usuario</button>
      </form>

      <h2>Usuarios</h2>

      {users.map((u) => (
        <div key={u.id}>
          {u.name} - {u.email}
        </div>
      ))}
    </div>
  );
};

export default Admin;