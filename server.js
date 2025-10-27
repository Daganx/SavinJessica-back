import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import pingRoute from "./routes/ping.js";

dotenv.config();

const app = express();

// CORS : autoriser à la fois le front en local et le déploiement Vercel
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "https://savin-jessica.vercel.app",
  "https://www.jessicasavin-decoration.fr",
  "https://jessicasavin-decoration.fr",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Autoriser les outils sans origin (Postman) et les origines listées
      const isVercelPreview =
        typeof origin === "string" && origin.endsWith(".vercel.app");
      if (!origin || allowedOrigins.includes(origin) || isVercelPreview) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", pingRoute);

// Connexion à MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("🚨 MONGO_URI non défini dans .env");
  process.exit(1);
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connecté");
    const port = process.env.PORT || 5000;
    app.listen(port, () =>
      console.log(`🚀 Serveur démarré sur http://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.error("❌ Erreur de connexion MongoDB :", err.message);
    process.exit(1);
  });
