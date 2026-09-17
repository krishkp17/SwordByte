import { useEffect, useState } from "react";
import { Check, Clock3, Sparkles } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { generateStudyPlan } from "../services/api";
import { useApp } from "../context/AppContext";
import React from "react";

const fallback = [
  { title: "Electric Power revision", minutes: 15, type: "Revision", description: "Review the core concept and explain the formula in your own words." },
  { title: "Practice questions", minutes: 10, type: "Practice", description: "Solve targeted questions focused on your mistakes." },
  { title: "Series Circuits", minutes: 10, type: "Revision", description: "Review the rules and work through one example." },
  { title: "Targeted quiz", minutes: 5, type: "Quiz", description: "Retest yourself without looking at the notes." },
];

export default function StudyPlan() {
  const { weakTopics } = useApp();
  const [tasks, setTasks] = useState(fallback);
  const [checked, setChecked] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!weakTopics?.length) return;
    setLoading(true);
    generateStudyPlan(weakTopics)
      .then((data) => {
        if (data.tasks?.length) setTasks(data.tasks);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const total = tasks.reduce((sum, task) => sum + Number(task.minutes || 0), 0);
  const completed = checked.length;

  return (
    <div>
      <PageHeader
        eyebrow="Personalized learning"
        title="Your study plan ✨"
        description="A focused plan generated from your weakest topics."
        action={
          <div className="flex items-center gap-2 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700 dark:bg-orange-950/30 dark:text-orange-200">
            <Clock3 size={18} /> {total} minutes
          </div>
        }
      />

      <div className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-[2rem] bg-gradient-to-r from-teal-800 to-teal-600 p-6 text-white shadow-xl shadow-teal-800/20">
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-teal-100">
                <Sparkles size={17} /> TODAY'S PLAN
              </div>
              <h2 className="mt-3 font-display text-2xl font-extrabold">
                {completed === tasks.length ? "Session complete! 🎉" : "Let's turn weak into strong."}
              </h2>
              <p className="mt-2 text-sm text-teal-100">
                {completed}/{tasks.length} tasks complete
              </p>
            </div>
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/10 text-2xl backdrop-blur">🎯</div>
          </div>
        </div>

        <div className="space-y-4">
          {loading && (
            <div className="card text-center text-sm font-semibold text-slate-400">Creating your personalized plan...</div>
          )}

          {tasks.map((task, index) => {
            const done = checked.includes(index);
            return (
              <button
                key={`${task.title}-${index}`}
                onClick={() => setChecked((prev) => done ? prev.filter((i) => i !== index) : [...prev, index])}
                className={`flex w-full items-start gap-4 rounded-3xl border p-5 text-left transition ${
                  done
                    ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900 dark:bg-emerald-950/20"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                <div className={`mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                  done ? "bg-emerald-500 text-white" : "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-200"
                }`}>
                  {done ? <Check size={20} /> : index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`font-bold ${done ? "text-emerald-700 line-through dark:text-emerald-300" : ""}`}>{task.title}</h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800">{task.type}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{task.description}</p>
                </div>
                <div className="shrink-0 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 dark:bg-orange-950/30 dark:text-orange-200">
                  {task.minutes} min
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
