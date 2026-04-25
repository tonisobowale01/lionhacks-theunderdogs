const router = require('express').Router()
const { scoreAnswers } = require('../services/scoringService')
const { buildPlan } = require('../services/planBuilder')
const { generateSyllabus } = require('../services/geminiService')

router.post('/', async (req, res) => {
  try {
    const scores = scoreAnswers(req.body)
    const plan = buildPlan(scores)

    let syllabus = "AI unavailable (rate limit)"

    try {
      syllabus = await generateSyllabus(plan)
    } catch (e) {
      console.log("AI error:", e.message)
    }

    res.json({ scores, plan, syllabus })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router