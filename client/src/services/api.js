import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

export async function uploadDocument(file, onUploadProgress) {
  const form = new FormData();
  form.append("file", file);

  const { data } = await api.post("/documents/upload", form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

  return data;
}

export async function getDocument(id) {
  const { data } = await api.get(`/documents/${id}`);
  return data;
}

export async function generateSummary(documentId) {
  const { data } = await api.post("/ai/summary", { documentId });
  return data;
}

export async function askTutor(documentId, question) {
  const { data } = await api.post("/ai/ask", {
    documentId,
    question,
  });
  return data;
}

export async function generateQuiz(documentId, difficulty, questionCount) {
  const { data } = await api.post("/quiz/generate", {
    documentId,
    difficulty,
    questionCount,
  });
  return data;
}

export async function submitQuiz(quizId, answers) {
  const { data } = await api.post("/quiz/submit", {
    quizId,
    answers,
  });
  return data;
}

export async function generateStudyPlan(weakTopics) {
  const { data } = await api.post("/ai/study-plan", {
    weakTopics,
  });
  return data;
}

export async function getProgress() {
  const { data } = await api.get("/progress");
  return data;
}

export default api;