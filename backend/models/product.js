const mongoose = require("../config/mongoose");

const productSchema = mongoose.Schema({    
    name: String,
    price: String,
    image: String,
    info: String,
    quantity: {
        type: Number,
        default: 0,
        min: 0
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SellerLogin"
    }

});

module.exports = mongoose.model("seller", productSchema);