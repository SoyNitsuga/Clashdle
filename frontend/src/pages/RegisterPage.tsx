import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPages.css";

const API_URL = "https://backend-7mmg.onrender.com/api/user/save";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
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
        setError(data.error || "Error al registrarse");
        return;
      }

      alert("✅ Registro exitoso. Ahora iniciá sesión.");
      navigate("/login");
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="auth-container">
      <img
        src="./fotos/Titulo.png"
        alt="Logo del Juego"
        className="titulo-imagen"
        onClick={() => navigate("/")}
      />

      <h1>Registrate</h1>

      <form className="auth-form" onSubmit={handleRegister}>
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
        <button type="submit">Registrarme</button>
      </form>

      <p className="toggle-link" onClick={() => navigate("/login")}>
        ¿Ya tenés cuenta? Iniciá sesión
      </p>
    </div>
  );
};

export default RegisterPage;