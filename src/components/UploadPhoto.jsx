import { useState } from "react";

const UploadPhoto = ({ onUploaded }) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("image", file);

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:3000/api/upload/user-photo",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      onUploaded(data.imageUrl);
    } catch (error) {
      console.error(error);
      alert("Error subiendo imagen");
    }

    setLoading(false);
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
      />

      {loading && <p>Subiendo...</p>}
    </div>
  );
};

export default UploadPhoto;