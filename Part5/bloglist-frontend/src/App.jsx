import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login' 
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification]= useState(null)

  const showTemporaryNotification = (message, type = 'success', duration = 5000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const [user, setUser] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


useEffect(() => {
  const token = localStorage.getItem('token')
  if (token) {
    const decoded = jwt.decode(token)
    setUser(decoded)
  }
}, [])

 const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogUser', 
        JSON.stringify(user)
      )
      
      setUser(user)
      setUsername('')
      setPassword('')} 
      catch (error) {
        console.error('Login error:', error)
        showTemporaryNotification('wrong username or password', 'error')
      }
  }

   useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

   const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
  }

  const [title, setTitle]=useState('')
  const [author, setAuthor]=useState('')
  const [url, setUrl]=useState('')

  const handleNewBlog= async (event)=>{
    event.preventDefault()
    const Blog={
      title: title,
      author: author,
      url: url
    }

  const success = await addBlog(Blog);
  if (success) {
    setTitle('')
    setAuthor('')
    setUrl('')
  }
}

  const addBlog= async (blog)=>{
       try {
        const response = await blogService.create(blog)
        setBlogs(blogs.concat(response.data))
        showTemporaryNotification(
          `a new blog "${response.data.title}" by ${response.data.author} added`,
          'success'
        )
        return true}
      catch (error) {
        showTemporaryNotification(
          error.response?.data?.error || 'Failed to create blog',
          'error'
        )
    return false;
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {notification && (<div className={`notification ${notification.type}`}>{notification.message}</div>)}
        <form onSubmit={handleLogin}>
          <div>username <input value={username} onChange={({target})=>setUsername(target.value)}/></div>
          <div>password <input value={password} onChange={({target})=>setPassword(target.value)}/></div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {notification && (<div className={`notification ${notification.type}`}>{notification.message}</div>)}
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>title:<input value={title} onChange={({target})=>setTitle(target.value)}/></div>
        <div>author:<input value={author} onChange={({target})=>setAuthor(target.value)}/></div>
        <div>url:<input value={url} onChange={({target})=>setUrl(target.value)}/></div>
        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App