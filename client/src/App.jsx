import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UploadMaterial from "./pages/UploadMaterial";
import Notes from "./pages/Notes";
import AITutor from "./pages/AITutor";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import StudyPlan from "./pages/StudyPlan";
import Progress from "./pages/Progress";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<UploadMaterial />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/tutor" element={<AITutor />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
        <Route path="/study-plan" element={<StudyPlan />} />
        <Route path="/progress" element={<Progress />} />
      </Routes>
    </Layout>
  );
}
