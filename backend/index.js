const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))

app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/boards', require('./routes/boardRoutes'))
app.use('/api/lists', require('./routes/listRoutes'))
app.use('/api/cards', require('./routes/cardRoutes'))
app.use('/api/users', require('./routes/userRoutes'))

app.listen(5000, () => console.log('Server running on port 5000'))