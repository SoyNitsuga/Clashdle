import express from "express";
import jwt from "jsonwebtoken";
import { sql } from "../db.js";

const router = express.Router();

// Middleware para verificar el token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Ahora decoded tiene id y username, no email
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
}

// Obtener colección del usuario
router.get("/", verifyToken, async (req, res) => {
  try {
    const [data] = await sql`
      SELECT collection FROM user_data WHERE user_id = ${req.user.id};
    `;
    res.json(data?.collection || []);
  } catch (err) {
    console.error("Error al obtener datos:", err);
    res.status(500).json({ error: "Error al obtener los datos del usuario." });
  }
});

// Guardar o actualizar colección del usuario
router.post("/", verifyToken, async (req, res) => {
  try {
    const { collection } = req.body;
    const [existing] = await sql`
      SELECT id FROM user_data WHERE user_id = ${req.user.id};
    `;

    if (existing) {
      await sql`
        UPDATE user_data
        SET collection = ${JSON.stringify(collection)}
        WHERE user_id = ${req.user.id};
      `;
    } else {
      await sql`
        INSERT INTO user_data (user_id, collection)
        VALUES (${req.user.id}, ${JSON.stringify(collection)});
      `;
    }

    res.json({ success: true });
  } catch (err) {
    console.error("Error al guardar datos:", err);
    res.status(500).json({ error: "Error al guardar los datos del usuario." });
  }
});

export default router;