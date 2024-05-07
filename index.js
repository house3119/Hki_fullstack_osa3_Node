require('dotenv').config()



const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const crypto = require("crypto")
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
        res.locals.holder? `Req body: ${res.locals.holder}` : ''
    ].join(' ')
}
app.use(morgan(incomingMorgan));


// Routes
app.get('/api/persons', (request, response, next) => {
    Person.find({})
    .then(persons => {
        response.json(persons);
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
    Person.findOne({id : request.params.id})
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).json({error: "Person with that id not found"})
        }
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
    if (!request.body.name) {
        return response.status(400).json({error: "Name missing"})

    } else {
        const person = new Person({
            id: crypto.randomBytes(10).toString('hex'),
            name: request.body.name,
            number: request.body.number? request.body.number : null
        });
          
        person.save().then(() => {
            response.json(person);
        })
        .catch(error => next(error))
    };
});


app.put('/api/persons/:id', (request, response, next) => {
    Person.findOneAndUpdate(
        {id : request.params.id},
        {number : request.body.number},
        {new: true, runValidators: true, context: 'query'}
    )
    .then(person => {
        if (person) {
            response.status(200).json(person)
        } else {
            response.status(404).json({error: "Person with that id not found"})
        } 
    })
    .catch(error => next(error));
});


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findOneAndDelete({id : request.params.id})
    .then((res) => {
        if (!res) {
            response.status(404).json({error : 'Not Found'});
        } else {
            response.status(204).end();
        }
    })
    .catch(error => next(error));
});


app.get('/info', (request, response, next) => {
    Person.find({})
    .then(persons => {
        response.send(`
            <p>Phonebook has info for ${persons.length} people.</p>
            <p>Datetime ${new Date}</p>
            `
        )
    })
    .catch(error => next(error))
})

// Custom error handler middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({error: 'Malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({error: error.message})
    }
    next(error)
};
app.use(errorHandler)


// Unknown endpoint middleware
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

