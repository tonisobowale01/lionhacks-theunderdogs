const express = require("express");
const router = express.Router();
const { scoreAnswers } = require("../services/scoringService");
const { buildPlan } = require("../services/planBuilder");
const {
  generateSyllabus,
  generateDailyPlan,
} = require("../services/geminiService");

const DAY_ORDER = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };

// Helper function to extract course goals from userData
function extractCourseGoals(userData) {
  const goals = [];

  if (userData.goals) {
    const goalItems = userData.goals
      .split(/[,;]/)
      .map((g) => g.trim())
      .filter((g) => g);
    goals.push(...goalItems);
  }

  // Add default goals based on year level
  if (userData.yearLevel === "First year") {
    goals.push("Build foundational understanding");
    goals.push("Develop effective study habits");
  } else if (userData.yearLevel === "Second year") {
    goals.push("Deepen subject expertise");
    goals.push("Apply concepts to real problems");
  } else if (userData.yearLevel === "Third year") {
    goals.push("Master advanced topics");
    goals.push("Prepare for specialization");
  }

  return goals.slice(0, 5); // Return top 5 goals
}

// POST /api/plan/generate
router.post("/generate", async (req, res) => {
  try {
    const { userData, syllabi } = req.body;

    // Normalize input to handle single or multiple syllabi
    const syllabusList = Array.isArray(syllabi) ? syllabi : [];
    const hasSyllabi = syllabusList.length > 0;

    // 1. Logic-based processing
    const scores = scoreAnswers(userData);
    const rawPlan = buildPlan(scores, parseInt(userData.hoursPerWeek) || 10);

    // 1.5 Prepare Persona for AI context
    const archetype = mapStudyStyleToArchetype(userData.studyStyle);
    const persona = {
      name: archetype,
      description: `A ${userData.yearLevel} student majoring in ${userData.major}. Prefers ${userData.chronotype} sessions in a ${userData.environment}.`,
      strengths: getPersonaStrengths(userData.studyStyle),
      watchFor: getPersonaWatchouts(userData.studyStyle),
    };

    // 2. AI-based enhancement (Pairing with geminiService)
    // Extract specific course data for each syllabus
    const syllabusPromises = syllabusList.map((s) =>
      generateSyllabus(rawPlan, s.title, s.text, persona),
    );

    // Generate ONE unified daily plan using context from all syllabi
    const combinedSyllabusContext = hasSyllabi
      ? syllabusList
          .map(
            (s) => `COURSE: ${s.title}\nCONTENT: ${s.text.substring(0, 1000)}`,
          )
          .join("\n\n---\n\n")
      : "";

    const [aiSyllabusResponses, aiDailyPlanText] = await Promise.all([
      Promise.all(syllabusPromises),
      generateDailyPlan(
        rawPlan,
        hasSyllabi ? syllabusList.map(s => s.title).join(", ") : "General Studies",
        combinedSyllabusContext,
        persona,
      ),
    ]);

    // 3. Parse JSON from AI (with sanitization for code fences)
    const cleanJson = (text) => {
      try {
        return JSON.parse(text.replace(/```json|```/g, "").trim());
      } catch (e) {
        console.error("Failed to parse AI JSON:", e);
        return null;
      }
    };

    const syllabusResults = aiSyllabusResponses.map(
      (resp) => cleanJson(resp) || {},
    );
    const studyData = cleanJson(aiDailyPlanText) || {};

    // 4. Consolidate recommendations
    const allRecommendations = [
      ...(studyData.recommendations?.map((r) => r.text) || []),
      ...(studyData.strategyTips || []),
    ].slice(0, 5);

    // 5. Extract course goals
    const courseGoals = extractCourseGoals(userData);

    // 6. Map syllabus extractions to Course objects
    const courses = hasSyllabi
      ? syllabusResults.map((sData, idx) => ({
          id: `gen-${idx}`,
          code:
            sData.courseCode ||
            (userData.major
              ? userData.major.substring(0, 3).toUpperCase() + (101 + idx)
              : "STUDY"),
          instructor: sData.instructor || "Personalized AI",
          title: sData.courseName || syllabusList[idx].title || "Study Plan",
          examDates: sData.keyDates || [
            { label: "Target Completion", date: "End of Term" },
          ],
          topics: (sData.topics || []).map((t) => ({
            title: t.name,
            status: t.status === "complete" ? "mastered" : "in-progress",
            weight: t.progressPercent || 0,
          })),
          studyPlan: (studyData.weeklySchedule || [])
            .filter((entry) => {
              const taskCourse = (entry.course || entry.courseCode || "").toLowerCase().trim();
              const taskText = entry.task?.toLowerCase() || "";
              const targetName = (sData.courseName || syllabusList[idx].title || "").toLowerCase().trim();
              const targetCode = (sData.courseCode || "").toLowerCase().trim();
              
              if (!targetName && !targetCode) return false;

              // Match if the AI tagged the course field or if the name/code appears in the task text
              const matchesCourseField = (targetName && taskCourse.includes(targetName)) || 
                                        (targetCode && taskCourse.includes(targetCode)) ||
                                        (taskCourse.length > 2 && targetName.includes(taskCourse));

              const matchesTaskText = (targetCode && targetCode.length > 2 && taskText.includes(targetCode)) || 
                                     (targetName && targetName.length > 4 && taskText.includes(targetName));

              return matchesCourseField || matchesTaskText;
            })
            .map((s) => ({
              day: s.day.substring(0, 3),
              focus: s.task,
              durationMin: s.durationMin,
            }))
            .sort((a, b) => (DAY_ORDER[a.day] || 99) - (DAY_ORDER[b.day] || 99)),
          weeklyBreakdown: sData.syllabusWeeks || [],
          goals: courseGoals,
        }))
      : [
          {
            id: "gen-0",
            code: "STUDY",
            instructor: "Personalized AI",
            title: "General Study Plan",
            examDates: [{ label: "Target Completion", date: "End of Term" }],
            topics: [],
            studyPlan: [],
            weeklyBreakdown: [],
            goals: courseGoals,
          },
        ];

    // 7. Construct response matching Dashboard.jsx expectations
    const response = {
      persona: {
        archetype: studyData.persona?.name || archetype,
        summary:
          studyData.persona?.tagline ||
          `Tailored plan for your ${userData.studyStyle} study style.`,
        strengths: studyData.persona?.strengths || persona.strengths,
        watchouts: studyData.persona?.watchFor || persona.watchFor,
      },
      courses: courses,
      recommendations: allRecommendations,
      // User context
      userDetails: {
        name: userData.name,
        major: userData.major,
        yearLevel: userData.yearLevel,
        studyStyle: userData.studyStyle,
        hoursPerWeek: userData.hoursPerWeek,
        challenges: userData.challenges,
        chronotype: userData.chronotype,
        environment: userData.environment,
        knowledgeLevel: userData.knowledgeLevel
      },
      aiContext: {
        syllabus: aiSyllabusResponses,
        dailyPlan: aiDailyPlanText,
      },
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to map study style to archetype
function mapStudyStyleToArchetype(studyStyle) {
  const mapping = {
    "Reading & writing": "The Scholar",
    "Visual learning": "The Visual Thinker",
    "Hands-on practice": "The Practitioner",
    "Group study": "The Collaborator",
    "Structured planning": "The Architect",
    "Flexible approach": "The Adaptive Learner",
  };
  return mapping[studyStyle] || "The Adaptive Learner";
}

// Helper function to get persona strengths
function getPersonaStrengths(studyStyle) {
  const mapping = {
    "Reading & writing": ["Attention to detail", "Comprehensive understanding"],
    "Visual learning": ["Pattern recognition", "Quick comprehension"],
    "Hands-on practice": ["Problem-solving", "Practical application"],
    "Group study": ["Communication", "Collaborative thinking"],
    "Structured planning": ["Organization", "Time management"],
    "Flexible approach": ["Adaptability", "Resilience"],
  };
  return mapping[studyStyle] || ["Focused execution", "Clear goals"];
}

// Helper function to get persona watchouts
function getPersonaWatchouts(studyStyle) {
  const mapping = {
    "Reading & writing": ["Over-analysis", "Passive learning"],
    "Visual learning": ["Missing details", "Incomplete notes"],
    "Hands-on practice": ["Skipping theory", "Impatience"],
    "Group study": ["Distraction", "Dependency"],
    "Structured planning": ["Inflexibility", "Perfectionism"],
    "Flexible approach": ["Lack of structure", "Inconsistency"],
  };
  return mapping[studyStyle] || ["Over-commitment", "Burnout"];
}

module.exports = router;
