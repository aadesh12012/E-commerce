const mongoose = require("../config/mongoose");

const otpSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        purpose: {
            type: String,
            required: true,
            enum: ["user-register", "seller-register"],
        },
        otpHash: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

otpSchema.index({ email: 1, purpose: 1 }, { unique: true });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports =
    mongoose.models.Otp || mongoose.model("Otp", otpSchema);
