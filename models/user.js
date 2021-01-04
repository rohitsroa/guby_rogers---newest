var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
// User Schema
var UserSchema = mongoose.Schema({
   
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number
    },
    date: {
        type: String,
    },
});
var User = module.exports = mongoose.model('User', UserSchema);