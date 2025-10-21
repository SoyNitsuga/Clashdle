import "./HomePage.css";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
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
        <button className="home-button collection">COLECCIONARIO</button>
      </div>
    </div>
  );
}