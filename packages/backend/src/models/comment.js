const mongoose = require('mongoose');
const { Schema } = mongoose;

const EditsSchema = new Schema({
    ts: { type: Number, required: true },
    content: { type: String, required: true }, 
})

exports.CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ts: { type: Number, required: true, default: Date.now },
    content: { type: String, required: true },
    edits: [EditsSchema]
})

exports.Comment = mongoose.model("Comment", CommentSchema);
