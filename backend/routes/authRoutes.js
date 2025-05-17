const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/authController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

router.post("/upload_image", upload.single('image'), (req, res) => {
    if(!req.file){
        return res.status(400).json({message : "No files to upload"});
    }
    const imageURL = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({imageURL});
});

module.exports = router;