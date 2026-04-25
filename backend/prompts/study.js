module.exports = (plan) => `
You are an encouraging daily planner. Create a personalized weekly study schedule:

**Student profile:** ${plan.courses?.[0]?.studyPlan?.[0]?.focus || "Adaptive learner"}
**Weekly hours available:** ${plan.courses?.[0]?.studyPlan?.reduce((sum, p) => sum + p.durationMin, 0) / 60 || 8} hours
**Key topics:** ${plan.courses?.[0]?.topics?.map((t) => t.title).join(", ") || "Main subjects"}

Generate a weekly plan in markdown:
- Mon-Sun breakdown (show only study days)
- Each day: one focused task + estimated time + motivational tip
- Include short breaks and review sessions
- Highlight 1 key concept per day to master

Keep it concise, friendly, and realistic.
`;
