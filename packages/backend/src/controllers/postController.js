const passport = require('passport')
const asyncHandler = require('express-async-handler')
const Post = require('../models/post')
const debug = require('debug')('deBlog:post')

exports.postsGet = asyncHandler(async (req, res, next) => {
    try {
        const posts = await Post.find({});
        debug('Retrieving posts');
        res.json({ posts })
    } catch (err) {
        debug('Error retrieving posts: %O', err)
        next(err)
    }
})

exports.postCreationPost = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Unauthorized' });
        req.user = user;
        debug('User object post authentication: %O', req.user)
        asyncHandler(async (req, res, next) => {
            try {
                const post = new Post({
                    user: req.user.id,
                    title: req.body.title,
                    content: req.body.content,
                })
                const result = await post.save()
                debug(`Attempting post: %O`, result)
                return res.status(201).json({ message: 'Post created' })
            } catch (err) {
                debug(`Post creation err for: %O`, err)
                return next(err)
            }
        })(req, res, next)
    })(req, res, next);
}