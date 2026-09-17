import { useState } from "react";
import { Bot, Send, Sparkles, User } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { askTutor } from "../services/api";
import { useApp } from "../context/AppContext";
import React from "react";


const suggestions = [
  "Explain this like I'm 10",
  "What formula should I remember?",
  "Give me a real-world example",
  "What are the most important exam points?",
];

export default function AITutor() {
  const { documentId } = useApp();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey! I'm LearnMate 🤖 Ask me anything about your uploaded notes.",
      sources: [],
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function send(text = question) {
    if (!text.trim() || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setQuestion("");
    setLoading(true);

    try {
      const data = await askTutor(documentId, text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.answer, sources: data.sources || [] },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: error.response?.data?.message || "I couldn't answer that right now.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Ask My Notes"
        title="Your personal AI tutor."
        description="Get context-based explanations from your uploaded study material."
      />

      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-100 p-5 dark:border-slate-800">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-teal-700 to-teal-400 text-white shadow-lg">
            <Bot />
          </div>
          <div>
            <div className="font-bold">LearnMate AI</div>
            <div className="text-xs text-emerald-600">● Ready to help</div>
          </div>
        </div>

        <div className="min-h-[430px] space-y-5 bg-slate-50/70 p-5 sm:p-7 dark:bg-slate-950/30">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
              {message.role === "assistant" && (
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-200">
                  <Bot size={17} />
                </div>
              )}

              <div className={`max-w-[78%] rounded-3xl px-5 py-4 text-sm leading-7 ${
                message.role === "user"
                  ? "rounded-br-md bg-teal-700 text-white"
                  : "rounded-bl-md bg-white text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200"
              }`}>
                <div className="whitespace-pre-wrap">{message.text}</div>
                {message.sources?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.sources.map((source) => (
                      <span key={source} className="rounded-full bg-teal-50 px-2.5 py-1 text-[10px] font-bold text-teal-700 dark:bg-teal-950/50 dark:text-teal-200">
                        📚 {source}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {message.role === "user" && (
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-100 text-orange-600">
                  <User size={17} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-teal-100 text-teal-700">
                <Sparkles size={17} />
              </div>
              LearnMate is thinking...
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 p-5 dark:border-slate-800">
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {suggestions.map((item) => (
              <button
                key={item}
                onClick={() => send(item)}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-950">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Ask something about your notes..."
              className="min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none"
            />
            <button onClick={() => send()} disabled={loading} className="btn-primary h-12 w-12 rounded-xl p-0">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}