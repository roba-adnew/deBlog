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

exports.commentCreationPost = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Unauthorized' })
        req.user = user;
        debug('User authenticated: %O', req.user)
        asyncHandler(async (req, res, next) => {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.body.postId,
                    {
                        $push: {
                            comment: {
                                user: req.body.commentUserId,
                                content: req.body.content
                            }
                        }
                    },
                    { new: true, runValidators: true }
                )
                if (!updatedPost) throw new Error('Post not found')
                debug('Comment added')
                res.status(201).json({ message: 'Comment created' })
                return updatedPost

            } catch (err) {
                debug(`Comment post  error: %O`, err)
                return next(err)
            }
        })(req, res, next)
    })(req, res, next)
}


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



// [
//     authenticateJWT,
//     asyncHandler(async (req, res, next) => {
//         try {
//             debug('Received request body:', req.body);
//             debug('Authenticated user:', req.user);
//             const post = new Post({
//                 user: req.user.id,
//                 title: req.body.title,
//                 content: req.body.content,
//             })
//             const result = await post.save()
//             debug(`Attempting post: %O`, result)
//             return res.status(201).json({ message: 'Post created' })
//         } catch (err) {
//             debug(`Post creation err for: %O`, err)
//             return next(err)
//         }
//     })
// ]