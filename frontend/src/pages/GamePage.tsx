import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./GamePage.css";
import confetti from "canvas-confetti";
import CardTable from "../components/CardTable";
import type { Card } from "../components/CardTable";
import LoginButton from "../components/LoginButton";
import RegisterButton from "../components/RegisterButton";
import LogoutButton from "../components/LogoutButton";

function normalizarTexto(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function GamePage() {
  const [cartas, setCartas] = useState<Card[]>([]);
  const [cartaSecreta, setCartaSecreta] = useState<Card | null>(null);
  const [adivinanza, setAdivinanza] = useState("");
  const [intentos, setIntentos] = useState<Card[]>([]);
  const [victoria, setVictoria] = useState(false);
  const [sugerencias, setSugerencias] = useState<Card[]>([]);
  const [seleccionIndice, setSeleccionIndice] = useState(0);
  const [cofreEstrellas, setCofreEstrellas] = useState<number | null>(null);
  const [recompensa, setRecompensa] = useState<Card | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartas.length > 0) {
      const aleatoria = cartas[Math.floor(Math.random() * cartas.length)];
      setCartaSecreta(aleatoria);
    }
  }, [cartas]);

  useEffect(() => {
    if (adivinanza.trim() === "" || cartas.length === 0) {
      setSugerencias([]);
      return;
    }

    const cartasDisponibles = cartas.filter(
      (c) => !intentos.some((i) => i.id === c.id)
    );

    const coincidencias = cartas.filter((c) => {
      const normalizadoNombre = normalizarTexto(c.name);
      const normalizadoInput = normalizarTexto(adivinanza);
      if (
        cartasDisponibles.length === 1 &&
        normalizadoNombre.includes(normalizadoInput)
      )
        return true;
      return (
        normalizadoNombre.includes(normalizadoInput) &&
        cartasDisponibles.some((d) => d.id === c.id)
      );
    });

    setSugerencias(coincidencias);
    setSeleccionIndice(0);
  }, [adivinanza, intentos, cartas]);

  function manejarAdivinanza(nombre?: string) {
    const texto = nombre ?? adivinanza;
    const encontrada = cartas.find(
      (c) => normalizarTexto(c.name) === normalizarTexto(texto)
    );
    if (!encontrada || !cartaSecreta) return;

    if (intentos.some((c) => c.id === encontrada.id)) {
      setAdivinanza("");
      setSugerencias([]);
      return;
    }

    setIntentos((prev) => [encontrada, ...prev]);
    setAdivinanza("");
    setSugerencias([]);

    if (encontrada.id === cartaSecreta.id) {
      setVictoria(true);
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ffd700", "#0066cc", "#00a000", "#ff0000"],
      });

      const intentosTotales = intentos.length + 1;
      let estrellas = 1;
      if (intentosTotales <= 2) estrellas = 5;
      else if (intentosTotales <= 4) estrellas = 4;
      else if (intentosTotales <= 6) estrellas = 3;
      else if (intentosTotales <= 8) estrellas = 2;
      setCofreEstrellas(estrellas);
    }
  }

  async function abrirCofre() {
    if (!cofreEstrellas || cartas.length === 0) return;

    const estrellas = cofreEstrellas;

    const probabilidades: Record<string, number> = {
      common: Math.max(50 - estrellas * 5, 10),
      rare: Math.max(30 - (5 - estrellas) * 3, 10),
      epic: 10 + estrellas * 4,
      legendary: 5 + estrellas * 2,
      champion: 1 + estrellas,
    };

    const tirada = Math.random() * 100;
    let acumulado = 0;
    let rarezaSeleccionada = "common";

    for (const [rareza, prob] of Object.entries(probabilidades)) {
      acumulado += prob;
      if (tirada <= acumulado) {
        rarezaSeleccionada = rareza;
        break;
      }
    }

    const token = localStorage.getItem("token");
    let coleccionActual: Card[] = [];

    if (token) {
      try {
        const res = await fetch("https://backend-7mmg.onrender.com/api/user/load", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        coleccionActual = data.userCollection || [];
      } catch (e) {
        console.error("Error cargando colección:", e);
      }
    }

    const posibles = cartas.filter(
      (c) =>
        c.rarity.toLowerCase() === rarezaSeleccionada &&
        !coleccionActual.some((col: Card) => col.id === c.id)
    );

    if (posibles.length === 0) {
      alert("¡Ya tenés todas las cartas de esta rareza!");
      return;
    }

    const premio = posibles[Math.floor(Math.random() * posibles.length)];
    setRecompensa(premio);

    const nuevaColeccion = [...coleccionActual, premio];

    if (token) {
      try {
        await fetch("https://backend-7mmg.onrender.com/api/user/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userCollection: nuevaColeccion }),
        });
        console.log("✅ Carta guardada en el servidor");
      } catch (e) {
        console.error("Error guardando en servidor:", e);
      }
    } else {
      localStorage.setItem("coleccionClashdle", JSON.stringify(nuevaColeccion));
    }
  }

  function colorCelda(valor: any, valorSecreto: any) {
    return valor === valorSecreto ? "match" : "no-match";
  }

  function compararValor(valor: any, valorSecreto: any, tipo: string) {
    if (valor === valorSecreto) return null;

    let isDown = false;

    if (tipo === "elixir" || tipo === "release") {
      isDown = valor > valorSecreto;
    } else if (tipo === "rarity") {
      const orden = ["common", "rare", "epic", "legendary", "champion"];
      isDown =
        orden.indexOf(valor.toLowerCase()) >
        orden.indexOf(valorSecreto.toLowerCase());
    }

    return (
      <span className={`flecha ${isDown ? "down" : "up"}`}>
        {isDown ? "↓" : "↑"}
      </span>
    );
  }

  function manejarTecla(e: React.KeyboardEvent<HTMLInputElement>) {
    if (sugerencias.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSeleccionIndice((prev) => (prev + 1) % sugerencias.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSeleccionIndice(
        (prev) => (prev - 1 + sugerencias.length) % sugerencias.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      manejarAdivinanza(sugerencias[seleccionIndice].name);
    }
  }

  return (
    <div className="game-container">
      <img
        src="/fotos/Titulo.png"
        alt="Logo del Juego"
        className="titulo-imagen"
        onClick={() => (window.location.href = "/")}
      />

      <h1 className="game-title">¡Adivina la carta de hoy!</h1>

      <div className="input-section">
        <input
          type="text"
          value={adivinanza}
          placeholder="Escribí el nombre de la carta..."
          onChange={(e) => setAdivinanza(e.target.value)}
          disabled={victoria}
          onKeyDown={manejarTecla}
          ref={inputRef}
        />
        <button onClick={() => manejarAdivinanza()} disabled={victoria}>
          →
        </button>
      </div>

      {sugerencias.length > 0 && !victoria && (
        <div className="sugerencias-box">
          {sugerencias.map((c, i) => (
            <div
              key={i}
              className={`sugerencia-item ${
                i === seleccionIndice ? "selected" : ""
              }`}
              onClick={() => manejarAdivinanza(c.name)}
            >
              <img src={c.imageUrl} alt={c.name} className="sugerencia-img" />
              {c.name}
            </div>
          ))}
        </div>
      )}

      {victoria && cartaSecreta && (
        <div className="victory-box">
          <h2>¡Adivinaste!</h2>
          <img src={cartaSecreta.imageUrl} alt={cartaSecreta.name} />
          <p>{cartaSecreta.name}</p>
        </div>
      )}

      {victoria && cofreEstrellas && !recompensa && (
        <div className="reward-box">
          <div className="estrellas-box">
            {Array.from({ length: cofreEstrellas }).map((_, i) => (
              <img
                key={i}
                src="./fotos/Estrellas.png"
                alt="Estrella"
                className="estrella-icon"
              />
            ))}
          </div>

          <div className="cofre-container" onClick={abrirCofre}>
            <img
              src="./fotos/Cofre.png"
              alt="Cofre"
              className="cofre-img"
            />
          </div>
        </div>
      )}

      {recompensa && (
        <div className="recompensa-box">
          <h3>¡Obtuviste una nueva carta!</h3>
          <img src={recompensa.imageUrl} alt={recompensa.name} />
          <p>
            <b>{recompensa.name}</b> ({recompensa.rarity})
          </p>

          <div className="botonera-recompensa">
            <button
              className="go-to-userCollection-button"
              onClick={() => navigate("/userCollection")}
            >
              📜 Ir al Coleccionario
            </button>

            <button
              className="play-again-button"
              onClick={() => {
                setRecompensa(null);
                setIntentos([]);
                setVictoria(false);
                setCofreEstrellas(null);
                const nuevaCarta =
                  cartas[Math.floor(Math.random() * cartas.length)];
                setCartaSecreta(nuevaCarta);
              }}
            >
              🔁 Volver a Jugar
            </button>
          </div>
        </div>
      )}

      <div className="tabla-intentos">
        <div className="fila encabezado">
          <div className="celda carta">Carta</div>
          <div className="celda">Género</div>
          <div className="celda">Tipo</div>
          <div className="celda">Rareza</div>
          <div className="celda">Elixir</div>
          <div className="celda">Lanzamiento</div>
          <div className="celda">Arena</div>
          <div className="celda">Rango</div>
        </div>

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

        {intentos.map((carta, index) => (
          <div key={index} className="fila">
            <div className="celda carta">
              <img src={carta.imageUrl} alt={carta.name} className="card-img" />
              <span className="card-name">{carta.name}</span>
            </div>
            <div
              className={`celda ${colorCelda(
                carta.gender,
                cartaSecreta?.gender
              )}`}
            >
              {carta.gender}
            </div>
            <div
              className={`celda ${colorCelda(carta.type, cartaSecreta?.type)}`}
            >
              {carta.type}
            </div>
            <div
              className={`celda ${colorCelda(
                carta.rarity,
                cartaSecreta?.rarity
              )}`}
            >
              {carta.rarity}{" "}
              {cartaSecreta &&
                compararValor(carta.rarity, cartaSecreta.rarity, "rarity")}
            </div>
            <div
              className={`celda ${colorCelda(
                carta.elixir,
                cartaSecreta?.elixir
              )}`}
            >
              {carta.elixir}{" "}
              {cartaSecreta &&
                compararValor(carta.elixir, cartaSecreta.elixir, "elixir")}
            </div>
            <div
              className={`celda ${colorCelda(
                carta.release,
                cartaSecreta?.release
              )}`}
            >
              {carta.release}{" "}
              {cartaSecreta &&
                compararValor(carta.release, cartaSecreta.release, "release")}
            </div>
            <div
              className={`celda ${colorCelda(
                carta.arena,
                cartaSecreta?.arena
              )}`}
            >
              {carta.arena}
            </div>
            <div
              className={`celda ${colorCelda(
                carta.range,
                cartaSecreta?.range
              )}`}
            >
              {carta.range}
            </div>
          </div>
        ))}
      </div>

      <CardTable setCartas={setCartas} />
    </div>
  );
}
