const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const app = express()

app.use(cors())

app.use(express.json())
app.use(express.static('dist'))


morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// phonebook data. 
let phonebook = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

app.get('/api/persons', (req, res) => {
  res.json(phonebook)
})

app.get('/info', (req, res) => {
  res.send(`
    <p>Phonebook has info for ${phonebook.length} people</p>
    <p>${new Date()}</p>
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const found = phonebook.find(p => p.id === req.params.id)
  if (!found) return res.status(404).end()
  res.json(found)
})

app.delete('/api/persons/:id', (req, res) => {
  phonebook = phonebook.filter(p => p.id !== req.params.id)
  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body

  if (!name || !number)
    return res.status(400).json({ error: 'name or number missing' })

  if (phonebook.find(p => p.name === name))
    return res.status(400).json({ error: 'name already exists' })

  const newEntry = {
    id: String(Math.floor(Math.random() * 1000000)),
    name,
    number
  }

  phonebook = phonebook.concat(newEntry)
  res.json(newEntry)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`server started on port ${PORT}`))