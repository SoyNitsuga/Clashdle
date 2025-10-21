import React from "react";
import "./HomePage.css";

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
        <img 
            src="/src/assets/fotos/Titulo.png" 
            alt="Logo del Juego" 
            className="titulo-imagen"
            style={{ cursor: 'pointer' }}
            onClick={() => window.location.reload()} 
  />
      <div className="home-buttons">
        <button className="home-button game">JUEGO</button>
        <button className="home-button collection">COLECCIONARIO</button>
      </div>
      
      <h1>QWUW</h1>
    </div>
  );
};

export default HomePage;