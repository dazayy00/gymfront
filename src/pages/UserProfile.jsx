import { useState } from "react";
import UserCard from "../components/UserCard.jsx";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);

  const handleCreateUser = async () => {
    const res = await fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Juan Pérez",
        email: "juan2@test.com",
        phone: "123456789",
      }),
    });

    const data = await res.json();
    setUserData(data.data);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Credencial Digital</h1>

      {!userData && (
        <button onClick={handleCreateUser}>
          Crear usuario demo
        </button>
      )}

      {userData && (
        <UserCard
          user={userData.user}
          qrImage={userData.qrImage}
        />
      )}
    </div>
  );
};

export default UserProfile;