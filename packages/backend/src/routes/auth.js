const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/signup', authController.accountCreationPost)

router.post('/login', authController.loginPost)

router.post('/refresh-token', authController.refreshToken)

router.delete('/logout', authController.logoutPost)

module.exports = router