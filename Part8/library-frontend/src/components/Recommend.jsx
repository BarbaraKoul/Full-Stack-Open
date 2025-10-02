import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'

const GET_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

const GET_BOOKS_BY_GENRE = gql`
  query getBooksByGenre($genre: String!) {
    allBooks(genre: $genre) {
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

const Recommend = (props) => {

  const userResult = useQuery(GET_USER)
  const favoriteGenre = userResult.data?.me?.favoriteGenre
  
  const booksResult = useQuery(GET_BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre
  })

   if (!props.show) {
    return null
  }

  if (userResult.loading || booksResult.loading) return <div>Loading...</div>
  if (userResult.error) return <div>Error: {userResult.error.message}</div>
  
  const books = booksResult.data?.allBooks || []

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{favoriteGenre}</strong></p>
      
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend