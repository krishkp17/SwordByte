import React from "react";



export default function TopicBar({ topic, percentage }) {
  const status =
    percentage >= 80
      ? { label: "Mastered", cls: "bg-emerald-500", text: "text-emerald-600" }
      : percentage >= 50
      ? { label: "Improving", cls: "bg-amber-400", text: "text-amber-600" }
      : { label: "Weak", cls: "bg-rose-500", text: "text-rose-600" };

  return (
    <div className="group">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-semibold text-slate-700 dark:text-slate-200">{topic}</span>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${status.text}`}>{status.label}</span>
          <span className="font-display font-bold">{percentage}%</span>
        </div>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full ${status.cls} transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
