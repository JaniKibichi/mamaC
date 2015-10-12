//get the packages

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');


var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./models/user');

//get the configuration
var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

//use body parser to get info from POST or URL
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//use morgan to log requests to the console
app.use(morgan('dev'));


//set the routes
app.get('/', function(req,res){
	res.send('Hello! The API is at http://localhost:'+port+'/api');
})

//create a setup route
app.get('/setup', function(req, res){

//create a sample user
var nick = new User({
	name: 'Nick Cerminara',
	password: 'password',
	admin: true
});

//save the sample user
nick.save(function(err){
	if (err) throw err;

	console.log('USer saved successfully');
	res.json({ success: true });
});

});

//start the server
app.listen(port);
console.log('So the work happens at http://localhost:'+port);