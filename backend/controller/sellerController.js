const ProductModel = require("../models/product");
const SellerModel = require("../models/sellerlogin");
const OrderModel = require("../models/order");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addproduct = async (req, res) => {
    try {
        const { name, price, image, info } = req.body;

        // Check Product Exists
        const existingProduct = await ProductModel.findOne({ name });
        if (existingProduct) {
            return res.json({
                success: false,
                message: "Product Already Exists"
            });
        }

        // Create Product with sellerId
        const product = await ProductModel.create({
            name,
            price,
            image,
            info,
            sellerId: req.seller.id // From isSeller middleware
        });

        res.status(201).json({
            success: true,
            message: "Product Created Successfully",
            product
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const listproduct = async (req, res) => {
    try {
        const products = await ProductModel.find().populate("sellerId", "name email");
        res.status(200).json({
            success: true,
            products
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const sellerregister = async (req, res) => {
    try {
        const { name, email, password, phone, businessName, address } = req.body;

        // Validation
        if (!name || !email || !password || !phone || !businessName || !address) {
            return res.json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if seller already exists
        const existingSeller = await SellerModel.findOne({ email });
        if (existingSeller) {
            return res.json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create seller
        const seller = await SellerModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            businessName,
            address
        });

        // JWT Token
        const token = jwt.sign(
            {
                id: seller._id,
                email: seller.email
            },
            process.env.JWT_SECRET_SELLER || "secretkey",
            {
                expiresIn: "2d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true
        });

        res.status(201).json({
            success: true,
            message: "Seller registered successfully",
            seller
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const sellerlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: "Email and password are required"
            });
        }

        const seller = await SellerModel.findOne({ email });
        if (!seller) {
            return res.json({
                success: false,
                message: "Seller not found"
            });
        }

        // Compare password
        const passwordMatch = await bcrypt.compare(password, seller.password);
        if (!passwordMatch) {
            return res.json({
                success: false,
                message: "Invalid password"
            });
        }

        // JWT Token
        const token = jwt.sign(
            {
                id: seller._id,
                email: seller.email
            },
            process.env.JWT_SECRET_SELLER || "secretkey",
            {
                expiresIn: "2d"
            }
        );

        res.cookie("token", token, {
            httpOnly: true
        });

        res.json({
            success: true,
            message: "Login Successful",
            seller
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Save seller payment details
const savePayoutDetails = async (req, res) => {
    try {
        const { upiId, bankAccount, ifscCode, accountHolderName } = req.body;
        const sellerId = req.seller.id;

        const seller = await SellerModel.findByIdAndUpdate(
            sellerId,
            {
                upiId,
                bankAccount,
                ifscCode,
                accountHolderName
            },
            { new: true }
        );

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Payout details saved successfully",
            seller
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Fetch seller earnings
const getEarnings = async (req, res) => {
    try {
        const sellerId = req.seller.id;

        // Fetch successful orders for this seller
        const orders = await OrderModel.find({
            sellerId: sellerId,
            paymentStatus: "successful"
        });

        // Sum the order amounts
        const totalEarnings = orders.reduce((sum, order) => sum + order.amount, 0);

        // Fetch seller details for transferred earnings
        const seller = await SellerModel.findById(sellerId);
        if (!seller) {
            return res.status(404).json({
                success: false,
                message: "Seller not found"
            });
        }
        
        const transferredEarnings = seller.earningsTransferred || 0;
        const pendingEarnings = totalEarnings - transferredEarnings;

        res.status(200).json({
            success: true,
            totalEarnings,
            transferredEarnings,
            pendingEarnings
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// Fetch seller orders
const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.seller.id;

        const orders = await OrderModel.find({ sellerId })
            .populate("productId", "name price image info")
            .populate("userId", "name email");

        res.status(200).json({
            success: true,
            orders
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    addproduct,
    listproduct,
    sellerregister,
    sellerlogin,
    savePayoutDetails,
    getEarnings,
    getSellerOrders
};