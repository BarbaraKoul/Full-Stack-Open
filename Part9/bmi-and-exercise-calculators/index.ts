import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack');
});

app.get('/bmi', (req, res) => {
  try {
    const weight = Number(req.query.weight);
    const height = Number(req.query.height);

    if (isNaN(weight) || isNaN(height)) {
      throw new Error('malformatted parameters');
    }

    if (weight <= 0 || height <= 0) {
      throw new Error('height and weight must be positive numbers');
    }

    const bmi = calculateBmi(height, weight);
    res.json({
      weight,
      height,
      bmi
    });
  } catch (error) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage += error.message;
        }
    res.status(400).json({ error: errorMessage });
  }
});


app.post('/exercises', (req, res) => {
    try {
        const { daily_exercises, target } = req.body;
        
        if (!daily_exercises || !target) {
            throw new Error('parameters missing');
        }

        if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
            throw new Error('malformatted parameters');
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = calculateExercises(daily_exercises, Number(target));
        res.json(result);
    } catch(error) {
        let errorMessage = 'Something went wrong.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        res.status(400).json({ error: errorMessage });
    }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});