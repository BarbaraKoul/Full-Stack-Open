import { useQuery, useMutation } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useState } from 'react'

const GET_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(
      name: $name,
      setBornTo: $setBornTo
    ) {
      name
      born
      bookCount
    }
  }
`

const Authors = (props) => {

  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }]
  })
  const result = useQuery(GET_AUTHORS)


  if (!props.show) {
    return null
  }

  if (result.loading) return <div>Loading...</div>
  if (result.error) return <div>Error: {result.error.message}</div>
  
  const authors = result.data.allAuthors

  const submit = async (event) => {
    event.preventDefault()
    
    if (!name || !born) {
      alert('Please fill all fields')
      return
    }

    try {
      await editAuthor({ 
        variables: { 
          name, 
          setBornTo: parseInt(born)
        } 
      })
      
      setName('')
      setBorn('')
    } catch (error) {
      console.error('Error updating author:', error)
    }
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born || 'Unknown'}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
          <div>
            name
            <select value={name} onChange={({ target }) => setName(target.value)}>
              <option value="">Select author</option>
              {authors.map(author => (
                <option key={author.name} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            born
            <input 
              type="number" 
              value={born} 
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          <button type="submit">update birthyear</button>
        </form>
      </div>
    </div>
  )
}

export default Authors