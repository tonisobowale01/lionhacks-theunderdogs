function scoreAnswers(answers) {
  const scores = {}

  for (let topic in answers) {
    scores[topic] = answers[topic] / 5
  }

  return scores
}

module.exports = { scoreAnswers }