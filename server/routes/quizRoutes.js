import express from "express";
import {
  createQuiz,
  submitQuiz,
  analyzeQuiz,
} from "../controllers/quizController.js";

const router = express.Router();

router.post("/generate", createQuiz);
router.post("/submit", submitQuiz);
router.post("/analyze", analyzeQuiz);

export default router;
