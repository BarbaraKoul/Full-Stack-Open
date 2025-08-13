import { useSelector, useDispatch } from 'react-redux'
import { voteOf } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'


const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)
    const dispatch = useDispatch()

    const vote = (id, content) => {
        console.log('vote', id)
        dispatch(voteOf(id))
        dispatch(setNotification(`You voted for: "${content}"`))
        setTimeout(() => dispatch(clearNotification()), 5000)
    }

    const compareByVote = (a,b) => {
      return b.votes-a.votes
    }

    const filteredAnecdotes = anecdotes
    .filter(anecdote => 
      anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
    .sort(compareByVote)


  return(
    <div>
        {filteredAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default  AnecdoteList 