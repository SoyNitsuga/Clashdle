import { useState } from "react";
import type { Card } from "../components/CardTable";
import "./CollectionPage.css";

interface CollectionPageProps {
  coleccion: Card[];
}

export default function CollectionPage({ coleccion }: CollectionPageProps) {
  const [cartaSeleccionada, setCartaSeleccionada] = useState<Card | null>(null);

  return (
    <div className="collection-container">
      <h1>Mi Coleccionario</h1>
      <div className="collection-grid">
        {coleccion.map(c => (
          <img
            key={c.id}
            src={c.imageUrl}
            alt={c.name}
            className="collection-card"
            onClick={() => setCartaSeleccionada(c)}
          />
        ))}
      </div>

      {cartaSeleccionada && (
        <div className="modal-overlay" onClick={() => setCartaSeleccionada(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={cartaSeleccionada.imageUrl} alt={cartaSeleccionada.name} className="modal-img" />
            <h2>{cartaSeleccionada.name}</h2>
            <p><b>Género:</b> {cartaSeleccionada.gender}</p>
            <p><b>Tipo:</b> {cartaSeleccionada.type}</p>
            <p><b>Rareza:</b> {cartaSeleccionada.rarity}</p>
            <p><b>Elixir:</b> {cartaSeleccionada.elixir}</p>
            <p><b>Lanzamiento:</b> {cartaSeleccionada.release}</p>
            <p><b>Arena:</b> {cartaSeleccionada.arena}</p>
            <p><b>Rango:</b> {cartaSeleccionada.range}</p>
            <button onClick={() => setCartaSeleccionada(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}