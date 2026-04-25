require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY || 'AIzaSyAKKgGrGHOolt_nNpXAN5BQK9ksp8U3Rbw',
});
const cache = new Map();

async function callGemini(prompt, cacheKey) {
	if (cache.has(cacheKey)) {
		console.log(`Cache hit for: ${cacheKey}`);
		return cache.get(cacheKey);
	}

	const start = Date.now();
	const response = await ai.models.generateContent({
		model: "gemini-2.0-flash",
		contents: prompt,
	});
	console.log(`Gemini response took ${Date.now() - start}ms`);
	cache.set(cacheKey, response.text);
  console.log(response.text);
	return response.text;
}

async function generateSyllabus(plan) {
	try {
		const prompt = require("../prompts/syllabus")(plan);
		const cacheKey = `syllabus:${JSON.stringify(plan)}`;

    console.log(callGemini(prompt, cacheKey));
		return await callGemini(prompt, cacheKey);
	} catch (error) {
		console.error("Error generating syllabus:", error.message || error);
		return "Syllabus generation failed. Please try again.";
	}
}

async function generateDailyPlan(plan) {
	try {
		const prompt = require("../prompts/study")(plan);
		const cacheKey = `daily:${JSON.stringify(plan)}`;
		return await callGemini(prompt, cacheKey);
	} catch (error) {
		console.error("Error generating daily plan:", error.message || error);
		return "Daily plan generation failed. Please try again.";
	}
}

module.exports = { generateSyllabus, generateDailyPlan };

generateSyllabus([{ week: 1, focus: "algebra", hours: 5 }]);
generateDailyPlan([{ week: 1, focus: "algebra", hours: 5 }]);
