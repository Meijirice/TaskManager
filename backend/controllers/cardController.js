const Card = require("../models/cardModel")

exports.getCards = async (req, res) => {
    try {
        const cards = await Card.find({
            listId: req.params.listId,
            userId: req.user._id,
        }).sort({ position: 1 })

        if (!cards) return res.status(400).json({ message: "No cards or unauthorized user" })

        res.status(200).json({ cards: cards, user: req.user })
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.createCard = async (req, res) => {
    const { title, listId, boardId, status } = req.body
    try {
        if (!title || !listId || !boardId) {
            return res.status(400).json({ message: "Title, listId, and boardId are required" })
        }

        const count = await Card.countDocuments({ listId, userId: req.user._id })

        const createdCard = await Card.create({
            title,
            listId,
            boardId,
            userId: req.user._id,
            position: count,
            status: status || 'available'
        })

        if (!createdCard) return res.status(400).json({ message: "Unauthorized user" })

        res.status(201).json({ message: "Card successfully created", card: createdCard })
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.updateCard = async (req, res) => {
    try {
        const updatedCard = await Card.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        )

        if (!updatedCard) return res.status(404).json({ message: "Card not found or unauthorized" })

        res.status(200).json({ message: "Card successfully updated", card: updatedCard })
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.deleteCard = async (req, res) => {
    try {
        const deletedCard = await Card.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!deletedCard) return res.status(404).json({ message: "Card not found or unauthorized" })

        res.status(200).json({ message: "Card successfully deleted", card: deletedCard })
    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }
}
