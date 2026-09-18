import React from "react";


export default function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.2em] text-teal-600">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          {title}
        </h1>
        {description && <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
    </div>
  );
}