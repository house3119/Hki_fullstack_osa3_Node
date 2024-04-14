const express = require('express')
const app = express()

const persons = [
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


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})