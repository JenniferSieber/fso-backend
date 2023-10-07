const express = require('express')
const app = express()

// Middleware - morgan
const morgan = require('morgan')
// changed to log all errors
morgan.token('postData', (req) => {
  // if (req.method === 'POST') {
    return JSON.stringify(req.body)
  // }
  // return ''
})

app.use(morgan(':method :url :status :res[content-length] :response-time ms :postData'));

// Parse for Post and Put requests
app.use(express.json())
const PORT = 3005

// DB JSON array
let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// get JSON array all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// get info on current time of GET req and amount of people in peoples array
app.get('/info', (req, res) => {
  const currentDate = new Date()
  res.send(`<h2>Phonebook has info for ${persons.length} people.</h2><br><h2>${currentDate}</h2>`)
})

// get person by unique id in url
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id 
  const person = persons.find(person => person.id == id) 
  if (person) {
    // res.send(`<h2>ID: ${person.id}<br>Customer: ${person.name}<br>Number: ${person.number}</h2>`)
    res.json(person)
  } else {
    res.status(204).end()
  } 
})

// delete person by unique id
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id) 
  persons = persons.filter(entry => entry.id != id)
  res.status(204).end()
})

// Text recommended way to generate a random id
// Do not rely on persons.length because some could of been deleted, but the length as an id will have been used already.
// generate unique id based on persons array for new person on POST req
const generateID = () => {
  const maxID = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0
  return maxID + 1
}

// POST new Person to bottom of peoples array ---validation for empty name/number or not unique name
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    res.status(400).json({error: `Name is missing.`})
  }
  if (!body.number) {
    res.status(400).json({error: `Number is missing.`})
  }
  
  if (persons.some(entry => entry.name === body.name)) {
    res.status(409).json({error: `Entry should be unique.`})
  }

  let entry = {
    id: generateID(),
    name: body.name,
    number: body.number,
  }

  persons = persons.push(entry)
  res.json(entry)
})


// server listening for requests on PORT
app.listen(PORT, () => console.log(`Server active on port: ${PORT}`))