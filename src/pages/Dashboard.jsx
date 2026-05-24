import { useEffect, useState } from "react";

const Dashboard = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/dashboard")
        .then((res) => res.json())
        .then(setData);
    }, []);

    if (!data) return <h2>Cargando...</h2>;

    return (
    <div style={{ padding: "20px" }}>
      <h1> Dashboard</h1>

      <div>
        <h2>Ingresos hoy: ${data.incomeToday}</h2>
        <h2>Ingresos mes: ${data.incomeMonth}</h2>
        <h2>Total ventas: {data.totalSales}</h2>
        <h2>Usuarios hoy: {data.activeUsersToday}</h2>
        <h2>Visitantes hoy: {data.visitorsToday}</h2>
      </div>
    </div>
  );
};

export default Dashboard;