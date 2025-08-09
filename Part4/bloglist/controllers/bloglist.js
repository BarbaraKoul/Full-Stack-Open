const blogRouter= require('express').Router()
const Blog= require('../models/blog')
const {userExtractor, getTokenFrom, authenticateToken}=require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs= await Blog.find({}).populate('user', {username:1, name:1})
    response.json(blogs)

})

blogRouter.post('/', authenticateToken,async (request, response) => {
  const blog = new Blog(request.body)

   const user = request.user

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }
  
  if(!blog.title||!blog.url){
    response.status(400).json({ error: 'title and url are mandatory' })
  }

  try {
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    
    response.status(201).json(savedBlog)
  } catch (error) {
    response.status(400).json({ error: error.message })
  }
})

blogRouter.delete('/:id', authenticateToken, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(404).json({ error: 'Blog not found' })
  
  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({ error: 'Only the creator can delete a blog' })
  }
  
  await Blog.findByIdAndDelete(request.params.id)
  request.user.blogs = request.user.blogs.filter(b => b.toString() !== request.params.id)
  await request.user.save()
  
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  try {
    const { likes } = request.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }

    response.json(updatedBlog);
  } catch (error) {
    response.status(400).json({ 
      error: error.name === 'CastError' 
        ? 'Malformed id' 
        : 'Validation failed' 
    });
  }
});

module.exports=blogRouter