import { findDocument, updateDocument } from "./documentController.js";
import {
  generateSummary,
  askNotes,
  generateStudyPlan,
} from "../services/aiService.js";



export async function summary(req, res, next) {
  try {
    const document = await findDocument(req.body.documentId);
    if (!document) return res.status(404).json({ message: "Document not found." });

    const result = await generateSummary(document.text);
    await updateDocument(document._id, {
      summary: result,
      topics: result.topics || [],
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function ask(req, res, next) {
  try {
    const { documentId, question } = req.body;
    if (!documentId || !question?.trim()) {
      return res.status(400).json({ message: "documentId and question are required." });
    }

    const document = await findDocument(documentId);
    if (!document) return res.status(404).json({ message: "Document not found." });

    const result = await askNotes(document.text, question);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function studyPlan(req, res, next) {
  try {
    const topics = req.body.weakTopics || [];
    if (!topics.length) {
      return res.status(400).json({ message: "Provide at least one weak topic." });
    }

    const tasks = await generateStudyPlan(topics);
    res.json({ tasks });
  } catch (error) {
    next(error);
  }
}


