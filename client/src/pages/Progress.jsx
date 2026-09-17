import React from "react";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageHeader from "../components/PageHeader";
import TopicBar from "../components/TopicBar";
import { getProgress } from "../services/api";

const heat = Array.from({ length: 28 }, (_, i) => (i * 7) % 5);

export default function Progress() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getProgress().then(setData).catch(() => {});
  }, []);

  const scores = data?.scores || [
    { name: "Mon", score: 48 },
    { name: "Tue", score: 56 },
    { name: "Wed", score: 52 },
    { name: "Thu", score: 68 },
    { name: "Fri", score: 74 },
    { name: "Sat", score: 82 },
    { name: "Sun", score: 86 },
  ];

  const topics = data?.topics || [];

  return (
    <div>
      <PageHeader
        eyebrow="Long-term learning"
        title="Your progress story 📈"
        description="See how your understanding improves over time."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">Score trend</h2>
              <p className="mt-1 text-sm text-slate-500">Your recent quiz performance</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-600 dark:bg-emerald-950/30">+38%</span>
          </div>

          <div className="mt-7 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scores}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#0f766e" fill="url(#scoreFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 className="font-display text-xl font-bold">Topic mastery</h2>
          <p className="mt-1 text-sm text-slate-500">Your current understanding</p>

          <div className="mt-7 space-y-6">
            {topics.map((item) => <TopicBar key={item.topic} {...item} />)}
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-bold">Study heatmap</h2>
            <p className="mt-1 text-sm text-slate-500">Consistency matters more than perfection.</p>
          </div>
          <div className="text-sm font-bold text-teal-600">🔥 7 day streak</div>
        </div>

        <div className="mt-7 grid grid-cols-7 gap-2 sm:grid-cols-14">
          {heat.map((level, i) => (
            <div
              key={i}
              title={`Study day ${i + 1}`}
              className={`aspect-square rounded-lg ${
                level === 0
                  ? "bg-slate-100 dark:bg-slate-800"
                  : level === 1
                  ? "bg-teal-100 dark:bg-teal-950/50"
                  : level === 2
                  ? "bg-teal-200 dark:bg-teal-900"
                  : level === 3
                  ? "bg-teal-400"
                  : "bg-teal-700"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
