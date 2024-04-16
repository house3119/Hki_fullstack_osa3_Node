const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

/* const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(requestLogger) */


let persons = [
    {
        "id": 1,
        "name": "Arto Hellis",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-37645"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-049786"
    },
]


app.get('/api/persons', (request, response) => {
    response.json(persons)
})


app.post('/api/persons', (request, response) => {
    const person = request.body

    if (!person.name || !person.number) {
        return response.status(400).json({error: "Name or number missing."})
    } else if (persons.find(per => per.name.toLowerCase() === person.name.toLowerCase())) {
        return response.status(400).json({error: "Name must be unique."})
    }

    person.id = (Math.random() * 100000).toFixed()
    person.id = parseInt(person.id)
    persons = persons.concat(person)
    response.json(person)
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if(!person) {
        response.status(404).end()
    } else {
        response.json(person)
    }
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})


app.get('/info', (request, response) => {
    response.send(`
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>Datetime ${new Date}</p>
        `
    )
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})