import React from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <img
        src="/src/assets/fotos/Titulo.png"
        alt="Logo del Juego"
        className="titulo-imagen"
        style={{ cursor: "pointer" }}
        onClick={() => window.location.reload()}
      />

      <div className="home-buttons">
        <button className="home-button game" onClick={() => navigate("/game")}>
          JUEGO
        </button>
        <button className="home-button collection" onClick={() => navigate("/collection")}>
          COLECCIONARIO
        </button>
      </div>
    </div>
  );
};

export default HomePage;