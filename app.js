const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connection to database
mongoose.connect(config.database);

// Verify database connection is working
mongoose.connection.on('connected', () => {
	console.log('Connected to database' + config.database);
});
mongoose.connection.on('error', (err) => {
	console.log('Database error: ' + err);
});

const app = express();

// We store the routes for 'users' in a different file
const users = require('./routes/users');

// Port
const port = 3000;

// We use cors as middleware, even though it could be done w/ Express
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport

app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/users', users);

// Index route
app.get('/', (req, res) => {
	res.send('Invalid endpoint');
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});
// Start server

app.listen(port, () => {
	console.log('Server started on port ' + port);
});
