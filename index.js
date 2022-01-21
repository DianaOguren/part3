const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());

app.use(morgan('tiny'));

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body '));

morgan.token('param', function(req, res, param) {
    return req.params[param];
});

const cors = require('cors');
app.use(cors());


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];


app.get('/', (request, response) => {
  response.send('<h1>Welcome to my application! My name is Diana Oguren</h1>')
});

app.get('/api/persons', (request, response) => {
  response.end(JSON.stringify(persons, null, 4))
});

app.get('/info', (request, response) => {
    let date = new Date();
    response.send(`Phonebook has info for ${persons.length} people <br> ${date}`)
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        response.end(JSON.stringify(person, null, 4));
      } else {
        response.status(404).end();
      }
});

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(person => person.id !== id);
  
    response.status(204).end();
});


const generateId = () => {
    const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)): 0;
    return maxId + 1;
};



app.post('/api/persons', (request, response) => {
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


    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'Input name must be unique' 
          });
    }
  
    const newperson = {
      id: generateId(),
      name: body.name,
      number: body.number,
    };
  
    persons = persons.concat(newperson);
  
    response.json(newperson);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});