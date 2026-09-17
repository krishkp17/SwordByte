import { NavLink } from "react-router-dom";
import React from "react";

import {
  LayoutDashboard,
  Upload,
  NotebookTabs,
  Bot,
  BrainCircuit,
  Trophy,
  CalendarCheck2,
  ChartNoAxesCombined,
  X,
} from "lucide-react";

const items = [
  ["Dashboard", "/", LayoutDashboard],
  ["Upload Material", "/upload", Upload],
  ["Notes", "/notes", NotebookTabs],
  ["AI Tutor", "/tutor", Bot],
  ["Quiz", "/quiz", BrainCircuit],
  ["Results", "/results", Trophy],
  ["Study Plan", "/study-plan", CalendarCheck2],
  ["Progress", "/progress", ChartNoAxesCombined],
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white/95 p-5 backdrop-blur-xl transition-transform dark:border-slate-800 dark:bg-slate-950/95 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <NavLink to="/" onClick={onClose} className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-teal-700 to-teal-400 text-xl text-white shadow-lg shadow-teal-700/20">
              ✦
            </div>
            <div>
              <div className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
                Learn<span className="text-teal-600">Mate</span>
              </div>
              <div className="text-xs font-medium text-slate-400">AI study companion</div>
            </div>
          </NavLink>

          <button className="rounded-xl p-2 lg:hidden" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="mt-9 space-y-2">
          {items.map(([label, to, Icon]) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-teal-50 text-teal-800 shadow-sm dark:bg-teal-950/50 dark:text-teal-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="absolute bottom-5 left-5 right-5 rounded-3xl bg-gradient-to-br from-teal-700 to-teal-500 p-5 text-white shadow-xl shadow-teal-700/20">
          <div className="text-2xl">🚀</div>
          <div className="mt-3 font-bold">Keep your streak alive!</div>
          <p className="mt-1 text-xs leading-5 text-teal-50">
            A small focused session today can make tomorrow easier.
          </p>
        </div>
      </aside>
    </>
  );
}
