require('dotenv').config({ path: '../.env' })
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const debug = require('debug')('deBlog:auth')
const passport = require('passport')
const User = require('../models/user')
const RefreshToken = require('../models/refreshToken');

exports.accountCreationPost = asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
            debug(`password hashing failed for ${req.body.username}`)
            return next(err)
        }
        try {
            const user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                hashedPassword: hashedPassword,
                author: req.body.author,
            })
            const result = await user.save()
            debug(`Setting up account for ${req.body.username}: %O`, result)
            return res.status(201).json({ message: 'Account created' })

        } catch (err) {
            debug(`Account creation error for ${req.body.username}: %O`, err)
            return next(err)
        }
    })
})

exports.loginPost = [
    passport.authenticate("jwt", { session: false }),
    asyncHandler(async (req, res, next) => {
        try {
            const user = {
                id: req.user.id,
                name: req.user.name,
                author: req.user.author
            }
            const accessToken = generateAccessToken(user)
            const refreshToken = jwt.sign(
                user,
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            )
            const dbRefreshToken = new RefreshToken({
                token: refreshToken,
                userId: user.id
            })
            const result = await dbRefreshToken.save();
            debug(`DB Refresh Token save results: %O`, result)
            res.json({ accessToken: accessToken, refreshToken: refreshToken })
        } catch (err) {
            debug(`Error saving refresh token: %O`, err)
            next(err)
        }
    })
]

exports.refreshToken = asyncHandler(async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) return res.sendStatus(401);
        debug('refresh token extracted')

        const dbToken = await RefreshToken.findOne({ token: refreshToken })
        if (!dbToken) return res.sendStatus(403);
        debug('refresh token identified')

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, user) => {
                const userDetails = {
                    id: user.id,
                    name: user.name,
                    author: user.author
                }
                if (err) return res.sendStatus(403);
                const accessToken = generateAccessToken(userDetails)
                res.json({ accessToken: accessToken })
            }
        )
    } catch (err) {
        debug('Error refreshing token: %O', err)
    }
})

exports.checkGet = [
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        res.json({ message: 'This is a protected route', user: req.user });
    }
]
exports.logoutPost = asyncHandler(async (req, res) => {
    const refreshToken = req.body.token;
    try {
        const query = { token: refreshToken }
        debug(query)
        const deleted = await RefreshToken.findOneAndDelete(query).exec()
        if (!deleted) {
            debug('Deleted reads', deleted)
            return res.status(404).json({ message: 'Refresh token unavailable' })
        }
        res.sendStatus(204)
    } catch (err) {
        debug('Came across the following error logging out: %O', err)
    }
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
}
