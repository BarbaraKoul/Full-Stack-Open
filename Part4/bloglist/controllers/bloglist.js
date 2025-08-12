const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { authenticateToken } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
});

blogRouter.post('/', authenticateToken, async (request, response) => {
  const { title, url, likes = 0 } = request.body
  const user = request.user

  if (!title || !url) {
    return response.status(400).json({ error: 'title and url are mandatory' })
  }

  const blog = new Blog({
    title: title,
    url: url,
    likes: likes,
    user: user.id
  })

  const savedBlog = await blog.save()
  await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', authenticateToken, async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user')
  if (!blog) return response.status(404).json({ error: 'Blog not found' })

  if (blog.user._id.toString() !== request.user.id.toString()) {
    return response.status(403).json({ error: 'Only the creator can delete a blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  try {
    const { likes } = request.body
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true }
    ).populate('user', { username: 1, name: 1 })

    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    response.json(updatedBlog)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

module.exports = blogRouter