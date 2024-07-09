const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

// router.get('/signup', authController.accountCreationPost)

router.post('/posts', postController.postCreationPost)

// router.get('/login', authController.loginGet)

module.exports = router;