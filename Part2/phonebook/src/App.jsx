import { useState, useEffect } from 'react'
import axios from 'axios'
import phoneService from './services/phones'

const Filter=(props)=>{
  return(
     <div>filter shown with <input value={props.filter} onChange={props.fun}/></div>
  )
}

const PersonForm=(props)=>{
  return(
    <form onSubmit={props.funSub}>
          <div>name: <input value={props.name} onChange={props.funName} /></div>
          <div>number: <input value={props.number} onChange={props.funNumber}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const PersonList=(props)=>{
  return(
    <ul>
        {props.arr.map((per)=>(
          <div key={per.id}>
            <li>{per.name} {per.number}</li>
            <button onClick={()=>props.fun(per.id)}>delete</button>
          </div>))}
      </ul>
  )
}

const App = () => {
  useEffect(() => {
  console.log('effect')
  phoneService.
    getAll()
    .then(response => {
      console.log('promise fulfilled')
      setPersons(response.data)
    })
    }, [])
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas',
      number:'040-1234567'
    }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber]= useState('')
  const [filter, setFilter]= useState('')

  const handleFilter=(event)=>{
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this contact?')) {
      phoneService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const perToShow=
    persons.filter(per=>per.name.toLowerCase().includes(filter.toLowerCase()))

  const handleName=(event)=>{
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumber=(event)=>{
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const addToPhonebook=(event)=>{
    event.preventDefault()
    const Object={
      name: newName,
      number: newNumber
    }
     const existingPerson = persons.find(p => p.name ===Object.name)
    
    if (existingPerson) {
      if (window.confirm(`${Object.name} is already added to the phonebook, replace the old number with a new one?`)) {
        phoneService
          .update(existingPerson.id,Object)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
      }
    }
    else{
      phoneService.create(Object)
        .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
    }
  }
  
  
  return (
    <div>
      <h2>Phonebook</h2>
          <Filter filter={filter} fun={handleFilter}/>
      <h2>add a new</h2>
          <PersonForm funSub={addToPhonebook} name={newName} number={newNumber} funName={handleName} funNumber={handleNumber}/>
      <h2>Numbers</h2>
          <PersonList arr={perToShow} fun={handleDelete}/>
    </div>
  )
}

export default App