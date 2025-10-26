import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";

const API_URL = "http://localhost:4000/api/auth/login";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      navigate("/game");
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="auth-container">
      <img
        src="/src/assets/fotos/Titulo.png"
        alt="Logo del Juego"
        className="titulo-imagen"
        onClick={() => navigate("/")}
      />

      <h1>Iniciar Sesión</h1>

      <form className="auth-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Ingresar</button>
      </form>

      <p className="toggle-link" onClick={() => navigate("/register")}>
        ¿No tenés cuenta? Registrate
      </p>
    </div>
  );
};

export default LoginPage;
