import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Brain, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { generateQuiz, submitQuiz } from "../services/api";
import { useApp } from "../context/AppContext";
import React from "react";

export default function Quiz() {
  const navigate = useNavigate();
  const { documentId, quiz, setQuiz, setQuizResult } = useApp();
  const [difficulty, setDifficulty] = useState("Medium");
  const [count, setCount] = useState(5);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIndex(0);
    setAnswers([]);
  }, [quiz]);

  async function startQuiz() {
    if (!documentId) {
      setMessage("Upload a PDF first.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      const data = await generateQuiz(documentId, difficulty, count);
      setQuiz(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not generate quiz.");
    } finally {
      setLoading(false);
    }
  }

  function chooseAnswer(option) {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = option;
      return copy;
    });
  }

  async function finish() {
    setLoading(true);
    try {
      const result = await submitQuiz(quiz.id, answers);
      setQuizResult(result);
      navigate("/results");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not submit quiz.");
    } finally {
      setLoading(false);
    }
  }

  if (!quiz) {
    return (
      <div>
        <PageHeader
          eyebrow="AI Quiz Generator"
          title="Test what you know."
          description="Turn your study material into focused practice questions."
        />

        <div className="mx-auto max-w-3xl">
          <div className="card">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-200">
              <Brain size={38} />
            </div>

            <div className="mt-7 text-center">
              <h2 className="font-display text-2xl font-bold">Customize your quiz</h2>
              <p className="mt-2 text-sm text-slate-500">Choose a difficulty and length.</p>
            </div>

            <div className="mt-8">
              <label className="text-sm font-bold">Difficulty</label>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {["Easy", "Medium", "Hard"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setDifficulty(item)}
                    className={`rounded-2xl border px-4 py-3 font-bold transition ${
                      difficulty === item
                        ? "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-200"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <label className="text-sm font-bold">Number of questions</label>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[5, 10, 20].map((item) => (
                  <button
                    key={item}
                    onClick={() => setCount(item)}
                    className={`rounded-2xl border px-4 py-3 font-bold transition ${
                      count === item
                        ? "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-200"
                        : "border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {message && <p className="mt-5 text-center text-sm font-semibold text-rose-500">{message}</p>}

            <button onClick={startQuiz} disabled={loading} className="btn-primary mt-8 w-full">
              {loading ? <Loader2 className="animate-spin" /> : <Brain size={18} />}
              {loading ? "Generating..." : "Generate quiz"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[index];
  const selected = answers[index];
  const percent = ((index + 1) / quiz.questions.length) * 100;

  return (
    <div>
      <PageHeader
        eyebrow={`Question ${index + 1} of ${quiz.questions.length}`}
        title="You've got this. 💪"
        description={`${quiz.difficulty} difficulty`}
      />

      <div className="mx-auto max-w-3xl">
        <div className="mb-5 h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="h-full rounded-full bg-gradient-to-r from-teal-700 to-teal-400 transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 dark:bg-teal-950/50 dark:text-teal-200">
              {question.topic}
            </span>
            <span className="text-xs font-bold text-slate-400">{Math.round(percent)}%</span>
          </div>

          <h2 className="mt-8 font-display text-2xl font-bold leading-tight sm:text-3xl">
            {question.question}
          </h2>

          <div className="mt-8 space-y-3">
            {question.options.map((option, optionIndex) => (
              <button
                key={option}
                onClick={() => chooseAnswer(optionIndex)}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                  selected === optionIndex
                    ? "border-teal-500 bg-teal-50 text-teal-800 shadow-sm dark:bg-teal-950/40 dark:text-teal-100"
                    : "border-slate-200 hover:border-teal-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                }`}
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl font-bold ${
                  selected === optionIndex ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                }`}>
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                <span className="font-medium">{option}</span>
                {selected === optionIndex && <CheckCircle2 className="ml-auto text-teal-600" size={20} />}
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              disabled={index === 0}
              onClick={() => setIndex((i) => i - 1)}
              className="btn-soft disabled:opacity-40"
            >
              <ArrowLeft size={17} /> Back
            </button>

            {index < quiz.questions.length - 1 ? (
              <button
                disabled={selected === undefined}
                onClick={() => setIndex((i) => i + 1)}
                className="btn-primary disabled:opacity-40"
              >
                Next <ArrowRight size={17} />
              </button>
            ) : (
              <button
                disabled={selected === undefined || loading}
                onClick={finish}
                className="btn-primary disabled:opacity-40"
              >
                {loading ? "Submitting..." : "See results"} <CheckCircle2 size={17} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}