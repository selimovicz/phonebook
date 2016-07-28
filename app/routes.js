var Book = require('./models/book');

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

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/app.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};