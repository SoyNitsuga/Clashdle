import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import userDataRoutes from "./routes/userData.js";
import { initDB } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

initDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userDataRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en puerto ${PORT}`));