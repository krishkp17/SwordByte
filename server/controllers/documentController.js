import fs from "fs/promises";
import Document from "../models/Document.js";
import  connectDB  from "../utils/db.js";
import { extractPdfText } from "../services/pdfService.js";

const memoryDocuments = new Map();

export async function uploadDocument(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ message: "Please upload a PDF." });

    const text = await extractPdfText(req.file.path);

    const base = {
      userId: "demo-user",
      filename: req.file.originalname,
      text,
      summary: null,
      topics: [],
    };

    let document;

    if (connectDB()) {
      document = await Document.create(base);
    } else {
      const id = `demo-${Date.now()}`;
      document = { _id: id, ...base, createdAt: new Date().toISOString() };
      memoryDocuments.set(id, document);
    }

    res.status(201).json({
      message: "Material uploaded and text extracted.",
      document: {
        id: String(document._id),
        filename: document.filename,
        textLength: text.length,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getDocument(req, res, next) {
  try {
    let document;

    if (connectDB()) {
      document = await Document.findById(req.params.id);
    } else {
      document = memoryDocuments.get(req.params.id);
    }

    if (!document) return res.status(404).json({ message: "Document not found." });

    res.json({
      id: String(document._id),
      filename: document.filename,
      text: document.text,
      summary: document.summary,
      topics: document.topics,
    });
  } catch (error) {
    next(error);
  }
}

export async function findDocument(id) {
  if (connectDB()) return Document.findById(id);
  return memoryDocuments.get(id);
}

export async function updateDocument(id, update) {
  if (connectDB()) return Document.findByIdAndUpdate(id, update, { new: true });
  const current = memoryDocuments.get(id);
  if (!current) return null;
  const updated = { ...current, ...update };
  memoryDocuments.set(id, updated);
  return updated;
}
