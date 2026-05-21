const express = require("express");
const router = express.Router();
const CreateUser = require("../controller/userControler").createUser;
const LoginUser = require("../controller/userControler").loginUser;
const { getAdmin } = require("../controller/adminController");
const { isAdmin } = require("../middlewares/authMiddleware");

router.post("/create", CreateUser);

router.post("/login", LoginUser);

router.get("/admin", isAdmin, getAdmin);

module.exports = router;
