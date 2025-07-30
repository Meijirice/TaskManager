const Board = require('../models/boardModel')

exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user._id })
    res.json(boards)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getBoard = async(req, res) => {
    try{
        const board = await Board.findOne({_id: req.params.id, userId: req.user._id})
        if(!board) return res.status(400).json({message: "Board not found"})
        
        res.status(200).json({board: board})
    }
    catch (err) {
        res.status(500).json({error: err})
    }
} 

exports.createBoard = async (req, res) => {
  try {
    const { title } = req.body
    if (!title) return res.status(400).json({ message: 'Title is required' })

    const newBoard = await Board.create({
      title,
      userId: req.user._id
    })

    res.status(201).json(newBoard)
  } catch (err) {
    res.status(500).json({ message: err.message})
  }
}

exports.deleteBoard = async (req, res) => {
    try {
        const deletedBoard = await Board.findOneAndDelete({userId: req.user._id})
        if(!deletedBoard) return res.status(400).json({message: "Board does not exist"})

        res.status(200).json({message: "Board successfully deleted", board: deletedBoard})
    }
    catch(err) {
        res.status(500).json({ message: err.message })
    }
}

exports.updateBoard = async (req, res) => {
    try{
        const updatedBoard = await Board.findOneAndUpdate(
            {_id : req.params.id, userId: req.user._id},
            {title: req.body.title},
            {new: true}
        )
        if(!updatedBoard) return res.status(400).json({message: "Invalid userID or did not find board"})

        res.status(200).json({message: "Board has been updated", board: updatedBoard})
    }
    catch(err) {
        res.status(500).json({error: err})
    }
}

