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
    new JwtStrategy(jwtStrategyOpts, async (jwt_payload, done) => {
        debug('jwt payload', jwt_payload)
        try {
            const user = await User.findById(jwt_payload.id)
            if (!user) return done(
                null, false, {message: 'user somehow not in db'}
            )
            return done(null, user)
        }
        catch (err) {
            debug('error trying to query user on authenitcatoin')
            return done(err, false)
        }
    })
)

module.exports = passport