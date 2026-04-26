require("dotenv").config();
// 1. Correct package name
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 2. Correct initialization
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === "YOUR_API_KEY") {
  console.error("CRITICAL: GEMINI_API_KEY is missing or invalid in .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");
const cache = new Map();

async function callGemini(prompt, cacheKey, retryCount = 0) {
  const MAX_RETRIES = 2;
  const RETRY_DELAY = 5000; // 5 seconds

  if (cache.has(cacheKey)) {
    console.log(`Cache hit for: ${cacheKey}`);
    return cache.get(cacheKey);
  }

  const start = Date.now();

  try {
    // 3. Get the model instance first
    // Explicitly use the v1 API version to avoid 404 errors found in v1beta
    const model = genAI.getGenerativeModel(
      { model: "gemini-2.0-flash" },
      { apiVersion: "v1beta" },
    );

    // 4. Correct method call structure
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log(`Gemini response took ${Date.now() - start}ms`);
    cache.set(cacheKey, text);
    return text;
  } catch (error) {
    // Handle Rate Limiting (429)
    const isRateLimit = error.status === 429 || error.message?.includes("429");

    if (isRateLimit && retryCount < MAX_RETRIES) {
      console.warn(
        `Rate limit hit. Retrying in ${RETRY_DELAY / 1000}s... (Attempt ${retryCount + 1}/${MAX_RETRIES})`,
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return callGemini(prompt, cacheKey, retryCount + 1);
    }

    console.error("Gemini API Error:", error);
    throw error; // Let the caller handle the specific failure
  }
}

async function generateSyllabus(plan, title, syllabusText, persona) {
  try {
    const promptGenerator = require("../prompts/syllabus");
    const prompt = promptGenerator(plan, title, syllabusText, persona);
    const cacheKey = `syllabus:${title}:${syllabusText?.length || 0}:${JSON.stringify(plan)}:${persona?.archetype}`;

    return await callGemini(prompt, cacheKey);
  } catch (error) {
    console.error("Error generating syllabus:", error.message);
    return "Syllabus generation failed. Please try again.";
  }
}

async function generateDailyPlan(plan, title, syllabusText, persona) {
  try {
    const promptGenerator = require("../prompts/study");
    const prompt = promptGenerator(plan, title, syllabusText, persona);
    const cacheKey = `daily:${title}:${syllabusText?.length || 0}:${JSON.stringify(plan)}:${persona?.archetype}`;

    return await callGemini(prompt, cacheKey);
  } catch (error) {
    console.error("Error generating daily plan:", error.message);
    return "Daily plan generation failed. Please try again.";
  }
}

module.exports = { generateSyllabus, generateDailyPlan };
