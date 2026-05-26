const express = require("express");
const router = express.Router();
const {
    sendRegisterOtp,
    createUser,
    loginUser,
} = require("../controller/userControler");
const { getAdmin } = require("../controller/adminController");
const { isAdmin } = require("../middlewares/authMiddleware");

router.post("/register/send-otp", sendRegisterOtp);
router.post("/create", createUser);
router.post("/login", loginUser);

router.get("/admin", isAdmin, getAdmin);

module.exports = router;
