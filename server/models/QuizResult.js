import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionIndex: Number,
    selectedAnswer: Number,
    correct: Boolean,
    topic: String,
  },
  { _id: false }
);

const quizResultSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "demo-user" },
    quizId: String,
    documentId: String,
    score: Number,
    answers: [answerSchema],
    topicPerformance: [
      {
        topic: String,
        correct: Number,
        total: Number,
        percentage: Number,
        status: String,
      },
    ],
    weakTopics: [String],
  },
  { timestamps: true }
);

export default mongoose.model("QuizResult", quizResultSchema);