import { useEffect, useState } from "react";
import { Bookmark, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import EmptyMascot from "../components/EmptyMascot";
import { generateSummary, getDocument } from "../services/api";
import { useApp } from "../context/AppContext";
import React from "react";


export default function Notes() {
  const { documentId, documentName, summary, setSummary } = useApp();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState("concepts");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!documentId || summary) return;

    setLoading(true);
    getDocument(documentId)
      .then((doc) => {
        if (doc.summary) {
          setSummary(doc.summary);
          return;
        }
        return generateSummary(documentId).then(setSummary);
      })
      .catch((err) => setError(err.response?.data?.message || "Could not generate summary."))
      .finally(() => setLoading(false));
  }, [documentId, summary, setSummary]);

  if (!documentId) {
    return (
      <div>
        <PageHeader eyebrow="AI notes" title="Your smart notes" description="Upload a PDF first and LearnMate will build your summary." />
        <div className="card">
          <EmptyMascot title="Let's add some study material" text="Upload a PDF to unlock your AI summary." />
          <div className="text-center"><Link to="/upload" className="btn-primary">Upload material</Link></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <PageHeader eyebrow="AI notes" title="Analyzing your notes..." />
        <div className="card animate-pulse">
          <div className="h-8 w-2/3 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="mt-4 h-4 w-full rounded bg-slate-100 dark:bg-slate-800" />
          <div className="mt-2 h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="mt-8 h-40 rounded-3xl bg-slate-100 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        eyebrow="AI-generated notes"
        title={summary?.title || "Your AI Summary"}
        description={documentName}
        action={
          <Link to="/tutor" className="btn-primary">
            <Sparkles size={18} /> Ask my notes
          </Link>
        }
      />

      {error && <div className="mb-5 rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-600">{error}</div>}

      {summary && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <article className="card">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Overview</p>
                <h2 className="mt-1 font-display text-2xl font-bold">In simple words</h2>
              </div>
              <button className="rounded-xl border border-slate-200 p-2.5 dark:border-slate-800">
                <Bookmark size={18} />
              </button>
            </div>

            <p className="mt-6 leading-8 text-slate-600 dark:text-slate-300">{summary.overview}</p>

            <div className="mt-7 space-y-3">
              {[
                ["concepts", "Key concepts", summary.keyConcepts, "💡"],
                ["formulas", "Formulas", summary.formulas, "⚡"],
                ["tips", "Exam tips", summary.examTips, "🎯"],
              ].map(([key, title, items, emoji]) => (
                <div key={key} className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setOpen(open === key ? "" : key)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left font-bold"
                  >
                    <span className="flex items-center gap-3">{emoji} {title}</span>
                    {open === key ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {open === key && (
                    <div className="border-t border-slate-100 px-5 pb-5 pt-4 dark:border-slate-800">
                      <ul className="space-y-3">
                        {(items || []).map((item, index) => (
                          <li key={index} className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-teal-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>

          <aside className="card h-fit">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Detected topics</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(summary.topics || []).map((topic) => (
                <span key={topic} className="rounded-full bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700 dark:bg-teal-950/50 dark:text-teal-200">
                  {topic}
                </span>
              ))}
            </div>

            <Link to="/quiz" className="btn-primary mt-6 w-full">
              Generate quiz
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
