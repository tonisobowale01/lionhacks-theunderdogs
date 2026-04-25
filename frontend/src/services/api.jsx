import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
export const submitSurvey = (answers) =>
	axios.post(`${BASE}/api/survey`, answers);
export const getPlan = (id) => axios.get(`${BASE}/api/studyplan/${id}`);
