// ----------------------------
// server.js - ClashDle Backend
// ----------------------------
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import userDataRoutes from "./routes/userData.js";

// 🧩 Cargar variables del .env
dotenv.config();

// ⚙️ Crear aplicación Express
const app = express();

// 🛠️ Middlewares
app.use(cors());
app.use(express.json());

// 🗄️ Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ Error al conectar con MongoDB:", err.message);
    process.exit(1);
  });

// 🌐 Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/user", userDataRoutes);

// 🚀 Arrancar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});