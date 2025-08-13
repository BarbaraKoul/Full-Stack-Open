import { useSelector, useDispatch } from 'react-redux'
import { voteOf, createAnecdote } from './reducers/anecdoteReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()

    const vote = (id) => {
        console.log('vote', id)
        dispatch(voteOf(id))
    }

  const compareByVote = (a,b) => {
    return b.votes-a.votes
  }

  return(
    <div>
        {anecdotes.sort(compareByVote).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export { AnecdoteList }