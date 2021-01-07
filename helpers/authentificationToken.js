const jwt = require('jsonwebtoken')
const createError = require('http-errors')

const authenticationToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({
        message: 'Token cannot be empty'
    })
  }

  jwt.verify(token, process.env.SECRET_KEY, (error, results) => {
    if(!error){
      req.user = results
      return next()
    }
    if (error.name === 'TokenExpiredError') {
        res.status(401).json({
          status: 'Failed',
          message: 'Token expired'
        })
    } else if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
            status: 'Failed',
            message: 'Invalid token'
        })
    }
  })
}

module.exports = authenticationToken