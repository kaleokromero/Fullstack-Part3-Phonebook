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
if (process.argv.length === 3) {

  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {

  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: `${name}`,
    number: `${number}`
  })

  // eslint-disable-next-line no-unused-vars
  person.save().then(result => {
    console.log(`Added ${name} with number ${number} to phonebook`)
    mongoose.connection.close()
  })
}