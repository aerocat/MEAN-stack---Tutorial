const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
// Importing User Schema (and methods)
const User = require('../models/user');

// Register
router.post('/register', (req, res, next) => {

	// We store all the stuff from the form into a json object
	// Which we pass to the function addUser to store data in db
	let newUser = new User({
		name: req.body.name,
		email: req.body.email,
		username: req.body.username,
		password: req.body.password
	});

	User.addUser(newUser, (err, user) => {
		if(err) {
			res.json({success: false, msg: 'Failed to register user'});
		} else {
			res.json({success: true, msg: 'Successfully created user'});
		}
	});
});

// Authenticate
router.post('/authenticate', (req, res) => {
	// Get username and passport that are being submitted
	const username = req.body.username;
	const password = req.body.password;

	User.getUserByUsername(username, (err, user) => {
		if(err) throw err;
		if(!user) {
			return res.json({success: false, msg: 'User not found'});
		}
		// compare password submitted with stored hash
		User.comparePassword(password, user.password, (err, isMatch) => {
			if(err) throw err;
			if(isMatch) {
				// This is were the authentication token is created
				// We define our custom options below
				const token = jwt.sign(user, config.secret, {
					expiresIn: 604800 // 1 Week
				});

				// Response to front-end: custom object
				// This is important because we are not sending back
				//  a dump of what's in the database
				res.json({
					success: true,
					token: 'JWT ' + token,
					user: {
						id: user._id,
						name: user.name,
						username: user.username,
						email: user.email
					}					
				});
			}
			else {
				return res.json({success: false, msg: 'Wrong password'});
			}
		});
	});
});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
	res.json({user: req.user});
});

module.exports = router;