import { Menu, Moon, Sun, Bell } from "lucide-react";
import { useApp } from "../context/AppContext";
import React from "react";


export default function Topbar({ onMenu }) {
  const { theme, setTheme } = useApp();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-[#fafaf9]/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenu}
          className="rounded-2xl border border-slate-200 bg-white p-2.5 lg:hidden dark:border-slate-800 dark:bg-slate-900"
        >
          <Menu size={20} />
        </button>

        <div className="hidden lg:block">
          <p className="text-sm font-medium text-slate-400">Your learning space</p>
          <p className="font-display font-bold text-slate-800 dark:text-white">
            Learn smarter, not harder.
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="rounded-2xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900">
            <Bell size={19} />
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-2xl border border-slate-200 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900"
          >
            {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <div className="ml-1 grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-orange-300 to-orange-500 font-bold text-white shadow-lg">
            K
          </div>
        </div>
      </div>
    </header>
  );
}
