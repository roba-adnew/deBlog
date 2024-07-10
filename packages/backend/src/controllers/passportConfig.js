const passport = require('passport')
const bcrypt = require('bcryptjs')
const debug = require('debug')('deBlog:auth')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require("passport-local").Strategy
const User = require('../models/user')

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
    secretOrKey: process.env.ACCESS_TOKEN_SECRET
    // Not including an issuer or audience given we don't have a domain 
}

passport.use(
    new JwtStrategy(jwtStrategyOpts, (jwt_payload, done) => {
        return done(null, jwt_payload)
    })
)


module.exports = passport