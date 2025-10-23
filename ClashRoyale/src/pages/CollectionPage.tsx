import React, { useEffect, useState } from "react";
import "./CollectionPage.css";
import type { Card } from "../components/CardTable";

const CollectionPage: React.FC = () => {
  const [coleccion, setColeccion] = useState<Card[]>([]);
  const [cartaSeleccionada, setCartaSeleccionada] = useState<Card | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("coleccionClashdle");
    if (data) setColeccion(JSON.parse(data));
  }, []);

  // Clasificar por rareza
  const grupos = {
    champion: coleccion.filter((c) => c.rarity.toLowerCase() === "champion"),
    legendary: coleccion.filter((c) => c.rarity.toLowerCase() === "legendary"),
    epic: coleccion.filter((c) => c.rarity.toLowerCase() === "epic"),
    rare: coleccion.filter((c) => c.rarity.toLowerCase() === "rare"),
    common: coleccion.filter((c) => c.rarity.toLowerCase() === "common"),
  };

  return (
    <div className="collection-container">
      <img
        src="/src/assets/fotos/Titulo.png"
        alt="Logo"
        className="titulo-imagen"
        onClick={() => (window.location.href = "/")}
      />
      <h1 className="collection-title">Tu Coleccionario</h1>

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

      {cartaSeleccionada && (
        <div className="modal-overlay" onClick={() => setCartaSeleccionada(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <img src={cartaSeleccionada.imageUrl} alt={cartaSeleccionada.name} className="modal-img" />
            <h3>{cartaSeleccionada.name}</h3>
            <p><b>Rareza:</b> {cartaSeleccionada.rarity}</p>
            <p><b>Tipo:</b> {cartaSeleccionada.type}</p>
            <p><b>Género:</b> {cartaSeleccionada.gender}</p>
            <p><b>Elixir:</b> {cartaSeleccionada.elixir}</p>
            <p><b>Arena:</b> {cartaSeleccionada.arena}</p>
            <p><b>Rango:</b> {cartaSeleccionada.range}</p>
            <button className="cerrar-btn" onClick={() => setCartaSeleccionada(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;