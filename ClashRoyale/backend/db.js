import dotenv from "dotenv";
dotenv.config();

import { neon } from "@netlify/neon";

if (!process.env.NETLIFY_DATABASE_URL) {
  console.error("❌ NETLIFY_DATABASE_URL no está definida.");
  throw new Error("Falta la variable de entorno NETLIFY_DATABASE_URL en .env");
}

export const sql = neon(process.env.NETLIFY_DATABASE_URL);

export async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_data (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        collection JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    console.log("✅ Base de datos inicializada correctamente");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
  }
}