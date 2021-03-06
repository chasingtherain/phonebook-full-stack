const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('object', function(req,res){return JSON.stringify(req.body)})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

let phonebook = [
    {
        name: "jp1",
        number: 8121,
        id: 1
    },
    {
        name: "jp2",
        number: 8122,
        id: 2
    },
    {
        name: "jp3",
        number: 8123,
        id: 3
    },
    {
        name: "jp4",
        number: 8124,
        id: 4
    }
]

//home page
app.get('/', (req,res)=>{
    res.send("Hi, I am the backend of phonebook app")
})

//fetch all resources
app.get('/api/phonebook', (req,res)=>{
    res.send(phonebook)
})

// fetch single resource
app.get('/api/phonebook/:id', (req,res)=>{
    const contactId = req.params.id
    const contact = phonebook.find(contact =>  contact.id == contactId)
    if (contact){
        res.send(contact)
    }
    else{
        res.status(404).send("resource not found")
    }
})

// return phonebook info
app.get('/info', (req,res)=>{
    const numOfContact = phonebook.length
    const date = new Date()
    res.send(`Phonebook has ${numOfContact} contact information and today's date is        
    ${date}`)
})

// delete single resource
app.delete('/api/phonebook/:id', (req,res) =>{
    const contactId = Number(req.params.id)
    phonebook = phonebook.filter(contact =>  contact.id !== contactId)
    res.status(204).end()
})

// add new resource
app.post('/api/phonebook', (req,res)=> {
    const maxId = phonebook.length > 0 
    ? Math.max(...phonebook.map(contact => contact.id))
    : 0

    const newContact = req.body
    if(newContact.name.length == 0){
        // res.send("Name cannot be empty!")
        res.status(422).send("Name cannot be empty!").end()
    }
    if(phonebook.find(contact => contact.name.toLowerCase() == newContact.name.toLowerCase())){
        res.status(409).send("Name must be unique!").end()
    }

    newContact.id = maxId + 1;
    res.json(newContact);
})

app.listen(PORT, () => {console.log(`server is listening on port ${PORT}`)})