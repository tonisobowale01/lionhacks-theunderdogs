require("dotenv").config({path: ".env"});
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

async function generateSyllabus(plan) {
	try {
    const prompt = require("../prompts/syllabus")(plan);

		const response = await ai.models.generateContent({
			model: "gemini-2.0-flash",
			contents: prompt,
		});

		console.log(response.text);
		return response.text;
	} catch (error) {
		console.error("Error generating content:", error.message || error);
		return "Syllabus generation failed. Please try again."; 
  }
}

async function generateDailyPlan(plan) {
  try {
    const prompt = require("../prompts/study")(plan);

    const response = await ai.models.generateContent({
			model: "gemini-2.0-flash",
			contents: prompt,
		});

    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error("Error generating daily plan:", error.message || error);
		return "Daily plan generation failed. Please try again.";
  }
}
module.exports = {generateSyllabus, generateDailyPlan};

generateSyllabus([{ week: 1, focus: "algebra", hours: 5 }]);
generateDailyPlan([{ week: 1, focus: "algebra", hours: 5 }]);