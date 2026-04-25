module.exports = (plan) => `
You are an expert academic syllabus designer. Create a structured week-by-week syllabus based on:

**Course:** ${plan.courses?.[0]?.title || "Study Plan"}
**Topics to cover:** ${plan.courses?.[0]?.topics?.map((t) => t.title).join(", ") || "General topics"}
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
