require("dotenv").config({path: ".env"});
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY || 'AIzaSyAWVQGl8tpgEbgdELuZtOZ62WvKUGB7UCI',
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
		console.error("Error generating content:", error);		
    throw error;	
  }
}

module.exports = {generateSyllabus};

