import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useState } from 'react'

const GET_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author {
        name
      }
      genres
      id
    }
  }
`

const Books = (props) => {
  // ΠΡΙΝ ΟΠΟΙΟΥΔΗΠΟΤΕ RETURN - όλα τα hooks πρώτα!
  const [genre, setGenre] = useState(null)
  const result = useQuery(GET_BOOKS)
  
  // Μόνο ΜΕΤΑ τα hooks κάνουμε early return
  if (!props.show) {
    return null
  }

  if (result.loading) return <div>Loading...</div>
  if (result.error) return <div>Error: {result.error.message}</div>
  
  const books = result.data.allBooks
  
  // Extract all unique genres
  const allGenres = [...new Set(books.flatMap(book => book.genres))]
  
  const filteredBooks = genre 
    ? books.filter(book => book.genres.includes(genre))
    : books

  return (
    <div>
      <h2>books</h2>
      
      {genre && (
        <p>in genre <strong>{genre}</strong></p>
      )}
      
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div>
        {allGenres.map(g => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books