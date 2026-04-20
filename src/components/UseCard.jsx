const UserCard = ({ user, qrImage }) => {
  return (
    <div style={{
      border: "2px solid #22c55e",
      borderRadius: "12px",
      padding: "20px",
      width: "300px",
      textAlign: "center"
    }}>
      <h2>{user.name}</h2>

      <img
        src={qrImage}
        alt="QR"
        style={{ width: "200px" }}
      />

      <p>{user.status}</p>
    </div>
  );
};

export default UserCard;