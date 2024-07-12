const passport = require('passport')
const asyncHandler = require('express-async-handler')
const debug = require('debug')('deBlog:post')
const Post = require('../models/post')

exports.postsGet = asyncHandler(async (req, res, next) => {
    try {
        const posts = await Post
            .find({})
            .populate('user', 'username');
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
        if (!user) return res.status(401).json({ message: 'Unauthorized' })
        req.user = user;
        debug('User authenticed: %O', req.user)
        asyncHandler(async (req, res, next) => {
            try {
                debug('Received request body:', req.body);
                debug('Authenticated user:', req.user);
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
    })(req, res, next)
}

exports.commentsGet = asyncHandler(async (req, res, next) => {
    try {
        const postId = req.params.postId;
        debug(`Attempting to pull comments for ${postId}`)
        const post = await Post
            .findById(postId)
            .populate({
                path: 'comments',
                select: 'user ts content',
                populate: {
                    path: 'user',
                    select: 'username'
                }
            })
        debug('Retrieving comments');
        const comments = post.comments;
        res.json({ comments })
    } catch (err) {
        debug('Error retrieving posts: %O', err)
        next(err)
    }
})

exports.commentCreationPost = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Unauthorized' })
        req.user = user;
        debug('User authenticated: %O', req.user)
        asyncHandler(async (req, res, next) => {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.postId,
                    {
                        $push: {
                            comments: {
                                user: req.user.id,
                                content: req.body.content
                            }
                        }
                    },
                    { new: true, runValidators: true }
                )
                if (!updatedPost) throw new Error('Post not found')
                debug('Comment added: %O', updatedPost)
                res.status(201).json({ message: 'Comment created' })
                return updatedPost

            } catch (err) {
                debug(`Comment post  error: %O`, err)
                return next(err)
            }
        })(req, res, next)
    })(req, res, next)
}
