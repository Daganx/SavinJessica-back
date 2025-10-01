import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";


import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

dotenv.config();

const app = express();

// CORS : en dev on autorise le front local (Vite: http://localhost:5173) ou tout si non précisé
const allowedOrigin = process.env.FRONTEND_URL || "*";
app.use(cors({
  origin: allowedOrigin,
}));

app.use(express.json()); 

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Connexion à MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("🚨 MONGO_URI non défini dans .env");
  process.exit(1);
}

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connecté");
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`🚀 Serveur démarré sur http://localhost:${port}`));
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion MongoDB :", err.message);
    process.exit(1);
  });