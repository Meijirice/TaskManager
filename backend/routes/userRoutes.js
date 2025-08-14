const express = require("express");
const router = express.Router();
const { getCurrentUser, updateUser } = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


router.get("/me", protect, getCurrentUser);
router.put("/me", protect, upload.single("avatar"), updateUser);

module.exports = router;
