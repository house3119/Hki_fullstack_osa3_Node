const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)

} else if (process.argv.length > 5) {
  console.log('Too many arguments. Remember to use "" to enclose name with spaces.')
  process.exit(1)

} else if (process.argv.length === 3) {
  // Tulosta phonebook
  const password = process.argv[2]
  const url = `mongodb+srv://house31:${password}@hkifullstackcluster.gyk6pic.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=HkiFullStackCluster`

  mongoose.set('strictQuery', false)
  mongoose.connect(url).catch(err => {
    console.log('Error connecting, check password')
    process.exit(1)
  })

  const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)

  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number? person.number : '- No number added'}`)
    })
    mongoose.connection.close()
  })
  
} else {
  // Tallenna numero
  const password = process.argv[2]
  const url = `mongodb+srv://house31:${password}@hkifullstackcluster.gyk6pic.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=HkiFullStackCluster`

  mongoose.set('strictQuery', false)
  mongoose.connect(url).catch(err => {
    console.log('Error connecting, check password')
    process.exit(1)
  })

  const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)

  const person = new Person({
    id: (Math.random() * 100000).toFixed(),
    name: process.argv[3],
    number: process.argv[4]? process.argv[4]: null
  })
  
  
  person.save().then((result) => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}
