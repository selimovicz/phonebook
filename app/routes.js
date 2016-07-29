var Book = require('./models/book');
var User = require('./models/user'); 

var jwt    = require('jsonwebtoken');
var express  = require('express');

module.exports = function(app) {

	var apiRoutes = express.Router(); 

	// route to authenticate a user
	apiRoutes.post('/authenticate', function(req, res) {

	  // find the user
	  User.findOne({
	    email: req.body.email
	  }, function(err, user) {

	    if (err) throw err;
	    if (!user) {
	      res.status(401).send({ success: false, message: 'Authentication failed. User not found.', cause: 'email' });
	    } else if (user) {
	      // check if password matches
	      if (user.password != req.body.password) {
	        res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.', cause: 'password'});
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign(user, app.get('superSecret'), {
	          expiresIn: 1440*3600 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Here is your token!',
	          token: token
	        });
	      }   

	    }

	  });
	});

	// create dummy user
	apiRoutes.get('/setup', function(req, res) {

	  // create a sample user
	  var user = new User({ 
	    email: 'test@test.com', 
	    password: 'test123'
	  });

	  // save the sample user
	  user.save(function(err) {
	    if (err) throw err;
	    res.json({ success: true });
	  });

	});

	apiRoutes.use(function(req, res, next) {

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
	      if (err) {
	        return res.json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;    
	        next();
	      }
	    });

	  } else {

	    // if there is no token
	    // return an error
	    return res.status(403).send({ 
	        success: false, 
	        message: 'No token provided.' 
	    });
	    
	  }
	});

	// api ---------------------------------------------------------------------
	// get all books
	apiRoutes.get('/books', function(req, res) {

		// use mongoose to get all locations in the database
		Book.find(function(err, books) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err){
				res.send(err);
			}

			res.json(books); // return all books in JSON format
		});
	});


	// get single location
	apiRoutes.get('/books/:id', function(req, res) {
		// use mongoose to get single book in the database
		Book.find({
	 		_id : req.params.id
	 	}, function(err, books) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err);
			res.json(books); // return all books in JSON format
		});
	});

	// create entry and send back all books after creation
	apiRoutes.post('/books', function(req, res) {

		// create a book, information comes from AJAX request from Angular
		Book.create({
			firstName : req.body.firstName,
			lastName : req.body.lastName,
			phoneNumber : req.body.phoneNumber,
		}, function(err, books) {
			if (err){
				res.send(err);
			}else{
				// get and return all the books after you create another
				Book.find(function(err, books) {
					if (err)
						res.send(err)
					res.json(books);
				});
			}
		});

	});

	// update book
	apiRoutes.put('/book/:book_id', function(req, res) {
	    Book.update({ _id: req.params.book_id }, req.body, function (err, books) {
	        if (err){
				res.send(err);
			}else{
				// get and return all the books after you create another
				Book.find(function(err, books) {
					if (err)
						res.send(err)
					res.json(books);
				});
			}
	    });
	});

	// delete book
	apiRoutes.delete('/book/:book_id', function(req, res) {
		Book.remove({
			_id : req.params.book_id
		}, function(err, books) {
			if (err)
				res.send(err);

			// get and return all the books after you deleted a books
			Book.find(function(err, books) {
				if (err)
					res.send(err)
				res.json(books);
			});
		});
	});

	app.use('/api', apiRoutes);


	// apiRouteslication -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/app.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};