import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import { useNotification } from './notContext'

const AnecdoteForm = () => {

  const [, dispatch] = useNotification()
  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })


  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value

    if(content.length<5){
      dispatch({ type: 'SET', payload: 'Anecdote must be at least 5 characters' })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
      return
    }


    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutation.mutate({ content, votes:0 })
    dispatch({ type: 'SET', payload: `Created: "${content}"` })
    setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
