import { useEffect, useState } from "react";
import { Flame, BookOpen, Brain, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import ProgressRing from "../components/ProgressRing";
import TopicBar from "../components/TopicBar";
import StatCard from "../components/StatCard";
import { getProgress } from "../services/api";
import { useApp } from "../context/AppContext";
import React from "react";

export default function Dashboard() {
  const { weakTopics, defaultTopics } = useApp();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    getProgress().then(setProgress).catch(() => {});
  }, []);

  const topics = progress?.topics || defaultTopics;

  return (
    <div>
      <PageHeader
        eyebrow="Good morning 👋"
        title="Ready to level up?"
        description="Turn your notes into a personalized learning path."
        action={
          <Link to="/upload" className="btn-primary">
            <Sparkles size={18} />
            Start learning
          </Link>
        }
      />

      <section className="grid gap-5 lg:grid-cols-[1.25fr_2fr]">
        <div className="glass rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Overall progress
              </p>

              <h2 className="mt-1 font-display text-xl font-bold">
                Your learning journey
              </h2>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-950/40">
              +8% this week
            </span>
          </div>

          <div className="mt-7 flex items-center justify-center">
            <ProgressRing value={76} size={180} />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-100 p-4 text-center dark:bg-slate-800/60">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your consistency is paying off. Keep your streak going!
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <StatCard
            icon={<Brain size={20} />}
            label="Quizzes"
            value={progress?.quizzes || 12}
            helper="taken so far"
          />

          <StatCard
            icon={<BookOpen size={20} />}
            label="Subjects"
            value={progress?.subjects || 4}
            helper="in your library"
            accent="violet"
          />

          <StatCard
            icon={<Flame size={20} />}
            label="Streak"
            value={`${progress?.streak || 7} days`}
            helper="keep it alive"
            accent="orange"
          />
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <div className="relative overflow-hidden rounded-[2rem] bg-blue-700 p-7 text-white shadow-lg shadow-blue-700/10 dark:bg-gradient-to-br dark:from-teal-800 dark:via-teal-700 dark:to-teal-500 dark:shadow-xl dark:shadow-teal-800/20">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-100 dark:text-teal-100">
              <Sparkles size={17} />
              RECOMMENDED FOR TODAY
            </div>

            <h2 className="mt-5 max-w-lg font-display text-3xl font-extrabold">
              Improve Electric Power
            </h2>

            <p className="mt-3 max-w-lg text-blue-50 dark:text-teal-50">
              It's your weakest topic right now. A focused 15-minute revision can move you closer to mastery.
            </p>

            <Link
              to="/study-plan"
              className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-bold text-blue-700 transition hover:-translate-y-0.5 dark:text-teal-800"
            >
              Start 15 min revision <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Learning gaps
              </p>

              <h2 className="mt-1 font-display text-xl font-bold">
                Topics to improve
              </h2>
            </div>

            <Link
              to="/results"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-teal-600"
            >
              View all
            </Link>
          </div>

          <div className="mt-7 space-y-6">
            {topics.slice(0, 4).map((item) => (
              <TopicBar key={item.topic} {...item} />
            ))}
          </div>
        </div>
      </section>

      <section className="card mt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Quick actions
            </p>

            <h2 className="mt-1 font-display text-xl font-bold">
              What do you want to do?
            </h2>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Upload notes", "/upload", "📄"],
            ["Read summary", "/notes", "📚"],
            ["Ask AI", "/tutor", "🤖"],
            ["Take quiz", "/quiz", "🧠"],
          ].map(([label, to, emoji]) => (
            <Link
              key={to}
              to={to}
              className="rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-blue-50/50 dark:border-slate-800 dark:hover:border-teal-800 dark:hover:bg-teal-950/20"
            >
              <div className="text-2xl">{emoji}</div>

              <div className="mt-3 font-bold">{label}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
