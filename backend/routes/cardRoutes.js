const express = require('express')
const router = express.Router()
const { getCardsFromList, createCard, updateCard, deleteCard, getCardsFromBoard } = require('../controllers/cardController')
const  protect = require('../middleware/authMiddleware')

router.get('/:listId', protect, getCardsFromList)
router.get('/board/:boardId', protect, getCardsFromBoard)
router.post('/', protect, createCard)
router.put('/:id', protect, updateCard)
router.delete('/:id', protect, deleteCard)

module.exports = router
