import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Carta } from "./CartaTypes";

export function useGameLogic(cartas: Carta[]) {
  const [cartaSecreta, setCartaSecreta] = useState<Carta | null>(null);
  const [adivinanza, setAdivinanza] = useState("");
  const [intentos, setIntentos] = useState<Carta[]>([]);
  const [victoria, setVictoria] = useState(false);
  const [sugerencias, setSugerencias] = useState<Carta[]>([]);
  const [seleccionIndice, setSeleccionIndice] = useState(0);

  useEffect(() => {
    const aleatoria = cartas[Math.floor(Math.random() * cartas.length)];
    setCartaSecreta(aleatoria);
  }, []);

  function normalizarTexto(texto: string) {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

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
        colors: ["#ffd700", "#0066cc", "#00a000", "#ff0000"],
      });
    }
  }

  function colorCelda(valor: any, valorSecreto: any) {
    return valor === valorSecreto ? "match" : "no-match";
  }

  return {
    cartaSecreta,
    adivinanza,
    setAdivinanza,
    intentos,
    victoria,
    sugerencias,
    setSugerencias,
    seleccionIndice,
    setSeleccionIndice,
    manejarAdivinanza,
    colorCelda,
  };
}