const express = require('express')
const mongoose = require('mongoose')
const config=require('./utils/config')
const blogRouter=require('./controllers/bloglist')

const app = express()


mongoose.connect(config.mongoUrl)

app.use(express.json())
app.use('/api/blogs', blogRouter)


module.exports=app