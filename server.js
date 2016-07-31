// set up ======================================================================
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var port = process.env.PORT || 8080;
var config = require('./config/database');

// configuration ===============================================================

// establish connection with database
mongoose.connect(config.url);

// setting secret key for token
app.set('superSecret', config.secret);

//log every request to the console
app.use(morgan('dev'));

// serve static files
app.use(express.static(__dirname + '/public')); 

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({'extended':'true'}));

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// use PUT or DELETE in places where the client doesn't support it.
app.use(methodOverride());

 // load the routes
require('./api/routes')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);