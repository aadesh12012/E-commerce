const express = require("express");
const router = express.Router();
const { isUser } = require("../middlewares/authMiddleware");
const {
    createOrder,
    verifyPayment
} = require("../controller/paymentController");

router.post("/create-order", isUser, createOrder);
router.post("/verify-payment", isUser, verifyPayment);

module.exports = router;