const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    request.user = await User.findById(decodedToken.id)
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.status(401).json({ error: 'token expired' })
    }
    response.status(401).json({ error: 'token verification failed' })
  }
}

const authenticateToken = async (request, response, next) => {
  try {
    const token = getTokenFrom(request)
    if (!token) {
      return response.status(401).json({ error: 'token missing' })
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    request.user = await User.findById(decodedToken.id)
    
    if (!request.user) {
      return response.status(401).json({ error: 'user not found' })
    }
    
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.status(401).json({ 
        error: 'token expired',
        code: 'TOKEN_EXPIRED'
      })
    }
    response.status(401).json({ error: 'invalid token' })
  }
}

module.exports={getTokenFrom, userExtractor, authenticateToken}