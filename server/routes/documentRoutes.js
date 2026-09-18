import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { uploadDocument, getDocument } from "../controllers/documentController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

const maxMB = Number(process.env.MAX_PDF_MB || 10);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: maxMB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed."));
    }
    cb(null, true);
  },
});

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/:id", getDocument);

export default router;