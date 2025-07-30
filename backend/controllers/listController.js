const List = require("../models/listModel")

exports.getLists = async(req, res) => {
    try{
        const lists = await List.find({
            boardId: req.params.boardId,
            userId: req.user._id,
        }).sort({ createdAt: 1 })

        if(!lists) return res.status(400).json({message: "No lists or unauthorized user"})

        res.status(200).json({lists: lists, user: req.user})
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

exports.getList = async(req, res) => {
    try{
        const list = await List.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if(!list) return res.status(400).json({message: "No list or unauthorized user"})

        res.status(200).json({list: list, user: req.user})
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

exports.createList = async(req, res) => {
    const {title, boardId} = req.body
    try{
        const createdList = await List.create({
            title,
            boardId,
            userId: req.user._id
        })
        if(!createdList) return res.status(400).json({message: "Unauthorized user"})
        
        return res.status(200).json({message: "List successfully created", list: createdList})
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

exports.updateList = async(req, res) => {
    try{
        const updatedList = await List.findOneAndUpdate(
            {_id: req.params.id, userId: req.user._id},
            {title: req.body.title},
            {new: true}
        )

        if(!updatedList) return res.status(400).json({message: "List not found"})
        res.status(200).json({message:"List successfully updated", list: updatedList})
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}

exports.deleteList = async(req, res) => {
    try{
        const deletedList = await List.findOneAndDelete(
            {_id: req.params.id, UserId: req.user._id}
        )
        if(!deletedList) return res.status(400).json({message: "List not found"})

        res.status(200).json({message: "Successfuly deleted list", list: deletedList})
    }
    catch(err) {
        res.status(500).json({error: err.message})
    }
}