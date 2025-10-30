import React from "react";
import { useNavigate } from "react-router-dom";

const GameButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button className="home-button game" onClick={() => navigate("/game")}>
      JUEGO
    </button>
  );
};

export default GameButton;
