const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

router.get('/posts', postController.postsGet)

router.post('/posts', postController.postCreationPost)

module.exports = router;