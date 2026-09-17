import { useRef, useState } from "react";
import { UploadCloud, FileText, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { uploadDocument } from "../services/api";
import { useApp } from "../context/AppContext";
import React from "react";


export default function UploadMaterial() {
  const inputRef = useRef();
  const navigate = useNavigate();
  const { setDocumentId, setDocumentName } = useApp();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleFile(selected) {
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      setError("Please choose a PDF file.");
      return;
    }

    setFile(selected);
    setError("");
    setStatus("uploading");

    try {
      const data = await uploadDocument(selected, (event) => {
        if (event.total) setProgress(Math.round((event.loaded / event.total) * 100));
      });

      setDocumentId(data.document.id);
      setDocumentName(data.document.filename);
      setProgress(100);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.message || err.message || "Upload failed.");
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Smart material upload"
        title="Give LearnMate your notes."
        description="Upload a PDF and let AI turn it into summaries, questions, quizzes and a personalized learning path."
      />

      <div className="mx-auto max-w-4xl">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`relative overflow-hidden rounded-[2rem] border-2 border-dashed p-8 text-center transition sm:p-14 ${
            status === "done"
              ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/20"
              : "border-teal-200 bg-white dark:border-teal-900 dark:bg-slate-900"
          }`}
        >
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-100/60 blur-3xl dark:bg-teal-900/20" />

          {status === "idle" && (
            <>
              <div className="mx-auto grid h-24 w-24 animate-float place-items-center rounded-[2rem] bg-gradient-to-br from-teal-100 to-orange-100 text-teal-700 shadow-inner">
                <UploadCloud size={42} />
              </div>
              <h2 className="mt-7 font-display text-2xl font-extrabold">Upload your study material</h2>
              <p className="mx-auto mt-3 max-w-md text-slate-500 dark:text-slate-400">
                Drag and drop a PDF here, or choose one from your computer.
              </p>
              <button onClick={() => inputRef.current?.click()} className="btn-primary mt-7">
                Choose PDF
              </button>
              <input
                ref={inputRef}
                hidden
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
              <p className="mt-4 text-xs font-medium text-slate-400">PDF only · max 10 MB</p>
            </>
          )}

          {status === "uploading" && (
            <div className="mx-auto max-w-lg">
              <div className="mx-auto grid h-24 w-24 animate-pulse place-items-center rounded-[2rem] bg-teal-50 text-teal-700 dark:bg-teal-950/40">
                <Sparkles size={40} />
              </div>
              <h2 className="mt-7 font-display text-2xl font-extrabold">AI is preparing your material...</h2>
              <p className="mt-2 text-slate-500">{file?.name}</p>
              <div className="mt-7 h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-700 to-teal-400 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs font-bold text-slate-400">
                <span>Uploading</span><span>{progress}%</span>
              </div>
            </div>
          )}

          {status === "done" && (
            <div>
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="mt-7 font-display text-2xl font-extrabold">Material analyzed!</h2>
              <p className="mt-2 text-slate-500">{file?.name}</p>
              <div className="mx-auto mt-7 flex max-w-lg items-center justify-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm dark:bg-slate-900">
                <FileText className="text-teal-600" />
                <div className="min-w-0">
                  <div className="truncate font-bold">{file?.name}</div>
                  <div className="text-xs text-slate-400">{(file?.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
              <button onClick={() => navigate("/notes")} className="btn-primary mt-7">
                Open AI Summary <ArrowRight size={18} />
              </button>
            </div>
          )}

          {status === "error" && (
            <div>
              <div className="text-5xl">😕</div>
              <h2 className="mt-5 font-display text-2xl font-extrabold">Upload failed</h2>
              <p className="mt-2 text-rose-500">{error}</p>
              <button onClick={() => setStatus("idle")} className="btn-soft mt-6">Try again</button>
            </div>
          )}
        </div>

        {error && status !== "error" && (
          <p className="mt-4 text-center text-sm font-semibold text-rose-500">{error}</p>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ["📄", "PDF notes", "Upload chapters and study documents."],
            ["✨", "AI summary", "Get key concepts and exam tips."],
            ["🎯", "Weak topics", "Find exactly what to revise next."],
          ].map(([emoji, title, text]) => (
            <div key={title} className="card">
              <div className="text-2xl">{emoji}</div>
              <h3 className="mt-3 font-bold">{title}</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}