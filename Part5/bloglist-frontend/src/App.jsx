import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login' 
import './index.css'
import Togglable from './components/Togglable'
import axios from 'axios'


const BlogForm=(props)=>{
  return (
    <form onSubmit={props.handleNewBlog}>
        <div>title:<input value={props.title} onChange={({target})=>props.setTitle(target.value)}/></div>
        <div>author:<input value={props.author} onChange={({target})=>props.setAuthor(target.value)}/></div>
        <div>url:<input value={props.url} onChange={({target})=>props.setUrl(target.value)}/></div>
        <button type="submit">create</button>
    </form>)
}

const LoginForm=(props)=>{
  return(
     <form onSubmit={props.handleLogin}>
          <div>username <input value={props.username} onChange={({target})=>props.setUsername(target.value)}/></div>
          <div>password <input type="password" value={props.password} onChange={({target})=>props.setPassword(target.value)}/></div>
          <button type="submit">login</button>
      </form>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification]= useState(null)

  const showTemporaryNotification = (message, type = 'success', duration = 5000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  }


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
    const decoded = JSON.parse(token)
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
      blogService.setToken(user.token)
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
    blogService.setToken(user.token)
  }
}, [])

   const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)
    blogService.setToken(null)
  }
   
  const handleDelete = async (blogId) => {
  if (!window.confirm('Are you sure you want to delete this blog?')) {
    return false
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}` 
      }
    }
    await axios.delete(`/api/blogs/${blogId}`, config)
    setBlogs(blogs.filter(b => b.id !== blogId))
    showTemporaryNotification('Blog deleted successfully', 'success')
    return true;
  } 
  catch (error) {
    console.error('Delete error:', error)

    let errorMessage = 'Failed to delete blog'
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = 'You are not authorized to delete this blog'
          break;
        case 404:
          errorMessage = 'Blog not found (already deleted?)'
          break;
        case 500:
          errorMessage = 'Server error - please try again later'
          break;
        default:
          errorMessage = error.response.data?.error || errorMessage
      }
    } else {
      errorMessage = error.message
    }

    showTemporaryNotification(errorMessage, 'error')
    return false
  }
}

   const handleLike = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    try {
      await axios.put(`/api/blogs/${blog.id}`, updatedBlog, {
        headers: { "Content-Type": "application/json" }})
      console.log("Like added!")
      setBlogs(blogs.map(b => b.id === blog.id ? { ...b, likes: b.likes + 1 } : b))
    } catch (error) {
      console.error("Error updating likes:", error)
    }
  }

  const [title, setTitle]=useState('')
  const [author, setAuthor]=useState('')
  const [url, setUrl]=useState('')

  const handleNewBlog= async (event)=>{
    event.preventDefault()
    const Blog={
      title: title,
      author: author,
      url: url,
      likes:0
    }

  const success = await addBlog(Blog);
  if (success) {
    setBlogs([...blogs, response.data])
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

  const comparison=(blog1, blog2)=>{
    return blog1.likes-blog2.likes
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        {notification && (<div className={`notification ${notification.type}`}>{notification.message}</div>)}
        <Togglable buttonLabel='login'>
          <LoginForm username={username} password={password} handleLogin={handleLogin} setPassword={setPassword} setUsername={setUsername}/>
        </Togglable>
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
      <Togglable buttonLabel='new Blog'>
        <BlogForm handleNewBlog={handleNewBlog} author={author} url={url} title={title} setAuthor={setAuthor} setTitle={setTitle} setUrl={setUrl}/>
      </Togglable>
      {blogs.sort(comparison).map(blog =>
        <Blog key={blog?.id} blog={blog} user={user}  onLike={() => handleLike(blog)} onDelete={()=>handleDelete(blog?.id)}/>
      )}
    </div>
  )
}

export default App