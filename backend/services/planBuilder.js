function buildPlan(scores, hoursPerWeek = 10) {
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1])

  const plan = []

  let week = 1

  for (let [topic, score] of sorted) {
    plan.push({
      week,
      focus: topic,
      hours: hoursPerWeek,
      tasks: [
        `Study ${topic}`,
        `Practice ${topic}`,
        `Review ${topic}`
      ]
    })
    week++
  }

  return plan
}

module.exports = { buildPlan }