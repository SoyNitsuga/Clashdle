import { useState, useEffect, useRef } from "react";
import "./GamePage.css";
import confetti from "canvas-confetti";

interface Carta {
  nombre: string;
  genero: string;
  tipo: string;
  rareza: string;
  elixir: number;
  fechaLanzamiento: number;
  arena: string;
  rango: string;
  imagen: string;
}

const cartas: Carta[] = [
  {
    nombre: "Valkiria",
    genero: "Femenino",
    tipo: "Tropa",
    rareza: "Rara",
    elixir: 4,
    fechaLanzamiento: 2016,
    arena: "Hueso",
    rango: "Cuerpo a cuerpo",
    imagen: "../src/assets/fotos/Valquiria.png",
  },
  {
    nombre: "Mini Pekka",
    genero: "Ninguno",
    tipo: "Tropa",
    rareza: "Rara",
    elixir: 4,
    fechaLanzamiento: 2016,
    arena: "Campo de Entrenamiento",
    rango: "Cuerpo a cuerpo",
    imagen: "../src/assets/fotos/mini pekka.png",
  },
  {
    nombre: "Mosquetera",
    genero: "Femenino",
    tipo: "Tropa",
    rareza: "Rara",
    elixir: 4,
    fechaLanzamiento: 2016,
    arena: "Campo de Entrenamiento",
    rango: "A distancia",
    imagen: "../src/assets/fotos/Mosquetera.png",
  },
  {
    nombre: "Bebé Dragón",
    genero: "Ninguno",
    tipo: "Tropa",
    rareza: "Épica",
    elixir: 4,
    fechaLanzamiento: 2016,
    arena: "Casa del P.E.K.K.A",
    rango: "A distancia",
    imagen: "../src/assets/fotos/BabyDragon.png",
  },
  {
    nombre: "Caballero Dorado",
    genero: "Masculino",
    tipo: "Tropa",
    rareza: "Campeón",
    elixir: 4,
    fechaLanzamiento: 2021,
    arena: "Valle Electro",
    rango: "Cuerpo a cuerpo",
    imagen: "../src/assets/fotos/Golden Knight.png",
  },
];

function normalizarTexto(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function GamePage() {
  const [cartaSecreta, setCartaSecreta] = useState<Carta | null>(null);
  const [adivinanza, setAdivinanza] = useState("");
  const [intentos, setIntentos] = useState<Carta[]>([]);
  const [victoria, setVictoria] = useState(false);
  const [sugerencias, setSugerencias] = useState<Carta[]>([]);
  const [seleccionIndice, setSeleccionIndice] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const aleatoria = cartas[Math.floor(Math.random() * cartas.length)];
    setCartaSecreta(aleatoria);
  }, []);

  useEffect(() => {
    if (adivinanza.trim() === "") {
      setSugerencias([]);
      return;
    }
  
    const cartasDisponibles = cartas.filter(
      (c) => !intentos.some((i) => i.nombre === c.nombre)
    );
  
    const coincidencias = cartas.filter((c) => {
      const normalizadoNombre = normalizarTexto(c.nombre);
      const normalizadoInput = normalizarTexto(adivinanza);

      if (
        cartasDisponibles.length === 1 &&
        normalizadoNombre.includes(normalizadoInput)
      ) {
        return true;
      }

      return (
        normalizadoNombre.includes(normalizadoInput) &&
        cartasDisponibles.some((d) => d.nombre === c.nombre) 
      );
    });
  
    setSugerencias(coincidencias);
    setSeleccionIndice(0);
  }, [adivinanza, intentos]);

  function manejarAdivinanza(nombre?: string) {
    const texto = nombre ?? adivinanza;
    const encontrada = cartas.find(
      (c) => normalizarTexto(c.nombre) === normalizarTexto(texto)
    );
    if (!encontrada || !cartaSecreta) return;
  
    if (intentos.some((c) => c.nombre === encontrada.nombre)) {
      setAdivinanza("");
      setSugerencias([]);
      return;
    }
  
    setIntentos((prev) => [encontrada, ...prev]);
    setAdivinanza("");
    setSugerencias([]);
  
    if (encontrada.nombre === cartaSecreta.nombre) {
      setVictoria(true);

      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ffd700", "#0066cc", "#00a000", "#ff0000"]
      });
    }
  }

  function colorCelda(valor: any, valorSecreto: any) {
    return valor === valorSecreto ? "match" : "no-match";
  }

  function manejarTecla(e: React.KeyboardEvent<HTMLInputElement>) {
    if (sugerencias.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSeleccionIndice((prev) => (prev + 1) % sugerencias.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSeleccionIndice((prev) => (prev - 1 + sugerencias.length) % sugerencias.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      manejarAdivinanza(sugerencias[seleccionIndice].nombre);
    }
  }

  return (
    <div className="game-container">
      <img
        src="/src/assets/fotos/Titulo.png"
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

      {}
      {sugerencias.length > 0 && !victoria && (
        <div className="sugerencias-box">
          {sugerencias.map((c, i) => (
            <div
              key={i}
              className={`sugerencia-item ${i === seleccionIndice ? "selected" : ""}`}
              onClick={() => manejarAdivinanza(c.nombre)}
            >
              <img src={c.imagen} alt={c.nombre} className="sugerencia-img" />
              {c.nombre}
            </div>
          ))}
        </div>
      )}

      {victoria && cartaSecreta && (
        <div className="victory-box">
          <h2>¡Adivinaste!</h2>
          <img src={cartaSecreta.imagen} alt={cartaSecreta.nombre} />
          <p>{cartaSecreta.nombre}</p>
        </div>
      )}

      {}
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

        {intentos.map((carta, index) => (
          <div key={index} className="fila">
            <div className="celda carta">
              <img src={carta.imagen} alt={carta.nombre} className="card-img" />
              <span className="card-name">{carta.nombre}</span>
            </div>
            <div className={`celda ${colorCelda(carta.genero, cartaSecreta?.genero)}`}>
              {carta.genero}
            </div>
            <div className={`celda ${colorCelda(carta.tipo, cartaSecreta?.tipo)}`}>
              {carta.tipo}
            </div>
            <div className={`celda ${colorCelda(carta.rareza, cartaSecreta?.rareza)}`}>
              {carta.rareza}
            </div>
            <div className={`celda ${colorCelda(carta.elixir, cartaSecreta?.elixir)}`}>
              {carta.elixir}
            </div>
            <div
              className={`celda ${colorCelda(
                carta.fechaLanzamiento,
                cartaSecreta?.fechaLanzamiento
              )}`}
            >
              {carta.fechaLanzamiento}
            </div>
            <div className={`celda ${colorCelda(carta.arena, cartaSecreta?.arena)}`}>
              {carta.arena}
            </div>
            <div className={`celda ${colorCelda(carta.rango, cartaSecreta?.rango)}`}>
              {carta.rango}
            </div>
          </div>
        ))}
        <div style={{ height: "150px" }}></div> {}
      </div>
    </div>
  );
}