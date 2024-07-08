const mongoose = require('mongoose');
const { Schema } = mongoose;

const sevenDays = 7 * 24 * 60 * 60 * 1000;

const RefreshTokenSchema = new Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Number, required: true, default: Date.now },
    expiresAt: { 
        type: Date, 
        required: true,
        default: () => new Date(Date.now() + sevenDays) 
    },
    revoked: { type: Boolean, default: false }
})

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema)

module.exports = RefreshToken;