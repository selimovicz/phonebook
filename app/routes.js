var Book = require('./models/book');
var User = require('./models/user'); 

var jwt    = require('jsonwebtoken');
module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all books
	app.get('/api/books', function(req, res) {

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
	app.get('/api/books/:id', function(req, res) {
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
	app.post('/api/books', function(req, res) {

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
	app.put('/api/book/:book_id', function(req, res) {
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
	app.delete('/api/book/:book_id', function(req, res) {
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


	// user --------------------------------------------------------------------

	// create dummy user
	app.get('/api/setup', function(req, res) {

	  // create a sample user
	  var user = new User({ 
	    email: 'test@test.com', 
	    password: 'test123'
	  });

	  // save the sample user
	  user.save(function(err) {
	    if (err) throw err;
	    console.log('User saved successfully');
	    res.json({ success: true });
	  });

	});

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	app.post('/api/authenticate', function(req, res) {

	  // find the user
	  User.findOne({
	    name: req.body.email
	  }, function(err, user) {

	    if (err) throw err;
	    if (!user) {
	      res.json({ success: false, message: 'Authentication failed. User not found.' });
	    } else if (user) {
	    	console.log(user);
	      // check if password matches
	      if (user.password != req.body.password) {
	        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign(user, app.get('superSecret'), {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }   

	    }

	  });
	});




	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/app.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};