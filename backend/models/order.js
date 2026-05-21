const mongoose = require("../config/mongoose");

const orderSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seller", // Note: product schema exports model named "seller"
        required: true
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SellerLogin",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "successful", "failed"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
