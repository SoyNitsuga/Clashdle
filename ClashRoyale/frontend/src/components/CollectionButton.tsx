import React from "react";
import { useNavigate } from "react-router-dom";

const CollectionButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button className="home-button collection" onClick={() => navigate("/collection")}>
      COLECCIONARIO
    </button>
  );
};

export default CollectionButton;