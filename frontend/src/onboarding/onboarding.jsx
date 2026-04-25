const QUESTIONS = [
  {
    key: "name",
    label: "What should we call you?",
    helper: "First name is fine.",
    type: "input",
    placeholder: "e.g. Maya",
  },
  {
    key: "major",
    label: "What are you studying?",
    helper: "Your field, major, or program.",
    type: "input",
    placeholder: "e.g. Cognitive Science",
  },
  {
    key: "yearLevel",
    label: "Where are you in your studies?",
    helper: "Pick the closest match.",
    type: "choice",
    options: [
      "First year",
      "Second year",
      "Third year",
      "Fourth year +",
      "Graduate",
    ],
  },
  {
    key: "studyStyle",
    label: "How do you learn best?",
    helper: "Be honest, not aspirational.",
    type: "choice",
    options: [
      "Visual — diagrams & mind-maps",
      "Reading & writing",
      "Group discussion",
      "Hands-on practice",
    ],
  },
  {
    key: "hoursPerWeek",
    label: "Realistic hours per week?",
    helper: "Outside of class, what can you sustain?",
    type: "choice",
    options: ["Less than 5", "5–10", "10–15", "15–20", "More than 20"],
  },
  {
    key: "goals",
    label: "What does success look like this term?",
    helper: "A grade, an understanding, a habit?",
    type: "textarea",
    placeholder: "I want to actually understand the material, not just pass.",
  },
  {
    key: "challenges",
    label: "What gets in the way?",
    helper: "Procrastination, anxiety, distraction — name it.",
    type: "textarea",
    placeholder: "I lose hours to my phone after dinner.",
  },
];

export { QUESTIONS };
