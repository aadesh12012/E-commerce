const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/order");
const User = require("../models/User");

const razorpay = new Razorpay({
    key_id: process.env.KEY_ID || "rzp_test_xxxxxxxxx",
    key_secret: process.env.KEY_SECRET || "xxxxxxxxxxxxx"
});

const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: Math.round(amount * 100), // Razorpay accepts in paise
            currency: "INR"
        };
        const order = await razorpay.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to create order"
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            cartItems,
            userId
        } = req.body;

        // Verify the signature
        const key_secret = process.env.KEY_SECRET || "xxxxxxxxxxxxx";
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", key_secret)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Signature verification failed"
            });
        }

        // Payment is verified! Now save orders to MongoDB
        const savedOrders = [];
        for (const item of cartItems) {
            // Note: item contains: productId, sellerId, price, quantity
            // Check if sellerId exists, else fall back to item.productId.sellerId
            const productId = item.productId._id || item.productId;
            const sellerId = item.sellerId || (item.productId && item.productId.sellerId);
            const price = item.price || (item.productId && item.productId.price) || 0;
            const quantity = item.quantity || 1;
            const orderAmount = Number(price) * Number(quantity);
            
            if (!sellerId) {
                console.log("Warning: Product has no sellerId, skipping order creation or using fallback admin sellerId");
            }

            const newOrder = await Order.create({
                userId: userId,
                productId: productId,
                sellerId: sellerId || "000000000000000000000000", // Fallback if no sellerId
                amount: orderAmount,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                paymentStatus: "successful"
            });
            savedOrders.push(newOrder);
        }

        // Clear the user's cart
        const user = await User.findById(userId);
        if (user) {
            user.cart = [];
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: "Payment verified and order saved successfully!",
            orders: savedOrders
        });

    } catch (error) {
        console.log("Error in verifyPayment:", error);
        res.status(500).json({
            success: false,
            message: "Verification failed",
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    verifyPayment
};