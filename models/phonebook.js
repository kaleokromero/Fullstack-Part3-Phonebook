const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB!')
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error)
  })

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 3
      },
      message: props => `name " ${props.value} " must be at least 3 characters long`
    }
  },
  number:{
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 7 && /^(\d{2,3}-\d+)$/.test(v)
      },
      message: props => `${props.value} is not a valid format for a phone number`
    }
  }
})
phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
module.exports = mongoose.model('Phonebooks', phonebookSchema)