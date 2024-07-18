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
    passport.authenticate("local", { session: false }),
    asyncHandler(async (req, res, next) => {
        try {
            debug('authenticated user: %O', req.user)
            const user = {
                id: req.user.id,
                name: req.user.username,
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
            res.json({ user: req.user, accessToken })
        } catch (err) {
            debug(`Error saving refresh token: %O`, err)
            res.status(401).json({ message: 'Unauthorized' });
        }
    })
]

exports.refreshToken = asyncHandler(async (req, res) => {
    try {
        if (!req.body.user) return res.sendStatus(401);
        const user = req.body.user;
        debug('user: %', user)
        const dbTokenEntry = await RefreshToken.findOne({ userId: user._id })
        if (!dbTokenEntry) return res.sendStatus(403);
        debug('refresh token extracted: %O', dbTokenEntry)

        const expirationDate = new Date(dbTokenEntry.expiresAt).getTime();

        if (expirationDate < Date.now()) {
            debug('Current refresh token is expired')
            const query = { userId: user._id }
            const deleteResult = await RefreshToken.deleteMany(query)
            debug('Deleting refresh token on access token refresh %O:'
                , deleteResult)
            
            const userDetails = {
                id: user._id,
                name: user.name,
                author: user.author
            }
            const accessToken = generateAccessToken(userDetails)
            const refreshToken = jwt.sign(
                userDetails,
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            )
            const dbRefreshToken = new RefreshToken({
                token: refreshToken,
                userId: user._id
            })
            const result = await dbRefreshToken.save();
            return res.json({ accessToken: accessToken })
        }
        
        const refreshToken = dbTokenEntry.token;
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
                if (err) {
                    return res
                        .sendStatus(403)
                        .json({ message: 'Error verifying refresh token' })
                }
                const accessToken = generateAccessToken(userDetails)
                return res.json(accessToken)
            }
        )
    } catch (err) {
        debug('Error refreshing token: %O', err)
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
})

exports.logoutPost = asyncHandler(async (req, res) => {
    const userId = req.body.userId;
    try {
        const query = { userId: userId }
        debug(query)
        const result = await RefreshToken.deleteMany(query)
        if (result.deletedCount === 0) {
            debug('Deleted reads: %O', result)
            return res
                .status(404)
                .json({ message: 'Refresh token unavailable' })
        }
        result.deletedCount > 0 
            && debug('Multiple refresh tokens were stored: %O', result)
        res.
            status(200)
            .json({ message: 'Logged out successfully', result: result })
    } catch (err) {
        debug('Came across the following error logging out: %O', err)
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
})

function generateAccessToken(user) {
    const oneHourMS = 1 * 60 * 60 * 1000;
    const token = jwt.sign(
        user, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: '1h' }
    )
    return {
        token,
        expiresAt: Date.now() + oneHourMS
    }
}