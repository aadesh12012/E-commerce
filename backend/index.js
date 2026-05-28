require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("./config/mongoose");
const { verifyEmailConnection } = require("./config/mailer");

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials: true
}));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const userRouter = require("./routes/userRouter");
const sellerRouter = require("./routes/sellerRoutes");
const cartRouter = require("./routes/cartRouter");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRouter = require("./routes/adminRouter");

app.use("/",adminRouter);
app.use("/",paymentRoutes);
app.use("/", userRouter);
app.use("/", sellerRouter);
app.use("/", cartRouter);


app.listen(3000, () => {
    console.log("Server started on port 3000");
    verifyEmailConnection();
});