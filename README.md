# ACE: AI-Powered Personal Study Planner

**Ace** is a full-stack application designed to help students transform overwhelming course syllabi into actionable, personalized study plans. By leveraging Google Gemini AI, the platform analyzes user learning styles and course documents to create a custom-tailored academic roadmap.

## 🚀 Features

### 1. Intelligent Onboarding

- **Persona Profiling:** Identifies your learning archetype (e.g., The Scholar, The Visual Thinker, The Practitioner) based on a quick survey.
- **Goal Setting:** Tailors recommendations based on your year level, major, and specific academic challenges.

### 2. Automated Syllabus Extraction

- **Document Parsing:** Upload PDF or TXT syllabi.
- **AI Analysis:** Automatically extracts weekly breakdowns, learning objectives, resources, and practice problems using the Gemini 1.5 Flash model.

### 3. Personalized Study Schedules

- **Daily Tasks:** Generates a realistic Mon-Sun schedule based on your available hours per week.
- **AI Recommendations:** Provides motivational tips and high-level strategy tailored to your specific course content.

### 4. Interactive Dashboard

- **Progress Tracking:** Monitor topic mastery and weekly checkpoints.
- **Resource Management:** Quick access to AI-suggested books, videos, and articles.

## 🛠️ Tech Stack

**Frontend:**

- React + Vite
- Mantine UI for responsive design
- Tabler Icons
- Axios for API communication

**Backend:**

- Node.js & Express
- Google Generative AI SDK (Gemini 1.5 Flash)
- Multer & pdf-parse for file handling

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/lionhacks-theunderdogs.git
   ```

2. **Backend Setup:**
   - Navigate to `/backend`
   - Create a `.env` file and add: `GEMINI_API_KEY=your_key_here`
   - Run `npm install` and `npm start`

3. **Frontend Setup:**
   - Navigate to `/frontend`
   - Run `npm install` and `npm run dev`

4. **Access the app:**
   - Open your browser to `http://localhost:5173`

## 📝 License

Distributed under the ISC License.
