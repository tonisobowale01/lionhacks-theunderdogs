module.exports = (plan, title, syllabusText) => `
You are an expert academic syllabus designer. Create a structured week-by-week syllabus based on:

**Course:** ${title || "Study Plan"}
**Uploaded Syllabus Content:** ${syllabusText || "No syllabus provided."}
**Focus areas from survey:** ${plan.map((p) => p.focus).join(", ")}
**Time available:** 6-8 hours per week
**Study style:** Structured learning with weekly checkpoints

Generate the syllabus in markdown with:
- Week-by-week breakdown (4-6 weeks)
- Learning objectives per week
- Recommended resources (books, articles, videos)
- 2-3 practice problems per week
- A checkpoint/quiz topic

Keep it practical and achievable.
`;
