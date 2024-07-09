const asyncHandler = require('express-async-handler')
const Post = require('../models/post')

// exports.postsGet = asyncHandler(as)

exports.postCreationPost = asyncHandler(async (req, res, next) => {
    try {
        const post = new Post({
            user: req.body.user,
            title: req.body.title,
            content: req.body.content,
        })
        const result = await post.save()
        debug(`Attempting post: %O`, result)
        return res.status(201).json({ message: 'Post created' })
    } catch (error) {
        debug(`Post creation error for: %O`, err)
        return next(error)
    }
})