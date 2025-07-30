const express = require('express')
const router = express.Router()
const { getBoards, getBoard, createBoard, deleteBoard, updateBoard } = require('../controllers/boardController')
const protect = require('../middleware/authMiddleware') 

router.get("/", protect, getBoards)
router.get("/:id", protect, getBoard)
router.delete("/:id", protect, deleteBoard)
router.put("/:id", protect, updateBoard)
router.post("/create", protect, createBoard)


module.exports = router