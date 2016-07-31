var mongoose = require('mongoose');

// setting Book model
module.exports = mongoose.model('Book', {
    firstName: String,
    lastName: String,
    phoneNumber: String
});