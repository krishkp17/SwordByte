import Quiz from "../models/Quiz.js";
import QuizResult from "../models/QuizResult.js";
import  connectDB  from "../utils/db.js";
import { findDocument } from "./documentController.js";
import { generateQuiz } from "../services/aiService.js";

const memoryQuizzes = new Map();
const memoryResults = [];

export async function createQuiz(req, res, next) {
  try {
    const { documentId, difficulty = "Medium", questionCount = 5 } = req.body;

    const document = await findDocument(documentId);
    if (!document) return res.status(404).json({ message: "Document not found." });

    const questions = await generateQuiz(
      document.text,
      difficulty,
      Number(questionCount)
    );

    const base = {
      userId: "demo-user",
      documentId: String(document._id),
      difficulty,
      questionCount: questions.length,
      questions,
    };

    let quiz;

    if (connectDB()) {
      quiz = await Quiz.create(base);
    } else {
      const id = `quiz-${Date.now()}`;
      quiz = { _id: id, ...base };
      memoryQuizzes.set(id, quiz);
    }

    res.status(201).json({
      id: String(quiz._id),
      difficulty: quiz.difficulty,
      questions: quiz.questions,
    });
  } catch (error) {
    next(error);
  }
}

function analyzeAnswers(quiz, answers) {
  const topicMap = {};

  const normalized = quiz.questions.map((q, index) => {
    const selectedAnswer = Number(answers[index]);
    const correct = selectedAnswer === q.correctAnswer;
    const topic = q.topic || "General";

    if (!topicMap[topic]) {
      topicMap[topic] = { topic, correct: 0, total: 0 };
    }

    topicMap[topic].total += 1;
    if (correct) topicMap[topic].correct += 1;

    return {
      questionIndex: index,
      selectedAnswer,
      correct,
      topic,
    };
  });

  const topicPerformance = Object.values(topicMap).map((item) => {
    const percentage = Math.round((item.correct / item.total) * 100);
    return {
      ...item,
      percentage,
      status:
        percentage >= 80
          ? "mastered"
          : percentage >= 50
          ? "improving"
          : "weak",
    };
  });

  const score = Math.round(
    (normalized.filter((a) => a.correct).length / quiz.questions.length) * 100
  );

  return {
    score,
    answers: normalized,
    topicPerformance,
    weakTopics: topicPerformance
      .filter((item) => item.percentage < 70)
      .sort((a, b) => a.percentage - b.percentage)
      .map((item) => item.topic),
  };
}

export async function submitQuiz(req, res, next) {
  try {
    const { quizId, answers = [] } = req.body;

    const quiz = connectDB()
      ? await Quiz.findById(quizId)
      : memoryQuizzes.get(quizId);

    if (!quiz) return res.status(404).json({ message: "Quiz not found." });

    const result = analyzeAnswers(quiz, answers);

    let saved;

    if (connectDB()) {
      saved = await QuizResult.create({
        userId: "demo-user",
        quizId,
        documentId: quiz.documentId,
        ...result,
      });
    } else {
      saved = { _id: `result-${Date.now()}`, quizId, ...result };
      memoryResults.push(saved);
    }

    res.json({
      id: String(saved._id),
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function analyzeQuiz(req, res, next) {
  try {
    const { quizId, answers = [] } = req.body;
    const quiz = connectDB()
      ? await Quiz.findById(quizId)
      : memoryQuizzes.get(quizId);

    if (!quiz) return res.status(404).json({ message: "Quiz not found." });

    res.json(analyzeAnswers(quiz, answers));
  } catch (error) {
    next(error);
  }
}

export async function getLatestResults(req, res, next) {
  try {
    if (connectDB()) {
      const results = await QuizResult.find({ userId: "demo-user" })
        .sort({ createdAt: -1 })
        .limit(20);
      return res.json(results);
    }

    res.json(memoryResults.slice(-20).reverse());
  } catch (error) {
    next(error);
  }
}
