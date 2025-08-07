const express= require('express')
const app=express()
const morgan=require('morgan')
const cors=require('cors')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

let catalogue=[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

morgan.token('post-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return '-';
});

app.get('/', (req,res)=>{
    res.send('<h1>Hello</h1>')
})
app.get('/api/persons', (req,res)=>{
    res.json(catalogue)
})

app.post('/api/persons', (req,res)=>{
    const generateID=()=>{
        return(Math.floor(Math.random()*1000))
    }

    const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ 
      error: 'content missing' 
    })
  }

  if(catalogue.some(per=>per.name===body.name)){
    return res.status(400).json({
        error:'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: String(generateID()),
  }

  catalogue=catalogue.concat(person)

    res.json(person)
})

app.get('/info', (req,res)=>{
    res.send(`<h2>Phonebook has info for ${catalogue.length} people</h2>
              <p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = catalogue.find(person => person.id === id)
  
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  catalogue= catalogue.filter(per=> per.id !== id)

  res.status(204).end()
})

const PORT=process.env.PORT||3001

app.listen(PORT, ()=>{
    console.log('Server is listening on port 3001...')
})