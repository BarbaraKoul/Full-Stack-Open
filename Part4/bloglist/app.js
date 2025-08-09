const express = require('express')
const mongoose = require('mongoose')
const config=require('./utils/config')
const blogRouter=require('./controllers/bloglist')
const usersRouter=require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()


mongoose.connect(config.mongoUrl)

app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


module.exports=app