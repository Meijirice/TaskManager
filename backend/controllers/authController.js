const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret'

exports.test = async (req, res) => {
    try {
        const currentUser = req.user
        return res.status(200).json({user: currentUser})
    }
    catch(err) {
        return res.status(500).json({error : err.message})
    }
}

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: 'User already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({ name, email, password: hashedPassword })

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

exports.loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}
