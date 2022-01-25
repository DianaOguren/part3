const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Provide the password as an argument: node mongo.js <password>');
    process.exit(1);
  }

const password = process.argv[2];

const url = `mongodb+srv://diana:${password}@cluster0.6ccjl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 4) {
    console.log('phonebook:');
    Person.find({}).then(result => {
      result.forEach(person => {
          console.log(`${person.name}: ${person.number}`);
      });
      mongoose.connection.close();
    });
  }

  if (process.argv.length > 3) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      });
      
      person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close();
      })
  }
