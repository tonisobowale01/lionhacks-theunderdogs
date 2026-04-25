const express = require("express");
const router = express.Router();
const { scoreAnswers } = require("../services/scoringService");
const { buildPlan } = require("../services/planBuilder");
const {
  generateSyllabus,
  generateDailyPlan,
} = require("../services/geminiService");

// Helper function to extract key recommendations from markdown
function extractRecommendations(text, limit = 5) {
  const lines = text.split("\n").filter((line) => line.trim());
  const recommendations = [];

  for (const line of lines) {
    // Extract bullet points or key statements
    if (line.startsWith("-") || line.startsWith("•") || line.startsWith("*")) {
      const cleaned = line.replace(/^[-•*]\s*/, "").trim();
      if (cleaned && !cleaned.includes("##") && !cleaned.includes("**")) {
        recommendations.push(cleaned);
      }
    }
    // Extract lines that look like motivational/actionable advice
    else if (
      (line.includes("Focus") ||
        line.includes("Start") ||
        line.includes("Use") ||
        line.includes("Remember")) &&
      !line.includes("#")
    ) {
      recommendations.push(line.trim());
    }

    if (recommendations.length >= limit) break;
  }

  return recommendations.length > 0
    ? recommendations
    : [
        "Follow your personalized study schedule",
        "Review daily and adjust as needed",
      ];
}

// Helper function to build daily study plan from schedule text
function buildDailyPlanFromSchedule(scheduleText) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dayShorts = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const studyPlan = [];

  for (let i = 0; i < dayShorts.length; i++) {
    const dayPattern = new RegExp(`${days[i]}.*?([\\d]+)\\s*(?:min|hour)`, "i");
    const match = scheduleText.match(dayPattern);
    const duration = match ? parseInt(match[1]) : 60;

    studyPlan.push({
      day: dayShorts[i],
      focus: `Study session`,
      durationMin: duration,
    });
  }

  return studyPlan;
}

// Helper function to extract detailed course structure from syllabus
function extractSyllabusDetails(syllabusText) {
  const details = {
    weeklyBreakdown: [],
    learningObjectives: [],
    resources: [],
    practiceProblems: [],
    checkpoints: [],
  };

  // Fallback if AI failed or returned non-markdown error message
  if (syllabusText.includes("failed") || syllabusText.length < 50) {
    details.learningObjectives = ["Review core course concepts"];
    details.resources = ["Course textbook", "Lecture notes"];
    details.checkpoints = ["Weekly self-assessment"];
    return details;
  }

  const lines = syllabusText.split("\n");

  let currentSection = null;
  let currentWeek = null;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect week headers
    if (trimmed.match(/^#+\s*Week\s*\d+/i)) {
      const weekMatch = trimmed.match(/Week\s*(\d+)/i);
      if (weekMatch) {
        currentWeek = {
          week: parseInt(weekMatch[1]),
          objectives: [],
          resources: [],
          problems: [],
          checkpoint: null,
        };
        details.weeklyBreakdown.push(currentWeek);
      }
    }

    // Detect section headers
    if (
      trimmed.match(
        /^#+\s*(Learning Objectives|Resources|Practice|Checkpoint|Quiz)/i,
      )
    ) {
      const match = trimmed.match(
        /(Learning Objectives|Resources|Practice|Checkpoint|Quiz)/i,
      );
      if (match) {
        currentSection = match[1].toLowerCase().replace(/\s+/g, "_");
      }
    }

    // Extract bullet points
    if (
      (trimmed.startsWith("-") ||
        trimmed.startsWith("•") ||
        trimmed.startsWith("*")) &&
      trimmed.length > 2
    ) {
      const content = trimmed.replace(/^[-•*]\s*/, "").trim();

      if (
        currentSection === "learning_objectives" ||
        currentSection === "objectives"
      ) {
        if (currentWeek) {
          currentWeek.objectives.push(content);
        }
        details.learningObjectives.push(content);
      } else if (currentSection === "resources") {
        if (currentWeek) {
          currentWeek.resources.push(content);
        }
        details.resources.push(content);
      } else if (
        currentSection === "practice" ||
        currentSection === "practice_problems"
      ) {
        if (currentWeek) {
          currentWeek.problems.push(content);
        }
        details.practiceProblems.push(content);
      }
    }

    // Extract checkpoint/quiz info
    if (trimmed.match(/checkpoint|quiz topic/i) && currentWeek) {
      currentWeek.checkpoint = trimmed.replace(/^[-•*]\s*/, "").trim();
      details.checkpoints.push(currentWeek.checkpoint);
    }
  }

  return details;
}

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
    const { userData, title, syllabusText } = req.body;

    // 1. Logic-based processing
    const scores = scoreAnswers(userData);
    const rawPlan = buildPlan(scores, parseInt(userData.hoursPerWeek) || 10);

    // 2. AI-based enhancement (Pairing with geminiService)
    const [aiSyllabusText, aiDailyPlanText] = await Promise.all([
      generateSyllabus(rawPlan, title, syllabusText),
      generateDailyPlan(rawPlan, title, syllabusText),
    ]);

    // 3. Extract recommendations from AI outputs
    const recommendationsFromSyllabus = extractRecommendations(
      aiSyllabusText,
      3,
    );
    const recommendationsFromDaily = extractRecommendations(aiDailyPlanText, 2);
    const allRecommendations = [
      ...recommendationsFromSyllabus,
      ...recommendationsFromDaily,
    ].slice(0, 5);

    // 4. Build daily plan from the daily schedule AI output
    const studyPlan = buildDailyPlanFromSchedule(aiDailyPlanText);

    // 5. Extract detailed syllabus information
    const syllabusDetails = extractSyllabusDetails(aiSyllabusText);
    const courseGoals = extractCourseGoals(userData);

    // 6. Build persona strengths/watchouts based on study style
    const personaStrengths = getPersonaStrengths(userData.studyStyle);
    const personaWatchouts = getPersonaWatchouts(userData.studyStyle);

    // 7. Construct response matching Dashboard.jsx expectations
    const response = {
      persona: {
        archetype: mapStudyStyleToArchetype(userData.studyStyle),
        summary: `Tailored plan for a ${userData.yearLevel} student majoring in ${userData.major}. Optimized for your ${userData.studyStyle} study style.`,
        strengths: personaStrengths,
        watchouts: personaWatchouts,
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
          studyPlan: studyPlan,
          // New: Detailed syllabus information
          syllabusDetails: syllabusDetails,
          goals: courseGoals,
          learningObjectives: syllabusDetails.learningObjectives.slice(0, 5),
          resources: syllabusDetails.resources.slice(0, 5),
          practiceProblems: syllabusDetails.practiceProblems.slice(0, 5),
          checkpoints: syllabusDetails.checkpoints.slice(0, 4),
          weeklyBreakdown: syllabusDetails.weeklyBreakdown,
        },
      ],
      recommendations: allRecommendations,
      // User context
      userDetails: {
        name: userData.name,
        major: userData.major,
        yearLevel: userData.yearLevel,
        studyStyle: userData.studyStyle,
        hoursPerWeek: userData.hoursPerWeek,
        challenges: userData.challenges,
      },
      aiContext: {
        syllabus: aiSyllabusText,
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
