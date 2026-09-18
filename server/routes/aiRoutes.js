import express from "express";
import { summary, ask, studyPlan } from "../controllers/aiController.js";

const router = express.Router();

router.post("/summary", summary);
router.post("/ask", ask);
router.post("/study-plan", studyPlan);

export default router;
