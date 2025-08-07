import { useState, useEffect } from 'react'
import './index.css'
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
  const [addition, setAddition]= useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const handleFilter=(event)=>{
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this contact?')) {
      phoneService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setAddition(`Deleted contact successfully`)
          setTimeout(() => setAddition(null), 5000)
        }).catch(error => {
          setErrorMessage(
            `Failed to delete contact: ${error.message}`
          )
          setTimeout(() => setErrorMessage(null), 5000)
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
            setAddition(`Added ${Object.name}`)
            setErrorMessage(null)
            setTimeout(()=>{
              setAddition(null)
            },5000)
          }).catch(error => {
            if (error.response && error.response.status === 404) {
              setErrorMessage(
                `Information of ${newPerson.name} has already been removed from server`
              )
              setPersons(persons.filter(p => p.id !== existingPerson.id))
            } else {
              setErrorMessage(
                `Failed to update ${Object.name}: ${error.message}`
              )
            }
            setTimeout(() => setErrorMessage(null), 5000)
          })
      }
    }
    else{
      phoneService.create(Object)
        .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      setAddition(`Added ${Object.name}`)
      setErrorMessage(null)
      setTimeout(()=>{
              setAddition(null)
            },5000)
      }).catch(error => {
          setErrorMessage(
            `Failed to add ${Object.name}: ${error.message}`
          )
          setTimeout(() => setErrorMessage(null), 5000)
        })
    }
  }
  
  
  return (
    <div>
      <h2>Phonebook</h2>
      {addition && <div className="message">{addition}</div>}
      {errorMessage && <div className="error">{errorMessage}</div>}
          <Filter filter={filter} fun={handleFilter}/>
      <h2>add a new</h2>
          <PersonForm funSub={addToPhonebook} name={newName} number={newNumber} funName={handleName} funNumber={handleNumber}/>
      <h2>Numbers</h2>
          <PersonList arr={perToShow} fun={handleDelete}/>
    </div>
  )
}

export default App