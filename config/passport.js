const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports = function(passport) {
	let opts = {};
	// There are different ways to pass token back and forth
	// We are using fromAuthHeader to to extract those info
	opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	opts.secretOrKey = config.secret;
	passport.use(new JwtStrategy(opts, (jwt_payload, done) => {

		//console.log('payload received: ', jwt_payload);
		User.getUserById(jwt_payload._doc._id, (err, user) => {
			if(err) {
				return done(err, false);
			}
			if(user) {
				return done(null, user);
			}
			else {
				return done(null, false);
			}
		});
	}));
}
