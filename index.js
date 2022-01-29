let Person = require('./models/person');

const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
app.use(express.static('build'));
app.use(express.json());


app.use(morgan('tiny'));

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body '));

morgan.token('param', function(req, res, param) {
    return req.params[param];
});

const cors = require('cors');
app.use(cors());




app.get('/', (request, response) => {
  response.send('<h1>Welcome to my application! My name is Diana Oguren</h1>')
});

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.end(JSON.stringify(persons, null, 4));
    });
});

app.get('/info', (request, response) => {
    let date = new Date();
    Person.count({}, function( err, count){
        response.send(`Phonebook has info for ${count} people <br> ${date}`);
    });
});

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
    .then(person => {
        response.end(JSON.stringify(person, null, 4));
    })
    .catch(error => next(error))
  });


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error))
    
});

app.post('/api/persons', (request, response, next) => {
    const body = request.body;
  

    if (!body.number && !body.name) {
        return response.status(400).json({ 
          error: 'Name and number are missing' 
        });
    }

    if (!body.name) {
      return response.status(400).json({ 
        error: 'Name is missing' 
      });
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'Input number is missing' 
        });
      }


    const person = new Person({
        name: body.name,
        number: body.number,
      });
      
      person
        .save()
        .then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        })
        .catch(error => next(error))

});

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;
  
    const person = {
      name: body.name,
      number: body.number,
    };
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error =>  next(error));
  });

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};
  
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'Error' })
    }  else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  };

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});