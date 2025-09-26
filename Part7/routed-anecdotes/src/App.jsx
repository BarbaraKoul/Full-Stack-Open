import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  useNavigate,
} from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { useField } from "./hooks"
import { addAnecdote, voteAnecdote } from "../redux/anecdotesSlice"
import { showNotification } from "../redux/notificationSlice"
import { Table, Form, Button, Navbar, Nav } from 'react-bootstrap'

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id
  const anecdote = anecdotes.find((a) => a.id === Number(id))
  if (!anecdote) return <div>Not found</div>

  return (
    <div>
      <h2>
        {anecdote.content}, by {anecdote.author}
      </h2>
      <div>has {anecdote.votes} votes</div>
      <div>
        for more info see <a href={anecdote.info}>{anecdote.info}</a>
      </div>
    </div>
  )
}

const Menu = () => {
  const padding = { paddingRight: 5 }
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
  <Navbar.Toggle aria-controls="responsive-navbar-nav" />
  <Navbar.Collapse id="responsive-navbar-nav">
    <Nav className="me-auto">
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/anecdotes">anecdotes</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/create">create new</Link>
      </Nav.Link>
      <Nav.Link href="#" as="span">
        <Link style={padding} to="/about">about</Link>
      </Nav.Link>
    </Nav>
  </Navbar.Collapse>
</Navbar>
  )
}

const AnecdoteList = ({ anecdotes, onVote }) => (
  <div>
    <h2>Anecdotes</h2>
    <Table striped>
      <tbody>
        {anecdotes.map((anecdote) => (
        <tr key={anecdote.id}>
          <td>
            <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>{" "}
          </td>
          <td>
            <button onClick={() => onVote(anecdote.id)}>vote</button>
          </td>
        </tr>
      ))}
      </tbody>
    </Table>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>
      An anecdote is a brief, revealing account of an individual person or an
      incident. Occasionally humorous, anecdotes differ from jokes because their
      primary purpose is not simply to provoke laughter but to reveal a truth
      more general than the brief tale itself, such as to characterize a person
      by delineating a specific quirk or trait, to communicate an abstract idea
      about a person, place, or thing through the concrete details of a short
      narrative. An anecdote is "a story with a point."
    </em>

    <p>
      Software engineering is full of excellent anecdotes, at this app you can
      find the best and add more.
    </p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href="https://fullstackopen.com/">Full Stack Open</a>.
    See{" "}
    <a href="https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js">
      https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js
    </a>{" "}
    for the source code.
  </div>
)

const CreateNew = () => {
  const author = useField("text")
  const info = useField("text")
  const content = useField("text")
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(
      addAnecdote({
        content: content.value,
        author: author.value,
        info: info.value,
        votes: 0,
        id: Math.round(Math.random() * 10000),
      })
    )
    dispatch(showNotification(`Added "${content.value}"`, 5))
    navigate("/anecdotes")
  }

  const handleReset = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>content</Form.Label>
          <Form.Control
            type={content.type}
            value={content.value}
            onChange={content.onChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>author</Form.Label>
          <Form.Control
            type={author.type}
            value={author.value}
            onChange={author.onChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>url for more info</Form.Label>
          <Form.Control type={info.type} value={info.value} onChange={info.onChange} />
        </Form.Group>
        <Button type="submit">create</Button>
        <Button type="button" onClick={handleReset}>
          reset
        </Button>
      </Form>
    </div>
  )
}

const App = () => {
  const anecdotes = useSelector((state) => state.anecdotes)
  const notification = useSelector((state) => state.notification)
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(voteAnecdote(id))
    const voted = anecdotes.find((a) => a.id === id)
    if (voted) {
      dispatch(showNotification(`You voted for "${voted.content}"`, 5))
    }
  }

  return (
    <Router>
      <div className="container">
        <h1>Software anecdotes</h1>
        <Menu />
        {notification && <Alert variant="success">{notification}</Alert>}
        <Routes>
          <Route
            path="/anecdotes/:id"
            element={<Anecdote anecdotes={anecdotes} />}
          />
          <Route
            path="/anecdotes"
            element={<AnecdoteList anecdotes={anecdotes} onVote={vote} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/create" element={<CreateNew />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
