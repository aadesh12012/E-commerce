const UserModel = require("../models/User");
const ProductModel = require("../models/product");
const SellerModel = require("../models/sellerlogin");
const OrderModel = require("../models/order");

const getAdmin = async (req, res) => {
    res.json({
        message: "Welcome Admin",
        user: req.user
    });
};

const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 });
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({});
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await UserModel.findByIdAndDelete(id);
        res.json({ success: true, message: "User deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await ProductModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Fetch all sellers
const getSellers = async (req, res) => {
    try {
        const sellers = await SellerModel.find({}, { password: 0 });
        res.json(sellers);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Fetch all orders
const getOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({})
            .populate("productId", "name price image info")
            .populate("userId", "name email")
            .populate("sellerId", "name email");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Trigger manual payout to seller
const payoutSeller = async (req, res) => {
    try {
        const { sellerId, amount } = req.body;
        
        if (!sellerId || !amount) {
            return res.status(400).json({ success: false, message: "Seller ID and amount are required" });
        }

        const seller = await SellerModel.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ success: false, message: "Seller not found" });
        }

        // Increment earningsTransferred
        seller.earningsTransferred = (seller.earningsTransferred || 0) + Number(amount);
        await seller.save();

        res.json({
            success: true,
            message: `Successfully registered payout of ₹${amount} for seller ${seller.name}`,
            seller
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getAdmin,
    getUsers,
    getProducts,
    deleteUser,
    deleteProduct,
    getSellers,
    getOrders,
    payoutSeller
};