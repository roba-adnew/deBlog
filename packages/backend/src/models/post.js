const mongoose = require('mongoose');
const { Schema } = mongoose;

const PostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ts: { type: Number, required: true, default: Date.now() },
    title: { type: String, required: true },
    content: { type: String, required: true },
    published: { type: Boolean, required: true, default: false },
    draft: { type: Boolean, required: true, default: true }
})

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;