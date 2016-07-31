var Book = require('./models/book');
var User = require('./models/user'); 
var jwt      = require('jsonwebtoken');
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

	      // if user/email not found - throw error
	      res.status(401).send({ success: false, message: 'Authentication failed. Email not found.', cause: 'email' });
	    } else if (user) {

	      // check if password matches
	      if (user.password != req.body.password) {
	        res.status(401).send({ success: false, message: 'Authentication failed. Wrong password.', cause: 'password'});
	      } else {

	        // if email and pass - create token
	        var token = jwt.sign(user, app.get('superSecret'), {
	          expiresIn: 1440*3600 // expires in 24 hours
	        });

	        // return token with success flag - true
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
	// $ curl -H "Accept: application/json" -H "Content-type: application/json" -X POST -d '{"email": "test01@test.com", "password": "test"}' http://localhost:8080/api/setup
	apiRoutes.post('/setup', function(req, res) {

	  // create a sample user
	  var user = new User({ 
	    email: req.body.email,
	    password: req.body.password,
	  });

	  // save the sample user
	  user.save(function(err) {
	    if (err) throw err;
	    res.json({ success: true });
	  });

	});

	apiRoutes.use(function(req, res, next) {

	  // check header for or body/url paramaters for header
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  if (token) {

	    // verify token and decode
	    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
	      if (err) {
	        return res.json({ success: false, message: 'Failed to authenticate token.' });    
	      } else {
	      	// save to request for use in other routes
	        req.decoded = decoded;
	        next();
	      }
	    });

	  } else {

	    // no token - error
	    return res.status(403).send({ 
	        success: false, 
	        message: 'No token provided.' 
	    });
	    
	  }
	});

	// get all books
	apiRoutes.get('/books', function(req, res) {

		// use mongoose to get all books in the database
		Book.find(function(err, books) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err){
				res.send(err);
			}

			res.json(books); // return all books in JSON format
		});
	});


	// get single book
	apiRoutes.get('/books/:id', function(req, res) {
		// use mongoose to get single book in the database
		Book.find({
	 		_id : req.params.id
	 	}, function(err, books) {

			// if there is an error retrieving, send the error
			if (err)
				res.send(err);
			res.json(books); // return all books in JSON format
		});
	});

	// create entry and send back all books after creation
	apiRoutes.post('/books', function(req, res) {

		// create a book using body parameters
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

	// load frontend on every *
	app.get('*', function(req, res) {
		res.sendfile('./public/app.html');
	});
};