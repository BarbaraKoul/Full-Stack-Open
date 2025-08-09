
const assert = require('node:assert')
const { test,describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog= require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject=new Blog(initialBlogs[2])
  await blogObject.save()
  blogObject=new Blog(initialBlogs[3])
  await blogObject.save()
  blogObject=new Blog(initialBlogs[4])
  await blogObject.save()
  blogObject=new Blog(initialBlogs[5])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})

test.only('blog identifier is renamed from _id to id', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blog = response.body[0]
  
  assert.strictEqual(blog.id !== undefined, true,)
  assert.strictEqual(blog._id, undefined,)
})


after(async () => {
  await mongoose.connection.close()
})

test.only('default 0', async()=>{
    const testBlog={
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html"
    }

    const response =await api.post('/api/blogs')
    .send(testBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes,0)

})

after(async () => {
  await mongoose.connection.close()
})

test('missing title or url', async()=>{
    const wrongBlog1={
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
    }

    const wrongBlog2={
        title: "Type wars",
        author: "Robert C. Martin",
        likes: 2,
    }

    await api
    .post('/api/blogs')
    .send(wrongBlog1,wrongBlog2)
    .expect(400)
})

describe('DELETE /api/blogs/:id', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToDelete = blogsAtStart[0]
    
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    
    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
    
  })
  
  test('fails with status code 404 if blog does not exist', async () => {
    const validNonexistingId = '5a422b3a1b54a676234d17f0'
    
    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })
  
})

describe('PUT /api/blogs/:id', () => {
  test('updates blog likes successfully', async () => {
    const blogsAtStart = await Blog.find({})
    const blogToUpdate = blogsAtStart[0]
    const newLikes = blogToUpdate.likes + 10

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: newLikes })
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.likes, newLikes)
    const updatedBlog = await Blog.findById(blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, newLikes)
  })


  test('fails with status 404 if blog does not exist', async () => {
    const validNonExistingId = '5a422b3a1b54a676234d17f0'
    await api
      .put(`/api/blogs/${validNonExistingId}`)
      .send({ likes: 5 })
      .expect(404);
  })
})

describe('when there is initially one user and one blog', () => {
  let token

  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const user = new User({
      username: 'root',
      passwordHash: await bcrypt.hash('sekret', 10)
    })
    await user.save()

    const blog = new Blog({
      title: 'Test Blog',
      url: 'http://test.com',
      user: user._id
    })
    await blog.save()
    
    const response = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
    
    token = response.body.token
  })

  test('POST requires valid token', async () => {
    const newBlog = {
      title: 'Token Test',
      url: 'http://token.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401) // Unauthorized without token
  })
})