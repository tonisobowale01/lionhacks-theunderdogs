require("dotenv").config();
// 1. Correct package name
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 2. Correct initialization
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const cache = new Map();

async function callGemini(prompt, cacheKey) {
	if (cache.has(cacheKey)) {
		console.log(`Cache hit for: ${cacheKey}`);
		return cache.get(cacheKey);
	}

	const start = Date.now();

	try {
		// 3. Get the model instance first
		const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

		// 4. Correct method call structure
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		console.log(`Gemini response took ${Date.now() - start}ms`);
		cache.set(cacheKey, text);
		return text;
	} catch (error) {
		console.error("Gemini API Error:", error);
		throw error; // Let the caller handle the specific failure
	}
}

async function generateSyllabus(plan) {
	try {
		const promptGenerator = require("../prompts/syllabus");
		const prompt = promptGenerator(plan);
		const cacheKey = `syllabus:${JSON.stringify(plan)}`;

		return await callGemini(prompt, cacheKey);
	} catch (error) {
		console.error("Error generating syllabus:", error.message);
		return "Syllabus generation failed. Please try again.";
	}
}

async function generateDailyPlan(plan) {
	try {
		const promptGenerator = require("../prompts/study");
		const prompt = promptGenerator(plan);
		const cacheKey = `daily:${JSON.stringify(plan)}`;

		return await callGemini(prompt, cacheKey);
	} catch (error) {
		console.error("Error generating daily plan:", error.message);
		return "Daily plan generation failed. Please try again.";
	}
}

module.exports = { generateSyllabus, generateDailyPlan };
