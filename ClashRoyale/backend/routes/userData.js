import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const SECRET = "clashdle-secret";

// Middleware para verificar token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token faltante" });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(403).json({ error: "Token inválido" });
  }
}

// Guardar colección
router.post("/save", authMiddleware, async (req, res) => {
  const { collection } = req.body;
  const user = await User.findById(req.userId);
  user.collection = collection;
  await user.save();
  res.json({ message: "Colección guardada" });
});

// Obtener colección
router.get("/load", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ collection: user.collection });
});

export default router;