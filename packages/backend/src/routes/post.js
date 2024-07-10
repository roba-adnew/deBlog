const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

router.get('/', postController.postsGet)

router.post('/', postController.postCreationPost)

router.post('/comment', postController.commentCreationPost)

module.exports = router;