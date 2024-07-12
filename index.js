const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
app.use(cors())
morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('dist'))

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/info', (request, response) => {
  const total = persons.length
  const date = new Date()
  response.send('phonebook has info for ' + (total) + ' persons ' + '<br></br>' + (date))
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if(person) {
  response.json(person)
  } else {
    response.status(404).send('<h1>Person not found</h1>').end()
  }
})
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(persons => persons.id !== id)

  response.status(204).end()
})
  const generateId = () => {
  const totalId = persons.length;
  const generatedId = (Math.floor(Math.random() * (100 - totalId) + totalId)).toString();
  console.log(typeof generatedId)
  return generatedId;
};

app.post('/api/persons', (request, response) => {
  const body = request.body
  if(!body.name || !body.number) {
    return response.status(400).json({
      error :'missing info'
    })
  }
  if(persons.find(person => person.name == body.name)) {
    return response.status(400).json({
      error :'name must be unique'
    })
  }
    const person = {
      id: generateId(),
      name: request.body.name,
      number: request.body.number
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 5173
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
