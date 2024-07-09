const mongoose = require('mongoose')
const { Schema } = mongoose

const EditsSchema = new Schema({
    ts: { type: Number, required: true },
    content: { type: String, required: true }, 
})

const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ts: { type: Number, required: true, default: Date.now },
    content: { type: String, required: true },
    edits: [EditsSchema]
})

exports.CommentSchema = CommentSchema
exports.Comment = mongoose.model("Comment", CommentSchema)