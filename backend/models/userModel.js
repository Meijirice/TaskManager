const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },        // For user profile bio
  avatar: { type: String, default: "" },     // URL or path to avatar image
  // Optional: role or subscription plan for later features
  role: { type: String, default: "user" },
}, { timestamps: true })


module.exports = mongoose.model('User', userSchema)