const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

// router.get('/signup', authController.accountCreationPost)

router.post('/signup', authController.accountCreationPost)

// router.get('/login', authController.loginGet)

router.post('/login', authController.loginPost)

router.post('/refresh-token', authController.refreshToken)

router.get('/protected', authController.checkGet)

router.delete('/logout', authController.logoutPost)

// router.get('/logout', authController.logoutGet)

module.exports = router