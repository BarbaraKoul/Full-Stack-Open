import axios from 'axios'
import {useState} from 'react'

const Blog = ({ blog, user, onLike, onDelete}) => {


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  
    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }
  
    const blogVisibility = () => {
      setVisible(!visible)
    }
  return(<div style={blogStyle}>
    <div style={hideWhenVisible}>
      {blog.title} {blog.author}
      <button onClick={blogVisibility}>view</button>
    </div> 
    <div style={showWhenVisible}>
      {blog.title} {blog.author}
      <button onClick={blogVisibility}>hide</button><br/>
      {blog.url}<br/>
      {blog.likes}
      <button onClick={onLike}>likes</button><br/>
      {user.name}<br/>
      <button onClick={onDelete}>remove</button>
    </div>
  </div>)
}

export default Blog