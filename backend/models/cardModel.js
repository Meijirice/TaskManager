const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  position: { type: Number, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Card', cardSchema)