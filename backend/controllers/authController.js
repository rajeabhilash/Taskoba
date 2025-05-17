const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

//@desc    Register new Userbaba
//@route   POST /api/auth/register
//@access  Public
const registerUser = async (req, res) => {
    console.log("--- processing request ---");
    try {
        const { name, email, password, profileImageURL, adminInviteToken } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ messges: "User already exists" });
        }

        let role = "member";
        if (adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN) {
            role = "admin";
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create(
            {
                name,
                email,
                password: hashedPassword,
                profileImageURL,
                role
            }
        );

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageURL: user.profileImageURL,
            token: generateToken(user._id),

        });
    } catch (error) {
        res.status(500).json({ message: "Server Error!", description: error })
    }
};

//@desc    Logins Userbaba
//@route   POST /api/auth/login
//@access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Email or Password!" })
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageURL: user.profileImageURL,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error!" })
    }
};

//@desc    Get Userbaba Profile
//@route   GET /api/auth/profile
//@access  Private (Requires JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) { return res.status(404).json({ message: "User not found!" }); }
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: "Server Error!" })
    }
};

//@desc    Update Userbaba profile
//@route   PUT /api/auth/profile
//@access  Private (Requires JWT)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({message : "User not found"});
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if(req.body.password){
            const salt = await bcrypt.getSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email : updatedUser.email,
            role : updatedUser.role,
            token: generateToken(updatedUser._id)
        });

    } catch (error) {
        res.status(500).json({ message: "Server Error!" })
    }
};


module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };