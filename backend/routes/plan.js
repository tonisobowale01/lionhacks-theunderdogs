const express = require("express");
const router = express.Router();
const { scoreAnswers } = require("../services/scoringService");
const { buildPlan } = require("../services/planBuilder");
const { generateSyllabus } = require("../services/geminiService");

// POST /api/plan/generate
router.post("/generate", async (req, res) => {
  try {
    const { userData, title } = req.body;

    // 1. Logic-based processing
    const scores = scoreAnswers(userData);
    const rawPlan = buildPlan(scores, parseInt(userData.hoursPerWeek) || 10);

    // 2. AI-based enhancement (Pairing with geminiService)
    const aiSyllabusText = await generateSyllabus(rawPlan);

    // 3. Construct response matching Dashboard.jsx expectations
    const response = {
      persona: {
        archetype: userData.studyStyle || "The Adaptive Learner",
        summary: `Tailored plan for a ${userData.yearLevel} student majoring in ${userData.major}.`,
        strengths: ["Focused execution", "Clear goals"],
        watchouts: ["Over-commitment", "Burnout"],
      },
      courses: [
        {
          id: "generated-1",
          code: userData.major
            ? userData.major.substring(0, 3).toUpperCase() + "101"
            : "STUDY",
          instructor: "Personalized AI",
          title: title || "General Study Plan",
          examDates: [{ label: "Target Completion", date: "End of Term" }],
          topics: Object.entries(scores).map(([name, score]) => ({
            title: name.charAt(0).toUpperCase() + name.slice(1),
            status: score > 0.7 ? "mastered" : "in-progress",
            weight: Math.round(score * 100),
          })),
          studyPlan: rawPlan.map((p) => ({
            day: "Session",
            focus: p.focus,
            durationMin: 60,
          })),
        },
      ],
      recommendations: [aiSyllabusText.substring(0, 200) + "..."],
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
