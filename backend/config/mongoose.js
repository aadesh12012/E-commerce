const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL || "mongodb://127.0.0.1:27017/authproject")
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
    });

module.exports = mongoose;