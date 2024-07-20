const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

router.get('/', postController.postsGet)

router.post('/', postController.postCreationPost)

router.get('/author', postController.authorPostsGet)

router.get('/:postId/comments', postController.commentsGet)

router.post('/:postId/comments', postController.commentCreationPost)

router.put('/:postId/comments/edit', postController.commentEditPut)

module.exports = router;