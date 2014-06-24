/**
 * Mongoose model for an incoming text-message
 */

var mongoose = require('mongoose');

var Text = new mongoose.Schema({
    "timestamp": {type: Date, default: Date.now},
    "number": Number,
    "message": String
});

module.exports = mongoose.model('Text', Text);