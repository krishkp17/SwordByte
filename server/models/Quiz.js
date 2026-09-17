import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: String,
    options: [String],
    correctAnswer: Number,
    topic: String,
    explanation: String,
  },
  { _id: false }
);



const quizSchema = new mongoose.Schema(
  {
    userId: { type: String, default: "demo-user" },
    documentId: { type: String, required: true },
    difficulty: String,
    questionCount: Number,
    questions: [questionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
