const express = require('express')
const router = express.Router()
const { registerUser, loginUser, test } = require('../controllers/authController')
const protect = require('../middleware/authMiddleware') 

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/test', protect, test)

module.exports = router
