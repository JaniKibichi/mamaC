//get the packages

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var config = require('./config');

//connect to the DB
mongoose.connect(config.database);

var jwt = require('jsonwebtoken');

var User = require('./models/user');

//get the configuration
var port = process.env.PORT || 8080;

app.set('superSecret', config.secret);

//use body parser to get info from POST or URL
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//use morgan to log requests to the console
app.use(morgan('dev'));

//API Routes
var apiRouting = require('./app/routes/api')(app, express);

//apply routes to our application with refix /api
app.use('/api', apiRouting);

app.get('*', function(req,res){
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

//start the server
app.listen(config.port);
console.log('So the work happens at http://localhost:'+port);