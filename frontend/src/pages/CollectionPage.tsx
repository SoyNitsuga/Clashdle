import React, { useEffect, useState } from "react";
import "./CollectionPage.css";
import type { Card } from "../components/CardTable";
import { useNavigate } from "react-router-dom";
import LoginButton from "../components/LoginButton";
import RegisterButton from "../components/RegisterButton";
import LogoutButton from "../components/LogoutButton";

const API_URL = "https://backend-7mmg.onrender.com/api/user";

const CollectionPage: React.FC = () => {
  const [coleccion, setColeccion] = useState<Card[]>([]);
  const [cartaSeleccionada, setCartaSeleccionada] = useState<Card | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const cargarColeccion = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${API_URL}/load`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.userCollection) setColeccion(data.userCollection);
      } catch (err) {
        console.error("Error al cargar colección:", err);
      }
    };
    cargarColeccion();
  }, [token]);

  const eliminarColeccion = async () => {
    if (window.confirm("¿Seguro que querés eliminar toda tu colección?")) {
      setColeccion([]);
      await fetch(`${API_URL}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userCollection: [] }),
      });
    }
  };

  const grupos = {
    champion: coleccion.filter((c) => c.rarity.toLowerCase() === "champion"),
    legendary: coleccion.filter((c) => c.rarity.toLowerCase() === "legendary"),
    epic: coleccion.filter((c) => c.rarity.toLowerCase() === "epic"),
    rare: coleccion.filter((c) => c.rarity.toLowerCase() === "rare"),
    common: coleccion.filter((c) => c.rarity.toLowerCase() === "common"),
  };

  return (
    <div className="userCollection-container">
      <img
        src="/fotos/Titulo.png"
        alt="Logo"
        className="titulo-imagen"
        onClick={() => navigate("/")}
      />
      <h1 className="userCollection-title">Tu Coleccionario</h1>

      <div className="botonera-coleccion">
        <button className="volver-btn" onClick={() => navigate("/game")}>
          ⬅ Volver al Juego
        </button>
        <button className="borrar-btn" onClick={eliminarColeccion}>
          🗑 Borrar Colección
        </button>
      </div>

      {Object.entries(grupos).map(([rareza, cartas]) => (
        <div key={rareza} className="rareza-section">
          <h2 className={`rareza-titulo ${rareza}`}>{rareza.toUpperCase()}</h2>
          <div className="cartas-grid">
            {cartas.length > 0 ? (
              cartas.map((c) => (
                <img
                  key={c.id}
                  src={c.imageUrl}
                  alt={c.name}
                  className="carta-mini"
                  onClick={() => setCartaSeleccionada(c)}
                />
              ))
            ) : (
              <p className="vacio">No tenés cartas de esta rareza todavía.</p>
            )}
          </div>
        </div>
      ))}

      <div className="auth-buttons">
        {!localStorage.getItem("token") ? (
          <>
            <LoginButton />
            <RegisterButton />
          </>
        ) : (
          <LogoutButton
            onLogout={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
          />
        )}
      </div>

      {cartaSeleccionada && (
        <div
          className="modal-overlay"
          onClick={() => setCartaSeleccionada(null)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <img
              src={cartaSeleccionada.imageUrl}
              alt={cartaSeleccionada.name}
              className="modal-img"
            />
            <h3>{cartaSeleccionada.name}</h3>
            <p>
              <b>Rareza:</b> {cartaSeleccionada.rarity}
            </p>
            <p>
              <b>Tipo:</b> {cartaSeleccionada.type}
            </p>
            <p>
              <b>Género:</b> {cartaSeleccionada.gender}
            </p>
            <p>
              <b>Elixir:</b> {cartaSeleccionada.elixir}
            </p>
            <p>
              <b>Arena:</b> {cartaSeleccionada.arena}
            </p>
            <p>
              <b>Rango:</b> {cartaSeleccionada.range}
            </p>
            <button
              className="cerrar-btn"
              onClick={() => setCartaSeleccionada(null)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;
