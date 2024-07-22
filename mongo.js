const { response } = require('express')
const mongoose = require('mongoose')
if(process.argv.length<3) {
    console.log('give password a argument')
    process.exit(1)
}
const password = process.argv[2]
const url =
`mongodb+srv://kaleoromero:${password}@cluster0.a1j0xba.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String,
  })
  
  const Person = mongoose.model('phonebook', phonebookSchema)
  
  const person = new Person({
    name: 'Bud',
    number: '41-070921',
  })
  
  Person.find({}).then(persons => {
    persons.forEach(person => {
        console.log(person)
    })
    mongoose.connection.close()
  })