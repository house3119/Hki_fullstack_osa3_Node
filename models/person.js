const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to database...')
mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    id: String,
    name: {
      type: String,
      minlength: 3
    },
    number: {
      type: String,
      minlength: 8,
      validate: {
        validator: function(v) {
          return /^\d{2,3}-\d+/.test(v);
        },
        message: props => `${props.value} is not a valid phone number! LOL!`
      },
      required: [true, 'Phone number field is blank. Plz add phone number.']
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      delete returnedObject._id
      delete returnedObject.__v
    }
})
const Person = mongoose.model('Person', personSchema)

module.exports = mongoose.model('Person', personSchema)