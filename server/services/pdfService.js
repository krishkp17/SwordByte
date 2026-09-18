import fs from "fs/promises";
import pdf from "pdf-parse";

export async function extractPdfText(filePath) {
  const buffer = await fs.readFile(filePath);
  const result = await pdf(buffer);

  const text = (result.text || "").replace(/\r/g, "").replace(/[ \t]+\n/g, "\n").trim();

  if (!text) {
    throw new Error("No readable text was found in this PDF.");
  }

  return text;
}