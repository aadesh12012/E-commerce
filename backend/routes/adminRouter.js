const express = require("express");
const router = express.Router();

const { isAdmin } = require("../middlewares/authMiddleware");

const {
    getUsers,
    deleteUser,
    getProducts,
    deleteProduct,
    getSellers,
    getOrders,
    payoutSeller
} = require("../controller/adminController");

router.get("/admin/users", isAdmin, getUsers);
router.delete("/admin/user/:id", isAdmin, deleteUser);
router.get("/admin/products", isAdmin, getProducts);
router.delete("/admin/product/:id", isAdmin, deleteProduct);

router.get("/admin/sellers", isAdmin, getSellers);
router.get("/admin/orders", isAdmin, getOrders);
router.post("/admin/payout-seller", isAdmin, payoutSeller);

module.exports = router;