const mongoose = require("./backend/config/mongoose");
const User = require("./backend/models/User");
const Product = require("./backend/models/product");

async function checkData() {
    try {
        const users = await User.find({});
        console.log("Users:", users.length);
        const products = await Product.find({});
        console.log("Products:", products.length);
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.connection.close();
    }
}
checkData();
