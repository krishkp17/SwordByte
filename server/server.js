import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dns from 'node:dns/promises'

import documentRoutes from "./routes/documentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

dns.setServers(['8.8.8.8','0.0.0.0'])

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "LearnMate API",
    mongo: mongoose.connection.readyState === 1,
    aiConfigured: Boolean(process.env.OPENAI_API_KEY),
  });
});

app.use("/api/documents", documentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/progress", progressRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  });
});

async function start() {
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("✓ MongoDB connected");
    } catch (error) {
      console.error("MongoDB connection failed. Running in demo mode.", error.message);
    }
  } else {
    console.log("MONGODB_URI not configured. Running in demo mode.");
  }

  app.listen(PORT, () => {
    console.log(`✓ LearnMate API running at http://localhost:${PORT}`);
  });
}

start();