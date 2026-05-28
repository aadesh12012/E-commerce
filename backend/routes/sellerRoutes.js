const express = require("express");
const router = express.Router();
const { isSeller } = require("../middlewares/authMiddleware");
const upload = require("../config/multer");
const {
    addproduct,
    listproduct,
    sendSellerRegisterOtp,
    sellerregister,
    sellerlogin,
    savePayoutDetails,
    getEarnings,
    getSellerOrders,
    getSellerProducts,
    deleteSellerProduct
} = require("../controller/sellerController");

router.post("/addproduct", isSeller, upload.single("productImage"), addproduct);
router.get("/products", listproduct);
router.post("/seller/register/send-otp", sendSellerRegisterOtp);
router.post("/seller/register", upload.single("businessLogo"), sellerregister);
router.post("/sellerlogin", sellerlogin);

router.post("/seller/payout-details", isSeller, savePayoutDetails);
router.get("/seller/earnings", isSeller, getEarnings);
router.get("/seller/orders", isSeller, getSellerOrders);
router.get("/seller/products", isSeller, getSellerProducts);
router.delete("/seller/product/:id", isSeller, deleteSellerProduct);

module.exports = router;