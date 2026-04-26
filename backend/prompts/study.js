module.exports = (plan, title, syllabusText, persona) => `
Role: Expert Academic Coach and Learning Psychologist.
Task: Analyze the student's survey responses and generate personalized study guidance. Return a SINGLE valid JSON object — no markdown, no prose, no backticks.

**Student Context:**
- Courses to Balance: ${title || "General Studies"}
- Learning Persona: ${persona?.name || "Unknown"} — ${persona?.description || ""}
- Strengths: ${persona?.strengths?.join(", ") || "Not specified"}
- Study Environment: ${plan.environment || "Not specified"}
- Peak Energy Time: ${plan.chronotype || "Not specified"}
- Watch For: ${persona?.watchFor?.join(", ") || "Not specified"}
- Weekly Hours Available: ${plan.reduce((sum, p) => sum + p.hours, 0) || 10} hours
- Focus Areas: ${plan.map((p) => p.focus).join(", ")}
- Combined Syllabus Data: ${syllabusText ? syllabusText.substring(0, 2000) : "N/A"}

OUTPUT FORMAT — return exactly this JSON structure:

{
  "persona": {
    "name": "Persona archetype name (e.g. The Quiet Architect, The Sprint Strategist)",
    "tagline": "Short 1-sentence description of how this student learns best",
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "watchFor": ["pitfall 1", "pitfall 2"]
  },
  "recommendations": [
    {
      "index": 1,
      "text": "Specific, actionable recommendation referencing their actual courses or habits"
    }
  ],
  "weeklySchedule": [
    {
      "day": "Monday",
      "course": "Exact Course Code or Name",
      "task": "Specific task name",
      "durationMin": 60,
      "notes": "Optional tip for this session"
    }
  ],
  "strategyTips": [
    "Action-verb tip tailored to persona strengths (e.g. Use spaced repetition for theorem review)"
  ]
}

RULES:
- persona.name: Invent a memorable archetype (2-3 words, title case). Must feel unique and personal, not generic.
- recommendations: Generate exactly 4. Each must be SPECIFIC — reference actual course names, topics, or student habits. Avoid generic advice like "study more."
- weeklySchedule: Assign every task to a course from the "Courses to Balance" list using the "course" field. Distribute the total ${plan.reduce((sum, p) => sum + p.hours, 0) || 10} hours fairly across all courses.
- strategyTips: Exactly 4 tips. Start each with an action verb. Tailor to the persona's watch-for pitfalls.
- Return ONLY the JSON. No explanation, no markdown fences.
`;
