import { motion } from "framer-motion";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import TopicBar from "../components/TopicBar";
import { useApp } from "../context/AppContext";
import React from "react";

const fallbackTopics = [
  { topic: "Ohm's Law", percentage: 100 },
  { topic: "Resistance", percentage: 60 },
  { topic: "Electric Power", percentage: 20 },
  { topic: "Series Circuits", percentage: 40 },
];

export default function Results() {
  const { quizResult, setWeakTopics } = useApp();
  const result = quizResult || {
    score: 60,
    weakTopics: ["Electric Power", "Series Circuits"],
    topicPerformance: fallbackTopics,
  };

  const topics = result.topicPerformance || fallbackTopics;

  function preparePlan() {
    setWeakTopics(result.weakTopics || topics.filter((t) => t.percentage < 70).map((t) => t.topic));
  }

  return (
    <div>
      <PageHeader
        eyebrow="Quiz complete"
        title="Here's what you learned."
        description="Your score is useful — but your learning gaps are even more useful."
      />

      <div className="mx-auto max-w-5xl">
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-teal-950 to-teal-800 p-8 text-center text-white shadow-2xl sm:p-12"
        >
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_0,transparent_2px),radial-gradient(circle_at_80%_40%,white_0,transparent_2px)] [background-size:36px_36px]" />
          <div className="relative">
            <div className="text-4xl">🎉</div>
            <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-teal-200">Your score</p>
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mt-2 font-display text-7xl font-extrabold"
            >
              {result.score}%
            </motion.div>
            <p className="mx-auto mt-3 max-w-md text-teal-100">
              {result.score >= 80 ? "Amazing work — you're close to mastery!" : "Good effort! Now let's turn your gaps into strengths."}
            </p>
          </div>
        </motion.section>

        <section className="card mt-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-teal-600">
                <Sparkles size={17} /> THE LEARNMATE DIFFERENCE
              </div>
              <h2 className="mt-2 font-display text-2xl font-extrabold">Your Learning Gaps</h2>
              <p className="mt-1 text-sm text-slate-500">Instead of only showing your score, we show where to focus next.</p>
            </div>
            <span className="rounded-full bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 dark:bg-rose-950/30">
              {result.weakTopics?.length || 2} topics need attention
            </span>
          </div>

          <div className="mt-8 space-y-7">
            {topics
              .slice()
              .sort((a, b) => a.percentage - b.percentage)
              .map((item) => (
                <TopicBar key={item.topic} {...item} />
              ))}
          </div>

          <div className="mt-9 rounded-3xl bg-gradient-to-r from-orange-50 to-amber-50 p-5 dark:from-orange-950/20 dark:to-amber-950/20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-bold text-orange-800 dark:text-orange-200">💡 Your next best move</div>
                <p className="mt-1 text-sm text-orange-700/80 dark:text-orange-200/70">
                  Focus on {result.weakTopics?.[0] || "Electric Power"} first.
                </p>
              </div>
              <Link to="/study-plan" onClick={preparePlan} className="btn-primary">
                Build my plan <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-5 flex justify-center">
          <Link to="/quiz" className="btn-soft">
            <RotateCcw size={17} /> Retake quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
