import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

function demoSummary(text) {
  const words = text.split(/\s+/).filter(Boolean);
  const sample = words.slice(0, 90).join(" ");

  return {
    title: "AI Summary — Demo Mode",
    overview:
      "This is a demo response because GEMINI_API_KEY is not configured. Add your API key to receive model-generated summaries.",
    keyConcepts: [
      "Identify the main definitions and principles.",
      "Connect formulas with the concepts they describe.",
      "Use examples to test whether you can apply the idea.",
    ],
    formulas: ["Review formulas directly from the uploaded material."],
    examTips: [
      "Turn each major heading into a self-test question.",
      "Spend extra time on topics you miss during quizzes.",
    ],
    topics: ["Core concepts", "Definitions", "Applications"],
    sourcePreview: sample,
  };
}

function demoQuiz(count = 5) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      question: `Demo question ${i + 1}: Which study action is most useful for checking understanding?`,
      options: [
        "Reread without testing",
        "Explain the idea in your own words",
        "Skip the difficult topic",
        "Memorize the page number",
      ],
      correctAnswer: 1,
      topic: i % 2 ? "Applications" : "Core concepts",
      explanation: "Explaining an idea in your own words is a strong way to test understanding.",
    });
  }
  return questions;
}

function cleanJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start !== -1 && end !== -1) return candidate.slice(start, end + 1);

  const arrayStart = candidate.indexOf("[");
  const arrayEnd = candidate.lastIndexOf("]");
  if (arrayStart !== -1 && arrayEnd !== -1) return candidate.slice(arrayStart, arrayEnd + 1);

  throw new Error("AI returned an invalid JSON response.");
}

async function generate(prompt, instructions, retries = 3, delay = 1000) {
  if (!ai) return null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: instructions,
        },
      });

      return response.text;
    } catch (error) {
      const isUnavailable = error.message?.includes("503") || error.status === "UNAVAILABLE";

      if (isUnavailable && attempt < retries) {
        console.warn(`[Gemini] High demand (503). Retrying attempt ${attempt} of ${retries} in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff (1s, 2s, 4s)
      } else {
        throw error;
      }
    }
  }
}

export async function generateSummary(text) {
  if (!ai) return demoSummary(text);

  const output = await generate(
    `Study material:
${text.slice(0, 50000)}

Return JSON only with this exact shape:
{
  "title": "string",
  "overview": "string",
  "keyConcepts": ["string"],
  "formulas": ["string"],
  "examTips": ["string"],
  "topics": ["string"]
}`,
    `You are LearnMate, an educational AI tutor.
Create a concise, accurate study summary from the supplied material.
Do not invent facts not supported by the material.
Use simple student-friendly language.
Return valid JSON only.`
  );

  return JSON.parse(cleanJson(output));
}

export async function askNotes(text, question) {
  if (!ai) {
    return {
      answer:
        "Demo mode: I can answer questions about your uploaded notes once GEMINI_API_KEY is configured. Your question was: " +
        question,
      sources: ["Uploaded material"],
    };
  }

  const output = await generate(
    `Study material:
${text.slice(0, 50000)}

Student question:
${question}`,
    `You are LearnMate, an educational AI tutor.
Answer using the supplied study material as the primary source.
If the answer cannot be found in the material, clearly say that.
Keep the explanation useful and student-friendly.
Do not pretend to have information that is absent from the material.`
  );

  return {
    answer: output,
    sources: ["Uploaded study material"],
  };
}

export async function generateQuiz(text, difficulty, questionCount) {
  if (!ai) return demoQuiz(questionCount);

  const output = await generate(
    `Study material:
${text.slice(0, 50000)}

Difficulty: ${difficulty}
Number of questions: ${questionCount}

Return JSON only:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0,
      "topic": "string",
      "explanation": "string"
    }
  ]
}`,
    `You are LearnMate's quiz generator.
Create exactly the requested number of multiple-choice questions using only the supplied material.
Each question must have exactly four options.
correctAnswer must be a zero-based option index.
Assign a meaningful topic to every question.
Return valid JSON only.`
  );

  const parsed = JSON.parse(cleanJson(output));
  return parsed.questions;
}

export async function generateStudyPlan(weakTopics) {
  if (!ai) {
    return weakTopics.map((topic, index) => ({
      title: `${topic} revision`,
      minutes: index === 0 ? 15 : 10,
      type: "Revision",
      description: `Review ${topic}, explain it in your own words, then solve practice questions.`,
    }));
  }

  const output = await generate(
    `Weak topics:
${JSON.stringify(weakTopics)}`,
    `You are LearnMate's personalized study planner.
Create a practical plan for improving weak topics.
Return JSON only:
{
  "tasks": [
    {
      "title": "string",
      "minutes": 10,
      "type": "Revision|Practice|Quiz",
      "description": "string"
    }
  ]
}
Prioritize the weakest topics first. Keep total time reasonable for one study session.`
  );

  return JSON.parse(cleanJson(output)).tasks;
}