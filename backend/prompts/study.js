module.exports = (plan, title, syllabusText) => `
You are an encouraging daily planner. Create a personalized weekly study schedule:

**Course:** ${title || "General Studies"}
**Syllabus Reference:** ${syllabusText ? syllabusText.substring(0, 2000) : "N/A"}
**Total Weekly hours:** ${plan.reduce((sum, p) => sum + p.hours, 0) || 10} hours
**Key topics:** ${plan.map((p) => p.focus).join(", ")}

Generate a weekly plan in markdown:
- Mon-Sun breakdown (show only study days)
- Each day: one focused task + estimated time + motivational tip
- Include short breaks and review sessions
- Highlight 1 key concept per day to master

Keep it concise, friendly, and realistic.
`;
