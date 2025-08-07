require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.DB_STRING;

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });