function scoreAnswers(answers) {
  const scores = {};
  const metadataKeys = [
    "name",
    "major",
    "yearLevel",
    "studyStyle",
    "hoursPerWeek",
    "goals",
    "challenges",
    "chronotype",
    "environment",
    "knowledgeLevel"
  ];

  for (let topic in answers) {
    if (!metadataKeys.includes(topic)) {
      scores[topic] =
        typeof answers[topic] === "number" ? answers[topic] / 5 : 0.5;
    }
  }

  return scores;
}

module.exports = { scoreAnswers };
