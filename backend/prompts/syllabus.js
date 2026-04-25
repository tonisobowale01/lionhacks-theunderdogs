module.exports = (plan) => `
You are an expert academic tutor. Given this study plan:
${JSON.stringify(plan, null, 2)}

Generate a detailed week-by-week syllabus in markdown. 
For each week include: learning objectives, recommended resources,
practice problems, and a checkpoint quiz topic.
Keep it practical and time-boxed.
`;
