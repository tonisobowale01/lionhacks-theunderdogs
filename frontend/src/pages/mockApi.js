export const processSyllabus = async (file) => {
  await new Promise((r) => setTimeout(r, 1000));
  return { extractedTitle: file.name.replace(/\.[^/.]+$/, "") };
};

export const generateStudyPlan = async (
  userData,
  title = "General Studies",
) => {
  await new Promise((r) => setTimeout(r, 1500));
  return {
    persona: {
      archetype: "The Architectural Learner",
      summary: "You build mental frameworks before filling in details.",
      strengths: ["Structural thinking", "Mind-mapping"],
      watchouts: ["Getting stuck in theory", "Perfectionism"],
    },
    courses: [
      {
        id: "1",
        code: "CS101",
        instructor: "Dr. Aris",
        title: title || "Intro to Logic",
        examDates: [{ label: "Midterm", date: "Oct 24" }],
        topics: [
          { title: "First Principles", status: "mastered", weight: 100 },
          { title: "Boolean Algebra", status: "in-progress", weight: 45 },
        ],
        studyPlan: [
          { day: "Mon", focus: "Recall & Map", durationMin: 45 },
          { day: "Wed", focus: "Problem Sets", durationMin: 60 },
        ],
      },
    ],
    recommendations: [
      "Start every session with a 5-minute mind map of yesterday's topics.",
      "Use the 'Feynman Technique' for Boolean logic modules.",
    ],
  };
};
