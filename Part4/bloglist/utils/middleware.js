const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null;
}

const authenticateToken = async (request, response, next) => {
  try {
    const token = getTokenFrom(request)
    if (!token) {
      return response.status(401).json({ 
        error: 'Token missing',
        code: 'TOKEN_MISSING'
      })
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)
    
    if (!user) {
      return response.status(401).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    request.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return response.status(401).json({ 
        error: 'Token expired',
        code: 'TOKEN_EXPIRED'
      })
    }
    response.status(401).json({ 
      error: 'Invalid token',
      code: 'TOKEN_INVALID'
    })
  }
}

module.exports = {
  getTokenFrom,
  authenticateToken 
}