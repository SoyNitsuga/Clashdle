import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const SECRET = "clashdle-secret";

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ error: "Usuario existente" });
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashed });
  await user.save();
  res.json({ message: "Usuario creado correctamente" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Contraseña incorrecta" });
  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "7d" });
  res.json({ token, username });
});

export default router;
