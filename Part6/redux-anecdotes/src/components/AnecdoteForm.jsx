import { useSelector, useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteForm = () => {
    const anecdotes = useSelector(state => state)
    const dispatch = useDispatch()

    const addAnecdote = async(event) => {
        event.preventDefault()
        const content =event.target.anecdote.value
        event.target.anecdote.value=''
        dispatch(createAnecdote(content))
        dispatch(showNotification(`Created new anecdote: "${content}"`))
    }

    return(
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div><input name="anecdote" /></div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm 