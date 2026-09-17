import React from "react";


export default function StatCard({ icon, label, value, helper, accent = "teal" }) {
  const accents = {
    teal: "from-teal-50 to-white text-teal-700 dark:from-teal-950/40 dark:to-slate-900",
    orange: "from-orange-50 to-white text-orange-600 dark:from-orange-950/30 dark:to-slate-900",
    violet: "from-violet-50 to-white text-violet-600 dark:from-violet-950/30 dark:to-slate-900",
  };

  return (
    <div className={`rounded-3xl border border-slate-200/70 bg-gradient-to-br p-5 shadow-sm dark:border-slate-800 ${accents[accent]}`}>
      <div className="flex items-start justify-between">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-sm dark:bg-slate-800">
          {icon}
        </div>
        <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-800">
          {label}
        </span>
      </div>
      <div className="mt-6 font-display text-3xl font-extrabold text-slate-900 dark:text-white">{value}</div>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{helper}</p>
    </div>
  );
}