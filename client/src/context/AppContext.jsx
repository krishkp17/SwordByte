import React ,  { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);

const defaultTopics = [
  { topic: "Ohm's Law", percentage: 100 },
  { topic: "Resistance", percentage: 60 },
  { topic: "Electric Power", percentage: 20 },
  { topic: "Series Circuits", percentage: 40 },
];

export function AppProvider({ children }) {
  const [documentId, setDocumentId] = useState(
    localStorage.getItem("learnmate_document_id") || ""
  );
  const [documentName, setDocumentName] = useState(
    localStorage.getItem("learnmate_document_name") || "Physics — Electricity"
  );
  const [summary, setSummary] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [weakTopics, setWeakTopics] = useState(["Electric Power", "Series Circuits"]);
  const [theme, setTheme] = useState(localStorage.getItem("learnmate_theme") || "light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("learnmate_theme", theme);
  }, [theme]);

  useEffect(() => {
    if (documentId) localStorage.setItem("learnmate_document_id", documentId);
    if (documentName) localStorage.setItem("learnmate_document_name", documentName);
  }, [documentId, documentName]);

  return (
    <AppContext.Provider
      value={{
        documentId,
        setDocumentId,
        documentName,
        setDocumentName,
        summary,
        setSummary,
        quiz,
        setQuiz,
        quizResult,
        setQuizResult,
        weakTopics,
        setWeakTopics,
        theme,
        setTheme,
        defaultTopics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
