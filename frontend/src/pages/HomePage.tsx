import React, { useState, useEffect } from "react";
import "./HomePage.css";

import LoginButton from "../components/LoginButton";
import RegisterButton from "../components/RegisterButton";
import LogoutButton from "../components/LogoutButton";
import GameButton from "../components/GameButton";
import CollectionButton from "../components/CollectionButton";

const HomePage: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);

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
      {/* Imágenes laterales superpuestas */}
      <div className="lateral-images-left">
        <img
          src="/fotos/Barbaro.png"
          alt="Barbaro"
          className="img-left img1"
        />
        <img
          src="/fotos/Principe.png"
          alt="Principe"
          className="img-left img2"
        />
        <img
          src="/fotos/Bruja.png"
          alt="Bruja"
          className="img-left img3"
        />
      </div>

      <div className="lateral-images-right">
        <img
          src="/fotos/Baby Dragon.png"
          alt="Baby Dragon"
          className="img-right img1"
        />
        <img
          src="/fotos/Arqueras.png"
          alt="Arqueras"
          className="img-right img2"
        />
        <img
          src="/fotos/Esqueleto.png"
          alt="Esqueleto"
          className="img-right img3"
        />
        <img
          src="/fotos/Mago.png"
          alt="Mago"
          className="img-right img4"
        />
      </div>

      {/* Botones de login/register/logout */}
      <div className="auth-buttons">
        {loggedIn ? (
          <LogoutButton onLogout={handleLogout} />
        ) : (
          <>
            <LoginButton />
            <RegisterButton />
          </>
        )}
      </div>

      {/* Logo */}
      <img
        src="/fotos/Titulo.png"
        alt="Logo del Juego"
        className="titulo-imagen"
        style={{ cursor: "pointer" }}
        onClick={() => window.location.reload()}
      />

      {/* Botones de juego y coleccion */}
      <div className="home-buttons">
        <GameButton />
        <CollectionButton />
      </div>
    </div>
  );
};

export default HomePage;