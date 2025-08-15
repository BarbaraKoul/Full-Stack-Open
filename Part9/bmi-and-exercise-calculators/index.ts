import express from 'express'
import { calculateBmi } from './bmiCalculator'

const app = express()

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack')
})

app.get('/bmi', (req, res) => {
  try {
    const weight = Number(req.query.weight)
    const height = Number(req.query.height)

    if (isNaN(weight) || isNaN(height)) {
      throw new Error('malformatted parameters')
    }

    if (weight <= 0 || height <= 0) {
      throw new Error('height and weight must be positive numbers')
    }

    const bmi = calculateBmi(height, weight)
    res.json({
      weight,
      height,
      bmi
    });
  } catch (error) {
    let errorMessage = 'Something went wrong.'
    if (error instanceof Error) {
      errorMessage += error.message
    }
    res.status(400).json({ error: errorMessage })
  }
})

const PORT = 3003

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})