const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true},
    hashedPassword: { type: String, required: true},
    start: { type: Number, required: true, default: Date.now }, // ms
    author: { type: Boolean, required: true }
})

UserSchema.virtual("fullName").get(function() {
    fullName = `${this.firstName} ${this.lastName}`;
    return fullName
})

UserSchema.virtual('url').get(function() {
    return `/users/${this._id}`
})

const User = mongoose.model("User", UserSchema);

module.exports = User;