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

      <img
        src="/src/assets/fotos/Titulo.png"
        alt="Logo del Juego"
        className="titulo-imagen"
        style={{ cursor: "pointer" }}
        onClick={() => window.location.reload()}
      />

      <div className="home-buttons">
        <GameButton />
        <CollectionButton />
      </div>
    </div>
  );
};

export default HomePage;