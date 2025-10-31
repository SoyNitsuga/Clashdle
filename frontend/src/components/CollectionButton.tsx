import React from "react";
import { useNavigate } from "react-router-dom";

const CollectionButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button className="home-button userCollection" onClick={() => navigate("/userCollection")}>
      COLECCIONARIO
    </button>
  );
};

export default CollectionButton;