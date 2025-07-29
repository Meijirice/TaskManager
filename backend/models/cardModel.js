const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  listId: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  description: { type: String },
  position: { type: Number, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Card', cardSchema)