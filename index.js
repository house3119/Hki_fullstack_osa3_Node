const express = require('express')
const app = express()


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


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})