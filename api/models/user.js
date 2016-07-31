var mongoose = require('mongoose');

// setting User model
module.exports = mongoose.model('User', {
    email: String,
    password: String
});