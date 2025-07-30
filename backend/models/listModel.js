const mongoose = require('mongoose')

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true }
}, { timestamps: true })

module.exports = mongoose.model('List', listSchema)