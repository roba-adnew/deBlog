const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

router.get('/', postController.postsGet)

router.post('/', postController.postCreationPost)

router.get('/:postId/comments', postController.commentsGet)

router.post('/:postId/comments', postController.commentCreationPost)

module.exports = router;