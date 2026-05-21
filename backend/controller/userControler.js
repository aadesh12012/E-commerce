const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
    try {
        let { name, email, password, role } = req.body;

        // check user
        let existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return res.json({
                success: false,
                message: "User Already Exists"
            });
        }

        // hash password
        let hashpassword = await bcrypt.hash(password, 10);

        // create user
        let user = await UserModel.create({
            name,
            email,
            password: hashpassword,
            role: role || "user" // default role
        });

        // jwt token
        let token = jwt.sign(
            {
                email,
                userid: user._id,
                role: user.role
            },
            process.env.JWT_SECRET || "nahibatauga"
        );

        res.cookie("token", token);

        res.json({
            success: true,
            message: "User created successfully",
            user
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid credentials"
            });
        }

        let token = jwt.sign(
            {
                email,
                userid: user._id,
                role: user.role
            },
            process.env.JWT_SECRET || "nahibatauga"
        );

        res.cookie("token", token);

        return res.json({
            success: true,
            message: "Login successful",
            user
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    createUser,
    loginUser
};
