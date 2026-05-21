const mongoose = require("../config/mongoose");

const userSchema = mongoose.Schema({    
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "seller"
    },
    upiId: {
        type: String,
        default: ""
    },
    bankAccount: {
        type: String,
        default: ""
    },
    ifscCode: {
        type: String,
        default: ""
    },
    accountHolderName: {
        type: String,
        default: ""
    },
    earningsTransferred: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("SellerLogin", userSchema);