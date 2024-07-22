require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
app.use(cors())
morgan.token('body', (request, response) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('dist'))

if(process.argv.length<3) {
  console.log('give password a argument')
  process.exit(1)
}
const password = process.argv[2]
const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)

mongoose.connect(url)
.then(() => {
  console.log('Connected to MongoDB!');
})
.catch(error => {
  console.error('Error connecting to MongoDB:', error);
});


const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('phonebook', phonebookSchema)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})
app.get('/api/info', (request, response) => {
  const total = persons.length
  const date = new Date()
  response.send('phonebook has info for ' + (total) + ' persons ' + '<br></br>' + (date))
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
        response.json(persons)
    })
  })

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
      response.status(204).end()
  })
  .catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, {new: true})
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
    const person = new Person({
      name: body.name,
      number: body.number
    })  
    person.save().then(savedPerson => {
      response.json(savedPerson)
})
})
const PORT = process.env.PORT || 5173
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
