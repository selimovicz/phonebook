var mongoose = require('mongoose');

module.exports = mongoose.model('Book', {
    firstName: String,
    lastName: String,
    phoneNumber: String
});