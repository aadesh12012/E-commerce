const mongoose = require("../config/mongoose");

const productSchema = mongoose.Schema({    
    name: String,
    price: String,
    image: String,
    info: String,
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SellerLogin"
    }

});

module.exports = mongoose.model("seller", productSchema);