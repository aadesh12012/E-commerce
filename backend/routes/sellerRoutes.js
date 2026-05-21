const express = require("express");
const router = express.Router();
const { isSeller } = require("../middlewares/authMiddleware");
const {
    addproduct,
    listproduct,
    sellerregister,
    sellerlogin,
    savePayoutDetails,
    getEarnings,
    getSellerOrders
} = require("../controller/sellerController");

router.post("/addproduct", isSeller, addproduct);
router.get("/products", listproduct);
router.post("/seller/register", sellerregister);
router.post("/sellerlogin", sellerlogin);

router.post("/seller/payout-details", isSeller, savePayoutDetails);
router.get("/seller/earnings", isSeller, getEarnings);
router.get("/seller/orders", isSeller, getSellerOrders);

module.exports = router;