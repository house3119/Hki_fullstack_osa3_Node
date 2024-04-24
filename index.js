require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// Middleware setup
const catcher = (req, res, next) => {
    if (req.body) {
        res.locals.holder = JSON.stringify(req.body)
    };
    next();
}
app.use(catcher);

const incomingMorgan = (tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms -',
        'Req body:',res.locals.holder
    ].join(' ')
}
app.use(morgan(incomingMorgan));


// Routes
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons);
    });
})


app.post('/api/persons', (request, response) => {
    if (!request.body.name) {
        return response.status(400).json({error: "Name missing"})

    } else {
        const person = new Person({
            id: (Math.random() * 100000).toFixed(),
            name: request.body.name,
            number: request.body.number? request.body.number : null
        });
          
        person.save().then(() => {
            response.json(person);
        });
    };
});


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
    Person.findOneAndDelete({id : Number(request.params.id)})
        .then((res) => {
            if (!res) {
                response.status(404).json({error : 'Not Found'});
            } else {
                response.status(204).end();
            }
        })
        .catch((err) => {
            console.log(err)
            response.status(404).json({error : 'Error'})
        });
});


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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

