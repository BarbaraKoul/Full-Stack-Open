require('./utils/config');
const express = require('express');
const morgan = require('morgan');
const Person = require('./models/phonebook');
const app = express();

app.use(express.json());
app.use(express.static('build'));

morgan.token('post-data', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : '-';
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons);
    })
    .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.post('/api/persons', async (req, res, next) => {
  const body = req.body;

  const existingPerson = await Person.findOne({ name: body.name });
  if (existingPerson) {
    return res.status(400).json({ 
      error: 'name must be unique' 
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      res.json(savedPerson);
    })
    .catch(error => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `);
    })
    .catch(error => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.code === 11000) { // Duplicate key error
    return res.status(400).json({ error: 'name must be unique' });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});