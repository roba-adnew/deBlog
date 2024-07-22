const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

// get reader api calls
router.get('/', postController.postsGet)

router.get('/:postId/comments', postController.commentsGet)

// author api calls
router.get('/author', postController.authorPostsGet)

router.post('/author', postController.postCreationPost)

router.put('/author/:postId/edit', postController.postEditPut)

// reader editing api calls
router.post('/:postId/comments', postController.commentCreationPost)

router.put('/:postId/comments/edit', postController.commentEditPut)

module.exports = router;