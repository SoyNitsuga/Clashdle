import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  // Revisar si hay sesión activa al cargar la página
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setLoggedIn(false);
  };

  return (
    <div className="home-container">
      <div className="auth-buttons">
        {loggedIn ? (
          <button className="home-button logout" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        ) : (
          <>
            <button
              className="home-button login"
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </button>
            <button
              className="home-button register"
              onClick={() => navigate("/register")}
            >
              Registrarse
            </button>
          </>
        )}
      </div>

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
        <button
          className="home-button collection"
          onClick={() => navigate("/collection")}
        >
          COLECCIONARIO
        </button>
      </div>
    </div>
  );
};

export default HomePage;