
const mongoose = require('mongoose');
const args = process.argv;

if (args.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> [<name> <number>]');
  process.exit(1);
}

const password = args[2];
const name = args[3];
const number = args[4];

const url = process.env.DB_STRING

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (name && number) {
  const person = new Person({
    name,
    number,
  });

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
}