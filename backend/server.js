const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/survey', require('./routes/survey'))
app.use('/api/studyplan', require('./routes/studyplan'))

app.listen(process.env.PORT || 3001, () =>
  console.log('Server running on port', process.env.PORT || 3001)
)