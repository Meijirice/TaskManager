const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret'

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      req.user = await User.findById(decoded.userId).select('-password')
      next()
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' })
    }
  } else {
    res.status(401).json({ message: 'No token provided' })
  }
}

module.exports = protect
