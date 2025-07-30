const express = require('express')
const router = express.Router()
const {getLists, getList, createList, deleteList, updateList} = require('../controllers/listController')
const protect = require('../middleware/authMiddleware') 

router.get('/:boardId', protect, getLists)
router.get('/single/:id', protect, getList)
router.post('/', protect, createList)
router.put('/:id', protect, updateList)
router.delete('/:id', protect, deleteList)

module.exports = router
