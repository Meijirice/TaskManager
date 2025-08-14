
const User = require("../models/userModel");

exports.getCurrentUser = async (req, res) => {
  try {
    if (!req.user) return res.status(404).json({ message: "User not found" });
    res.json(req.user); 
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const updates = {};
    const { name, email, bio } = req.body;

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (bio) updates.bio = bio;

    if (req.file) {
      updates.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


