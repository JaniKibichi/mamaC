module.exports = function(app, express){
//API ROUTES
//get an instance of the router for the api
var apiRoutes = express.Router();

//Route authenticate a user POST http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res){
	//find the user
	User.findOne({
		name: req.body.name
	}, function(err, user){
		if(err) throw err;

		if(!user){
			res.json({success: false, message: 'Authentication failed. User not found.'})
		}else if (user){
			//check if the user matches
			var validPassword = user.comparePassword(req.body.password)
			if(!validPassword){
				res.json({ success: false, message: 'Authentication failed. Wrong password.'})
			}else{
				//if user is found and the password is right, create token
				var token = jwt.sign(user, app.get('superSecret'),{ expiresIn: 86400 });

				//return the information bearing the token
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		}
	});
});

//Route middleware to verify a token
apiRoutes.use(function(req, res, next){

	//logging
	console.log('Someone just showed up to your app!');

	//check the header or url or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

//decode token
if(token){
	//if there is a token, decode it
	jwt.verify(token, app.get('superSecret'), function(err, decoded){
		if(err){
			return res.json({success: false, message: 'Failed to authenticate token.'})
		}else{
		//if everything is good, save request for use in other routes
		req.decoded = decoded;
		next();
		}
	});
	}else{
		//if there is no token, return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});

//get a random message
apiRoutes.get('/', function(req, res){
	res.json({message: 'Welcome to Mamas Connect API on earth!'})
});

//Routes that end in /users
apiRoutes.route('/users')
.post(function(req, res){
	//create a new instance of a user
	var user = new User;
	user.name = req.body.name;
	user.username = req.body.username;
	user.password = req.body.password;
	user.save(function(err){
		//If there is an error
		if(err) res.send(err);
		//Else return message
		res.json({ message: 'User created!'})

	});
 
})
.get(function(req, res){
	User.find(function(err, users){
		if (err) res.send(err);

		//else return users
		res.json(users);
	});
});

//Routes that end in /users/:user_id
api.Routes.route('/users/:user_id')
//Get the user with that ID
.get(function(req, res){
	User.findById(req.params.user_id, function(err, user){
		if(err) res.send(err);

		//else return the user
		res.json(user);
	});
})
//update user with id
.put(function(req, res){
	User.findById(req.params.user_id, function(err, user){
		if(err) res.send(err);

		//else set the user information if it exists in the request
		if (req.body.name) user.name = req.body.name;
		if (req.body.username) user.username = req.body.username;
		if (req.body.password) user.password = req.body.password;

		//Save the users new details
		user.save(function(err){
			if (err) res.send(err);

			//return a message
			res.json({ message: 'User updated!'});
		});

	});
})
//Delete user with this ID
.delete(function(req, res){
	User.remove({ _id: req.params.user_id}, function(err, user){
		if (err) res.send(err);
		//else
		res.json({ message: 'Successfully deleted.'});
	})
})

return apiRoutes;

};