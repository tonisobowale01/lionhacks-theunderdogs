import axios from "axios";
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
export const submitSurvey = (answers) =>
  axios.post(`${BASE}/api/survey`, answers);
export const getPlan = (id) => axios.get(`${BASE}/api/studyplan/${id}`);

export const processSyllabus = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${BASE}/api/syllabus/process`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const generateStudyPlan = (userData, syllabi) =>
  axios.post(`${BASE}/api/plan/generate`, { userData, syllabi });
