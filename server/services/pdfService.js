import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function extractPdfText(filePath) {
  const buffer = await fs.readFile(filePath);

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  let text = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => item.str)
      .join(" ");

    text += pageText + "\n";
  }

  text = text
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .trim();

  if (!text) {
    throw new Error("No readable text was found in this PDF.");
  }

  return text;
}