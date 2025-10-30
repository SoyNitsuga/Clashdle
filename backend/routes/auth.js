import express from "express";
import jwt from "jsonwebtoken";
import { createUser, validateUser } from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existing = await validateUser(username, password);
    if (existing) {
      return res.status(400).json({ error: "El usuario ya existe." });
    }

    const user = await createUser(username, password);
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);

    res.json({ token, user });
  } catch (err) {
    console.error("Error al registrar:", err);
    res.status(500).json({ error: "Error al registrar usuario." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await validateUser(username, password);
    if (!user) return res.status(401).json({ error: "Credenciales inválidas." });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
    res.json({ token, user });
  } catch (err) {
    console.error("Error al iniciar sesión:", err);
    res.status(500).json({ error: "Error al iniciar sesión." });
  }
});

export default router;