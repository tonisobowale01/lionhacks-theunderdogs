module.exports = (plan, title, syllabusText, persona) => `
Role: Academic Curriculum Designer and Learning Strategist.
Task: Parse the provided syllabus and student survey data, then return a SINGLE valid JSON object — no markdown, no prose, no backticks.

**Student Context:**
- Course: ${title || "Study Plan"}
- Learning Persona: ${persona?.name || "Unknown"} — ${persona?.description || ""}
- Strengths: ${persona?.strengths?.join(", ") || "Not specified"}
- Knowledge Level: ${plan.knowledgeLevel || "General"}
- Watch For: ${persona?.watchFor?.join(", ") || "Not specified"}
- Focus Areas (from survey): ${plan.map((p) => p.focus).join(", ")}
- Weekly Hours Available: ${plan.reduce((sum, p) => sum + p.hours, 0) || 8} hours

**Uploaded Syllabus:**
${syllabusText ? syllabusText.substring(0, 3000) : "No syllabus provided — infer reasonable values from course title and focus areas."}

OUTPUT FORMAT — return exactly this JSON structure:

{
  "courseName": "Full course title from syllabus",
  "courseCode": "e.g. PHIL 204",
  "instructor": "Professor name from syllabus or null",
  "nextDeadline": {
    "label": "Assignment or exam name",
    "date": "MMM DD, YYYY format e.g. Nov 14, 2024"
  },
  "keyDates": [
    { "label": "Event name", "date": "MMM DD, YYYY" }
  ],
  "topics": [
    {
      "name": "Topic name",
      "progressPercent": 65,
      "status": "in_progress | not_started | complete"
    }
  ],
  "weeklyPlan": [
    {
      "day": "Mon",
      "task": "Specific study task (not generic)",
      "durationMin": 60
    }
  ],
  "syllabusWeeks": [
    {
      "weekNumber": 1,
      "title": "Topic name",
      "objectives": ["..."],
      "resources": ["..."],
      "practice": ["..."],
      "checkpoint": "Quiz or milestone description"
    }
  ]
}

RULES:
- progressPercent: Estimate based on topic ordering and how early it appears in the syllabus (first topics = higher progress). Use 0 for not started.
- weeklyPlan: Produce 4-5 day entries. Tasks must be SPECIFIC to the course content (e.g. "Annotate Kant excerpts", not "Study chapter").
- keyDates: Include 2-4 dates. If syllabus lacks dates, infer plausible ones given a standard semester.
- Use standard Month abbreviations (Jan, Feb, Mar, etc.).
- syllabusWeeks: Generate 4-6 weeks.
- Return ONLY the JSON. No explanation, no markdown fences.
`;
