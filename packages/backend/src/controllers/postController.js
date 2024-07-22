const passport = require('passport')
const asyncHandler = require('express-async-handler')
const debug = require('debug')('deBlog:post')
const Post = require('../models/post')

exports.postsGet = asyncHandler(async (req, res, next) => {
    const posts = await Post
        .find({})
        .populate('user', 'username');
    debug('Retrieving posts');
    res.json({ posts })
})

exports.authorPostsGet = [
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        debug('user', req.user)
        if (!req.user) return res.status(401).json({ message: 'Unauthorized', err })
        debug('User authenticated: %O', req.user)
        next()
    },
    asyncHandler(async (req, res, next) => {
        const posts = await Post
            .find({ user: req.user.id })
            .populate('user', 'username');
        debug(`Retrieving posts for ${req.user.name}`);
        res.json({ posts })
    })
]
exports.postCreationPost = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Unauthorized' })
        req.user = user;
        debug('User authenticated: %O', req.user)
        asyncHandler(async (req, res, next) => {
            const postEntry = req.body;
            debug('Received request body:', postEntry);
            debug('Authenticated user:', req.user);
            const post = new Post(postEntry)
            const result = await post.save()
            debug(`Attempting post: %O`, result)
            return res.status(201).json({ message: 'Post created' })
        })(req, res, next)
    })(req, res, next)
}

exports.postEditPut = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Unauthorized' })
        req.user = user;
        debug('User authenticated: %O', req.user)
        asyncHandler(async (req, res, next) => {
            const postId = req.params.postId
            const editedPost = req.body;
            debug('Received request body:', editedPost);

            const updatedPost = await Post.findByIdAndUpdate(
                postId,
                { $set: editedPost }
            );
            debug('queried post: %O', updatedPost)
            if (!updatedPost) throw new Error('Post not found');

            res.status(201).json({ message: 'Post updated successfully', updatedPost });
        })(req, res, next)
    })(req, res, next)
}

exports.commentsGet = asyncHandler(async (req, res, next) => {
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
    debug('Retrieving comments: %O', post.comments);
    const comments = post.comments;
    res.json({ comments })
})

exports.commentCreationPost = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Unauthorized' })
        asyncHandler(async (req, res, next) => {
            debug('User authenticated: %O', user)
            debug('content', req.body)
            const updatedPost = await Post.findByIdAndUpdate(
                req.params.postId,
                {
                    $push: {
                        comments: {
                            user: user.id,
                            content: req.body.content
                        }
                    }
                },
                { new: true, runValidators: true }
            )
            if (!updatedPost) throw new Error('Post not found')
            debug('Comment added: %O', updatedPost)
            res.status(201).json({ message: 'Comment created' })
        })(req, res, next)
    })(req, res, next)
}

exports.commentEditPut = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ message: 'Unauthorized' })
        req.user = user;
        debug('User authenticated: %O', req.user)
        asyncHandler(async (req, res, next) => {
            const postId = req.params.postId
            const { commentId, newContent } = req.body;
            debug('Received request body:', req.body);

            const post = await Post.findById(postId);
            debug('queried post: %O', post)
            if (!post) throw new Error('Post not found');

            const comment = post.comments.id(commentId);
            debug('subsequent comment: %O', comment)

            const prevTs = comment.ts;
            const prevContent = comment.content;

            if (!comment) throw new Error('Comment not found');

            comment.content = newContent;
            comment.ts = Date.now();
            comment.edits.push({ ts: prevTs, content: prevContent });

            await post.save();
            res
                .status(201)
                .json({ message: 'Comment updated successfully', comment });
        })(req, res, next)
    })(req, res, next)
}