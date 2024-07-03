require('dotenv').config({ path: '../.env' })
// console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET)
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const debug = require('debug')('deBlog:auth')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require("passport-local").Strategy
const User = require('../models/user')
const RefreshToken = require('../models/refreshToken');

exports.accountCreationPost = [
    asyncHandler(async (req, res, next) => {
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
                debug(`Attempted account creation result for ${req.body.username}: %O`, result)
                return res.status(201).json({ message: 'Account created' })

            } catch (err) {
                debug(`Account creation error for ${req.body.username}: %O`, err)
                return next(err)
            }
        })
    })
]

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username })
            if (!user) {
                debug(`${username} not found`)
                return done(null, false, { message: "Incorrect username" })
            }
            const match = await bcrypt.compare(password, user.hashedPassword)
            if (!match) {
                debug('Incorrect password')
                return done(null, false, { message: "Incorrect password" })
            }
            return done(null, user)
        } catch (err) {
            return done(err, false)
        }
    })
)



const jwtStrategyOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET //|| 'temp_secret_for_testing'
    // Not including an issuer or audience given we don't have a domain 
}

passport.use(
    new JwtStrategy(jwtStrategyOpts, (jwt_payload, done) => {
        return done(null, jwt_payload)
    })
)

exports.loginPost = [
    passport.authenticate("local", { session: false }),
    asyncHandler(async (req, res, next) => {
        try {
            const user = { name: req.body.username };
            const accessToken = generateAccessToken(user)
            const refreshToken = jwt.sign(
                user,
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            )
            const dbRefreshToken = new RefreshToken({
                token: refreshToken,
                user: req.body.id,
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
        debug('token extracted')

        if (!refreshToken) return res.sendStatus(401);

        const dbToken = await RefreshToken.findOne({ token: refreshToken })
        if (!dbToken) return res.sendStatus(403);

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, user) => {
                if (err) return res.sendStatus(403);
                const accessToken = generateAccessToken({ name: user.name})
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
    const  refreshToken  = req.body.token;
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
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
}