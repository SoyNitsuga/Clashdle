import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userDataRoutes from "./routes/userData.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => {
    console.error("❌ Error al conectar con MongoDB:", err.message);
    process.exit(1);
  });
app.use("/routes/auth", authRoutes);
app.use("/routes/userData", userDataRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente 🚀");
});
