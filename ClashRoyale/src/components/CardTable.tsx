// src/components/CardTable.tsx
import { useEffect } from "react";

export interface Card {
  id: number;
  name: string;
  imageUrl: string;
  gender: string;
  type: string;
  rarity: string;
  elixir: string;
  release: string;
  arena: string;
  range: string;
}

interface CardTableProps {
  setCartas: (cards: Card[]) => void; // Pasamos las cartas al GamePage
}

const CardTable: React.FC<CardTableProps> = ({ setCartas }) => {
  useEffect(() => {
    fetch("https://clashdle-node-api-production.up.railway.app/card")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((c: any) => ({
          id: c.id,
          name: c.name,
          imageUrl: c.image?.url || "",
          gender: c.attributes?.gender?.value || "-",
          type: c.attributes?.type?.value || "-",
          rarity: c.attributes?.rarity?.value || "-",
          elixir: c.attributes?.elixirCost?.value || "-",
          release: c.attributes?.releaseDate?.value || "-",
          arena: c.attributes?.arena?.value || "-",
          range: c.attributes?.rangeType?.value || "-"
        }));
        setCartas(mapped);
      })
      .catch((err) => console.error(err));
  }, [setCartas]);

  return null; // No renderiza nada, solo carga las cartas
};

export default CardTable;
