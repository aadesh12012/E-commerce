const express = require("express");
const router = express.Router();
const {addtocart, listcart,removeitem,carttotal} = require("../controller/cartController");
const { isUser } = require("../middlewares/authMiddleware");

router.post("/addtocart", isUser, addtocart);
router.get("/listcart/:userId", isUser, listcart);
router.post("/removeitem", isUser, removeitem);
router.get("/cart-total/:userId", carttotal);
module.exports = router;
