const express = require('express')
const router = express.Router()
const {getCards, createCard, updateCard, deleteCard} = require('../controllers/cardController')
const { protect } = require('../middleware/authMiddleware')

router.get('/:listId', protect, getCards)
router.post('/', protect, createCard)
router.put('/:id', protect, updateCard)
router.delete('/:id', protect, deleteCard)

module.exports = router
